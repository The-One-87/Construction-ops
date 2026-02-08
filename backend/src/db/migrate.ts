import path from "path";
import fs from "fs";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./client";

export async function migrateIfEnabled() {
  // default OFF unless explicitly enabled
  if (process.env.DB_MIGRATE !== "true") return;

  const migrationsFolder = path.join(process.cwd(), "drizzle");

  // hard stop if folder isn't there (prevents crash loops)
  if (!fs.existsSync(migrationsFolder)) {
    console.warn(`[db] migrations folder missing: ${migrationsFolder} (skipping)`);
    return;
  }

  await migrate(db as any, { migrationsFolder });
}