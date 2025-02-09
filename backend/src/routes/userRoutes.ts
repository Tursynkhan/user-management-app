import { Router } from "express";
import { getUsers, modifyUsers } from "../controllers/userControllers";
import { verifyUserMiddleware } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get list of users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the list of users
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyUserMiddleware, getUsers);

/**
 * @swagger
 * /users/action:
 *   post:
 *     summary: Perform bulk actions on users (block, unblock, delete)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *               action:
 *                 type: string
 *                 enum: [block, unblock, delete]
 *     responses:
 *       200:
 *         description: Action performed successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post("/action", verifyUserMiddleware, modifyUsers);

export default router;
