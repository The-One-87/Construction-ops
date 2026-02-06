import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginSchema } from "../utils/validators";
import { getUserByUsername } from "../services/users";
import { authenticateToken, type AuthenticatedRequest } from "../middleware/auth";
import { getClientById } from "../services/clients";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
export const router = Router();

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid payload" });

  const { username, password } = parsed.data;
  const user = await getUserByUsername(username);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { sub: user.id, role: user.role, clientId: user.clientId || null },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role, clientId: user.clientId },
  });
});

router.get("/me", authenticateToken, async (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const client = user.clientId ? await getClientById(user.clientId) : null;
  res.json({ user, client });
});
