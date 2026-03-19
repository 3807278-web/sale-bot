const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage (fallback if DB is not ready)
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

app.get("/offers", (req, res) => {
  res.json(offers.filter((o) => o.is_approved === true));
});

app.post("/offers", (req, res) => {
  const {
    title,
    description,
    discount,
    city,
    district,
    category,
    businessName,
  } = req.body || {};

  const offer = {
    id: Date.now(),
    title,
    description,
    discount,
    city,
    district,
    category,
    businessName,
    is_approved: false,
  };

  offers.push(offer);

  return res.status(201).json({
    message: "Акцію відправлено на модерацію",
    offer,
  });
});

app.get("/admin/offers", (req, res) => {
  res.json(offers.filter((o) => o.is_approved === false));
});

app.patch("/admin/offers/:id/approve", (req, res) => {
  const id = Number(req.params.id);
  const offer = offers.find((o) => o.id === id);
  if (!offer) return res.status(404).json({ error: "Offer not found" });
  offer.is_approved = true;
  return res.json(offer);
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});