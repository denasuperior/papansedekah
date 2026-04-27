# Testing Papan Sedekah Admin Panel

This is a static frontend prototype (HTML/CSS/JS, no build step, no backend).

## Local Setup

```bash
cd /path/to/papansedekah
python3 -m http.server 8080
```

Open `http://localhost:8080/login.html` in the browser.

## Authentication

Login is client-side only (sessionStorage). Credentials are hardcoded in `assets/js/auth.js`.

| Email | Password | Role |
|---|---|---|
| admin@amalbunda.org | Admin@2026 | Super Admin |
| keuangan@amalbunda.org | Bendahara1! | Super Admin |
| siti@amalbunda.org | Koordinator1 | Koordinator |
| dewi@amalbunda.org | Anggota123! | Anggota |

After login, `AUTH.requireAuth()` on `index.html` checks sessionStorage; if missing, redirects to `login.html`.

## Key Testing Areas

### Dashboard (default page after login)
- **Stat cards**: Total Titik Aktif, Relawan, Penerima Manfaat, Donasi Cash, Paket Dibuat, Paket Disalurkan
- **Doughnut chart** (Distribusi Penerima): Requires Chart.js from CDN. Should show center text with total count and legend with asnaf categories.
- **Bar chart** (Donasi Cash per Bulan): Shows monthly cash donations.
- **Map** (Peta Sebaran Titik): Requires Leaflet from CDN. Shows markers for each location.
- **Activity feed**: Shows 5 most recent activities.

### Data Pages (sidebar navigation)
- Titik/Lokasi, Relawan, Penerima Manfaat, Donatur & Donasi: Each has a data table rendered by `renderTable()` in `app.js`
- Paket Sedekah: Has both a data table (`#tablePaket`) and a paket creation form
- Dokumentasi: Card-based layout
- Admin & Role: User management table

## Common Issues

- **Charts/map not rendering**: Usually caused by `renderAll()` crashing before `initCharts()`/`initMap()` are called. Check browser console for TypeErrors. The `renderTable()` function needs all referenced table elements to exist in the HTML, or it will throw on null `tbody`.
- **CDN dependencies**: Chart.js and Leaflet load from CDN. Internet connection required.
- **Session lost on refresh**: Since data is in-memory (`appData` in `data.js`), page refresh resets all added data. Login session persists via sessionStorage.

## Programmatic Verification

You can use Playwright via CDP to verify state without fighting the console tool:

```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp('http://localhost:29229')
    page = browser.contexts[0].pages[0]
    result = page.evaluate('''() => ({
        chartLoaded: typeof Chart !== 'undefined',
        mapLoaded: typeof L !== 'undefined',
        tablePaketRows: document.querySelectorAll('#tablePaket tbody tr').length,
    })''')
    print(result)
    browser.close()
```

## Devin Secrets Needed

None - this is a static prototype with hardcoded credentials.
