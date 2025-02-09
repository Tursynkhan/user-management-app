import { Request, Response } from "express";
import db from "../config/database";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.query(
      "SELECT id, name, email, last_login, status FROM users ORDER BY last_login DESC"
    );
    res.json(users.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const modifyUsers = async (req: Request, res: Response): Promise<void> => {
  const { ids, action } = req.body;

  if (!Array.isArray(ids) || !ids.length) {
    res.status(400).json({ message: "Invalid user IDs" });
    return;
  }

  try {
    if (action === "delete") {
      await db.query("DELETE FROM users WHERE id = ANY($1)", [ids]);
    } else if (action === "block") {
      await db.query("UPDATE users SET status = 'blocked' WHERE id = ANY($1)", [ids]);
    } else if (action === "unblock") {
      await db.query("UPDATE users SET status = 'active' WHERE id = ANY($1)", [ids]);
    } else {
      res.status(400).json({ message: "Invalid action" });
      return;
    }

    res.json({ message: "Action performed successfully" });
  } catch (error) {
    console.error("Action error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
