value)} style={{ width:"100%", padding:10, marginBottom:10, borderRadius:8, border:"1px solid #ddd", boxSizing:"border-box" }} />
      <p style={{ fontWeight:"bold", marginBottom:8 }}>Опис акції:</p>
      <div style={{ display:"flex", gap:8, marginBottom:10 }}>
        <button onClick={() => setAiMode(false)} style={{ flex:1, padding:10, borderRadius:8, border:"none", background:!aiMode?"#0088cc":"#eee", color:!aiMode?"white":"black", cursor:"pointer" }}>✍️ Самостійно</button>
        <button onClick={() => setAiMode(true)} style={{ flex:1, padding:10, borderRadius:8, border:"none", background:aiMode?"#0088cc":"#eee", color:aiMode?"white":"black", cursor:"pointer" }}>🤖 Через AI</button>
      </div>
      {aiMode ? (
        <div>
          <button onClick={generateAI} disabled={aiLoading  !form.name  !form.title} style={{ width:"100%", padding:12, borderRadius:8, border:"none", background:"#7c3aed", color:"white", cursor:"pointer", marginBottom:10 }}>
            {aiLoading ? "Генерую..." : "✨ Згенерувати опис"}
          </button>
          {form.description && <div style={{ padding:12, background:"#f3f0ff", borderRadius:8, marginBottom:10 }}>{form.description}</div>}
        </div>
      ) : (
        <textarea placeholder="Опишіть вашу акцію..." value={form.description} onChange={e => update("description", e.target.value)} style={{ width:"100%", padding:10, marginBottom:10, borderRadius:8, border:"1px solid #ddd", boxSizing:"border-box", minHeight:80 }} />
      )}
      <button onClick={submit} style={{ width:"100%", padding:14, borderRadius:8, border:"none", background:"#0088cc", color:"white", fontSize:16, cursor:"pointer" }}>
        📤 Відправити на модерацію
      </button>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("offers");
  return (
    <div style={{ maxWidth:480, margin:"0 auto", fontFamily:"sans-serif", paddingBottom:70 }}>
      <div style={{ padding:"16px 16px 0" }}>
        {page === "offers" ? <OffersPage /> : <BusinessPage />}
      </div>
      <div style={{ position:"fixed", bottom:0, left:0, right:0, display:"flex", borderTop:"1px solid #eee", background:"white" }}>
        <button onClick={() => setPage("offers")} style={{ flex:1, padding:14, border:"none", background:"none", color:page==="offers"?"#0088cc":"#888", fontWeight:page==="offers"?"bold":"normal", cursor:"pointer" }}>🏷️ Акції</button>
        <button onClick={() => setPage("business")} style={{ flex:1, padding:14, border:"none", background:"none", color:page==="business"?"#0088cc":"#888", fontWeight:page==="business"?"bold":"normal", cursor:"pointer" }}>🏢 Для бізнесу</button>
      </div>
    </div>
  );
