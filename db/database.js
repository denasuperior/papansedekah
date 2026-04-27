const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'papansedekah.db');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

/* ── Schema ───────────────────────────────────────────────────────────────── */
db.exec(`
  CREATE TABLE IF NOT EXISTS lokasi (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    name     TEXT NOT NULL,
    address  TEXT,
    district TEXT,
    status   TEXT DEFAULT 'Aktif',
    lat      REAL,
    lng      REAL
  );

  CREATE TABLE IF NOT EXISTS relawan (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    name     TEXT NOT NULL,
    phone    TEXT,
    job      TEXT,
    position TEXT,
    location TEXT
  );

  CREATE TABLE IF NOT EXISTS penerima (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    name     TEXT NOT NULL,
    address  TEXT,
    phone    TEXT,
    asnaf    TEXT,
    location TEXT
  );

  CREATE TABLE IF NOT EXISTS donasi (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    donor    TEXT NOT NULL,
    month    TEXT,
    location TEXT,
    type     TEXT,
    value    TEXT,
    notes    TEXT
  );

  CREATE TABLE IF NOT EXISTS paket (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    date        TEXT,
    location    TEXT,
    pj          TEXT,
    cost        REAL DEFAULT 0,
    created     INTEGER DEFAULT 0,
    distributed INTEGER DEFAULT 0,
    status      TEXT DEFAULT 'Draft'
  );

  CREATE TABLE IF NOT EXISTS dokumentasi (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    title    TEXT NOT NULL,
    date     TEXT,
    location TEXT,
    category TEXT,
    desc     TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    name     TEXT NOT NULL,
    email    TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role     TEXT DEFAULT 'Anggota',
    location TEXT,
    status   TEXT DEFAULT 'Aktif'
  );
`);

/* ── Seed data (only if tables are empty) ─────────────────────────────────── */
const isEmpty = (table) => db.prepare(`SELECT COUNT(*) AS c FROM ${table}`).get().c === 0;

if (isEmpty('lokasi')) {
  const insert = db.prepare('INSERT INTO lokasi (name, address, district, status, lat, lng) VALUES (?, ?, ?, ?, ?, ?)');
  const rows = [
    ['Papan Sedekah Masjid Al Ikhlas',      'Jl. Melati RT 02 RW 04, Desa Sukamaju',         'Cibiru',      'Aktif',       -6.9344, 107.7175],
    ['Papan Sedekah Balai RW 03',            'Jl. Mawar No. 12, Kelurahan Sejahtera',          'Cileunyi',    'Aktif',       -6.9389, 107.7521],
    ['Papan Sedekah Posyandu Kenanga',       'Jl. Anggrek RT 05 RW 01, Desa Mandiri',          'Ujungberung', 'Aktif',       -6.9079, 107.7008],
    ['Papan Sedekah Musholla Ar-Rahman',     'Jl. Dahlia No. 7 RT 03 RW 06, Kel. Rancaekek',   'Rancaekek',   'Aktif',       -6.9612, 107.7830],
    ['Papan Sedekah Masjid Nurul Huda',      'Jl. Teratai RT 01 RW 02, Desa Cipadung',         'Cibiru',      'Aktif',       -6.9290, 107.7060],
    ['Papan Sedekah Posko RW 08',            'Jl. Aster RT 04 RW 08, Kel. Mekarjaya',          'Gedebage',    'Tidak Aktif', -6.9500, 107.7350],
    ['Papan Sedekah Balai Desa Panyileukan', 'Jl. Kencana No. 1, Desa Panyileukan',             'Panyileukan', 'Aktif',       -6.9450, 107.7290],
    ['Papan Sedekah Masjid At-Taqwa',        'Jl. Melur RT 06 RW 03, Kel. Cisaranten Kidul',   'Arcamanik',   'Aktif',       -6.9200, 107.6990],
    ['Papan Sedekah TPQ Darul Falah',        'Jl. Cempaka RT 02 RW 05, Desa Sindanglaya',      'Arcamanik',   'Tidak Aktif', -6.9150, 107.6920],
  ];
  const tx = db.transaction(() => rows.forEach(r => insert.run(...r)));
  tx();
}

