const NUMBERS = [
  { label: "Ambulance", number: "108" },
  { label: "Disaster Management / Flood Helpline", number: "1077" },
  { label: "Fire Brigade", number: "101" },
  { label: "Police", number: "100" },
  { label: "Municipal Corporation Control Room", number: "1800-123-4567" },
];

export default function EmergencyNumbers() {
  return (
    <div className="card p-5">
      <h3 className="text-base font-semibold text-ink mb-1">Emergency numbers</h3>
      <p className="text-xs text-subink mb-4">Tap a number to call directly in an emergency.</p>
      <ul className="space-y-2">
        {NUMBERS.map((n) => (
          <li key={n.label}>
            <a
              href={`tel:${n.number.replace(/[^\d+]/g, "")}`}
              className="flex items-center justify-between rounded-lg border border-line px-3.5 py-2.5 text-sm hover:border-danger-500 hover:bg-danger-100/40 transition"
            >
              <span className="text-ink">{n.label}</span>
              <span className="font-mono font-semibold text-danger-600">{n.number}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
