import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const API = "https://sale-bot-production-7ac2.up.railway.app";
const KYIV_CENTER = [50.4501, 30.5234];

function categoryEmoji(category) {
  if (!category) return "📍";
  const c = String(category).toLowerCase();
  if (/кафе|ресторан|кава|фастфуд|піцері|їжа|pizza|food|cafe|coffee/.test(c)) return "☕";
  if (/салон|крас|манікюр|барбер|масаж|спа|beauty|salon|manicure|barber|massage/.test(c)) return "💇";
  if (/фітнес|йога|gym|fitness|yoga/.test(c)) return "💪";
  if (/аптек|медич|стоматолог|pharmacy|medical|dental/.test(c)) return "💊";
  if (/авто|мийк|шиномонтаж|auto|car|tire/.test(c)) return "🚗";
  if (/квіт|подарунк|flower|gift/.test(c)) return "🎁";
  return "📍";
}

export default function MapPage() {
  const [offers, setOffers] = useState([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    fetch(`${API}/offers/map`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        setOffers(Array.isArray(data) ? data : []);
        setLoadError(false);
      })
      .catch(() => {
        setOffers([]);
        setLoadError(true);
      });
  }, []);

  if (loadError) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Карта</h1>
        <p style={{ color: "#64748b" }}>Не вдалося завантажити карту</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)" }}>
      <h1 style={{ margin: 0, padding: "16px 16px 8px", fontSize: 24 }}>Карта</h1>
      <div style={{ width: "100%", height: "80vh" }}>
        <MapContainer
          center={KYIV_CENTER}
          zoom={12}
          style={{ width: "100%", height: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {offers
            .filter((o) => o.lat != null && o.lng != null && !Number.isNaN(Number(o.lat)) && !Number.isNaN(Number(o.lng)))
            .map((o) => {
              const position = [Number(o.lat), Number(o.lng)];
              const name = o.business_name || "Бізнес";
              const emoji = categoryEmoji(o.category);
              return (
                <Marker key={o.id} position={position}>
                  <Popup>
                    <div style={{ minWidth: 160 }}>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>
                        {emoji} {name}
                      </div>
                      {o.category && (
                        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>{o.category}</div>
                      )}
                      <div style={{ marginBottom: 4 }}>{o.title}</div>
                      {o.discount && (
                        <div style={{ color: "#178AD8", fontWeight: 600, marginBottom: 4 }}>{o.discount}</div>
                      )}
                      {o.address && (
                        <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>{o.address}</div>
                      )}
                      {o.phone && (
                        <div style={{ fontSize: 12, marginBottom: 6 }}>
                          <a href={`tel:${o.phone}`}>{o.phone}</a>
                        </div>
                      )}
                      <button
                        type="button"
                        style={{
                          marginTop: 4,
                          padding: "6px 10px",
                          borderRadius: 8,
                          border: "none",
                          background: "#178AD8",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: 13,
                        }}
                        onClick={() => {
                          window.open(`https://www.google.com/maps?q=${o.lat},${o.lng}`, "_blank");
                        }}
                      >
                        Маршрут
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>
    </div>
  );
}
