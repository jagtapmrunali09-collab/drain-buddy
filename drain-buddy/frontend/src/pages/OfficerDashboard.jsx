import { useEffect, useState, useCallback } from "react";
import { Activity, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api.js";
import RiskMap from "../components/RiskMap.jsx";
import { RiskBadge, StatusBadge, PriorityBadge } from "../components/Badges.jsx";

const TABS = [
  { key: "overview", label: "Live monitoring" },
  { key: "complaints", label: "Citizen complaints" },
];

const SENSOR_TYPE_LABEL = { "water-level": "Water level", blockage: "Blockage", flow: "Flow rate" };

function timeAgo(iso) {
  const s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

export default function OfficerDashboard() {
  const { token, user } = useAuth();
  const [tab, setTab] = useState("overview");
  const [wards, setWards] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const loadAll = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      try {
        const [w, s, c] = await Promise.all([api.wards(token), api.sensors(token), api.listComplaints(token)]);
        setWards(w.wards);
        setSensors(s.sensors);
        setComplaints(c.complaints);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token]
  );

  useEffect(() => {
    loadAll();
    const interval = setInterval(() => loadAll(true), 8000);
    return () => clearInterval(interval);
  }, [loadAll]);

  async function ackSensor(id) {
    await api.ackSensor(token, id);
    loadAll(true);
  }

  async function updateComplaint(id, payload) {
    const data = await api.updateComplaint(token, id, payload);
    setComplaints((prev) => prev.map((c) => (c.id === id ? data.complaint : c)));
  }

  const criticalSensors = sensors.filter((s) => s.status === "critical");
  const filteredComplaints = statusFilter === "all" ? complaints : complaints.filter((c) => c.status === statusFilter);

  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-subink font-mono uppercase tracking-wide">Municipal Control Room</p>
          <h1 className="text-2xl font-semibold text-ink">Hello, {user?.name}</h1>
        </div>
        <button onClick={() => loadAll(true)} className="btn-secondary !py-2">
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {criticalSensors.length > 0 && (
        <div className="rounded-xl2 border border-danger-500/30 bg-danger-100 px-5 py-3.5 mb-6 flex items-center gap-3">
          <AlertTriangle className="text-danger-600 shrink-0" size={18} />
          <p className="text-sm text-danger-600">
            <span className="font-semibold">{criticalSensors.length} sensor{criticalSensors.length > 1 ? "s" : ""}</span> reporting critical conditions right now — check Live monitoring.
          </p>
        </div>
      )}

      <div className="flex gap-2 mb-6 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-1 pb-3 -mb-px border-b-2 text-sm font-medium transition ${
              tab === t.key ? "border-teal-500 text-teal-600" : "border-transparent text-subink hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-subink">Loading control room data…</p>
      ) : tab === "overview" ? (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RiskMap wards={wards} sensors={sensors} complaints={complaints} height={420} onSensorClick={() => {}} />
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
                <Activity size={16} className="text-teal-600" /> Sensor feed
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-subink uppercase tracking-wide">
                      <th className="py-2 pr-3">Sensor</th>
                      <th className="py-2 pr-3">Type</th>
                      <th className="py-2 pr-3">Reading</th>
                      <th className="py-2 pr-3">Status</th>
                      <th className="py-2 pr-3">Updated</th>
                      <th className="py-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {sensors.map((s) => (
                      <tr key={s.id}>
                        <td className="py-2.5 pr-3 font-mono text-xs">{s.id}</td>
                        <td className="py-2.5 pr-3">{SENSOR_TYPE_LABEL[s.type]}</td>
                        <td className="py-2.5 pr-3 font-mono">{s.value} {s.unit}</td>
                        <td className="py-2.5 pr-3">
                          <span
                            className={
                              s.status === "critical" ? "badge-high" : s.status === "warning" ? "badge-medium" : "badge-low"
                            }
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="py-2.5 pr-3 text-xs text-subink">{timeAgo(s.updatedAt)}</td>
                        <td className="py-2.5">
                          {s.status !== "normal" && (
                            <button onClick={() => ackSensor(s.id)} className="text-xs font-semibold text-teal-600 flex items-center gap-1">
                              <CheckCircle2 size={13} /> Acknowledge
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card p-5 h-fit">
            <h3 className="text-sm font-semibold text-ink mb-4">Ward risk summary</h3>
            <ul className="space-y-2.5">
              {wards.map((w) => (
                <li key={w.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-ink">{w.name}</p>
                    <p className="text-xs text-subink">{w.drains} drains monitored</p>
                  </div>
                  <RiskBadge risk={w.risk} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap gap-2 mb-5">
            {["all", "received", "in-progress", "resolved"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition ${
                  statusFilter === s ? "bg-teal-500 border-teal-500 text-white" : "border-line text-subink hover:border-teal-500"
                }`}
              >
                {s === "all" ? "All" : s.replace("-", " ")}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredComplaints.length === 0 && <p className="text-sm text-subink">No complaints match this filter.</p>}
            {filteredComplaints.map((c) => (
              <ComplaintRow key={c.id} complaint={c} onUpdate={updateComplaint} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ComplaintRow({ complaint, onUpdate }) {
  const [deadline, setDeadline] = useState(complaint.deadline.slice(0, 16));

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-sm font-semibold text-ink">{complaint.title}</p>
          <p className="text-xs text-subink font-mono">{complaint.id} · {complaint.category} · by {complaint.citizenName}</p>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={complaint.status} />
          <PriorityBadge priority={complaint.priority} />
        </div>
      </div>
      <p className="text-sm text-ink/80 mb-4">{complaint.description}</p>

      <div className="grid sm:grid-cols-4 gap-3 items-end">
        <div>
          <label className="label">Status</label>
          <select
            className="input"
            value={complaint.status}
            onChange={(e) => onUpdate(complaint.id, { status: e.target.value })}
          >
            <option value="received">Received</option>
            <option value="in-progress">In progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <div>
          <label className="label">Priority</label>
          <select
            className="input"
            value={complaint.priority}
            onChange={(e) => onUpdate(complaint.id, { priority: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="sm:col-span-1">
          <label className="label">Deadline</label>
          <input
            type="datetime-local"
            className="input"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        <button
          onClick={() => onUpdate(complaint.id, { deadline: new Date(deadline).toISOString() })}
          className="btn-secondary"
        >
          Save deadline
        </button>
      </div>
    </div>
  );
}
