$(document).ready(function() {

    // =============================================
    // 1. ESTADO DE LA APLICACIÓN
    // Aquí definí todas las variables que guardan la información "viva" de la página.
    // =============================================
    let usuarioActual = null;
    let articulosCarrito = [];
    let indiceRecetaActual = 0;

    // NOTA EQUIPO DINAMITA: Estos datos están "hardcodeados" para la demostración.
    // En el futuro, debemos reemplazar esto con llamadas a una API real.
    const baseDeDatosUsuarios = [
        { email: "test@correo.com", password: "123" }
    ];
    const recetas = [
        { id: 1, name: "Pasta Italiana con Tomate", image: "https://images.unsplash.com/photo-1566045023250-ccb8bb717880", ingredients: [{ name: "Pasta Spaghetti 500g", price: 32.00 }, { name: "Salsa de Tomate 400g", price: 28.00 }, { name: "Queso Parmesano 100g", price: 45.00 }] },
        { id: 2, name: "Pizza Margherita Casera", image: "https://images.unsplash.com/photo-1614936686354-a490b8d90478", ingredients: [{ name: "Harina para Pizza 1kg", price: 35.00 }, { name: "Salsa de Tomate 350g", price: 42.00 }, { name: "Queso Mozzarella 400g", price: 78.00 }] },
        { id: 3, name: "Ensalada César Completa", image: "https://images.unsplash.com/photo-1626266799007-f85d48ef3f05", ingredients: [{ name: "Lechuga Romana (2)", price: 38.00 }, { name: "Pechuga de Pollo 500g", price: 85.00 }, { name: "Aderezo César 236ml", price: 45.00 }] },
        { id: 4, name: "Sopa de Tomate Cremosa", image: "https://images.unsplash.com/photo-1512003867696-6d5ce6835040", ingredients: [{ name: "Tomates Rojos 1kg", price: 42.00 }, { name: "Cebolla Blanca 500g", price: 18.00 }, { name: "Crema para Batir 200ml", price: 35.00 }] },
        { id: 5, name: "Pollo al Horno con Especias", image: "https://images.unsplash.com/photo-1544378730-5e409d0e649e", ingredients: [{ name: "Pollo Entero 1.5kg", price: 125.00 }, { name: "Papas Cambray 1kg", price: 28.00 }, { name: "Especias para Pollo 50g", price: 32.00 }] },
        { id: 6, name: "Pastel de Chocolate Casero", image: "https://images.unsplash.com/photo-1685343670888-a3d92dd0e241", ingredients: [{ name: "Harina de Trigo 1kg", price: 32.00 }, { name: "Chocolate en Polvo 400g", price: 58.00 }, { name: "Huevos (6)", price: 36.00 }] },
        { id: 7, name: "Arroz con Pollo Tradicional", image: "https://images.unsplash.com/photo-1710091691771-96b2e6d17dac", ingredients: [{ name: "Arroz Blanco 1kg", price: 35.00 }, { name: "Pollo en Piezas 1kg", price: 95.00 }, { name: "Zanahoria 500g", price: 15.00 }] },
        { id: 8, name: "Pan Casero Integral", image: "https://images.unsplash.com/photo-1734988761778-911b94c06373", ingredients: [{ name: "Harina Integral 1kg", price: 48.00 }, { name: "Levadura Fresca 25g", price: 15.00 }, { name: "Miel de Abeja 350g", price: 95.00 }] },
        { id: 9, name: "Pescado a la Plancha", image: "https://images.unsplash.com/photo-1546970361-407ddc8053fc", ingredients: [{ name: "Filete de Pescado 800g", price: 180.00 }, { name: "Limones Amarillos (4)", price: 18.00 }, { name: "Espárragos 400g", price: 65.00 }] },
        { id: 10, name: "Tacos de Carne Asada", image: "https://images.unsplash.com/photo-1707603571504-86c1ea50903e", ingredients: [{ name: "Tortillas de Maíz (1kg)", price: 22.00 }, { name: "Carne para Asar 1kg", price: 220.00 }, { name: "Salsa Verde 250ml", price: 18.00 }] },
        { id: 11, name: "Smoothie Verde Detox", image: "https://images.unsplash.com/photo-1723245326663-451ff80f21c7", ingredients: [{ name: "Espinacas Orgánicas 200g", price: 45.00 }, { name: "Plátanos (4)", price: 25.00 }, { name: "Yogurt Griego 900g", price: 85.00 }] }
    ];
    const recetaBasica = [
        { name: "Pasta Espagueti 500g", price: 28.00 },
        { name: "Carne Molida para albóndigas 500g", price: 85.00 },
        { name: "Salsa de Tomate para pasta 350g", price: 35.00 },
        { name: "Queso Parmesano Rallado 200g", price: 42.80 }
    ];


    // =============================================
    // 2. CACHÉ DE ELEMENTOS DEL DOM
    // Para no buscar los mismos elementos una y otra vez, los guardo en variables.
    // =============================================
    const $recipeImage = $('#recipeImage'), $recipeName = $('#recipeName'), $recipeCounter = $('#recipeCounter');
    const $ingredientsList = $('#ingredientsList'), $totalPrice = $('#totalPrice');
    const $basicIngredientsList = $('#basicIngredientsList'), $basicRecipeTotal = $('#basicRecipeTotal');
    const $cartCount = $('#cart-count'), $userSection = $('#user-section');
    const $authModal = $('#authModal'), $loginForm = $('#loginForm'), $registerForm = $('#registerForm'), $authModalTitle = $('#authModalTitle');
    const $messageAlert = $('#message-alert');
    const $videoModal = $('#videoModal'), $youtubeIframe = $('#youtube-video-iframe');

    // =============================================
    // 3. FUNCIONES
    // Aquí agrupo toda la lógica principal en funciones reutilizables.
    // =============================================
    function renderizarReceta() { const receta = recetas[indiceRecetaActual]; $recipeImage.attr('src', receta.image); $recipeName.text(receta.name); $recipeCounter.text(`${indiceRecetaActual + 1} / ${recetas.length}`); $ingredientsList.empty(); receta.ingredients.forEach((ing, index) => { const id = `ing-${indiceRecetaActual}-${index}`; const itemHtml = `<div class="ingredient-item"><input type="checkbox" class="ingredient-checkbox mr-2" id="${id}" data-price="${ing.price}"><label for="${id}" class="ingredient-name mb-0 flex-grow-1">${ing.name}</label><span class="ingredient-price">$${ing.price.toFixed(2)}</span></div>`; $ingredientsList.append(itemHtml); }); actualizarPrecioTotalPrincipal(); }
    
    function popularRecetaBasica() { $basicIngredientsList.empty(); recetaBasica.forEach((ing, index) => { const id = `basic-ing-${index}`; const itemHtml = `<div class="d-flex justify-content-between align-items-center basic-ingredient-item mb-3"><div><input type="checkbox" class="basic-ingredient-checkbox mr-2" id="${id}" data-price="${ing.price}"><label for="${id}" class="mb-0">${ing.name}</label></div><span class="text-success font-weight-bold">$${ing.price.toFixed(2)}</span></div>`; $basicIngredientsList.append(itemHtml); }); actualizarTotalRecetaBasica(); }
    
    function actualizarPrecioTotalPrincipal() { let total = 0; $ingredientsList.find('.ingredient-checkbox:checked').each(function() { total += $(this).data('price'); }); $totalPrice.text(`$${total.toFixed(2)}`); }
    
    function actualizarTotalRecetaBasica() { let total = 0; $basicIngredientsList.find('.basic-ingredient-checkbox:checked').each(function() { total += $(this).data('price'); }); $basicRecipeTotal.text(`$${total.toFixed(2)}`); }
    
    function actualizarInterfazUsuario() { if (usuarioActual) { $userSection.html(`<div class="d-flex align-items-center"><span class="small text-muted mr-2">Hola, ${usuarioActual.email}</span><a href="#" id="logout-btn" class="btn btn-secondary btn-sm btn-hover">Salir</a></div>`); } else { $userSection.html(`<a href="#autenticacion" id="login-link" class="btn btn-celeste btn-hover"><i class="fas fa-user"></i> Ingresar</a>`); } }
    
    function actualizarContadorCarrito() { const numItems = articulosCarrito.length; if (numItems > 0) { $cartCount.text(numItems).removeClass('d-none'); } else { $cartCount.addClass('d-none'); } }
    
    function mostrarMensaje(tipo, mensaje) { $messageAlert.removeClass('alert-success alert-danger alert-warning alert-info').addClass(`alert-${tipo}`).find('#message-text').text(mensaje); $messageAlert.removeClass('d-none').addClass('show'); setTimeout(() => $messageAlert.removeClass('show').addClass('d-none'), 3000); }


    // =============================================
    // 4. MANEJADORES DE EVENTOS (BINDING)
    // Aquí conecto las acciones del usuario (clics, etc.) con mis funciones.
    // =============================================
    function bindEvents() {
        // --- Carrusel ---
        $('#nextRecipeBtn').on('click', () => { indiceRecetaActual = (indiceRecetaActual + 1) % recetas.length; renderizarReceta(); });
        $('#prevRecipeBtn').on('click', () => { indiceRecetaActual = (indiceRecetaActual - 1 + recetas.length) % recetas.length; renderizarReceta(); });

        // --- Autenticación y Modal ---
        $('#switchToRegister, #switchToLogin').on('click', function(e) { e.preventDefault(); $loginForm.toggleClass('d-none'); $registerForm.toggleClass('d-none'); $authModalTitle.text($authModalTitle.text() === 'Iniciar Sesión' ? 'Crear Cuenta' : 'Iniciar Sesión'); });
        $(document).on('click', '#logout-btn', (e) => { e.preventDefault(); usuarioActual = null; articulosCarrito = []; actualizarInterfazUsuario(); actualizarContadorCarrito(); mostrarMensaje('success', 'Has cerrado sesión.'); });
        $loginForm.on('submit', function(e) { e.preventDefault(); const email = $('#loginEmail').val(); const password = $('#loginPassword').val(); const u = baseDeDatosUsuarios.find(user => user.email === email && user.password === password); if (u) { usuarioActual = u; actualizarInterfazUsuario(); $authModal.modal('hide'); mostrarMensaje('success', `¡Bienvenido, ${u.email}!`); this.reset(); } else { mostrarMensaje('danger', 'Correo o contraseña incorrectos.'); } });
        $registerForm.on('submit', function(e) { e.preventDefault(); const email = $('#registerEmail').val(); const pass = $('#registerPassword').val(); if (pass !== $('#confirmPassword').val()) { mostrarMensaje('danger', 'Las contraseñas no coinciden.'); return; } if (baseDeDatosUsuarios.find(user => user.email === email)) { mostrarMensaje('danger', 'Este correo ya está registrado.'); return; } const newUser = { email, pass }; baseDeDatosUsuarios.push(newUser); usuarioActual = newUser; actualizarInterfazUsuario(); $authModal.modal('hide'); mostrarMensaje('success', '¡Cuenta creada! Has iniciado sesión.'); this.reset(); });

        // --- Lógica del Carrito ---
        $(document).on('change', '.ingredient-checkbox, .basic-ingredient-checkbox', function() { if ($(this).hasClass('ingredient-checkbox')) { actualizarPrecioTotalPrincipal(); } else { actualizarTotalRecetaBasica(); } });
        $('#cart-link').on('click', function(e) { e.preventDefault(); if (!usuarioActual) { mostrarMensaje('warning', 'Debes iniciar sesión para ver el carrito.'); $authModal.modal('show'); return; } if (articulosCarrito.length === 0) { mostrarMensaje('info', 'Tu carrito está vacío.'); return; } alert("Redirigiendo al carrito..."); });
        $('#addToCartBtn, #addBasicRecipeBtn').on('click', function() { if (!usuarioActual) { mostrarMensaje('warning', 'Debes iniciar sesión para comprar.'); $authModal.modal('show'); return; } const isBasic = $(this).is('#addBasicRecipeBtn'); const sourceList = isBasic ? recetaBasica : recetas[indiceRecetaActual].ingredients; const selector = isBasic ? '.basic-ingredient-checkbox:checked' : '.ingredient-checkbox:checked'; const sourceContainer = isBasic ? $basicIngredientsList : $ingredientsList; let itemsAgregados = 0; sourceContainer.find(selector).each(function(index) { articulosCarrito.push(sourceList[$(this).attr('id').split('-').pop()]); itemsAgregados++; }); if (itemsAgregados > 0) { mostrarMensaje('success', `${itemsAgregados} ítem(s) añadido(s).`); actualizarContadorCarrito(); } else { mostrarMensaje('warning', 'Selecciona al menos un ingrediente.'); } });
        
        // --- Lógica del Video Modal ---
        const videoUrl = "https://www.youtube.com/embed/tG4M5PH0scg";
        $(document).on('click', '.btn-play', () => $videoModal.modal('show'));
        $videoModal.on('show.bs.modal', () => $youtubeIframe.attr('src', videoUrl + "?autoplay=1"));
        $videoModal.on('hide.bs.modal', () => $youtubeIframe.attr('src', ''));
    }

    // =============================================
    // 5. INICIALIZACIÓN
    // Esta es mi función principal que arranca todo.
    // =============================================
    function inicializar() {
        renderizarReceta();
        popularRecetaBasica();
        actualizarInterfazUsuario();
        actualizarContadorCarrito();
        bindEvents(); // Aquí "conecto" todos los botones.
        console.log("Mi aplicación de recetas está cargada y lista. 🍽️");
    }

    
    inicializar();
});