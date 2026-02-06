import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { getUserById } from "../services/users";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export type AuthUser = {
  id: string;
  username: string;
  role: "super-admin" | "client";
  clientId?: string;
};

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access token required" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await getUserById(decoded.sub);
    if (!user) return res.status(403).json({ error: "Invalid token" });

    req.user = {
      id: user.id,
      username: user.username,
      role: user.role as any,
      clientId: user.clientId || undefined,
    };
    next();
  } catch {
    return res.status(403).json({ error: "Invalid token" });
  }
}

export function requireRole(role: "super-admin" | "client") {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) return res.status(403).json({ error: "Insufficient permissions" });
    next();
  };
}

export function requireClientAccess(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { clientId } = req.params;

  if (req.user?.role === "super-admin") return next();
  if (!req.user?.clientId || req.user.clientId !== clientId) {
    return res.status(403).json({ error: "Access denied to this client data" });
  }
  next();
}
