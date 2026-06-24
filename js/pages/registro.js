const boton_volver = document.querySelector('.volver')
    boton_volver.addEventListener('click', () => {
        window.location.href = 'catalogo.html'
    })

const examenSeleccionado = JSON.parse(localStorage.getItem('examenSeleccionado'))

document.querySelector('.record_code').textContent = examenSeleccionado.codigo
document.querySelector('.record_title').textContent = examenSeleccionado.titulo

const identificacion = document.querySelector(".input_identificacion");
const botonIniciar = document.querySelector('.iniciar')

botonIniciar.addEventListener('click', () => {
    const usuarioIdentificacion = identificacion.value
    if (usuarioIdentificacion === "") {
    document.querySelector('.mensaje_error').textContent = 'Por favor ingresa tu identificación'
    } else {
    const datosEstudiante = { identificacion: usuarioIdentificacion }
    localStorage.setItem('acme_estudiante', JSON.stringify(datosEstudiante))
    window.location.href = '../examen/examen.html'
    }
})

const validarUsuario = 


