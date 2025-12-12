# 🛒 Tu Localito – Ecommerce de abarrotes y recetas

Tu Localito es un **ecommerce web** enfocado en la compra de productos de abarrotes, alimentos, limpieza y mascotas, integrando una experiencia diferenciadora basada en **recetas**, donde el usuario puede agregar automáticamente los ingredientes necesarios al carrito.

El proyecto está pensado como una solución **full‑stack**, combinando frontend web moderno con un backend en Java y despliegue en la nube.

---

## 🚀 Características principales

* 🧑‍🍳 **Recetas del día** con ingredientes dinámicos
* 🛒 **Carrito de compras** con cálculo automático de totales
* 📦 **Catálogo por departamentos y categorías**
* 🔐 **Autenticación de usuarios** (login y registro)
* 🎥 Integración de **videos de recetas (YouTube)**
* 📱 **Diseño responsive** (desktop y mobile)
* ☁️ **Despliegue en AWS EC2**

---

## 🖥️ Tecnologías utilizadas

### Frontend

* **HTML5** – estructura semántica
* **CSS3** – estilos personalizados
* **JavaScript (ES6)** – lógica de la aplicación
* **Bootstrap 4 & 5** – diseño responsive y componentes UI
* **Font Awesome** – iconografía
* **Google Fonts** – tipografías

### Backend

* **Java**
* **Spring Boot** – API REST y lógica de negocio
* **Spring Data JPA** – persistencia

### Base de datos

* **MySQL** / **MariaDB** – base de datos relacional

### Infraestructura

* **AWS EC2** – servidor en la nube
* **DuckDNS** – dominio dinámico

---

## 📂 Estructura del proyecto (Frontend)

```
Tu-Localito/
│
├── index.html              # Página principal
├── css/
│   ├── inicio.css
│   ├── catalogo.css
│   ├── navBar.css
│   └── footer.css...
│
├── js/
│   ├── inicio.js           # Lógica de recetas y carrito
│   ├── navBar.js           # Navbar dinámica
│   └── footer.js...        # Footer dinámico
│
├── html/
│   ├── catalogo.html       # Vista de catálogo
│   └── ingresar.html...    # Login
│
├── img/
│   └── Catalogo / ...
|   └── favicon-32x32.png...
└── README.md
```

---

## 🧩 Funcionalidades destacadas

### Recetas dinámicas

* Visualización de recetas con navegación tipo carrusel
* Lista de ingredientes disponibles
* Cálculo automático del total
* Agregado directo de ingredientes al carrito

### Catálogo

* Navegación por **departamentos** (Mascotas, Limpieza, Alimentos, Abarrotes)
* Filtros por **categoría** (Frutas, Verduras, Granel)

### Autenticación

* Modal de inicio de sesión y registro
* Validación de formularios

---

## ⚙️ Instalación y ejecución (Frontend)

1. Clona el repositorio:

```bash
git clone git@github.com:DanteZMedina/tu-localito.git / https://github.com/DanteZMedina/tu-localito.git
```

2. Abre el proyecto:

```bash
cd tu-localito
```

3. Ejecuta directamente en el navegador:

```bash
Abrir index.html
```

> No se requiere servidor local para el frontend.

---

## ⚙️ Backend (Resumen)

El backend está construido con **Spring Boot** y expone APIs REST para:

* Gestión de usuarios
* Productos y categorías
* Carrito y órdenes

Se conecta a una base de datos **MySQL/MariaDB** y está desplegado en **AWS EC2**.

---

## 🧪 Buenas prácticas aplicadas

* Separación de responsabilidades (HTML / CSS / JS)
* Componentes reutilizables (navbar, footer)
* Código modular en JavaScript
* Diseño responsive mobile‑first

---

---

## 👨‍💻 Autores

**Dante Medina**
Software Developer in Test / Java Developer jr 
* LinkedIn: [https://www.linkedin.com/in/dantezmedina](https://www.linkedin.com/in/dantezmedina)
* GitHub: [https://github.com/DanteZMedina](https://github.com/DanteZMedina)

**Dominique Rangel**
Java Developer jr
* LinkedIn: [https://www.linkedin.com/in/dominique-rangel/]

**Lilia Rivas**
Java Developer jr
* LinkedIn: [https://www.linkedin.com/in/lilia-rivas/]

**Thalia Espinola**
Java Developer jr
* LinkedIn: https://www.linkedin.com/in/thalia-espinola-hernandez/

**Francisco Roch**
Java Developer jr
* LinkedIn: https://www.linkedin.com/in/francisco-roch/

**Jesus de la Rosa**
Java Developer jr
* LinkedIn: https://www.linkedin.com/in/jesus-de-la-rosa-pinon/

**Jorge Rodriguez**
Mid Java Developer 
* LinkedIn: https://www.linkedin.com/in/jorge-rodz/

**Yesenia Quiroz**
Java Developer jr
* LinkedIn: https://www.linkedin.com/in/yesenia-quiroz-guzman/

---

## 📄 Licencia

Este proyecto se distribuye únicamente con fines educativos y de portafolio.
