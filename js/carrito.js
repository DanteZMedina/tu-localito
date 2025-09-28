// --- DATOS INICIALES CON STOCK (Forma recomendada) ---
// Array que contiene la lista de todos los productos de la tienda.
const productos = [
    { id: 1, nombre: "Manzana Gala", precio: 45.50, unidad: "1kg", imagen: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=400", cantidad: 0, categoria: "Frutas" },
    { id: 2, nombre: "Plátano Chiapas", precio: 18.50, unidad: "1kg", imagen: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400", cantidad: 0, categoria: "Frutas" },
    { id: 3, nombre: "Mango Ataulfo", precio: 35.90, unidad: "1kg", imagen: "https://images.unsplash.com/photo-1587132975474-e0e0ac6df9c8?w=400", cantidad: 0, categoria: "Frutas" },
    { id: 4, nombre: "Aguacate", precio: 80.00,unidad: "50 pzas", imagen: "https://i.ibb.co/MkG2DymQ/Aguacate.jpg", cantidad: 0, categoria: "Frutas" },
    { id: 5, nombre: "Verduras (General)", precio: 25.00, unidad: "50 pzas", imagen: "https://i.ibb.co/QF7hfXfp/verduras.jpg", cantidad: 0, categoria: "Verduras" },
    { id: 6, nombre: "Calabaza", precio: 22.50, unidad: "1kg", imagen: "https://i.ibb.co/1pTr8zy/Calabaza.jpg", cantidad: 0, categoria: "Verduras" },
    { id: 7, nombre: "Cebolla", precio: 22.50, unidad: "1kg", imagen: "https://i.ibb.co/0RqFZrw7/Cebolla.jpg", cantidad: 0, categoria: "Verduras" },
    { id: 8, nombre: "Chile Verde", precio: 28.50, unidad: "1kg", imagen: "https://i.ibb.co/1J7PfwrC/chile-verde.png", cantidad: 0, categoria: "Frutas" },
    { id: 9, nombre: "Jengibre", precio: 48.90, unidad: "1kg", imagen: "https://i.ibb.co/99KqcN9G/Genjibre.jpg", cantidad: 0, categoria: "Frutas" },
    { id: 10, nombre: "Productos a Granel", precio: 37.00, unidad: "1kg", imagen: "https://i.ibb.co/39GY3G8p/granel.jpg.jpg", cantidad: 0, categoria: "Verduras" },
    { id: 11, nombre: "Leche", precio: 25.00, unidad: "1kg", imagen: "https://i.ibb.co/5xJGPgMB/leche.jpg", cantidad: 0, categoria: "Verduras" },
    { id: 12, nombre: "Atún Dolores", precio: 30.00, unidad: "pza", imagen: "https://i.ibb.co/8Dw6qFz9/atun.png", cantidad: 0, categoria: "Verduras" },
    { id: 13, nombre: "Atún", precio: 32.50, unidad: "1kg", imagen: "https://i.ibb.co/wr3HHfNx/atun-720x720.jpg", cantidad: 0, categoria: "Verduras" },
    { id: 14, nombre: "Aceite", precio: 85.00, unidad: "pqt", imagen: "", cantidad: 0, categoria: "Carnes Frías" },
    { id: 15, nombre: "Frituras", precio: 65.00, unidad: "pqt", imagen: "https://i.ibb.co/d4K3WT5k/frituras.png", cantidad: 0, categoria: "Carnes Frías" },
    { id: 16, nombre: "Fritura", precio: 120.00, unidad: "pqt", imagen: "https://i.ibb.co/CpHGgTFZ/frituras-720x720.jpg", cantidad: 0, categoria: "Carnes Frías" },
    { id: 17, nombre: "Galletas", precio: 32.00, unidad: "1kg", imagen: "https://i.ibb.co/DfrK6cmC/galleta-720x720.jpg", cantidad: 0, categoria: "Granel" },
    { id: 18, nombre: "Pan", precio: 40.00, unidad: "1kg", imagen: "https://i.ibb.co/p5kMPP0/pan.png", cantidad: 0, categoria: "Granel" },
    { id: 19, nombre: "Pan", precio: 28.00, unidad: "pza", imagen: "https://i.ibb.co/39czrxFt/pan-720x720.jpg", cantidad: 0, categoria: "Lácteos" },
    { id: 20, nombre: "Jabones", precio: 75.00, unidad: "pza", imagen: "https://i.ibb.co/ds245sw5/jabones.png", cantidad: 0, categoria: "Limpieza" },
    { id: 21, nombre: "Detergente", precio: 15.00, unidad: "pza", imagen: "https://i.ibb.co/LDn7cq3m/Detergente-720x720.jpg", cantidad: 0, categoria: "Lácteos" },
    { id: 22, nombre: "Detergente", precio: 35.00, unidad: "pza", imagen: "https://i.ibb.co/LDn7cq3m/Detergente-720x720.jpg", cantidad: 0, categoria: "Bebidas" },
    { id: 23, nombre: "Shampoo", precio: 60.50, unidad: "pza", imagen: "https://i.ibb.co/LzBrBBP9/shampo-720x720.jpg", cantidad: 0, categoria: "Personal" },
    { id: 24, nombre: "Papel de baño", precio: 52.00, unidad: "pza", imagen: "https://i.ibb.co/FLm7VYG2/papel-de-ba-o-720x720.jpg", cantidad: 0, categoria: "Limpieza" },
    { id: 25, nombre: "Escoba de Plástico", precio: 50.00, unidad: "pza", imagen: "https://i.ibb.co/zWVHKPTt/toallas-femeninas.png", cantidad: 0, categoria: "Limpieza" },
    { id: 26, nombre: "Toallas femeninas", precio: 65.00, unidad: "pza", imagen: "https://i.ibb.co/yBsC7DNZ/toallas-femeninas-720x720.jpg", cantidad: 0, categoria: "Limpieza" },
    { id: 27, nombre: "Desodorante", precio: 25.00, unidad: "pqt", imagen: "https://i.ibb.co/VYrS4YT8/desodorante.png", cantidad: 0, categoria: "Personal" },
    { id: 28, nombre: "Desodorante Rexona", precio: 20.00, unidad: "pza", imagen: "https://i.ibb.co/zKXF4Bb/desodorante-720x720.jpg", cantidad: 0, categoria: "Personal" },
    { id: 29, nombre: "Juguete Pelota para Perro", precio: 80.00, unidad: "pza", imagen: "https://i.ibb.co/XxRdybM5/juguetes-de-perro.png", cantidad: 0, categoria: "Mascotas" },
    { id: 30, nombre: "Collar para Gato", precio: 120.00, unidad: "pza", imagen: "https://", cantidad: 0, categoria: "Mascotas" },
    { id: 31, nombre: "Croquetas", precio: 350.00, unidad: "pqt", imagen: "https://i.ibb.co/Y4mwW8b6/croquetas-720x720.jpg", cantidad: 0, categoria: "Alimento para perro" },
    { id: 32, nombre: "Juguete de perro", precio: 22.50, unidad: "pza", imagen: "https://i.ibb.co/TsfP9JP/juguete-de-perro-720x720.jpgsssssss", cantidad: 0, categoria: "Mascotas" },
    { id: 33, nombre: "Accesorio de perro", precio: 18.00, unidad: "pza", imagen: "https://i.ibb.co/gb2ppftf/accesorio-de-perro-720x720.jpg", cantidad: 0, categoria: "Mascotas" },
    { id: 34, nombre: "Cereal Zucaritas 500g", precio: 65.00, unidad: "caja", imagen: "", cantidad: 0, categoria: "Abarrotes" },
    { id: 35, nombre: "Sopa La Moderna Fideos", precio: 8.00, unidad: "pqt", imagen: "", cantidad: 0, categoria: "Abarrotes" },
    { id: 36, nombre: "Aceite 1-2-3 1L", precio: 48.00, unidad: "pza", imagen: "", cantidad: 0, categoria: "Abarrotes" },
    { id: 37, nombre: "Frijoles La Sierra Bayos", precio: 19.00, unidad: "lata", imagen: "", cantidad: 0, categoria: "Abarrotes" },
    { id: 38, nombre: "Tortillas de Harina Tía Rosa", precio: 25.00, unidad: "pqt", imagen: "", cantidad: 0, categoria: "Abarrotes" },
    { id: 39, nombre: "Donitas Bimbo Espolvoreadas", precio: 24.00, unidad: "pqt", imagen: "", cantidad: 0, categoria: "Abarrotes" },
    { id: 40, nombre: "Pan Bimbo Blanco Grande", precio: 42.00, unidad: "pza", imagen: "", cantidad: 0, categoria: "Abarrotes" },
    { id: 41, nombre: "Café Nescafé Clásico 200g", precio: 95.00, unidad: "frasco", imagen: "", cantidad: 0, categoria: "Abarrotes" },
    { id: 42, nombre: "Tostadas Sanissimo", precio: 33.00, unidad: "pqt", imagen: "", cantidad: 0, categoria: "Abarrotes" },
    { id: 43, nombre: "Azúcar Zulka 1kg", precio: 38.00, unidad: "kg", imagen: "", cantidad: 0, categoria: "Abarrotes" },
    { id: 44, nombre: "Mayonesa McCormick 400g", precio: 40.00, unidad: "frasco", imagen: "", cantidad: 0, categoria: "Abarrotes" },
    { id: 45, nombre: "Shampoo Head & Shoulders", precio: 85.00, unidad: "pza", imagen: "", cantidad: 0, categoria: "Cuidado Personal" },
    { id: 46, nombre: "Toallas Femeninas Saba", precio: 50.00, unidad: "pqt", imagen: "", cantidad: 0, categoria: "Cuidado Personal" },
    { id: 47, nombre: "Papel de Baño Regio 4 rollos", precio: 38.00, unidad: "pqt", imagen: "", cantidad: 0, categoria: "Cuidado Personal" },
    { id: 48, nombre: "Jabón de Tocador Zest", precio: 15.00, unidad: "pza", imagen: "", cantidad: 0, categoria: "Cuidado Personal" },
    { id: 49, nombre: "Desodorante Axe Aerosol", precio: 70.00, unidad: "pza", imagen: "", cantidad: 0, categoria: "Cuidado Personal" },
    { id: 50, nombre: "Pasta de Dientes Colgate", precio: 30.00, unidad: "pza", imagen: "", cantidad: 0, categoria: "Cuidado Personal" },
    { id: 51, nombre: "Cepillos de Dientes Oral-B", precio: 55.00, unidad: "pqt", imagen: "", cantidad: 0, categoria: "Cuidado Personal" },
    { id: 52, nombre: "Crema Corporal Nivea", precio: 90.00, unidad: "pza", imagen: "", cantidad: 0, categoria: "Cuidado Personal" },
    { id: 53, nombre: "Acondicionador Pantene", precio: 78.00, unidad: "pza", imagen: "", cantidad: 0, categoria: "Cuidado Personal" },
    { id: 54, nombre: "Rastrillo Gillette", precio: 45.00, unidad: "pqt", imagen: "", cantidad: 0, categoria: "Cuidado Personal" },
];

// Asignación de un stock inicial a todos los productos.
productos.forEach(producto => producto.stock = 500);

// --- ESTADO GLOBAL DE LA APLICACIÓN ---
// Variable para controlar si la vista de administrador está activa.
let esAdmin = false;

// --- REFERENCIAS A ELEMENTOS DEL DOM ---
// Se guardan referencias a los elementos del DOM que se manipularán frecuentemente.
const productosListaEl = document.getElementById('productos-lista');
const subtotalValorEl = document.getElementById('subtotal-valor');
const envioValorEl = document.getElementById('envio-valor');
const totalValorEl = document.getElementById('total-valor');

// --- FUNCIONES DE RENDERIZADO Y LÓGICA DE LA INTERFAZ ---

/**
 * Genera el código HTML para una única tarjeta de producto.
 * @param {object} producto - El objeto del producto a renderizar.
 * @returns {string} El código HTML de la tarjeta del producto.
 */
function crearProductoHTML(producto) {
    const sinStock = producto.stock <= 0 && producto.cantidad === 0;
    const cantidadIgualAStock = producto.cantidad >= producto.stock;

    return `
        <div class="producto-card ${producto.cantidad > 0 ? 'en-carrito' : ''}">
            <div class="producto-detalles">
                <div class="producto-imagen" style="background-image: url('${producto.imagen}')"></div>
                <div class="producto-info-wrapper">
                    <div>
                        <h4 class="producto-nombre">${producto.nombre}</h4>
                        <p class="producto-precio">Precio: $${producto.precio.toFixed(2)} / ${producto.unidad}</p>
                        ${esAdmin ? `<p class="producto-stock admin-view">Disponibles: ${producto.stock}</p>` : ''}
                    </div>
                    <div class="controles-cantidad">
                        <button class="btn-cantidad" onclick="decrementarCantidad(${producto.id})" ${producto.cantidad === 0 ? 'disabled' : ''}>-</button>
                        <span class="cantidad-display">${producto.cantidad}</span>
                        <button class="btn-cantidad" onclick="incrementarCantidad(${producto.id})" ${cantidadIgualAStock || sinStock ? 'disabled' : ''}>+</button>
                    </div>
                </div>
            </div>
            <button class="btn-eliminar" onclick="eliminarProducto(${producto.id})">
                <i class="bi bi-trash-fill"></i>
            </button>
        </div>
    `;
}

/**
 * Renderiza (dibuja) todos los productos en la interfaz.
 */
function renderizarProductos() {
    productosListaEl.innerHTML = productos.map(crearProductoHTML).join('');
    actualizarResumen(); // Se actualiza el resumen cada vez que se redibujan los productos.
}

/**
 * Calcula y actualiza los valores del resumen de compra.
 */
function actualizarResumen() {
    const subtotal = productos.reduce((total, p) => total + (p.precio * p.cantidad), 0);
    const costoEnvio = 50.00;
    const total = subtotal + (subtotal > 0 ? costoEnvio : 0);

    subtotalValorEl.textContent = `$${subtotal.toFixed(2)}`;
    envioValorEl.textContent = `$${costoEnvio.toFixed(2)}`;
    totalValorEl.textContent = `$${total.toFixed(2)}`;
}

// --- FUNCIONES DE EVENTOS ---

/**
 * Agrega un nuevo producto al array 'productos' desde un objeto JSON.
 * @param {object} productoJson - El objeto con la estructura {'name', 'img', 'description'}.
 */
function agregarProducto(productoJson) {
    if (!productoJson || !productoJson.name || !productoJson.img || !productoJson.description) {
        console.error("El formato del producto JSON no es válido.");
        return;
    }

    // Se calcula un ID único para el nuevo producto.
    const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;

    // Se adapta el objeto JSON a la estructura de la aplicación.
    const nuevoProducto = {
        id: nuevoId,
        nombre: `${productoJson.name} - ${productoJson.description}`,
        precio: 25.00, // Se asigna un precio por defecto.
        unidad: "pza", // Se asigna una unidad por defecto.
        imagen: productoJson.img,
        cantidad: 0,
        categoria: 'Abarrotes',
        stock: 500
    };

    productos.push(nuevoProducto);
}


/**
 * Incrementa la cantidad de un producto.
 * @param {number} id - El ID del producto.
 */
function incrementarCantidad(id) {
    const producto = productos.find(p => p.id === id);
    if (producto && producto.cantidad < producto.stock) {
        producto.cantidad++;
        renderizarProductos();
    }
}

/**
 * Decrementa la cantidad de un producto.
 * @param {number} id - El ID del producto.
 */
function decrementarCantidad(id) {
    const producto = productos.find(p => p.id === id);
    if (producto && producto.cantidad > 0) {
        producto.cantidad--;
        renderizarProductos();
    }
}

/**
 * Elimina un producto del carrito (resetea su cantidad a 0).
 * @param {number} id - El ID del producto.
 */
function eliminarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (producto && producto.cantidad > 0) {
        if (confirm(`¿Estás seguro de que deseas eliminar "${producto.nombre}" del carrito?`)) {
            producto.cantidad = 0;
            renderizarProductos();
        }
    }
}

/**
 * Maneja el evento del botón de cerrar.
 */
function cerrarCarrito() {
    if (confirm('¿Estás seguro de que deseas cerrar esto,recuerda que no podrás deshacer esta acción?')) {
        alert('🏠 Redirigiendo a la página principal...');
    }
}

/**
 * Procesa la compra, descuenta el stock y limpia el carrito.
 */
function finalizarCompra() {
    const productosEnCarrito = productos.filter(p => p.cantidad > 0);
    if (productosEnCarrito.length === 0) {
        alert('Tu carrito está vacío, por favor agrega algunos productos.');
        return;
    }

    // Genera el resumen de la compra para el cliente.
    let mensajeResumen = '🛒 RESUMEN DE TU COMPRA 🛒\n\n';
    productosEnCarrito.forEach(p => {
        mensajeResumen += `• ${p.nombre}: ${p.cantidad} ${p.unidad} x $${p.precio.toFixed(2)}\n`;
    });
    mensajeResumen += `\nTOTAL: ${totalValorEl.textContent}\n\n`;

    // Si el modo admin está activo, genera un reporte de stock.
    if (esAdmin) {
        let mensajeReporteStock = '📊 REPORTE DE STOCK PARA SERVIDOR 📊\n\n';
        productosEnCarrito.forEach(p => {
            p.stock -= p.cantidad; // Descuenta el stock.
            mensajeReporteStock += `• ${p.nombre}: Se vendieron ${p.cantidad}, quedan ${p.stock}\n`;
        });
        mensajeResumen += mensajeReporteStock;
    } else {
        productosEnCarrito.forEach(p => {
            p.stock -= p.cantidad;
        });
    }

    alert(mensajeResumen + '¡Gracias por tu compra,esperamos tu visita pronto a Tu Localito! 😊');

    // Limpia el carrito.
    productosEnCarrito.forEach(p => p.cantidad = 0);
    renderizarProductos();
}

/**
 * Maneja el evento del botón de seguir comprando.
 */
function seguirComprando() {
    alert('🛍️ ¡Claro! Sigue explorando nuestros productos.');
}

// --- INICIALIZACIÓN ---
// Código que se ejecuta una vez que el contenido del DOM ha cargado.
document.addEventListener('DOMContentLoaded', () => {
    
    // Configura el listener para el interruptor de modo admin.
    const adminToggle = document.getElementById('admin-mode-toggle');
    adminToggle.addEventListener('change', () => {
        esAdmin = adminToggle.checked;
        renderizarProductos();
    });

    // Agrega un producto de ejemplo al cargar la página.
    const taytoChips = {
        'name': 'Tayto',
        'img': 'https://www.irishtimes.com/polopoly_fs/1.4078148!/image/image.jpg',
        'description': 'Cheese & Onion Chips'
    };
    agregarProducto(taytoChips);

    // Renderiza la lista inicial de productos.
    renderizarProductos();
});