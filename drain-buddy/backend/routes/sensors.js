import { Router } from "express";
import { readDB, writeDB } from "../utils/db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

function jitter(value, magnitude, min, max) {
  const next = value + (Math.random() - 0.5) * magnitude;
  return Math.max(min, Math.min(max, Math.round(next * 10) / 10));
}

function riskFromSensors(db, wardId) {
  const sensors = db.sensors.filter((s) => s.wardId === wardId);
  if (sensors.some((s) => s.status === "critical")) return "high";
  if (sensors.some((s) => s.status === "warning")) return "medium";
  return "low";
}

// GET /api/wards  -> ward list with computed risk (simulated GIS + AI risk scoring)
router.get("/wards", requireAuth, (req, res) => {
  const db = readDB();
  const wards = db.wards.map((w) => ({ ...w, risk: riskFromSensors(db, w.id) }));
  res.json({ wards });
});

// GET /api/sensors -> live (simulated) IoT sensor feed, values drift slightly on every call
router.get("/sensors", requireAuth, (req, res) => {
  const db = readDB();
  let changed = false;
  for (const s of db.sensors) {
    if (Math.random() < 0.5) {
      changed = true;
      if (s.type === "water-level") s.value = jitter(s.value, 6, 2, 100);
      if (s.type === "blockage") s.value = jitter(s.value, 5, 0, 100);
      if (s.type === "flow") s.value = jitter(s.value, 0.4, 0, 6);
      if (s.type === "water-level") s.status = s.value > 70 ? "critical" : s.value > 45 ? "warning" : "normal";
      if (s.type === "blockage") s.status = s.value > 80 ? "critical" : s.value > 55 ? "warning" : "normal";
      if (s.type === "flow") s.status = s.value > 5 || s.value < 0.5 ? "warning" : "normal";
      s.updatedAt = new Date().toISOString();
    }
  }
  if (changed) writeDB(db);
  res.json({ sensors: db.sensors });
});

// POST /api/sensors/:id/ack -> officer acknowledges/clears an alert (demo action)
router.post("/sensors/:id/ack", requireAuth, requireRole("officer"), (req, res) => {
  const db = readDB();
  const sensor = db.sensors.find((s) => s.id === req.params.id);
  if (!sensor) return res.status(404).json({ error: "Sensor not found." });
  sensor.status = "normal";
  if (sensor.type === "water-level") sensor.value = 20;
  if (sensor.type === "blockage") sensor.value = 10;
  sensor.updatedAt = new Date().toISOString();
  writeDB(db);
  res.json({ sensor });
});

export default router;
