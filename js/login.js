var usuarioInicial = {
  login: "admin",
  password: "admin123",
  rol: "Administrador"
};

if (localStorage.getItem("usuarios") === null) {
  localStorage.setItem("usuarios", JSON.stringify([usuarioInicial]));
}

var formularioLogin = document.getElementById("loginForm");

if (formularioLogin !== null) {
  formularioLogin.addEventListener("submit", iniciarSesion);
}

function togglePassword() {
  var campoPassword = document.getElementById("password");

  if (campoPassword.type === "password") {
    campoPassword.type = "text";
  } else {
    campoPassword.type = "password";
  }
}

function iniciarSesion(evento) {
  evento.preventDefault();

  var login = document.getElementById("login").value.trim();
  var password = document.getElementById("password").value.trim();
  var usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].login === login && usuarios[i].password === password) {
      localStorage.setItem("usuarioActivo", JSON.stringify(usuarios[i]));
      window.location.href = "dashboard.html";
      return;
    }
  }

  alert("Usuario o contraseña incorrectos");
}
