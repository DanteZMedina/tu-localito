// Array de miembros del equipo
const teamMembers = [
  {
    nombre: "Dante Medina",
    rol: "Full Stack Jr Developer",
    bio: "Desarrollador Fullstack Jr. con experiencia en frontend (JavaScript, HTML5, CSS3) y backend (Java, SQL), con sólida trayectoria en QA manual y automatizado (Python, Selenium, Jira, Zephyr). Experiencia en pruebas funcionales y de regresión, garantizando calidad en todo el ciclo de desarrollo. Ha trabajado en proyectos financieros con Citibanamex, Banxico y TCS, aportando soluciones robustas y seguras. Busco contribuir al desarrollo de aplicaciones escalables en equipos ágiles y colaborativos.",
    foto: "../img/sobre-nosotros/team-carousel-pictures/team-dante.png",
    icono: "../img/sobre-nosotros/team-carousel-icons/team-avatar-mango.png"
  },
  {
    nombre: "Dominique Rangel",
    rol: "Full Stack Jr Developer",
    bio: "Soy Ingeniera Biomédica con sólida base en matemáticas aplicadas. Actualmente desarrollo mi carrera en el ámbito tecnológico, me especializo en desarrollo web, aplicando buenas prácticas y herramientas modernas para crear soluciones funcionales y escalables. Me motiva aprender de forma continua y consolidar mi experiencia en el área para aportar valor en proyectos digitales con impacto.",
    foto: "../img/sobre-nosotros/team-carousel-pictures/team-domi.png",
    icono: "../img/sobre-nosotros/team-carousel-icons/team-avatar-zanahoria.png"
  },
  {
    nombre: "Francisco Roch",
    rol: "Full Stack Jr Developer",
    bio: "Profesional del área financiera con experiencia en análisis y gestión de recursos. Actualmente en formación en programación, con enfoque en Java y tecnologías digitales. Mi objetivo es integrar el conocimiento financiero con herramientas tecnológicas para generar soluciones que impulsen la eficiencia y la innovación en las empresas.",
    foto: "../img/sobre-nosotros/team-carousel-pictures/team-paco.png",
    icono: "../img/sobre-nosotros/team-carousel-icons/team-avatar-sandia.png"
  },
  {
    nombre: "Jesús De la Rosa",
    rol: "Full Stack Jr Developer",
    bio: "Soy Químico Farmacéutico Biólogo con experiencia en control de calidad e inventarios en empresas de giro logístico. Actualmente me encuentro en formación como Desarrollador Full Stack Jr. Mi objetivo es impementar la lógica, el detalle y el método científico para potenciar el desarrollo de soluciones tecnológicas.",
    foto: "../img/sobre-nosotros/team-carousel-pictures/team-aaron.png",
    icono: "../img/sobre-nosotros/team-carousel-icons/team-avatar-pera.png"
  },
  {
    nombre: "Jorge Rodriguez",
    rol: "Full Stack Jr Developer",
    bio: "Soy Ingeniero de Software con pasión por crear soluciones tecnológicas eficientes y escalables.Actualmente me especializo en el desarrollo backend utilizando Java y el framework Spring Boot.Me interesa la arquitectura de software y las buenas prácticas de programación.Siempre busco aprender y aplicar nuevas tecnologías que potencien el desarrollo de proyectos innovadores.",
    foto: "../img/sobre-nosotros/team-carousel-pictures/team-jorge.png",
    icono: "../img/sobre-nosotros/team-carousel-icons/team-avatar-brocoli.png"
  },
  {
    nombre: "Lilia Rivas",
    rol: "Full Stack Jr Developer",
    bio: "Soy ingeniera geofísica de formación, con experiencia en logística, administración, atención al cliente y marketing digital. Actualmente estoy en transición hacia el mundo de la tecnología, formándome como Desarrolladora Full Stack Java. Mi trayectoria me ha dado habilidades como análisis de datos, comunicación efectiva y resolución de problemas, que ahora aplico al desarrollo de software. Me entusiasma crear soluciones digitales escalables, centradas en el usuario y con impacto real.",
    foto: "../img/sobre-nosotros/team-carousel-pictures/team-lili.png",
    icono: "../img/sobre-nosotros/team-carousel-icons/team-avatar-uva.png"
  },
  {
    nombre: "Yesenia Quiroz",
    rol: "Full Stack Jr Developer",
    bio: "Soy Ingeniera Bioquímica Industrial con experiencia en control de calidad, atención al cliente y ventas. Actualmente me encuentro en formación en el el Área de TI como Desarrolladora Full Stack,  busco combinar mi experiencia para implementar  herramientas nuevas para automatizar y mejorar la eficiencia de procesos.",
    foto: "../img/sobre-nosotros/team-carousel-pictures/team-yes.png",
    icono: "../img/sobre-nosotros/team-carousel-icons/team-avatar-cereza.png"
  },
  {
    nombre: "Thalia Espinola",
    rol: "Full Stack Jr Developer",
    bio: "Soy Ingeniera en Tecnologías de Manufactura y actualmente me encuentro en formación como Desarrolladora Fullstack. Aunque estoy iniciando mi trayectoria en desarrollo, me apasiona aprender y aplicar mis conocimientos para crear soluciones tecnológicas.",
    foto: "../img/sobre-nosotros/team-carousel-pictures/team-thal.png",
    icono: "../img/sobre-nosotros/team-carousel-icons/team-avatar-pinia.png"
  },
];

