import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://sale-bot-production-7ac2.up.railway.app";

const CITIES = ["Київ", "Бровари", "Бориспіль", "Ірпінь"];

const DISTRICTS_BY_CITY = {
Київ: ["Позняки", "Осокорки", "Харківська"],
Бровари: ["Центр"],
Бориспіль: ["Центр"],
Ірпінь: ["Центр"],
};

const CATEGORY_COLORS = {
"Всі": "#64748b",
"Їжа": "#f59e0b",
"Краса": "#8b5cf6",
"Фітнес": "#22c55e",
"Масаж": "#14b8a6",
"Медицина": "#06b6d4",
"Авто": "#ef4444",
"Освіта": "#6366f1",
"Розваги": "#ec4899",
"Одяг": "#f97316",
"Дитяче": "#10b981",
"Подарунки": "#eab308",
"Послуги": "#94a3b8",
};

const CATEGORIES = [
"Всі",
"Їжа",
"Краса",
"Фітнес",
"Масаж",
"Медицина",
"Авто",
"Освіта",
"Розваги",
"Одяг",
"Дитяче",
"Подарунки",
"Послуги",
];

export default function HomePage() {
const navigate = useNavigate();

const [offers, setOffers] = useState([]);
const [city, setCity] = useState("Київ");
const [district, setDistrict] = useState("");
const [searchQuery, setSearchQuery] = useState("");
const [selectedCategory, setSelectedCategory] = useState("Всі");
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
loadOffers();
}, []);

async function loadOffers() {
try {
setLoading(true);
setError("");

const response = await fetch(`${API}/offers`);
if (!response.ok) {
throw new Error("Не вдалося завантажити акції");
}

const data = await response.json();
setOffers(Array.isArray(data) ? data : []);
} catch (err) {
console.error(err);
setError("Не вдалося завантажити акції");
} finally {
setLoading(false);
}
}

const approvedOffers = useMemo(() => {
return offers.filter((offer) => offer.is_approved === true);
}, [offers]);

const filtered = useMemo(() => {
return approvedOffers.filter((offer) => {
const offerCity = offer.city || "Київ";
const offerDistrict = offer.district || "";
const offerCategory = offer.category || "";
const offerBusiness = offer.businessName || offer.business_name || "";
const searchText = `${offer.title || ""} ${offer.description || ""} ${offerBusiness}`.toLowerCase();
const query = searchQuery.trim().toLowerCase();

const matchCity = city ? offerCity === city : true;
const matchDistrict = district ? offerDistrict === district : true;
const matchCategory =
selectedCategory === "Всі" ? true : offerCategory === selectedCategory;
const matchSearch = query ? searchText.includes(query) : true;

return matchCity && matchDistrict && matchCategory && matchSearch;
});
}, [approvedOffers, city, district, selectedCategory, searchQuery]);

const hotOffers = filtered.slice(0, 6);

function openDetails(offer) {
navigate("/map", {
state: {
offerId: offer.id,
title: offer.title,
description: offer.description,
discount: offer.discount,
city: offer.city,
district: offer.district,
lat: offer.lat,
lng: offer.lng,
},
});
}

function openRoute(offer) {
if (offer.lat && offer.lng) {
const url = `https://www.google.com/maps?q=${offer.lat},${offer.lng}`;
window.open(url, "_blank");
return;
}

const parts = [offer.city, offer.district, offer.address].filter(Boolean);
if (parts.length > 0) {
const query = encodeURIComponent(parts.join(", "));
window.open(`https://www.google.com/maps?q=${query}`, "_blank");
return;
}

alert("Для цієї акції ще не задано адресу або координати");
}

function callOffer(offer) {
if (!offer.phone) {
alert("Телефон для цієї акції не вказано");
return;
}

window.location.href = `tel:${offer.phone}`;
}

