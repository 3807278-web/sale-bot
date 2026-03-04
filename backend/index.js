const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const offers = [
  { id: 1, business: "Кафе Сонечко", title: "Знижка 20% на всі десерти", discount: "-20%", district: "Позняки", category: "Кафе та ресторани", phone: "+380991234567" },
  { id: 2, business: "Піцерія Везувій", title: "Друга піца за 50%", discount: "-50%", district: "Позняки", category: "Кафе та ресторани", phone: "+380991234568" },
  { id: 3, business: "Салон Краса", title: "Стрижка + укладка зі знижкою", discount: "-30%", district: "Позняки", category: "Салони краси", phone: "+380991234569" },
  { id: 4, business: "Кав'ярня Ранок", title: "Кава + круасан = 99 грн", discount: "-25%", district: "Осокорки", category: "Кафе та ресторани", phone: "+380991234570" },
  { id: 5, business: "FitLife", title: "Місячний абонемент зі знижкою", discount: "-40%", district: "Харківська", category: "Фітнес", phone: "+380991234571" },
];

app.get('/offers', (req, res) => {
  const { district, category } = req.query;
  let result = offers;
  if (district) result = result.filter(o => o.district === district);
  if (category) result = result.filter(o => o.category === category);
  res.json(result);
});

app.get('/offers/:id', (req, res) => {
  const offer = offers.find(o => o.id === parseInt(req.params.id));
  if (!offer) return res.status(404).json({ error: 'Not found' });
  res.json(offer);
});

app.listen(3001, () => console.log('Server running on port 3001'));