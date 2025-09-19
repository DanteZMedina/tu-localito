const formulario = document.getElementById("zona-form");
const inputCP = document.getElementById("codigo-postal");
const mensaje = document.getElementById("mensaje-zona");

const codigosPermitidos = ["54000", "54030", "54050", "54100"];

formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  const cp = inputCP.value.trim();

  // Validación: 5 dígitos numéricos
  const esValido = /^\d{5}$/.test(cp);

  if (!esValido) {
    mensaje.textContent = "Por favor, ingresa un código postal válido de 5 dígitos.";
    mensaje.classList.add("error");
    return;
  }

  // Validación de zona
  if (codigosPermitidos.includes(cp)) {
    mensaje.textContent = "Zona válida ✅";
    mensaje.classList.remove("error");
  } else {
    mensaje.textContent = "Estas fuerade nuestro alcance. :(";
    mensaje.classList.add("error");
  }
}
);