const footer = document.getElementById('footer');
footer.innerHTML = `

        <!-- Redes sociales -->
        <div class="row">
          <div
            class="footer-about-us d-none d-lg-block col-12 col-lg-4 text-start my-3"
          >
            <a href="./preguntasRespuestas.html" class="d-block">Preguntas Frecuentes</a>
            <a href="sobre_nosotros.html" class="d-block">Sobre nosotros</a>
            <a href="contacto.html" class="d-block active" active>Contacto</a>
          </div>
          <div
            class="footer-social my-3 col-12 col-lg-4 d-flex justify-content-center align-items-center"
          >
            <a href="#"
              ><img
                id="footer-social-instagram"
                src="../img/footer/instagram.png"
                alt="Instagram"
            /></a>
            <a href="#"
              ><img
                id="footer-social-whatsapp"
                src="../img/footer/whatsapp.png"
                alt="WhatsApp"
            /></a>
            <a href="#"
              ><img
                id="footer-social-facebook"
                src="../img/footer/facebook.png"
                alt="Facebook"
            /></a>
          </div>
          <div
            class="my-3 d-none d-lg-block col-lg-4 d-flex flex-column text-end justify-content-center"
          >
            <p class="mb-0">Dirección:</p>
            <p class="mb-0">Calle Juan Escutia</p>
            <p class="mb-0">Colonia Roma</p>
          </div>
        </div>

        <div class="row align-items-center">
          <div class="col-12 d-flex justify-content-center">
            <img
              class="logo-footer"
              src="../img/footer/tu-localito-logo.png"
              alt="Tu localito"
            />
          </div>
        </div>
        <div class="row mt-3 mb-0">
          <div class="col-4 d-none d-lg-block">
            <p class="hecho-en-mexico mb-0">
              Hecho en
              <img src="../img/footer/mexico.png" alt="Bandera de México" />
            </p>
          </div>
          <div class="tu-localito-copyright fst-italic col-md-4 text-center">
            <p class="tu-localito-copyright fst-italic">© 2025 Tu localito</p>
          </div>
          <div class="col-4 text-end d-none d-lg-block">
            <p>Tel: 522 234 2344</p>
          </div>
        </div>
      
`
