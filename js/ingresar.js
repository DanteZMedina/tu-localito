
const form = document.getElementById("formulario-login");

function showValidationError(input, message) {
  // Aseguramos que input sea un elemento y no un string
  const element = typeof input === "string" ? document.querySelector(input) : input;

  element.classList.add("is-invalid");

  let feedback = element.parentNode.querySelector(".invalid-feedback");
  if (!feedback) {
    feedback = document.createElement("div");
    feedback.className = "invalid-feedback";
    element.insertAdjacentElement("afterend", feedback);
  }
  feedback.textContent = message;
}

function clearValidation(input) {
  input.classList.remove("is-invalid", "is-valid");
  const feedback = input.parentNode.querySelector(".invalid-feedback");
  if (feedback) feedback.remove();
}

function getFieldDisplayName(fieldName) {
  const fieldNames = {
    postalCode: "código postal",
    personalName: "nombre",
    personalLastName: "primer apellido",
    personalPhone: "celular",
    email: "correo",
    password: "contraseña",
    confirmPassword: "confirmar contraseña",
  };
  return fieldNames[fieldName] || fieldName;
}

// === Usuarios de prueba ===
const usuariosDePrueba = [
  { email: "jesus@example.com", password: "ClaveSegura123!" },
  { email: "ana@example.com", password: "AnaPassword456$" },
  { email: "carlos@example.com", password: "CarlosClave789#" }
];

// Guardar en localStorage
localStorage.setItem("usuariosRegistrados", JSON.stringify(usuariosDePrueba));

const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados"));

// === Encriptación con Web Crypto ===
let sessionKey;

// Generar clave AES-GCM de sesión
async function generateKey() {
  sessionKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}
generateKey();

// Función de encriptar
async function encryptData(data) {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(data);

  const iv = crypto.getRandomValues(new Uint8Array(12)); // IV aleatorio

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    sessionKey,
    encoded
  );

  const cipherBase64 = btoa(String.fromCharCode(...new Uint8Array(ciphertext)));
  return cipherBase64;
}

// === Validaciones ===

// Validación de email
function validateEmail(input) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(input.value)) {
    showValidationError(input, "El formato del email no es válido");
    return false;
  }
  clearValidation(input);
  return true;
}

// Validar credenciales contra usuarios de prueba
function validateData(email, password, usuarios) {
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === email) {
      if (usuarios[i].password === password) {
        return true;
      } else {
        showValidationError("#password", "La contraseña no coincide. Vuelve a escribir la contraseña.");
        return false;
      }
    }
  }
  showValidationError("#email", "El correo no está registrado.");
  return false;
}

// Validar campos vacíos
function validateEmpty(input) {
  if (input.value.trim() === "") {
    showValidationError(input, `El campo ${getFieldDisplayName(input.id)} es requerido`);
    return false;
  }
  clearValidation(input);
  return true;
}

// === Evento submit ===
form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const inputs = form.querySelectorAll("input");
  let esValido = true;

  // Validar vacíos
  inputs.forEach((input) => {
    if (!validateEmpty(input)) esValido = false;
  });

  // Validar email
  if (esValido) esValido = validateEmail(document.getElementById("email"));

  // Validar credenciales
  if (esValido) {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    esValido = validateData(email, password, usuarios);

    if (esValido) {
      // Construcción del JSON
      const datosObj = { email, password };
      const datosJson = JSON.stringify(datosObj);

      // 🔒 Encriptar JSON antes de enviarlo
      const cipherBase64 = await encryptData(datosJson);

      // Mostrar solo el JSON cifrado en consola
      console.log("🔒 JSON cifrado:", cipherBase64);

      // Redirigir a inicio
      window.location.href = "index.html";
    }
  }
});