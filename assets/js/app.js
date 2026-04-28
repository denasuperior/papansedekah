const rupiah = n => new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 }).format(n);
const qs  = s => document.querySelector(s);
const qsa = s => document.querySelectorAll(s);

/* ── User role ────────────────────────────────────────────────────────────── */
const _currentUser = AUTH.getCurrentUser() || {};
const _role = _currentUser.role || 'Anggota';
document.body.dataset.role = _role === 'Super Admin' ? 'super-admin' : _role.toLowerCase();
const _isSA   = _role === 'Super Admin';
const _isKoor = _role === 'Koordinator';

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
async function apiPut(endpoint, id, data) {
  return api(`${endpoint}/${id}`, { method: 'PUT', body: data });
}
async function loadAllData() {
  const [lokasi, relawan, penerima, donasi, paket, dokumentasi, users] = await Promise.all([
    api('lokasi'), api('relawan'), api('penerima'), api('donasi'),
    api('paket'), api('dokumentasi'), api('users'),
  ]);
  appData.lokasi       = lokasi;
  appData.relawan      = relawan;
  appData.penerima     = penerima;
  appData.donasi       = donasi;
  appData.paket        = paket;
  appData.dokumentasi  = dokumentasi;
  appData.users        = users;
}
const appData = { lokasi:[], relawan:[], penerima:[], donasi:[], paket:[], dokumentasi:[], users:[] };

/* ── SVG icon strings ─────────────────────────────────────────────────────── */
const SVG = {
  edit:   `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  trash:  `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  pkg:    `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  money:  `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  cam:    `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  gift:   `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`,
  chat:   `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  verify: `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
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
    laporan:     ['Laporan',            'Export & Import laporan data'],
    pengguna:    ['Admin & Role',       'Kelola admin dan hak akses'],
  };
  qs('#pageTitle').textContent = titles[page][0];
  qs('#pageDesc').textContent  = titles[page][1];
  qs('#sidebar').classList.remove('open');
}

/* ── Edit state ───────────────────────────────────────────────────────────── */
let editingId = null;
let editingType = null;

function startEdit(type, i) {
  const row = appData[type][i];
  editingId   = row.id;
  editingType = type;
  const modalMap = {
    lokasi:'modalLokasi', relawan:'modalRelawan', penerima:'modalPenerima',
    donasi:'modalDonasi', paket:'modalPaket', dokumentasi:'modalDokumentasi', users:'modalUser',
  };
  const modal = modalMap[type];
  const form  = qs(`#${modal} form`);
  const title = qs(`#${modal} h3`);
  const titles = {
    lokasi:'Edit Lokasi', relawan:'Edit Relawan', penerima:'Edit Penerima',
    donasi:'Edit Donasi', paket:'Edit Paket', dokumentasi:'Edit Dokumentasi', users:'Edit Admin',
  };
  title.textContent = titles[type] || 'Edit';
  Object.keys(row).forEach(key => {
    if (key === 'id') return;
    const input = form.elements[key];
    if (input) input.value = row[key] ?? '';
  });
  const hint = qs('#docFileHint');
  if (hint) hint.style.display = (type === 'dokumentasi') ? 'block' : 'none';
  openModal(modal);
}

function resetEditState(modalId) {
  editingId   = null;
  editingType = null;
  const form  = qs(`#${modalId} form`);
  const title = qs(`#${modalId} h3`);
  const addTitles = {
    modalLokasi:'Tambah Lokasi', modalRelawan:'Tambah Relawan', modalPenerima:'Tambah Penerima Manfaat',
    modalDonasi:'Tambah Donasi', modalPaket:'Tambah Laporan Paket', modalDokumentasi:'Upload Dokumentasi', modalUser:'Tambah Admin',
  };
  title.textContent = addTitles[modalId] || 'Tambah';
  form.reset();
  const hint = qs('#docFileHint');
  if (hint) hint.style.display = 'none';
}

/* ── Populate location dropdowns from appData.lokasi ────────────────────── */
function populateLocationDropdowns() {
  const opts = appData.lokasi
    .map(l => `<option value="${l.name}">${l.name.replace('Papan Sedekah ', '')}</option>`)
    .join('');
  /* modal form selects */
  qsa('.loc-select').forEach(sel => {
    const current = sel.value;
    sel.innerHTML = `<option value="">— Pilih Lokasi —</option>${opts}`;
    if (current) sel.value = current;
  });
  /* filter bar selects (use abbreviated names to match table cell text) */
  const filterOpts = appData.lokasi
    .map(l => { const short = l.name.replace('Papan Sedekah ', ''); return `<option value="${short}">${short}</option>`; })
    .join('');
  qsa('.loc-filter-select').forEach(sel => {
    const current = sel.value;
    sel.innerHTML = `<option value="">Semua Lokasi</option>${filterOpts}`;
    if (current) sel.value = current;
  });
}

