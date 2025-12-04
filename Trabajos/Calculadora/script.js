// Función para agregar números y operadores a la pantalla

function agregar (valor) {
	// Obtiene el elemento de la pantalla por su ID
	const pantalla = document.getElementById('pantalla');
	
	// Si la pantalla muestra solo "0", lo reemplaza con el nuevo valor
	if (pantalla.textContent === '0') {
		pantalla.textContent = valor;
	} else {
		// Si no, agrega el nuevo valor al contenido existente
		pantalla.textContent += valor;
	}
}

// Función para limpiar la pantalla (botón C)
function limpiar() {
	// Obtiene la pantalla y establece su contenido a "0"
	document.getElementById('pantalla').textContent = '0';
	
}

// Función para calcular el resultado (botón =)
function calcular() {
	// Obtiene el elemento de la pantalla
	const pantalla = document.getElementById('pantalla');
	
	try {
		// eval() evalúa la expresión matemática en la pantalla
		// Ejemplo: si pantalla tiene "2+2", eval() devuelve 4
		pantalla.textContent = eval(pantalla.textContent);
		
	} catch {
		// Si hay un error (ej: expresión inválida), muestra "Error"
		pantalla.textContent = 'Error';
	}	
}