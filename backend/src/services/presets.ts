import { db } from "../db/client";
import { presets } from "../db/schema";

export async function listPresets() {
  return db.select().from(presets);
}

export async function createPreset(preset: any) {
  const rows = await db.insert(presets).values(preset).returning();
  return rows[0];
}
