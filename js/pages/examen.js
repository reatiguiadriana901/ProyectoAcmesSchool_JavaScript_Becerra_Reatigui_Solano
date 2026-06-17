const examenSeleccionado = JSON.parse(localStorage.getItem('examenSeleccionado'))

document.querySelector('.record_code').textContent = examenSeleccionado.codigo;
document.querySelector('.record_title').textContent = examenSeleccionado.titulo;
document.querySelector('.total_preguntas').textContent = examenSeleccionado.preguntas.length + ' preguntas';
document.querySelector('.approbation').textContent = examenSeleccionado.porcentaje + '%';

const tarjeta = document.getElementById("lista_de_preguntas");


examenSeleccionado.preguntas.forEach((pregunta, index) => {
    const nuevaPregunta = document.createElement('div')
    
    nuevaPregunta.innerHTML = `
        <div class="pregunta">
            <p class="pregunta_texto">${index + 1}. ${pregunta.texto}</p>
            <div class="respuestas">
                ${pregunta.respuestas.map((respuesta, i) => `
                    <label>
                        <input type="radio" name="pregunta_${index}" value="${i}"> ${respuesta.texto}
                    </label>
                `).join('')}
            </div>
        </div>
    `
    document.querySelector('.lista_preguntas').appendChild(nuevaPregunta)
})



const displayTimer = document.getElementById('timer')
let tiempo = examenSeleccionado.tiempo * 60


const intervalo = setInterval(() => {
    tiempo--;
    const minutos = Math.floor(tiempo / 60)
    const segundos = tiempo % 60
    displayTimer.textContent = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
    if (tiempo <= 0) {
        clearInterval(intervalo);
        displayTimer.textContent = '00:00';
        botonTerminar.click();
    }
}, 1000)

const botonTerminar = document.querySelector('.btn_terminar')

botonTerminar.addEventListener('click', () => {

    clearInterval(intervalo)

    
    let correctas = 0

    examenSeleccionado.preguntas.forEach((pregunta, index) => {
    
        const seleccionada = document.querySelector(`input[name="pregunta_${index}"]:checked`)
        
        if (seleccionada) {
            
            const respuesta = pregunta.respuestas[seleccionada.value]
            if (respuesta && respuesta.esCorrecta) {
                correctas++
            }
        }
    })

    
    const total = examenSeleccionado.preguntas.length
    const porcentajeObtenido = Math.round((correctas / total) * 100)

        
    const aprueba = porcentajeObtenido >= examenSeleccionado.porcentaje

    const modal = document.getElementById('modal')
    document.querySelector('.modal_titulo').textContent = aprueba ? '¡Aprobaste! 🎉' : 'No aprobaste 😔'
    document.querySelector('.modal_porcentaje').textContent = porcentajeObtenido + '%'
    document.querySelector('.modal_mensaje').textContent = `Respondiste ${correctas} de ${total} preguntas correctamente`
    modal.style.display = 'flex'

    document.querySelector('.modal_btn').addEventListener('click', () => {
        window.location.href = 'catalogo.html'
})

})