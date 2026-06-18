import { getUsers, createUser, getExams, createExam } from './storage.js';

const SEED_EXAMS = [
  {
    id: 'exam-js-001',
    codigo: 'JS-001',
    titulo: 'Fundamentos de JavaScript',
    tiempo: 20,
    porcentaje: 70,
    descripcion: 'Evalúa tus conocimientos básicos sobre JavaScript: variables, tipos de datos, operadores, funciones y estructuras de control.',
    preguntas: [
      {
        texto: '¿Cuál es la palabra reservada para declarar una variable que no puede ser reasignada?',
        respuestas: [
          { texto: 'var',    esCorrecta: false },
          { texto: 'let',    esCorrecta: false },
          { texto: 'const',  esCorrecta: true  },
          { texto: 'static', esCorrecta: false },
        ],
      },
      {
        texto: '¿Cuál de los siguientes es un tipo de dato primitivo en JavaScript?',
        respuestas: [
          { texto: 'Array',    esCorrecta: false },
          { texto: 'Object',   esCorrecta: false },
          { texto: 'Function', esCorrecta: false },
          { texto: 'Boolean',  esCorrecta: true  },
        ],
      },
      {
        texto: '¿Qué valor retorna typeof null en JavaScript?',
        respuestas: [
          { texto: '"null"',      esCorrecta: false },
          { texto: '"object"',    esCorrecta: true  },
          { texto: '"undefined"', esCorrecta: false },
          { texto: '"boolean"',   esCorrecta: false },
        ],
      },
      {
        texto: '¿Cuál es la diferencia entre == y === en JavaScript?',
        respuestas: [
          { texto: 'No hay diferencia, ambos comparan valor y tipo',  esCorrecta: false },
          { texto: '== compara solo valor; === compara valor y tipo', esCorrecta: true  },
          { texto: '=== compara solo valor; == compara valor y tipo', esCorrecta: false },
          { texto: '== es más estricto que ===',                      esCorrecta: false },
        ],
      },
      {
        texto: '¿Qué método de arreglo agrega un elemento al final?',
        respuestas: [
          { texto: 'unshift()', esCorrecta: false },
          { texto: 'pop()',     esCorrecta: false },
          { texto: 'push()',    esCorrecta: true  },
          { texto: 'shift()',   esCorrecta: false },
        ],
      },
    ],
    createdAt: '2026-06-18T00:00:00.000Z',
  },
  {
    id: 'exam-py-001',
    codigo: 'PY-001',
    titulo: 'Fundamentos de Python',
    tiempo: 20,
    porcentaje: 70,
    descripcion: 'Evalúa tus conocimientos básicos sobre Python: sintaxis, tipos de datos, funciones, listas y estructuras de control.',
    preguntas: [
      {
        texto: '¿Cómo se define una función en Python?',
        respuestas: [
          { texto: 'function nombre():', esCorrecta: false },
          { texto: 'def nombre():',      esCorrecta: true  },
          { texto: 'func nombre():',     esCorrecta: false },
          { texto: 'define nombre():',   esCorrecta: false },
        ],
      },
      {
        texto: '¿Cuál es el operador de exponenciación en Python?',
        respuestas: [
          { texto: '^',      esCorrecta: false },
          { texto: 'exp()',  esCorrecta: false },
          { texto: '**',     esCorrecta: true  },
          { texto: '^^',     esCorrecta: false },
        ],
      },
      {
        texto: '¿Qué estructura de Python permite almacenar pares clave-valor?',
        respuestas: [
          { texto: 'Lista',          esCorrecta: false },
          { texto: 'Tupla',          esCorrecta: false },
          { texto: 'Conjunto (set)', esCorrecta: false },
          { texto: 'Diccionario',    esCorrecta: true  },
        ],
      },
      {
        texto: '¿Cuál de las siguientes es una característica de las tuplas en Python?',
        respuestas: [
          { texto: 'Son mutables',                esCorrecta: false },
          { texto: 'Se definen con corchetes []',  esCorrecta: false },
          { texto: 'Son inmutables',               esCorrecta: true  },
          { texto: 'No pueden contener strings',   esCorrecta: false },
        ],
      },
      {
        texto: '¿Qué función se usa para obtener la longitud de una lista en Python?',
        respuestas: [
          { texto: 'size()',   esCorrecta: false },
          { texto: 'length()', esCorrecta: false },
          { texto: 'count()',  esCorrecta: false },
          { texto: 'len()',    esCorrecta: true  },
        ],
      },
    ],
    createdAt: '2026-06-18T00:00:00.000Z',
  },
];

export function seedInitialData() {
  // Seed usuario administrador
  if (getUsers().length === 0) {
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

  // Seed exámenes iniciales
  const existingIds = getExams().map(e => e.id);
  SEED_EXAMS.forEach(exam => {
    if (!existingIds.includes(exam.id)) {
      createExam(exam);
      console.log(`%c[Seed] Examen creado: ${exam.codigo} — ${exam.titulo}`, 'color:#059669');
    }
  });
}

// Ejecutar al importar este módulo
seedInitialData();
