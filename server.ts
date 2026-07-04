import express from "express";
import path from "path";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import apiRoutes from "./routes/apiRoutes";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 5000;
  // 1. Connect to Database (with graceful local JSON fallback)
  await connectDB();

  // 2. Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 3. API Routes
  app.use("/api", apiRoutes);

  // 4. Static Asset Mapping
  // Serves public CSS, JS and icons
  app.use(express.static(path.join(process.cwd(), "public")));
  // Exposes our generated assets (avatar, project previews) under /src/assets
  app.use("/src/assets", express.static(path.join(process.cwd(), "src/assets")));

  // 5. Views Routing
  app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "views", "index.html"));
  });

  // Handle favicon request
  app.get("/favicon.ico", (req, res) => {
    res.status(204).end();
  });

  // 6. 404 Route Fallback
  app.get("*", (req, res) => {
    res.status(404).sendFile(path.join(process.cwd(), "views", "404.html"));
  });

  // 7. Bind to port 3000 and 0.0.0.0 for container accessibility
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✨ Premium portfolio server running on port ${PORT}`);
  });
}

startServer();
