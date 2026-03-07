mport { useState, useEffect } from "react";

const API = "https://sale-bot-production-7ac2.up.railway.app";

export default function App() {
  const [offers, setOffers] = useState([]);
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetch(`${API}/offers`)
      .then(r => r.json())
      .then(setOffers);
  }, [district, category]);

  const filtered = offers.filter(o => 
    (district ? o.district === district : true) &&
    (category ? o.category === category : true)
  );

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>🏷️ Sale Bot</h1>
      <select onChange={e => setDistrict(e.target.value)} style={{ marginRight: 10, padding: 8 }}>
        <option value="">Всі райони</option>
        <option value="Позняки">Позняки</option>
        <option value="Осокорки">Осокорки</option>
        <option value="Харківська">Харківська</option>
      </select>
      <select onChange={e => setCategory(e.target.value)} style={{ padding: 8 }}>
        <option value="">Всі категорії</option>
        <option value="Кафе">Кафе</option>
        <option value="Салони краси">Салони краси</option>
        <option value="Фітнес">Фітнес</option>
      </select>
      {filtered.map(o => (
        <div key={o.id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 15, marginTop: 15 }}>
          <h3>{o.title}</h3>
          <p>{o.description}</p>
          <b style={{ color: "green" }}>{o.discount}</b>
          <p>📍 {o.district || "Позняки"}</p>
        </div>
      ))}
    </div>
  );
}