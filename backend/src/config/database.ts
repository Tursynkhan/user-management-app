import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER as string,
  host: process.env.DB_HOST as string,
  database: process.env.DB_NAME as string,
  password: process.env.DB_PASSWORD as string,
  port: Number(process.env.DB_PORT) || 5432,
});

const testDB = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Database connected successfully!");
    client.release();
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Database connection error:", error.message);
    } else {
      console.error("❌ Database connection error:", error);
    }
  }
};

testDB()

export default pool;