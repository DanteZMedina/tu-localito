const formulario = document.getElementById("zona-form");
const inputCP = document.getElementById("codigo-postal-cp");
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
    formCpCompleted = document.getElementById("codigo-postal");
    formCpCompleted.value = cp;
  } else {
    mensaje.textContent = "Estás fuera de nuestro alcance. :(";
    mensaje.classList.add("error");
  }
});


/*=== lógica de formulario ===*/
/**Lógica de validación de formulario. */
const formularioCompleto = document.getElementById("formulario-completo-form");
formularioCompleto.addEventListener("submit", function (e) {
  e.preventDefault();
  const inputs = formularioCompleto.querySelectorAll("input");
  let esValido = true;
  inputs.forEach((input) => {
    const resultado = validateInput(input);
    if (!resultado) {
      esValido = false;
    }
  });
  if (esValido) {
    console.log("Formulario completo");

    //Construccion del json
    constructorJson(formularioCompleto);
    window.location.href = "../html/mi-cuenta.html";


  } else {
    console.log("Formulario incompleto :c");
  }
}
);

$('input[type="text"], input[type="email"]').blur(function () {
  validateInput(this);
});
/*
$('input[type="email"]').blur(function () {
  validateInput(this);
});*/
$("#personalPhone").on("input", function () {
  formatPhoneNumber(this);
});
$('#personalName').blur(function () {
  validateInput(this);
});
$('#personalLastName').blur(function () {
  validateInput(this);
});
$('#contraseña').blur(function () {
  validateInput(this);
});
$('#contraseña-validada').blur(function () {
  validateInput(this);
});

/*===Esta función valida los input, según el caso o la necesidad.===*/
function validateInput(input) {
  /*limpieza de datos y obtención por medio del name input o id del input.*/
  const value = input.value.trim();
  const name = input.name || input.id;
  clearValidation(input);

  /*Validación de campo vacio del valor, sin importar el nombre del input.*/
  if (value === "") {
    showValidationError(
      input,
      `El campo ${getFieldDisplayName(name)} es requerido`
    );
    return false;
  }
  /*Según el name obtenido del input, va a usar la función requerida.*/
  switch (name) {
    case "personalPhone":
      return validatePhoneNumber(input);
    case "userEmail":
      return validateEmail(input);
    case "personalName":
      return validateName(input);
    case "personalLastName":
      return validateLastName(input);
    case "password":
      return validatePassword(input);
    case "confirmPassword":
      return validateConfirmPassword(input);
    default:
      showValidationSuccess(input);
      return true;
  }
};



function formatPhoneNumber(input) {
  let value = input.value.replace(/\D/g, ""); // Solo dígitos;
  // Limita a 10 dígitos
  value = value.substring(0, 10);;
  // Formato progresivo
  if (value.length >= 3 && value.length <= 6) {
    value = value.substring(0, 2) + "-" + value.substring(2);
  } else if (value.length > 6) {
    value =
      value.substring(0, 2) +
      "-" +
      value.substring(2, 6) +
      "-" +
      value.substring(6);
  }
  input.value = value;
};


/*===Vaidaciones de cada input especial,recibe el input como argumento.
Familia: Validate===*/

/*Validación de número teléfonico. */
function validatePhoneNumber(input) {
  /*Aquí se genera un test. Si es false, se llama a la función showValidateError para mostrar
  un mensaje de error.*/
  const phoneRegex = /^\d{2}-\d{4}-\d{4}$/;
  if (!phoneRegex.test(input.value)) {
    /* Se conecta con la función de mostrar error, dando el input y el mensaje que debe 
    mostrar. */
    showValidationError(input, "El formato del teléfono debe ser 5555-5555-55");
    return false;
  }
  /* En este segemento se explica el if anterior. Si phoneRegex no cumple el test, retornará
  un false, pero para que entre en el bloque if debe ser true, por eso se niega el false, se 
  vuelve true y entra la validación. En caso de que eltest de phoneRegex sea true, se 
  niega a false, y entra a la siguiente sección, donde se muestra el mensaje de validación
  exitosa. */
  showValidationSuccess(input);
  return true;
};
/*Validación de email. */
function validateEmail(input) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(input.value)) {
    showValidationError(input, "El formato del email no es válido");
    return false;
  }
  showValidationSuccess(input);
  return true;
};
/*Validacion de nombre*/
function validateName(input) {
  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const value = input.value.trim();

  if (!nameRegex.test(value)) {
    showValidationError(input, "El formato del nombre no es válido");
    return false;
  }
  showValidationSuccess(input);
  return true;
};
/*Validación de nombre*/
function validateLastName(input) {
  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const value = input.value.trim();
  if (!nameRegex.test(value)) {
    showValidationError(input, "El formato del nombre no es válido");
    return false;
  }
  showValidationSuccess(input);
  return true;
};
/*Validación de contraseña*/
function validatePassword(input) {
  const value = input.value.trim();
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!passwordRegex.test(value)) {
    showValidationError(
      input,
      "La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, un número y un carácter especial."
    );
    return false;
  }
  showValidationSuccess(input);
  return true;
};


