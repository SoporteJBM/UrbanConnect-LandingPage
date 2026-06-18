document.addEventListener("DOMContentLoaded", iniciarLandingPage);

function iniciarLandingPage() {
  var botonMenu = document.querySelector(".menu-toggle");
  var menu = document.querySelector(".main-navigation");
  var enlaces = document.querySelectorAll(".main-navigation a");
  var anio = document.getElementById("current-year");

  if (anio !== null) {
    anio.textContent = new Date().getFullYear();
  }

  if (botonMenu === null || menu === null) {
    return;
  }

  botonMenu.addEventListener("click", function () {
    var menuAbierto = menu.classList.toggle("is-open");
    botonMenu.setAttribute("aria-expanded", menuAbierto);
    botonMenu.setAttribute("aria-label", menuAbierto ? "Cerrar menú" : "Abrir menú");
    document.body.classList.toggle("menu-open", menuAbierto);
  });

  enlaces.forEach(function (enlace) {
    enlace.addEventListener("click", cerrarMenu);
  });

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
      cerrarMenu();
    }
  });

  function cerrarMenu() {
    menu.classList.remove("is-open");
    botonMenu.setAttribute("aria-expanded", "false");
    botonMenu.setAttribute("aria-label", "Abrir menú");
    document.body.classList.remove("menu-open");
  }
}
