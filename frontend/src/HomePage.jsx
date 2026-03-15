import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const KYIV_CENTER = [50.4501, 30.5234];
const DISTRICT_COORDS = {
  Позняки: [50.4089, 30.6416],
  Осокорки: [50.3956, 30.6165],
  Харківська: [50.427, 30.652],
};

const CITIES = [{ id: "kyiv", name: "Київ" }];
const DISTRICTS = [
  { id: "poznaky", name: "Позняки" },
  { id: "osokorky", name: "Осокорки" },
  { id: "kharkivska", name: "Харківська" },
];
const CATEGORIES = [
  "Кафе",
  "Ресторани",
  "Кава",
  "Фастфуд",
  "Піцерії",
  "Барбершопи",
  "Салони краси",
  "Манікюр",
  "Фітнес",
  "Йога",
  "Масаж",
  "Спа",
  "Аптеки",
  "Медичні центри",
  "Стоматологія",
  "Автосервіс",
  "Автомийка",
  "Шиномонтаж",
  "Освітні курси",
  "Англійська",
  "IT курси",
  "Дитячі центри",
  "Розваги",
  "Кіно",
  "Квести",
  "Магазини",
  "Одяг",
  "Електроніка",
  "Квіти",
  "Подарунки",
];

const MOCK_OFFERS = [
  {
    id: 1,
    businessName: "Піцерія Napoli",
    title: "Дві піци за ціною однієї",
    district: "Позняки",
    discount: "-50%",
    description: "При замовленні двох піц середнього розміру — друга в подарунок.",
    phone: "+380671234567",
    category: "Їжа",
  },
  {
    id: 2,
    businessName: "Кавʼярня Coffee Lab",
    title: "Знижка на каву зранку",
    district: "Осокорки",
    discount: "-30%",
    description: "З 8:00 до 11:00 — мінус 30% на будь-яку каву.",
    phone: "+380501112233",
    category: "Кава",
  },
  {
    id: 3,
    businessName: "Студія краси Look",
    title: "Стрижка + укладка",
    district: "Харківська",
    discount: "-20%",
    description: "Комплекс стрижка та укладка для нових клієнтів.",
    phone: "+380661234567",
    category: "Краса",
  },
];

export default function HomePage({ offers = [] }) {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("kyiv");
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("");
  const [selectedOfferId, setSelectedOfferId] = useState(null);

  const dataSource = Array.isArray(offers) && offers.length > 0 ? offers : MOCK_OFFERS;
  let filtered = dataSource.filter((o) => {
    const matchSearch =
      !search.trim() ||
      (o.title || "").toLowerCase().includes(search.trim().toLowerCase()) ||
      (o.businessName || o.business_name || "").toLowerCase().includes(search.trim().toLowerCase());
    const matchDistrict = !district || (o.district || "") === (DISTRICTS.find((d) => d.id === district)?.name ?? district);
    const matchCategory = !category || (o.category || "") === category;
    return matchSearch && matchDistrict && matchCategory;
  });

  return (
    <div style={{ padding: 16, paddingBottom: 72 }}>
      <h1 style={{ margin: "0 0 16px", fontSize: 24 }}>Акції</h1>

      <input
        type="text"
        placeholder="Пошук акцій або закладів"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 12px",
          marginBottom: 12,
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          boxSizing: "border-box",
          fontSize: 16,
        }}
      />

      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 12,
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          fontSize: 16,
        }}
      >
        {CITIES.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        value={district}
        onChange={(e) => setDistrict(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 12,
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          fontSize: 16,
        }}
      >
        <option value="">Район</option>
        {DISTRICTS.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      <div style={{ marginBottom: 16, borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb", height: 200 }}>
        <MapContainer
          center={KYIV_CENTER}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {MOCK_OFFERS.filter((o) => o.district && DISTRICT_COORDS[o.district]).map((o) => (
            <Marker
              key={o.id}
              position={DISTRICT_COORDS[o.district]}
              eventHandlers={{
                click: () => {
                  setSelectedOfferId(o.id);
                  document.getElementById(`offer-${o.id}`)?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                },
              }}
            >
              <Popup>
                <div style={{ minWidth: 140 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{o.businessName || o.business_name || "Бізнес"}</div>
                  <div style={{ fontSize: 14, marginBottom: 4 }}>{o.title}</div>
                  {o.discount && (
                    <span style={{ display: "inline-block", padding: "2px 6px", borderRadius: 4, background: "#dcfce7", color: "#166534", fontSize: 12, fontWeight: 600 }}>
                      {o.discount}
                    </span>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          paddingBottom: 6,
          marginBottom: 16,
        }}
      >
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(category === c ? "" : c)}
            style={{
              flexShrink: 0,
              padding: "8px 14px",
              borderRadius: 20,
              border: category === c ? "none" : "1px solid #ddd",
              background: category === c ? "#178AD8" : "white",
              color: category === c ? "white" : "inherit",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontSize: 14,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {filtered.map((o) => (
          <div
            id={`offer-${o.id}`}
            key={o.id}
            style={{
              border: o.id === selectedOfferId ? "2px solid #178AD8" : "1px solid #eee",
              background: o.id === selectedOfferId ? "#F5FAFF" : "#fff",
              borderRadius: 12,
              padding: 14,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
              {o.businessName || o.business_name || "Бізнес"}
            </div>
            <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>{o.title}</h3>
            {o.district && (
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>{o.district}</div>
            )}
            {o.discount && (
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: "#dcfce7",
                  color: "#166534",
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                {o.discount}
              </span>
            )}
            {o.description && (
              <p style={{ margin: "8px 0 12px", fontSize: 13, color: "#374151", lineHeight: 1.4 }}>
                {o.description}
              </p>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <button
                type="button"
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Маршрут
              </button>
              {o.phone && (
                <a
                  href={`tel:${o.phone}`}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    fontSize: 13,
                    cursor: "pointer",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  Подзвонити
                </a>
              )}
              <button
                type="button"
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: "#178AD8",
                  color: "#fff",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Деталі
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          style={{
            padding: 24,
            textAlign: "center",
            color: "#64748b",
            background: "#f8fafc",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
          }}
        >
          За обраними фільтрами акцій не знайдено
        </div>
      )}
    </div>
  );
}
