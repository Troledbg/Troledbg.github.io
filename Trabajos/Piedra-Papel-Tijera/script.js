let puntuajeUsuario = 0;
let puntuajeComputadora = 0;

const marcadorUsuario = document.getElementById('marcador-usuario');
const marcadorComputadora = document.getElementById('marcador-computadora');

const eleccionUsuarioElement = document.getElementById('eleccion-usuario');
const eleccionComputadoraElement = document.getElementById('eleccion-computadora');

const resultadoElement = document.getElementById('resultado');
const botonesOpcion = document.querySelectorAll('.opcion-btn');
const botonReiniciar = document.getElementById('reiniciar');

function obtenerEleccionComputadora() {
  const opciones = ['piedra', 'papel', 'tijeras'];
  const indiceAleatorio = Math.floor(Math.random() * 3);
  return opciones[indiceAleatorio];
}

function determinarGanador(eleccionUsuario, eleccionComputadora) {
  if (eleccionUsuario === eleccionComputadora) {
    return 'empate';
  }

  if (
    (eleccionUsuario === 'piedra' && eleccionComputadora === 'tijeras') ||
    (eleccionUsuario === 'tijeras' && eleccionComputadora === 'papel') ||
    (eleccionUsuario === 'papel' && eleccionComputadora === 'piedra')
  ) {
    return 'usuario';
  } else {
    return 'computadora';
  }
}

function actualizarInterfaz(eleccionUsuario, eleccionComputadora, resultado) {
  eleccionUsuarioElement.textContent = eleccionUsuario.toUpperCase();
  eleccionComputadoraElement.textContent = eleccionComputadora.toUpperCase();

  if (resultado === 'empate') {
    resultadoElement.textContent = '¡Empate!';
    resultadoElement.style.backgroundColor = '#f39c12';
    resultadoElement.style.color = 'white';
  } else if (resultado === 'usuario') {
    puntuajeUsuario++;
    resultadoElement.textContent = '¡Ganaste!';
    resultadoElement.style.backgroundColor = '#27ae60';
    resultadoElement.style.color = 'white';
  } else {
    puntuajeComputadora++;
    resultadoElement.textContent = '¡La computadora gana!';
    resultadoElement.style.backgroundColor = '#e74c3c';
    resultadoElement.style.color = 'white';
  }

  marcadorUsuario.textContent = puntuajeUsuario;
  marcadorComputadora.textContent = puntuajeComputadora;
}

function jugarRonda(evento) {
  const eleccionUsuario = evento.currentTarget.getAttribute('data-opcion');
  const eleccionComputadora = obtenerEleccionComputadora();
  const resultado = determinarGanador(eleccionUsuario, eleccionComputadora);
  actualizarInterfaz(eleccionUsuario, eleccionComputadora, resultado);
}

function reiniciarJuego() {
  puntuajeUsuario = 0;
  puntuajeComputadora = 0;
  marcadorUsuario.textContent = '0';
  marcadorComputadora.textContent = '0';
  eleccionUsuarioElement.textContent = '-';
  eleccionComputadoraElement.textContent = '-';
  resultadoElement.textContent = '¡Elige una opción para comenzar!';
  resultadoElement.style.backgroundColor = '#ecf0f1';
  resultadoElement.style.color = '#333';
}

// Eventos
botonesOpcion.forEach(boton => boton.addEventListener('click', jugarRonda));
botonReiniciar.addEventListener('click', reiniciarJuego);