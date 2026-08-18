import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FilePlus2, ListChecks, MapPinned, HelpCircle, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api.js";
import { StatusBadge } from "../components/Badges.jsx";
import EmergencyNumbers from "../components/EmergencyNumbers.jsx";
import WhatsAppButton from "../components/WhatsAppButton.jsx";

export default function CitizenDashboard() {
  const { user, token } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .listComplaints(token)
      .then((data) => setComplaints(data.complaints))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const open = complaints.filter((c) => c.status !== "resolved").length;

  return (
    <div className="container-page py-10 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="card p-6">
          <p className="text-sm text-subink">Welcome back,</p>
          <h1 className="text-2xl font-semibold text-ink">{user?.name}</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
            <div className="rounded-lg border border-line p-4">
              <p className="text-2xl font-semibold text-ink">{complaints.length}</p>
              <p className="text-xs text-subink">Total reports</p>
            </div>
            <div className="rounded-lg border border-line p-4">
              <p className="text-2xl font-semibold text-amber-500">{open}</p>
              <p className="text-xs text-subink">Currently open</p>
            </div>
            <div className="rounded-lg border border-line p-4">
              <p className="text-2xl font-semibold text-success-500">{complaints.length - open}</p>
              <p className="text-xs text-subink">Resolved</p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <Link to="/citizen/report" className="card p-5 hover:border-teal-500 transition group">
            <span className="h-10 w-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <FilePlus2 size={20} />
            </span>
            <h3 className="text-sm font-semibold text-ink mb-1 flex items-center gap-1.5">
              Report a drain issue <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
            </h3>
            <p className="text-xs text-subink">Add photos, tag your location, and describe the problem.</p>
          </Link>
          <Link to="/citizen/track" className="card p-5 hover:border-teal-500 transition group">
            <span className="h-10 w-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <ListChecks size={20} />
            </span>
            <h3 className="text-sm font-semibold text-ink mb-1 flex items-center gap-1.5">
              Track my complaints <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
            </h3>
            <p className="text-xs text-subink">See live status, priority, and resolution deadlines.</p>
          </Link>
          <Link to="/citizen/map" className="card p-5 hover:border-teal-500 transition group">
            <span className="h-10 w-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <MapPinned size={20} />
            </span>
            <h3 className="text-sm font-semibold text-ink mb-1 flex items-center gap-1.5">
              Flood risk map <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
            </h3>
            <p className="text-xs text-subink">View live ward risk levels across the city.</p>
          </Link>
          <Link to="/faq" className="card p-5 hover:border-teal-500 transition group">
            <span className="h-10 w-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <HelpCircle size={20} />
            </span>
            <h3 className="text-sm font-semibold text-ink mb-1 flex items-center gap-1.5">
              FAQ &amp; help <ArrowRight size={14} className="group-hover:translate-x-0.5 transition" />
            </h3>
            <p className="text-xs text-subink">Answers to common questions about reporting and response times.</p>
          </Link>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-semibold text-ink mb-4">Recent reports</h3>
          {loading ? (
            <p className="text-sm text-subink">Loading…</p>
          ) : complaints.length === 0 ? (
            <p className="text-sm text-subink">You haven't reported anything yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {complaints.slice(0, 4).map((c) => (
                <li key={c.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{c.title}</p>
                    <p className="text-xs text-subink font-mono">{c.id}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-ink mb-3">Need to reach the corporation now?</h3>
          <WhatsAppButton />
        </div>
        <EmergencyNumbers />
      </div>
    </div>
  );
}
