import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";
import { readDB, writeDB } from "../utils/db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "..", "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${nanoid(6)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only image files are allowed."));
  },
});

const router = Router();

function nearestWard(db, lat, lng) {
  if (lat == null || lng == null) return null;
  let best = null;
  let bestDist = Infinity;
  for (const w of db.wards) {
    const d = Math.hypot(w.lat - lat, w.lng - lng);
    if (d < bestDist) {
      bestDist = d;
      best = w.id;
    }
  }
  return best;
}

// POST /api/complaints  (citizen submits a new complaint, optional photo)
router.post("/", requireAuth, upload.single("photo"), (req, res) => {
  const { title, description, category, lat, lng } = req.body;
  if (!title || !description || !category) {
    return res.status(400).json({ error: "Title, description and category are required." });
  }
  const db = readDB();
  const latNum = lat ? parseFloat(lat) : null;
  const lngNum = lng ? parseFloat(lng) : null;
  const wardId = nearestWard(db, latNum, lngNum);
  const deadline = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(); // default 4-day SLA

  const complaint = {
    id: "C-" + nanoid(6).toUpperCase(),
    citizenId: req.user.id,
    citizenName: req.user.name,
    title,
    description,
    category,
    photoName: req.file ? req.file.filename : null,
    lat: latNum,
    lng: lngNum,
    wardId,
    status: "received",
    priority: "medium",
    deadline,
    createdAt: new Date().toISOString(),
    updates: [{ at: new Date().toISOString(), note: "Complaint received and logged.", by: "system" }],
  };
  db.complaints.unshift(complaint);
  writeDB(db);
  res.status(201).json({ complaint });
});

// GET /api/complaints  (citizens see their own; officers see all, with optional ?status=&wardId=)
router.get("/", requireAuth, (req, res) => {
  const db = readDB();
  let list = db.complaints;
  if (req.user.role !== "officer") {
    list = list.filter((c) => c.citizenId === req.user.id);
  } else {
    const { status, wardId, priority } = req.query;
    if (status) list = list.filter((c) => c.status === status);
    if (wardId) list = list.filter((c) => c.wardId === wardId);
    if (priority) list = list.filter((c) => c.priority === priority);
  }
  res.json({ complaints: list });
});

// GET /api/complaints/:id
router.get("/:id", requireAuth, (req, res) => {
  const db = readDB();
  const complaint = db.complaints.find((c) => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: "Complaint not found." });
  if (req.user.role !== "officer" && complaint.citizenId !== req.user.id) {
    return res.status(403).json({ error: "You cannot view this complaint." });
  }
  res.json({ complaint });
});

// PATCH /api/complaints/:id  (officer updates status / priority / deadline, adds a note)
router.patch("/:id", requireAuth, requireRole("officer"), (req, res) => {
  const db = readDB();
  const complaint = db.complaints.find((c) => c.id === req.params.id);
  if (!complaint) return res.status(404).json({ error: "Complaint not found." });

  const { status, priority, deadline, note } = req.body;
  if (status) complaint.status = status;
  if (priority) complaint.priority = priority;
  if (deadline) complaint.deadline = deadline;

  const parts = [];
  if (status) parts.push(`Status changed to "${status}"`);
  if (priority) parts.push(`priority set to "${priority}"`);
  if (deadline) parts.push(`deadline updated to ${new Date(deadline).toLocaleString()}`);
  if (note) parts.push(note);
  if (parts.length) {
    complaint.updates.push({ at: new Date().toISOString(), note: parts.join("; "), by: "officer" });
  }
  writeDB(db);
  res.json({ complaint });
});

export default router;
