// ── Auth guard ────────────────────────────────
const session = JSON.parse(localStorage.getItem('acme_session'));
if (!session) {
    window.location.href = '../index.html';
}

document.getElementById('navUserName').textContent = session ? session.name : '—';

document.getElementById('btnSalir').addEventListener('click', () => {
    localStorage.removeItem('acme_session');
    window.location.href = '../index.html';
});

// ── Storage ───────────────────────────────────
const STORAGE_KEY = 'acme_exams';

function getExams() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveExams(exams) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ── DOM refs ──────────────────────────────────
const btnAgregarPregunta = document.getElementById('btnAgregarPregunta');
const examenPregunta     = document.getElementById('examenPregunta');
const tbody              = document.querySelector('.examenes-registrados tbody');

let contadorPreguntas = 0;
let editandoId        = null;

// ── Bloques de pregunta / respuesta ──────────
function agregarPregunta() {
    contadorPreguntas++;
    const numeroVisible = examenPregunta.querySelectorAll('.bloque-pregunta').length + 1;
    examenPregunta.appendChild(crearPregunta(numeroVisible, contadorPreguntas));
}

function crearPregunta(numero, uid) {
    const pregunta = document.createElement('section');
    pregunta.classList.add('bloque-pregunta');
    pregunta.innerHTML = `
        <h3>Pregunta <strong>${numero}</strong></h3>
        <div>
            <input type="text" placeholder="Escribe la pregunta">
            <button class="btn-eliminar-pregunta">Eliminar</button>
        </div>
        <label class="opcion-respuesta">
            <input type="radio" name="respuesta-${uid}">
            <input type="text" placeholder="Descripcion de la respuesta">
            <button class="btn-quitar-respuesta">Quitar</button>
        </label>
        <label class="opcion-respuesta">
            <input type="radio" name="respuesta-${uid}">
            <input type="text" placeholder="Descripcion de la respuesta">
            <button class="btn-quitar-respuesta">Quitar</button>
        </label>
        <button class="agrRespuesta">Agregar Respuesta</button>
    `;
    return pregunta;
}

function renumerarPreguntas() {
    examenPregunta.querySelectorAll('.bloque-pregunta').forEach((bloque, i) => {
        bloque.querySelector('h3 strong').textContent = i + 1;
    });
}

// ── Tabla ─────────────────────────────────────
function renderizarTabla() {
    const exams = getExams();
    tbody.innerHTML = '';

    if (exams.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="tabla-vacia">No hay exámenes registrados todavía.</td>
            </tr>`;
    } else {
        exams.forEach(exam => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${exam.codigo}</td>
                <td>${exam.titulo}</td>
                <td>${exam.tiempo}</td>
                <td>${exam.porcentaje}%</td>
                <td>${exam.preguntas.length}</td>
                <td>
                    <div class="accionesBotones">
                        <button class="btn-editar" data-id="${exam.id}">Editar</button>
                        <button class="btn-borrar"  data-id="${exam.id}">Borrar</button>
                    </div>
                </td>`;
            tbody.appendChild(tr);
        });
    }

    document.querySelector('.cantidadRegistros').innerHTML =
        `<strong>${exams.length}-</strong> Registros`;
}

// ── Limpiar formulario ────────────────────────
function limpiarFormulario() {
    ['codigo', 'titulo', 'tiempo', 'aprobacion', 'descripcion'].forEach(id => {
        document.getElementById(id).value = '';
    });
    examenPregunta.innerHTML = '';
    contadorPreguntas = 0;
    editandoId = null;
    document.querySelector('.formularios h3').textContent = 'Crear examen';
    document.getElementById('agregar').textContent = 'Crear Examen';
}

// ── Guardar (crear o actualizar) ──────────────
function guardarExamen() {
    const codigo      = document.getElementById('codigo').value.trim().toUpperCase();
    const titulo      = document.getElementById('titulo').value.trim();
    const tiempo      = Number(document.getElementById('tiempo').value);
    const porcentaje  = Number(document.getElementById('aprobacion').value);
    const descripcion = document.getElementById('descripcion').value.trim();

    if (!codigo || !titulo || !tiempo || !porcentaje || !descripcion) {
        alert('Por favor completa todos los campos del examen.');
        return;
    }
    if (tiempo < 1 || porcentaje < 1 || porcentaje > 100) {
        alert('El tiempo debe ser mínimo 1 minuto y el porcentaje entre 1 y 100.');
        return;
    }

    const bloques = examenPregunta.querySelectorAll('.bloque-pregunta');
    if (bloques.length === 0) {
        alert('Agrega al menos una pregunta al examen.');
        return;
    }

    const preguntas = [];
    for (let i = 0; i < bloques.length; i++) {
        const bloque    = bloques[i];
        const textoPreg = bloque.querySelector('div input[type="text"]').value.trim();

        if (!textoPreg) {
            alert(`La pregunta ${i + 1} no tiene texto.`);
            return;
        }

        const respuestas    = [];
        let   tieneCorrecta = false;

        bloque.querySelectorAll('.opcion-respuesta').forEach(fila => {
            const texto     = fila.querySelector('input[type="text"]').value.trim();
            const esCorrecta = fila.querySelector('input[type="radio"]').checked;
            if (texto) {
                respuestas.push({ texto, esCorrecta });
                if (esCorrecta) tieneCorrecta = true;
            }
        });

        if (respuestas.length < 2) {
            alert(`La pregunta ${i + 1} necesita al menos 2 respuestas con texto.`);
            return;
        }
        if (!tieneCorrecta) {
            alert(`La pregunta ${i + 1} no tiene ninguna respuesta marcada como correcta.`);
            return;
        }

        preguntas.push({ texto: textoPreg, respuestas });
    }

    const exams = getExams();

    if (editandoId) {
        const idx = exams.findIndex(e => e.id === editandoId);
        if (idx !== -1) {
            exams[idx] = {
                ...exams[idx],
                codigo, titulo, tiempo, porcentaje, descripcion, preguntas,
                updatedAt: new Date().toISOString()
            };
        }
    } else {
        if (exams.some(e => e.codigo === codigo)) {
            alert(`Ya existe un examen con el código "${codigo}".`);
            return;
        }
        exams.push({
            id: generateId(),
            codigo, titulo, tiempo, porcentaje, descripcion, preguntas,
            createdAt: new Date().toISOString()
        });
    }

    saveExams(exams);
    renderizarTabla();
    limpiarFormulario();
}

