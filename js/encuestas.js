(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    iniciarFiltros();
    iniciarFormularioModal();
    iniciarRegistroEncuesta();
  });

  function iniciarFiltros() {
    var panel = document.querySelector(".payments-panel");
    var lista = document.querySelector(".payment-list");
    if (!panel || !lista) return;

    var tarjetas = Array.prototype.slice.call(lista.querySelectorAll(".payment-card"));
    var pestanas = Array.prototype.slice.call(panel.querySelectorAll(".tab"));
    var buscador = panel.querySelector(".search-box input");
    var selectores = Array.prototype.slice.call(panel.querySelectorAll(".filters select"));
    var vacio = document.createElement("div");

    vacio.className = "empty-state";
    vacio.textContent = "No hay resultados con los filtros seleccionados.";
    vacio.hidden = true;
    vacio.setAttribute("role", "status");
    lista.appendChild(vacio);

    function actualizar() {
      var activa = panel.querySelector(".tab.active");
      var estado = activa ? normalizar(activa.textContent) : "todos";
      var busqueda = buscador ? normalizar(buscador.value) : "";
      var visibles = 0;

      tarjetas.forEach(function (tarjeta) {
        var texto = normalizar(tarjeta.textContent);
        var coincide = texto.indexOf(busqueda) !== -1;

        if (estado !== "todos" && estado !== "todas") {
          var singular = estado.endsWith("s") ? estado.slice(0, -1) : estado;
          coincide = coincide && texto.indexOf(singular) !== -1;
        }

        selectores.forEach(function (selector) {
          var primera = normalizar(selector.options[0].textContent);
          var valor = normalizar(selector.value);
          var esFiltro = primera.indexOf("todos") === 0 || primera.indexOf("todas") === 0;
          var esGeneral = valor.indexOf("todos") === 0 || valor.indexOf("todas") === 0;
          if (esFiltro && !esGeneral && texto.indexOf(valor) === -1) coincide = false;
        });

        tarjeta.hidden = !coincide;
        if (coincide) visibles++;
      });

      vacio.hidden = visibles !== 0;
    }

    pestanas.forEach(function (pestana) {
      pestana.addEventListener("click", function () {
        pestanas.forEach(function (item) { item.classList.remove("active"); });
        pestana.classList.add("active");
        actualizar();
      });
    });

    if (buscador) buscador.addEventListener("input", actualizar);
    selectores.forEach(function (selector) {
      selector.addEventListener("change", actualizar);
    });
    actualizar();
  }

  function iniciarRegistroEncuesta() {
    var formulario = document.getElementById("surveyForm");
    if (!formulario) return;
    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();
      if (!formulario.checkValidity()) { formulario.reportValidity(); return; }
      mostrarConfirmacion(formulario, "Encuesta guardada correctamente.");
      formulario.reset();
    });
  }

  function mostrarConfirmacion(formulario, texto) {
    var mensaje = formulario.querySelector(".module-feedback");
    if (!mensaje) {
      mensaje = document.createElement("p");
      mensaje.className = "module-feedback";
      mensaje.setAttribute("role", "status");
      mensaje.setAttribute("aria-live", "polite");
      formulario.insertBefore(mensaje, formulario.querySelector(".module-modal-actions"));
    }
    mensaje.textContent = texto;
  }

  function iniciarFormularioModal() {
    var formulario = document.querySelector(".module-form");
    if (!formulario) return;

    var encabezado = formulario.querySelector("h3");
    var titulo = encabezado ? encabezado.textContent : "Nuevo registro";
    var guardar = formulario.querySelector("button");
    var modal = document.createElement("div");

    modal.className = "module-modal-overlay";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML =
      '<section class="module-modal-card" role="dialog" aria-modal="true" aria-labelledby="encuestasModalTitle">' +
        '<header class="module-modal-header">' +
          '<div><h2 id="encuestasModalTitle"></h2><p>Completa los datos del registro.</p></div>' +
          '<button class="module-modal-close" type="button" aria-label="Cerrar modal">×</button>' +
        '</header>' +
        '<div class="module-modal-slot"></div>' +
      '</section>';

    modal.querySelector("h2").textContent = titulo;
    if (encabezado) encabezado.remove();

    var acciones = document.createElement("div");
    acciones.className = "module-modal-actions";
    acciones.innerHTML = '<button class="module-modal-cancel" type="button">Cancelar</button>';
    if (guardar) {
      guardar.className = "module-modal-submit";
      acciones.appendChild(guardar);
    }
    formulario.appendChild(acciones);
    modal.querySelector(".module-modal-slot").appendChild(formulario);
    document.body.appendChild(modal);

    document.querySelectorAll(".create-btn, .quick-actions button:first-child").forEach(function (boton) {
      boton.addEventListener("click", function () { abrirModal(modal, formulario); });
    });
    modal.querySelector(".module-modal-close").addEventListener("click", function () { cerrarModal(modal); });
    modal.querySelector(".module-modal-cancel").addEventListener("click", function () { cerrarModal(modal); });
    modal.addEventListener("click", function (evento) {
      if (evento.target === modal) cerrarModal(modal);
    });
    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape") cerrarModal(modal);
    });
  }

  function abrirModal(modal, formulario) {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("module-modal-open");
    var campo = formulario.querySelector("input, select, textarea");
    if (campo) campo.focus();
  }

  function cerrarModal(modal) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("module-modal-open");
  }

  function normalizar(texto) {
    return String(texto).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  }
})();
