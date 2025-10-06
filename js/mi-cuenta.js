// Variables globales
let addressCounter = 1; // Contador para las direcciones, inicia en 1
let paymentCounter = 1; // Contador para los métodos de pago, inicia en 1
let selectedCharacter = 4; // ID del personaje seleccionado por defecto
let passwordChangeVisible = false; // Bandera para controlar la visibilidad del formulario de cambio de contraseña

// Array de objetos para los personajes
const characters = [
    { id: 1, img: 'https://i.ibb.co/Pv2n9FLK/tomate.png', name: 'tomate' },
    { id: 2, img: 'https://i.ibb.co/YTyJpq0B/zanahoria.png', name: 'zanahoria' },
    { id: 3, img: 'https://i.ibb.co/Y7HQLWvR/mango.png', name: 'mango' },
    { id: 4, img: 'https://i.ibb.co/LhZv0YFS/uva.png', name: 'uva' },
    { id: 5, img: 'https://i.ibb.co/jPZqtLKt/pera.png', name: 'pera' },
    { id: 6, img: 'https://i.ibb.co/wrpD1FK6/cereza.png', name: 'cereza' },
    { id: 7, img: 'https://i.ibb.co/mCNPyVNL/limon.png', name: 'limon' }
];

/*
<button class="character-btn" data-character="1"><img src="https://i.ibb.co/Pv2n9FLK/tomate.png" alt="" class="btn-img"></button>
<button class="character-btn" data-character="2"><img src="https://i.ibb.co/YTyJpq0B/zanahoria.png" alt="" class="btn-img"></button>
<button class="character-btn" data-character="3"><img src="https://i.ibb.co/Y7HQLWvR/mango.png" alt="" class="btn-img"></button>
<button class="character-btn active" data-character="4"><img src="https://i.ibb.co/LhZv0YFS/uva.png" alt="" class="btn-img"></button>
<button class="character-btn" data-character="5"><img src="https://i.ibb.co/jPZqtLKt/pera.png" alt="" class="btn-img"></button>
<button class="character-btn" data-character="6"><img src="https://i.ibb.co/wrpD1FK6/cereza.png" alt="" class="btn-img"></button>
<button class="character-btn" data-character="7"><img src="https://i.ibb.co/mCNPyVNL/limon.png" alt="" class="btn-img"></button>

*/
 

// Se ejecuta cuando el documento (la página HTML) está listo
$(document).ready(function() {
    // Inicializa todos los "escuchadores de eventos" (event listeners)
    initializeEventListeners();
    // Actualiza el personaje seleccionado en la interfaz
    updateSelectedCharacter();
});

// Función para inicializar todos los manejadores de eventos
function initializeEventListeners() {
    // Maneja el clic en los botones de selección de personaje
    $('.character-btn').click(function() {
        // Remueve la clase 'active' de todos los botones
        $('.character-btn').removeClass('active');
        // Agrega la clase 'active' solo al botón clickeado
        $(this).addClass('active');
        // Actualiza la variable `selectedCharacter` con el ID del botón clickeado
        selectedCharacter = parseInt($(this).data('character'));
        // Llama a la función para actualizar la visualización del personaje
        updateSelectedCharacter();
    });

    // Maneja el clic en los enlaces del menú lateral
    $('.sidebar-link[data-tab]').click(function(e) {
        // Previene el comportamiento por defecto del enlace (evita que la página se recargue)
        e.preventDefault();
        // Remueve la clase 'active' de todos los enlaces del menú
        $('.sidebar-link').removeClass('active');
        // Agrega la clase 'active' solo al enlace clickeado
        $(this).addClass('active');
        
        // Obtiene el nombre de la sección a la que se debe desplazar
        const tab = $(this).data('tab');
        // Llama a la función para desplazarse a la sección
        scrollToSection(tab);
    });

    // Valida los campos de texto y email al perder el foco (cuando el usuario hace clic fuera del campo)
    $('input[type="text"], input[type="email"]').blur(function() {
        validateInput(this);
    });

    // Formatea el número de teléfono en tiempo real mientras el usuario escribe
    $('#personalPhone').on('input', function() {
        formatPhoneNumber(this);
    });

    // Formatea el número de tarjeta en tiempo real
    $(document).on('input', 'input[name="cardNumber"]', function() {
        formatCardNumber(this);
    });

    // Formatea la fecha de vencimiento en tiempo real
    $(document).on('input', 'input[name="expiryDate"]', function() {
        formatExpiryDate(this);
    });

    // Valida el CVV
    $(document).on('input', 'input[name="cvv"]', function() {
        // Elimina cualquier caracter que no sea un dígito y limita la longitud a 3
        this.value = this.value.replace(/\D/g, '').substring(0, 3);
    });
}

