import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  Radio,
  MapPinned,
  Bell,
  Mic,
  Languages,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useLang } from "../context/LangContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import LiveTicker from "../components/LiveTicker.jsx";

const SEED_WARDS = [
  { name: "Kothrud", risk: "medium" },
  { name: "Shivajinagar", risk: "high" },
  { name: "Hadapsar", risk: "low" },
  { name: "Aundh", risk: "medium" },
  { name: "Kharadi", risk: "high" },
  { name: "Katraj", risk: "low" },
];

const FEATURES = [
  {
    icon: Camera,
    title: "Computer vision on every camera",
    body: "Existing CCTV feeds are analysed continuously to spot garbage build-up and blockages before they overflow.",
  },
  {
    icon: Radio,
    title: "IoT water-level & flow sensors",
    body: "Rugged sensors track water level, flow rate, and blockage percentage in real time across the drain network.",
  },
  {
    icon: MapPinned,
    title: "GIS-based risk scoring",
    body: "Location, elevation, drain capacity, and rainfall combine into a live risk score for every ward on the map.",
  },
  {
    icon: Bell,
    title: "Instant alerts & auto work orders",
    body: "The moment a sensor crosses a threshold, field crews get a prioritised work order — no manual dispatch delay.",
  },
];

const STEPS = [
  { title: "Report or detect", body: "A citizen reports an issue, or a sensor flags an anomaly." },
  { title: "AI prioritises", body: "Risk scoring ranks the issue against live ward conditions." },
  { title: "Crew dispatched", body: "Officers assign a deadline and route the nearest field crew." },
  { title: "Resolved & tracked", body: "Status updates flow back to the citizen automatically." },
];

export default function Landing() {
  const { t } = useLang();
  const { user } = useAuth();
  const [wards] = useState(SEED_WARDS);

  useEffect(() => {
    document.title = "Drain-Buddy | Predict. Prevent. Protect.";
  }, []);

  return (
    <div>
      <LiveTicker wards={wards} />

      {/* Hero */}
      <section className="container-page pt-14 pb-16 md:pt-20 md:pb-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="badge-neutral mb-5">
            <ShieldCheck size={14} /> AI + IoT drainage monitoring
          </span>
          <h1 className="text-4xl md:text-[3.25rem] leading-[1.08] font-semibold text-ink mb-5">
            {t("heroTitle")}
          </h1>
          <p className="text-subink text-base md:text-lg mb-8 max-w-xl">{t("heroSubtitle")}</p>
          <div className="flex flex-wrap gap-3">
            <Link to={user ? "/citizen/report" : "/signup"} className="btn-primary">
              {t("heroCtaCitizen")} <ArrowRight size={16} />
            </Link>
            <Link to={user && user.role === "officer" ? "/officer" : "/login"} className="btn-secondary">
              {t("heroCtaOfficer")}
            </Link>
          </div>
          <div className="flex items-center gap-5 mt-8 text-xs text-subink">
            <span className="flex items-center gap-1.5"><Mic size={14} /> Voice assistant built in</span>
            <span className="flex items-center gap-1.5"><Languages size={14} /> 3 languages supported</span>
          </div>
        </div>

        <div className="relative">
          <div className="pipe-divider mb-4" />
          <div className="card p-6 space-y-4">
            <p className="text-xs font-mono uppercase tracking-wide text-teal-600">Ward Control Room — live feed</p>
            <div className="space-y-3">
              {[
                { name: "S-102 · Shivajinagar", value: "87 cm water level", status: "high" },
                { name: "S-106 · Kharadi", value: "91% drain blocked", status: "high" },
                { name: "S-103 · Shivajinagar", value: "68% drain blocked", status: "medium" },
                { name: "S-101 · Kothrud", value: "22 cm water level", status: "low" },
              ].map((row) => (
                <div key={row.name} className="flex items-center justify-between rounded-lg border border-line px-3.5 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-ink">{row.name}</p>
                    <p className="text-xs text-subink font-mono">{row.value}</p>
                  </div>
                  <span
                    className={
                      row.status === "high" ? "badge-high" : row.status === "medium" ? "badge-medium" : "badge-low"
                    }
                  >
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-subink pt-1">Simulated preview — sign in for the live municipal dashboard.</p>
          </div>
        </div>
      </section>

      <div className="pipe-divider container-page" />

      {/* Features */}
      <section className="container-page py-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-ink mb-3 max-w-2xl">
          A single system connecting sensors, cameras, and citizens
        </h2>
        <p className="text-subink max-w-2xl mb-10">
          Drain-Buddy layers AI analysis over infrastructure your city already has, so it's a software upgrade, not a hardware overhaul.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-5">
              <span className="h-10 w-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <f.icon size={20} />
              </span>
              <h3 className="text-sm font-semibold text-ink mb-1.5">{f.title}</h3>
              <p className="text-xs text-subink leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-indigo-500 text-white py-16">
        <div className="container-page">
          <h2 className="text-2xl md:text-3xl font-semibold mb-10">From detection to resolution, tracked end to end</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative">
                <span className="font-mono text-3xl font-semibold text-teal-300">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-base font-semibold mt-2 mb-1.5">{s.title}</h3>
                <p className="text-sm text-white/70">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual dashboard CTA */}
      <section className="container-page py-16 grid md:grid-cols-2 gap-6">
        <div className="card p-7">
          <h3 className="text-lg font-semibold text-ink mb-2">For citizens</h3>
          <p className="text-sm text-subink mb-5">
            Report blocked drains with a photo and your location, track resolution deadlines, and get help in your language — with voice support.
          </p>
          <Link to={user ? "/citizen" : "/signup"} className="btn-primary">
            Open citizen portal <ArrowRight size={16} />
          </Link>
        </div>
        <div className="card p-7 bg-indigo-500 border-indigo-500 text-white">
          <h3 className="text-lg font-semibold mb-2">For municipal officers</h3>
          <p className="text-sm text-white/75 mb-5">
            Monitor every sensor and camera feed live, triage citizen complaints by AI-ranked priority, and set resolution deadlines.
          </p>
          <Link to={user && user.role === "officer" ? "/officer" : "/login"} className="btn bg-white text-indigo-600 hover:bg-white/90">
            Open officer dashboard <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
