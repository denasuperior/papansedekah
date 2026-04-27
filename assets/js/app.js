const rupiah = n => new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 }).format(n);
const qs  = s => document.querySelector(s);
const qsa = s => document.querySelectorAll(s);

/* ── API helper ───────────────────────────────────────────────────────────── */
const API_BASE = '/api';
async function api(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}/${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  return res.json();
}
async function apiDelete(endpoint, id) {
  await fetch(`${API_BASE}/${endpoint}/${id}`, { method: 'DELETE' });
}
async function apiPost(endpoint, data) {
  return api(endpoint, { method: 'POST', body: data });
}
async function loadAllData() {
  const [lokasi, relawan, penerima, donasi, paket, dokumentasi, users] = await Promise.all([
    api('lokasi'), api('relawan'), api('penerima'), api('donasi'),
    api('paket'), api('dokumentasi'), api('users'),
  ]);
  appData.lokasi = lokasi;
  appData.relawan = relawan;
  appData.penerima = penerima;
  appData.donasi = donasi;
  appData.paket = paket;
  appData.dokumentasi = dokumentasi;
  appData.users = users;
}
const appData = { lokasi:[], relawan:[], penerima:[], donasi:[], paket:[], dokumentasi:[], users:[] };

/* ── SVG icon strings (dipakai di JS-generated HTML) ─────────────────────── */
const SVG = {
  edit:  `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  trash: `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  pkg:   `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  money: `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  cam:   `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  gift:  `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`,
  chat:  `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
};

