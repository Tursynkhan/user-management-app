import express, { Application, Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import { verifyUserMiddleware } from "./middleware/authMiddleware";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger";

const app: Application = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/auth", authRoutes);
app.use("/users", verifyUserMiddleware, userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});