// ── Editar ────────────────────────────────────
function cargarExamenEnFormulario(id) {
    const exam = getExams().find(e => e.id === id);
    if (!exam) return;

    editandoId = id;
    document.getElementById('codigo').value      = exam.codigo;
    document.getElementById('titulo').value      = exam.titulo;
    document.getElementById('tiempo').value      = exam.tiempo;
    document.getElementById('aprobacion').value  = exam.porcentaje;
    document.getElementById('descripcion').value = exam.descripcion;

    examenPregunta.innerHTML = '';
    contadorPreguntas = 0;

    exam.preguntas.forEach((pregData, i) => {
        contadorPreguntas++;
        const bloque = crearPregunta(i + 1, contadorPreguntas);

        bloque.querySelector('div input[type="text"]').value = pregData.texto;
        bloque.querySelectorAll('.opcion-respuesta').forEach(el => el.remove());

        const btnAgrResp = bloque.querySelector('.agrRespuesta');
        pregData.respuestas.forEach(resp => {
            const label = document.createElement('label');
            label.classList.add('opcion-respuesta');
            label.innerHTML = `
                <input type="radio" name="respuesta-${contadorPreguntas}">
                <input type="text" placeholder="Descripcion de la respuesta">
                <button class="btn-quitar-respuesta">Quitar</button>
            `;
            label.querySelector('input[type="text"]').value = resp.texto;
            if (resp.esCorrecta) label.querySelector('input[type="radio"]').checked = true;
            bloque.insertBefore(label, btnAgrResp);
        });

        examenPregunta.appendChild(bloque);
    });

    document.querySelector('.formularios h3').textContent = 'Editar examen';
    document.getElementById('agregar').textContent = 'Actualizar Examen';
    document.querySelector('.formularios').scrollIntoView({ behavior: 'smooth' });
}

// ── Borrar ────────────────────────────────────
function borrarExamen(id) {
    if (!confirm('¿Seguro que deseas eliminar este examen? Esta acción no se puede deshacer.')) return;
    saveExams(getExams().filter(e => e.id !== id));
    if (editandoId === id) limpiarFormulario();
    renderizarTabla();
}

// ── Event listeners ───────────────────────────
btnAgregarPregunta.addEventListener('click', agregarPregunta);
document.getElementById('agregar').addEventListener('click', guardarExamen);
document.getElementById('limpiar').addEventListener('click', limpiarFormulario);

tbody.addEventListener('click', function(event) {
    const id = event.target.dataset.id;
    if (!id) return;
    if (event.target.classList.contains('btn-editar')) cargarExamenEnFormulario(id);
    if (event.target.classList.contains('btn-borrar')) borrarExamen(id);
});

examenPregunta.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn-eliminar-pregunta')) {
        event.target.closest('.bloque-pregunta').remove();
        renumerarPreguntas();
    }

    if (event.target.classList.contains('btn-quitar-respuesta')) {
        event.target.closest('.opcion-respuesta').remove();
    }

    if (event.target.classList.contains('agrRespuesta')) {
        const bloquePreg  = event.target.closest('.bloque-pregunta');
        const nombreGrupo = bloquePreg.querySelector('input[type="radio"]').name;
        const nuevaRespuesta = document.createElement('label');
        nuevaRespuesta.classList.add('opcion-respuesta');
        nuevaRespuesta.innerHTML = `
            <input type="radio" name="${nombreGrupo}">
            <input type="text" placeholder="Descripcion de la respuesta">
            <button class="btn-quitar-respuesta">Quitar</button>
        `;
        bloquePreg.insertBefore(nuevaRespuesta, event.target);
    }
});

// ── Init ──────────────────────────────────────
renderizarTabla();