// Función principal de validación de entradas
function validateInput(input) {
    const value = input.value.trim(); // Elimina espacios en blanco al inicio y final
    const name = input.name || input.id; // Obtiene el nombre o ID del campo
    clearValidation(input); // Limpia cualquier validación previa
    
    // Si el campo está vacío, muestra un mensaje de error y retorna falso
    if (value === '') {
        showValidationError(input, `El campo ${getFieldDisplayName(name)} es requerido`);
        return false;
    }
    
    // Usa una estructura switch para validar campos específicos según su nombre
    switch(name) {
        case 'personalPhone':
            return validatePhoneNumber(input);
        case 'userEmail':
            return validateEmail(input);
        case 'cardNumber':
            return validateCardNumber(input);
        case 'expiryDate':
            return validateExpiryDate(input);
        case 'cvv':
            return validateCVV(input);
        default:
            // Si el campo no tiene una validación específica, se considera válido
            showValidationSuccess(input);
            return true;
    }
}

// Función para validar el formato del número de teléfono
function validatePhoneNumber(input) {
    const phoneRegex = /^\d{4}-\d{4}-\d{2}$/; // Expresión regular para el formato
    if (!phoneRegex.test(input.value)) {
        showValidationError(input, 'El formato del teléfono debe ser 5555-5555-55');
        return false;
    }
    showValidationSuccess(input);
    return true;
}

// Función para validar el formato del correo electrónico
function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para el formato
    if (!emailRegex.test(input.value)) {
        showValidationError(input, 'El formato del email no es válido');
        return false;
    }
    showValidationSuccess(input);
    return true;
}

// Función para validar el formato del número de tarjeta
function validateCardNumber(input) {
    const cardRegex = /^\d{4}-\d{4}-\d{4}-\d{4}$/; // Expresión regular para el formato
    if (!cardRegex.test(input.value)) {
        showValidationError(input, 'El formato de la tarjeta debe ser 5555-5555-5555-5555');
        return false;
    }
    showValidationSuccess(input);
    return true;
}

// Función para validar el formato de la fecha de vencimiento
function validateExpiryDate(input) {
    const dateRegex = /^\d{2}\/\d{2}$/; // Expresión regular para el formato
    if (!dateRegex.test(input.value)) {
        showValidationError(input, 'El formato de la fecha debe ser MM/AA');
        return false;
    }
    
    const [month, year] = input.value.split('/');
    const monthNum = parseInt(month);
    
    if (monthNum < 1 || monthNum > 12) {
        showValidationError(input, 'El mes debe estar entre 01 y 12');
        return false;
    }
    
    showValidationSuccess(input);
    return true;
}

// Función para validar el formato del CVV
function validateCVV(input) {
    if (input.value.length !== 3) {
        showValidationError(input, 'El CVV debe tener 3 dígitos');
        return false;
    }
    showValidationSuccess(input);
    return true;
}

// Muestra un mensaje de error de validación
function showValidationError(input, message) {
    $(input).addClass('is-invalid'); // Agrega la clase de Bootstrap para indicar error
    
    let feedback = $(input).siblings('.invalid-feedback');
    if (feedback.length === 0) { // Si no existe el elemento de feedback, lo crea
        feedback = $('<div class="invalid-feedback"></div>');
        $(input).after(feedback);
    }
    feedback.text(message); // Muestra el mensaje de error
}

// Muestra un mensaje de éxito de validación
function showValidationSuccess(input) {
    $(input).removeClass('is-invalid').addClass('is-valid'); // Remueve la clase de error y agrega la de éxito
    $(input).siblings('.invalid-feedback').remove(); // Elimina el mensaje de error si existe
    
    let feedback = $(input).siblings('.success-feedback');
    if (feedback.length === 0) { // Si no existe el elemento de feedback, lo crea
        feedback = $('<div class="success-feedback"></div>');
        $(input).after(feedback);
    }
    feedback.text('✓ Válido'); // Muestra el mensaje de éxito
}

