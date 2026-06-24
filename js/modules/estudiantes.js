import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../utils/storage.js';

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => { toast.className = 'toast'; }, 3000);
}

export function renderStudentsTable(filter = '') {
  const tbody = document.getElementById('tbodyEstudiantes');
  const empty = document.getElementById('emptyEstudiantes');
  if (!tbody) return;

  let students = getStudents();

  if (filter.trim()) {
    const q = filter.toLowerCase();
    students = students.filter(s =>
      s.nombre.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.identificacion.includes(q)
    );
  }

  if (students.length === 0) {
    tbody.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }

  if (empty) empty.style.display = 'none';

  tbody.innerHTML = students.map(s => `
    <tr>
      <td>${escapeHtml(s.identificacion)}</td>
      <td>${escapeHtml(s.nombre)}</td>
      <td>${escapeHtml(s.email)}</td>
      <td>${escapeHtml(s.genero ? capitalize(s.genero) : '—')}</td>
      <td>${escapeHtml(s.fechaNacimiento ? formatDate(s.fechaNacimiento) : '—')}</td>
      <td>
        <div class="action-btns">
          <button class="btn btn-outline btn-sm" onclick="editStudent('${s.id}')">Editar</button>
          <button class="btn btn-danger btn-sm"  onclick="confirmDeleteStudent('${s.id}', '${escapeHtml(s.nombre)}')">Eliminar</button>
        </div>
      </td>
    </tr>
  `).join('');
}

export function openCreateModal() {
  document.getElementById('studentId').value          = '';
  document.getElementById('modalTitle').textContent   = 'Nuevo estudiante';
  document.getElementById('btnGuardar').textContent   = 'Guardar estudiante';
  document.getElementById('formEstudiante').reset();
  clearFieldErrors();
  document.getElementById('modalEstudiante').style.display = 'flex';
}

export function openEditModal(id) {
  const students = getStudents();
  const student  = students.find(s => s.id === id);
  if (!student) return;

  document.getElementById('studentId').value               = student.id;
  document.getElementById('modalTitle').textContent        = 'Editar estudiante';
  document.getElementById('btnGuardar').textContent        = 'Actualizar estudiante';
  document.getElementById('studentIdNum').value            = student.identificacion;
  document.getElementById('studentName').value             = student.nombre;
  document.getElementById('studentEmail').value            = student.email;
  document.getElementById('studentGenero').value           = student.genero ?? '';
  document.getElementById('studentFechaNacimiento').value  = student.fechaNacimiento ?? '';

  clearFieldErrors();
  document.getElementById('modalEstudiante').style.display = 'flex';
}

export function closeModal() {
  document.getElementById('modalEstudiante').style.display = 'none';
}

export function handleFormSubmit(e) {
  e.preventDefault();

  const id              = document.getElementById('studentId').value;
  const identificacion  = document.getElementById('studentIdNum').value.trim();
  const nombre          = document.getElementById('studentName').value.trim();
  const email           = document.getElementById('studentEmail').value.trim();
  const genero          = document.getElementById('studentGenero').value;
  const fechaNacimiento = document.getElementById('studentFechaNacimiento').value;

  let hasError = false;

  if (!identificacion) { setFieldError('errIdNum', 'Ingresa el número de identificación.'); hasError = true; }
  else clearFieldError('errIdNum');

  if (!nombre || nombre.length < 3) { setFieldError('errName', 'El nombre debe tener al menos 3 caracteres.'); hasError = true; }
  else clearFieldError('errName');

  if (!email || !isValidEmail(email)) { setFieldError('errEmail', 'Ingresa un email válido.'); hasError = true; }
  else clearFieldError('errEmail');

  if (!fechaNacimiento) { setFieldError('errFecha', 'Ingresa la fecha de nacimiento.'); hasError = true; }
  else clearFieldError('errFecha');

  if (hasError) return;

  let result;

  if (!id) {
    result = createStudent({ identificacion, nombre, email, genero, fechaNacimiento });
  } else {
    result = updateStudent(id, { identificacion, nombre, email, genero, fechaNacimiento });
  }

  if (!result.ok) {
    setFieldError('errIdNum', result.error);
    return;
  }

  closeModal();
  renderStudentsTable();
  showToast(id ? 'Estudiante actualizado correctamente.' : 'Estudiante registrado correctamente.');
}

export function confirmDeleteStudent(id, name) {
  if (!confirm(`¿Seguro que deseas eliminar a "${name}"? Esta acción no se puede deshacer.`)) return;

  const result = deleteStudent(id);
  if (result.ok) {
    renderStudentsTable();
    showToast('Estudiante eliminado.', 'warning');
  } else {
    showToast(result.error, 'error');
  }
}

function setFieldError(fieldId, message) {
  const el = document.getElementById(fieldId);
  if (el) el.textContent = message;
}

function clearFieldError(fieldId) {
  const el = document.getElementById(fieldId);
  if (el) el.textContent = '';
}

function clearFieldErrors() {
  ['errIdNum', 'errName', 'errEmail', 'errFecha'].forEach(clearFieldError);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
