document.addEventListener("DOMContentLoaded", iniciarPagina);

function iniciarPagina() {
  iniciarFiltros();
  iniciarModalDeModulo();
  iniciarRegistroDocumento();
}

function iniciarRegistroDocumento() {
  var formulario = document.getElementById("documentForm");
  if (formulario === null) return;
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    if (!formulario.checkValidity()) { formulario.reportValidity(); return; }
    var titulo = document.getElementById("documentTitle").value.trim();
    mostrarConfirmacion(formulario, "Documento ‘" + titulo + "’ guardado correctamente.");
    formulario.reset();
  });
}

function mostrarConfirmacion(formulario, texto) {
  var mensaje = formulario.querySelector(".module-feedback");
  if (mensaje === null) {
    mensaje = document.createElement("p");
    mensaje.className = "module-feedback";
    mensaje.setAttribute("role", "status");
    mensaje.setAttribute("aria-live", "polite");
    formulario.insertBefore(mensaje, formulario.querySelector(".module-modal-actions"));
  }
  mensaje.textContent = texto;
}

function iniciarModalDeModulo() {
  var formulario = document.querySelector(".module-form");

  if (formulario === null) {
    return;
  }

  var tituloFormulario = formulario.querySelector("h3");
  var botonGuardar = formulario.querySelector("button");
  var modal = document.createElement("div");

  modal.className = "module-modal-overlay";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML =
    '<div class="module-modal-card" role="dialog" aria-modal="true">' +
      '<div class="module-modal-header">' +
        '<div><h2></h2><p>Completa los datos para guardar el nuevo registro.</p></div>' +
        '<button class="module-modal-close" type="button" aria-label="Cerrar modal">×</button>' +
      '</div>' +
      '<div class="module-modal-actions">' +
        '<button class="module-modal-cancel" type="button">Cancelar</button>' +
      '</div>' +
    '</div>';

  var tarjetaModal = modal.querySelector(".module-modal-card");
  var tituloModal = modal.querySelector("h2");
  var acciones = modal.querySelector(".module-modal-actions");
  var botonCerrar = modal.querySelector(".module-modal-close");
  var botonCancelar = modal.querySelector(".module-modal-cancel");

  if (tituloFormulario !== null) {
    tituloModal.textContent = tituloFormulario.textContent;
    tituloFormulario.remove();
  } else {
    tituloModal.textContent = "Nuevo registro";
  }

  if (botonGuardar !== null) {
    botonGuardar.className = "module-modal-submit";
    acciones.appendChild(botonGuardar);
  }

  formulario.appendChild(acciones);
  tarjetaModal.appendChild(formulario);
  document.body.appendChild(modal);

  var botonesAbrir = document.querySelectorAll(
    ".create-btn, .quick-actions button:first-child"
  );

  for (var i = 0; i < botonesAbrir.length; i++) {
    botonesAbrir[i].addEventListener("click", function () {
      abrirModalDeModulo(modal, formulario);
    });
  }

  botonCerrar.addEventListener("click", function () {
    cerrarModalDeModulo(modal);
  });

  botonCancelar.addEventListener("click", function () {
    cerrarModalDeModulo(modal);
  });

  modal.addEventListener("click", function (evento) {
    if (evento.target === modal) {
      cerrarModalDeModulo(modal);
    }
  });

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
      cerrarModalDeModulo(modal);
    }
  });
}

function abrirModalDeModulo(modal, formulario) {
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("module-modal-open");

  var primerCampo = formulario.querySelector("input, select, textarea");

  if (primerCampo !== null) {
    primerCampo.focus();
  }
}

function cerrarModalDeModulo(modal) {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("module-modal-open");
}

function iniciarFiltros() {
  prepararPanel(".reports-panel", ".report-list", ".report-card");
  prepararPanel(".announcements-panel", ".announcement-list", ".announcement-card");
  prepararPanel(".payments-panel", ".payment-list", ".payment-card");
}

