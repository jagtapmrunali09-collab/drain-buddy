import { MapContainer, TileLayer, CircleMarker, Popup, Marker } from "react-leaflet";
import L from "leaflet";

const RISK_COLOR = { low: "#2E9E5B", medium: "#F2A20C", high: "#D64545" };
const SENSOR_COLOR = { normal: "#2E9E5B", warning: "#F2A20C", critical: "#D64545" };

const pinIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#1B3A6B;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.35)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export default function RiskMap({
  wards = [],
  sensors = [],
  complaints = [],
  center = [18.52, 73.86],
  zoom = 11,
  height = 420,
  onSensorClick,
}) {
  return (
    <div style={{ height }} className="overflow-hidden rounded-xl2 border border-line">
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {wards.map((w) => (
          <CircleMarker
            key={w.id}
            center={[w.lat, w.lng]}
            radius={w.risk === "high" ? 22 : w.risk === "medium" ? 16 : 11}
            pathOptions={{
              color: RISK_COLOR[w.risk] || RISK_COLOR.low,
              fillColor: RISK_COLOR[w.risk] || RISK_COLOR.low,
              fillOpacity: 0.18,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{w.name}</p>
                <p className="text-xs text-subink capitalize">Risk level: {w.risk}</p>
                <p className="text-xs text-subink">{w.drains} monitored drains</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {sensors.map((s) => (
          <CircleMarker
            key={s.id}
            center={[s.lat, s.lng]}
            radius={7}
            pathOptions={{
              color: SENSOR_COLOR[s.status] || SENSOR_COLOR.normal,
              fillColor: SENSOR_COLOR[s.status] || SENSOR_COLOR.normal,
              fillOpacity: 0.85,
              weight: 1,
            }}
            eventHandlers={onSensorClick ? { click: () => onSensorClick(s) } : undefined}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{s.id} · {s.type.replace("-", " ")}</p>
                <p className="text-xs text-subink capitalize">Status: {s.status}</p>
                <p className="text-xs text-subink">{s.value} {s.unit}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {complaints
          .filter((c) => c.lat && c.lng)
          .map((c) => (
            <Marker key={c.id} position={[c.lat, c.lng]} icon={pinIcon}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{c.title}</p>
                  <p className="text-xs text-subink">{c.id} · {c.status}</p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