function renderOfferCard(offer, compact = false) {
const businessName = offer.businessName || offer.business_name || "Бізнес";
const category = offer.category || "Послуги";
const chipColor = CATEGORY_COLORS[category] || "#94a3b8";

return (
<div
key={offer.id}
style={{
minWidth: compact ? 260 : "100%",
width: compact ? 260 : "100%",
flexShrink: 0,
background: "#ffffff",
border: "1px solid #e5e7eb",
borderRadius: 16,
padding: 14,
boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
marginBottom: compact ? 0 : 12,
boxSizing: "border-box",
}}
>
<div style={{ display: "flex", gap: 14 }}>
<div
style={{
width: 92,
minWidth: 92,
height: 92,
borderRadius: 14,
background: "#f8fafc",
border: "1px solid #e5e7eb",
position: "relative",
}}
>
<div
style={{
position: "absolute",
top: 8,
left: 8,
background: "#e75b65",
color: "#ffffff",
borderRadius: 999,
padding: "4px 8px",
fontSize: 12,
fontWeight: 700,
}}
>
{offer.discount || "-"}
</div>
</div>

<div style={{ flex: 1, minWidth: 0 }}>
<div
style={{
display: "flex",
gap: 8,
alignItems: "center",
flexWrap: "wrap",
marginBottom: 8,
}}
>
<span
style={{
padding: "3px 8px",
borderRadius: 999,
fontSize: 12,
fontWeight: 600,
background: chipColor + "22",
color: chipColor,
}}
>
{category}
</span>

<span
style={{
fontSize: 14,
color: "#6b7280",
}}
>
{businessName}
</span>
</div>

<div
style={{
fontSize: compact ? 16 : 17,
fontWeight: 800,
color: "#111827",
lineHeight: 1.2,
marginBottom: 8,
}}
>
{offer.title}
</div>

<div
style={{
fontSize: 14,
color: "#4b5563",
lineHeight: 1.35,
}}
>
{offer.description}
</div>
</div>
</div>

{!compact && (
<div
style={{
display: "grid",
gridTemplateColumns: offer.phone ? "1fr 1fr 1fr" : "1fr 1fr",
gap: 10,
marginTop: 14,
}}
>
<button
onClick={() => openDetails(offer)}
style={{
height: 44,
border: "none",
borderRadius: 12,
background: "#2563eb",
color: "#ffffff",
fontWeight: 600,
cursor: "pointer",
}}
>
Деталі
</button>

<button
onClick={() => openRoute(offer)}
style={{
height: 44,
border: "none",
borderRadius: 12,
background: "#f3f4f6",
color: "#111",
fontWeight: 600,
cursor: "pointer",
}}
>
Маршрут
</button>

{offer.phone ? (
<button
onClick={() => callOffer(offer)}
style={{
height: 42,
border: "1px solid #d1d5db",
borderRadius: 12,
background: "#ffffff",
color: "#374151",
fontWeight: 700,
cursor: "pointer",
}}
>
Подзвонити
</button>
) : null}
</div>
)}
</div>
);
}

