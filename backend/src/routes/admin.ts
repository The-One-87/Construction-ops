import { Router } from "express";
import { authenticateToken, requireRole } from "../middleware/auth";
import { createClientSchema } from "../utils/validators";
import { createClient, listClients } from "../services/clients";
import { createPreset, listPresets } from "../services/presets";

export const router = Router();

router.get("/clients", authenticateToken, requireRole("super-admin"), async (_req, res) => {
  res.json(await listClients());
});

router.post("/clients", authenticateToken, requireRole("super-admin"), async (req, res) => {
  const parsed = createClientSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid client data" });
  const client = await createClient(parsed.data);
  res.json(client);
});

router.get("/presets", authenticateToken, async (_req, res) => {
  res.json(await listPresets());
});

router.post("/presets", authenticateToken, requireRole("super-admin"), async (req, res) => {
  const p = await createPreset(req.body);
  res.json(p);
});
