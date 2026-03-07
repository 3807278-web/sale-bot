const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query(`
  CREATE TABLE IF NOT EXISTS businesses (
    id SERIAL PRIMARY KEY,
    tg_id TEXT,
    name TEXT NOT NULL,
    district TEXT NOT NULL,
    category TEXT NOT NULL,
    contact_name TEXT,
    contact_phone TEXT,
    is_approved BOOLEAN DEFAULT false
  );
  CREATE TABLE IF NOT EXISTS offers (
    id SERIAL PRIMARY KEY,
    business_id INTEGER REFERENCES businesses(id),
    title TEXT NOT NULL,
    description TEXT,
    discount TEXT,
    valid_until DATE,
    is_approved BOOLEAN DEFAULT false
  );
`).then(() => console.log('Таблиці створено')).catch(e => console.log('DB error:', e.message));

app.get('/offers', async (req, res) => {
  const result = await pool.query('SELECT * FROM offers WHERE is_approved = true');
  res.json(result.rows);
});

app.get('/offers/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM offers WHERE id = $1', [req.params.id]);
  res.json(result.rows[0]);
});

app.post('/business/register', async (req, res) => {
  const { tg_id, name, district, category, contact_name, contact_phone } = req.body;
  const result = await pool.query(
    'INSERT INTO businesses (tg_id, name, district, category, contact_name, contact_phone) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [tg_id, name, district, category, contact_name, contact_phone]
  );
  res.json(result.rows[0]);
});

app.post('/offers/create', async (req, res) => {
  const { business_id, title, description, discount, valid_until } = req.body;
  const result = await pool.query(
    'INSERT INTO offers (business_id, title, description, discount, valid_until) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [business_id, title, description, discount, valid_until]
  );
  res.json(result.rows[0]);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));