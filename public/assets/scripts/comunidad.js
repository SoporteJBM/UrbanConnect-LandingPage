(function () {
  "use strict";

  var CLAVES = {
    avisos: "urbanConnect_avisos_comunidad",
    votos: "urbanConnect_votos_comunidad",
    votoEmitido: "urbanConnect_voto_emitido",
    sugerencias: "urbanConnect_sugerencias",
    invitados: "urbanConnect_invitados"
  };

  document.addEventListener("DOMContentLoaded", function () {
    iniciarAvisos();
    iniciarVotacion();
    iniciarContactos();
    iniciarSugerencias();
    iniciarInvitados();
  });

  function iniciarAvisos() {
    var formulario = document.getElementById("announcementForm");
    var lista = document.querySelector(".announcement-list");
    if (!formulario || !lista) return;

    leer(CLAVES.avisos, []).forEach(function (aviso) { lista.appendChild(crearAviso(aviso)); });
    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();
      if (!formulario.checkValidity()) { formulario.reportValidity(); return; }

      var aviso = {
        titulo: document.getElementById("announcementTitle").value.trim(),
        categoria: document.getElementById("announcementCategory").value,
        fecha: document.getElementById("announcementDate").value,
        contenido: document.getElementById("announcementContent").value.trim()
      };
      var avisos = leer(CLAVES.avisos, []);
      avisos.push(aviso);
      guardar(CLAVES.avisos, avisos);
      lista.appendChild(crearAviso(aviso));
      mostrar("announcementResult", "✓ Aviso importante publicado y visible para la comunidad.");
      formulario.reset();
    });
  }

  function crearAviso(aviso) {
    var tarjeta = document.createElement("article");
    tarjeta.className = "announcement-card";
    tarjeta.innerHTML = '<div class="announcement-icon blue">📢</div><div class="announcement-info"><h3></h3><p></p><span class="category blue-light"></span></div><div class="announcement-meta"><span class="status published">Publicado</span><p></p><small>Ahora</small><small>👁️ 0 vistas</small></div><button class="more-btn" type="button" aria-label="Opciones del aviso">•••</button>';
    tarjeta.querySelector("h3").textContent = aviso.titulo;
    tarjeta.querySelector(".announcement-info p").textContent = aviso.contenido;
    tarjeta.querySelector(".category").textContent = aviso.categoria;
    tarjeta.querySelector(".announcement-meta p").textContent = formatearFecha(aviso.fecha);
    tarjeta.querySelector(".more-btn").addEventListener("click", function () {
      mostrar("announcementResult", "Aviso «" + aviso.titulo + "» publicado correctamente.");
    });
    return tarjeta;
  }

  function iniciarVotacion() {
    var formulario = document.getElementById("digitalVoteForm");
    if (!formulario) return;
    var opciones = ["Iluminación de áreas comunes", "Cámaras de seguridad", "Jardín y juegos infantiles"];
    var votos = leer(CLAVES.votos, [12, 18, 10]);
    actualizarResultados(votos);

    if (localStorage.getItem(CLAVES.votoEmitido)) {
      bloquearVotacion(formulario);
      mostrar("voteResult", "Tu voto ya fue registrado. Los resultados mostrados están actualizados.");
    }

    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();
      if (localStorage.getItem(CLAVES.votoEmitido)) {
        mostrar("voteResult", "Ya registraste tu voto en esta consulta.");
        return;
      }
      if (!formulario.checkValidity()) { formulario.reportValidity(); return; }
      var seleccion = formulario.querySelector('input[name="communityVote"]:checked');
      var indice = opciones.indexOf(seleccion.value);
      votos[indice] += 1;
      guardar(CLAVES.votos, votos);
      localStorage.setItem(CLAVES.votoEmitido, seleccion.value);
      actualizarResultados(votos);
      mostrar("voteResult", "✓ Voto registrado por «" + seleccion.value + "». Gracias por participar.");
      bloquearVotacion(formulario);
    });
  }

  function actualizarResultados(votos) {
    var total = votos.reduce(function (suma, voto) { return suma + voto; }, 0);
    votos.forEach(function (voto, indice) {
      var porcentaje = total ? Math.round((voto / total) * 100) : 0;
      var contador = document.getElementById("voteCount" + indice);
      var barra = document.getElementById("voteBar" + indice);
      if (contador) contador.textContent = voto + (voto === 1 ? " voto" : " votos") + " · " + porcentaje + "%";
      if (barra) barra.style.width = porcentaje + "%";
    });
  }

  function bloquearVotacion(formulario) {
    formulario.querySelectorAll("input").forEach(function (campo) { campo.disabled = true; });
    var boton = formulario.querySelector("button");
    if (boton) { boton.disabled = true; boton.textContent = "Voto registrado"; }
  }

  function iniciarContactos() {
    document.querySelectorAll(".contact-action").forEach(function (boton) {
      boton.addEventListener("click", function () {
        mostrar("contactResult", "☎ " + boton.dataset.contact + ": " + boton.dataset.number + ". Contacto listo para usar.");
      });
    });
  }

  function iniciarSugerencias() {
    var formulario = document.getElementById("suggestionForm");
    if (!formulario) return;
    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();
      if (!formulario.checkValidity()) { formulario.reportValidity(); return; }
      var sugerencia = {
        id: "SG-" + Date.now().toString().slice(-6),
        categoria: document.getElementById("suggestionCategory").value,
        mensaje: document.getElementById("suggestionText").value.trim(),
        anonima: document.getElementById("suggestionAnonymous").checked
      };
      var sugerencias = leer(CLAVES.sugerencias, []);
      sugerencias.push(sugerencia);
      guardar(CLAVES.sugerencias, sugerencias);
      mostrar("suggestionResult", "✓ Sugerencia #" + sugerencia.id + " enviada" + (sugerencia.anonima ? " de forma anónima." : "."));
      formulario.reset();
    });
  }

  function iniciarInvitados() {
    var formulario = document.getElementById("guestForm");
    if (!formulario) return;
    var fecha = document.getElementById("guestDate");
    if (fecha) fecha.min = new Date().toISOString().slice(0, 10);
    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();
      if (!formulario.checkValidity()) { formulario.reportValidity(); return; }
      var invitado = {
        codigo: "VIS-" + Date.now().toString().slice(-6),
        nombre: document.getElementById("guestName").value.trim(),
        documento: document.getElementById("guestDocument").value.trim(),
        fecha: fecha.value,
        hora: document.getElementById("guestTime").value,
        estado: "Autorizado"
      };
      var invitados = leer(CLAVES.invitados, []);
      invitados.push(invitado);
      guardar(CLAVES.invitados, invitados);
      mostrar("guestResult", "✓ Ingreso autorizado. Código " + invitado.codigo + " para " + invitado.nombre + ".");
      formulario.reset();
    });
  }

  function mostrar(id, mensaje) {
    var resultado = document.getElementById(id);
    if (!resultado) return;
    resultado.textContent = mensaje;
    resultado.classList.add("visible");
  }

  function leer(clave, valorInicial) {
    try {
      var guardado = localStorage.getItem(clave);
      return guardado === null ? valorInicial : JSON.parse(guardado);
    } catch (error) { return valorInicial; }
  }

  function guardar(clave, valor) { localStorage.setItem(clave, JSON.stringify(valor)); }
  function formatearFecha(fecha) {
    if (!fecha) return "Hoy";
    var partes = fecha.split("-");
    return partes[2] + "/" + partes[1] + "/" + partes[0];
  }
})();
