// Objeto carrito para guardar cantidades
let carrito = {};

document.querySelectorAll(".producto-card").forEach(card => {
  const minusBtn = card.querySelector(".minus-btn");
  const plusBtn = card.querySelector(".plus-btn");
  const cantidadEl = card.querySelector(".cantidad");
  const producto = card.getAttribute("data-producto"); // nombre del producto
  let cantidad = 0;

  // Inicializar en el carrito
  carrito[producto] = 0;

  minusBtn.addEventListener("click", () => {
    if (cantidad > 0) {
      cantidad--;
      carrito[producto] = cantidad;
      cantidadEl.textContent = cantidad;
      console.log(carrito);
    }
  });

  plusBtn.addEventListener("click", () => {
    cantidad++;
    carrito[producto] = cantidad;
    cantidadEl.textContent = cantidad;
    console.log(carrito);
  });
});

// Cambio dinámico por categoría
document.querySelectorAll(".category-card").forEach(catCard => {
  catCard.addEventListener("click", () => {
    // Quitar "active" de todas
    document.querySelectorAll(".category-card").forEach(c => c.classList.remove("active"));
    catCard.classList.add("active");

    const selectedCategory = catCard.getAttribute("data-category");

    // Mostrar solo productos de esa categoría
    document.querySelectorAll(".producto-card").forEach(prod => {
      if (prod.getAttribute("data-category") === selectedCategory) {
        prod.style.display = "block";
      } else {
        prod.style.display = "none";
      }
    });
  });
});


/* ================================================================ */ 
/* Construcción de objetos con JS  */

