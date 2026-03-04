import { useState, useEffect } from "react";

const API = "http://localhost:3001";

export default function App() {
  const [offers, setOffers] = useState([]);
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (district) params.append("district", district);
    if (category) params.append("category", category);
    fetch(`${API}/offers?${params}`)
      .then(r => r.json())
      .then(setOffers);
  }, [district, category]);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>🏷️ Sale Bot</h1>

      {/* Фільтри */}
      <div style={{ marginBottom: 20 }}>
        <select onChange={e => setDistrict(e.target.value)} value={district}>
          <option value="">Всі райони</option>
          <option value="Позняки">Позняки</option>
          <option value="Осокорки">Осокорки</option>
          <option value="Харківська">Харківська</option>
        </select>

        <select onChange={e => setCategory(e.target.value)} value={category} style={{ marginLeft: 10 }}>
          <option value="">Всі категорії</option>
          <option value="Кафе та ресторани">Кафе та ресторани</option>
          <option value="Салони краси">Салони краси</option>
          <option value="Фітнес">Фітнес</option>
        </select>
      </div>

      {/* Картки акцій */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {offers.map(offer => (
          <div key={offer.id} style={{
            border: "1px solid #ddd", borderRadius: 12,
            padding: 16, width: 220, boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            <h3>{offer.business}</h3>
            <p>{offer.title}</p>
            <span style={{
              background: "#ff4757", color: "#fff",
              padding: "4px 10px", borderRadius: 20, fontWeight: "bold"
            }}>{offer.discount}</span>
            <p style={{ marginTop: 10, color: "#555" }}>📍 {offer.district}</p>
            <p style={{ color: "#555" }}>📞 {offer.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}