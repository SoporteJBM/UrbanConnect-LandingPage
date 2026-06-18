document.addEventListener("DOMContentLoaded", iniciarReportes);

function iniciarReportes() {
  var modal = document.getElementById("reportModal");
  var botonCerrar = document.getElementById("closeReportModal");
  var botonCancelar = document.getElementById("cancelReportModal");
  var formulario = document.getElementById("newReportForm");
  var botonesAbrir = document.querySelectorAll(".open-report-modal, #openReportModalQuick");

  if (modal === null || formulario === null) {
    return;
  }

  function cerrar() {
    cerrarModal(modal, formulario);
  }

  botonesAbrir.forEach(function (boton) {
    boton.addEventListener("click", function () {
      abrirModal(modal);
    });
  });

  botonCerrar.addEventListener("click", cerrar);
  botonCancelar.addEventListener("click", cerrar);

  modal.addEventListener("click", function (evento) {
    if (evento.target === modal) {
      cerrar();
    }
  });

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    crearReporte();
    cerrar();
  });
}

function abrirModal(modal) {
  modal.classList.add("active");
  document.body.classList.add("modal-open");
}

function cerrarModal(modal, formulario) {
  modal.classList.remove("active");
  document.body.classList.remove("modal-open");
  formulario.reset();
}

function crearReporte() {
  var titulo = document.getElementById("reportTitle").value;
  var categoria = document.getElementById("reportCategory").value;
  var ubicacion = document.getElementById("reportLocation").value;
  var prioridad = document.getElementById("reportPriority").value;
  var descripcion = document.getElementById("reportDescription").value;
  var lista = document.querySelector(".report-list");
  var reporte = document.createElement("article");

  reporte.className = "report-card";
  reporte.innerHTML = crearContenidoReporte(titulo, categoria, ubicacion, prioridad, descripcion);
  lista.insertBefore(reporte, lista.firstChild);

  var pestanaActiva = document.querySelector(".reports-panel .tab.active");

  if (pestanaActiva !== null) {
    pestanaActiva.click();
  }
}

function crearContenidoReporte(titulo, categoria, ubicacion, prioridad, descripcion) {
  var clasePrioridad = "low";
  var clasePunto = "green";
  var claseCategoria = "red";
  var icono = "[Foto]";
  var nombrePrioridad = prioridad;

  if (prioridad === "Alta") {
    clasePrioridad = "high";
    clasePunto = "red";
    nombrePrioridad = "Urgente";
  } else if (prioridad === "Media") {
    clasePrioridad = "medium";
    clasePunto = "orange";
  }

  if (categoria === "Mantenimiento") {
    claseCategoria = "blue";
    icono = "[Edificio]";
  } else if (categoria === "Alumbrado") {
    claseCategoria = "green";
    icono = "[Luz]";
  } else if (normalizarTexto(categoria) === "plomeria") {
    claseCategoria = "purple";
    icono = "[Agua]";
  } else if (normalizarTexto(categoria) === "areas comunes") {
    claseCategoria = "orange";
    icono = "[Area]";
  }

  return '<div class="report-thumb elevator">' + icono + '</div>' +
    '<div class="report-info">' +
      '<span class="priority ' + clasePrioridad + '">' + nombrePrioridad + '</span>' +
      '<h3>' + escaparHTML(titulo) + '</h3>' +
      '<p>' + escaparHTML(descripcion) + '</p>' +
      '<div class="report-tags">' +
        '<span class="tag ' + claseCategoria + '">' + escaparHTML(categoria) + '</span>' +
        '<span class="location">Ubicacion: ' + escaparHTML(ubicacion) + '</span>' +
      '</div>' +
    '</div>' +
    '<div class="report-meta">' +
      '<span class="status open">Abierto</span>' +
      '<h4>#R-NUEVO</h4>' +
      '<p>Ahora</p>' +
      '<small><i class="dot ' + clasePunto + '"></i> Prioridad: ' + prioridad + '</small>' +
    '</div>' +
    '<button class="more-btn" type="button">...</button>';
}

function escaparHTML(texto) {
  var elemento = document.createElement("div");
  elemento.textContent = texto;
  return elemento.innerHTML;
}