function prepararPanel(selectorPanel, selectorLista, selectorTarjeta) {
  var panel = document.querySelector(selectorPanel);
  var lista = document.querySelector(selectorLista);

  if (panel === null || lista === null) {
    return;
  }

  var pestanas = panel.querySelectorAll(".tab");
  var buscador = panel.querySelector(".search-box input");
  var selectores = panel.querySelectorAll(".filters select");
  var mensajeVacio = document.createElement("div");

  mensajeVacio.className = "empty-state";
  mensajeVacio.textContent = "No hay resultados con los filtros seleccionados.";
  mensajeVacio.hidden = true;
  lista.appendChild(mensajeVacio);

  function actualizar() {
    aplicarFiltros(panel, lista, selectorTarjeta, mensajeVacio);
  }

  for (var i = 0; i < pestanas.length; i++) {
    pestanas[i].addEventListener("click", function () {
      for (var j = 0; j < pestanas.length; j++) {
        pestanas[j].classList.remove("active");
      }

      this.classList.add("active");
      actualizar();
    });
  }

  if (buscador !== null) {
    buscador.addEventListener("input", actualizar);
  }

  for (var k = 0; k < selectores.length; k++) {
    selectores[k].addEventListener("change", actualizar);
  }

  actualizar();
}

function aplicarFiltros(panel, lista, selectorTarjeta, mensajeVacio) {
  var tarjetas = lista.querySelectorAll(selectorTarjeta);
  var pestana = panel.querySelector(".tab.active");
  var buscador = panel.querySelector(".search-box input");
  var selectores = panel.querySelectorAll(".filters select");
  var textoPestana = pestana === null ? "todos" : normalizarTexto(pestana.textContent);
  var textoBusqueda = buscador === null ? "" : normalizarTexto(buscador.value);
  var cantidadVisible = 0;

  for (var i = 0; i < tarjetas.length; i++) {
    var textoTarjeta = normalizarTexto(tarjetas[i].textContent);
    var mostrar = textoTarjeta.indexOf(textoBusqueda) !== -1;

    if (!coincideConPestana(textoPestana, textoTarjeta)) {
      mostrar = false;
    }

    if (!coincideConSelectores(selectores, textoTarjeta)) {
      mostrar = false;
    }

    tarjetas[i].hidden = !mostrar;

    if (mostrar) {
      cantidadVisible++;
    }
  }

  mensajeVacio.hidden = cantidadVisible !== 0;
}

function coincideConSelectores(selectores, textoTarjeta) {
  for (var i = 0; i < selectores.length; i++) {
    var valor = normalizarTexto(selectores[i].value);
    var textoInicial = normalizarTexto(selectores[i].options[0].textContent);
    var filtraContenido = textoInicial.indexOf("todos") === 0 || textoInicial.indexOf("todas") === 0;
    var opcionGeneral = valor === "" || valor.indexOf("todos") === 0 || valor.indexOf("todas") === 0;

    if (filtraContenido && !opcionGeneral && textoTarjeta.indexOf(valor) === -1) {
      return false;
    }
  }

  return true;
}

function coincideConPestana(pestana, textoTarjeta) {
  if (pestana === "todos" || pestana === "todas") {
    return true;
  }

  if (pestana.slice(-4) === "ores") {
    pestana = pestana.slice(0, -2);
  } else if (pestana.slice(-1) === "s") {
    pestana = pestana.slice(0, -1);
  }

  return textoTarjeta.indexOf(pestana) !== -1;
}

function normalizarTexto(texto) {
  return String(texto)
    .toLowerCase()
    .replace(/[áàäâ]/g, "a")
    .replace(/[éèëê]/g, "e")
    .replace(/[íìïî]/g, "i")
    .replace(/[óòöô]/g, "o")
    .replace(/[úùüû]/g, "u")
    .replace(/ñ/g, "n")
    .trim();
}
