// Estado de la aplicación
let currentSection = 'inicio';
let comentario = '';
let pregunta = '';
let calificacion = 0;
let preguntas = [
    {
        pregunta: "¿Las frutas y verduras son frescas?",
        respuesta: "Sí, todos nuestros productos son seleccionados diariamente. Trabajamos con productores locales para garantizar frescura y sabor."
    },
    {
        pregunta: "¿Con cuánto tiempo de anticipación debo hacer el pedido?",
        respuesta: "Si es para recoger, con 30 minutos de anticipación es suficiente. Para envíos a domicilio recomendamos pedir con al menos 2 horas de anticipación."
    },
    {
        pregunta: "¿El precio es el mismo que en tienda?",
        respuesta: "Sí, el precio es exactamente el mismo. Lo único extra puede ser el costo de envío en caso de entrega a domicilio"
    },
    {
        pregunta: "¿Cómo sé que las frutas y verduras estarán frescas?",
        respuesta: "Todo lo seleccionamos al momento de armar tu pedido, para que siempre recibas productos frescos y de buena calidad."
    },
    {
        pregunta: "¿Puedo programar pedidos recurrentes (ejemplo: cada semana)?",
        respuesta: "¡Claro! Puedes dejar programado tu pedido semanal o quincenal para que nunca te falten frutas y verduras."
    },
        {
        pregunta: "¿Los productos ya incluyen iva?",
        respuesta: "si, todos nuestros productos ya incluyen iva y se muestran precios finales."
    }
];

// Función para manejar envío de pregunta
function handleEnviarPregunta() {
    if (pregunta.trim()) {
        const nuevaPregunta = {
            pregunta: pregunta,
            respuesta: "Gracias por tu pregunta. Te responderemos pronto."
        };
        preguntas.push(nuevaPregunta);
        pregunta = '';
        comentario = '';
        calificacion = 0;
        renderContent();
        alert('¡Pregunta enviada correctamente!');
    }
}

// Función para manejar el cambio de sección
function setCurrentSection(section) {
    currentSection = section;
    
    // Actualizar botones activos en navegación
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    renderContent();
}

// Función para manejar calificación
function setCalificacion(rating) {
    calificacion = rating;
    updateStars();
}

// Función para actualizar estrellas
function updateStars() {
    document.querySelectorAll('.star').forEach((star, index) => {
        if (index < calificacion) {
            star.classList.add('filled');
        } else {
            star.classList.remove('filled');
        }
    });
}

// Función para renderizar contenido basado en la sección actual
function renderContent() {
    const mainElement = document.querySelector('.main');
    
    switch(currentSection) {
        case 'inicio':
            mainElement.innerHTML = `
                <div class="main-content">
                    <h1 class="main-title">Preguntas y Respuestas</h1>
                    
                    <div class="questions-container">
                        ${preguntas.map((item, index) => `
                            <div class="question-item">
                                <h3 class="question">${item.pregunta}</h3>
                                <p class="answer">${item.respuesta}</p>
                            </div>
                        `).join('')}
                    </div>

                    <div class="form-section">
                        <div class="form-group">
                            <label>Escribe tu comentario:</label>
                            <input 
                                type="text" 
                                class="form-input comment-input"
                                placeholder="Comentario"
                                value="${comentario}"
                                id="comentario-input"
                            />
                        </div>

                        <div class="form-group">
                            <label>Escribe tu pregunta:</label>
                            <input 
                                type="text" 
                                class="form-input question-input"
                                placeholder="Pregunta"
                                value="${pregunta}"
                                id="pregunta-input"
                            />
                        </div>

                        <div class="rating-section">
                            <span class="rating-label">CALIFICAR</span>
                            <div class="stars">
                                ${[1, 2, 3, 4, 5].map(star => `
                                    <span class="star ${calificacion >= star ? 'filled' : ''}" data-rating="${star}">★</span>
                                `).join('')}
                            </div>
                            <button class="enviar-btn" id="enviar-btn">
                                Enviar
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Agregar event listeners para los inputs y botones
            setupInicioEventListeners();
            break;
            
        case 'catalogo':
            mainElement.innerHTML = `
                <div class="main-content">
                    <h1 class="main-title">Catálogo</h1>
                    <p>Aquí encontrarás todos nuestros productos frescos.</p>
                </div>
            `;
            break;
            
        case 'sobre-nosotros':
            mainElement.innerHTML = `
                <div class="main-content">
                    <h1 class="main-title">Sobre Nosotros</h1>
                    <p>Somos una empresa dedicada a ofrecer productos frescos y de calidad.</p>
                </div>
            `;
            break;
            
        case 'contacto':
            mainElement.innerHTML = `
                <div class="main-content">
                    <h1 class="main-title">Contacto</h1>
                    <p>Dirección: Calle Juan Escutia<br/>Colonia Roma<br/>522 234 2344</p>
                </div>
            `;
            break;
            
        case 'carrito':
            mainElement.innerHTML = `
                <div class="main-content">
                    <h1 class="main-title">Carrito de Compras</h1>
                    <p>Tu carrito está vacío.</p>
                </div>
            `;
            break;
            
        case 'ingresar':
            mainElement.innerHTML = `
                <div class="main-content">
                    <h1 class="main-title">Ingresar</h1>
                    <p>Página de inicio de sesión.</p>
                </div>
            `;
            break;
            
        default:
            mainElement.innerHTML = `
                <div class="main-content">
                    <h1 class="main-title">Preguntas y Respuestas</h1>
                </div>
            `;
    }
}

// Función para configurar event listeners en la sección inicio
function setupInicioEventListeners() {
    // Input de comentario
    const comentarioInput = document.getElementById('comentario-input');
    if (comentarioInput) {
        comentarioInput.addEventListener('input', (e) => {
            comentario = e.target.value;
        });
    }
    
    // Input de pregunta
    const preguntaInput = document.getElementById('pregunta-input');
    if (preguntaInput) {
        preguntaInput.addEventListener('input', (e) => {
            pregunta = e.target.value;
        });
    }
    
    // Estrellas de calificación
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', (e) => {
            const rating = parseInt(e.target.dataset.rating);
            setCalificacion(rating);
        });
    });
    
    // Botón enviar
    const enviarBtn = document.getElementById('enviar-btn');
    if (enviarBtn) {
        enviarBtn.addEventListener('click', handleEnviarPregunta);
    }
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners para navegación
    document.querySelectorAll('[data-section]').forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.dataset.section;
            setCurrentSection(section);
        });
    });
    
    // Renderizar contenido inicial
    renderContent();
});