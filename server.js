const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('./db/database');

/* ── File upload setup ────────────────────────────────────────────────────── */
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `doc-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(uploadsDir));

/* ── Auth ─────────────────────────────────────────────────────────────────── */
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT id, name, email, role, location, status FROM users WHERE email = ? AND password = ?').get(email, password);
  if (!user) return res.status(401).json({ success: false, message: 'Email atau password salah.' });
  res.json({ success: true, user });
});

/* ── Generic CRUD helper ──────────────────────────────────────────────────── */
function crudRoutes(route, table, columns, opts = {}) {
  const hideFields = opts.hideFromGet || [];
  const selectCols = columns.filter(c => !hideFields.includes(c)).join(', ');

  app.get(`/api/${route}`, (_req, res) => {
    const rows = db.prepare(`SELECT ${selectCols} FROM ${table}`).all();
    res.json(rows);
  });

  app.get(`/api/${route}/:id`, (req, res) => {
    const row = db.prepare(`SELECT ${selectCols} FROM ${table} WHERE id = ?`).get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Data tidak ditemukan.' });
    res.json(row);
  });

  app.post(`/api/${route}`, (req, res) => {
    const cols = columns.filter(c => c !== 'id');
    const placeholders = cols.map(() => '?').join(', ');
    const values = cols.map(c => req.body[c] ?? null);
    const result = db.prepare(`INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders})`).run(...values);
    const row = db.prepare(`SELECT ${selectCols} FROM ${table} WHERE id = ?`).get(result.lastInsertRowid);
    res.status(201).json(row);
  });

  app.put(`/api/${route}/:id`, (req, res) => {
    const cols = columns.filter(c => c !== 'id').filter(c => {
      if (hideFields.includes(c) && !req.body[c]) return false;
      return true;
    });
    const sets = cols.map(c => `${c} = ?`).join(', ');
    const values = cols.map(c => req.body[c] ?? null);
    db.prepare(`UPDATE ${table} SET ${sets} WHERE id = ?`).run(...values, req.params.id);
    const row = db.prepare(`SELECT ${selectCols} FROM ${table} WHERE id = ?`).get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Data tidak ditemukan.' });
    res.json(row);
  });

  app.delete(`/api/${route}/:id`, (req, res) => {
    const result = db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Data tidak ditemukan.' });
    res.json({ success: true });
  });
}

/* ── Dokumentasi routes (file upload) ────────────────────────────────────── */
app.post('/api/dokumentasi', upload.single('file'), (req, res) => {
  const { title, date, location, category, desc } = req.body;
  const file_url = req.file ? `/uploads/${req.file.filename}` : null;
  const result = db.prepare(
    'INSERT INTO dokumentasi (title, date, location, category, desc, file_url) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(title, date, location, category || 'Umum', desc || '', file_url);
  const row = db.prepare('SELECT * FROM dokumentasi WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(row);
});

app.put('/api/dokumentasi/:id', upload.single('file'), (req, res) => {
  const { title, date, location, category, desc } = req.body;
  const existing = db.prepare('SELECT file_url FROM dokumentasi WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Data tidak ditemukan.' });
  const file_url = req.file ? `/uploads/${req.file.filename}` : existing.file_url;
  db.prepare(
    'UPDATE dokumentasi SET title=?, date=?, location=?, category=?, desc=?, file_url=? WHERE id=?'
  ).run(title, date, location, category || 'Umum', desc || '', file_url, req.params.id);
  const row = db.prepare('SELECT * FROM dokumentasi WHERE id = ?').get(req.params.id);
  res.json(row);
});

/* ── Routes ───────────────────────────────────────────────────────────────── */
crudRoutes('lokasi', 'lokasi', ['id', 'name', 'address', 'district', 'status', 'lat', 'lng']);
crudRoutes('relawan', 'relawan', ['id', 'name', 'phone', 'job', 'position', 'location']);
crudRoutes('penerima', 'penerima', ['id', 'name', 'address', 'phone', 'asnaf', 'location']);
crudRoutes('donasi', 'donasi', ['id', 'donor', 'month', 'location', 'type', 'value', 'notes']);
crudRoutes('paket', 'paket', ['id', 'date', 'location', 'pj', 'cost', 'created', 'distributed', 'status']);
crudRoutes('dokumentasi', 'dokumentasi', ['id', 'title', 'date', 'location', 'category', 'desc', 'file_url']);
crudRoutes('users', 'users', ['id', 'name', 'email', 'password', 'role', 'location', 'status'], { hideFromGet: ['password'] });

/* ── SPA fallback ─────────────────────────────────────────────────────────── */
app.get('/{*path}', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
