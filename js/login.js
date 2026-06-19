var usuarioInicial = {
  login: "admin",
  password: "admin123",
  rol: "Administrador"
};

var usuariosGuardados = [];

try {
  usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];
} catch (error) {
  usuariosGuardados = [];
}

if (!Array.isArray(usuariosGuardados)) usuariosGuardados = [];

var indiceAdministrador = usuariosGuardados.findIndex(function (usuario) {
  return usuario.login === usuarioInicial.login;
});

if (indiceAdministrador === -1) {
  usuariosGuardados.push(usuarioInicial);
} else {
  usuariosGuardados[indiceAdministrador] = usuarioInicial;
}

localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));

var formularioLogin = document.getElementById("loginForm");
var mensajeLogin = document.getElementById("loginMessage");

if (formularioLogin !== null) {
  formularioLogin.addEventListener("submit", iniciarSesion);
}

registrarMensajeInformativo("forgotPassword", "La recuperación de contraseña no está disponible en este prototipo.");
registrarMensajeInformativo("googleLogin", "El acceso con Google no está disponible en este prototipo.");

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
      mostrarMensaje("Acceso correcto. Abriendo el panel principal…", "success");
      window.location.href = "dashboard.html";
      return;
    }
  }

  mostrarMensaje("Usuario o contraseña incorrectos.", "error");
}

function registrarMensajeInformativo(id, texto) {
  var control = document.getElementById(id);
  if (control === null) return;
  control.addEventListener("click", function (evento) {
    if (control.tagName === "A") evento.preventDefault();
    mostrarMensaje(texto, "info");
  });
}

function mostrarMensaje(texto, tipo) {
  if (mensajeLogin === null) return;
  mensajeLogin.textContent = texto;
  mensajeLogin.className = "login-message " + tipo;
}
