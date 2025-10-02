const form = document.getElementById("formulario-login");

$('input[type="text"], input[type="email"]').blur(function () {
  validateInput(this);
});
$('#password').blur(function () {
  validateInput(this);});


form.addEventListener("submit", function (e) {
  e.preventDefault();
  const inputs = form.querySelectorAll("input");
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
    constructorJson(form);



  } else {
    console.log("Formulario incompleto");
  }
}
);


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
    case "email":
      return validateEmail(input);
    case "password":
      return validatePassword(input);
    default:
      showValidationSuccess(input);
      return true;
  }
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
    email: "correo",
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