/* ── Table renderer (supports extra role-based action buttons) ───────────── */
function renderTable(id, rows, columns, onDelete, editType, extraBtns) {
  const tbody = qs(`#${id} tbody`);
  if (!tbody) return;
  if (rows.length === 0) {
    const cols = columns.length + (onDelete || extraBtns ? 1 : 0);
    tbody.innerHTML = `<tr><td colspan="${cols}" class="empty-state-cell">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg>
      <p>Belum ada data</p>
    </td></tr>`;
    return;
  }
  tbody.innerHTML = rows.map((row, i) => {
    const cells   = columns.map(col => `<td>${col(row)}</td>`).join('');
    const editBtn = onDelete ? `<button class="act-edit-btn" title="Edit" onclick="startEdit('${editType}',${i})">${SVG.edit}</button>` : '';
    const delBtn  = onDelete ? `<button class="act-del-btn" title="Hapus" onclick="confirmDialog('Hapus data ini? Tindakan tidak dapat dibatalkan.', () => ${onDelete}(${i}))">${SVG.trash}</button>` : '';
    const extra   = extraBtns ? extraBtns(row, i) : '';
    const actionHtml = (onDelete || extraBtns)
      ? `<td><div class="act-btns">${editBtn}${delBtn}${extra}</div></td>` : '';
    return `<tr>${cells}${actionHtml}</tr>`;
  }).join('');
}

/* ── Delete helpers ───────────────────────────────────────────────────────── */
async function delLokasi(i)      { await apiDelete('lokasi',      appData.lokasi[i].id);      await loadAllData(); renderAll(); initMap(); showToast('Lokasi berhasil dihapus.', 'info'); }
async function delRelawan(i)     { await apiDelete('relawan',     appData.relawan[i].id);     await loadAllData(); renderAll(); showToast('Relawan berhasil dihapus.', 'info'); }
async function delPenerima(i)    { await apiDelete('penerima',    appData.penerima[i].id);    await loadAllData(); renderAll(); showToast('Penerima berhasil dihapus.', 'info'); }
async function delDonasi(i)      { await apiDelete('donasi',      appData.donasi[i].id);      await loadAllData(); renderAll(); showToast('Donasi berhasil dihapus.', 'info'); }
async function delPaket(i)       { await apiDelete('paket',       appData.paket[i].id);       await loadAllData(); renderAll(); showToast('Paket berhasil dihapus.', 'info'); }
async function delUser(i)        { await apiDelete('users',       appData.users[i].id);       await loadAllData(); renderAll(); showToast('Admin berhasil dihapus.', 'info'); }
async function delDokumentasi(i) { await apiDelete('dokumentasi', appData.dokumentasi[i].id); await loadAllData(); renderAll(); showToast('Dokumentasi berhasil dihapus.', 'info'); }

/* ── Paket workflow (role-based status transitions) ──────────────────────── */
async function ajukanPaket(i) {
  const p = appData.paket[i];
  await apiPut('paket', p.id, { date:p.date, location:p.location, pj:p.pj, cost:p.cost, created:p.created, distributed:p.distributed, status:'Diajukan' });
  await loadAllData(); renderAll();
  showToast('Paket berhasil diajukan!');
}
async function verifyPaket(i) {
  const p = appData.paket[i];
  await apiPut('paket', p.id, { date:p.date, location:p.location, pj:p.pj, cost:p.cost, created:p.created, distributed:p.distributed, status:'Terverifikasi' });
  await loadAllData(); renderAll();
  showToast('Paket berhasil diverifikasi!');
}

/* ── Badge ─────────────────────────────────────────────────────────────────── */
function badge(text, color) {
  let cls = color || 'green';
  if (['Diajukan','Koordinator','Natura/Barang'].includes(text))                                  cls = 'yellow';
  if (['Tidak Aktif','Perlu Revisi'].includes(text))                                               cls = 'red';
  if (['Super Admin','Anggota','Fakir','Miskin','Fisabilillah','Gharim','Ibnu Sabil','Mualaf'].includes(text)) cls = 'blue';
  if (['Draft'].includes(text))                                                                     cls = 'gray';
  return `<span class="badge ${cls}">${text}</span>`;
}

