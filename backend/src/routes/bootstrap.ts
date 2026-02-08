import express from "express";
import bcrypt from "bcryptjs";
import { db } from "../db/client";
import { users, clients } from "../db/schema";
import { sql, eq } from "drizzle-orm";

export const router = express.Router();

/**
 * POST /api/bootstrap
 * Creates the FIRST super-admin if (and only if) no users exist.
 * Body: { email, password, clientName? }
 */
router.post("/bootstrap", async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  const clientName = String(req.body?.clientName || "Primary Client").trim();

  if (!email || !password || password.length < 8) {
    return res.status(400).json({ error: "Invalid email/password" });
  }

  // Only allow if there are zero users in the system
  const countRows = await db.execute(sql`SELECT COUNT(*)::int AS n FROM users;`);
  const n = (countRows.rows?.[0] as any)?.n ?? 0;
  if (n > 0) return res.status(403).json({ error: "Bootstrap disabled (users exist)" });

  // Create a client row (optional but useful)
  const clientRows = await db
    .insert(clients)
    .values({
      name: clientName,
      brand: clientName,
      industry: "construction",
      primaryColor: "#2563eb",
      config: { modules: {} },
    } as any)
    .returning();

  const client = clientRows[0];

  const hash = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    username: email,
    passwordHash: hash,
    role: "super-admin",
    clientId: client?.id ?? null,
  } as any);

  return res.json({ ok: true, email });
});