import { useState } from "react";

const CITIES = {
  "Київ": ["Позняки","Осокорки","Харківська","Оболонь","Подол"],
  "Бровари": ["Центр"],
  "Бориспіль": ["Центр"]
};

export default function HomePage({ offers }) {
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [selected, setSelected] = useState(null);

  const districts = city ? CITIES[city] : [];
  const filtered = offers.filter(o => district && o.district === district);

  return (
    <div style={{padding:10}}>
      <select value={city} onChange={e=>{setCity(e.target.value); setDistrict("")}} style={{width:"100%", marginBottom:10}}>
        <option value="">Місто</option>
        {Object.keys(CITIES).map(c => <option key={c}>{c}</option>)}
      </select>
      {city && (
        <select value={district} onChange={e=>setDistrict(e.target.value)} style={{width:"100%", marginBottom:10}}>
          <option value="">Район</option>
          {districts.map(d => <option key={d}>{d}</option>)}
        </select>
      )}

      {filtered.map(o => (
        <div key={o.id} style={{border:"1px solid #ddd", padding:10, marginBottom:10}}>
          <h3>{o.title}</h3>
          {o.description && <p>{o.description}</p>}
          <b style={{color:"green"}}>{o.discount}</b>
          <br/>
          <button onClick={()=>setSelected(o)}>Детальніше</button>
        </div>
      ))}
    </div>
  )
}