if (isEmpty('relawan')) {
  const insert = db.prepare('INSERT INTO relawan (name, phone, job, position, location) VALUES (?, ?, ?, ?, ?)');
  const rows = [
    ['Siti Aminah',        '0812-1111-2222', 'Ibu Rumah Tangga', 'Koordinator', 'Papan Sedekah Masjid Al Ikhlas'],
    ['Ahmad Fauzi',        '0821-3333-4444', 'Wiraswasta',       'Anggota',     'Papan Sedekah Masjid Al Ikhlas'],
    ['Nur Hasanah',        '0857-5555-6666', 'Guru',             'Koordinator', 'Papan Sedekah Balai RW 03'],
    ['Dede Kurniawan',     '0813-7654-3210', 'Karyawan Swasta',  'Anggota',     'Papan Sedekah Balai RW 03'],
    ['Rina Marlina',       '0878-2222-9090', 'Ibu Rumah Tangga', 'Koordinator', 'Papan Sedekah Posyandu Kenanga'],
    ['Hendra Gunawan',     '0856-4444-7878', 'Pedagang',         'Anggota',     'Papan Sedekah Posyandu Kenanga'],
    ['Yusuf Hidayatullah', '0819-8765-4321', 'Pengusaha',        'Koordinator', 'Papan Sedekah Musholla Ar-Rahman'],
    ['Dewi Rahayu',        '0822-6666-1234', 'Bidan',            'Koordinator', 'Papan Sedekah Masjid Nurul Huda'],
    ['Asep Saepudin',      '0831-9988-7766', 'Petani',           'Anggota',     'Papan Sedekah Balai Desa Panyileukan'],
    ['Fitriani Lestari',   '0877-3344-5566', 'Guru Ngaji',       'Koordinator', 'Papan Sedekah Masjid At-Taqwa'],
  ];
  const tx = db.transaction(() => rows.forEach(r => insert.run(...r)));
  tx();
}

if (isEmpty('penerima')) {
  const insert = db.prepare('INSERT INTO penerima (name, address, phone, asnaf, location) VALUES (?, ?, ?, ?, ?)');
  const rows = [
    ['Ibu Marni',           'RT 02 RW 04, Sukamaju, Cibiru',      '0812-0000-1111', 'Miskin',       'Papan Sedekah Masjid Al Ikhlas'],
    ['Pak Rahmat',          'RT 03 RW 02, Sejahtera, Cileunyi',   '0813-7777-8888', 'Fakir',        'Papan Sedekah Balai RW 03'],
    ['Keluarga Ibu Lina',   'RT 05 RW 01, Mandiri, Ujungberung',  '0857-9999-2222', 'Fisabilillah', 'Papan Sedekah Posyandu Kenanga'],
    ['Bapak Suharto',       'RT 01 RW 06, Rancaekek',             '0878-1234-5678', 'Miskin',       'Papan Sedekah Musholla Ar-Rahman'],
    ['Ibu Aisyah',          'RT 04 RW 02, Cipadung, Cibiru',      '0821-4567-8901', 'Fakir',        'Papan Sedekah Masjid Nurul Huda'],
    ['Pak Dadang Suparman', 'RT 06 RW 08, Mekarjaya, Gedebage',   '0831-2345-6789', 'Gharim',       'Papan Sedekah Posko RW 08'],
    ['Ibu Tuti Suharti',    'RT 02 RW 05, Panyileukan',           '0856-5678-9012', 'Miskin',       'Papan Sedekah Balai Desa Panyileukan'],
    ['Nenek Rohayah',       'RT 03 RW 03, Cisaranten Kidul',      '-',              'Fakir',        'Papan Sedekah Masjid At-Taqwa'],
    ['Pak Usman Efendi',    'RT 01 RW 05, Sindanglaya, Arcamanik','0819-8888-0001', 'Ibnu Sabil',   'Papan Sedekah TPQ Darul Falah'],
    ['Keluarga Pak Wahyu',  'RT 07 RW 04, Sukamaju, Cibiru',      '-',              'Miskin',       'Papan Sedekah Masjid Al Ikhlas'],
  ];
  const tx = db.transaction(() => rows.forEach(r => insert.run(...r)));
  tx();
}

