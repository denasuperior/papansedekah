# Website Admin Panel Papan Sedekah - LAZ Amal Bunda

Paket ini berisi prototype website/admin panel untuk sistem Papan Sedekah LAZ Amal Bunda.

## Isi File

- `index.html` - halaman utama website/admin panel
- `assets/css/style.css` - tampilan dan layout responsive
- `assets/js/data.js` - contoh data awal/dummy data
- `assets/js/app.js` - logika dashboard, tabel, modal form, export CSV, chart, dan peta

## Cara Menjalankan

1. Extract file ZIP.
2. Buka folder `papan-sedekah-website`.
3. Klik dua kali file `index.html`.
4. Website akan terbuka di browser.

Agar peta dan grafik tampil dengan baik, perangkat perlu tersambung internet karena menggunakan library CDN:

- Leaflet + OpenStreetMap untuk peta
- Chart.js untuk grafik

## Fitur Prototype

- Dashboard ringkasan program
- Statistik total titik, relawan, penerima manfaat, donasi, dan paket sedekah
- Grafik donasi per bulan
- Grafik paket dibuat dan disalurkan
- Peta sebaran titik papan sedekah
- Data titik/lokasi
- Data relawan
- Data penerima manfaat
- Data donatur dan donasi
- Laporan paket sedekah
- Dokumentasi kegiatan
- Export CSV sederhana
- Cetak/simpan PDF melalui fitur print browser
- Tampilan responsive untuk desktop dan HP

## Catatan Penting

Ini adalah prototype frontend statis. Data yang ditambahkan melalui form hanya tersimpan sementara di browser saat halaman masih terbuka. Untuk menjadi aplikasi produksi, perlu ditambahkan backend dan database.

Rekomendasi lanjutan:

- Backend: Laravel
- Database: MySQL/MariaDB atau PostgreSQL
- Login dan role akses: Super Admin, Koordinator, Anggota
- Upload file asli ke storage server
- Export PDF/Excel dari backend
- Validasi hak akses per titik/lokasi
- Audit log aktivitas pengguna

## Akun Login

Prototype ini belum memakai halaman login. Untuk versi produksi, halaman login perlu dibuat dan terhubung ke database user/admin.
