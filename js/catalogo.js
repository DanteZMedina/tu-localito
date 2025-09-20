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