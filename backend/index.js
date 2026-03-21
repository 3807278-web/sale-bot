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
    valid_until: "2099-12-31T23:59:00.000Z",
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
    valid_until: "2099-12-31T23:59:00.000Z",
  },
];

function nextOfferId() {
  const maxId = offers.reduce((m, o) => {
    const n = Number(o.id);
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 0);
  return maxId + 1;
}

/** Combine YYYY-MM-DD + HH:mm (or HH:mm:ss) into ISO string stored in valid_until */
function parseValidUntil(validUntilDate, validUntilTime) {
  if (validUntilDate == null || validUntilTime == null) return null;
  const d = String(validUntilDate).trim();
  const t = String(validUntilTime).trim();
  if (!d || !t) return null;
  const timePart = t.length === 5 ? `${t}:00` : t;
  const candidate = `${d}T${timePart}`;
  const parsed = new Date(candidate);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

function isPubliclyActive(offer) {
  if (!offer || offer.is_approved !== true) return false;
  if (!offer.valid_until) return false;
  return new Date(offer.valid_until) > new Date();
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

// Public list: approved + not expired
app.get("/offers", (req, res) => {
  res.json(offers.filter(isPubliclyActive));
});

// Admin moderation queue: pending only
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
    validUntilDate,
    validUntilTime,
  } = body;

  const valid_until = parseValidUntil(validUntilDate, validUntilTime);
  if (!valid_until) {
    return res.status(400).json({
      error: "validUntilDate та validUntilTime обов'язкові та мають бути коректними",
    });
  }

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
    valid_until,
    is_approved: false,
  };

  offers.push(offer);

  return res.status(201).json({
    ok: true,
    message: "Акцію відправлено на модерацію",
    offer,
  });
});

// Approve by id
app.patch("/offers/:id/approve", (req, res) => {
  const updated = approveOfferById(req.params.id);
  if (!updated) {
    return res.status(404).json({ error: "Offer not found" });
  }
  return res.json(updated);
});

// Legacy path (Telegram / older clients)
app.patch("/admin/offers/:id/approve", (req, res) => {
  const updated = approveOfferById(req.params.id);
  if (!updated) {
    return res.status(404).json({ error: "Offer not found" });
  }
  return res.json(updated);
});

// Reject / remove pending offer only
app.delete("/offers/:id", (req, res) => {
  const numericId = Number(req.params.id);
  const idx = offers.findIndex((o) => Number(o.id) === numericId);
  if (idx === -1) {
    return res.status(404).json({ error: "Offer not found" });
  }
  const offer = offers[idx];
  if (offer.is_approved === true) {
    return res.status(404).json({ error: "Offer not found" });
  }
  offers.splice(idx, 1);
  return res.json({ ok: true, message: "Акцію відхилено" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
