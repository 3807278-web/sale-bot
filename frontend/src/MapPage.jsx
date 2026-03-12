import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

const districts = {
  "Позняки": [50.397, 30.634],
  "Осокорки": [50.392, 30.616],
  "Харківська": [50.401, 30.652],
  "Оболонь": [50.505, 30.498],
  "Подол": [50.468, 30.516]
};

function FixMapSize(){
  const map = useMap()

  useEffect(()=>{
    setTimeout(()=>{
      map.invalidateSize()
    },300)
  },[])

  return null
}

export default function MapPage({ offers }) {

  const markers = (offers || [])
    .filter(o => o.district && districts[o.district])
    .map(o => ({
      ...o,
      coords: districts[o.district]
    }));

  return (

    <div style={{
      position:"fixed",
      top:0,
      left:0,
      right:0,
      bottom:60
    }}>

      <MapContainer
        center={[50.4501,30.5234]}
        zoom={11}
        style={{height:"100%", width:"100%"}}
      >

        <FixMapSize/>

        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map(o => (

          <Marker key={o.id} position={o.coords}>

            <Popup>

              <h3>{o.title}</h3>

              {o.description && <p>{o.description}</p>}

              <b style={{color:"green"}}>
                {o.discount}
              </b>

              <br/><br/>

              {o.phone && (
                <a href={"tel:"+o.phone}>
                  📞 Подзвонити
                </a>
              )}

            </Popup>

          </Marker>

        ))}

      </MapContainer>

    </div>

  )
}