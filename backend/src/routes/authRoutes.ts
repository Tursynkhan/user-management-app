import { Router, Request, Response } from 'express';
import { createUser, findUserByEmail } from '../models/userModel';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with name, email, and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration successful
 *       400:
 *         description: Error during registration
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  try {
    await createUser(name, email, password);
    res.json({ message: 'Registration successful' });
  } catch (error) {
    res.status(400).json({ message: 'Error during registration' });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate a user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });
  res.json({ token });
});

export default router;