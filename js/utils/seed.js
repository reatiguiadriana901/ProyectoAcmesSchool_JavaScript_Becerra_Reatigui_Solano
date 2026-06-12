import { getUsers, createUser } from './storage.js';

export function seedInitialData() {
  const users = getUsers();

  // Solo seed si no hay ningún usuario todavía
  if (users.length === 0) {
    createUser({
      idNumber: '0000000001',
      name:     'Administrador Acme',
      email:    'admin@acme.edu.co',
      phone:    '300 000 0000',
      role:     'administrativo',
      password: 'admin123',
    });

    console.log('%c[Seed] Usuario inicial creado: admin@acme.edu.co / admin123', 'color:#4F46E5');
  }
}

// Ejecutar al importar este módulo
seedInitialData();
