import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { readDB, writeDB } from "../utils/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function signToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET || "dev_secret_change_me",
    { expiresIn: "7d" }
  );
}

function publicUser(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

// POST /api/auth/signup  -> creates an unverified account and issues an OTP
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email and password are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }
  const db = readDB();
  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: "u_" + nanoid(10),
    name,
    email,
    passwordHash,
    role: role === "officer" ? "officer" : "citizen",
    verified: false,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);

  const code = String(Math.floor(100000 + Math.random() * 900000));
  db.otps = db.otps.filter((o) => o.email.toLowerCase() !== email.toLowerCase());
  db.otps.push({ email, code, expiresAt: Date.now() + 10 * 60 * 1000 });
  writeDB(db);

  // In production, send this code by email (see README for wiring up a real SMTP/nodemailer sender).
  // For this demo build we return it directly so the flow works without external services.
  res.status(201).json({
    message: "Account created. Enter the verification code to activate it.",
    devVerificationCode: code,
  });
});

// POST /api/auth/verify
router.post("/verify", (req, res) => {
  const { email, code } = req.body;
  const db = readDB();
  const otp = db.otps.find((o) => o.email.toLowerCase() === (email || "").toLowerCase());
  if (!otp || otp.code !== code || otp.expiresAt < Date.now()) {
    return res.status(400).json({ error: "That code is invalid or has expired." });
  }
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.status(404).json({ error: "Account not found." });
  user.verified = true;
  db.otps = db.otps.filter((o) => o.email.toLowerCase() !== email.toLowerCase());
  writeDB(db);
  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
});

// POST /api/auth/resend-code
router.post("/resend-code", (req, res) => {
  const { email } = req.body;
  const db = readDB();
  const user = db.users.find((u) => u.email.toLowerCase() === (email || "").toLowerCase());
  if (!user) return res.status(404).json({ error: "Account not found." });
  const code = String(Math.floor(100000 + Math.random() * 900000));
  db.otps = db.otps.filter((o) => o.email.toLowerCase() !== email.toLowerCase());
  db.otps.push({ email, code, expiresAt: Date.now() + 10 * 60 * 1000 });
  writeDB(db);
  res.json({ message: "A new code has been generated.", devVerificationCode: code });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find((u) => u.email.toLowerCase() === (email || "").toLowerCase());
  if (!user) return res.status(401).json({ error: "Incorrect email or password." });
  const ok = await bcrypt.compare(password || "", user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Incorrect email or password." });
  if (!user.verified) {
    return res.status(403).json({ error: "Please verify your email before signing in.", needsVerification: true });
  }
  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
});

// GET /api/auth/me
router.get("/me", requireAuth, (req, res) => {
  const db = readDB();
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ user: publicUser(user) });
});

export default router;
