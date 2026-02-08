import { sql } from "drizzle-orm";
import { db } from "./client";

export async function ensureSchema() {
  // pgcrypto gives gen_random_uuid()
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS clients (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      brand text NOT NULL,
      industry text NOT NULL,
      primary_color text DEFAULT '#2563eb',
      logo text,
      is_active boolean DEFAULT true,
      config jsonb NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      username text NOT NULL UNIQUE,
      password_hash text NOT NULL,
      role text NOT NULL DEFAULT 'client',
      client_id uuid NULL REFERENCES clients(id) ON DELETE SET NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS module_data (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      module_type text NOT NULL,
      data jsonb NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS presets (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      industry text NOT NULL,
      config jsonb NOT NULL,
      description text,
      created_at timestamptz DEFAULT now()
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      stripe_customer_id text,
      stripe_subscription_id text,
      status text NOT NULL DEFAULT 'inactive',
      current_period_end timestamptz,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  `);

  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_users_client_id ON users(client_id);`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_module_data_client_id ON module_data(client_id);`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_subscriptions_client_id ON subscriptions(client_id);`);
}