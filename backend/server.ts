import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import apiRoutes from "./routes/apiRoutes";

dotenv.config({ path: [".env", "../.env"] });

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 5000;
  const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

  app.use((req, res, next) => {
    const origin = req.headers.origin?.replace(/\/$/, "");
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    }
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
  });

  await connectDB();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api", apiRoutes);
  app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

  app.listen(port, "0.0.0.0", () => {
    console.log(`Portfolio API running on port ${port}`);
  });
}

startServer();