if (isEmpty('donasi')) {
  const insert = db.prepare('INSERT INTO donasi (donor, month, location, type, value, notes) VALUES (?, ?, ?, ?, ?, ?)');
  const rows = [
    ['Hamba Allah',         '2026-01', 'Papan Sedekah Masjid Al Ikhlas',       'Cash/Rp',       '800000',               'Donasi awal tahun'],
    ['Bapak H. Sutrisno',  '2026-01', 'Papan Sedekah Balai RW 03',            'Cash/Rp',       '500000',               'Infak rutin bulanan'],
    ['Ibu Dewi Kartika',   '2026-02', 'Papan Sedekah Masjid Al Ikhlas',       'Cash/Rp',       '1000000',              'Sedekah jariyah'],
    ['CV Berkah Mandiri',  '2026-02', 'Papan Sedekah Posyandu Kenanga',       'Natura/Barang', 'Minyak goreng 20 liter','Estimasi Rp400.000'],
    ['Toko Sembako Jaya',  '2026-02', 'Papan Sedekah Balai RW 03',            'Natura/Barang', 'Gula pasir 25 kg',     'Estimasi Rp350.000'],
    ['Ibu Ratna Sari',     '2026-03', 'Papan Sedekah Masjid Al Ikhlas',       'Cash/Rp',       '500000',               'Untuk paket sayur'],
    ['PT Amanah Sejahtera','2026-03', 'Papan Sedekah Musholla Ar-Rahman',     'Cash/Rp',       '2000000',              'CSR perusahaan'],
    ['Bapak Yayan Sofyan', '2026-03', 'Papan Sedekah Balai RW 03',            'Cash/Rp',       '300000',               'Donasi pribadi'],
    ['CV Berkah Jaya',     '2026-04', 'Papan Sedekah Balai RW 03',            'Natura/Barang', 'Beras 50 kg',          'Estimasi Rp700.000'],
    ['Hamba Allah',        '2026-04', 'Papan Sedekah Masjid Al Ikhlas',       'Cash/Rp',       '1500000',              'Donasi bulanan'],
    ['Ibu Nining Rahayu',  '2026-04', 'Papan Sedekah Masjid Nurul Huda',      'Cash/Rp',       '750000',               'Sedekah rutin'],
    ['Komunitas Peduli',   '2026-04', 'Papan Sedekah Balai Desa Panyileukan', 'Cash/Rp',       '1000000',              'Kolektif RT 04'],
  ];
  const tx = db.transaction(() => rows.forEach(r => insert.run(...r)));
  tx();
}

