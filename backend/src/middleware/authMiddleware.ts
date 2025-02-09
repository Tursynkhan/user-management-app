import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import db  from "../config/database";

interface AuthRequest extends Request {
  user?: { id: string };
}

export const verifyUserMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    req.user = { id: decoded.id };

    const userResult = await db.query("SELECT status FROM users WHERE id = $1", [decoded.id]);
    if (userResult.rows.length === 0) {
      res.status(401).json({ message: "Unauthorized: User does not exist" });
      return;
    }

    const userStatus = userResult.rows[0].status;
    if (userStatus === "blocked") {
      res.status(403).json({ message: "Access denied: User is blocked" });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
