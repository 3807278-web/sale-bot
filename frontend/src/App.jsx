import { useState, useEffect } from "react";
import MapPage from "./MapPage";

const API = "https://sale-bot-production-7ac2.up.railway.app";
const ADMIN_PASSWORD = "Yura9777";

const CITIES = {
  "Київ": ["Позняки","Осокорки","Харківська","Оболонь","Подол"],
  "Бровари": ["Центр"],
  "Бориспіль": ["Центр"]
};

const CATEGORIES = [
  "Кафе",
  "Ресторан",
  "Салон краси",
  "Фітнес",
  "Магазин"
];

function OffersPage({offers}){

  const [city,setCity] = useState("");
  const [district,setDistrict] = useState("");
  const [selected,setSelected] = useState(null);

  const districts = city ? CITIES[city] : [];

  const filtered = offers.filter(o=>{
    if(!district) return false;
    return o.district === district;
  });

  return(

<div>

<h2>🔥 ТОП акції</h2>

<h2>🔎 Пошук</h2>

<select value={city} onChange={(e)=>{
setCity(e.target.value);
setDistrict("");
}} style={input}>

<option value="">Місто</option>

{Object.keys(CITIES).map(c=>(
<option key={c}>{c}</option>
))}

</select>

{city && (

<select value={district} onChange={(e)=>setDistrict(e.target.value)} style={input}>

<option value="">Район</option>

{districts.map(d=>(
<option key={d}>{d}</option>
))}

</select>

)}

<h2>📍 Результати</h2>

{district && filtered.length===0 && <p>Акцій не знайдено</p>}

{filtered.map(o=>(

<div key={o.id} style={card}>

<h3>{o.title}</h3>

{o.description && <p>{o.description}</p>}

<p style={{color:"green"}}>{o.discount}</p>

<button onClick={()=>setSelected(o)}>Детальніше</button>

</div>

))}

{selected && (

<div style={overlay} onClick={()=>setSelected(null)}>

<div style={modal} onClick={(e)=>e.stopPropagation()}>

<h3>{selected.title}</h3>

{selected.description && <p>{selected.description}</p>}

<p style={{color:"green"}}>{selected.discount}</p>

<button onClick={()=>setSelected(null)} style={closeBtn}>Закрити</button>

</div>

</div>

)}

</div>

)

}

function BusinessPage(){

const [step,setStep] = useState(1)

const [business,setBusiness] = useState({
name:"",
district:"",
category:"",
contact_name:"",
contact_phone:""
})

const [offer,setOffer] = useState({
title:"",
description:"",
discount:"",
valid_until:"",
business_id:null
})

const registerBusiness = async()=>{

const r = await fetch(API + "/business/register",{
method:"POST",
headers:{'Content-Type':'application/json'},
body:JSON.stringify(business)
})

const data = await r.json()

setOffer({...offer,business_id:data.id})

setStep(2)

}

const createOffer = async()=>{

await fetch(API + "/offers/create",{
method:"POST",
headers:{'Content-Type':'application/json'},
body:JSON.stringify(offer)
})

setStep(3)

}

const aiGenerate = ()=>{

setOffer({
...offer,
title:"-20% на популярну послугу",
description:"Спеціальна акція для нових клієнтів",
discount:"-20%"
})

}

if(step===3){

return(
<div style={{textAlign:"center",padding:30}}>
<h2>✅ Акцію відправлено</h2>
<p>Після модерації вона з'явиться у сервісі</p>
</div>
)

}

return(

<div>

{step===1 && (

<div>

<h2>🏢 Реєстрація бізнесу</h2>

<input placeholder="Назва бізнесу" style={input}
onChange={(e)=>setBusiness({...business,name:e.target.value})}/>

<select style={input}
onChange={(e)=>setBusiness({...business,district:e.target.value})}>

<option>Район</option>

{CITIES["Київ"].map(d=>(
<option key={d}>{d}</option>
))}

</select>

<select style={input}
onChange={(e)=>setBusiness({...business,category:e.target.value})}>

<option>Категорія</option>

{CATEGORIES.map(c=>(
<option key={c}>{c}</option>
))}

</select>

<input placeholder="Контактна особа" style={input}
onChange={(e)=>setBusiness({...business,contact_name:e.target.value})}/>

<input placeholder="Телефон" style={input}
onChange={(e)=>setBusiness({...business,contact_phone:e.target.value})}/>

<button style={mainBtn} onClick={registerBusiness}>
Зареєструвати
</button>

</div>

)}

{step===2 && (

<div>

<h2>🎁 Створити акцію</h2>

<button style={aiBtn} onClick={aiGenerate}>
🤖 Створити через ШІ
</button>

<input placeholder="Назва акції" style={input}
value={offer.title}
onChange={(e)=>setOffer({...offer,title:e.target.value})}/>

<textarea placeholder="Опис" style={input}
value={offer.description}
onChange={(e)=>setOffer({...offer,description:e.target.value})}/>

<input placeholder="Знижка (-20%)" style={input}
value={offer.discount}
onChange={(e)=>setOffer({...offer,discount:e.target.value})}/>

<input type="date" style={input}
onChange={(e)=>setOffer({...offer,valid_until:e.target.value})}/>

<button style={mainBtn} onClick={createOffer}>
Відправити на модерацію
</button>

</div>

)}

</div>

)

}

