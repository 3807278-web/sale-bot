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

pool.query('ALTER TABLE businesses ADD COLUMN address TEXT').catch(() => {});
pool.query('ALTER TABLE businesses ADD COLUMN lat DOUBLE PRECISION').catch(() => {});
pool.query('ALTER TABLE businesses ADD COLUMN lng DOUBLE PRECISION').catch(() => {});

app.get('/offers', async (req, res) => {
  const result = await pool.query('SELECT * FROM offers WHERE is_approved = true');
  res.json(result.rows);
});

app.get('/offers/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM offers WHERE id = $1', [req.params.id]);
  res.json(result.rows[0]);
});

app.post('/offers', async (req, res) => {
  const { business_name, category, district, address, lat, lng, title, description, discount, phone } = req.body;
  try {
    const latNum = lat != null && lat !== '' ? Number(lat) : null;
    const lngNum = lng != null && lng !== '' ? Number(lng) : null;
    const biz = await pool.query(
      'INSERT INTO businesses (name, district, category, contact_phone, address, lat, lng) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
      [business_name || '', district || '', category || '', phone || '', address || null, latNum, lngNum]
    );
    const business_id = biz.rows[0].id;
    await pool.query(
      'INSERT INTO offers (business_id, title, description, discount, is_approved) VALUES ($1,$2,$3,$4,false)',
      [business_id, title || '', description || '', discount || null]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
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

app.post('/offers/approve/:id', async (req, res) => {
  const result = await pool.query('UPDATE offers SET is_approved = true WHERE id = $1 RETURNING *', [req.params.id]);
  res.json(result.rows[0]);
});

app.patch('/offers/:id/approve', async (req, res) => {
  try {
    const result = await pool.query('UPDATE offers SET is_approved = true WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Offer not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/admin/offers', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.id, o.title, o.description, o.discount, o.is_approved,
             b.name AS business_name, b.district, b.category, b.contact_phone AS phone
      FROM offers o
      JOIN businesses b ON o.business_id = b.id
      WHERE o.is_approved = false
      ORDER BY o.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));