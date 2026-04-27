# Website Admin Panel Papan Sedekah - LAZ Amal Bunda

Paket ini berisi website/admin panel untuk sistem Papan Sedekah LAZ Amal Bunda, dilengkapi dengan backend Node.js/Express dan database SQLite.

## Isi File

- `index.html` - halaman utama website/admin panel
- `login.html` - halaman login
- `assets/css/style.css` - tampilan dan layout responsive
- `assets/js/data.js` - data dummy fallback (tidak digunakan saat backend aktif)
- `assets/js/app.js` - logika dashboard, tabel, modal form, export CSV, chart, dan peta (menggunakan REST API)
- `assets/js/auth.js` - modul autentikasi (login via API, fallback ke hardcoded credentials)
- `server.js` - backend Express yang melayani API dan file statis
- `db/database.js` - setup database SQLite, schema, dan seed data

## Cara Menjalankan

### Dengan Backend (Rekomendasi)

```bash
npm install
npm start
```

Server akan berjalan di `http://localhost:3000`. Buka URL tersebut di browser.

Database SQLite akan otomatis dibuat dan diisi dengan data dummy saat pertama kali dijalankan.

### Tanpa Backend (Static Mode)

Jika ingin menjalankan tanpa backend (mode lama), jalankan static file server:

```bash
python3 -m http.server 8080
```

Login akan menggunakan kredensial hardcoded dan data hanya tersimpan di memori browser.

## API Endpoints

Semua endpoint menggunakan prefix `/api`:

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/login` | Login dengan email & password |
| GET | `/api/{resource}` | Ambil semua data |
| GET | `/api/{resource}/:id` | Ambil satu data |
| POST | `/api/{resource}` | Tambah data baru |
| PUT | `/api/{resource}/:id` | Update data |
| DELETE | `/api/{resource}/:id` | Hapus data |

Resource yang tersedia: `lokasi`, `relawan`, `penerima`, `donasi`, `paket`, `dokumentasi`, `users`

## Fitur

- Dashboard ringkasan program
- Statistik total titik, relawan, penerima manfaat, donasi, dan paket sedekah
- Grafik donasi per bulan (Chart.js)
- Grafik distribusi asnaf penerima (Chart.js)
- Peta sebaran titik papan sedekah (Leaflet + OpenStreetMap)
- CRUD data titik/lokasi, relawan, penerima, donatur/donasi, paket sedekah
- Dokumentasi kegiatan
- Export CSV sederhana
- Cetak/simpan PDF melalui fitur print browser
- Tampilan responsive untuk desktop dan HP
- Backend REST API dengan database SQLite
- Autentikasi login via API

## Akun Login

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `admin@amalbunda.org` | `Admin@2026` |
| Super Admin | `keuangan@amalbunda.org` | `Bendahara1!` |
| Koordinator | `siti@amalbunda.org` | `Koordinator1` |
| Anggota | `dewi@amalbunda.org` | `Anggota123!` |

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Backend**: Node.js + Express
- **Database**: SQLite (via better-sqlite3)
- **Charts**: Chart.js (CDN)
- **Maps**: Leaflet + OpenStreetMap (CDN)
