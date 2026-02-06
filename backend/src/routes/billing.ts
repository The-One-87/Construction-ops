import { Router } from "express";
import { authenticateToken, type AuthenticatedRequest } from "../middleware/auth";
import { requireStripe } from "../services/stripe";
import { db } from "../db/client";
import { subscriptions } from "../db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

export const router = Router();

/**
 * Creates a Stripe Checkout session for the authenticated client's subscription.
 * Requires STRIPE_SECRET_KEY + STRIPE_PRICE_ID.
 */
router.post("/checkout", authenticateToken, async (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  if (!user.clientId) return res.status(400).json({ error: "Client user required" });

  const stripe = requireStripe();
  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) return res.status(500).json({ error: "Stripe price not configured" });

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${req.headers.origin}/settings?billing=success`,
    cancel_url: `${req.headers.origin}/settings?billing=cancel`,
    metadata: { clientId: user.clientId },
  });

  res.json({ url: session.url });
});

/**
 * Stripe webhook — set BACKEND public URL + STRIPE_WEBHOOK_SECRET in production.
 */
router.post("/webhook", async (req, res) => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return res.status(501).json({ error: "Webhook not configured" });

  const stripe = requireStripe();
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;
  try {
    // raw body requirement handled in server.ts for this route
    event = stripe.webhooks.constructEvent((req as any).rawBody, sig, secret);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const clientId = session.metadata?.clientId;
    if (clientId) {
      await db.insert(subscriptions).values({
        clientId,
        stripeCustomerId: String(session.customer || ""),
        stripeSubscriptionId: String(session.subscription || ""),
        status: "active",
      }).onConflictDoNothing();
    }
  }

  res.json({ received: true });
});
