// ================= Importar productos =================
import { getProducts } from './catalogo-productos.js';

// Objeto carrito para guardar cantidades
let carrito = {};

// --- ESTADO GLOBAL DE LA APLICACIÓN ---
// Estas variables me ayudan a saber qué está pasando en la página
/*            Barra lateal */
let categoriaActiva = 'Todos';

const listaCategoriasEl = document.getElementById('lista-categorias');

/**
 * Con esta función, yo genero la lista de categorías en la barra lateral.
 */
function renderizarCategorias() {
    const nombresCategorias = {
        "Frutas": "🍎 Frutas", "Verduras": "🥕 Verduras", "Carnes Frías": "🍖 Carnes Frías",
        "Granel": "⚖️ Granel", "Lácteos": "🧀 Lácteos", "Bebidas": "🥤 Bebidas",
        "Limpieza": "🧼 Limpieza", "Mascotas": "🐾 Mascotas", "Abarrotes": "🥫 Abarrotes",
        "Cuidado Personal": "🧴 Cuidado Personal",
    };

    // 🔹 Aquí uso getProducts() en lugar de productos
    const productos = getProducts();
    const categorias = ['Todos', ...new Set(productos.map(p => p.categoria))];

    listaCategoriasEl.innerHTML = categorias.map(cat => `
        <li>
            <a href="#" class="${cat === 'Todos' ? 'active' : ''}" onclick="filtrarPorCategoria('${cat}', this)">
                ${nombresCategorias[cat] || '🛒 Todos'}
            </a>
        </li>
    `).join('');
}

/**
 * Con esta función, dibujo todos los productos en la pantalla.
 */
function renderizarProductos() {
    const productosAMostrar = categoriaActiva === 'Todos' ? productos : productos.filter(p => p.categoria === categoriaActiva);
    productosListaEl.innerHTML = productosAMostrar.map(crearProductoHTML).join('');
    actualizarResumen();
}
// --- FUNCIONES DE EVENTOS ---

/**
 * Esta función la uso para filtrar los productos cuando haces clic en una categoría.
 */
function filtrarPorCategoria(categoria, elemento) {
    document.querySelectorAll('#lista-categorias a').forEach(a => a.classList.remove('active'));
    elemento.classList.add('active');
    categoriaActiva = categoria;
    renderizarProductos();
}

function seguirComprando() {
    alert('🛍️ ¡Claro! Sigue explorando nuestros productos.');
    const linkTodos = document.querySelector('#lista-categorias a');
    if (linkTodos) {
        filtrarPorCategoria('Todos', linkTodos);
    }
}

// Selecciona el contenedor donde van las cards
const productsContainer = document.querySelector(
  ".col-md-9.col-lg-10 .row"
);

// Selecciona el contenedor de la paginación (de tu HTML)
const paginationContainer = document.querySelector(".pagination");

// ================= Config =================
const PAGE_SIZE = 10;
let currentPage = 1;

// ================= Render de productos =================
function renderProducts(page = 1) {
  const products = getProducts();
  const totalPages = Math.ceil(products.length / PAGE_SIZE);

  // Asegurar que la página esté dentro del rango
  if (page < 1) page = 1;
  if (page > totalPages) page = totalPages;

  currentPage = page;

  // Limpiar contenedor
  productsContainer.innerHTML = "";

  // Calcular rango de productos a mostrar
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageProducts = products.slice(start, end);

  // Renderizar cards
  pageProducts.forEach(prod => {
    const card = document.createElement("div");
    card.classList.add("col", "producto-card");
    card.setAttribute("data-category", prod.categoria);
    card.setAttribute("data-producto", prod.nombre.toLowerCase());

    card.innerHTML = `
      <div class="card h-100 text-center ">
        <img src="${prod.image}" class="card-img-top" alt="${prod.nombre}" id="catalogo_cards_image">
        <div class="card-body">
          <h5 class="card-title">${prod.nombre}</h5>
          <p class="card-text">$${prod.precio.toFixed(2)} / ${prod.unidad}</p>
          <div class="d-flex justify-content-center align-items-center gap-2">
            <button class="btn btn-sm btn-outline-danger rounded-circle minus-btn">-</button>
            <span class="cantidad">0</span>
            <button class="btn btn-sm btn-outline-success plus-btn">+</button>
          </div>
        </div>
      </div>
    `;

    productsContainer.appendChild(card);

    // Inicializar carrito
    carrito[prod.nombre.toLowerCase()] = 0;

    // Eventos + y -
    const minusBtn = card.querySelector(".minus-btn");
    const plusBtn = card.querySelector(".plus-btn");
    const cantidadEl = card.querySelector(".cantidad");
    let cantidad = 0;

    minusBtn.addEventListener("click", () => {
      if (cantidad > 0) {
        cantidad--;
        carrito[prod.nombre.toLowerCase()] = cantidad;
        cantidadEl.textContent = cantidad;
        console.log(carrito);
      }
    });

    plusBtn.addEventListener("click", () => {
      cantidad++;
      carrito[prod.nombre.toLowerCase()] = cantidad;
      cantidadEl.textContent = cantidad;
      console.log(carrito);
    });
  });

  // Renderizar paginación
  renderPagination(totalPages);
}

// ================= Render de paginación =================
function renderPagination(totalPages) {
  paginationContainer.innerHTML = "";

  // Botón Previous
  const prev = document.createElement("li");
  prev.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
  prev.innerHTML = `<a class="page-link" href="#">Previous</a>`;
  prev.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) renderProducts(currentPage - 1);
  });
  paginationContainer.appendChild(prev);

  // Números de páginas
  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement("li");
    pageItem.className = `page-item ${i === currentPage ? "active" : ""}`;
    pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    pageItem.addEventListener("click", (e) => {
      e.preventDefault();
      renderProducts(i);
    });
    paginationContainer.appendChild(pageItem);
  }

  // Botón Next
  const next = document.createElement("li");
  next.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
  next.innerHTML = `<a class="page-link" href="#">Next</a>`;
  next.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage < totalPages) renderProducts(currentPage + 1);
  });
  paginationContainer.appendChild(next);
}



// ================= Inicializa =================
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(1);
  renderizarCategorias();
  
});