// Limpia los estilos y mensajes de validación
function clearValidation(input) {
    $(input).removeClass('is-invalid is-valid'); // Remueve las clases de validación
    $(input).siblings('.invalid-feedback, .success-feedback').remove(); // Elimina los mensajes de feedback
}

// Traduce los nombres de los campos para mostrarlos en los mensajes de error
function getFieldDisplayName(fieldName) {
    const fieldNames = {
        'postalCode': 'Código Postal',
        'street': 'Calle',
        'number': 'Número',
        'interior': 'Número Interior',
        'personalName': 'Nombre',
        'personalLastName': 'Primer Apellido',
        'personalPhone': 'Celular',
        'userEmail': 'Correo',
        'holderName': 'Nombre del Titular',
        'holderLastName': 'Apellidos del Titular',
        'cardNumber': 'Número de Tarjeta',
        'expiryDate': 'Fecha de Vencimiento',
        'cvv': 'CVV/CVC',
        'newPassword': 'Nueva Contraseña',
        'confirmPassword': 'Confirmar Contraseña'
    };
    return fieldNames[fieldName] || fieldName;
}

// Formatea el número de teléfono con guiones
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, ''); // Elimina todo lo que no sea un dígito
    if (value.length >= 4 && value.length <= 8) {
        value = value.substring(0, 4) + '-' + value.substring(4);
    } else if (value.length > 8) {
        value = value.substring(0, 4) + '-' + value.substring(4, 8) + '-' + value.substring(8, 10);
    }
    input.value = value;
}

// Formatea el número de tarjeta con guiones
function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(.{4})/g, '$1-').replace(/-$/, '');
    if (value.length > 19) {
        value = value.substring(0, 19);
    }
    input.value = value;
}

// Formatea la fecha de vencimiento con una barra
function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
}

// Lógica para agregar y remover direcciones
let addressCount = 0; // Contador de direcciones
const maxAddresses = 5; // Límite máximo de direcciones

// Agrega un nuevo campo de dirección
function addAddress() {
    if (addressCount < maxAddresses) {
        addressCount++; // Incrementa el contador
    
        const container = document.getElementById('addressContainer');
        
        const newAddressDiv = document.createElement('div');
        newAddressDiv.className = 'address-block row mb-3';
        newAddressDiv.innerHTML = `
            <div class="col-md-6">
                <label>Dirección ${addressCount}:</label>
                <input type="text" class="form-control" placeholder="Calle, Número, Colonia">
            </div>
            <div class="col-md-3">
                <label>Ciudad:</label>
                <input type="text" class="form-control" placeholder="Ciudad">
            </div>
            <div class="col-md-3">
                <label>Código Postal:</label>
                <input type="text" class="form-control" placeholder="C.P.">
            </div>
        `;
        container.appendChild(newAddressDiv);
    } else {
        alert('Solo puedes agregar un máximo de 5 direcciones, Gracias por su comprensión');
    }
}

// Remueve el último campo de dirección
function removeAddress() {
    const container = document.getElementById('addressContainer');
    const lastAddress = container.lastElementChild;
    if (lastAddress) {
        container.removeChild(lastAddress);
        addressCount--;
    }
}

// Opcional: Agregar la primera dirección al cargar la página
document.addEventListener('DOMContentLoaded', (event) => {
    addAddress();
});

// Guarda una dirección específica
function saveAddress(id) {
    const addressItem = $(`.address-item[data-id="${id}"]`);
    const inputs = addressItem.find('input[type="text"]');
    let valid = true;
    
    // Valida cada campo de la dirección
    inputs.each(function() {
        if (!validateInput(this)) {
            valid = false;
        }
    });
    
    if (valid) {
        showAlert('success', 'Dirección guardada correctamente');
        
        // Agrega un estado de carga al botón
        const button = addressItem.find('button');
        const originalText = button.text();
        button.html('<span class="spinner"></span> Guardando...').prop('disabled', true);
        
        // Restaura el botón después de 1 segundo
        setTimeout(() => {
            button.text(originalText).prop('disabled', false);
        }, 1000);
    }
}

// Guarda los datos personales
function savePersonalData() {
    const name = $('#personalName');
    const lastName = $('#personalLastName');
    const phone = $('#personalPhone');
    
    let valid = true;
    // Valida cada campo de datos personales
    [name, lastName, phone].forEach(input => {
        if (!validateInput(input[0])) {
            valid = false;
        }
    });
    
    if (valid) {
        showAlert('success', 'Datos personales guardados correctamente');
        
        // Actualiza el nombre de usuario en el menú lateral
        $('#userName').text(name.val());
    }
}

