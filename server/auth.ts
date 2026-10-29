import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "@clerk/backend";

export type AuthedRequest = Request & { userId: string };

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: "Please log in." });
    return;
  }

  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    (req as AuthedRequest).userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: "Your session is invalid. Please log in again." });
  }
}