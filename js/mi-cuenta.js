// Global variables
let addressCounter = 1;
let paymentCounter = 1;
let selectedCharacter = 4;
let passwordChangeVisible = false;

// Character 
const characters = [
    { id: 1, img: './img/tomate.png', name: 'tomate' },
    { id: 2, img: './img/zanahoria.png', name: 'zanahoria' },
    { id: 3, img: './img/mango.png', name: 'mango' },
    { id: 4, img: './img/uva.png', name: 'uva' },
    { id: 5, img: './img/pera.png', name: 'pera' },
    { id: 6, img: './img/cereza.png', name: 'cereza' },
    { id: 7, img: './img/limon.png', name: 'limon' }
];


$(document).ready(function() {
    initializeEventListeners();
    updateSelectedCharacter();
});

function initializeEventListeners() {
 
    $('.character-btn').click(function() {
        $('.character-btn').removeClass('active');
        $(this).addClass('active');
        selectedCharacter = parseInt($(this).data('character'));
        updateSelectedCharacter();
    });

 
    $('.sidebar-link[data-tab]').click(function(e) {
        e.preventDefault();
        $('.sidebar-link').removeClass('active');
        $(this).addClass('active');
        
        const tab = $(this).data('tab');
        scrollToSection(tab);
    });

    $('input[type="text"], input[type="email"]').blur(function() {
        validateInput(this);
    });

  
    $('#personalPhone').on('input', function() {
        formatPhoneNumber(this);
    });


    $(document).on('input', 'input[name="cardNumber"]', function() {
        formatCardNumber(this);
    });

   
    $(document).on('input', 'input[name="expiryDate"]', function() {
        formatExpiryDate(this);
    });

    // CVV validation
    $(document).on('input', 'input[name="cvv"]', function() {
        this.value = this.value.replace(/\D/g, '').substring(0, 3);
    });
}


function validateInput(input) {
    const value = input.value.trim();
    const name = input.name || input.id;
    clearValidation(input);
    
    if (value === '') {
        showValidationError(input, `El campo ${getFieldDisplayName(name)} es requerido`);
        return false;
    }
    
   
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
            showValidationSuccess(input);
            return true;
    }
}

function validatePhoneNumber(input) {
    const phoneRegex = /^\d{4}-\d{4}-\d{2}$/;
    if (!phoneRegex.test(input.value)) {
        showValidationError(input, 'El formato del teléfono debe ser 5555-5555-55');
        return false;
    }
    showValidationSuccess(input);
    return true;
}

function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value)) {
        showValidationError(input, 'El formato del email no es válido');
        return false;
    }
    showValidationSuccess(input);
    return true;
}

function validateCardNumber(input) {
    const cardRegex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
    if (!cardRegex.test(input.value)) {
        showValidationError(input, 'El formato de la tarjeta debe ser 5555-5555-5555-5555');
        return false;
    }
    showValidationSuccess(input);
    return true;
}

function validateExpiryDate(input) {
    const dateRegex = /^\d{2}\/\d{2}$/;
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

function validateCVV(input) {
    if (input.value.length !== 3) {
        showValidationError(input, 'El CVV debe tener 3 dígitos');
        return false;
    }
    showValidationSuccess(input);
    return true;
}


function showValidationError(input, message) {
    $(input).addClass('is-invalid');
    
    let feedback = $(input).siblings('.invalid-feedback');
    if (feedback.length === 0) {
        feedback = $('<div class="invalid-feedback"></div>');
        $(input).after(feedback);
    }
    feedback.text(message);
}

function showValidationSuccess(input) {
    $(input).removeClass('is-invalid').addClass('is-valid');
    $(input).siblings('.invalid-feedback').remove();
    
    let feedback = $(input).siblings('.success-feedback');
    if (feedback.length === 0) {
        feedback = $('<div class="success-feedback"></div>');
        $(input).after(feedback);
    }
    feedback.text('✓ Válido');
}

function clearValidation(input) {
    $(input).removeClass('is-invalid is-valid');
    $(input).siblings('.invalid-feedback, .success-feedback').remove();
}

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

function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 4 && value.length <= 8) {
        value = value.substring(0, 4) + '-' + value.substring(4);
    } else if (value.length > 8) {
        value = value.substring(0, 4) + '-' + value.substring(4, 8) + '-' + value.substring(8, 10);
    }
    input.value = value;
}

function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(.{4})/g, '$1-').replace(/-$/, '');
    if (value.length > 19) {
        value = value.substring(0, 19);
    }
    input.value = value;
}

function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
}


function addAddress() {
    addressCounter++;
    const newAddressHTML = `
        <div class="address-item border rounded p-3 mb-3 fade-in" data-id="${addressCounter}">
            <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="defaultAddress${addressCounter}">
                <label class="form-check-label" for="defaultAddress${addressCounter}">
                    Fijar como dirección de envío
                </label>
            </div>
            <p class="text-muted small mb-3">Aquí se entregarán todos tus pedidos</p>
            
            <div class="row mb-3">
                <div class="col-md-3">
                    <label>Código Postal:</label>
                    <input type="text" class="form-control" name="postalCode" placeholder="11500">
                </div>
                <div class="col-md-3">
                    <label>Calle:</label>
                    <input type="text" class="form-control" name="street" placeholder="Calle">
                </div>
                <div class="col-md-3">
                    <label>Número:</label>
                    <input type="text" class="form-control" name="number" placeholder="Número">
                </div>
                <div class="col-md-3">
                    <label>Número Interior:</label>
                    <input type="text" class="form-control" name="interior" placeholder="Interior">
                </div>
            </div>
            
            <button class="btn btn-primary" onclick="saveAddress(${addressCounter})">Guardar</button>
        </div>
    `;
    
    $('#addressContainer').append(newAddressHTML);
    showAlert('success', 'Nueva dirección agregada');
}

