document.addEventListener("DOMContentLoaded", iniciarFiltros);

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
  var mensajeVacio = lista.querySelector(".empty-state");

  function actualizarFiltros() {
    aplicarFiltros(panel, lista, selectorTarjeta, mensajeVacio);
  }

  if (mensajeVacio === null) {
    mensajeVacio = document.createElement("div");
    mensajeVacio.className = "empty-state";
    mensajeVacio.textContent = "No hay resultados con los filtros seleccionados.";
    mensajeVacio.hidden = true;
    lista.appendChild(mensajeVacio);
  }

  pestanas.forEach(function (pestana) {
    pestana.addEventListener("click", function () {
      quitarPestanaActiva(pestanas);
      this.classList.add("active");
      actualizarFiltros();
    });
  });

  if (buscador !== null) {
    buscador.addEventListener("input", actualizarFiltros);
  }

  selectores.forEach(function (selector) {
    selector.addEventListener("change", actualizarFiltros);
  });

  actualizarFiltros();
}

function quitarPestanaActiva(pestanas) {
  pestanas.forEach(function (pestana) {
    pestana.classList.remove("active");
  });
}

function aplicarFiltros(panel, lista, selectorTarjeta, mensajeVacio) {
  var tarjetas = lista.querySelectorAll(selectorTarjeta);
  var pestanaActiva = panel.querySelector(".tab.active");
  var buscador = panel.querySelector(".search-box input");
  var selectores = panel.querySelectorAll(".filters select");
  var textoPestana = "todos";
  var textoBusqueda = "";
  var visibles = 0;

  if (pestanaActiva !== null) {
    textoPestana = normalizarTexto(pestanaActiva.textContent);
  }

  if (buscador !== null) {
    textoBusqueda = normalizarTexto(buscador.value);
  }

  tarjetas.forEach(function (tarjeta) {
    var textoTarjeta = normalizarTexto(tarjeta.textContent);
    var coincideBusqueda = textoBusqueda === "" || textoTarjeta.indexOf(textoBusqueda) !== -1;
    var coincidePestana = coincideConPestana(textoPestana, textoTarjeta);
    var coincideSelectores = coincideConSelectores(selectores, textoTarjeta);
    var mostrar = coincideBusqueda && coincidePestana && coincideSelectores;

    tarjeta.hidden = !mostrar;

    if (mostrar) {
      visibles = visibles + 1;
    }
  });

  mensajeVacio.hidden = visibles > 0;
}

function coincideConSelectores(selectores, textoTarjeta) {
  var coincide = true;

  selectores.forEach(function (selector) {
    var valor = normalizarTexto(selector.value);
    var primeraOpcion = normalizarTexto(selector.options[0].textContent);

    var esFiltro = primeraOpcion.indexOf("todos") === 0 || primeraOpcion.indexOf("todas") === 0;

    if (!esFiltro || esOpcionGeneral(valor)) {
      return;
    }

    if (textoTarjeta.indexOf(valor) === -1) {
      coincide = false;
    }
  });

  return coincide;
}

function esOpcionGeneral(valor) {
  return valor === "" ||
    valor.indexOf("todos") === 0 ||
    valor.indexOf("todas") === 0;
}

function coincideConPestana(pestana, textoTarjeta) {
  if (pestana === "todos" || pestana === "todas") {
    return true;
  }

  var palabraBuscada = pestana;
  var ultimasCuatro = pestana.slice(-4);

  if (ultimasCuatro === "ores") {
    palabraBuscada = pestana.slice(0, -2);
  } else if (pestana.slice(-1) === "s") {
    palabraBuscada = pestana.slice(0, -1);
  }

  return textoTarjeta.indexOf(palabraBuscada) !== -1;
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
