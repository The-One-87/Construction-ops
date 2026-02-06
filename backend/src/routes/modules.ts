import { Router } from "express";
import { authenticateToken, requireClientAccess, type AuthenticatedRequest } from "../middleware/auth";
import { modulePayloadSchema } from "../utils/validators";
import { listModuleData, createModuleDataItem, updateModuleDataItem, deleteModuleDataItem } from "../services/modules";

export const router = Router();

router.get("/clients/:clientId/modules/:moduleType", authenticateToken, requireClientAccess, async (req: AuthenticatedRequest, res) => {
  const { clientId, moduleType } = req.params;
  const items = await listModuleData(clientId, moduleType);
  res.json(items);
});

router.post("/clients/:clientId/modules/:moduleType", authenticateToken, requireClientAccess, async (req: AuthenticatedRequest, res) => {
  const { clientId, moduleType } = req.params;
  const parsed = modulePayloadSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid module data" });
  const item = await createModuleDataItem(clientId, moduleType, parsed.data);
  res.json(item);
});

router.put("/clients/:clientId/modules/:moduleType/:id", authenticateToken, requireClientAccess, async (req: AuthenticatedRequest, res) => {
  const { clientId, moduleType, id } = req.params;
  const parsed = modulePayloadSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid module data" });
  const item = await updateModuleDataItem(clientId, moduleType, id, parsed.data);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

router.delete("/clients/:clientId/modules/:moduleType/:id", authenticateToken, requireClientAccess, async (req: AuthenticatedRequest, res) => {
  const { clientId, moduleType, id } = req.params;
  const deleted = await deleteModuleDataItem(clientId, moduleType, id);
  if (!deleted) return res.status(404).json({ error: "Not found" });
  res.json({ success: true });
});