function removeAddress() {
    const addresses = $('.address-item');
    if (addresses.length > 1) {
        const lastAddress = addresses.last();
        lastAddress.addClass('fade-out');
        setTimeout(() => {
            lastAddress.remove();
        }, 500);
        showAlert('success', 'Dirección eliminada');
    } else {
        showAlert('error', 'Debe mantener al menos una dirección');
    }
}

function saveAddress(id) {
    const addressItem = $(`.address-item[data-id="${id}"]`);
    const inputs = addressItem.find('input[type="text"]');
    let valid = true;
    
    inputs.each(function() {
        if (!validateInput(this)) {
            valid = false;
        }
    });
    
    if (valid) {
        showAlert('success', 'Dirección guardada correctamente');
        
        // Add loading state
        const button = addressItem.find('button');
        const originalText = button.text();
        button.html('<span class="spinner"></span> Guardando...').prop('disabled', true);
        
        setTimeout(() => {
            button.text(originalText).prop('disabled', false);
        }, 1000);
    }
}

function savePersonalData() {
    const name = $('#personalName');
    const lastName = $('#personalLastName');
    const phone = $('#personalPhone');
    
    let valid = true;
    [name, lastName, phone].forEach(input => {
        if (!validateInput(input[0])) {
            valid = false;
        }
    });
    
    if (valid) {
        showAlert('success', 'Datos personales guardados correctamente');
        
       
        $('#userName').text(name.val());
    }
}


function updateSelectedCharacter() {
  const character = characters.find(c => c.id === selectedCharacter);
  if (character) {
    $('#selectedCharacterDisplay').html(`
      <img src="${character.img}" alt="${character.name}" style="width:90px; height:90px;">
    `);
  }
}


function saveCharacter() {
    showAlert('success', 'Personaje guardado correctamente');
}


function addPaymentMethod() {
    paymentCounter++;
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
    
    $('#paymentContainer').append(newPaymentHTML);
    showAlert('success', 'Nuevo método de pago agregado');
}

function removePaymentMethod() {
    const payments = $('.payment-item');
    if (payments.length > 1) {
        const lastPayment = payments.last();
        lastPayment.addClass('fade-out');
        setTimeout(() => {
            lastPayment.remove();
        }, 500);
        showAlert('success', 'Método de pago eliminado');
    } else {
        showAlert('error', 'Debe mantener al menos un método de pago');
    }
}

function savePaymentData(id) {
    const paymentItem = $(`.payment-item[data-id="${id}"]`);
    const inputs = paymentItem.find('input[type="text"]');
    let valid = true;
    
    inputs.each(function() {
        if (!validateInput(this)) {
            valid = false;
        }
    });
    
    if (valid) {
        showAlert('success', 'Datos de pago guardados correctamente');
        
        // Add loading 
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
    if (validateInput(emailInput)) {
        showAlert('success', 'Correo guardado correctamente');
    }
}

function togglePasswordChange() {
    passwordChangeVisible = !passwordChangeVisible;
    const section = $('#passwordChangeSection');
    
    if (passwordChangeVisible) {
        section.slideDown();
    } else {
        section.slideUp();
        $('#newPassword, #confirmPassword').val('');
    }
}

function changePassword() {
    const newPassword = $('#newPassword');
    const confirmPassword = $('#confirmPassword');
    
    let valid = true;
    
    if (newPassword.val().trim() === '') {
        showValidationError(newPassword[0], 'La nueva contraseña es requerida');
        valid = false;
    } else if (newPassword.val().length < 6) {
        showValidationError(newPassword[0], 'La contraseña debe tener al menos 6 caracteres');
        valid = false;
    } else {
        showValidationSuccess(newPassword[0]);
    }
    
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
        togglePasswordChange();
    }
}


function deleteAccount() {
    showConfirm(
        '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
        function() {
            showAlert('success', 'Cuenta eliminada correctamente');
            
            setTimeout(() => {
                window.location.href = '#';
            }, 2000);
        }
    );
}


function logout() {
    showConfirm(
        '¿Estás seguro de que deseas cerrar sesión?',
        function() {
            showAlert('success', 'Sesión cerrada correctamente');
            
            setTimeout(() => {
                window.location.href = '#';
            }, 2000);
        }
    );
}


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
    

    $('.alert').remove();
    
    $('body').prepend(alertHTML);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        $('.alert').alert('close');
    }, 5000);
}

function showConfirm(message, onConfirm) {
    $('#confirmModalBody').text(message);
    $('#confirmModal').modal('show');
    
    $('#confirmButton').off('click').on('click', function() {
        $('#confirmModal').modal('hide');
        onConfirm();
    });
}

function scrollToSection(sectionName) {
    let target;
    switch(sectionName) {
        case 'direccion':
            target = $('.card').first();
            break;
        case 'pago':
            target = $('.card').eq(3); 
            break;
        case 'correo':
            target = $('.card').eq(4); 
            break;
        default:
            return;
    }
    
    if (target.length) {
        $('html, body').animate({
            scrollTop: target.offset().top - 100
        }, 500);
    }
}


$('form').submit(function(e) {
    e.preventDefault();
    showAlert('success', 'Formulario procesado correctamente');
});


window.addEventListener('popstate', function(e) {
    
});

// Auto-save functionality (optional)
function enableAutoSave() {
    let autoSaveTimeout;
    
    $('input[type="text"], input[type="email"]').on('input', function() {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
           
            console.log('Auto-saving...');
        }, 2000);
    });
}

