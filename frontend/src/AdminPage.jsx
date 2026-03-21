import { useState, useEffect } from "react";

const API = "https://sale-bot-production-7ac2.up.railway.app";

export default function AdminPage() {
  const [offers, setOffers] = useState([]);
  const [notice, setNotice] = useState("");
  const [noticeIsError, setNoticeIsError] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadPending = () => {
    setNotice("");
    setNoticeIsError(false);
    setLoading(true);
    fetch(`${API}/admin/offers`)
      .then(async (r) => {
        if (!r.ok) {
          setLoadFailed(true);
          setOffers([]);
          setNotice("Не вдалося завантажити акції");
          setNoticeIsError(true);
          return;
        }
        setLoadFailed(false);
        const data = await r.json();
        setOffers(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setLoadFailed(true);
        setOffers([]);
        setNotice("Не вдалося завантажити акції");
        setNoticeIsError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = (id) => {
    setNotice("");
    setNoticeIsError(false);
    fetch(`${API}/offers/${id}/approve`, { method: "PATCH" })
      .then((res) => {
        if (res.ok) {
          setOffers((prev) => prev.filter((o) => o.id !== id));
          setNotice("Акцію підтверджено");
          setNoticeIsError(false);
        } else {
          setNotice("Помилка підтвердження");
          setNoticeIsError(true);
        }
      })
      .catch(() => {
        setNotice("Помилка підтвердження");
        setNoticeIsError(true);
      });
  };

  const handleReject = (id) => {
    setNotice("");
    setNoticeIsError(false);
    fetch(`${API}/offers/${id}`, { method: "DELETE" })
      .then((res) => {
        if (res.ok) {
          setOffers((prev) => prev.filter((o) => o.id !== id));
          setNotice("Акцію відхилено");
          setNoticeIsError(false);
        } else {
          setNotice("Помилка відхилення");
          setNoticeIsError(true);
        }
      })
      .catch(() => {
        setNotice("Помилка відхилення");
        setNoticeIsError(true);
      });
  };

  return (
    <div style={{ padding: "20px", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 8 }}>Адмін панель</h1>
      <p style={{ marginBottom: 16, color: "#64748b", fontSize: 14 }}>
        Пропозиції на модерації
      </p>
      {notice && (
        <p
          style={{
            marginBottom: 12,
            color: noticeIsError ? "#b91c1c" : "#166534",
            fontSize: 14,
          }}
        >
          {notice}
        </p>
      )}
      {loading ? (
        <p style={{ color: "#64748b" }}>Завантаження...</p>
      ) : !loadFailed && offers.length === 0 ? (
        <p style={{ color: "#64748b" }}>Нових акцій на модерації немає</p>
      ) : loadFailed ? null : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {offers.map((o) => (
            <div
              key={o.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 14,
                background: "#fff",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 16 }}>
                {o.title ?? "—"}
              </div>
              <div style={{ fontSize: 14, color: "#374151", marginBottom: 4 }}>
                <strong>Заклад:</strong> {o.businessName ?? "—"}
              </div>
              <div style={{ fontSize: 14, color: "#374151", marginBottom: 4 }}>
                <strong>Категорія:</strong> {o.category ?? "—"}
              </div>
              <div style={{ fontSize: 14, color: "#374151", marginBottom: 4 }}>
                <strong>Місто:</strong> {o.city ?? "—"}
              </div>
              <div style={{ fontSize: 14, color: "#374151", marginBottom: 4 }}>
                <strong>Район:</strong> {o.district ?? "—"}
              </div>
              <div style={{ fontSize: 14, color: "#374151", marginBottom: 4 }}>
                <strong>Знижка:</strong> {o.discount ?? "—"}
              </div>
              <div style={{ fontSize: 14, color: "#374151", marginBottom: 4 }}>
                <strong>Діє до:</strong>{" "}
                {o.valid_until
                  ? new Date(o.valid_until).toLocaleString("uk-UA", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </div>
              <div style={{ fontSize: 14, color: "#4b5563", marginBottom: 12, lineHeight: 1.45 }}>
                {o.description ?? "—"}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => handleApprove(o.id)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: "#2563eb",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Підтвердити
                </button>
                <button
                  type="button"
                  onClick={() => handleReject(o.id)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "1px solid #d1d5db",
                    background: "#f9fafb",
                    color: "#111827",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Відхилити
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
