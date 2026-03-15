import { useState } from "react";

const API = "https://sale-bot-production-7ac2.up.railway.app";
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
const DISTRICTS = ["Позняки", "Осокорки", "Харківська"];

const fieldStyle = {
  width: "100%",
  padding: "10px 12px",
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  boxSizing: "border-box",
  fontSize: 16,
};

export default function BusinessPage() {
  const [business_name, setBusiness_name] = useState("");
  const [category, setCategory] = useState("");
  const [district, setDistrict] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [phone, setPhone] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitMessage("");
    fetch(`${API}/offers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        business_name,
        category,
        district,
        title,
        description,
        discount,
        phone,
      }),
    })
      .then(() => {
        setSubmitMessage("Акцію відправлено на модерацію");
        setBusiness_name("");
        setCategory("");
        setDistrict("");
        setTitle("");
        setDescription("");
        setDiscount("");
        setPhone("");
      })
      .catch(() => {
        setSubmitMessage("Помилка відправки. Спробуйте пізніше.");
      });
  };

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "16px" }}>Бізнес</h1>

      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Профіль бізнесу</h2>
        <p>Сторінка тимчасово спрощена, щоб проект стабільно працював.</p>
        <p>Тут буде форма профілю бізнесу за новим ТЗ.</p>
      </div>

      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Додати акцію</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>
              Назва бізнесу
            </label>
            <input
              type="text"
              value={business_name}
              onChange={(e) => setBusiness_name(e.target.value)}
              style={fieldStyle}
              placeholder="Назва закладу"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>
              Категорія
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={fieldStyle}
            >
              <option value="">Оберіть категорію</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>
              Район
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              style={fieldStyle}
            >
              <option value="">Оберіть район</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>
              Назва акції
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={fieldStyle}
              placeholder="Заголовок акції"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>
              Опис
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...fieldStyle, minHeight: 80, resize: "vertical" }}
              placeholder="Опис акції"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>
              Знижка
            </label>
            <input
              type="text"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              style={fieldStyle}
              placeholder="Наприклад: -20%"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>
              Телефон
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={fieldStyle}
              placeholder="+380..."
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              background: "#178AD8",
              color: "#fff",
              fontSize: 16,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Додати акцію
          </button>
          {submitMessage && (
            <p style={{ marginTop: 16, color: "#166534", fontSize: 14 }}>
              {submitMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
