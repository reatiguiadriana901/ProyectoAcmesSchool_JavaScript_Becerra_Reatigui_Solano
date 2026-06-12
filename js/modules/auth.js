// ================================================
// js/modules/auth.js
// Maneja todo lo relacionado con autenticación:
// login, logout y protección de rutas privadas.
// ================================================

import {
  getUserByEmail,
  setSession,
  getSession,
  clearSession,
  isLoggedIn,
} from '../utils/storage.js';

// ── Login ────────────────────────────────────
// Recibe email y password, verifica credenciales.
// Devuelve { ok: true, user } o { ok: false, error }
export function login(email, password) {
  if (!email || !password) {
    return { ok: false, error: 'Completa todos los campos.' };
  }

  const user = getUserByEmail(email);

  if (!user) {
    return { ok: false, error: 'No existe ninguna cuenta con ese correo.' };
  }

  // Comparación simple (en producción usaría bcrypt o similar)
  if (user.password !== password) {
    return { ok: false, error: 'Contraseña incorrecta.' };
  }

  setSession(user);
  return { ok: true, user };
}

// ── Logout ───────────────────────────────────
export function logout() {
  clearSession();
  // Redirigir al login (ajusta la ruta según donde esté index.html)
  const isInPages = window.location.pathname.includes('/pages/');
  window.location.href = isInPages ? '../index.html' : 'index.html';
}

// ── Proteger rutas privadas ──────────────────
// Llama esta función al inicio de cada página privada.
// Si no hay sesión, redirige al login automáticamente.
export function requireAuth() {
  if (!isLoggedIn()) {
    const isInPages = window.location.pathname.includes('/pages/');
    window.location.href = isInPages ? '../index.html' : 'index.html';
    return null;
  }
  return getSession();
}

// ── Mostrar datos del usuario en la navbar ───
export function renderNavUser() {
  const session = getSession();
  if (!session) return;

  const nameEl = document.getElementById('navUserName');
  if (nameEl) nameEl.textContent = session.name;

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
}

// Si estamos en una página con navbar, inicializar
if (document.getElementById('navbar')) {
  renderNavUser();
}
