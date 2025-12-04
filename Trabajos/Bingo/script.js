let numeros = Array.from({ length: 100 },(_,i) => i + 1);
let usados = [];

window.onload = function(){
	const tabla = document.getElementById("tabla");
	for(let fila = 0; fila < 10; fila++){
		let tr = document.createElement("tr");

		for(let col = 1; col <= 10; col++){
			let numero = fila*10 + col;	
			let td = document.createElement("td");
			td.id = "n"+numero;
			td.textContent = numero;
			tr.appendChild(td);
		}
		tabla.appendChild(tr);
	};
}
function sacarNumero(){

	if(numeros.length === 0){
		alert("Ya no quedan números.");
		return;
	}

	let indice = Math.floor(Math.random() * numeros.length);
	let numero = numeros[indice];
	document.getElementById("resultado").textContent = numero;
	document.getElementById("n"+numero).style.background = "#14543fff";
	usados.push(numero);
	numeros.splice(indice,1);

}
function limpiarBingo(){
    numeros = Array.from({ length: 100 },(_,i) => i + 1);
    usados = [];

    for (let i = 1; i <= 100; i++){
        document.getElementById("n"+i).style.background = "";
    }
    document.getElementById("resultado").textContent = "-";
}