// Actualiza la visualización del personaje seleccionado en el menú lateral
function updateSelectedCharacter() {
    const character = characters.find(c => c.id === selectedCharacter); // Busca el personaje en el array
    if (character) {
        // Actualiza el HTML para mostrar la imagen del personaje
        $('#selectedCharacterDisplay').html(`
            <img src="${character.img}" alt="${character.name}" style="width:90px; height:90px;">
        `);
    }
}

// Simula la acción de guardar el personaje
function saveCharacter() {
    showAlert('success', 'Personaje guardado correctamente, acabas de elegir al personaje favorito de Tu Localito');
}

// Agrega un nuevo formulario de método de pago
function addPaymentMethod() {
    paymentCounter++; // Incrementa el contador
    const newPaymentHTML = `
        <div class="payment-item border rounded p-3 mb-3 fade-in" data-id="${paymentCounter}">
            <div class="row mb-3">
                <div class="col-md-6">
                    <label>Nombre del titular:</label>
                    <input type="text" class="form-control" name="holderName" placeholder="Nombre">
                </div>
                <div class="col-md-6">
                    <label>Apellidos del titular:</label>
                    <input type="text" class="form-control" name="holderLastName" placeholder="Apellidos">
                </div>
                <div class="col-md-6">
                    <label>Número de tarjeta:</label>
                    <input type="text" class="form-control" name="cardNumber" placeholder="5555-5555-5555-5555">
                </div>
                <div class="col-md-3">
                    <label>Fecha de vencimiento:</label>
                    <input type="text" class="form-control" name="expiryDate" placeholder="MM/AA">
                </div>
                <div class="col-md-3">
                    <label>CVV/CVC:</label>
                    <input type="text" class="form-control" name="cvv" placeholder="***" maxlength="3">
                </div>
            </div>
            
            <button class="btn btn-primary" onclick="savePaymentData(${paymentCounter})">Guardar</button>
        </div>
    `;
    
    $('#paymentContainer').append(newPaymentHTML); // Agrega el nuevo HTML al contenedor
    showAlert('success', 'Nuevo método de pago agregado');
}

// Remueve el último método de pago
function removePaymentMethod() {
    const payments = $('.payment-item');
    if (payments.length > 1) { // Solo si hay más de uno
        const lastPayment = payments.last();
        lastPayment.addClass('fade-out'); // Agrega una animación de salida
        setTimeout(() => {
            lastPayment.remove();
        }, 500);
        showAlert('success', 'Método de pago eliminado');
    } else {
        showAlert('error', 'Debe mantener al menos un método de pago');
    }
}

// Guarda los datos de pago
function savePaymentData(id) {
    const paymentItem = $(`.payment-item[data-id="${id}"]`);
    const inputs = paymentItem.find('input[type="text"]');
    let valid = true;
    
    // Valida cada campo de pago
    inputs.each(function() {
        if (!validateInput(this)) {
            valid = false;
        }
    });
    
    if (valid) {
        showAlert('success', 'Datos de pago guardados correctamente');
        
        const button = paymentItem.find('button');
        const originalText = button.text();
        button.html('<span class="spinner"></span> Guardando...').prop('disabled', true);
        
        setTimeout(() => {
            button.text(originalText).prop('disabled', false);
        }, 1000);
    }
}

// Email y password
function saveEmail() {
    const emailInput = $('#userEmail')[0];
    if (validateInput(emailInput)) { // Valida el campo de email
        showAlert('success', 'Correo guardado correctamente');
    }
}

// Muestra u oculta el formulario de cambio de contraseña
function togglePasswordChange() {
    passwordChangeVisible = !passwordChangeVisible; // Invierte el estado de visibilidad
    const section = $('#passwordChangeSection');
    
    if (passwordChangeVisible) {
        section.slideDown(); // Muestra la sección con animación
    } else {
        section.slideUp(); // Oculta la sección con animación
        $('#newPassword, #confirmPassword').val(''); // Limpia los campos
    }
}