if (isEmpty('paket')) {
  const insert = db.prepare('INSERT INTO paket (date, location, pj, cost, created, distributed, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
  const rows = [
    ['2026-01-25', 'Papan Sedekah Masjid Al Ikhlas',       'Siti Aminah',        825000,  25, 24, 'Terverifikasi'],
    ['2026-01-26', 'Papan Sedekah Balai RW 03',            'Nur Hasanah',        495000,  15, 15, 'Terverifikasi'],
    ['2026-02-22', 'Papan Sedekah Masjid Al Ikhlas',       'Siti Aminah',        1155000, 35, 35, 'Terverifikasi'],
    ['2026-02-23', 'Papan Sedekah Posyandu Kenanga',       'Rina Marlina',       660000,  20, 19, 'Terverifikasi'],
    ['2026-03-28', 'Papan Sedekah Masjid Al Ikhlas',       'Siti Aminah',        1320000, 40, 39, 'Terverifikasi'],
    ['2026-03-29', 'Papan Sedekah Musholla Ar-Rahman',     'Yusuf Hidayatullah', 990000,  30, 30, 'Terverifikasi'],
    ['2026-03-30', 'Papan Sedekah Balai RW 03',            'Nur Hasanah',        594000,  18, 17, 'Diajukan'],
    ['2026-04-20', 'Papan Sedekah Masjid Al Ikhlas',       'Siti Aminah',        1650000, 50, 48, 'Terverifikasi'],
    ['2026-04-21', 'Papan Sedekah Balai RW 03',            'Nur Hasanah',        990000,  30, 30, 'Diajukan'],
    ['2026-04-22', 'Papan Sedekah Masjid Nurul Huda',      'Dewi Rahayu',        594000,  18, 15, 'Draft'],
    ['2026-04-23', 'Papan Sedekah Balai Desa Panyileukan', 'Asep Saepudin',      462000,  14,  0, 'Draft'],
  ];
  const tx = db.transaction(() => rows.forEach(r => insert.run(...r)));
  tx();
}

if (isEmpty('dokumentasi')) {
  const insert = db.prepare('INSERT INTO dokumentasi (title, date, location, category, desc) VALUES (?, ?, ?, ?, ?)');
  const rows = [
    ['Penyaluran Paket Sayur Januari',     '2026-01-25', 'Papan Sedekah Masjid Al Ikhlas', 'Penyaluran', 'Pembagian paket sayur dan lauk untuk 24 warga sekitar masjid.'],
    ['Penerimaan Donasi Perdana Balai RW', '2026-01-26', 'Papan Sedekah Balai RW 03',      'Donasi',     'Serah terima donasi tunai dari donatur rutin di balai RW 03.'],
    ['Pengepakan Paket Februari',          '2026-02-22', 'Papan Sedekah Masjid Al Ikhlas', 'Persiapan',  'Relawan mempersiapkan dan mengepak 35 paket sedekah untuk distribusi.'],
    ['Penyaluran Posyandu Kenanga',        '2026-02-23', 'Papan Sedekah Posyandu Kenanga', 'Penyaluran', 'Distribusi paket minyak goreng dan sembako ke penerima manfaat.'],
    ['Kegiatan Relawan Maret',             '2026-03-28', 'Papan Sedekah Masjid Al Ikhlas', 'Persiapan',  'Koordinasi relawan dan persiapan 40 paket sedekah bulan Maret.'],
    ['Penyaluran Musholla Ar-Rahman',      '2026-03-29', 'Papan Sedekah Musholla Ar-Rahman','Penyaluran','Pendistribusian 30 paket kepada warga kurang mampu di sekitar musholla.'],
    ['Penerimaan Beras CV Berkah Jaya',    '2026-04-21', 'Papan Sedekah Balai RW 03',      'Donasi',     'Serah terima donasi beras 50 kg dari CV Berkah Jaya untuk penerima manfaat.'],
    ['Penyaluran Paket April Masjid',      '2026-04-20', 'Papan Sedekah Masjid Al Ikhlas', 'Penyaluran', 'Distribusi 48 paket sedekah kepada penerima terdaftar, dokumentasi lengkap.'],
    ['Rapat Koordinasi Bulanan',           '2026-04-18', 'Papan Sedekah Masjid Al Ikhlas', 'Rapat',      'Rapat evaluasi program April dan perencanaan kegiatan bulan Mei 2026.'],
  ];
  const tx = db.transaction(() => rows.forEach(r => insert.run(...r)));
  tx();
}

if (isEmpty('users')) {
  const insert = db.prepare('INSERT INTO users (name, email, password, role, location, status) VALUES (?, ?, ?, ?, ?, ?)');
  const rows = [
    ['Admin Pusat',        'admin@amalbunda.org',    'Admin@2026',   'Super Admin', 'Semua Titik',                          'Aktif'],
    ['Bendahara LAZ',      'keuangan@amalbunda.org', 'Bendahara1!',  'Super Admin', 'Semua Titik',                          'Aktif'],
    ['Siti Aminah',        'siti@amalbunda.org',     'Koordinator1', 'Koordinator', 'Papan Sedekah Masjid Al Ikhlas',       'Aktif'],
    ['Nur Hasanah',        'nur@amalbunda.org',      'Koordinator1', 'Koordinator', 'Papan Sedekah Balai RW 03',            'Aktif'],
    ['Rina Marlina',       'rina@amalbunda.org',     'Koordinator1', 'Koordinator', 'Papan Sedekah Posyandu Kenanga',       'Aktif'],
    ['Yusuf Hidayatullah', 'yusuf@amalbunda.org',    'Koordinator1', 'Koordinator', 'Papan Sedekah Musholla Ar-Rahman',     'Aktif'],
    ['Dewi Rahayu',        'dewi@amalbunda.org',     'Anggota123!',  'Anggota',     'Papan Sedekah Masjid Nurul Huda',      'Aktif'],
    ['Asep Saepudin',      'asep@amalbunda.org',     'Anggota123!',  'Anggota',     'Papan Sedekah Balai Desa Panyileukan', 'Aktif'],
  ];
  const tx = db.transaction(() => rows.forEach(r => insert.run(...r)));
  tx();
}

module.exports = db;
