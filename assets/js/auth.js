/**
 * AUTH — Modul autentikasi sisi klien untuk prototype Papan Sedekah.
 * Produksi: ganti CREDENTIALS dengan panggilan ke backend API.
 */
const AUTH = (() => {
  const SESSION_KEY = 'ps_auth_session';

  // Kredensial hardcoded untuk prototype.
  // JANGAN simpan password plaintext di produksi — gunakan backend + hashing.
  const CREDENTIALS = [
    { email:'admin@amalbunda.org',    password:'Admin@2026',    name:'Admin Pusat',        role:'Super Admin' },
    { email:'keuangan@amalbunda.org', password:'Bendahara1!',   name:'Bendahara LAZ',      role:'Super Admin' },
    { email:'siti@amalbunda.org',     password:'Koordinator1',  name:'Siti Aminah',        role:'Koordinator' },
    { email:'nur@amalbunda.org',      password:'Koordinator1',  name:'Nur Hasanah',        role:'Koordinator' },
    { email:'rina@amalbunda.org',     password:'Koordinator1',  name:'Rina Marlina',       role:'Koordinator' },
    { email:'yusuf@amalbunda.org',    password:'Koordinator1',  name:'Yusuf Hidayatullah', role:'Koordinator' },
    { email:'dewi@amalbunda.org',     password:'Anggota123!',   name:'Dewi Rahayu',        role:'Anggota'     },
    { email:'asep@amalbunda.org',     password:'Anggota123!',   name:'Asep Saepudin',      role:'Anggota'     },
  ];

  function _generateToken() {
    return Array.from(crypto.getRandomValues(new Uint8Array(20)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Coba login via API. Fallback ke hardcoded credentials jika API tidak tersedia.
   */
  async function login(email, password) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        const session = {
          token:     _generateToken(),
          name:      data.user.name,
          email:     data.user.email,
          role:      data.user.role,
          loginTime: Date.now()
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return { success: true, user: session };
      }
      return { success: false };
    } catch {
      const found = CREDENTIALS.find(
        c => c.email === email.trim().toLowerCase() && c.password === password
      );
      if (!found) return { success: false };
      const session = {
        token:     _generateToken(),
        name:      found.name,
        email:     found.email,
        role:      found.role,
        loginTime: Date.now()
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { success: true, user: session };
    }
  }

  /** Hapus sesi dan arahkan ke halaman login. */
  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.replace('login.html');
  }

  /** Kembalikan true jika sesi valid ada di sessionStorage. */
  function isLoggedIn() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return false;
      const s = JSON.parse(raw);
      return !!(s && s.token && s.email);
    } catch { return false; }
  }

  /** Kembalikan objek sesi saat ini atau null. */
  function getCurrentUser() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); }
    catch { return null; }
  }

  /**
   * Guard: panggil di atas setiap halaman yang butuh login.
   * Langsung redirect ke login.html jika belum login.
   */
  function requireAuth() {
    if (!isLoggedIn()) window.location.replace('login.html');
  }

  /**
   * Guard: panggil di halaman login.
   * Langsung redirect ke dashboard jika sudah login.
   */
  function requireGuest() {
    if (isLoggedIn()) window.location.replace('index.html');
  }

  return { login, logout, isLoggedIn, getCurrentUser, requireAuth, requireGuest };
})();