const productos = [
    { id: 1, nombre: "Manzana Gala", precio: 45.50, imagen: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=400", cantidad: 0, categoria: "Frutas" },
    { id: 2, nombre: "Plátano Chiapas", precio: 18.50, imagen: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400", cantidad: 0, categoria: "Frutas" },
    { id: 3, nombre: "Mango Ataulfo", precio: 35.90, imagen: "https://images.unsplash.com/photo-1587132975474-e0e0ac6df9c8?w=400", cantidad: 0, categoria: "Frutas" },
    { id: 4, nombre: "Naranja Valencia", precio: 22.00, imagen: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400", cantidad: 0, categoria: "Frutas" },
    { id: 5, nombre: "Fresa (Caja)", precio: 55.00, imagen: "", cantidad: 0, categoria: "Frutas" },
    { id: 6, nombre: "Piña Miel", precio: 28.75, imagen: "", cantidad: 0, categoria: "Frutas" },
    { id: 7, nombre: "Limón con Semilla", precio: 24.90, imagen: "", cantidad: 0, categoria: "Frutas" },
    { id: 8, nombre: "Chayote sin espinas", precio: 37.00, imagen: "", cantidad: 0, categoria: "Verduras" },
    { id: 9, nombre: "Aguacate Hass", precio: 45.00, imagen: "", cantidad: 0, categoria: "Verduras" },
    { id: 10, nombre: "Brócoli", precio: 35.50, imagen: "", cantidad: 0, categoria: "Verduras" },
    { id: 11, nombre: "Zanahoria", precio: 25.00, imagen: "", cantidad: 0, categoria: "Verduras" },
    { id: 12, nombre: "Lechuga Romana", precio: 30.00, imagen: "", cantidad: 0, categoria: "Verduras" },
    { id: 13, nombre: "Tomate Saladet", precio: 32.50, imagen: "", cantidad: 0, categoria: "Verduras" },
    { id: 14, nombre: "Jamón de Pavo FUD", precio: 85.00, imagen: "h", cantidad: 0, categoria: "Carnes Frías" },
    { id: 15, nombre: "Salchicha de Pavo Sabori", precio: 65.00, imagen: "", cantidad: 0, categoria: "Carnes Frías" },
    { id: 16, nombre: "Pechuga de Pavo Zwan", precio: 120.00, imagen: "", cantidad: 0, categoria: "Carnes Frías" },
    { id: 17, nombre: "Arroz de Morelos (kg)", precio: 32.00, imagen: "", cantidad: 0, categoria: "Granel" },
    { id: 18, nombre: "Lentejas (kg)", precio: 40.00, imagen: "", cantidad: 0, categoria: "Granel" },
    { id: 19, nombre: "Leche Lala Entera 1L", precio: 28.00, imagen: "", cantidad: 0, categoria: "Lácteos" },
    { id: 20, nombre: "Queso Panela FUD 400g", precio: 75.00, imagen: "", cantidad: 0, categoria: "Lácteos" },
    { id: 21, nombre: "Yoghurt Yoplait Fresa", precio: 15.00, imagen: "", cantidad: 0, categoria: "Lácteos" },
    { id: 22, nombre: "Coca-Cola 2L", precio: 35.00, imagen: "", cantidad: 0, categoria: "Bebidas" },
    { id: 23, nombre: "Jugo de Naranja Jumex 1L", precio: 26.50, imagen: "", cantidad: 0, categoria: "Bebidas" },
    { id: 24, nombre: "Jabón Zote Rosa", precio: 22.00, imagen: "", cantidad: 0, categoria: "Limpieza" },
    { id: 25, nombre: "Escoba de Plástico", precio: 50.00, imagen: "", cantidad: 0, categoria: "Limpieza" },
    { id: 26, nombre: "Detergente Ariel 1kg", precio: 45.00, imagen: "", cantidad: 0, categoria: "Limpieza" },
    { id: 27, nombre: "Croquetas Pedigree Perro 4kg", precio: 350.00, imagen: "", cantidad: 0, categoria: "Mascotas" },
    { id: 28, nombre: "Croquetas Whiskas Gato 2kg", precio: 220.00, imagen: "", cantidad: 0, categoria: "Mascotas" },
    { id: 29, nombre: "Juguete Pelota para Perro", precio: 80.00, imagen: "", cantidad: 0, categoria: "Mascotas" },
    { id: 30, nombre: "Collar para Gato", precio: 120.00, imagen: "https://", cantidad: 0, categoria: "Mascotas" },
    { id: 31, nombre: "Galletas Marías Gamesa", precio: 20.00, imagen: "", cantidad: 0, categoria: "Abarrotes" },
    { id: 32, nombre: "Atún Dolores en Aceite", precio: 22.50, imagen: "", cantidad: 0, categoria: "Abarrotes" },
    { id: 33, nombre: "Frituras Sabritas Original", precio: 18.00, imagen: "", cantidad: 0, categoria: "Abarrotes" },
    { id: 34, nombre: "Cereal Zucaritas 500g", precio: 65.00, imagen: "", cantidad: 0, categoria: "Abarrotes" },
    { id: 35, nombre: "Sopa La Moderna Fideos", precio: 8.00, imagen: "", cantidad: 0, categoria: "Abarrotes" },
    { id: 36, nombre: "Aceite 1-2-3 1L", precio: 48.00, imagen: "", cantidad: 0, categoria: "Abarrotes" },
    { id: 37, nombre: "Frijoles La Sierra Bayos", precio: 19.00, imagen: "", cantidad: 0, categoria: "Abarrotes" },
    { id: 38, nombre: "Tortillas de Harina Tía Rosa", precio: 25.00, imagen: "", cantidad: 0, categoria: "Abarrotes" },
    { id: 39, nombre: "Donitas Bimbo Espolvoreadas", precio: 24.00, imagen: "", cantidad: 0, categoria: "Abarrotes" },
    { id: 40, nombre: "Pan Bimbo Blanco Grande", precio: 42.00, imagen: "", cantidad: 0, categoria: "Abarrotes" },
    { id: 41, nombre: "Café Nescafé Clásico 200g", precio: 95.00, imagen: "", cantidad: 0, categoria: "Abarrotes" },
    { id: 42, nombre: "Tostadas Sanissimo", precio: 33.00, imagen: "", cantidad: 0, categoria: "Abarrotes" },
    { id: 43, nombre: "Azúcar Zulka 1kg", precio: 38.00, imagen: "", cantidad: 0, categoria: "Abarrotes" },
    { id: 44, nombre: "Mayonesa McCormick 400g", precio: 40.00, imagen: "", cantidad: 0, categoria: "Abarrotes" },
    { id: 45, nombre: "Shampoo Head & Shoulders", precio: 85.00, imagen: "", cantidad: 0, categoria: "Cuidado Personal" },
    { id: 46, nombre: "Toallas Femeninas Saba", precio: 50.00, imagen: "", cantidad: 0, categoria: "Cuidado Personal" },
    { id: 47, nombre: "Papel de Baño Regio 4 rollos", precio: 38.00, imagen: "", cantidad: 0, categoria: "Cuidado Personal" },
    { id: 48, nombre: "Jabón de Tocador Zest", precio: 15.00, imagen: "", cantidad: 0, categoria: "Cuidado Personal" },
    { id: 49, nombre: "Desodorante Axe Aerosol", precio: 70.00, imagen: "", cantidad: 0, categoria: "Cuidado Personal" },
    { id: 50, nombre: "Pasta de Dientes Colgate", precio: 30.00, imagen: "", cantidad: 0, categoria: "Cuidado Personal" },
    { id: 51, nombre: "Cepillos de Dientes Oral-B", precio: 55.00, imagen: "", cantidad: 0, categoria: "Cuidado Personal" },
    { id: 52, nombre: "Crema Corporal Nivea", precio: 90.00, imagen: "", cantidad: 0, categoria: "Cuidado Personal" },
    { id: 53, nombre: "Acondicionador Pantene", precio: 78.00, imagen: "", cantidad: 0, categoria: "Cuidado Personal" },
    { id: 54, nombre: "Rastrillo Gillette", precio: 45.00, imagen: "", cantidad: 0, categoria: "Cuidado Personal" },
];
let categoriaActiva = 'Todos';
const listaCategoriasEl = document.getElementById('lista-categorias');

function renderizarCategorias() {
    const nombresCategorias = {
        "Frutas": "🍎 Frutas", "Verduras": "🥕 Verduras", "Carnes Frías": "🍖 Carnes Frías",
        "Granel": "⚖️ Granel", "Lácteos": "🧀 Lácteos", "Bebidas": "🥤 Bebidas",
        "Limpieza": "🧼 Limpieza", "Mascotas": "🐾 Mascotas", "Abarrotes": "🥫 Abarrotes",
        "Cuidado Personal": "🧴 Cuidado Personal",
    };
    const categorias = ['Todos', ...new Set(productos.map(p => p.categoria))];

    listaCategoriasEl.innerHTML = categorias.map(cat => `
        <li>
            <a href="#" class="${cat === 'Todos' ? 'active' : ''}" onclick="filtrarPorCategoria('${cat}', this)">
                ${nombresCategorias[cat] || '🛒 Todos'}
            </a>
        </li>
    `).join('');
}
/*
function renderizarProductos() {
    const productosAMostrar = categoriaActiva === 'Todos' ? productos : productos.filter(p => p.categoria === categoriaActiva);
    productosListaEl.innerHTML = productosAMostrar.map(crearProductoHTML).join('');
    actualizarResumen();
}
*/

document.addEventListener('DOMContentLoaded', () => {
    renderizarCategorias();
});
