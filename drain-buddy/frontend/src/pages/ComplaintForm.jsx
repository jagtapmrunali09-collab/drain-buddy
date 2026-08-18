import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Camera, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api.js";
import { ReadAloudButton } from "../components/VoiceAssistant.jsx";

const CATEGORIES = ["Blockage", "Overflow", "Garbage", "Damaged drain cover", "Foul smell / sewage leak", "Other"];

export default function ComplaintForm() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", category: CATEGORIES[0] });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function detectLocation() {
    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by this browser.");
      return;
    }
    setLocating(true);
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocError("Could not get your location. You can still submit without it.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("category", form.category);
      if (location) {
        fd.append("lat", location.lat);
        fd.append("lng", location.lng);
      }
      if (photo) fd.append("photo", photo);
      const data = await api.createComplaint(token, fd);
      setSubmitted(data.complaint);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="container-page py-14 max-w-lg text-center">
        <span className="h-14 w-14 rounded-full bg-success-100 text-success-500 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={26} />
        </span>
        <h1 className="text-2xl font-semibold text-ink mb-2">Complaint submitted</h1>
        <p className="text-sm text-subink mb-1">
          Reference ID <span className="font-mono font-semibold text-ink">{submitted.id}</span>
        </p>
        <p className="text-sm text-subink mb-8">
          Expected resolution by {new Date(submitted.deadline).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}.
        </p>
        <div className="flex justify-center gap-3">
          <button onClick={() => navigate("/citizen/track")} className="btn-primary">View my complaints</button>
          <button onClick={() => navigate("/citizen")} className="btn-secondary">Back to dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10 max-w-2xl">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Report a drain issue</h1>
          <p className="text-sm text-subink mt-1">Give as much detail as you can — photos and location help crews respond faster.</p>
        </div>
        <ReadAloudButton text="Fill in a title, description, and category. You can attach a photo and tag your current location, then submit." />
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="label" htmlFor="title">Title</label>
          <input id="title" required className="input" placeholder="e.g. Overflowing drain near bus stop" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
        </div>

        <div>
          <label className="label" htmlFor="category">Category</label>
          <select id="category" className="input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" required rows={4} className="input resize-none" placeholder="Describe what you're seeing, since when, and any nearby landmark." value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <span className="label">Photo (optional)</span>
            <label className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line h-32 cursor-pointer hover:border-teal-500 transition overflow-hidden">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <>
                  <Camera size={20} className="text-subink" />
                  <span className="text-xs text-subink">Tap to add a photo</span>
                </>
              )}
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
            </label>
          </div>

          <div>
            <span className="label">Location (optional)</span>
            <div className="rounded-lg border border-line h-32 flex flex-col items-center justify-center gap-2 px-3 text-center">
              {location ? (
                <>
                  <MapPin size={20} className="text-teal-600" />
                  <span className="text-xs text-ink font-mono">
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </span>
                  <button type="button" onClick={detectLocation} className="text-xs text-teal-600 font-semibold">
                    Re-detect
                  </button>
                </>
              ) : (
                <button type="button" onClick={detectLocation} className="flex flex-col items-center gap-2">
                  <MapPin size={20} className="text-subink" />
                  <span className="text-xs text-subink">{locating ? "Detecting…" : "Use my current location"}</span>
                </button>
              )}
            </div>
            {locError && <p className="text-xs text-danger-600 mt-1.5">{locError}</p>}
          </div>
        </div>

        {error && <p className="text-sm text-danger-600 bg-danger-100 rounded-lg px-3.5 py-2.5">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Submitting…" : "Submit complaint"}
        </button>
      </form>
    </div>
  );
}