/*Validacion de contraseña confirmada*/
function validateConfirmPassword(input) {
  const passwordInput = document.getElementById("contraseña");
  const passwordValue = passwordInput.value.trim();
  const confirmValue = input.value.trim();

  if (confirmValue === "") {
    showValidationError(input, "Debes confirmar tu contraseña.");
    return false;
  }

  if (confirmValue !== passwordValue) {
    showValidationError(input, "Las contraseñas no coinciden.");
    return false;
  }

  showValidationSuccess(input);
  return true;
};



/*=== Funciones de mostrar mensaje si las validaciones fueron exitosas o no.
Familia: Show===*/

/*Esta función muestra un mensaje de invalidación si la validación no se logra.
Recibe como argumento el input que se valido, y el message que se debe mostrar. Esta 
función se conecta con las funciones de la familia validate. */
function showValidationError(input, message) {
  /*En el input se adiciona la clase is-invalid */
  $(input).addClass("is-invalid");
  /*El método .sibblings buscara etiquetas con .invalid-feedback en el contenedor 
  en donde se encuentre el input. */
  let feedback = $(input).siblings(".invalid-feedback");
  /*Si no encuentra algo parecido, feedback estará vacio, entonces .length será 0, 
  lo que reasignara a feedback con la etiqueta con la clase necesaria. */
  if (feedback.length === 0) {
    /*Aquí se genera la etiqueta html para el mensaje de invalidación.*/
    feedback = $('<div class="invalid-feedback"></div>');
    /*Aquí, se adiciona la etqueta, justo despues de la etiqueta del input.*/
    $(input).after(feedback);
  }
  /*En esta etiqueta se adiciona el mensaje que se dio como argumento en la etiqueta que antes
  se creo con el nombre de feedback. Si feedback no estaba vacio, se reutiliza feedback 
  y se adiciona el texto seleccionado. */
  feedback.text(message);
};

/*Esta función muestra un mensaje de validación exitosa si esta se logra.
Recibe como argumento el input que se valido, y el mensaje que se debe mostrar. Esta 
función se conecta con las funciones de la familia validate */
function showValidationSuccess(input) {
  /*Remueve la clase is-invalidate y agrega la clase is-validate. Esta función trabaja de 
  manera similar que showValidateError.*/
  $(input).removeClass("is-invalid").addClass("is-valid");
  $(input).siblings(".invalid-feedback").remove();

  let feedback = $(input).siblings(".success-feedback");
  if (feedback.length === 0) {
    feedback = $('<div class="success-feedback"></div>');
    $(input).after(feedback);
  }
  feedback.text("✓ Válido");
  // Elimina el mensaje después de 3 segundos
  setTimeout(() => {
    feedback.fadeOut(300, () => {
      feedback.remove();
    });
  }, 3000);
};

/*Esta función limpia las clases*/
function clearValidation(input) {
  $(input).removeClass("is-invalid is-valid");
  /*Limpia lo que se agrega despues de llamar las funciones de la familia Show */
  $(input).siblings(".invalid-feedback, .success-feedback").remove();
};

function getFieldDisplayName(fieldName) {
  const fieldNames = {
    postalCode: "código postal",
    personalName: "nombre",
    personalLastName: "primer apellido",
    personalPhone: "celular",
    userEmail: "correo",
    password: "contraseña",
    confirmPassword: "confirmar contraseña",
  };
  return fieldNames[fieldName] || fieldName;
};



function constructorJson(formulario) {
   const formData = new FormData(formulario);
    const datosObj = Object.fromEntries(formData.entries());
    /*Hace que no se muestre la contraseña, pero no es seguro
    datosObj.password = "*".repeat(datosObj.password.length);
    datosObj.confirmPassword = "*".repeat(datosObj.confirmPassword.length);*/
    const datosJson = JSON.stringify(datosObj);
    console.log("JSON listo para enviar:", datosJson);
};
