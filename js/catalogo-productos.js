let products = [
  {
    id: 1,
    nombre: "Manzana",
    categoria: "frutas",
    sku: "FR-001",
    cantidad: 50,
    unidad: "kilo",
    precio: 35.90,
    image: "../img/Catalogo/apple.jpg"
  },
  {
    id: 2,
    nombre: "Plátano",
    categoria: "frutas",
    sku: "FR-002",
    cantidad: 80,
    unidad: "kilo",
    precio: 22.50,
    image: "../img/Catalogo/FRUTAS.png"
  },
  {
    id: 3,
    nombre: "Naranja",
    categoria: "frutas",
    sku: "FR-003",
    cantidad: 60,
    unidad: "kilo",
    precio: 28.00,
    image: "../img/Catalogo/FRUTAS.png"
  },
  {
    id: 4,
    nombre: "Mango",
    categoria: "frutas",
    sku: "FR-004",
    cantidad: 40,
    unidad: "kilo",
    precio: 42.90,
    image: "../img/Catalogo/FRUTAS.png"
  },
  {
    id: 5,
    nombre: "Uva",
    categoria: "frutas",
    sku: "FR-005",
    cantidad: 25,
    unidad: "kilo",
    precio: 75.00,
    image: "../img/Catalogo/FRUTAS.png"
  },
  {
    id: 6,
    nombre: "Pera",
    categoria: "frutas",
    sku: "FR-006",
    cantidad: 35,
    unidad: "kilo",
    precio: 55.00,
    image: "../img/Catalogo/FRUTAS.png"
  },
  {
    id: 7,
    nombre: "Sandía",
    categoria: "frutas",
    sku: "FR-007",
    cantidad: 20,
    unidad: "pieza",
    precio: 90.00,
    image: "../img/Catalogo/FRUTAS.png"
  },
  {
    id: 8,
    nombre: "Papaya",
    categoria: "frutas",
    sku: "FR-008",
    cantidad: 18,
    unidad: "pieza",
    precio: 65.00,
    image: "../img/Catalogo/FRUTAS.png"
  },
  {
    id: 9,
    nombre: "Kiwi",
    categoria: "frutas",
    sku: "FR-009",
    cantidad: 22,
    unidad: "kilo",
    precio: 58.90,
    image: "../img/Catalogo/FRUTAS.png"
  },
  {
    id: 10,
    nombre: "Aguacate",
    categoria: "frutas",
    sku: "FR-010",
    cantidad: 30,
    unidad: "kilo",
    precio: 78.90,
    image: "https://i.ibb.co/qYWyMLvV/Aguacate.jpg"
  },
  {
    id: 11,
    nombre: "Zanahoria",
    categoria: "verduras",
    sku: "VE-001",
    cantidad: 40,
    unidad: "kilo",
    precio: 18.00,
    image: "../img/Catalogo/vegetables.jpg"
  },
  {
    id: 12,
    nombre: "Papa",
    categoria: "verduras",
    sku: "VE-002",
    cantidad: 60,
    unidad: "kilo",
    precio: 25.00,
    image: "../img/Catalogo/vegetables.jpg"
  },
  {
    id: 13,
    nombre: "Cebolla",
    categoria: "verduras",
    sku: "VE-003",
    cantidad: 55,
    unidad: "kilo",
    precio: 22.00,
    image: "../img/Catalogo/vegetables.jpg"
  },
  {
    id: 14,
    nombre: "Tomate",
    categoria: "verduras",
    sku: "VE-004",
    cantidad: 70,
    unidad: "kilo",
    precio: 27.50,
    image: "../img/Catalogo/tomatoe.jpg"
  },
  {
    id: 15,
    nombre: "Pimiento",
    categoria: "verduras",
    sku: "VE-005",
    cantidad: 30,
    unidad: "kilo",
    precio: 48.90,
    image: "../img/Catalogo/vegetables.jpg"
  },
  {
    id: 16,
    nombre: "Espinaca",
    categoria: "verduras",
    sku: "VE-006",
    cantidad: 25,
    unidad: "kilo",
    precio: 32.00,
    image: "../img/Catalogo/vegetables.jpg"
  },
  {
    id: 17,
    nombre: "Arroz",
    categoria: "granel",
    sku: "GR-001",
    cantidad: 100,
    unidad: "kilo",
    precio: 28.00,
    image: "../img/Catalogo/grains.jpg"
  },
  {
    id: 18,
    nombre: "Frijol",
    categoria: "granel",
    sku: "GR-002",
    cantidad: 85,
    unidad: "kilo",
    precio: 34.00,
    image: "../img/Catalogo/grains.jpg"
  },
  {
    id: 19,
    nombre: "Leche entera",
    categoria: "lacteos",
    sku: "LA-001",
    cantidad: 60,
    unidad: "litro",
    precio: 24.50,
    image: "../img/Catalogo/milk.jpg"
  },
  {
    id: 20,
    nombre: "Queso fresco",
    categoria: "lacteos",
    sku: "LA-002",
    cantidad: 40,
    unidad: "kilo",
    precio: 120.00,
    image: "https://i.ibb.co/MD5D053V/tomatoe.jpg"
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

export { products, addProduct, getProducts };