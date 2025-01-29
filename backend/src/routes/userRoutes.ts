import { Router } from 'express';
import { getAllUsers, updateUserStatus, deleteUserByIds } from '../models/userModel';

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   last_login:
 *                     type: string
 *                   status:
 *                     type: string
 */
router.get('/', async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
});

/**
 * @swagger
 * /users/action:
 *   post:
 *     summary: Perform action on users
 *     description: Block, unblock, or delete users by ID
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
 *                   type: integer
 *               action:
 *                 type: string
 *                 enum: [delete, blocked, active]
 *     responses:
 *       200:
 *         description: Action performed successfully
 *       400:
 *         description: Error performing action
 */
router.post('/action', async (req, res) => {
  const { ids, action } = req.body;
  try {
    if (action === 'delete') {
      await deleteUserByIds(ids);
    } else {
      await updateUserStatus(ids, action);
    }
    res.json({ message: 'Action performed successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error performing action' });
  }
});

export default router;
