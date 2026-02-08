import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { router as health } from "./routes/health";
import { router as auth } from "./routes/auth";
import { router as admin } from "./routes/admin";
import { router as clients } from "./routes/clients";
import { router as modules } from "./routes/modules";
import { router as billing } from "./routes/billing";

import { migrateIfEnabled } from "./db/migrate";
import { seedIfEnabled } from "./db/seed";

dotenv.config();

const app = express();

/** REQUIRED on Railway (proxy sets X-Forwarded-For) */
app.set("trust proxy", 1);

// Stripe webhook needs raw body
app.use((req, _res, next) => {
  if (req.originalUrl === "/api/billing/webhook") {
    let data = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      (req as any).rawBody = data;
      next();
    });
  } else {
    next();
  }
});

app.use(helmet());
app.use(
  cors({
    origin: (process.env.CORS_ORIGINS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

/** MUST be after trust proxy */
app.use(rateLimit({ windowMs: 60_000, limit: 120 }));

app.use("/api", health);
app.use("/api/auth", auth);
app.use("/api/admin", admin);
app.use("/api", clients);
app.use("/api", modules);
app.use("/api/billing", billing);

app.use((_req, res) => res.status(404).json({ error: "Not found" }));

const port = Number(process.env.PORT || 8000);

(async () => {
  try {
    // 1) ensure tables exist BEFORE seed hits users table
    await migrateIfEnabled();

    // 2) optional demo seed (safe now)
    await seedIfEnabled();

    app.listen(port, "0.0.0.0", () => console.log(`API on :${port}`));
  } catch (e) {
    console.error("Startup error", e);
    process.exit(1);
  }
})();