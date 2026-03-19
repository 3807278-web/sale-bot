import { useState, useEffect } from "react";

const API = "http://localhost:3001";

export default function AdminPage() {
  const [offers, setOffers] = useState([]);
  const [message, setMessage] = useState("");

  const loadPending = () => {
    fetch(`${API}/admin/offers`)
      .then((r) => r.json())
      .then((data) => setOffers(Array.isArray(data) ? data : []))
      .catch(() => setOffers([]));
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = (id) => {
    setMessage("");
    fetch(`${API}/admin/offers/${id}/approve`, { method: "PATCH" })
      .then((res) => {
        if (res.ok) {
          setMessage("Акцію підтверджено");
          loadPending();
        } else {
          setMessage("Помилка підтвердження");
        }
      })
      .catch(() => setMessage("Помилка підтвердження"));
  };

  return (
    <div style={{ padding: "20px", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 8 }}>Адмін панель</h1>
      <p style={{ marginBottom: 16, color: "#64748b", fontSize: 14 }}>
        Пропозиції на модерації (is_approved = false)
      </p>
      {message && (
        <p style={{ marginBottom: 12, color: "#166534", fontSize: 14 }}>
          {message}
        </p>
      )}
      {offers.length === 0 ? (
        <p style={{ color: "#64748b" }}>Немає пропозицій на модерації</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>
                <th style={{ padding: 8 }}>businessName</th>
                <th style={{ padding: 8 }}>category</th>
                <th style={{ padding: 8 }}>district</th>
                <th style={{ padding: 8 }}>title</th>
                <th style={{ padding: 8 }}>description</th>
                <th style={{ padding: 8 }}>discount</th>
                <th style={{ padding: 8 }}>phone</th>
                <th style={{ padding: 8 }}>is_approved</th>
                <th style={{ padding: 8 }}></th>
              </tr>
            </thead>
            <tbody>
              {offers.map((o) => (
                <tr key={o.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: 8 }}>{o.businessName ?? "—"}</td>
                  <td style={{ padding: 8 }}>{o.category ?? "—"}</td>
                  <td style={{ padding: 8 }}>{o.district ?? "—"}</td>
                  <td style={{ padding: 8 }}>{o.title ?? "—"}</td>
                  <td style={{ padding: 8, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {o.description ?? "—"}
                  </td>
                  <td style={{ padding: 8 }}>{o.discount ?? "—"}</td>
                  <td style={{ padding: 8 }}>{o.phone ?? "—"}</td>
                  <td style={{ padding: 8 }}>{o.is_approved ? "так" : "ні"}</td>
                  <td style={{ padding: 8 }}>
                    <button
                      type="button"
                      onClick={() => handleApprove(o.id)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 8,
                        border: "none",
                        background: "#178AD8",
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: 13,
                      }}
                    >
                      Схвалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
