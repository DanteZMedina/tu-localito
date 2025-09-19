const form = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const errorName = document.getElementById('error-name');
const errorEmail = document.getElementById('error-email');
const phoneInput = document.getElementById('phone');
const phoneError = document.getElementById('phoneError');

form.addEventListener('submit', function (event) {
    // Previene el envío del formulario hasta que se realicen las validaciones
    event.preventDefault();

    let isValid = true;

    // Validación del nombre
    if (nameInput.value.trim() === '') {
        errorName.textContent = 'El nombre es obligatorio.';
        isValid = false;
    } else {
        errorName.textContent = ''; // Limpia el mensaje de error si es válido
    }

    // Validación del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        errorEmail.textContent = 'Por favor, introduce un correo electrónico válido.';
        isValid = false;
    } else {
        errorEmail.textContent = ''; // Limpia el mensaje de error si es válido
    }
    /*
    // Validación para teléfono
    if (valorPhone.trim() === "") {
        phoneError.textContent = "El teléfono es obligatorio.";
        phoneError.style.display = 'block';
        isValid = false;
    } else if (!regexTelefono.test(valorPhone)) {
        phoneError.textContent = "Por favor, ingrese un número de teléfono válido de 10 dígitos.";
        phoneError.style.display = 'block';
        isValid = false;
    } else {
        phoneError.style.display = 'none';
    }
*/

    // Si todos los campos son válidos, puedes enviar el formulario
    if (isValid) {
        form.submit(); // o envíalo con fetch/AJAX si es necesario
        alert('¡Formulario enviado con éxito!');
    }
});