const formulario = document.getElementById("zona-form");
const inputCP = document.getElementById("codigo-postal");
const mensaje = document.getElementById("mensaje-error");

const codigosPermitidos = ["54000", "54030", "54050", "54100"];

formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  const cp = inputCP.value.trim();

  // Validación: 5 dígitos numéricos
  const esValido = /^\d{5}$/.test(cp);

  if (cp === "") {
    mensaje.textContent = "Inserta tu código postal, por favor.";
    mensaje.classList.add("error");
    return;
  }

  if (!esValido) {
    mensaje.textContent =
      "Por favor, ingresa un código postal válido de 5 dígitos.";
    mensaje.classList.add("error");
    return;
  }

  // Validación de zona
  if (codigosPermitidos.includes(cp)) {
    mensaje.classList.remove("error");
    formCp = document.getElementById("registro-cp");
    completeForm = document.getElementById("formulario-completo");
    completeForm.classList.add("active");
    formCp.classList.add("hidden");
  } else {
    mensaje.textContent = "Estás fuera de nuestro alcance. :(";
    mensaje.classList.add("error");
  }
});

$('input[type="text"], input[type="email"]').blur(function () {
  validateInput(this);
});
$("#personalPhone").on("input", function () {
  formatPhoneNumber(this);
});

function formatPhoneNumber(input) {
  let value = input.value.replace(/\D/g, "");
  if (value.length >= 4 && value.length <= 8) {
    value = value.substring(0, 4) + "-" + value.substring(4);
  } else if (value.length > 8) {
    value =
      value.substring(0, 4) +
      "-" +
      value.substring(4, 8) +
      "-" +
      value.substring(8, 10);
  }
  input.value = value;
}

function validateInput(input) {
  const value = input.value.trim();
  const name = input.name || input.id;
  clearValidation(input);

  if (value === "") {
    showValidationError(
      input,
      `El campo ${getFieldDisplayName(name)} es requerido`
    );
    return false;
  }

  switch (name) {
    case "personalPhone":
      return validatePhoneNumber(input);
    case "userEmail":
      return validateEmail(input);
    default:
      showValidationSuccess(input);
      return true;
  }
}

function validatePhoneNumber(input) {
  const phoneRegex = /^\d{4}-\d{4}-\d{2}$/;
  if (!phoneRegex.test(input.value)) {
    showValidationError(input, "El formato del teléfono debe ser 5555-5555-55");
    return false;
  }
  showValidationSuccess(input);
  return true;
}

function validateEmail(input) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(input.value)) {
    showValidationError(input, "El formato del email no es válido");
    return false;
  }
  showValidationSuccess(input);
  return true;
}

function showValidationError(input, message) {
  $(input).addClass("is-invalid");
  let feedback = $(input).siblings(".invalid-feedback");
  if (feedback.length === 0) {
    feedback = $('<div class="invalid-feedback"></div>');
    $(input).after(feedback);
  }
  feedback.text(message);
}

function showValidationSuccess(input) {
  $(input).removeClass("is-invalid").addClass("is-valid");
  $(input).siblings(".invalid-feedback").remove();

  let feedback = $(input).siblings(".success-feedback");
  if (feedback.length === 0) {
    feedback = $('<div class="success-feedback"></div>');
    $(input).after(feedback);
  }
  feedback.text("✓ Válido");
}

function clearValidation(input) {
  $(input).removeClass("is-invalid is-valid");
  $(input).siblings(".invalid-feedback, .success-feedback").remove();
}

function getFieldDisplayName(fieldName) {
  const fieldNames = {
    postalCode: "Código Postal",
    personalName: "Nombre",
    personalLastName: "Primer Apellido",
    personalPhone: "Celular",
    userEmail: "Correo",
    password: "Contraseña",
    confirmPassword: "Confirmar Contraseña",
  };
  return fieldNames[fieldName] || fieldName;
}