/* ── Helpers ──────────────────────────────────────────────────────────────── */
function formatTanggal(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' });
}
function formatTanggalBulan(monthStr) {
  const [y, m] = monthStr.split('-');
  const n = ['','Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  return n[parseInt(m)] + ' ' + y;
}

/* ── Navigation ────────────────────────────────────────────────────────────── */
function setPage(page) {
  qsa('.page').forEach(el => el.classList.remove('active'));
  qsa('.menu-item').forEach(el => el.classList.remove('active'));
  qs(`#${page}`).classList.add('active');
  qs(`[data-page="${page}"]`).classList.add('active');
  const titles = {
    dashboard:   ['Dashboard',          'Ringkasan program Papan Sedekah'],
    lokasi:      ['Titik/Lokasi',       'Kelola titik papan sedekah dan peta sebaran'],
    relawan:     ['Relawan',            'Kelola relawan per titik/lokasi'],
    penerima:    ['Penerima Manfaat',   'Data penerima bantuan dan kategori asnaf'],
    donatur:     ['Donatur & Donasi',   'Donasi cash dan natura/barang per bulan'],
    paket:       ['Paket Sedekah',      'Manajemen paket sedekah berbasis item'],
    dokumentasi: ['Dokumentasi',        'Upload foto kegiatan dan bukti penyaluran'],
    laporan:     ['Laporan',            'Export PDF dan Excel'],
    pengguna:    ['Admin & Role',       'Kelola admin dan hak akses'],
  };
  qs('#pageTitle').textContent = titles[page][0];
  qs('#pageDesc').textContent  = titles[page][1];
  qs('#sidebar').classList.remove('open');
}

/* ── Table renderer ────────────────────────────────────────────────────────── */
function renderTable(id, rows, columns, onDelete) {
  const tbody = qs(`#${id} tbody`);
  if (!tbody) return;
  tbody.innerHTML = rows.map((row, i) => {
    const cells = columns.map(col => `<td>${col(row)}</td>`).join('');
    const actions = onDelete
      ? `<td><div class="act-btns">
           <button class="act-edit-btn" title="Edit" onclick="alert('Fitur edit akan tersedia di versi backend.')">${SVG.edit}</button>
           <button class="act-del-btn"  title="Hapus" onclick="if(confirm('Hapus data ini?')){${onDelete}(${i});renderAll();}">${SVG.trash}</button>
         </div></td>`
      : '';
    return `<tr>${cells}${actions}</tr>`;
  }).join('');
}

/* Delete helpers — now call API then refresh */
async function delLokasi(i)   { await apiDelete('lokasi', appData.lokasi[i].id); await loadAllData(); renderAll(); initMap(); }
async function delRelawan(i)  { await apiDelete('relawan', appData.relawan[i].id); await loadAllData(); renderAll(); }
async function delPenerima(i) { await apiDelete('penerima', appData.penerima[i].id); await loadAllData(); renderAll(); }
async function delDonasi(i)   { await apiDelete('donasi', appData.donasi[i].id); await loadAllData(); renderAll(); }
async function delPaket(i)    { await apiDelete('paket', appData.paket[i].id); await loadAllData(); renderAll(); }
async function delUser(i)     { await apiDelete('users', appData.users[i].id); await loadAllData(); renderAll(); }

/* ── Badge ─────────────────────────────────────────────────────────────────── */
function badge(text, color) {
  let cls = color || 'green';
  if (['Diajukan','Koordinator','Natura/Barang'].includes(text)) cls = 'yellow';
  if (['Tidak Aktif','Perlu Revisi'].includes(text))             cls = 'red';
  if (['Super Admin','Anggota','Fakir','Miskin','Fisabilillah','Gharim','Ibnu Sabil','Mualaf'].includes(text)) cls = 'blue';
  if (['Draft'].includes(text))                                  cls = 'gray';
  return `<span class="badge ${cls}">${text}</span>`;
}

/* ── Render all tables + dashboard ─────────────────────────────────────────── */
function renderAll() {
  /* stat cards */
  qs('#totalLokasi').textContent  = appData.lokasi.filter(l => l.status === 'Aktif').length;
  qs('#totalRelawan').textContent = appData.relawan.length;
  qs('#totalPenerima').textContent = appData.penerima.length;
  qs('#totalCash').textContent = rupiah(
    appData.donasi.filter(d => d.type.includes('Cash')).reduce((t, d) => t + parseFloat(d.value || 0), 0)
  );
  qs('#paketDibuat').textContent = appData.paket.reduce((t, p) => t + p.created, 0);
  qs('#paketSalur').textContent  = appData.paket.reduce((t, p) => t + p.distributed, 0);

  /* data tables */
  renderTable('tableLokasi', appData.lokasi, [
    r => r.name, r => r.address, r => r.district, r => badge(r.status),
    r => `${r.lat}, ${r.lng}`
  ], 'delLokasi');

  renderTable('tableRelawan', appData.relawan, [
    r => r.name, r => r.phone, r => r.job, r => badge(r.position), r => r.location
  ], 'delRelawan');

  renderTable('tablePenerima', appData.penerima, [
    r => r.name, r => r.address, r => r.phone, r => badge(r.asnaf, 'blue'), r => r.location
  ], 'delPenerima');

  renderTable('tableDonasi', appData.donasi, [
    r => r.donor,
    r => formatTanggalBulan(r.month),
    r => r.location.replace('Papan Sedekah ', ''),
    r => badge(r.type, r.type.includes('Cash') ? 'green' : 'yellow'),
    r => r.type.includes('Cash') ? rupiah(parseFloat(r.value)) : r.value,
    r => r.notes,
  ], 'delDonasi');

  renderTable('tablePaket', appData.paket, [
    r => r.date,
    r => r.location.replace('Papan Sedekah ', ''),
    r => r.pj,
    r => rupiah(r.cost),
    r => r.created,
    r => r.distributed,
    r => r.created - r.distributed,
    r => badge(r.status),
  ], 'delPaket');

  renderTable('tableUser', appData.users, [
    r => r.name, r => r.email, r => badge(r.role), r => r.location, r => badge(r.status)
  ], 'delUser');

  /* dokumentasi cards */
  const docCfg = {
    Penyaluran: { icon: SVG.gift,  bg: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', color: '#065f46' },
    Donasi:     { icon: SVG.money, bg: 'linear-gradient(135deg,#fef3c7,#fde68a)', color: '#92400e' },
    Persiapan:  { icon: SVG.pkg,   bg: 'linear-gradient(135deg,#dbeafe,#bfdbfe)', color: '#1e40af' },
    Rapat:      { icon: SVG.chat,  bg: 'linear-gradient(135deg,#ede9fe,#ddd6fe)', color: '#5b21b6' },
  };
  qs('#docGrid').innerHTML = appData.dokumentasi.map(d => {
    const cfg = docCfg[d.category] || { icon: SVG.cam, bg: 'linear-gradient(135deg,#f1f5f9,#e2e8f0)', color: '#475569' };
    return `<article class="doc-card">
      <div class="doc-thumb" style="background:${cfg.bg}">
        <div class="doc-thumb-icon" style="color:${cfg.color}">${cfg.icon}</div>
      </div>
      <div>
        <span class="doc-cat-badge">${d.category || 'Umum'}</span>
        <h4>${d.title}</h4>
        <p>${formatTanggal(d.date)} · ${d.location.replace('Papan Sedekah ', '')}</p>
        <p>${d.desc}</p>
      </div>
    </article>`;
  }).join('');

  /* activity list */
  const actIcon = { paket: SVG.pkg, donasi: SVG.money, dokumentasi: SVG.cam };
  const allAct = [
    ...appData.paket.map(r => ({
      icon: actIcon.paket,
      text: `Laporan paket <strong>${r.location.replace('Papan Sedekah ', '')}</strong> oleh ${r.pj}`,
      date: r.date, badgeText: r.status,
    })),
    ...appData.donasi.map(r => ({
      icon: actIcon.donasi,
      text: `Donasi dari <strong>${r.donor}</strong> — ${r.type}`,
      date: r.month + '-01', badgeText: r.type.includes('Cash') ? 'Cash' : 'Natura',
    })),
    ...appData.dokumentasi.map(r => ({
      icon: actIcon.dokumentasi,
      text: `Dokumentasi: <strong>${r.title}</strong>`,
      date: r.date, badgeText: r.category,
    })),
  ]
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 5);

  qs('#activityList').innerHTML = allAct.map(item => `
    <li>
      <div class="act-icon">${item.icon}</div>
      <div class="act-body">
        <p>${item.text}</p>
        <small>${formatTanggal(item.date)} &nbsp;·&nbsp; <span class="act-badge">${item.badgeText}</span></small>
      </div>
    </li>`).join('');

  /* dashboard recent penerima table */
  const recentTbody = qs('#dashRecentTable tbody');
  if (recentTbody) {
    const latest = [...appData.penerima].slice(-5).reverse();
    recentTbody.innerHTML = latest.map((r, i) => {
      const realIdx = appData.penerima.indexOf(r);
      return `<tr>
        <td>${r.name}</td>
        <td>${badge(r.asnaf, 'blue')}</td>
        <td>${r.address}</td>
        <td>${r.location.replace('Papan Sedekah ', '')}</td>
        <td>${r.phone}</td>
        <td><div class="act-btns">
          <button class="act-edit-btn" title="Edit" onclick="alert('Fitur edit akan tersedia di versi backend.')">${SVG.edit}</button>
          <button class="act-del-btn"  title="Hapus" onclick="if(confirm('Hapus data ini?')){delPenerima(${realIdx});renderAll();}">${SVG.trash}</button>
        </div></td>
      </tr>`;
    }).join('');
  }
}

/* ── Modal helpers ──────────────────────────────────────────────────────────── */
function openModal(id)  { qs(`#${id}`).classList.add('active'); }
function closeModal(id) { qs(`#${id}`).classList.remove('active'); }
function getFormData(f) { return Object.fromEntries(new FormData(f).entries()); }

/* ── Form submit handlers — now POST to API ──────────────────────────────── */
async function addLokasi(e)      { e.preventDefault(); const d=getFormData(e.target); await apiPost('lokasi', {name:d.name,address:d.address,district:d.district,status:'Aktif',lat:parseFloat(d.lat)||-6.9,lng:parseFloat(d.lng)||107.7}); closeModal('modalLokasi'); e.target.reset(); await loadAllData(); renderAll(); initMap(); }
async function addRelawan(e)     { e.preventDefault(); const d=getFormData(e.target); await apiPost('relawan', {name:d.name,phone:d.phone,job:d.job,position:d.position,location:d.location}); closeModal('modalRelawan'); e.target.reset(); await loadAllData(); renderAll(); }
async function addPenerima(e)    { e.preventDefault(); const d=getFormData(e.target); await apiPost('penerima', {name:d.name,address:d.address,phone:d.phone,asnaf:d.asnaf,location:d.location}); closeModal('modalPenerima'); e.target.reset(); await loadAllData(); renderAll(); }
async function addDonasi(e)      { e.preventDefault(); const d=getFormData(e.target); await apiPost('donasi', {donor:d.donor,month:d.month,location:d.location,type:d.type,value:d.value,notes:d.notes}); closeModal('modalDonasi'); e.target.reset(); await loadAllData(); renderAll(); }
async function addPaket(e)       { e.preventDefault(); const d=getFormData(e.target); await apiPost('paket', {date:d.date,location:d.location,pj:d.pj,cost:Number(d.cost),created:Number(d.created),distributed:Number(d.distributed),status:d.status}); closeModal('modalPaket'); e.target.reset(); await loadAllData(); renderAll(); }
async function addDokumentasi(e) { e.preventDefault(); const d=getFormData(e.target); await apiPost('dokumentasi', {title:d.title,date:d.date,location:d.location,category:'Umum',desc:d.desc}); closeModal('modalDokumentasi'); e.target.reset(); await loadAllData(); renderAll(); }
async function addUser(e)        { e.preventDefault(); const d=getFormData(e.target); await apiPost('users', {name:d.name,email:d.email,password:d.password||'Anggota123!',role:d.role,location:d.location||'Semua Titik',status:'Aktif'}); closeModal('modalUser'); e.target.reset(); await loadAllData(); renderAll(); }

/* ── Filter ─────────────────────────────────────────────────────────────────── */
function filterTable(value, tableId) {
  const term = value.toLowerCase();
  qsa(`#${tableId} tbody tr`).forEach(row =>
    row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none'
  );
}

/* ── Export CSV ─────────────────────────────────────────────────────────────── */
function exportCSV(type) {
  const map = { relawan:appData.relawan, lokasi:appData.lokasi, penerima:appData.penerima, donasi:appData.donasi, paket:appData.paket };
  const rows = map[type];
  if (!rows || rows.length === 0) { alert('Tidak ada data untuk diekspor.'); return; }
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(','), ...rows.map(row =>
    headers.map(h => `"${String(row[h] ?? '').replaceAll('"','""')}"`).join(',')
  )].join('\n');
  const blob = new Blob(['﻿' + csv], { type:'text/csv;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `laporan-${type}.csv`; a.click();
  URL.revokeObjectURL(url);
}

/* ── Map ────────────────────────────────────────────────────────────────────── */
let mapInstance;
function initMap() {
  if (!window.L) return;
  if (mapInstance) { mapInstance.remove(); }
  mapInstance = L.map('map').setView([-6.93, 107.72], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'&copy; OpenStreetMap' }).addTo(mapInstance);
  appData.lokasi.forEach(l => {
    const color = l.status === 'Aktif' ? '#0f766e' : '#ef4444';
    const icon  = L.divIcon({
      className: '',
      html: `<div style="width:13px;height:13px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4)"></div>`,
      iconSize: [13, 13], iconAnchor: [6, 6],
    });
    L.marker([Number(l.lat), Number(l.lng)], { icon })
      .addTo(mapInstance)
      .bindPopup(`<strong>${l.name}</strong><br>${l.address}<br>Status: <b style="color:${color}">${l.status}</b>`);
  });
}

/* ── Charts ─────────────────────────────────────────────────────────────────── */
let asnafChartInst, donasiChartInst;

function initCharts() {
  if (!window.Chart) return;

  /* — Doughnut: Distribusi Asnaf — */
  const asnafGroups = {};
  appData.penerima.forEach(p => { asnafGroups[p.asnaf] = (asnafGroups[p.asnaf] || 0) + 1; });
  const asnafLabels = Object.keys(asnafGroups);
  const asnafData   = Object.values(asnafGroups);
  const asnafColors = ['#0f766e','#1d4ed8','#7c3aed','#d97706','#be123c','#15803d','#b45309','#475569'];

  const centerTextPlugin = {
    id: 'centerText',
    afterDraw(chart) {
      if (chart.config.type !== 'doughnut') return;
      const { ctx, chartArea } = chart;
      const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
      const cx = (chartArea.left + chartArea.right)  / 2;
      const cy = (chartArea.top  + chartArea.bottom) / 2;
      ctx.save();
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 22px Inter, system-ui';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(total, cx, cy - 9);
      ctx.font = '12px Inter, system-ui';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Penerima', cx, cy + 11);
      ctx.restore();
    },
  };

  if (asnafChartInst) asnafChartInst.destroy();
  asnafChartInst = new Chart(qs('#asnafChart'), {
    type: 'doughnut',
    plugins: [centerTextPlugin],
    data: {
      labels: asnafLabels,
      datasets: [{
        data: asnafData,
        backgroundColor: asnafColors.slice(0, asnafLabels.length),
        borderWidth: 0,
        hoverOffset: 6,
      }],
    },
    options: {
      responsive: true,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 14, font: { size: 12 }, boxWidth: 12, boxHeight: 12 },
        },
      },
    },
  });

  /* — Bar: Donasi Cash per Bulan — */
  const monthNames = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const monthNums  = ['01','02','03','04','05','06','07','08','09','10','11','12'];

  const lastIdx = monthNums.reduce((last, m, i) => {
    const has = appData.donasi.some(d => d.month.slice(5) === m) ||
                appData.paket.some(p => p.date.slice(5,7) === m);
    return has ? i : last;
  }, 0);

  const labels   = monthNames.slice(0, lastIdx + 1);
  const cashData = monthNums.slice(0, lastIdx + 1).map(m =>
    appData.donasi
      .filter(d => d.type.includes('Cash') && d.month.slice(5) === m)
      .reduce((t, d) => t + parseFloat(d.value || 0), 0)
  );

  if (donasiChartInst) donasiChartInst.destroy();
  donasiChartInst = new Chart(qs('#donasiChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Donasi Cash (Rp)',
        data:  cashData,
        backgroundColor: 'rgba(15,118,110,0.12)',
        borderColor:     '#0f766e',
        borderWidth: 2,
        borderRadius: 8,
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales:  { y: { ticks: { callback: v => 'Rp' + (v / 1000000).toFixed(1) + 'jt' } } },
    },
  });
}

