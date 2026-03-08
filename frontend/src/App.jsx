import { useState, useEffect } from "react";

const API = "https://sale-bot-production-7ac2.up.railway.app";

const CITIES = {
  "Київ": ["Позняки","Осокорки","Харківська","Оболонь","Подол","Троєщина","Святошин","Борщагівка","Виноградар","Лівобережна"],
  "Бровари": ["Центр","Мікрорайон"],
  "Бориспіль": ["Центр"],
  "Вишневе": ["Центр"],
  "Ірпінь": ["Центр","Буча"],
};

const CATEGORIES = {
  "Їжа та напої": ["Ресторани","Кафе","Піцерії","Суші","Бургери","Пекарні","Кав'ярні","Доставка їжі","Бари","Кальянні"],
  "Краса та догляд": ["Салони краси","Барбершопи","Манікюр","Косметологія","Масаж","Лазерна епіляція","SPA салони"],
  "Спорт": ["Фітнес клуби","Тренажерні зали","Йога студії","Танцювальні студії","Басейни"],
  "Магазини": ["Одяг","Взуття","Аксесуари","Косметика","Електроніка","Парфуми","Квіти"],
  "Діти": ["Дитячі магазини","Дитячі кімнати","Розвиваючі центри","Дитячі гуртки"],
  "Авто": ["СТО","Шиномонтаж","Автомийки","Детейлінг","Запчастини"],
  "Послуги": ["Ремонт техніки","Клінінг","Ремонт квартир","Хімчистки"],
  "Освіта": ["Курси мов","IT курси","Репетитори","Автошколи"],
  "Розваги": ["Кіно","Квести","Більярд","Боулинг","VR клуби","Антикафе"],
  "Медицина": ["Аптеки","Стоматології","Медичні центри","Аналізи","Оптика"],
  "Інше": ["Тату студії","Фотостудії","Готелі","Коворкінги","Доставка квітів"]
};

function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetch(API + "/offers").then(r => r.json()).then(setOffers);
  }, []);

  const districts = city ? CITIES[city] : [];
  const filtered = offers.filter(o =>
    (district ? o.district === district : true) &&
    (category ? o.category === category : true)
  );

  return (
    <div>
      <select onChange={e => { setCity(e.target.value); setDistrict(""); }} style={{width:"100%",padding:14,marginBottom:12,borderRadius:10,border:"2px solid #0088cc",fontSize:16,height:52,color:"#333",background:"white"}}>
        <option value="">Обрати місто</option>
        {Object.keys(CITIES).map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      {city && (
        <select onChange={e => setDistrict(e.target.value)} style={{width:"100%",padding:10,marginBottom:10,borderRadius:8,border:"1px solid #ddd"}}>
          <option value="">Всі райони</option>
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      )}
      <select onChange={e => setCategory(e.target.value)} style={{width:"100%",padding:10,marginBottom:16,borderRadius:8,border:"1px solid #ddd"}}>
        <option value="">Всі категорії</option>
        {Object.entries(CATEGORIES).map(([group, cats]) => (
          <optgroup key={group} label={group}>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </optgroup>
        ))}
      </select>
      {filtered.length === 0 && <p style={{textAlign:"center",color:"#888"}}>Акцій не знайдено</p>}
      {filtered.map(o => (
        <div key={o.id} style={{border:"1px solid #eee",borderRadius:12,padding:16,marginBottom:12}}>
          <h3 style={{margin:"0 0 8px"}}>{o.title}</h3>
          <p style={{margin:"0 0 8px",color:"#555"}}>{o.description}</p>
          <b style={{color:"green",fontSize:18}}>{o.discount}</b>
          <p style={{margin:"8px 0 0",color:"#888",fontSize:13}}>{o.district} - {o.category}</p>
        </div>
      ))}
    </div>
  );
}