/* ── Render all tables + dashboard ─────────────────────────────────────────── */
function renderAll() {
  /* stat cards */
  qs('#totalLokasi').textContent   = appData.lokasi.filter(l => l.status === 'Aktif').length;
  qs('#totalRelawan').textContent  = appData.relawan.length;
  qs('#totalPenerima').textContent = appData.penerima.length;
  qs('#totalCash').textContent     = rupiah(appData.donasi.filter(d => d.type.includes('Cash')).reduce((t, d) => t + parseFloat(d.value || 0), 0));
  qs('#paketDibuat').textContent   = appData.paket.reduce((t, p) => t + p.created, 0);
  qs('#paketSalur').textContent    = appData.paket.reduce((t, p) => t + p.distributed, 0);

  /* tables — Super Admin gets edit+delete; others are read-only */
  renderTable('tableLokasi', appData.lokasi, [
    r => r.name, r => r.address, r => r.district, r => badge(r.status), r => `${r.lat}, ${r.lng}`,
  ], _isSA ? 'delLokasi' : null, _isSA ? 'lokasi' : null);

  renderTable('tableRelawan', appData.relawan, [
    r => r.name, r => r.phone, r => r.job, r => badge(r.position), r => r.location.replace('Papan Sedekah ', ''),
  ], _isSA ? 'delRelawan' : null, _isSA ? 'relawan' : null);

  renderTable('tablePenerima', appData.penerima, [
    r => r.name, r => r.address, r => r.phone, r => badge(r.asnaf, 'blue'), r => r.location.replace('Papan Sedekah ', ''),
  ], _isSA ? 'delPenerima' : null, _isSA ? 'penerima' : null);

  renderTable('tableDonasi', appData.donasi, [
    r => r.donor,
    r => formatTanggalBulan(r.month),
    r => r.location.replace('Papan Sedekah ', ''),
    r => badge(r.type, r.type.includes('Cash') ? 'green' : 'yellow'),
    r => r.type.includes('Cash') ? rupiah(parseFloat(r.value)) : r.value,
    r => r.notes,
  ], _isSA ? 'delDonasi' : null, _isSA ? 'donasi' : null);

  /* Paket — SA: edit+delete+verify; Koordinator: ajukan (Draft only); Anggota: read-only */
  renderTable('tablePaket', appData.paket, [
    r => r.date,
    r => r.location.replace('Papan Sedekah ', ''),
    r => r.pj,
    r => rupiah(r.cost),
    r => r.created,
    r => r.distributed,
    r => r.created - r.distributed,
    r => badge(r.status),
  ],
  _isSA ? 'delPaket' : null,
  _isSA ? 'paket'    : null,
  (row, i) => {
    if (_isSA && row.status !== 'Terverifikasi')
      return `<button class="act-verify-btn" title="Verifikasi Paket" onclick="verifyPaket(${i})">${SVG.verify}</button>`;
    if (_isKoor && row.status === 'Draft')
      return `<button class="act-ajukan-btn" onclick="ajukanPaket(${i})">Ajukan</button>`;
    return '';
  });

  /* Users — SA: full table with role column; others: simplified read-only */
  if (_isSA) {
    qs('#tableUserHead').innerHTML = '<tr><th>Nama</th><th>Email</th><th>Role</th><th>Titik Tugas</th><th>Status</th><th>Aksi</th></tr>';
    renderTable('tableUser', appData.users, [
      r => r.name, r => r.email, r => badge(r.role), r => r.location, r => badge(r.status),
    ], 'delUser', 'users');
  } else {
    qs('#tableUserHead').innerHTML = '<tr><th>Nama</th><th>Email</th><th>Titik Tugas</th><th>Status</th></tr>';
    renderTable('tableUser', appData.users, [
      r => r.name, r => r.email, r => r.location, r => badge(r.status),
    ], null, null);
  }

  /* dokumentasi cards */
  const docCfg = {
    Penyaluran: { icon: SVG.gift,  bg: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', color: '#065f46' },
    Donasi:     { icon: SVG.money, bg: 'linear-gradient(135deg,#fef3c7,#fde68a)', color: '#92400e' },
    Persiapan:  { icon: SVG.pkg,   bg: 'linear-gradient(135deg,#dbeafe,#bfdbfe)', color: '#1e40af' },
    Rapat:      { icon: SVG.chat,  bg: 'linear-gradient(135deg,#ede9fe,#ddd6fe)', color: '#5b21b6' },
  };
  qs('#docGrid').innerHTML = appData.dokumentasi.length === 0
    ? `<div class="doc-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg><p>Belum ada dokumentasi diunggah</p></div>`
    : appData.dokumentasi.map((d, i) => {
      const cfg    = docCfg[d.category] || { icon: SVG.cam, bg: 'linear-gradient(135deg,#f1f5f9,#e2e8f0)', color: '#475569' };
      const isImg  = d.file_url && /\.(jpe?g|png|gif|webp)$/i.test(d.file_url);
      const thumb  = d.file_url && isImg
        ? `<img src="${d.file_url}" style="width:100%;height:100%;object-fit:cover;" alt="${d.title}">`
        : `<div class="doc-thumb-icon" style="color:${cfg.color}">${cfg.icon}</div>`;
      const fileBtn = d.file_url
        ? `<a href="${d.file_url}" target="_blank" rel="noopener" class="doc-open-btn">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
             Buka File
           </a>`
        : `<span class="doc-no-file">Tidak ada file</span>`;
      const editDelBtns = _isSA
        ? `<button class="act-edit-btn" title="Edit" onclick="startEdit('dokumentasi',${i})">${SVG.edit}</button>
           <button class="act-del-btn" title="Hapus" onclick="confirmDialog('Hapus dokumentasi ini?', () => delDokumentasi(${i}))">${SVG.trash}</button>`
        : '';
      return `<article class="doc-card">
        <div class="doc-thumb" style="background:${cfg.bg}">${thumb}</div>
        <div class="doc-card-body">
          <span class="doc-cat-badge">${d.category || 'Umum'}</span>
          <h4>${d.title}</h4>
          <p class="doc-meta">${formatTanggal(d.date)} · ${d.location.replace('Papan Sedekah ', '')}</p>
          <p class="doc-desc">${d.desc || ''}</p>
          <div class="doc-card-footer">
            ${fileBtn}
            <div class="act-btns">${editDelBtns}</div>
          </div>
        </div>
      </article>`;
    }).join('');

  /* activity list — items are clickable, each links to its source page */
  const actIcon = { paket: SVG.pkg, donasi: SVG.money, dokumentasi: SVG.cam };
  const allAct = [
    ...appData.paket.map(r => ({
      icon: actIcon.paket,
      text: `Laporan paket <strong>${r.location.replace('Papan Sedekah ', '')}</strong> oleh ${r.pj}`,
      date: r.date, badgeText: r.status, page: 'paket',
    })),
    ...appData.donasi.map(r => ({
      icon: actIcon.donasi,
      text: `Donasi dari <strong>${r.donor}</strong> — ${r.type}`,
      date: r.month + '-01', badgeText: r.type.includes('Cash') ? 'Cash' : 'Natura', page: 'donatur',
    })),
    ...appData.dokumentasi.map(r => ({
      icon: actIcon.dokumentasi,
      text: `Dokumentasi: <strong>${r.title}</strong>`,
      date: r.date, badgeText: r.category, page: 'dokumentasi',
    })),
  ]
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 5);

  /* update bell badge count */
  const bellBadge = qs('#bellBadge');
  if (bellBadge) bellBadge.textContent = allAct.length > 0 ? allAct.length : '';

  qs('#activityList').innerHTML = allAct.map(item => `
    <li class="act-item-link" onclick="setPage('${item.page}')" title="Klik untuk melihat ${item.page}">
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
    recentTbody.innerHTML = latest.map(r => {
      const realIdx      = appData.penerima.indexOf(r);
      const editDelBtns  = _isSA
        ? `<button class="act-edit-btn" title="Edit" onclick="startEdit('penerima',${realIdx})">${SVG.edit}</button>
           <button class="act-del-btn"  title="Hapus" onclick="confirmDialog('Hapus data ini? Tindakan tidak dapat dibatalkan.', () => delPenerima(${realIdx}))">${SVG.trash}</button>`
        : '';
      return `<tr>
        <td>${r.name}</td>
        <td>${badge(r.asnaf, 'blue')}</td>
        <td>${r.address}</td>
        <td>${r.location.replace('Papan Sedekah ', '')}</td>
        <td>${r.phone}</td>
        <td><div class="act-btns">${editDelBtns}</div></td>
      </tr>`;
    }).join('');
  }

  /* repopulate location dropdowns after each data refresh */
  populateLocationDropdowns();
}

/* ── Modal helpers ──────────────────────────────────────────────────────────── */
function openModal(id)  { qs(`#${id}`).classList.add('active'); }
function closeModal(id) { qs(`#${id}`).classList.remove('active'); }
function getFormData(f) { return Object.fromEntries(new FormData(f).entries()); }

/* ── Form submit handlers ────────────────────────────────────────────────── */
async function addLokasi(e) {
  e.preventDefault(); const d = getFormData(e.target);
  const data = { name:d.name, address:d.address, district:d.district, status:d.status||'Aktif', lat:parseFloat(d.lat)||-6.9, lng:parseFloat(d.lng)||107.7 };
  const isEdit = !!(editingId && editingType === 'lokasi');
  if (isEdit) { await apiPut('lokasi', editingId, data); } else { await apiPost('lokasi', data); }
  resetEditState('modalLokasi'); closeModal('modalLokasi'); await loadAllData(); renderAll(); initMap();
  showToast(isEdit ? 'Lokasi berhasil diperbarui!' : 'Lokasi berhasil ditambahkan!');
}
async function addRelawan(e) {
  e.preventDefault(); const d = getFormData(e.target);
  const data = { name:d.name, phone:d.phone, job:d.job, position:d.position, location:d.location };
  const isEdit = !!(editingId && editingType === 'relawan');
  if (isEdit) { await apiPut('relawan', editingId, data); } else { await apiPost('relawan', data); }
  resetEditState('modalRelawan'); closeModal('modalRelawan'); await loadAllData(); renderAll();
  showToast(isEdit ? 'Relawan berhasil diperbarui!' : 'Relawan berhasil ditambahkan!');
}
async function addPenerima(e) {
  e.preventDefault(); const d = getFormData(e.target);
  const data = { name:d.name, address:d.address, phone:d.phone, asnaf:d.asnaf, location:d.location };
  const isEdit = !!(editingId && editingType === 'penerima');
  if (isEdit) { await apiPut('penerima', editingId, data); } else { await apiPost('penerima', data); }
  resetEditState('modalPenerima'); closeModal('modalPenerima'); await loadAllData(); renderAll();
  showToast(isEdit ? 'Penerima berhasil diperbarui!' : 'Penerima berhasil ditambahkan!');
}
async function addDonasi(e) {
  e.preventDefault(); const d = getFormData(e.target);
  const data = { donor:d.donor, month:d.month, location:d.location, type:d.type, value:d.value, notes:d.notes };
  const isEdit = !!(editingId && editingType === 'donasi');
  if (isEdit) { await apiPut('donasi', editingId, data); } else { await apiPost('donasi', data); }
  resetEditState('modalDonasi'); closeModal('modalDonasi'); await loadAllData(); renderAll();
  showToast(isEdit ? 'Donasi berhasil diperbarui!' : 'Donasi berhasil ditambahkan!');
}
async function addPaket(e) {
  e.preventDefault(); const d = getFormData(e.target);
  const data = { date:d.date, location:d.location, pj:d.pj, cost:Number(d.cost), created:Number(d.created), distributed:Number(d.distributed), status:d.status };
  const isEdit = !!(editingId && editingType === 'paket');
  if (isEdit) { await apiPut('paket', editingId, data); } else { await apiPost('paket', data); }
  resetEditState('modalPaket'); closeModal('modalPaket'); await loadAllData(); renderAll();
  showToast(isEdit ? 'Paket berhasil diperbarui!' : 'Laporan paket berhasil disimpan!');
}
async function addDokumentasi(e) {
  e.preventDefault();
  const isEdit = !!(editingId && editingType === 'dokumentasi');
  const fd = new FormData(e.target);
  if (isEdit && fd.get('file') && !fd.get('file').size) fd.delete('file');
  const url    = isEdit ? `${API_BASE}/dokumentasi/${editingId}` : `${API_BASE}/dokumentasi`;
  const method = isEdit ? 'PUT' : 'POST';
  await fetch(url, { method, body: fd });
  resetEditState('modalDokumentasi'); closeModal('modalDokumentasi'); await loadAllData(); renderAll();
  showToast(isEdit ? 'Dokumentasi berhasil diperbarui!' : 'Dokumentasi berhasil diunggah!');
}
async function addUser(e) {
  e.preventDefault(); const d = getFormData(e.target);
  const data = { name:d.name, email:d.email, role:d.role, location:d.location||'Semua Titik', status:d.status||'Aktif' };
  const isEdit = !!(editingId && editingType === 'users');
  if (isEdit) {
    if (d.password) data.password = d.password;
    await apiPut('users', editingId, data);
  } else {
    data.password = d.password || 'Anggota123!';
    await apiPost('users', data);
  }
  resetEditState('modalUser'); closeModal('modalUser'); await loadAllData(); renderAll();
  showToast(isEdit ? 'Admin berhasil diperbarui!' : 'Admin berhasil ditambahkan!');
}

/* ── Filter functions ────────────────────────────────────────────────────── */
function filterTable(value, tableId) {
  const term = value.toLowerCase();
  qsa(`#${tableId} tbody tr`).forEach(row =>
    row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none'
  );
}
function filterBySelect(selectEl, tableId, colIndex) {
  const value = selectEl.value;
  qsa(`#${tableId} tbody tr`).forEach(row => {
    if (!value || value.startsWith('Semua')) { row.style.display = ''; return; }
    const cell = row.querySelectorAll('td')[colIndex];
    row.style.display = (cell && cell.textContent.trim() === value) ? '' : 'none';
  });
}

/* Sort donasi by cash nominal (asc/desc/default) */
function sortDonasi(val) {
  if (val === 'asc') {
    appData.donasi.sort((a, b) => (parseFloat(a.value) || 0) - (parseFloat(b.value) || 0));
  } else if (val === 'desc') {
    appData.donasi.sort((a, b) => (parseFloat(b.value) || 0) - (parseFloat(a.value) || 0));
  } else {
    appData.donasi.sort((a, b) => a.id - b.id);
  }
  renderAll();
}

/* ── Toast notifications ─────────────────────────────────────────────────── */
function showToast(message, type = 'success') {
  const icons = { success: '✓', error: '✕', info: 'i', warning: '!' };
  const container = qs('#toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || '✓'}</span><span>${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 350); }, 3200);
}

/* ── Styled confirm dialog ───────────────────────────────────────────────── */
function confirmDialog(message, onConfirm) {
  const modal = qs('#confirmModal');
  qs('#confirmMsg').textContent = message;
  modal.classList.add('active');
  qs('#confirmOk').onclick     = () => { modal.classList.remove('active'); onConfirm(); };
  qs('#confirmCancel').onclick = () => modal.classList.remove('active');
  modal.onclick = e => { if (e.target === modal) modal.classList.remove('active'); };
}

/* ── Bell dropdown ───────────────────────────────────────────────────────── */
function toggleBellDropdown() {
  const dd = qs('#bellDropdown');
  const isOpen = dd.classList.toggle('open');
  if (isOpen) renderBellDropdown();
}

function renderBellDropdown() {
  const actIconMap = { paket: SVG.pkg, donasi: SVG.money, dokumentasi: SVG.cam };
  const allAct = [
    ...appData.paket.map(r => ({
      icon: actIconMap.paket,
      text: `Laporan paket <strong>${r.location.replace('Papan Sedekah ', '')}</strong> oleh ${r.pj}`,
      date: r.date, badgeText: r.status, page: 'paket',
    })),
    ...appData.donasi.map(r => ({
      icon: actIconMap.donasi,
      text: `Donasi dari <strong>${r.donor}</strong> — ${r.type}`,
      date: r.month + '-01', badgeText: r.type.includes('Cash') ? 'Cash' : 'Natura', page: 'donatur',
    })),
    ...appData.dokumentasi.map(r => ({
      icon: actIconMap.dokumentasi,
      text: `Dokumentasi: <strong>${r.title}</strong>`,
      date: r.date, badgeText: r.category, page: 'dokumentasi',
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const list    = qs('#bellList');
  const countEl = qs('#bellCount');
  if (countEl) countEl.textContent = allAct.length ? `${allAct.length} terbaru` : '';

  if (allAct.length === 0) { list.innerHTML = '<p class="bell-empty">Belum ada aktivitas</p>'; return; }
  list.innerHTML = allAct.map(item => `
    <li class="bell-item-link" onclick="setPage('${item.page}');toggleBellDropdown()" title="Buka ${item.page}">
      <div class="act-icon">${item.icon}</div>
      <div class="act-body">
        <p>${item.text}</p>
        <small>${formatTanggal(item.date)} &nbsp;·&nbsp; <span class="act-badge">${item.badgeText}</span></small>
      </div>
    </li>`).join('');
}

/* ── Export CSV (with proper Indonesian headers) ────────────────────────── */
const _csvHeaders = {
  relawan:  { name:'Nama Relawan', phone:'Nomor HP', job:'Pekerjaan', position:'Jabatan', location:'Titik Tugas' },
  lokasi:   { name:'Nama Titik', address:'Alamat Lengkap', district:'Kecamatan', status:'Status', lat:'Latitude', lng:'Longitude' },
  penerima: { name:'Nama Penerima', address:'Alamat', phone:'Nomor HP', asnaf:'Kategori Asnaf', location:'Titik Penerimaan' },
  donasi:   { donor:'Donatur', month:'Bulan Donasi', location:'Titik Lokasi', type:'Jenis Donasi', value:'Nominal/Barang', notes:'Catatan' },
  paket:    { date:'Tanggal', location:'Lokasi', pj:'Penanggung Jawab', cost:'Total Biaya (Rp)', created:'Paket Dibuat', distributed:'Paket Disalurkan', status:'Status' },
};

function exportCSV(type) {
  const map  = { relawan:appData.relawan, lokasi:appData.lokasi, penerima:appData.penerima, donasi:appData.donasi, paket:appData.paket };
  const rows = map[type];
  if (!rows || rows.length === 0) { showToast('Tidak ada data untuk diekspor.', 'warning'); return; }
  const colMap   = _csvHeaders[type] || {};
  const dbCols   = Object.keys(rows[0]).filter(k => k !== 'id');
  const headerRow = dbCols.map(k => `"${colMap[k] || k}"`).join(',');
  const csv = [
    headerRow,
    ...rows.map(row => dbCols.map(h => `"${String(row[h] ?? '').replaceAll('"', '""')}"`).join(',')),
  ].join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `laporan-${type}-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  URL.revokeObjectURL(url);
  showToast(`Laporan ${type} berhasil diekspor!`);
}

/* ── Import CSV ──────────────────────────────────────────────────────────── */
function importCSV(type) {
  if (!_isSA) { showToast('Hanya Super Admin yang dapat mengimpor data.', 'error'); return; }
  const input = document.createElement('input');
  input.type   = 'file';
  input.accept = '.csv';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    showToast('Mengimpor data...', 'info');
    const text  = await file.text();
    const lines = text.replace(/\r/g, '').split('\n').filter(l => l.trim());
    if (lines.length < 2) { showToast('File CSV kosong atau format tidak valid.', 'error'); return; }
    const rawHeaders = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
    const colMap     = _csvHeaders[type] || {};
    const reverseMap = Object.fromEntries(Object.entries(colMap).map(([k, v]) => [v, k]));
    const headers    = rawHeaders.map(h => reverseMap[h] || h.toLowerCase().replace(/\s+/g, '_'));
    const rows = lines.slice(1).map(line => {
      const vals = []; let inQ = false, cur = '';
      for (const ch of line + ',') {
        if (ch === '"') { inQ = !inQ; }
        else if (ch === ',' && !inQ) { vals.push(cur); cur = ''; }
        else cur += ch;
      }
      const obj = {};
      headers.forEach((h, i) => { obj[h] = (vals[i] || '').trim(); });
      return obj;
    });
    let success = 0, fail = 0;
    for (const row of rows) {
      try { await apiPost(type, row); success++; } catch { fail++; }
    }
    await loadAllData(); populateLocationDropdowns(); renderAll();
    showToast(`Import selesai: ${success} berhasil${fail ? ', ' + fail + ' gagal' : ''}.`, success > 0 ? 'success' : 'error');
  };
  input.click();
}

/* ── Map ────────────────────────────────────────────────────────────────────── */
let mapInstance;
function initMap() {
  if (!window.L) return;
  if (mapInstance) { mapInstance.remove(); }
  mapInstance = L.map('map').setView([-6.93, 107.72], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(mapInstance);
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
      const cx = (chartArea.left + chartArea.right) / 2;
      const cy = (chartArea.top  + chartArea.bottom) / 2;
      ctx.save();
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = 'bold 22px Inter, system-ui'; ctx.fillStyle = '#0f172a';
      ctx.fillText(total, cx, cy - 9);
      ctx.font = '12px Inter, system-ui'; ctx.fillStyle = '#64748b';
      ctx.fillText('Penerima', cx, cy + 11);
      ctx.restore();
    },
  };

  if (asnafChartInst) asnafChartInst.destroy();
  asnafChartInst = new Chart(qs('#asnafChart'), {
    type: 'doughnut',
    plugins: [centerTextPlugin],
    data: { labels: asnafLabels, datasets: [{ data: asnafData, backgroundColor: asnafColors.slice(0, asnafLabels.length), borderWidth: 0, hoverOffset: 6 }] },
    options: { responsive: true, cutout: '68%', plugins: { legend: { position: 'bottom', labels: { padding: 14, font: { size: 12 }, boxWidth: 12, boxHeight: 12 } } } },
  });

  const monthNames = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const monthNums  = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  const lastIdx = monthNums.reduce((last, m, i) => {
    const has = appData.donasi.some(d => d.month.slice(5) === m) || appData.paket.some(p => p.date.slice(5, 7) === m);
    return has ? i : last;
  }, 0);
  const labels   = monthNames.slice(0, lastIdx + 1);
  const cashData = monthNums.slice(0, lastIdx + 1).map(m =>
    appData.donasi.filter(d => d.type.includes('Cash') && d.month.slice(5) === m).reduce((t, d) => t + parseFloat(d.value || 0), 0)
  );

  if (donasiChartInst) donasiChartInst.destroy();
  donasiChartInst = new Chart(qs('#donasiChart'), {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Donasi Cash (Rp)', data: cashData, backgroundColor: 'rgba(15,118,110,0.12)', borderColor: '#0f766e', borderWidth: 2, borderRadius: 8 }] },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: v => 'Rp' + (v / 1000000).toFixed(1) + 'jt' } } } },
  });
}

/* ── Paket Item Management ──────────────────────────────────────────────────── */
let currentPaketItems = [];
let editingItemIndex  = null;

function addItem() {
  editingItemIndex = null;
  qs('#modalItemTitle').textContent = 'Tambah Item';
  qs('#modalItem form').reset();
  openModal('modalItem');
}

function submitItemForm(e) {
  e.preventDefault();
  const d = getFormData(e.target);
  const name  = d.name.trim();
  const unit  = d.unit.trim();
  const price = parseFloat(d.price);
  if (!name || !unit || isNaN(price) || price < 0) return;
  if (editingItemIndex !== null) {
    const item = currentPaketItems[editingItemIndex];
    item.name = name; item.unit = unit; item.price = price; item.subtotal = price * item.qty;
    editingItemIndex = null;
  } else {
    currentPaketItems.push({ name, unit, price, qty: 1, subtotal: price });
  }
  closeModal('modalItem');
  renderPaketItems();
  updateTotals();
}

function renderPaketItems() {
  qs('#itemList').innerHTML = currentPaketItems.map((item, i) => `
    <tr>
      <td>${item.name}</td><td>${item.unit}</td><td>${rupiah(item.price)}</td>
      <td><div class="qty-controls">
        <button onclick="changeQty(${i}, -1)">-</button>
        <span class="qty-value">${item.qty}</span>
        <button onclick="changeQty(${i}, 1)">+</button>
      </div></td>
      <td class="subtotal">${rupiah(item.subtotal)}</td>
      <td><div class="act-btns">
        <button class="act-edit-btn" onclick="editItem(${i})">${SVG.edit}</button>
        <button class="act-del-btn"  onclick="deleteItem(${i})">${SVG.trash}</button>
      </div></td>
    </tr>`).join('');
}

function changeQty(index, delta) {
  currentPaketItems[index].qty = Math.max(1, currentPaketItems[index].qty + delta);
  currentPaketItems[index].subtotal = currentPaketItems[index].price * currentPaketItems[index].qty;
  renderPaketItems(); updateTotals();
}

function editItem(index) {
  editingItemIndex = index;
  const item = currentPaketItems[index];
  qs('#modalItemTitle').textContent = 'Edit Item';
  const form = qs('#modalItem form');
  form.elements['name'].value  = item.name;
  form.elements['unit'].value  = item.unit;
  form.elements['price'].value = item.price;
  openModal('modalItem');
}

function deleteItem(index) {
  confirmDialog('Hapus item ini?', () => { currentPaketItems.splice(index, 1); renderPaketItems(); updateTotals(); });
}

function updateTotals() {
  const totalPerPaket = currentPaketItems.reduce((sum, item) => sum + item.subtotal, 0);
  const jumlahPaket   = parseInt(qs('#jumlahPaket').value) || 1;
  qs('#totalPerPaket').textContent    = rupiah(totalPerPaket);
  qs('#totalKeseluruhan').textContent = rupiah(totalPerPaket * jumlahPaket);
}

/* savePaket — now saves to API with location and PJ fields */
async function savePaket() {
  const name = qs('#paketName').value.trim();
  const date = qs('#paketDate').value;
  const loc  = qs('#paketLoc').value;
  const pj   = qs('#paketPJ').value.trim() || (_currentUser.name || 'Admin');
  if (!name || !date) { showToast('Nama paket dan tanggal wajib diisi.', 'error'); return; }
  if (!loc)            { showToast('Pilih titik lokasi paket.', 'error'); return; }
  if (currentPaketItems.length === 0) { showToast('Tambahkan minimal 1 item terlebih dahulu.', 'error'); return; }
  const totalCost = currentPaketItems.reduce((sum, item) => sum + item.subtotal, 0);
  const created   = parseInt(qs('#jumlahPaket').value) || 1;
  await apiPost('paket', { date, location: loc, pj, cost: totalCost, created, distributed: 0, status: 'Draft' });
  currentPaketItems = [];
  renderPaketItems(); updateTotals();
  ['#paketName', '#paketDate', '#paketDesc', '#paketPJ'].forEach(s => { qs(s).value = ''; });
  qs('#jumlahPaket').value = '1';
  qs('#paketLoc').value    = '';
  await loadAllData(); populateLocationDropdowns(); renderAll();
  showToast('Paket berhasil disimpan ke database!');
}

/* ── Init ───────────────────────────────────────────────────────────────────── */
qsa('.menu-item').forEach(btn => btn.addEventListener('click', () => setPage(btn.dataset.page)));

const overlay = qs('#sidebarOverlay');
qs('#hamburger').addEventListener('click', () => {
  const isOpen = qs('#sidebar').classList.toggle('open');
  if (overlay) overlay.classList.toggle('show', isOpen);
});
if (overlay) overlay.addEventListener('click', () => {
  qs('#sidebar').classList.remove('open');
  overlay.classList.remove('show');
});

qs('#jumlahPaket').addEventListener('input', updateTotals);

qs('#globalSearch').addEventListener('input', function () {
  const activePage = qs('.page.active');
  const table = activePage ? activePage.querySelector('table[id]') : null;
  if (table) filterTable(this.value, table.id);
});

/* Ctrl+K / Cmd+K — focus the search bar from anywhere */
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    qs('#globalSearch').focus();
    qs('#globalSearch').select();
  }
});

document.addEventListener('click', e => {
  const bellWrap = qs('.bell-wrap');
  if (bellWrap && !bellWrap.contains(e.target)) qs('#bellDropdown').classList.remove('open');
});

(async function init() {
  await loadAllData();
  populateLocationDropdowns();
  renderAll();
  initCharts();
  initMap();
})();
