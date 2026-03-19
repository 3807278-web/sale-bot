import { useState, useRef, useEffect } from "react";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const DEBOUNCE_MS = 400;

const API = "http://localhost:3001";
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
const CITIES = ["Київ", "Бровари", "Бориспіль", "Ірпінь"];
const DISTRICTS_BY_CITY = {
  Київ: ["Позняки", "Осокорки", "Харківська"],
  Бровари: ["Центр", "Старе місто"],
  Бориспіль: ["Центр", "Аеропорт"],
  Ірпінь: ["Центр", "Новобудови"],
};

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
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [phone, setPhone] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const debounceRef = useRef(null);
  const lastQueryRef = useRef("");

  useEffect(() => {
    // reset district when city changes
    setDistrict("");
  }, [city]);

  useEffect(() => {
    const q = address.trim();
    if (!city || q.length < 2) {
      setSuggestions(null);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const composedQuery = `${q}, ${city}`;
      lastQueryRef.current = composedQuery;
      fetch(
        `${NOMINATIM_URL}?format=json&q=${encodeURIComponent(composedQuery)}&limit=5&countrycodes=ua`,
        { headers: { "Accept-Language": "uk", "User-Agent": "SaleBot/1.0" } }
      )
        .then((r) => r.json())
        .then((data) => {
          if (lastQueryRef.current === composedQuery) setSuggestions(Array.isArray(data) ? data : []);
        })
        .catch(() => {
          if (lastQueryRef.current === composedQuery) setSuggestions([]);
        });
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [address]);

  const pickSuggestion = (item) => {
    setAddress(item.display_name);
    setLat(String(item.lat));
    setLng(String(item.lon));
    setSuggestions(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitMessage("");
    const businessName = business_name;
    const payload = {
      title,
      description,
      discount,
      city,
      district,
      category,
      businessName,
    };

    console.log("POST /offers payload:", payload);

    fetch("http://localhost:3001/offers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        if (response.ok) {
          setSubmitMessage("Акцію відправлено на модерацію");
          setBusiness_name("");
          setCategory("");
          setDistrict("");
          setAddress("");
          setLat("");
          setLng("");
          setTitle("");
          setDescription("");
          setDiscount("");
          setPhone("");
          return;
        }

        const errorText = await response.text().catch(() => "");
        console.error("POST /offers failed:", response.status, errorText);
        setSubmitMessage("Помилка відправки. Спробуйте ще раз.");
      })
      .catch((err) => {
        console.error("POST /offers network error:", err);
        setSubmitMessage("Помилка відправки. Спробуйте ще раз.");
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
              Місто
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={fieldStyle}
            >
              <option value="">Оберіть місто</option>
              {CITIES.map((c) => (
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
              disabled={!city}
            >
              <option value="">{city ? "Оберіть район" : "Спочатку оберіть місто"}</option>
              {city &&
                (DISTRICTS_BY_CITY[city] || []).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
            </select>
          </div>
          <div style={{ marginBottom: 12, position: "relative" }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>
              Адреса
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onBlur={() => setTimeout(() => setSuggestions(null), 150)}
              style={fieldStyle}
              placeholder="Вулиця, будинок"
              autoComplete="off"
            />
            {address.trim().length >= 2 && suggestions !== null && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: "100%",
                  marginTop: -4,
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  maxHeight: 220,
                  overflowY: "auto",
                  zIndex: 10,
                }}
              >
                {suggestions.length === 0 ? (
                  <div style={{ padding: "10px 12px", fontSize: 14, color: "#64748b" }}>
                    Адресу не знайдено
                  </div>
                ) : (
                  suggestions.map((item) => (
                    <button
                      key={item.place_id}
                      type="button"
                      onClick={() => pickSuggestion(item)}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "10px 12px",
                        border: "none",
                        background: "none",
                        fontSize: 14,
                        textAlign: "left",
                        cursor: "pointer",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      {item.display_name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>
              Широта (lat)
            </label>
            <input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              style={fieldStyle}
              placeholder="50.4501"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>
              Довгота (lng)
            </label>
            <input
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              style={fieldStyle}
              placeholder="30.5234"
            />
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
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>
              Початкова ціна
            </label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              style={fieldStyle}
              placeholder="Наприклад: 300"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14, fontWeight: 500 }}>
              Ціна зі знижкою
            </label>
            <input
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              style={fieldStyle}
              placeholder="Наприклад: 240"
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
