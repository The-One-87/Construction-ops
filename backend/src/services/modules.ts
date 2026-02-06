import { db } from "../db/client";
import { moduleData } from "../db/schema";
import { and, eq } from "drizzle-orm";

export async function listModuleData(clientId: string, moduleType: string) {
  return db.select().from(moduleData).where(and(eq(moduleData.clientId, clientId), eq(moduleData.moduleType, moduleType)));
}

export async function createModuleDataItem(clientId: string, moduleType: string, data: any) {
  const rows = await db.insert(moduleData).values({ clientId, moduleType, data }).returning();
  return rows[0];
}

export async function updateModuleDataItem(clientId: string, moduleType: string, id: string, data: any) {
  const rows = await db.update(moduleData)
    .set({ data, updatedAt: new Date() })
    .where(and(eq(moduleData.id, id), eq(moduleData.clientId, clientId), eq(moduleData.moduleType, moduleType)))
    .returning();
  return rows[0] || null;
}

export async function deleteModuleDataItem(clientId: string, moduleType: string, id: string) {
  const rows = await db.delete(moduleData)
    .where(and(eq(moduleData.id, id), eq(moduleData.clientId, clientId), eq(moduleData.moduleType, moduleType)))
    .returning();
  return rows[0] || null;
}
