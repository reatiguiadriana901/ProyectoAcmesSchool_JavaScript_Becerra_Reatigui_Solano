 const btnAgregarPregunta = document.getElementById("btnAgregarPregunta")
btnAgregarPregunta.addEventListener('click', agregarPregunta)


let contadorPreguntas = 0; 
function agregarPregunta() {
    contadorPreguntas++; 
    const pregunta = crearPregunta(contadorPreguntas);

    const examenPregunta = document.getElementById("examenPregunta")
    examenPregunta.appendChild(pregunta)
}


 function crearPregunta(numero) {
    const pregunta = document.createElement("section");
    pregunta.classList.add("bloque-pregunta");

    pregunta.innerHTML = `
        <h3>Pregunta <strong>${numero}</strong></h3>
        <div>
            <input type="text" placeholder="Escribe la pregunta" required>
            <button class="btn-eliminar-pregunta">Eliminar</button>
        </div>
        <label class="opcion-respuesta">
            <input type="radio" name="respuesta-${numero}">
            <input type="text" placeholder="Descripcion de la respuesta" required>
            <button class="btn-quitar-respuesta">Quitar</button>
        </label>
        <label class="opcion-respuesta">
            <input type="radio" name="respuesta-${numero}">
            <input type="text" placeholder="Descripcion de la respuesta" required>
            <button class="btn-quitar-respuesta">Quitar</button>
        </label>
        <button class="agrRespuesta">Agregar Respuesta</button>
    `;

    return pregunta;
}

examenPregunta.addEventListener('click', function(event) {

    if (event.target.classList.contains('btn-eliminar-pregunta')) {
        const pregunta = event.target.closest('.bloque-pregunta');
        pregunta.remove();
    }

    if (event.target.classList.contains('btn-quitar-respuesta')) {
        const respuesta = event.target.closest('.opcion-respuesta');
        respuesta.remove();
    }

});