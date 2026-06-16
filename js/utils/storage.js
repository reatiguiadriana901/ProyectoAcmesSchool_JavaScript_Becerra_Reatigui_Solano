const KEYS = {
  USERS:   'acme_users',
  SESSION: 'acme_session',
  EXAMS:   'acme_exams',     // lo usarán los otros devs
  RESULTS: 'acme_results',   // lo usarán los otros devs
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

// Exportar KEYS por si otros módulos necesitan acceder a exams / results
export { KEYS };
