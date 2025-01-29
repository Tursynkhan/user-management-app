import * as jwt from 'jsonwebtoken';
import pool from '../config/database';
import { Request, Response, NextFunction } from "express";


type DecodedToken = { id: number };

export const verifyUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as DecodedToken;
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [decoded.id]);

    if (user.rows.length === 0 || user.rows[0].status === "blocked") {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    (req as any).user = user.rows[0];
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
