import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY || "";
export const stripe = key ? new Stripe(key, { apiVersion: "2024-06-20" as any }) : null;

export function requireStripe() {
  if (!stripe) throw new Error("Stripe not configured");
  return stripe;
}