function BusinessPage() {
  const [form, setForm] = useState({name:"",city:"",district:"",category:"",phone:"",title:"",description:"",discount:"",valid_until:""});
  const [aiMode, setAiMode] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (k, v) => setForm(f => ({...f, [k]: v}));

  const generateAI = async () => {
    setAiLoading(true);
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:"Бізнес " + form.name + " має акцію " + form.title + " зі знижкою " + form.discount + ". Напиши короткий опис до 2 речень українською."}]})
    });
    const data = await res.json();
    update("description", data.content[0].text);
    setAiLoading(false);
  };

  const submit = async () => {
    const bRes = await fetch(API + "/business/register", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tg_id:"tg_"+Date.now(),name:form.name,district:form.district,category:form.category,contact_name:"",contact_phone:form.phone})});
    const biz = await bRes.json();
    await fetch(API + "/offers/create", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({business_id:biz.id,title:form.title,description:form.description,discount:form.discount,valid_until:form.valid_until})});
    setSuccess(true);
  };

  if (success) return (
    <div style={{textAlign:"center",padding:40}}>
      <div style={{fontSize:60}}>🎉</div>
      <h2>Заявку відправлено!</h2>
      <p style={{color:"#888"}}>Ваша акція на модерації.</p>
    </div>
  );

  return (
    <div>
      <h3 style={{textAlign:"center"}}>Реєстрація бізнесу</h3>
      <input placeholder="Назва бізнесу" value={form.name} onChange={e => update("name",e.target.value)} style={{width:"100%",padding:10,marginBottom:10,borderRadius:8,border:"1px solid #ddd",boxSizing:"border-box"}} />
      <select onChange={e => {update("city",e.target.value);update("district","");}} style={{width:"100%",padding:10,marginBottom:10,borderRadius:8,border:"1px solid #ddd"}}>
        <option value="">Обрати місто</option>
        {Object.keys(CITIES).map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      {form.city && (
        <select onChange={e => update("district",e.target.value)} style={{width:"100%",padding:10,marginBottom:10,borderRadius:8,border:"1px solid #ddd"}}>
          <option value="">Обрати район</option>
          {CITIES[form.city].map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      )}
      <select onChange={e => update("category",e.target.value)} style={{width:"100%",padding:10,marginBottom:10,borderRadius:8,border:"1px solid #ddd"}}>
        <option value="">Обрати категорію</option>
        {Object.entries(CATEGORIES).map(([group, cats]) => (
          <optgroup key={group} label={group}>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </optgroup>
        ))}
      </select>
      <input placeholder="Телефон" value={form.phone} onChange={e => update("phone",e.target.value)} style={{width:"100%",padding:10,marginBottom:10,borderRadius:8,border:"1px solid #ddd",boxSizing:"border-box"}} />
      <input placeholder="Назва акції" value={form.title} onChange={e => update("title",e.target.value)} style={{width:"100%",padding:10,marginBottom:10,borderRadius:8,border:"1px solid #ddd",boxSizing:"border-box"}} />
      <input placeholder="Знижка (-20%)" value={form.discount} onChange={e => update("discount",e.target.value)} style={{width:"100%",padding:10,marginBottom:10,borderRadius:8,border:"1px solid #ddd",boxSizing:"border-box"}} />
      <input type="date" value={form.valid_until} onChange={e => update("valid_until",e.target.value)} style={{width:"100%",padding:10,marginBottom:10,borderRadius:8,border:"1px solid #ddd",boxSizing:"border-box"}} />
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <button onClick={() => setAiMode(false)} style={{flex:1,padding:10,borderRadius:8,border:"none",background:!aiMode?"#0088cc":"#eee",color:!aiMode?"white":"black",cursor:"pointer"}}>Самостійно</button>
        <button onClick={() => setAiMode(true)} style={{flex:1,padding:10,borderRadius:8,border:"none",background:aiMode?"#0088cc":"#eee",color:aiMode?"white":"black",cursor:"pointer"}}>Через AI</button>
      </div>
      {aiMode ? (
        <div>
          <button onClick={generateAI} disabled={aiLoading||!form.name||!form.title} style={{width:"100%",padding:12,borderRadius:8,border:"none",background:"#7c3aed",color:"white",cursor:"pointer",marginBottom:10}}>
            {aiLoading ? "Генерую..." : "Згенерувати опис"}
          </button>
          {form.description && <div style={{padding:12,background:"#f3f0ff",borderRadius:8,marginBottom:10}}>{form.description}</div>}
        </div>
      ) : (
        <textarea placeholder="Опишіть вашу акцію..." value={form.description} onChange={e => update("description",e.target.value)} style={{width:"100%",padding:10,marginBottom:10,borderRadius:8,border:"1px solid #ddd",boxSizing:"border-box",minHeight:80}} />
      )}
      <button onClick={submit} style={{width:"100%",padding:14,borderRadius:8,border:"none",background:"#0088cc",color:"white",fontSize:16,cursor:"pointer"}}>
        Відправити на модерацію
      </button>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("offers");
  return (
    <div style={{maxWidth:480,margin:"0 auto",fontFamily:"sans-serif",paddingBottom:70}}>
      <div style={{padding:"16px 16px 0"}}>
        {page === "offers" ? <OffersPage /> : <BusinessPage />}
      </div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,display:"flex",borderTop:"1px solid #eee",background:"white"}}>
        <button onClick={() => setPage("offers")} style={{flex:1,padding:16,border:"none",background:"none",color:page==="offers"?"#0088cc":"#888",fontWeight:"bold",fontSize:16,cursor:"pointer"}}>🏷️ Акції</button>
<button onClick={() => setPage("business")} style={{flex:1,padding:16,border:"none",background:"none",color:page==="business"?"#0088cc":"#888",fontWeight:"bold",fontSize:16,cursor:"pointer"}}>🏢 Бізнес</button>
      </div>
    </div>
  );
}