/* ── Paket Management ───────────────────────────────────────────────────────── */
let currentPaketItems = [];

function addItem() {
  const name = prompt('Nama Barang:');
  if (!name) return;
  const unit = prompt('Satuan (e.g., kg, pcs):');
  if (!unit) return;
  const price = parseFloat(prompt('Harga Satuan:'));
  if (isNaN(price)) return;
  const qty = 1;
  const item = { name, unit, price, qty, subtotal: price * qty };
  currentPaketItems.push(item);
  renderPaketItems();
  updateTotals();
}

function renderPaketItems() {
  const tbody = qs('#itemList');
  tbody.innerHTML = currentPaketItems.map((item, i) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.unit}</td>
      <td>${rupiah(item.price)}</td>
      <td>
        <div class="qty-controls">
          <button onclick="changeQty(${i}, -1)">-</button>
          <span class="qty-value">${item.qty}</span>
          <button onclick="changeQty(${i}, 1)">+</button>
        </div>
      </td>
      <td class="subtotal">${rupiah(item.subtotal)}</td>
      <td>
        <div class="act-btns">
          <button class="act-edit-btn" onclick="editItem(${i})">${SVG.edit}</button>
          <button class="act-del-btn" onclick="deleteItem(${i})">${SVG.trash}</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function changeQty(index, delta) {
  currentPaketItems[index].qty += delta;
  if (currentPaketItems[index].qty < 1) currentPaketItems[index].qty = 1;
  currentPaketItems[index].subtotal = currentPaketItems[index].price * currentPaketItems[index].qty;
  renderPaketItems();
  updateTotals();
}

function editItem(index) {
  const item = currentPaketItems[index];
  const name = prompt('Nama Barang:', item.name);
  if (!name) return;
  const unit = prompt('Satuan:', item.unit);
  if (!unit) return;
  const price = parseFloat(prompt('Harga Satuan:', item.price));
  if (isNaN(price)) return;
  item.name = name;
  item.unit = unit;
  item.price = price;
  item.subtotal = price * item.qty;
  renderPaketItems();
  updateTotals();
}

function deleteItem(index) {
  if (confirm('Hapus item ini?')) {
    currentPaketItems.splice(index, 1);
    renderPaketItems();
    updateTotals();
  }
}

function updateTotals() {
  const totalPerPaket = currentPaketItems.reduce((sum, item) => sum + item.subtotal, 0);
  const jumlahPaket = parseInt(qs('#jumlahPaket').value) || 1;
  const totalKeseluruhan = totalPerPaket * jumlahPaket;
  qs('#totalPerPaket').textContent = rupiah(totalPerPaket);
  qs('#totalKeseluruhan').textContent = rupiah(totalKeseluruhan);
}

function savePaket() {
  const name = qs('#paketName').value;
  const date = qs('#paketDate').value;
  const desc = qs('#paketDesc').value;
  if (!name || !date) {
    alert('Nama paket dan tanggal wajib diisi.');
    return;
  }
  if (currentPaketItems.length === 0) {
    alert('Tambahkan minimal 1 item.');
    return;
  }
  const totalCost = currentPaketItems.reduce((sum, item) => sum + item.subtotal, 0);
  appData.paket.push({
    date,
    location: 'Papan Sedekah ' + name,
    pj: 'Admin',
    cost: totalCost,
    created: parseInt(qs('#jumlahPaket').value) || 1,
    distributed: 0,
    status: 'Draft',
    items: currentPaketItems,
  });
  currentPaketItems = [];
  renderPaketItems();
  updateTotals();
  qs('#paketName').value = '';
  qs('#paketDate').value = '';
  qs('#paketDesc').value = '';
  qs('#jumlahPaket').value = '1';
  alert('Paket berhasil disimpan!');
  renderAll();
}

/* ── Init ───────────────────────────────────────────────────────────────────── */
qsa('.menu-item').forEach(btn => btn.addEventListener('click', () => setPage(btn.dataset.page)));
qs('#hamburger').addEventListener('click', () => qs('#sidebar').classList.toggle('open'));
qs('#jumlahPaket').addEventListener('input', updateTotals);

(async function init() {
  await loadAllData();
  renderAll();
  initCharts();
  initMap();
})();
