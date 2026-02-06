import { Router } from "express";
import { authenticateToken, requireClientAccess, type AuthenticatedRequest } from "../middleware/auth";
import { getClientById, updateClient } from "../services/clients";

export const router = Router();

router.get("/clients/:clientId/config", authenticateToken, requireClientAccess, async (req: AuthenticatedRequest, res) => {
  const client = await getClientById(req.params.clientId);
  if (!client) return res.status(404).json({ error: "Client not found" });
  res.json(client.config);
});

router.put("/clients/:clientId/config", authenticateToken, requireClientAccess, async (req: AuthenticatedRequest, res) => {
  const updated = await updateClient(req.params.clientId, { config: req.body.config });
  if (!updated) return res.status(404).json({ error: "Client not found" });
  res.json(updated.config);
});
