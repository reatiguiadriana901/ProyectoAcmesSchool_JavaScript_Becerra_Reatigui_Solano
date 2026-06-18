const examenSeleccionado = JSON.parse(localStorage.getItem('examenSeleccionado'))

document.querySelector('.record_code').textContent    = examenSeleccionado.codigo;
document.querySelector('.record_title').textContent   = examenSeleccionado.titulo;
document.querySelector('.total_preguntas').textContent = examenSeleccionado.preguntas.length + ' preguntas';
document.querySelector('.approbation').textContent    = examenSeleccionado.porcentaje + '%';

// ── Renderizar preguntas ──────────────────────────
examenSeleccionado.preguntas.forEach((pregunta, index) => {
    const bloque = document.createElement('div')
    bloque.innerHTML = `
        <div class="pregunta" data-pregunta="${index}">
            <p class="pregunta_texto">${index + 1}. ${pregunta.texto}</p>
            <div class="respuestas">
                ${pregunta.respuestas.map((r, i) => `
                    <label>
                        <input type="radio" name="pregunta_${index}" value="${i}">
                        <span>${r.texto}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `
    document.querySelector('.lista_preguntas').appendChild(bloque)
})

// ── Temporizador ──────────────────────────────────
const displayTimer = document.getElementById('timer')
let tiempo = examenSeleccionado.tiempo * 60

const intervalo = setInterval(() => {
    tiempo--
    const minutos  = Math.floor(tiempo / 60)
    const segundos = tiempo % 60
    displayTimer.textContent = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
    if (tiempo <= 0) {
        clearInterval(intervalo)
        displayTimer.textContent = '¡Tiempo!'
        terminarExamen()
    }
}, 1000)

// ── Terminar examen ───────────────────────────────
const botonTerminar = document.querySelector('.btn_terminar')
botonTerminar.addEventListener('click', terminarExamen)

function terminarExamen() {
    clearInterval(intervalo)
    botonTerminar.disabled = true

    let correctas = 0
    const estadoPorPregunta = []

    examenSeleccionado.preguntas.forEach((pregunta, index) => {
        const seleccionada = document.querySelector(`input[name="pregunta_${index}"]:checked`)
        const bloquePreg   = document.querySelector(`.pregunta[data-pregunta="${index}"]`)
        const labels       = bloquePreg.querySelectorAll('.respuestas label')

        bloquePreg.querySelectorAll('input[type="radio"]').forEach(r => r.disabled = true)

        let acertada = false

        pregunta.respuestas.forEach((respuesta, i) => {
            const label     = labels[i]
            const estaSelec = seleccionada && parseInt(seleccionada.value) === i
            const icono     = document.createElement('span')
            icono.className = 'respuesta-icono'

            if (respuesta.esCorrecta) {
                label.classList.add('label-correcta')
                icono.textContent = '✓'
                label.appendChild(icono)
                if (estaSelec) acertada = true
            } else if (estaSelec) {
                label.classList.add('label-incorrecta')
                icono.textContent = '✗'
                label.appendChild(icono)
            }
        })

        if (!seleccionada) {
            estadoPorPregunta.push('omitida')
        } else if (acertada) {
            estadoPorPregunta.push('correcta')
            correctas++
        } else {
            estadoPorPregunta.push('incorrecta')
        }
    })

    const total              = examenSeleccionado.preguntas.length
    const porcentajeObtenido = Math.round((correctas / total) * 100)
    const aprueba            = porcentajeObtenido >= examenSeleccionado.porcentaje

    mostrarResumen(estadoPorPregunta, correctas)

    const modal = document.getElementById('modal')
    document.querySelector('.modal_titulo').textContent     = aprueba ? '¡Aprobaste! 🎉' : 'No aprobaste 😔'
    document.querySelector('.modal_porcentaje').textContent = porcentajeObtenido + '%'
    document.querySelector('.modal_mensaje').textContent    = `Respondiste ${correctas} de ${total} preguntas correctamente`
    modal.style.display = 'flex'

    document.querySelector('.modal_btn_revisar').addEventListener('click', () => {
        modal.style.display = 'none'
        document.querySelector('.contenedor_terminar').style.display = 'none'
        document.getElementById('resumenResultado').scrollIntoView({ behavior: 'smooth', block: 'start' })
    })

    document.querySelector('.modal_btn_volver').addEventListener('click', () => {
        window.location.href = '../pages/catalogo.html'
    })
}

function mostrarResumen(estados, correctas) {
    const incorrectas = estados.filter(e => e === 'incorrecta').length
    const omitidas    = estados.filter(e => e === 'omitida').length

    const resumen = document.createElement('div')
    resumen.className = 'resumen-resultado'
    resumen.id = 'resumenResultado'
    resumen.innerHTML = `
        <div class="resumen-encabezado">
            <p class="resumen-titulo">Revisión de respuestas</p>
            <div class="resumen-contadores">
                <span class="resumen-counter counter-ok">✓ ${correctas} correcta${correctas !== 1 ? 's' : ''}</span>
                <span class="resumen-counter counter-err">✗ ${incorrectas} incorrecta${incorrectas !== 1 ? 's' : ''}</span>
                ${omitidas > 0 ? `<span class="resumen-counter counter-skip">— ${omitidas} omitida${omitidas !== 1 ? 's' : ''}</span>` : ''}
            </div>
        </div>
        <div class="resumen-chips">
            ${estados.map((estado, i) => `
                <button class="resumen-chip chip-${estado === 'correcta' ? 'ok' : estado === 'incorrecta' ? 'err' : 'skip'}"
                        data-idx="${i}"
                        title="Pregunta ${i + 1}: ${estado}">
                    P${i + 1} ${estado === 'correcta' ? '✓' : estado === 'incorrecta' ? '✗' : '—'}
                </button>
            `).join('')}
        </div>
    `

    const listaPreguntas = document.querySelector('.lista_preguntas')
    listaPreguntas.parentNode.insertBefore(resumen, listaPreguntas)

    resumen.querySelectorAll('.resumen-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const pregBlock = document.querySelector(`.pregunta[data-pregunta="${chip.dataset.idx}"]`)
            if (pregBlock) pregBlock.scrollIntoView({ behavior: 'smooth', block: 'center' })
        })
    })
}
