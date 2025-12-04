function esBinario(num) {
  return /^[01]+$/.test(num);
}

function esDecimal(num) {
  return /^[0-9]+$/.test(num) && !esBinario(num);
}

function binarioADecimal(bin) {
  return parseInt(bin, 2);
}

function decimalABinario(dec) {
  return (parseInt(dec, 10) >>> 0).toString(2);
}

function actualizarConversiones() {
  const num1 = document.getElementById("num1").value.trim();
  const num2 = document.getElementById("num2").value.trim();

  mostrarConversion(num1, "num1");
  mostrarConversion(num2, "num2");
}

function mostrarConversion(valor, id) {
  const binEl = document.getElementById(id + "Bin");
  const decEl = document.getElementById(id + "Dec");

  if (valor === "") {
    binEl.textContent = "-";
    decEl.textContent = "-";
    return;
  }

  if (esBinario(valor)) {
    binEl.textContent = valor;
    decEl.textContent = binarioADecimal(valor);
  } else if (esDecimal(valor)) {
    binEl.textContent = decimalABinario(valor);
    decEl.textContent = valor;
  } else {
    binEl.textContent = "❌ Inválido";
    decEl.textContent = "❌ Inválido";
  }
}

function operar(tipo) {
  const num1 = document.getElementById("num1").value.trim();
  const num2 = document.getElementById("num2").value.trim();
  const error = document.getElementById("error");
  const resBin = document.getElementById("resBin");
  const resDec = document.getElementById("resDec");

  error.textContent = "";

  if (num1 === "" || num2 === "") {
    error.textContent = "Introduce ambos números.";
    return;
  }

  let dec1, dec2;

  if (esBinario(num1)) dec1 = binarioADecimal(num1);
  else if (esDecimal(num1)) dec1 = parseInt(num1);
  else {
    error.textContent = "Número 1 no válido.";
    return;
  }

  if (esBinario(num2)) dec2 = binarioADecimal(num2);
  else if (esDecimal(num2)) dec2 = parseInt(num2);
  else {
    error.textContent = "Número 2 no válido.";
    return;
  }

  let resultado;
  switch (tipo) {
    case "sumar": resultado = dec1 + dec2; break;
    case "restar": resultado = dec1 - dec2; break;
    case "multiplicar": resultado = dec1 * dec2; break;
    case "dividir":
      if (dec2 === 0) {
        error.textContent = "No se puede dividir por cero.";
        return;
      }
      resultado = Math.floor(dec1 / dec2);
      break;
  }

  resDec.textContent = resultado;
  resBin.textContent = resultado >= 0 ? decimalABinario(resultado) : "-" + decimalABinario(Math.abs(resultado));

  actualizarConversiones();
}

// Actualizar conversiones en tiempo real
document.getElementById("num1").addEventListener("input", actualizarConversiones);
document.getElementById("num2").addEventListener("input", actualizarConversiones);
