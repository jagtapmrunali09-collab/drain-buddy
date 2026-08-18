import { useEffect, useState } from "react";
import { Clock, ImageOff } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api.js";
import { StatusBadge, PriorityBadge } from "../components/Badges.jsx";

function daysLeft(deadline) {
  const diff = new Date(deadline).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return { label: `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} overdue`, overdue: true };
  if (days === 0) return { label: "Due today", overdue: false };
  return { label: `${days} day${days === 1 ? "" : "s"} left`, overdue: false };
}

export default function ComplaintTracking() {
  const { token } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api
      .listComplaints(token)
      .then((data) => {
        setComplaints(data.complaints);
        if (data.complaints.length) setSelected(data.complaints[0]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-semibold text-ink mb-6">Track my complaints</h1>

      {loading ? (
        <p className="text-sm text-subink">Loading…</p>
      ) : complaints.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-sm text-subink">You haven't submitted any complaints yet.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-3">
            {complaints.map((c) => {
              const dl = daysLeft(c.deadline);
              return (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`card w-full text-left p-4 transition ${selected?.id === c.id ? "border-teal-500 ring-2 ring-teal-100" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="text-sm font-medium text-ink line-clamp-1">{c.title}</p>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-xs text-subink font-mono mb-2">{c.id}</p>
                  {c.status !== "resolved" && (
                    <p className={`text-xs flex items-center gap-1 ${dl.overdue ? "text-danger-600" : "text-subink"}`}>
                      <Clock size={12} /> {dl.label}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {selected && (
            <div className="lg:col-span-2 card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-ink">{selected.title}</h2>
                  <p className="text-xs text-subink font-mono">{selected.id} · {selected.category}</p>
                </div>
                <div className="flex gap-2">
                  <StatusBadge status={selected.status} />
                  <PriorityBadge priority={selected.priority} />
                </div>
              </div>

              <p className="text-sm text-ink/80 mb-5">{selected.description}</p>

              {selected.photoName ? (
                <img
                  src={`${api.base}/uploads/${selected.photoName}`}
                  alt="Complaint attachment"
                  className="rounded-lg border border-line mb-5 max-h-64 object-cover"
                />
              ) : (
                <div className="rounded-lg border border-dashed border-line mb-5 h-24 flex items-center justify-center gap-2 text-subink text-xs">
                  <ImageOff size={16} /> No photo attached
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="rounded-lg border border-line p-3.5">
                  <p className="text-xs text-subink mb-0.5">Reported on</p>
                  <p className="text-sm font-medium text-ink">{new Date(selected.createdAt).toLocaleString()}</p>
                </div>
                <div className="rounded-lg border border-line p-3.5">
                  <p className="text-xs text-subink mb-0.5">Resolution deadline</p>
                  <p className="text-sm font-medium text-ink">{new Date(selected.deadline).toLocaleString()}</p>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-ink mb-3">Status timeline</h3>
              <ol className="relative border-l border-line pl-5 space-y-5">
                {selected.updates.map((u, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[25px] top-0.5 h-3 w-3 rounded-full bg-teal-500 ring-4 ring-teal-50" />
                    <p className="text-sm text-ink">{u.note}</p>
                    <p className="text-xs text-subink mt-0.5">{new Date(u.at).toLocaleString()}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
