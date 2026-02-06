import { db } from "../db/client";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export async function getUserByUsername(username: string) {
  const rows = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return rows[0] || null;
}

export async function getUserById(id: string) {
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0] || null;
}

export async function createUser(input: { username: string; passwordHash: string; role: string; clientId?: string | null }) {
  const rows = await db.insert(users).values({
    username: input.username,
    passwordHash: input.passwordHash,
    role: input.role,
    clientId: input.clientId ?? null,
  }).returning();
  return rows[0];
}
