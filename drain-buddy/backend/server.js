import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import complaintsRoutes from "./routes/complaints.js";
import sensorsRoutes from "./routes/sensors.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => res.json({ ok: true, service: "drain-buddy-api" }));

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintsRoutes);
app.use("/api", sensorsRoutes); // exposes /api/wards, /api/sensors

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Something went wrong on the server." });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Drain-Buddy API listening on http://localhost:${PORT}`);
});
