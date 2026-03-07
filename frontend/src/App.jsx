import { useState, useEffect } from "react";

const API = "https://sale-bot-production-7ac2.up.railway.app";

const CATEGORIES = {
  "🍔 Їжа та напої": ["Ресторани","Кафе","Піцерії","Суші / азіатська кухня","Бургери / фастфуд","Пекарні / кондитерські","Кав'ярні","Доставка їжі","Бари / паби","Кальянні"],
  "💄 Краса та догляд": ["Салони краси","Барбершопи","Манікюр / педикюр","Косметологія","Масаж","Лазерна епіляція","SPA салони","Перманентний макіяж"],
  "🏋️ Спорт та здоров'я": ["Фітнес клуби","Тренажерні зали","Йога студії","Танцювальні студії","Басейни","Спортивні секції"],
  "🛍️ Магазини": ["Одяг","Взуття","Аксесуари","Косметика","Електроніка","Техніка","Парфуми","Подарунки","Квіти"],
  "👶 Діти": ["Дитячі магазини","Дитячі кімнати","Розвиваючі центри","Дитячі гуртки","Дитячі свята"],
  "🚗 Авто": ["СТО","Шиномонтаж","Автомийки","Детейлінг","Запчастини","Оренда авто"],
  "🏠 Послуги": ["Ремонт техніки","Клінінг","Ремонт квартир","Хімчистки","Пральні","Доставка води"],
  "🎓 Освіта": ["Курси мов","IT курси","Онлайн навчання","Репетитори","Автошколи"],
  "🎮 Розваги": ["Кіно","Квести","Більярд","Боулинг","VR клуби","Антикафе","Ігрові клуби"],
  "🏥 Медицина": ["Аптеки","Стоматології","Медичні центри","Аналізи","Оптика"],
  "➕ Інше": ["Тату студії","Фотостудії","Туристичні агенції","Готелі / хостели","Коворкінги","Доставка квітів","Кейтеринг"]
};

const DISTRICTS = ["Позняки","Осокорки","Харківська"];

export default function App() {
  const [offers, setOffers] = useState([]);
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetch(`${API}/offers`)
      .then(r => r.json())
      .then(setOffers);
  }, []);

  const filtered = offers.filter(o =>
    (district ? o.district === district : true) &&
    (category ? o.category === category : true)
  );

  return (
    <div style={{ padding: 16, fontFamily: "sans-serif", maxWidth: 480, margin: "0 auto" }}>
      <h2 style={{ textAlign: "center" }}>🏷️ Sale Bot — Акції поруч</h2>

      <select onChange={e => setDistrict(e.target.value)} style={{ width: "100%", padding: 10, marginBottom: 10, borderRadius: 8, border: "1px solid #ddd" }}>
        <option value="">📍 Всі райони</option>
        {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
      </select>

      <select onChange={e => setCategory(e.target.value)} style={{ width: "100%", padding: 10, marginBottom: 16, borderRadius: 8, border: "1px solid #ddd" }}>
        <option value="">📂 Всі категорії</option>
        {Object.entries(CATEGORIES).map(([group, cats]) => (
          <optgroup key={group} label={group}>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </optgroup>
        ))}
      </select>

      {filtered.length === 0 && <p style={{ textAlign: "center", color: "#888" }}>Акцій не знайдено</p>}

      {filtered.map(o => (
        <div key={o.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 16, marginBottom: 12, boxShadow: "0 2px 6px rgba(0,0,0,0.07)" }}>
          <h3 style={{ margin: "0 0 8px" }}>{o.title}</h3>
          <p style={{ margin: "0 0 8px", color: "#555" }}>{o.description}</p>
          <b style={{ color: "green", fontSize: 18 }}>{o.discount}</b>
          <p style={{ margin: "8px 0 0", color: "#888", fontSize: 13 }}>📍 {o.district} • {o.category}</p>
        </div>
      ))}
    </div>
  );
}