return (
<div
style={{
background: "#f5f7fb",
minHeight: "100%",
padding: 16,
boxSizing: "border-box",
}}
>
<style>
{`
.hot-offers-scroll::-webkit-scrollbar {
display: none;
}

.category-scroll::-webkit-scrollbar {
display: none;
}
`}
</style>

<div style={{ width: "100%", boxSizing: "border-box" }}>
<div
style={{
fontSize: 20,
fontWeight: 700,
color: "#111827",
marginBottom: 4,
}}
>
SaleBot
</div>

<div
style={{
padding: 14,
background: "linear-gradient(135deg, #2563eb, #3b82f6)",
color: "#ffffff",
borderRadius: 14,
marginBottom: 12,
}}
>
<div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
Знижки поруч з тобою
</div>
<div style={{ fontSize: 14, opacity: 0.9 }}>
Кафе, краса, спорт — відкрий вигідні пропозиції поруч
</div>

<button
onClick={() => {
const el = document.getElementById("hot-offers-anchor");
el?.scrollIntoView({ behavior: "smooth", block: "start" });
}}
style={{
marginTop: 10,
background: "#ffffff",
color: "#2563eb",
height: 36,
borderRadius: 10,
fontWeight: 600,
border: "none",
cursor: "pointer",
}}
>
Переглянути поруч
</button>
</div>

<div id="hot-offers-anchor" style={{ height: 0 }} />

<div style={{ marginBottom: 16 }}>
<div
style={{
fontSize: 15,
fontWeight: 700,
color: "#111827",
marginBottom: 10,
}}
>
🔥 Гарячі акції
</div>

<div
className="hot-offers-scroll"
style={{
display: "flex",
overflowX: "auto",
gap: 12,
paddingBottom: 8,
scrollbarWidth: "none",
msOverflowStyle: "none",
}}
>
{hotOffers.map((offer) => renderOfferCard(offer, true))}
</div>
</div>

<div
style={{
background: "#ffffff",
borderRadius: 16,
border: "1px solid #e5e7eb",
padding: 14,
marginBottom: 16,
boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
}}
>
<div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
<div style={{ flex: 1 }}>
<label
style={{
display: "block",
marginBottom: 4,
fontSize: 12,
fontWeight: 500,
color: "#64748b",
}}
>
Місто
</label>
<select
value={city}
onChange={(e) => {
setCity(e.target.value);
setDistrict("");
}}
style={{
width: "100%",
padding: 10,
borderRadius: 10,
border: "1px solid #e2e8f0",
fontSize: 15,
background: "#fff",
}}
>
{CITIES.map((c) => (
<option key={c} value={c}>
{c}
</option>
))}
</select>
</div>

<div style={{ flex: 1 }}>
<label
style={{
display: "block",
marginBottom: 4,
fontSize: 12,
fontWeight: 500,
color: "#64748b",
}}
>
Район
</label>
<select
value={district}
onChange={(e) => setDistrict(e.target.value)}
style={{
width: "100%",
padding: 10,
borderRadius: 10,
border: "1px solid #e2e8f0",
fontSize: 15,
background: "#fff",
}}
disabled={!city}
>
<option value="">{city ? "Всі райони" : "—"}</option>
{city &&
(DISTRICTS_BY_CITY[city] || []).map((d) => (
<option key={d} value={d}>
{d}
</option>
))}
</select>
</div>
</div>

<div style={{ marginBottom: 16 }}>
<input
type="text"
placeholder="Пошук акцій..."
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
style={{
width: "100%",
padding: "12px 14px",
borderRadius: 12,
border: "1px solid #e2e8f0",
fontSize: 15,
background: "#fff",
boxSizing: "border-box",
}}
/>
</div>

<div
className="category-scroll"
style={{
display: "flex",
flexWrap: "nowrap",
overflowX: "auto",
overflowY: "hidden",
gap: "8px",
padding: "0 0 12px 0",
marginBottom: 16,
whiteSpace: "nowrap",
WebkitOverflowScrolling: "touch",
scrollbarWidth: "none",
msOverflowStyle: "none",
}}
>
{CATEGORIES.map((cat) => {
const isActive = selectedCategory === cat;
const color = CATEGORY_COLORS[cat] || "#94a3b8";

return (
<button
key={cat}
onClick={() => setSelectedCategory(cat)}
style={{
flexShrink: 0,
whiteSpace: "nowrap",
padding: "8px 14px",
borderRadius: 999,
border: "none",
background: isActive ? "#2563eb" : "#f3f4f6",
color: isActive ? "#ffffff" : "#111",
fontWeight: 600,
cursor: "pointer",
}}
>
{cat}
</button>
);
})}
</div>
</div>

{loading ? (
<div style={{ padding: 24, textAlign: "center", color: "#64748b" }}>
Завантаження...
</div>
) : error ? (
<div
style={{
padding: 24,
textAlign: "center",
color: "#dc2626",
fontWeight: 500,
}}
>
{error}
</div>
) : filtered.length === 0 ? (
<div style={{ padding: 24, textAlign: "center", color: "#64748b" }}>
Акцій поки немає
</div>
) : (
<div style={{ display: "grid", gap: 0, paddingBottom: 20 }}>
{filtered.map((o) => renderOfferCard(o))}
</div>
)}
</div>
</div>
);
}
