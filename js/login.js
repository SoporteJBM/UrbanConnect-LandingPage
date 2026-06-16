// Crear usuario por defecto en localStorage
const usuariosDefault = [
  {
    login: "admin",
    password: "admin123",
    rol: "Administrador"
  }
];

if (!localStorage.getItem("usuarios")) {
  localStorage.setItem("usuarios", JSON.stringify(usuariosDefault));
}

// Mostrar / ocultar contraseña
function togglePassword() {
  const input = document.getElementById("password");
  input.type = input.type === "password" ? "text" : "password";
}

// Login
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const login = document.getElementById("login").value.trim();
  const password = document.getElementById("password").value.trim();

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuarioEncontrado = usuarios.find(
    usuario => usuario.login === login && usuario.password === password
  );

  if (usuarioEncontrado) {
    localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));

    alert("Bienvenido a urbanConnect");

    // Cuando tengas tu pantalla principal, cambia esto:
    window.location.href = "dashboard.html";
  } else {
    alert("Usuario o contraseña incorrectos");
  }
});