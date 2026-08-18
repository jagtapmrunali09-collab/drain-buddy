import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../api.js";
import RiskMap from "../components/RiskMap.jsx";
import { RiskBadge } from "../components/Badges.jsx";

export default function MapView() {
  const { token } = useAuth();
  const [wards, setWards] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.wards(token), api.sensors(token)])
      .then(([w, s]) => {
        setWards(w.wards);
        setSensors(s.sensors);
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-semibold text-ink mb-1">City flood risk map</h1>
      <p className="text-sm text-subink mb-6">Live ward-level risk, computed from IoT sensors and AI analysis of drain conditions.</p>

      {loading ? (
        <p className="text-sm text-subink">Loading map…</p>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RiskMap wards={wards} sensors={sensors} height={480} />
          </div>
          <div className="card p-5 h-fit">
            <h3 className="text-sm font-semibold text-ink mb-4">Wards</h3>
            <ul className="space-y-2.5">
              {wards.map((w) => (
                <li key={w.id} className="flex items-center justify-between">
                  <span className="text-sm text-ink">{w.name}</span>
                  <RiskBadge risk={w.risk} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
