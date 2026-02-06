import bcrypt from "bcryptjs";
import { db } from "./client";
import { clients, users, presets } from "./schema";
import { eq } from "drizzle-orm";

const defaultPresets = [
  {
    name: "Roofing",
    industry: "roofing",
    config: {
      brand: "Construction Ops",
      primaryColor: "#2563eb",
      modules: {
        inventory: { label: "Inventory", fields: [{ key: "item", label: "Item", type: "text", required: true }, { key: "qty", label: "Qty", type: "number" }] },
        jobs: { label: "Jobs", fields: [{ key: "title", label: "Job Title", type: "text", required: true }, { key: "when", label: "Scheduled", type: "datetime-local" }] },
        clients: { label: "Clients", fields: [{ key: "name", label: "Name", type: "text", required: true }, { key: "phone", label: "Phone", type: "tel" }] },
        ops: { label: "Video / GPS", fields: [{ key: "note", label: "Note", type: "text" }, { key: "lat", label: "Latitude", type: "number" }, { key: "lng", label: "Longitude", type: "number" }] },
      }
    },
    description: "Default roofing preset"
  }
];

export async function seedIfEnabled() {
  if (process.env.SEED_DEMO !== "true") return;

  const existingAdmin = await db.select().from(users).where(eq(users.username, "admin@constructionops.com")).limit(1);
  if (existingAdmin.length) return;

  for (const p of defaultPresets) {
    await db.insert(presets).values(p as any).onConflictDoNothing();
  }

  const demoClientRows = await db.insert(clients).values({
    name: "Construction Ops Demo",
    brand: "Construction Ops",
    industry: "roofing",
    primaryColor: "#2563eb",
    config: defaultPresets[0].config,
  }).returning();

  const demoClient = demoClientRows[0];

  const adminHash = await bcrypt.hash("admin123", 10);
  const clientHash = await bcrypt.hash("client123", 10);

  await db.insert(users).values({
    username: "admin@constructionops.com",
    passwordHash: adminHash,
    role: "super-admin",
    clientId: null,
  });

  await db.insert(users).values({
    username: "client@demo.com",
    passwordHash: clientHash,
    role: "client",
    clientId: demoClient.id,
  });

  // eslint-disable-next-line no-console
  console.log("Seeded demo users + demo client");
}
