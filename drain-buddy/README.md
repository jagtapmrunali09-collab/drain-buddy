# Drain-Buddy — Smart Municipal Drainage & Flood Prevention System

A full-stack web app that combines simulated AI/IoT drain monitoring with a citizen complaint
system, built as two apps:

- **`backend/`** — Node.js + Express REST API (JSON file storage, JWT auth, file uploads)
- **`frontend/`** — React (Vite) + Tailwind CSS single-page app

## Features

- **Citizen portal**: submit complaints with photo upload + GPS tagging, track status and
  resolution deadlines, FAQ, emergency numbers, WhatsApp quick-contact, voice assistant,
  English/Hindi/Marathi language switch.
- **Officer (municipal) portal**: live simulated sensor feed (water level / blockage / flow),
  ward risk map, complaint triage with status/priority/deadline controls.
- **Auth**: email + password signup with a 6-digit email verification code, JWT sessions.
- **Map**: Leaflet + OpenStreetMap (no API key required) showing wards, sensors, and complaint
  pins.

---

## 1. Run it locally

### Prerequisites
- [Node.js](https://nodejs.org) v18 or newer (includes `npm`)

### 1a. Start the backend API

```bash
cd backend
cp .env.example .env      # on Windows (PowerShell): copy .env.example .env
npm install
npm run dev
```

The API runs at `http://localhost:5050`. Health check: `http://localhost:5050/api/health`.

Open `backend/.env` and set a real random string for `JWT_SECRET` (any long random text works
for local dev).

### 1b. Start the frontend

Open a **second terminal**:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The app runs at `http://localhost:5173` and talks to the API at the URL set in
`frontend/.env` (`VITE_API_URL`, defaults to `http://localhost:5050`).

### 1c. Try it out

1. Go to `http://localhost:5173`, click **Get started**, and sign up. Choose **Citizen** or
   **Municipal officer** as the role.
2. On the verification screen, the app shows the 6-digit code directly on screen (this is a
   demo stand-in for a real email — see "Sending real verification emails" below). Enter it to
   activate the account.
3. As a **citizen**, submit a complaint from "Report a drain issue" (a photo and location are
   optional).
4. Sign out, sign up again with the **Municipal officer** role, and sign in — you'll land on
   the live control room with a sensor feed, ward risk map, and the complaint you just filed.

Two demo complaints are pre-seeded in `backend/data/db.json` so the officer dashboard has data
immediately, even before any citizen has signed up.

---

## 2. Project structure

```
drain-buddy/
├── backend/
│   ├── server.js            # Express app entry point
│   ├── routes/               # auth, complaints, sensors/wards
│   ├── middleware/auth.js    # JWT auth + role guard
│   ├── utils/db.js           # tiny JSON-file "database" helper
│   ├── data/db.json          # all persisted data (users, complaints, sensors, wards)
│   └── uploads/               # uploaded complaint photos
└── frontend/
    ├── src/
    │   ├── pages/             # route-level pages
    │   ├── components/        # Navbar, RiskMap, VoiceAssistant, etc.
    │   ├── context/           # Auth + language React contexts
    │   └── api.js              # fetch wrapper for the backend
    └── index.html
```

---

## 3. Push to GitHub

From the project root (the folder containing both `backend/` and `frontend/`):

```bash
git init
git add .
git commit -m "Initial commit: Drain-Buddy smart drainage platform"
```

Create a new empty repository on GitHub (github.com → **New repository**, do **not**
initialize it with a README), then:

```bash
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

---

## 4. Deploy it live

The frontend and backend deploy separately.

### 4a. Deploy the backend (Render — free tier works)

1. Go to [render.com](https://render.com) → **New** → **Web Service** → connect your GitHub repo.
2. Set **Root Directory** to `backend`.
3. **Build command**: `npm install`
4. **Start command**: `npm start`
5. Add environment variables (Render → your service → **Environment**):
   - `JWT_SECRET` = a long random string
   - `CLIENT_ORIGIN` = your deployed frontend URL (add this after step 4b, then redeploy)
6. Deploy. Note the URL Render gives you, e.g. `https://drain-buddy-api.onrender.com`.

> Render's free tier uses ephemeral disk — uploaded photos and the JSON "database" will reset
> on redeploy/restart. For a persistent production deployment, swap `backend/utils/db.js` for a
> real database (e.g. Postgres via Render's managed DB, or MongoDB Atlas) and store uploads in
> S3-compatible storage. The code is organized so only `utils/db.js` and the `multer` storage
> config in `routes/complaints.js` need to change.

**Alternative hosts**: Railway.app and Fly.io work the same way (connect repo → root
directory `backend` → `npm install` / `npm start`).

### 4b. Deploy the frontend (Vercel or Netlify — both free)

**Vercel:**
1. [vercel.com](https://vercel.com) → **New Project** → import your GitHub repo.
2. **Root Directory**: `frontend`
3. Framework preset: Vite (auto-detected).
4. Environment variable: `VITE_API_URL` = your backend URL from step 4a
   (e.g. `https://drain-buddy-api.onrender.com`).
5. Deploy.

**Netlify (alternative):**
1. [netlify.com](https://netlify.com) → **Add new site** → **Import an existing project**.
2. **Base directory**: `frontend`
3. **Build command**: `npm run build`   **Publish directory**: `frontend/dist`
4. Environment variable: `VITE_API_URL` = your backend URL.
5. Deploy.

After the frontend is live, go back to your Render backend's environment variables and set
`CLIENT_ORIGIN` to the deployed frontend URL (e.g. `https://drain-buddy.vercel.app`), then
redeploy the backend so CORS allows requests from it.

---

## 5. Sending real verification emails (production)

Right now, `POST /api/auth/signup` returns the verification code directly in the response so
the whole flow works without any external service. To send it by real email instead, edit
`backend/routes/auth.js`:

1. `npm install nodemailer` in `backend/`.
2. In `signup` and `resend-code`, replace the `devVerificationCode` response with a call to
   nodemailer, e.g.:

```js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

await transporter.sendMail({
  from: '"Drain-Buddy" <no-reply@yourdomain.com>',
  to: email,
  subject: "Your verification code",
  text: `Your Drain-Buddy verification code is ${code}. It expires in 10 minutes.`,
});
```

3. Add `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` to your `.env` / hosting environment
   variables (any SMTP provider works — SendGrid, Mailgun, Amazon SES, Gmail with an app
   password, etc.).

---

## 6. Configuration you'll want to personalize

- **WhatsApp number**: `frontend/src/components/WhatsAppButton.jsx` — replace
  `MUNICIPAL_WHATSAPP_NUMBER` with the real corporation number (international format, no `+`
  or spaces).
- **Emergency numbers**: `frontend/src/components/EmergencyNumbers.jsx`.
- **Wards / sensors seed data**: `backend/data/db.json` — replace the `wards` and `sensors`
  arrays with your city's actual ward names/coordinates.
- **Map provider**: the app ships with Leaflet + free OpenStreetMap tiles (no API key). To
  switch to Google Maps instead, install `@react-google-maps/api` in `frontend/`, get a Google
  Maps JavaScript API key, and swap the implementation in
  `frontend/src/components/RiskMap.jsx` — the rest of the app just passes it `wards`,
  `sensors`, and `complaints` arrays, so no other files need to change.
- **Branding**: app name, tagline, and colors live in `frontend/src/i18n/translations.js` and
  `frontend/tailwind.config.js`.

---

## 7. Tech stack summary

| Layer | Choice |
|---|---|
| Frontend | React 18, Vite, React Router, Tailwind CSS, Leaflet/react-leaflet, lucide-react icons |
| Backend | Node.js, Express, JWT (jsonwebtoken), bcryptjs, multer (file uploads) |
| Data | JSON file (`backend/data/db.json`) — swap for Postgres/Mongo in production |
| Voice | Native browser Web Speech API (SpeechRecognition + speechSynthesis) — no external API key |
| i18n | Lightweight custom dictionary (`frontend/src/i18n/translations.js`) — English, Hindi, Marathi |

No external paid APIs are required to run this end to end locally or in a free-tier
deployment.
