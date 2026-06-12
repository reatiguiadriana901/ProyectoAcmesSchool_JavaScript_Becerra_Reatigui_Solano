// ================================================
// js/modules/usuarios.js
// Toda la lógica de negocio de gestión de usuarios:
// renderizar tabla, abrir modal, guardar, eliminar.
// ================================================

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../utils/storage.js';

// ── Utilidad: mostrar toast ───────────────────
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => { toast.className = 'toast'; }, 3000);
}

// ── Renderizar tabla ─────────────────────────
export function renderUsersTable(filter = '') {
  const tbody = document.getElementById('tbodyUsuarios');
  const empty = document.getElementById('emptyUsuarios');
  if (!tbody) return;

  let users = getUsers();

  // Filtro de búsqueda
  if (filter.trim()) {
    const q = filter.toLowerCase();
    users = users.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  }

  if (users.length === 0) {
    tbody.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }

  if (empty) empty.style.display = 'none';

  tbody.innerHTML = users.map(u => `
    <tr>
      <td>${escapeHtml(u.idNumber)}</td>
      <td>${escapeHtml(u.name)}</td>
      <td>${escapeHtml(u.email)}</td>
      <td>${escapeHtml(u.phone || '—')}</td>
      <td><span class="badge badge-${u.role}">${capitalize(u.role)}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn btn-outline btn-sm" onclick="editUser('${u.id}')">Editar</button>
          <button class="btn btn-danger btn-sm"  onclick="confirmDelete('${u.id}', '${escapeHtml(u.name)}')">Eliminar</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ── Abrir modal en modo "crear" ──────────────
export function openCreateModal() {
  document.getElementById('userId').value       = '';
  document.getElementById('modalTitle').textContent = 'Nuevo usuario';
  document.getElementById('btnGuardar').textContent  = 'Guardar usuario';
  document.getElementById('formUsuario').reset();
  clearFieldErrors();

  // La contraseña es obligatoria al crear
  document.getElementById('userPassword').required = true;

  document.getElementById('modalUsuario').style.display = 'flex';
}

// ── Abrir modal en modo "editar" ─────────────
export function openEditModal(id) {
  const users = getUsers();
  const user = users.find(u => u.id === id);
  if (!user) return;

  document.getElementById('userId').value         = user.id;
  document.getElementById('modalTitle').textContent   = 'Editar usuario';
  document.getElementById('btnGuardar').textContent    = 'Actualizar usuario';
  document.getElementById('userIdNum').value       = user.idNumber;
  document.getElementById('userName').value        = user.name;
  document.getElementById('userEmail').value       = user.email;
  document.getElementById('userPhone').value       = user.phone ?? '';
  document.getElementById('userCargo').value       = user.role;
  document.getElementById('userPassword').value   = '';  // no mostrar la contraseña actual
  document.getElementById('userPassword').required = false; // no obligatorio al editar

  clearFieldErrors();
  document.getElementById('modalUsuario').style.display = 'flex';
}

// ── Cerrar modal ─────────────────────────────
export function closeModal() {
  document.getElementById('modalUsuario').style.display = 'none';
}

// ── Guardar (crear o editar) ─────────────────
export function handleFormSubmit(e) {
  e.preventDefault();

  const id       = document.getElementById('userId').value;
  const idNumber = document.getElementById('userIdNum').value.trim();
  const name     = document.getElementById('userName').value.trim();
  const email    = document.getElementById('userEmail').value.trim();
  const phone    = document.getElementById('userPhone').value.trim();
  const role     = document.getElementById('userCargo').value;
  const password = document.getElementById('userPassword').value;

  // Validación manual sencilla
  let hasError = false;

  if (!idNumber) { setFieldError('errIdNum', 'Ingresa un número de identificación.'); hasError = true; }
  else clearFieldError('errIdNum');

  if (!name || name.length < 3) { setFieldError('errName', 'El nombre debe tener al menos 3 caracteres.'); hasError = true; }
  else clearFieldError('errName');

  if (!email || !isValidEmail(email)) { setFieldError('errEmail', 'Ingresa un email válido.'); hasError = true; }
  else clearFieldError('errEmail');

  if (!role) { setFieldError('errCargo', 'Selecciona un cargo.'); hasError = true; }
  else clearFieldError('errCargo');

  // Contraseña: obligatoria solo al crear
  if (!id && (!password || password.length < 6)) {
    setFieldError('errPassword', 'La contraseña debe tener al menos 6 caracteres.'); hasError = true;
  } else if (password && password.length < 6) {
    setFieldError('errPassword', 'Si cambias la contraseña, debe tener al menos 6 caracteres.'); hasError = true;
  } else {
    clearFieldError('errPassword');
  }

  if (hasError) return;

  let result;

  if (!id) {
    // Crear nuevo usuario
    result = createUser({ idNumber, name, email, phone, role, password });
  } else {
    // Actualizar usuario existente
    const changes = { idNumber, name, email, phone, role };
    if (password) changes.password = password; // solo actualiza si escribió algo
    result = updateUser(id, changes);
  }

  if (!result.ok) {
    setFieldError('errEmail', result.error);
    return;
  }

  closeModal();
  renderUsersTable();
  showToast(id ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.');
}

// ── Confirmar y eliminar ─────────────────────
export function confirmDeleteUser(id, name) {
  // Confirm simple — en un proyecto más grande usarías un modal de confirmación
  if (!confirm(`¿Seguro que deseas eliminar a "${name}"? Esta acción no se puede deshacer.`)) return;

  const result = deleteUser(id);
  if (result.ok) {
    renderUsersTable();
    showToast('Usuario eliminado.', 'warning');
  } else {
    showToast(result.error, 'error');
  }
}

// ── Helpers privados ─────────────────────────
function setFieldError(fieldId, message) {
  const el = document.getElementById(fieldId);
  if (el) el.textContent = message;
}

function clearFieldError(fieldId) {
  const el = document.getElementById(fieldId);
  if (el) el.textContent = '';
}

function clearFieldErrors() {
  ['errIdNum', 'errName', 'errEmail', 'errCargo', 'errPassword'].forEach(clearFieldError);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