const carouselInner = document.querySelector("#teamCarousel .carousel-inner");

teamMembers.forEach((member, index) => {
  // Contenedor del item del carrusel
  const itemDiv = document.createElement("div");
  itemDiv.className = `carousel-item${index === 0 ? " active" : ""}`;

  const cardWrapper = document.createElement("div");
  cardWrapper.className = "card-wrapper";

  const card = document.createElement("div");
  card.className = "card";

  const row = document.createElement("div");
  row.className = "row g-0 align-items-center";

  // Columna de la imagen
  const colImg = document.createElement("div");
  colImg.className = "col-12 col-md-4 text-center p-3";

  const profileWrapper = document.createElement("div");
  profileWrapper.className = "d-inline-block position-relative";

  const imgFoto = document.createElement("img");
  imgFoto.src = member.foto;
  imgFoto.alt = member.nombre;
  imgFoto.className = "team-image img-fluid rounded-circle";

  const imgIcono = document.createElement("img");
  imgIcono.src = member.icono;
  imgIcono.alt = "Icono";
  imgIcono.className = "position-absolute bottom-0 start-0";
  imgIcono.style.width = "80px";
  imgIcono.style.height = "80px";

  profileWrapper.appendChild(imgFoto);
  profileWrapper.appendChild(imgIcono);
  colImg.appendChild(profileWrapper);

  // Columna de texto
  const colText = document.createElement("div");
  colText.className = "col-12 col-md-8 text-justify";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const h2 = document.createElement("h2");
  h2.className = "team-name card-title";
  h2.textContent = member.nombre;

  const pRol = document.createElement("p");
  const strongRol = document.createElement("strong");
  strongRol.className = "team-attribute";
  strongRol.textContent = "Rol: ";
  pRol.appendChild(strongRol);
  pRol.appendChild(document.createTextNode(member.rol));

  const pBio = document.createElement("p");
  const strongBio = document.createElement("strong");
  strongBio.className = "team-attribute";
  strongBio.textContent = "Biografía: ";
  pBio.appendChild(strongBio);
  pBio.appendChild(document.createTextNode(member.bio));

  cardBody.appendChild(h2);
  cardBody.appendChild(pRol);
  cardBody.appendChild(pBio);
  
  colText.appendChild(cardBody);

  row.appendChild(colImg);
  row.appendChild(colText);

  card.appendChild(row);
  cardWrapper.appendChild(card);
  itemDiv.appendChild(cardWrapper);

  carouselInner.appendChild(itemDiv);
});
