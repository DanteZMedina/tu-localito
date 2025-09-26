const inventario = [
  {
    departamento: "Alimentos",
    categorias: [
      {
        nombre: "Frutas",
        productos: [
          {
            id: 1,
            nombre: "Aguacate",
            categoria: "frutas",
            sku: "FR-001",
            cantidad: 30,
            unidad: "kilo",
            precio: 78.90,
            imagen: "https://i.ibb.co/MkG2DymQ/Aguacate.jpg"
          }
        ]
      },
      {
        nombre: "Verduras",
        productos: [
          { id: 2, nombre: "Verduras (General)", categoria: "Verduras", sku: "VE-001", cantidad: 50, unidad: "kilo", precio: 25.00, imagen: "https://i.ibb.co/QF7hfXfp/verduras.jpg" },
          { id: 3, nombre: "Calabaza", categoria: "Verduras", sku: "VE-002", cantidad: 40, unidad: "kilo", precio: 22.50, imagen: "https://i.ibb.co/1pTr8zy/Calabaza.jpg" },
          { id: 4, nombre: "Cebolla", categoria: "Verduras", sku: "VE-003", cantidad: 55, unidad: "kilo", precio: 22.00, imagen: "https://i.ibb.co/0RqFZrw7/Cebolla.jpg" },
          { id: 5, nombre: "Chile Verde", categoria: "Verduras", sku: "VE-004", cantidad: 60, unidad: "kilo", precio: 28.50, imagen: "https://i.ibb.co/1J7PfwrC/chile-verde.png" },
          { id: 6, nombre: "Jengibre", categoria: "Verduras", sku: "VE-005", cantidad: 20, unidad: "kilo", precio: 48.90, imagen: "https://i.ibb.co/99KqcN9G/Genjibre.jpg" }
        ]
      },
      {
        nombre: "Granel",
        productos: [
          { id: 7, nombre: "Productos a Granel", categoria: "Granel", sku: "GR-001", cantidad: 100, unidad: "kilo", precio: 34.00, imagen: "https://i.ibb.co/39GY3G8p/granel.jpg" }
        ]
      },
      {
        nombre: "Lácteos",
        productos: [
          { id: 8, nombre: "Leche", categoria: "Lacteos", sku: "LA-001", cantidad: 60, unidad: "litro", precio: 24.50, imagen: "https://i.ibb.co/5xJGPgMB/leche.jpg" }
        ]
      }
    ]
  },
  {
    departamento: "Abarrotes",
    categorias: [
      {
        nombre: "Enlatados",
        productos: [
          { id: 9, nombre: "Atún tuni", categoria: "Enlatados", sku: "AT-001", cantidad: 40, unidad: "pieza", precio: 18.90, imagen: "https://i.ibb.co/8Dw6qFz9/atun.png" },
          { id: 10, nombre: "Dolores", categoria: "Enlatados", sku: "AT-002", cantidad: 35, unidad: "pieza", precio: 19.50, imagen: "https://i.ibb.co/wr3HHfNx/atun-720x720.jpg" }
        ]
      },
      {
        nombre: "Basicos",
        productos: [
          { id: 11, nombre: "Nutrioli", categoria: "Basicos", sku: "BA-001", cantidad: 20, unidad: "litro", precio: 42.00, imagen: "https://i.ibb.co/MD5QgLtG/aceite-720x720.jpg" },
          { id: 12, nombre: "Frituras", categoria: "Basicos", sku: "BA-002", cantidad: 70, unidad: "Kilo", precio: 15.00, imagen: "https://i.ibb.co/d4K3WT5k/frituras.png" },
          { id: 13, nombre: "Frituras premium", categoria: "Basicos", sku: "BA-003", cantidad: 80, unidad: "pieza", precio: 16.00, imagen: "https://i.ibb.co/CpHGgTFZ/frituras-720x720.jpg" },
          { id: 14, nombre: "Oreo", categoria: "Basicos", sku: "BA-004", cantidad: 90, unidad: "pieza", precio: 12.00, imagen: "https://i.ibb.co/DfrK6cmC/galleta-720x720.jpg" },
          { id: 15, nombre: "Pan", categoria: "Basicos", sku: "BA-005", cantidad: 40, unidad: "pieza", precio: 18.00, imagen: "https://i.ibb.co/p5kMPP0/pan.png" },
          { id: 16, nombre: "Pan premium", categoria: "Basicos", sku: "BA-006", cantidad: 45, unidad: "pieza", precio: 20.00, imagen: "https://i.ibb.co/39czrxFt/pan-720x720.jpg" }
        ]
      }
    ]
  },
  {
    departamento: "Productos de limpieza",
    categorias: [
      {
        nombre: "Jabón",
        productos: [
          { id: 17, nombre: "Zest", categoria: "Jabon", sku: "JA-001", cantidad: 100, unidad: "pieza", precio: 10.00, imagen: "https://i.ibb.co/ds245sw5/jabones.png" }
        ]
      },
      {
        nombre: "Detergentes",
        productos: [
          { id: 18, nombre: "Casablanca", categoria: "Detergentes", sku: "DE-001", cantidad: 100, unidad: "pieza", precio: 10.00, imagen: "https://i.ibb.co/LDn7cq3m/Detergente-720x720.jpg" },
          { id: 19, nombre: "La foquita", categoria: "Detergentes", sku: "DE-002", cantidad: 80, unidad: "pieza", precio: 12.00, imagen: "https://i.ibb.co/LDn7cq3m/Detergente-720x720.jpg" },
          { id: 20, nombre: "Arial", categoria: "Detergentes", sku: "DE-003", cantidad: 120, unidad: "pieza", precio: 8.00, imagen: "https://i.ibb.co/LDn7cq3m/Detergente-720x720.jpg" },
          { id: 21, nombre: "Ace", categoria: "Detergentes", sku: "DE-003", cantidad: 60, unidad: "kilo", precio: 45.00, imagen: "https://i.ibb.co/LDn7cq3m/Detergente-720x720.jpg" }
        ]
      }
    ]
  },
  {
    departamento: "Cuidado personal",
    categorias: [
      {
        nombre: "Shampoo",
        productos: [
          { id: 22, nombre: "Head & Shoulder", categoria: "shampoo", sku: "SH-001", cantidad: 50, unidad: "litro", precio: 55.00, imagen: "https://i.ibb.co/LzBrBBP9/shampo-720x720.jpg" }
        ]
      },
      {
        nombre: "Papel de baño",
        productos: [
          { id: 23, nombre: "Regio", categoria: "Papel", sku: "PA-003", cantidad: 75, unidad: "pieza", precio: 30.00, imagen: "https://i.ibb.co/FLm7VYG2/papel-de-ba-o-720x720.jpg" }
        ]
      },
      {
        nombre: "Toallas femeninas",
        productos: [
          { id: 24, nombre: "Saba", categoria: "Toallas femeninas", sku: "TO-001", cantidad: 40, unidad: "pieza", precio: 35.00, imagen: "https://i.ibb.co/zWVHKPTt/toallas-femeninas.png" },
          { id: 25, nombre: "Saba premium", categoria: "Toallas femeninas", sku: "TO-001", cantidad: 40, unidad: "pieza", precio: 35.00, imagen: "https://i.ibb.co/yBsC7DNZ/toallas-femeninas-720x720.jpg" }
        ]
      },
      {
        nombre: "Desodorante",
        productos: [
          { id: 26, nombre: "Rexona", categoria: "Desodorante", sku: "DE-002", cantidad: 55, unidad: "pieza", precio: 28.00, imagen: "https://i.ibb.co/VYrS4YT8/desodorante.png" },
          { id: 27, nombre: "Axe", categoria: "Desodorante", sku: "DE-003", cantidad: 60, unidad: "pieza", precio: 30.00, imagen: "https://i.ibb.co/zKXF4Bb/desodorante-720x720.jpg" }
        ]
      }
    ]
  },
  {
    departamento: "Mascotas",
    categorias: [
      {
        nombre: "Croquetas",
        productos: [
          { id: 28, nombre: "Pedigree granel", categoria: "Croquetas", sku: "CR-001", cantidad: 25, unidad: "kilo", precio: 95.00, imagen: "https://i.ibb.co/Y4mwW8b6/croquetas-720x720.jpg" }
        ]
      },
      {
        nombre: "Juguetes",
        productos: [
          { id: 29, nombre: "Premios", categoria: "Juguetes", sku: "JU-001", cantidad: 15, unidad: "pieza", precio: 60.00, imagen: "https://i.ibb.co/XxRdybM5/juguetes-de-perro.png" },
          { id: 30, nombre: "Mini premios", categoria: "Juguetes", sku: "JU-002", cantidad: 20, unidad: "pieza", precio: 65.00, imagen: "https://i.ibb.co/TsfP9JP/juguete-de-perro-720x720.jpg" }
        ]
      },
      {
        nombre: "Accesorios",
        productos: [
          { id: 31, nombre: "Collar para perro", categoria: "Accesorios", sku: "AC-002", cantidad: 12, unidad: "pieza", precio: 80.00, imagen: "https://i.ibb.co/gb2ppftf/accesorio-de-perro-720x720.jpg" }
        ]
      }
    ]
  }
];


// Generar siguiente id
function nextProductId() {
  return products.length
    ? Math.max(...products.map(p => Number(p.id) || 0)) + 1
    : 1;
}

// Agregar producto con id autoincremental
function addProduct(productData) {
  const product = { ...productData, id: nextProductId() };
  products.push(product);
  return product;
}

// ✅ Obtener copia de productos (para evitar mutar desde fuera)
function getProducts() {
  return [...products]; // spread devuelve un nuevo array
}

export { inventario, addProduct, getProducts };
