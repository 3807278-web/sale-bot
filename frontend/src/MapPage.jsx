import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DISTRICT_COORDS = {
  "Позняки": [50.4089, 30.6416],
  "Осокорки": [50.3956, 30.6165],
  "Харківська": [50.4270, 30.6520],
};

const FALLBACK_OFFERS = [
  {
    id: 1,
    businessName: "Pizza Day",
    title: "Знижка 20% на піцу",
    discount: "-20%",
    district: "Позняки",
  },
  {
    id: 2,
    businessName: "Barber Style",
    title: "Стрижка зі знижкою",
    discount: "-30%",
    district: "Осокорки",
  },
  {
    id: 3,
    businessName: "FitGym",
    title: "Місячний абонемент",
    discount: "-25%",
    district: "Харківська",
  },
];

export default function MapPage({ offers = [] }) {
  const source = Array.isArray(offers) && offers.length > 0 ? offers : FALLBACK_OFFERS;

  return (
    <div style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)" }}>
      <h1 style={{ margin: 0, padding: "16px 16px 8px", fontSize: 24 }}>Карта</h1>
      <div style={{ width: "100%", height: "80vh" }}>
        <MapContainer
          center={[50.4501, 30.5234]}
          zoom={12}
          style={{ width: "100%", height: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {source.filter((o) => o.district && DISTRICT_COORDS[o.district]).map((o) => (
            <CircleMarker
              key={o.id}
              center={DISTRICT_COORDS[o.district]}
              radius={10}
              pathOptions={{
                color: "#178AD8",
                fillColor: "#178AD8",
                fillOpacity: 0.9,
              }}
            >
              <Popup>
                <div>
                  <div style={{ fontWeight: 700 }}>{o.businessName || o.business_name || "Бізнес"}</div>
                  <div style={{ marginTop: 4 }}>{o.title}</div>
                  {o.discount && (
                    <div style={{ marginTop: 6, color: "#178AD8", fontWeight: 600 }}>
                      {o.discount}
                    </div>
                  )}
                  {o.district && (
                    <div style={{ marginTop: 6, fontSize: 12, color: "#666" }}>
                      {o.district}
                    </div>
                  )}
                  <button
                    type="button"
                    style={{
                      marginTop: 8,
                      padding: "6px 10px",
                      borderRadius: 8,
                      border: "none",
                      background: "#178AD8",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      const [lat, lng] = DISTRICT_COORDS[o.district];
                      window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
                    }}
                  >
                    Маршрут
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
