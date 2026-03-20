import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// fix іконок
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// фікс розміру карти
function FixMapSize() {
  const map = useMap();

  useEffect(() => {
    const t = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => clearTimeout(t);
  }, [map]);

  return null;
}

function openRoute(offer) {
  if (offer && offer.lat && offer.lng) {
    window.open(`https://www.google.com/maps?q=${offer.lat},${offer.lng}`, "_blank");
  } else if (offer && offer.district && offer.city) {
    const query = `${offer.city} ${offer.district}`;
    window.open(`https://www.google.com/maps?q=${encodeURIComponent(query)}`, "_blank");
  } else {
    alert("Немає координат для маршруту");
  }
}

function FocusSelectedOffer({ shouldFocus, center, zoom, markerRef, offersCount }) {
  const map = useMap();

  useEffect(() => {
    if (!shouldFocus) return;
    if (!center) return;
    if (offersCount === 0) return;

    map.setView(center, zoom, { animate: true });

    const t = setTimeout(() => {
      const marker = markerRef.current;
      const leafletMarker = marker && marker.leafletElement ? marker.leafletElement : marker;
      if (leafletMarker && typeof leafletMarker.openPopup === "function") {
        leafletMarker.openPopup();
      }
    }, 150);

    return () => clearTimeout(t);
  }, [shouldFocus, center, zoom, markerRef, offersCount, map]);

  return null;
}

export default function MapPage() {
  const API = "https://sale-bot-production-7ac2.up.railway.app";
  const location = useLocation();
  const selectedOffer = location.state || null;

  const districtCoords = {
    "Позняки": [50.397, 30.634],
    "Осокорки": [50.395, 30.616],
    "Харківська": [50.402, 30.652],
  };

  const fallbackCoords = [50.4501, 30.5234];

  const [offers, setOffers] = useState([]);

  useEffect(() => {
    let mounted = true;

    fetch(`${API}/offers`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load offers");
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : [];
        setOffers(list.filter((o) => o && o.is_approved === true));
      })
      .catch(() => {
        if (!mounted) return;
        setOffers([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const hasSelectedOffer = !!selectedOffer && typeof selectedOffer === "object";

  const selectedMarkerId = selectedOffer && selectedOffer.id != null ? selectedOffer.id : null;

  const getOfferCoords = (offer) => {
    const lat = Number(offer && offer.lat);
    const lng = Number(offer && offer.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return [lat, lng];

    if (offer && offer.district && districtCoords[offer.district]) return districtCoords[offer.district];
    return fallbackCoords;
  };

  const selectedCoords = hasSelectedOffer ? getOfferCoords(selectedOffer) : fallbackCoords;
  const selectedZoom = hasSelectedOffer ? 16 : 13;

  const selectedMarkerRef = useRef(null);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        flex: 1,
      }}
    >
      <MapContainer
        center={selectedCoords}
        zoom={selectedZoom}
        style={{ height: "100%", width: "100%" }}
      >
        <FixMapSize />
        <FocusSelectedOffer
          shouldFocus={hasSelectedOffer}
          center={selectedCoords}
          zoom={selectedZoom}
          markerRef={selectedMarkerRef}
          offersCount={offers.length}
        />

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {offers.map((o) => {
          const coords = getOfferCoords(o);
          const lat = coords[0];
          const lng = coords[1];
          const isSelected = hasSelectedOffer && selectedMarkerId != null && o.id === selectedMarkerId;
          return (
            <Marker key={o.id} position={coords} ref={isSelected ? selectedMarkerRef : undefined}>
              <Popup>
                <div style={{ minWidth: 200 }}>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>{o.title}</div>
                  {o.discount && (
                    <div style={{ color: "#178AD8", fontWeight: 700, marginBottom: 6 }}>{o.discount}</div>
                  )}
                  {o.description && (
                    <div style={{ color: "#475569", lineHeight: 1.4 }}>{o.description}</div>
                  )}

                  <button
                    type="button"
                    style={{
                      marginTop: 8,
                      padding: "6px 10px",
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                    onClick={() => openRoute(o)}
                  >
                    Маршрут
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}