const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage only (no database)
const offers = [
  {
    id: 1,
    title: "Знижка 20% на каву",
    description: "Кожен ранок знижка",
    discount: "-20%",
    city: "Київ",
    district: "Позняки",
    category: "Їжа",
    businessName: "Кафе",
    is_approved: true,
  },
  {
    id: 2,
    title: "Стрижка -30%",
    description: "Акція в барбершопі",
    discount: "-30%",
    city: "Київ",
    district: "Осокорки",
    category: "Краса",
    businessName: "Барбершоп",
    is_approved: true,
  },
];

function nextOfferId() {
  const maxId = offers.reduce((m, o) => {
    const n = Number(o.id);
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 0);
  return maxId + 1;
}

function approveOfferById(id) {
  const numericId = Number(id);
  const offer = offers.find((o) => Number(o.id) === numericId);
  if (!offer) return null;
  offer.is_approved = true;
  return offer;
}

// Health (Railway / uptime)
app.get("/", (req, res) => {
  res.json({ ok: true, message: "SaleBot backend is running" });
});

// Public list: approved only
app.get("/offers", (req, res) => {
  res.json(offers.filter((o) => o.is_approved === true));
});

// Admin moderation queue: pending / not approved
app.get("/admin/offers", (req, res) => {
  res.json(offers.filter((o) => o.is_approved !== true));
});

// Business submits new offer (pending until approved)
app.post("/offers", (req, res) => {
  const body = req.body || {};
  const {
    title,
    description,
    discount,
    city,
    district,
    category,
    businessName,
    phone,
    address,
    lat,
    lng,
  } = body;

  const offer = {
    id: nextOfferId(),
    title: title != null ? String(title) : "",
    description: description != null ? String(description) : "",
    discount: discount != null ? String(discount) : "",
    city: city != null ? String(city) : "",
    district: district != null ? String(district) : "",
    category: category != null ? String(category) : "",
    businessName: businessName != null ? String(businessName) : "",
    phone: phone != null ? String(phone) : "",
    address: address != null ? String(address) : "",
    lat: lat != null && lat !== "" ? Number(lat) : null,
    lng: lng != null && lng !== "" ? Number(lng) : null,
    is_approved: false,
  };

  offers.push(offer);

  return res.status(201).json({
    ok: true,
    message: "Акцію відправлено на модерацію",
    offer,
  });
});

// Approve by id (canonical route)
app.patch("/offers/:id/approve", (req, res) => {
  const updated = approveOfferById(req.params.id);
  if (!updated) {
    return res.status(404).json({ error: "Offer not found" });
  }
  return res.json(updated);
});

// Same approve action — kept for existing Admin UI (Railway)
app.patch("/admin/offers/:id/approve", (req, res) => {
  const updated = approveOfferById(req.params.id);
  if (!updated) {
    return res.status(404).json({ error: "Offer not found" });
  }
  return res.json(updated);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
