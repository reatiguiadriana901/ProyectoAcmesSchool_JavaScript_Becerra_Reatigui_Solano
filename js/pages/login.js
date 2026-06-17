// ================================================
// js/pages/login.js
// Controlador de la página de inicio de sesión.
// Conecta el formulario HTML con el módulo auth.
// ================================================

import { login, isLoggedIn } from '../modules/auth.js';

// Si ya hay sesión activa, redirigir directo al dashboard
if (isLoggedIn()) {
  window.location.href = 'gestion-examenes.html';
}

const form       = document.getElementById('loginForm');
const emailInput = document.getElementById('loginEmail');
const passInput  = document.getElementById('loginPassword');
const emailError = document.getElementById('emailError');
const passError  = document.getElementById('passwordError');
const msgBox     = document.getElementById('loginMessage');
const loginBtn   = document.getElementById('loginBtn');
const togglePass = document.getElementById('togglePass');

// ── Mostrar/ocultar contraseña ───────────────
togglePass.addEventListener('click', () => {
  const isText = passInput.type === 'text';
  passInput.type = isText ? 'password' : 'text';
  togglePass.textContent = isText ? '👁' : '🙈';
});

// ── Limpiar errores cuando el usuario escribe ─
emailInput.addEventListener('input', () => { emailError.textContent = ''; setMessage(''); });
passInput.addEventListener('input',  () => { passError.textContent  = ''; setMessage(''); });

// ── Submit ───────────────────────────────────
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const email    = emailInput.value.trim();
  const password = passInput.value;

  // Validación básica en cliente
  let hasError = false;

  if (!email) {
    emailError.textContent = 'Ingresa tu correo.';
    hasError = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailError.textContent = 'El formato del correo no es válido.';
    hasError = true;
  }

  if (!password) {
    passError.textContent = 'Ingresa tu contraseña.';
    hasError = true;
  }

  if (hasError) return;

  // Estado de carga
  loginBtn.disabled = true;
  loginBtn.textContent = 'Verificando…';

  // Pequeño delay para simular proceso (UX)
  setTimeout(() => {
    const result = login(email, password);

    if (result.ok) {
      setMessage('¡Bienvenido! Redirigiendo…', 'success');
      setTimeout(() => {
        window.location.href = 'gestion-examenes.html';
      }, 800);
    } else {
      setMessage(result.error, 'error');
      loginBtn.disabled = false;
      loginBtn.textContent = 'Ingresar';
      passInput.value = '';
      passInput.focus();
    }
  }, 400);
});

function setMessage(text, type = '') {
  msgBox.textContent  = text;
  msgBox.className    = text ? `form-message ${type}` : 'form-message';
}
