// ================================================
// js/pages/usuarios.js
// Controlador de la página de gestión de usuarios.
// Conecta la UI con el módulo usuarios.js
// ================================================

import { requireAuth } from '../modules/auth.js';
import {
  renderUsersTable,
  openCreateModal,
  openEditModal,
  closeModal,
  handleFormSubmit,
  confirmDeleteUser,
} from '../modules/usuarios.js';

// ── Proteger ruta: si no está autenticado, redirige ──
requireAuth();

// ── Exponer funciones al HTML (onclick en la t abla) ──
// Como usamos módulos ES6, las funciones no están en window por defecto,
// así que las asignamos manualmente para los botones generados dinámicamente.
window.editUser      = (id)         => openEditModal(id);
window.confirmDelete = (id, name)   => confirmDeleteUser(id, name);

// ── Renderizado inicial ──────────────────────
renderUsersTable();

// ── Botón "Nuevo usuario" ─────────────────────
document.getElementById('btnNuevoUsuario')
  .addEventListener('click', openCreateModal);

// ── Cerrar modal ─────────────────────────────
document.getElementById('modalClose')
  .addEventListener('click', closeModal);

document.getElementById('btnCancelar')
  .addEventListener('click', closeModal);

// Cerrar al hacer clic fuera del modal
document.getElementById('modalUsuario')
  .addEventListener('click', (e) => {
    if (e.target.id === 'modalUsuario') closeModal();
  });

// ── Submit del formulario ─────────────────────
document.getElementById('formUsuario')
  .addEventListener('submit', handleFormSubmit);

// ── Buscador ─────────────────────────────────
document.getElementById('searchUsuarios')
  .addEventListener('input', (e) => {
    renderUsersTable(e.target.value);
  });

// ── Mostrar/ocultar contraseña en modal ──────
document.getElementById('togglePassModal')
  .addEventListener('click', () => {
    const input = document.getElementById('userPassword');
    const btn   = document.getElementById('togglePassModal');
    const isText = input.type === 'text';
    input.type   = isText ? 'password' : 'text';
    btn.textContent = isText ? '👁' : '🙈';
  });

// ── Cerrar modal con tecla Escape ────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
