const KEYS = {
  USERS:      'acme_users',
  SESSION:    'acme_session',
  EXAMS:      'acme_exams',
  RESULTS:    'acme_results',
  STUDENTS:   'acme_estudiantes',
};

// ── Generar ID único simple ──
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ── Guardar cualquier colección ──
export function saveCollection(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ── Leer cualquier colección (devuelve [] si no existe) ──
export function getCollection(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? [];
  } catch {
    return [];
  }
}

// ── USUARIOS ──────────────────────────────────

export function getUsers() {
  return getCollection(KEYS.USERS);
}

export function saveUsers(users) {
  saveCollection(KEYS.USERS, users);
}

export function getUserById(id) {
  return getUsers().find(u => u.id === id) ?? null;
}

export function getUserByEmail(email) {
  return getUsers().find(u => u.email === email.toLowerCase()) ?? null;
}

export function createUser(userData) {
  const users = getUsers();

  // Evitar emails duplicados
  if (users.some(u => u.email === userData.email.toLowerCase())) {
    return { ok: false, error: 'Ya existe un usuario con ese email.' };
  }

  const newUser = {
    id:        generateId(),
    idNumber:  userData.idNumber,
    name:      userData.name.trim(),
    email:     userData.email.toLowerCase().trim(),
    phone:     userData.phone?.trim() ?? '',
    role:      userData.role,        // 'administrativo' | 'docente'
    password:  userData.password,    // En producción real iría hasheada
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);
  return { ok: true, user: newUser };
}

export function updateUser(id, changes) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === id);

  if (idx === -1) return { ok: false, error: 'Usuario no encontrado.' };

  // Si cambió el email, verificar que no esté en uso por otro
  if (changes.email) {
    const emailLower = changes.email.toLowerCase().trim();
    const duplicate = users.find(u => u.email === emailLower && u.id !== id);
    if (duplicate) return { ok: false, error: 'Ese email ya está en uso.' };
    changes.email = emailLower;
  }

  users[idx] = { ...users[idx], ...changes, updatedAt: new Date().toISOString() };
  saveUsers(users);
  return { ok: true, user: users[idx] };
}

export function deleteUser(id) {
  const users = getUsers();
  const filtered = users.filter(u => u.id !== id);
  if (filtered.length === users.length) return { ok: false, error: 'Usuario no encontrado.' };
  saveUsers(filtered);
  return { ok: true };
}

// ── SESIÓN ────────────────────────────────────

export function setSession(user) {
  // Guardamos solo los datos no sensibles
  const sessionData = {
    id:    user.id,
    name:  user.name,
    email: user.email,
    role:  user.role,
  };
  localStorage.setItem(KEYS.SESSION, JSON.stringify(sessionData));
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.SESSION)) ?? null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(KEYS.SESSION);
}

export function isLoggedIn() {
  return getSession() !== null;
}

// ── EXÁMENES ──────────────────────────────────

export function getExams() {
  return getCollection(KEYS.EXAMS);
}

export function saveExams(exams) {
  saveCollection(KEYS.EXAMS, exams);
}

export function createExam(examData) {
  const exams = getExams();
  if (exams.some(e => e.id === examData.id || e.codigo === examData.codigo)) {
    return { ok: false, error: 'Ya existe un examen con ese id o código.' };
  }
  const newExam = { ...examData, createdAt: examData.createdAt ?? new Date().toISOString() };
  exams.push(newExam);
  saveExams(exams);
  return { ok: true, exam: newExam };
}

// ── ESTUDIANTES ───────────────────────────────

export function getStudents() {
  return getCollection(KEYS.STUDENTS);
}

export function saveStudents(students) {
  saveCollection(KEYS.STUDENTS, students);
}

export function getStudentByIdNumber(identificacion) {
  return getStudents().find(s => s.identificacion === String(identificacion)) ?? null;
}

export function createStudent(data) {
  const students = getStudents();

  if (students.some(s => s.identificacion === String(data.identificacion))) {
    return { ok: false, error: 'Ya existe un estudiante con esa identificación.' };
  }
  if (students.some(s => s.email === data.email.toLowerCase())) {
    return { ok: false, error: 'Ya existe un estudiante con ese email.' };
  }

  const newStudent = {
    id:              generateId(),
    identificacion:  String(data.identificacion).trim(),
    nombre:          data.nombre.trim(),
    email:           data.email.toLowerCase().trim(),
    genero:          data.genero ?? '',
    fechaNacimiento: data.fechaNacimiento ?? '',
    createdAt:       new Date().toISOString(),
  };

  students.push(newStudent);
  saveStudents(students);
  return { ok: true, student: newStudent };
}

export function updateStudent(id, changes) {
  const students = getStudents();
  const idx = students.findIndex(s => s.id === id);
  if (idx === -1) return { ok: false, error: 'Estudiante no encontrado.' };

  if (changes.identificacion) {
    const dup = students.find(s => s.identificacion === String(changes.identificacion) && s.id !== id);
    if (dup) return { ok: false, error: 'Esa identificación ya pertenece a otro estudiante.' };
    changes.identificacion = String(changes.identificacion).trim();
  }
  if (changes.email) {
    const emailLower = changes.email.toLowerCase().trim();
    const dup = students.find(s => s.email === emailLower && s.id !== id);
    if (dup) return { ok: false, error: 'Ese email ya está en uso.' };
    changes.email = emailLower;
  }

  students[idx] = { ...students[idx], ...changes, updatedAt: new Date().toISOString() };
  saveStudents(students);
  return { ok: true, student: students[idx] };
}

export function deleteStudent(id) {
  const students = getStudents();
  const filtered = students.filter(s => s.id !== id);
  if (filtered.length === students.length) return { ok: false, error: 'Estudiante no encontrado.' };
  saveStudents(filtered);
  return { ok: true };
}

// Exportar KEYS por si otros módulos necesitan acceder a exams / results
export { KEYS };