// Cambia la contraseña
function changePassword() {
    const newPassword = $('#newPassword');
    const confirmPassword = $('#confirmPassword');
    
    let valid = true;
    
    // Validaciones para la nueva contraseña
    if (newPassword.val().trim() === '') {
        showValidationError(newPassword[0], 'La nueva contraseña es requerida');
        valid = false;
    } else if (newPassword.val().length < 6) {
        showValidationError(newPassword[0], 'La contraseña debe tener al menos 6 caracteres');
        valid = false;
    } else {
        showValidationSuccess(newPassword[0]);
    }
    
    // Validaciones para la confirmación de la contraseña
    if (confirmPassword.val().trim() === '') {
        showValidationError(confirmPassword[0], 'Confirmar contraseña es requerido');
        valid = false;
    } else if (newPassword.val() !== confirmPassword.val()) {
        showValidationError(confirmPassword[0], 'Las contraseñas no coinciden');
        valid = false;
    } else {
        showValidationSuccess(confirmPassword[0]);
    }
    
    if (valid) {
        showAlert('success', 'Contraseña cambiada correctamente');
        newPassword.val('');
        confirmPassword.val('');
        clearValidation(newPassword[0]);
        clearValidation(confirmPassword[0]);
        togglePasswordChange(); // Oculta el formulario al finalizar
    }
}

// Elimina la cuenta (simulación)
function deleteAccount() {
    showConfirm( // Muestra un modal de confirmación
        '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
        function() {
            showAlert('success', 'Cuenta eliminada correctamente');
            
            // Redirige después de 2 segundos
            setTimeout(() => {
                window.location.href = '#';
            }, 2000);
        }
    );
}

// Cierra la sesión (simulación)
function logout() {
    showConfirm( // Muestra un modal de confirmación
        '¿Estás seguro de que deseas cerrar sesión?',
        function() {
            showAlert('success', 'Sesión cerrada correctamente');
            
            setTimeout(() => {
                window.location.href = '#';
            }, 2000);
        }
    );
}

// Muestra una alerta (success o error) en la parte superior de la página
function showAlert(type, message) {
    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
    const alertHTML = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="close" data-dismiss="alert">
                <span>&times;</span>
            </button>
        </div>
    `;
    
    $('.alert').remove(); // Remueve cualquier alerta existente
    
    $('body').prepend(alertHTML); // Agrega la nueva alerta al inicio del cuerpo de la página
    
    // Auto-cierra la alerta después de 5 segundos
    setTimeout(() => {
        $('.alert').alert('close');
    }, 5000);
}

// Muestra un modal de confirmación
function showConfirm(message, onConfirm) {
    $('#confirmModalBody').text(message); // Pone el mensaje en el cuerpo del modal
    $('#confirmModal').modal('show'); // Muestra el modal
    
    // Maneja el clic en el botón de confirmación
    $('#confirmButton').off('click').on('click', function() {
        $('#confirmModal').modal('hide'); // Oculta el modal
        onConfirm(); // Llama a la función que se pasa como parámetro
    });
}

// Desplaza la página a una sección específica
function scrollToSection(sectionName) {
    let target;
    // Determina el elemento de destino basado en el nombre de la sección
    switch(sectionName) {
        case 'direccion':
            target = $('.card').first();
            break;
        case 'pago':
            target = $('.card').eq(3); // Selecciona la cuarta tarjeta (índice 3)
            break;
        case 'correo':
            target = $('.card').eq(4); // Selecciona la quinta tarjeta (índice 4)
            break;
        default:
            return;
    }
    
    if (target.length) {
        // Anima el desplazamiento de la página
        $('html, body').animate({
            scrollTop: target.offset().top - 100 // Se desplaza 100px antes del inicio de la tarjeta
        }, 500);
    }
}

// Evita que el formulario se envíe por defecto
$('form').submit(function(e) {
    e.preventDefault(); // Previene el envío del formulario
    showAlert('success', 'Formulario procesado correctamente');
});

// Maneja los eventos de historial del navegador (popstate)
window.addEventListener('popstate', function(e) {
    // Esta función está vacía pero puede usarse para manejar la navegación con el botón "atrás" del navegador
});

// Funcionalidad de auto-guardado (opcional)
function enableAutoSave() {
    let autoSaveTimeout;
    
    // Detecta la entrada de datos en campos de texto y email
    $('input[type="text"], input[type="email"]').on('input', function() {
        clearTimeout(autoSaveTimeout); // Resetea el temporizador cada vez que hay una entrada
        autoSaveTimeout = setTimeout(() => {
            // Aquí se ejecutaría la lógica para guardar automáticamente los datos
            console.log('Auto-saving...');
        }, 2000); // Espera 2 segundos antes de "guardar"
    });
}