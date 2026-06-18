var usuariosDefault = [
  {
    login: "admin",
    password: "admin123",
    rol: "Administrador"
  }
];

if (localStorage.getItem("usuarios") === null) {
  localStorage.setItem("usuarios", JSON.stringify(usuariosDefault));
}

function togglePassword() {
  var inputPassword = document.getElementById("password");

  if (inputPassword.type === "password") {
    inputPassword.type = "text";
  } else {
    inputPassword.type = "password";
  }
}

var formularioLogin = document.getElementById("loginForm");

if (formularioLogin !== null) {
  formularioLogin.addEventListener("submit", iniciarSesion);
}

function iniciarSesion(evento) {
  evento.preventDefault();

  var login = document.getElementById("login").value.trim();
  var password = document.getElementById("password").value.trim();
  var usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  var usuarioEncontrado = null;

  usuarios.forEach(function (usuario) {
    if (usuario.login === login && usuario.password === password) {
      usuarioEncontrado = usuario;
    }
  });

  if (usuarioEncontrado !== null) {
    localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));
    window.location.href = "dashboard.html";
  } else {
    alert("Usuario o contrasena incorrectos");
  }
}
