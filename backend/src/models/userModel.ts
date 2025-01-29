import pool from '../config/database';
import bcrypt from 'bcrypt';

export const createUser = async (name: string, email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
    [name, email, hashedPassword]
  );
};

export const findUserByEmail = async (email: string) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

export const getAllUsers = async () => {
  const result = await pool.query('SELECT id, name, email, last_login, status FROM users ORDER BY last_login DESC');
  return result.rows;
};

export const updateUserStatus = async (ids: number[], status: string) => {
  await pool.query('UPDATE users SET status = $1 WHERE id = ANY($2)', [status, ids]);
};

export const deleteUserByIds = async (ids: number[]) => {
  await pool.query('DELETE FROM users WHERE id = ANY($1)', [ids]);
};