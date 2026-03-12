import { useState, useEffect } from "react";
import MapPage from "./MapPage";
import HomePage from "./HomePage";
import BusinessPage from "./BusinessPage";
import AdminPage from "./AdminPage";

const API = "https://sale-bot-production-7ac2.up.railway.app";
const ADMIN_PASSWORD = "Yura9777";

export default function App(){
  const [page,setPage] = useState("offers");
  const [offers,setOffers] = useState([]);
  const [admin,setAdmin] = useState(false);
  const [pass,setPass] = useState("");

  useEffect(()=>{
    fetch(API+"/offers").then(r=>r.json()).then(setOffers);
  },[]);

  return (
    <div style={{width:"100%", minHeight:"100vh"}}>
      {page==="admin" && !admin ? (
        <div style={{padding:10}}>
          <h2>🔐 Вхід</h2>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Пароль" style={{width:"100%", marginBottom:10}}/>
          <button style={{width:"100%", background:"#0088cc", color:"#fff", padding:10}} onClick={()=>pass===ADMIN_PASSWORD ? setAdmin(true) : alert("Невірний пароль")}>Увійти</button>
        </div>
      ) : (
        <>
          {page==="offers" && <>
            <MapPage offers={offers}/>
            <HomePage offers={offers}/>
          </>}
          {page==="business" && <BusinessPage/>}
          {page==="admin" && <AdminPage offers={offers} setOffers={setOffers}/>}
        </>
      )}

      <div style={{position:"fixed", bottom:0, left:0, right:0, display:"flex", justifyContent:"space-around", borderTop:"1px solid #ddd", background:"#fff", padding:10}}>
        <button onClick={()=>setPage("offers")}>Акції</button>
        <button onClick={()=>setPage("map")}>Карта</button>
        <button onClick={()=>setPage("business")}>Бізнес</button>
        <button onClick={()=>setPage("admin")}>Адмін</button>
      </div>
    </div>
  )
}