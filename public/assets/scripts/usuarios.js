(function () {
  "use strict";

  const KEYS = {
    paquetes: "uc_paquetes",
    stock: "uc_stock",
    visitas: "uc_qr_visitas",
    personal: "uc_personal",
    mudanzas: "uc_mudanzas"
  };

  const state = Object.fromEntries(
    Object.entries(KEYS).map(([name, key]) => [name, read(key)])
  );
  let toastTimer;

  function read(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return Array.isArray(value) ? value : [];
    } catch (_error) {
      return [];
    }
  }

  function save(name) {
    localStorage.setItem(KEYS[name], JSON.stringify(state[name]));
  }

  function uid(prefix) {
    const random = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `${prefix}-${Date.now().toString(36).toUpperCase()}-${random}`;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    })[character]);
  }

  function formatDate(value, withTime = false) {
    if (!value) return "—";
    const date = value.length === 10 ? new Date(`${value}T00:00:00`) : new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("es-PE", {
      day: "2-digit", month: "short", year: "numeric",
      ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {})
    }).format(date);
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3500);
  }

  function empty(message) {
    return `<div class="empty-records">${escapeHtml(message)}</div>`;
  }

  function setDefaultDates() {
    const now = new Date();
    const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    const dateTime = document.getElementById("visitaFecha");
    const moveDate = document.getElementById("mudanzaFecha");
    dateTime.min = localNow.toISOString().slice(0, 16);
    moveDate.min = localNow.toISOString().slice(0, 10);
    if (!dateTime.value) dateTime.value = localNow.toISOString().slice(0, 16);
  }

  function initTabs() {
    const tabs = [...document.querySelectorAll("[data-tab]")];
    tabs.forEach((tab) => tab.addEventListener("click", () => {
      tabs.forEach((item) => {
        const selected = item === tab;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-selected", String(selected));
      });
      document.querySelectorAll("[data-panel]").forEach((panel) => {
        const selected = panel.dataset.panel === tab.dataset.tab;
        panel.classList.toggle("active", selected);
        panel.hidden = !selected;
      });
    }));
  }

  function renderPaquetes() {
    const list = document.getElementById("paquetesList");
    document.getElementById("paquetesCount").textContent = `${state.paquetes.length} registro${state.paquetes.length === 1 ? "" : "s"}`;
    list.innerHTML = state.paquetes.length ? state.paquetes.map((item) => `
      <article class="record-item">
        <div><h4>${escapeHtml(item.residente)} · Depto. ${escapeHtml(item.departamento)}</h4><p>${escapeHtml(item.descripcion)} · ${escapeHtml(item.empresa)} · ${escapeHtml(item.tracking)}</p></div>
        <div class="record-meta">Recibido: ${formatDate(item.creadoEn, true)}<br />Residente notificado ✓</div>
        <div class="record-actions"><span class="status ${item.estado === "Entregado" ? "status-ok" : "status-scheduled"}">${escapeHtml(item.estado)}</span>${item.estado !== "Entregado" ? `<button class="btn" type="button" data-deliver="${escapeHtml(item.id)}">Marcar entregado</button>` : ""}</div>
      </article>`).join("") : empty("Todavía no hay paquetes registrados.");
  }

  function renderStock() {
    const lowCount = state.stock.filter((item) => Number(item.actual) <= Number(item.minimo)).length;
    document.getElementById("stockCount").textContent = `${lowCount} alerta${lowCount === 1 ? "" : "s"}`;
    document.getElementById("stockList").innerHTML = state.stock.length ? state.stock.map((item) => {
      const low = Number(item.actual) <= Number(item.minimo);
      return `<article class="record-item">
        <div><h4>${escapeHtml(item.insumo)}</h4><p>Actual: ${escapeHtml(item.actual)} ${escapeHtml(item.unidad)} · Mínimo: ${escapeHtml(item.minimo)} ${escapeHtml(item.unidad)}</p></div>
        <div class="record-meta">Reportado: ${formatDate(item.creadoEn, true)}</div>
        <div class="record-actions"><span class="status ${low ? "status-low" : "status-ok"}">${low ? "Stock bajo" : "Nivel adecuado"}</span></div>
      </article>`;
    }).join("") : empty("Registra un insumo para comenzar el control de stock.");
  }

  function qrMarkup(code) {
    let seed = [...code].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return Array.from({ length: 121 }, (_, index) => {
      const row = Math.floor(index / 11);
      const column = index % 11;
      const finder = ((row < 3 || row > 7) && column < 3) || (row < 3 && column > 7);
      seed = (seed * 9301 + 49297) % 233280;
      return `<i class="qr-cell ${(finder || seed / 233280 > .5) ? "dark" : ""}"></i>`;
    }).join("");
  }

  function renderVisitas() {
    document.getElementById("visitasCount").textContent = `${state.visitas.length} credencial${state.visitas.length === 1 ? "" : "es"}`;
    document.getElementById("visitasList").innerHTML = state.visitas.length ? state.visitas.map((item) => `
      <article class="qr-card">
        <div class="qr-simulated" role="img" aria-label="QR simulado para ${escapeHtml(item.nombre)}">${qrMarkup(item.codigo)}</div>
        <div class="qr-details"><span class="status ${new Date(item.expiraEn) > new Date() ? "status-info" : "status-low"}">${new Date(item.expiraEn) > new Date() ? "Vigente" : "Vencido"}</span><h4>${escapeHtml(item.nombre)}</h4><p>Documento: ${escapeHtml(item.documento)}<br />Visita: ${escapeHtml(item.departamento)}<br />Ingreso: ${formatDate(item.fecha, true)}<br />Expira: ${formatDate(item.expiraEn, true)}</p><span class="qr-code">${escapeHtml(item.codigo)}</span></div>
      </article>`).join("") : empty("No se han generado credenciales de visita.");
  }

  function renderPersonal() {
    document.getElementById("personalCount").textContent = `${state.personal.length} persona${state.personal.length === 1 ? "" : "s"}`;
    document.getElementById("personalList").innerHTML = state.personal.length ? state.personal.map((item) => `
      <article class="record-item">
        <div><h4>${escapeHtml(item.nombre)} · ${escapeHtml(item.servicio)}</h4><p>${escapeHtml(item.documento)} · Depto. ${escapeHtml(item.departamento)}</p></div>
        <div class="record-meta">${escapeHtml(item.dias)}<br />${escapeHtml(item.inicio)} a ${escapeHtml(item.fin)}</div>
        <div class="record-actions"><span class="status status-ok">Autorizado</span></div>
      </article>`).join("") : empty("No hay personal doméstico autorizado.");
  }

  function renderMudanzas() {
    document.getElementById("mudanzasCount").textContent = `${state.mudanzas.length} orden${state.mudanzas.length === 1 ? "" : "es"}`;
    document.getElementById("mudanzasList").innerHTML = state.mudanzas.length ? state.mudanzas.map((item) => `
      <article class="record-item">
        <div><h4>${escapeHtml(item.tipo)} · ${escapeHtml(item.residente)}</h4><p>Depto. ${escapeHtml(item.departamento)} · ${formatDate(item.fecha)} · ${escapeHtml(item.inicio)} a ${escapeHtml(item.fin)}</p></div>
        <div class="record-meta"><span class="order-code">${escapeHtml(item.orden)}</span><br />Instalar protección antes del inicio y retirarla al finalizar.</div>
        <div class="record-actions"><span class="status status-scheduled">Programada</span></div>
      </article>`).join("") : empty("No hay mudanzas programadas.");
  }

  function updateStats() {
    document.getElementById("statPaquetes").textContent = state.paquetes.filter((item) => item.estado !== "Entregado").length;
    document.getElementById("statStock").textContent = state.stock.filter((item) => Number(item.actual) <= Number(item.minimo)).length;
    document.getElementById("statVisitas").textContent = state.visitas.filter((item) => new Date(item.expiraEn) > new Date()).length;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    document.getElementById("statMudanzas").textContent = state.mudanzas.filter((item) => new Date(`${item.fecha}T00:00:00`) >= today).length;
  }

  function renderAll() {
    renderPaquetes(); renderStock(); renderVisitas(); renderPersonal(); renderMudanzas(); updateStats();
  }

  document.getElementById("paqueteForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    state.paquetes.unshift({ id: uid("PAQ"), ...data, estado: "Pendiente", notificado: true, creadoEn: new Date().toISOString() });
    save("paquetes"); event.currentTarget.reset(); renderPaquetes(); updateStats();
    showToast(`Paquete registrado. ${data.residente} fue notificado.`);
  });

  document.getElementById("paquetesList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-deliver]");
    if (!button) return;
    const item = state.paquetes.find((entry) => entry.id === button.dataset.deliver);
    if (item) { item.estado = "Entregado"; item.entregadoEn = new Date().toISOString(); save("paquetes"); renderPaquetes(); updateStats(); showToast("Paquete marcado como entregado."); }
  });

  document.getElementById("stockForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const low = Number(data.actual) <= Number(data.minimo);
    state.stock.unshift({ id: uid("STK"), ...data, estado: low ? "Stock bajo" : "Nivel adecuado", creadoEn: new Date().toISOString() });
    save("stock"); event.currentTarget.reset(); renderStock(); updateStats();
    showToast(low ? `Alerta creada: reponer ${data.insumo}.` : `Nivel de ${data.insumo} registrado.`);
  });

  document.getElementById("visitaForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const ingreso = new Date(data.fecha);
    if (ingreso < new Date()) { showToast("La fecha de ingreso debe ser futura."); return; }
    const expiraEn = new Date(ingreso.getTime() + Number(data.vigencia) * 3600000).toISOString();
    state.visitas.unshift({ id: uid("VIS"), ...data, codigo: uid("UCQR"), expiraEn, creadoEn: new Date().toISOString() });
    save("visitas"); event.currentTarget.reset(); setDefaultDates(); renderVisitas(); updateStats();
    showToast(`QR simulado generado para ${data.nombre}.`);
  });

  document.getElementById("personalForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (data.fin <= data.inicio) { showToast("La hora de salida debe ser posterior al ingreso."); return; }
    state.personal.unshift({ id: uid("PER"), ...data, estado: "Autorizado", creadoEn: new Date().toISOString() });
    save("personal"); event.currentTarget.reset(); renderPersonal();
    showToast(`${data.nombre} quedó autorizado en el horario indicado.`);
  });

  document.getElementById("mudanzaForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (data.fin <= data.inicio) { showToast("La hora de fin debe ser posterior al inicio."); return; }
    const start = new Date(`${data.fecha}T${data.inicio}`);
    if (start < new Date()) { showToast("La mudanza debe programarse para una fecha y hora futuras."); return; }
    const conflict = state.mudanzas.some((item) => item.fecha === data.fecha && data.inicio < item.fin && data.fin > item.inicio);
    if (conflict) { showToast("Ese horario se cruza con otra mudanza programada."); return; }
    state.mudanzas.unshift({ id: uid("MUD"), ...data, orden: uid("ORD-ASC"), estado: "Programada", proteccionAscensor: true, creadoEn: new Date().toISOString() });
    save("mudanzas"); event.currentTarget.reset(); setDefaultDates(); renderMudanzas(); updateStats();
    showToast(`Mudanza programada. Orden de protección del ascensor generada.`);
  });

  initTabs(); setDefaultDates(); renderAll();
})();
