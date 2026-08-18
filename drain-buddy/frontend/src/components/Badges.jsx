export function RiskBadge({ risk }) {
  const cls = risk === "high" ? "badge-high" : risk === "medium" ? "badge-medium" : "badge-low";
  return <span className={cls}>{risk === "high" ? "High risk" : risk === "medium" ? "Medium risk" : "Low risk"}</span>;
}

const STATUS_LABEL = {
  received: "Received",
  "in-progress": "In progress",
  resolved: "Resolved",
};
const STATUS_CLASS = {
  received: "badge-medium",
  "in-progress": "badge-neutral",
  resolved: "badge-low",
};

export function StatusBadge({ status }) {
  return <span className={STATUS_CLASS[status] || "badge-neutral"}>{STATUS_LABEL[status] || status}</span>;
}

export function PriorityBadge({ priority }) {
  const cls = priority === "high" ? "badge-high" : priority === "low" ? "badge-low" : "badge-medium";
  return <span className={cls}>{priority} priority</span>;
}
