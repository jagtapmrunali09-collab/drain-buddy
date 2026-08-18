const RISK_DOT = { low: "bg-success-500", medium: "bg-amber-400", high: "bg-danger-500" };

export default function LiveTicker({ wards = [] }) {
  const items = wards.length ? wards : [];
  const doubled = [...items, ...items];

  return (
    <div className="w-full overflow-hidden border-y border-line bg-indigo-500 text-white">
      <div className="flex items-center whitespace-nowrap py-2.5">
        <span className="shrink-0 px-4 text-xs font-mono font-semibold tracking-wide bg-indigo-600 h-full py-1.5 rounded-r-full">
          LIVE WARD STATUS
        </span>
        <div className="flex tick">
          {doubled.map((w, i) => (
            <span key={i} className="flex items-center gap-2 px-6 text-xs font-mono">
              <span className={`h-2 w-2 rounded-full ${RISK_DOT[w.risk] || RISK_DOT.low}`} />
              {w.name} — {w.risk.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
