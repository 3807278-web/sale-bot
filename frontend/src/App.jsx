import { useState, useEffect } from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import MapPage from "./MapPage";
import HomePage from "./HomePage";
import BusinessPage from "./BusinessPage";
import AdminPage from "./AdminPage";

const API = "https://sale-bot-production-7ac2.up.railway.app";
const ADMIN_PASSWORD = "Yura9777";

export default function App(){
  const [offers,setOffers] = useState([]);
  const [admin,setAdmin] = useState(false);
  const [pass,setPass] = useState("");

  useEffect(()=>{
    fetch(API+"/offers").then(r=>r.json()).then(setOffers);
  },[]);

  const adminElement = admin ? (
    <AdminPage offers={offers} setOffers={setOffers}/>
  ) : (
    <div style={{padding:10}}>
      <h2>🔐 Вхід</h2>
      <input
        type="password"
        value={pass}
        onChange={e=>setPass(e.target.value)}
        placeholder="Пароль"
        style={{width:"100%", marginBottom:10}}
      />
      <button
        style={{width:"100%", background:"#0088cc", color:"#fff", padding:10}}
        onClick={()=>pass===ADMIN_PASSWORD ? setAdmin(true) : alert("Невірний пароль")}
      >
        Увійти
      </button>
    </div>
  );

  return (
    <div style={{width:"100%", minHeight:"100vh"}}>
      <Routes>
        <Route path="/" element={<Navigate to="/offers" replace />} />
        <Route path="/offers" element={<HomePage offers={offers} />} />
        <Route path="/map" element={<MapPage offers={offers}/>} />
        <Route path="/business" element={<BusinessPage/>} />
        <Route path="/admin" element={adminElement} />
      </Routes>

      <div style={{position:"fixed", bottom:0, left:0, right:0, display:"flex", justifyContent:"space-around", borderTop:"1px solid #ddd", background:"#fff", padding:10}}>
        <NavLink to="/offers" style={{border:"none", background:"none", padding:8, cursor:"pointer"}}>
          Акції
        </NavLink>
        <NavLink to="/map" style={{border:"none", background:"none", padding:8, cursor:"pointer"}}>
          Карта
        </NavLink>
        <NavLink to="/business" style={{border:"none", background:"none", padding:8, cursor:"pointer"}}>
          Бізнес
        </NavLink>
        <NavLink to="/admin" style={{border:"none", background:"none", padding:8, cursor:"pointer"}}>
          Адмін
        </NavLink>
      </div>
    </div>
  )
}