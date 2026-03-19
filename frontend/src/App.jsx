import { useEffect } from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import HomePage from "./HomePage";
import MapPage from "./MapPage";
import BusinessPage from "./BusinessPage";
import AdminPage from "./AdminPage";

function BottomNav() {
const linkStyle = ({ isActive }) => ({
flex: 1,
textAlign: "center",
padding: "12px 6px",
textDecoration: "none",
color: isActive ? "#2563eb" : "#6b7280",
fontWeight: isActive ? 700 : 500,
fontSize: "14px",
background: "#fff",
});

return (
<nav
style={{
display: "flex",
borderTop: "1px solid #e5e7eb",
background: "#fff",
flexShrink: 0,
}}
>
<NavLink to="/" end style={linkStyle}>
Акції
</NavLink>
<NavLink to="/map" style={linkStyle}>
Карта
</NavLink>
<NavLink to="/business" style={linkStyle}>
Бізнес
</NavLink>
<NavLink to="/admin" style={linkStyle}>
Адмін
</NavLink>
</nav>
);
}

function App() {
const location = useLocation();
const isMapPage = location.pathname.startsWith("/map");
const tg = typeof window !== "undefined" ? window.Telegram?.WebApp : null;
const telegramBg = tg?.themeParams?.bg_color;

useEffect(() => {
const webApp = window.Telegram?.WebApp;
if (!webApp) return;

try {
webApp.ready();
webApp.expand();
} catch (e) {
console.warn("Telegram init error:", e);
}

const bg = webApp?.themeParams?.bg_color;
if (bg) document.body.style.background = bg;
}, []);

// 👉 MAP — full screen
if (isMapPage) {
return (
<div
style={{
width: "100%",
height: "100vh",
display: "flex",
flexDirection: "column",
background: telegramBg || "#fff",
}}
>
<div style={{ flex: 1, minHeight: 0 }}>
<MapPage />
</div>
<BottomNav />
</div>
);
}

// 👉 ВСІ ІНШІ СТОРІНКИ
return (
<div
style={{
minHeight: "100vh",
width: "100%",
background: "#f5f7fb",
display: "flex",
flexDirection: "column",
}}
>
<div
style={{
width: "100%",
maxWidth: 480,
margin: "0 auto",
background: "#ffffff",
borderRadius: 16,
minHeight: "100vh",
display: "flex",
flexDirection: "column",
overflow: "hidden",
boxShadow: "0 0 30px rgba(0,0,0,0.05)",
}}
>
<div style={{ flex: 1, minHeight: 0 }}>
<Routes>
<Route path="/" element={<HomePage />} />
<Route path="/business" element={<BusinessPage />} />
<Route path="/admin" element={<AdminPage />} />
</Routes>
</div>

<BottomNav />
</div>
</div>
);
}

export default App;