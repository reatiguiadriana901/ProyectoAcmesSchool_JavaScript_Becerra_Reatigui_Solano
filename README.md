
# 🎓 Acme School — Plataforma de Exámenes

Proyecto hecho con HTML, CSS y JavaScript puro (vanilla JS). Es una app web para gestionar y resolver exámenes en línea. La hicimos como proyecto del curso con mis compañeros Becerra, Reatigui y Solano.

---

## ¿Qué hace la app?

Básicamente tiene dos módulos principales:

**Módulo privado (admin):** solo pueden entrar usuarios con cuenta. Desde acá se pueden crear exámenes, gestionar usuarios y ver cómo queda el catálogo.

**Módulo público (estudiantes):** cualquier persona puede entrar sin login, ver los exámenes disponibles, registrarse con su nombre e identificación y presentar el examen.

---

## Páginas que tiene el proyecto

- `index.html` → pantalla de login para entrar al módulo privado
- `pages/catalogo.html` → catálogo público donde los estudiantes eligen su examen
- `pages/usuarios.html` → gestión de usuarios (crear, editar, eliminar)
- `pages/gestion-examenes.html` → crear y editar exámenes con preguntas y respuestas
- `pages/dashboard-privado.html` → vista previa del catálogo desde el panel admin
- `registro_examen/registro.html` → formulario donde el estudiante pone su nombre e identificación antes de presentar
- `examen/examen.html` → pantalla donde se responde el examen con temporizador

---

## Cómo se usa

### Para entrar al módulo admin:

1. Abre `index.html` en el navegador
2. Usa estas credenciales de prueba:
   - **Email:** `admin@acme.edu.co`
   - **Contraseña:** `admin123`

> Esas credenciales se crean automáticamente la primera vez que abres la app (con el seed de datos iniciales).

### Para presentar un examen (módulo público):

1. Ve a `pages/catalogo.html`
2. Elige un examen y haz clic en **Presentar**
3. Ingresa tu nombre e identificación
4. Responde las preguntas dentro del tiempo límite
5. Al terminar aparece un modal con tu resultado y si aprobaste o no

---

## Estructura del proyecto

```
ProyectoAcmesSchool/
│
├── index.html                    ← Login principal
├── assets/
│   └── 1988007.png               ← Logo de la app
│
├── css/
│   ├── main.css                  ← Estilos globales y navbar
│   ├── login.css                 ← Estilos de la pantalla de login
│   ├── dashboard.css             ← Estilos del panel privado
│   ├── catalogo.css              ← Estilos del catálogo de exámenes
│   ├── gestion-examenes.css      ← Estilos del formulario de exámenes
│   ├── examen.css                ← Estilos de la pantalla del examen
│   └── registro.css              ← Estilos del registro de estudiante
│
├── js/
│   ├── modules/
│   │   ├── auth.js               ← Login, logout y protección de rutas
│   │   └── usuarios.js           ← CRUD de usuarios (tabla, modal, validaciones)
│   ├── pages/
│   │   ├── login.js              ← Lógica del formulario de login
│   │   ├── registro.js           ← Registro del estudiante antes del examen
│   │   ├── catalogo.js           ← Renderizado de tarjetas de exámenes
│   │   ├── examen.js             ← Temporizador, respuestas y resultado
│   │   ├── gestion-examenes.js   ← Crear/editar exámenes con preguntas dinámicas
│   │   └── usuarios.js           ← Inicializa eventos en la página de usuarios
│   └── utils/
│       ├── storage.js            ← Todas las funciones de localStorage (CRUD)
│       └── seed.js               ← Crea el usuario admin inicial si no existe
│
├── pages/
│   ├── catalogo.html
│   ├── dashboard-privado.html
│   ├── gestion-examenes.html
│   ├── usuarios.html
│   ├── examen.html
│   └── registro.html
│
├── examen/
│   ├── examen.html
│   ├── examen.css
│   └── examen.js
│
└── registro_examen/
    ├── registro.html
    ├── registro.css
    └── registro.js
```

---

## Tecnologías usadas

- **HTML5** — estructura de todas las páginas
- **CSS3** — estilos propios sin frameworks (sí, sin Bootstrap ni nada de eso jaja)
- **JavaScript (ES6+)** — toda la lógica, con módulos (`import`/`export`)
- **localStorage** — para guardar usuarios, exámenes y la sesión activa
- **Google Fonts (Inter)** — tipografía

No usamos ningún backend ni base de datos. Todo vive en el navegador con `localStorage`.

---

## Funcionalidades principales

### Autenticación
- Login con email y contraseña
- Sesión guardada en `localStorage` (solo datos no sensibles)
- Protección de rutas: si no estás logueado y tratas de entrar a una página privada, te manda al login automáticamente
- Logout que limpia la sesión y redirige

### Gestión de usuarios (CRUD)
- Ver lista de usuarios en tabla
- Buscar usuarios por nombre o email
- Crear usuario con: número de identificación, nombre, email, teléfono, cargo y contraseña
- Editar usuario existente (la contraseña solo se actualiza si escribes una nueva)
- Eliminar usuario con confirmación
- Validaciones de formulario: email único, contraseña mínimo 6 caracteres, nombre mínimo 3 caracteres

### Gestión de exámenes (CRUD)
- Crear examen con: código, título, tiempo en minutos, porcentaje mínimo para aprobar, descripción y preguntas
- Agregar preguntas dinámicamente, cada una con sus opciones de respuesta
- Marcar cuál respuesta es la correcta con un radio button
- Editar examen existente (carga todos los datos en el formulario)
- Eliminar examen con confirmación
- Validaciones: mínimo 1 pregunta, mínimo 2 opciones por pregunta, siempre marcar una respuesta correcta, código único

### Módulo público (estudiantes)
- Ver catálogo de exámenes disponibles en tarjetas
- Cada tarjeta muestra: código, título, descripción, tiempo, porcentaje para aprobar y número de preguntas
- Registrarse con nombre e identificación antes de iniciar
- Temporizador regresivo durante el examen
- Al acabar el tiempo, el examen termina automáticamente
- Modal de resultados con porcentaje obtenido y si aprobaste o no

---

## Datos que guarda en localStorage

| Clave | Qué guarda |
|---|---|
| `acme_users` | Array de usuarios registrados |
| `acme_session` | Datos del usuario logueado (sin contraseña) |
| `acme_exams` | Array de exámenes creados |
| `examenSeleccionado` | El examen que el estudiante eligió presentar |
| `acme_estudiante` | Nombre e identificación del estudiante |

---

## Cómo correrlo

No necesita instalación ni servidor. Solo abre el `index.html` directamente en el navegador. Eso es todo.

Si quieres usar Live Server en VS Code también funciona perfecto.

---

## Autores

Proyecto desarrollado por:

- Santiago Becerra
- Adriana Reatigui  
- Cristian Solano

Como proyecto final del módulo de JavaScript.

---

> **Nota:** Las contraseñas se guardan en texto plano porque es un proyecto académico. En un proyecto real habría que hashearlas con algo como bcrypt. Está mencionado en los comentarios del código también.
