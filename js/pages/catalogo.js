const examenes = [            
    {
        codigo: "JS-101",
        titulo: "Fundamentos de JavaScript",
        tiempo: 10,
        porcentaje: 70,
        descripcion: "Evalua concepto basicos de variables, manejo del DOM, funciones y arreglos en JavaScript",
        preguntas: [
            {
                texto: "¿Cuál palabra permite declarar una constante?",
                respuestas: [
                    { texto: "let", esCorrecta: false },
                    { texto: "const", esCorrecta: true },
                    { texto: "var", esCorrecta: false },
                ]
            },

            {
                texto: "¿Que metodo permite recorrer un arreglo sin crear uno nuevo?",
                respuestas: [
                    { texto: "forEach", esCorrecta: true },
                    { texto: "map", esCorrecta: false },
                    { texto: "filter", esCorrecta: false}
                ]
            },

            {
                texto: "¿Que API del navegador se usa para guardar datos persitentes simples?",
                respuestas: [
                    { texto: "localstorage", esCorrecta: true },
                    { texto: "webstorage", esCorrecta: false },
                    { texto: "cookies", esCorrecta: false}
                ]
            },
        ]
}]


//const examenes = JSON.parse(localStorage.getItem('como santiago lo llame cuando le de set item al localStorage'))   

const tarjeta = document.getElementById("catalogo_grid");

examenes.forEach((examen) => {
    const nuevaTarjeta = document.createElement('div')
    
    nuevaTarjeta.innerHTML = `
    <article class="card_exam">
        <div class="card_exam_header">
            <span class="card_examen_codigo">${examen.codigo}</span>
        </div>
                            
        <div class="card_examen-body">
            <h2 class="card_examen_title">${examen.titulo}</h2>
            <p class="card_examen_description">${examen.descripcion}</p>
        </div>

        <div class="card_examen_footer">
            <div class="card_examen_info">
                <span class="card_examen_detalle">${examen.tiempo} min</span>
                <span class="card_examen_detalle">${examen.porcentaje} % aprueba</span>
                <span class="card_examen_detalle">${examen.preguntas.length} preguntas</span>
            </div>
            <button type="button" class="btn-presentar">Presentar</button>
        </div>
    </article>
`
    const boton = nuevaTarjeta.querySelector('.btn-presentar')
    boton.addEventListener('click', () => {
        localStorage.setItem('examenSeleccionado', JSON.stringify(examen))

        window.location.href = '../registro_examen/registro.html'
    })
    document.querySelector('.catalogo_grid').appendChild(nuevaTarjeta)
})