function AdminPage({offers,setOffers}){

const approve = async(id)=>{

await fetch(API + "/offers/approve/"+id,{
method:"POST"
})

setOffers(offers.filter(o=>o.id!==id))

}

return(

<div>

<h2>⚙ Адмін панель</h2>

{offers.map(o=>(

<div key={o.id} style={card}>

<h3>{o.title}</h3>

<p>{o.discount}</p>

<button onClick={()=>approve(o.id)}>Підтвердити</button>

</div>

))}

</div>

)

}

export default function App(){

const [page,setPage] = useState("offers")
const [offers,setOffers] = useState([])
const [admin,setAdmin] = useState(false)
const [pass,setPass] = useState("")

useEffect(()=>{
fetch(API + "/offers")
.then(r=>r.json())
.then(setOffers)
},[])

return(

<div style={{width:"100%",paddingBottom:80}}>

<div style={{padding:20}}>

{page==="admin" && !admin ? (

<div>

<h2>🔐 Вхід</h2>

<input
type="password"
placeholder="Пароль"
style={input}
value={pass}
onChange={(e)=>setPass(e.target.value)}
/>

<button style={mainBtn}
onClick={()=>{

if(pass===ADMIN_PASSWORD) setAdmin(true)
else alert("Невірний пароль")

}}>
Увійти
</button>

</div>

) : (

<>

{page==="offers" && <OffersPage offers={offers}/>}

{page==="map" && (
<>
<h2>MAP TEST</h2>
<MapPage offers={offers}/>
</>
)}

{page==="business" && <BusinessPage/>}

{page==="admin" && <AdminPage offers={offers} setOffers={setOffers}/>}

</>

)}

</div>

<div style={nav}>

<button onClick={()=>setPage("offers")}>Акції</button>
<button onClick={()=>setPage("map")}>Карта</button>
<button onClick={()=>setPage("business")}>Бізнес</button>
<button onClick={()=>setPage("admin")}>Адмін</button>

</div>

</div>

)

}

const card={
border:"1px solid #ddd",
padding:15,
borderRadius:10,
marginBottom:10
}

const input={
width:"100%",
padding:10,
marginBottom:10
}

const mainBtn={
width:"100%",
padding:12,
background:"#0088cc",
color:"#fff",
border:"none"
}

const aiBtn={
width:"100%",
padding:10,
marginBottom:10
}

const overlay={
position:"fixed",
top:0,
left:0,
right:0,
bottom:0,
background:"rgba(0,0,0,0.5)",
display:"flex",
alignItems:"center",
justifyContent:"center"
}

const modal={
background:"#fff",
padding:20,
borderRadius:10,
width:300
}

const closeBtn={
marginTop:10,
width:"100%",
padding:10
}

const nav={
position:"fixed",
bottom:0,
left:0,
right:0,
display:"flex",
borderTop:"1px solid #ddd",
background:"#fff",
justifyContent:"space-around",
padding:10
}