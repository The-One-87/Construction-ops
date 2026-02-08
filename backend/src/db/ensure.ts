import { sql } from "drizzle-orm";
import { db } from "./client";

export async function ensureSchema() {
  // gen_random_uuid() is from pgcrypto
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

  // clients
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS clients (
      id varchar PRIMARY KEY DEFAULT (gen_random_uuid()::text),
      name text NOT NULL,
      brand text NOT NULL,
      industry text NOT NULL,
      primary_color text DEFAULT '#2563eb',
      logo text,
      is_active boolean DEFAULT true,
      config jsonb NOT NULL,
      created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now()
    );
  `);

  // users
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id varchar PRIMARY KEY DEFAULT (gen_random_uuid()::text),
      username text NOT NULL UNIQUE,
      password_hash text NOT NULL,
      role text NOT NULL DEFAULT 'client',
      client_id varchar,
      created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now()
    );
  `);

  // module_data
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS module_data (
      id varchar PRIMARY KEY DEFAULT (gen_random_uuid()::text),
      client_id varchar NOT NULL,
      module_type text NOT NULL,
      data jsonb NOT NULL,
      created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now()
    );
  `);

  // presets
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS presets (
      id varchar PRIMARY KEY DEFAULT (gen_random_uuid()::text),
      name text NOT NULL,
      industry text NOT NULL,
      config jsonb NOT NULL,
      description text,
      created_at timestamp DEFAULT now()
    );
  `);

  // subscriptions
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id varchar PRIMARY KEY DEFAULT (gen_random_uuid()::text),
      client_id varchar NOT NULL,
      stripe_customer_id text,
      stripe_subscription_id text,
      status text NOT NULL DEFAULT 'inactive',
      current_period_end timestamp,
      created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now()
    );
  `);
}