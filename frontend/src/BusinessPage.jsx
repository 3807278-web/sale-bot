// frontend/src/BusinessPage.jsx
import { useState } from "react";
import { input, mainBtn, aiBtn } from "./styles"; // або вставити стилі вручну

const API = "https://sale-bot-production-7ac2.up.railway.app";

export default function BusinessPage() {
  const [step, setStep] = useState(1);
  const [business, setBusiness] = useState({ name:"", district:"", category:"", contact_name:"", contact_phone:"" });
  const [offer, setOffer] = useState({ title:"", description:"", discount:"", valid_until:"", business_id:null });

  const registerBusiness = async () => {
    const r = await fetch(API + "/business/register", {
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(business)
    });
    const data = await r.json();
    setOffer({...offer, business_id: data.id});
    setStep(2);
  }

  const createOffer = async () => {
    await fetch(API + "/offers/create", {
      method:"POST",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(offer)
    });
    setStep(3);
  }

  const aiGenerate = () => {
    setOffer({...offer, title:"-20% на популярну послугу", description:"Спеціальна акція для нових клієнтів", discount:"-20%"});
  }

  if(step===3){
    return <div style={{textAlign:"center",padding:30}}><h2>✅ Акцію відправлено</h2><p>Після модерації вона з'явиться у сервісі</p></div>
  }

  return (
    <div>
      {step===1 && (
        <div>
          <h2>🏢 Реєстрація бізнесу</h2>
          <input placeholder="Назва бізнесу" style={input} onChange={e=>setBusiness({...business,name:e.target.value})}/>
          <select style={input} onChange={e=>setBusiness({...business,district:e.target.value})}>
            <option>Район</option>
            <option>Позняки</option><option>Осокорки</option><option>Харківська</option><option>Оболонь</option><option>Подол</option>
          </select>
          <select style={input} onChange={e=>setBusiness({...business,category:e.target.value})}>
            <option>Категорія</option>
            <option>Кафе</option><option>Ресторан</option><option>Салон краси</option><option>Фітнес</option><option>Магазин</option>
          </select>
          <input placeholder="Контактна особа" style={input} onChange={e=>setBusiness({...business,contact_name:e.target.value})}/>
          <input placeholder="Телефон" style={input} onChange={e=>setBusiness({...business,contact_phone:e.target.value})}/>
          <button style={mainBtn} onClick={registerBusiness}>Зареєструвати</button>
        </div>
      )}

      {step===2 && (
        <div>
          <h2>🎁 Створити акцію</h2>
          <button style={aiBtn} onClick={aiGenerate}>🤖 Створити через ШІ</button>
          <input placeholder="Назва акції" style={input} value={offer.title} onChange={e=>setOffer({...offer,title:e.target.value})}/>
          <textarea placeholder="Опис" style={input} value={offer.description} onChange={e=>setOffer({...offer,description:e.target.value})}/>
          <input placeholder="Знижка (-20%)" style={input} value={offer.discount} onChange={e=>setOffer({...offer,discount:e.target.value})}/>
          <input type="date" style={input} onChange={e=>setOffer({...offer,valid_until:e.target.value})}/>
          <button style={mainBtn} onClick={createOffer}>Відправити на модерацію</button>
        </div>
      )}
    </div>
  );
}