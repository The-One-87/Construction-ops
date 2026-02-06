import { db } from "../db/client";
import { clients } from "../db/schema";
import { eq } from "drizzle-orm";

export async function listClients() {
  return db.select().from(clients);
}

export async function getClientById(id: string) {
  const rows = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return rows[0] || null;
}

export async function createClient(data: any) {
  const rows = await db.insert(clients).values(data).returning();
  return rows[0];
}

export async function updateClient(id: string, patch: any) {
  const rows = await db.update(clients).set({ ...patch, updatedAt: new Date() }).where(eq(clients.id, id)).returning();
  return rows[0] || null;
}
