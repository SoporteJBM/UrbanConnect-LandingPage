document.addEventListener("DOMContentLoaded", () => {
  const configs = [
    {
      panel: ".reports-panel",
      list: ".report-list",
      card: ".report-card",
      searchable: [".report-info", ".report-meta"],
      statusSelector: ".status",
      categorySelector: ".tag"
    },
    {
      panel: ".announcements-panel",
      list: ".announcement-list",
      card: ".announcement-card",
      searchable: [".announcement-info", ".announcement-meta"],
      statusSelector: ".status",
      categorySelector: ".category"
    },
    {
      panel: ".payments-panel",
      list: ".payment-list",
      card: ".payment-card",
      searchable: [".payment-info", ".payment-meta"],
      statusSelector: ".status",
      categorySelector: ".tag"
    }
  ];

  configs.forEach(setupFilters);
});

function setupFilters(config) {
  const panel = document.querySelector(config.panel);
  const list = document.querySelector(config.list);

  if (!panel || !list) {
    return;
  }

  const cards = Array.from(list.querySelectorAll(config.card));
  const tabs = Array.from(panel.querySelectorAll(".tab"));
  const searchInput = panel.querySelector(".search-box input");
  const selects = Array.from(panel.querySelectorAll(".filters select"));
  const categorySelect = selects[0];
  const stateSelect = selects.find((select) =>
    Array.from(select.options).some((option) => isStateFilter(option.textContent))
  );

  let emptyState = list.querySelector(".empty-state");
  if (!emptyState) {
    emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.textContent = "No hay resultados con los filtros seleccionados.";
    emptyState.hidden = true;
    list.appendChild(emptyState);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  selects.forEach((select) => {
    select.addEventListener("change", applyFilters);
  });

  applyFilters();

  function applyFilters() {
    const activeTab = normalize(panel.querySelector(".tab.active")?.textContent || "todos");
    const searchTerm = normalize(searchInput?.value || "");
    const category = normalize(categorySelect?.value || "");
    const state = normalize(stateSelect?.value || "");
    let visibleCount = 0;

    cards.forEach((card) => {
      const text = normalize(getCardText(card, config.searchable));
      const cardStatus = normalize(card.querySelector(config.statusSelector)?.textContent || "");
      const cardCategory = normalize(card.querySelector(config.categorySelector)?.textContent || "");

      const matchesSearch = !searchTerm || text.includes(searchTerm);
      const matchesTab = matchesTabFilter(activeTab, cardStatus, text);
      const matchesCategory = matchesSelectFilter(category, cardCategory, text);
      const matchesState = matchesSelectFilter(state, cardStatus, text);
      const isVisible = matchesSearch && matchesTab && matchesCategory && matchesState;

      card.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
      }
    });

    emptyState.hidden = visibleCount !== 0;
  }
}

function getCardText(card, selectors) {
  const selectedText = selectors
    .map((selector) => card.querySelector(selector)?.textContent || "")
    .join(" ");

  return selectedText || card.textContent;
}

function matchesTabFilter(tab, status, text) {
  if (!tab || ["todos", "todas"].includes(tab)) {
    return true;
  }

  if (tab === "publicados") {
    return status.includes("publicado");
  }

  if (tab === "borradores") {
    return status.includes("borrador") || text.includes("borrador");
  }

  if (tab === "programados") {
    return status.includes("programado") || text.includes("programado");
  }

  if (tab === "pagados") {
    return status.includes("pagado");
  }

  if (tab === "pendientes") {
    return status.includes("pendiente");
  }

  if (tab === "vencidos") {
    return status.includes("vencido");
  }

  if (tab === "abiertos") {
    return status.includes("abierto");
  }

  if (tab === "resueltos") {
    return status.includes("resuelto");
  }

  if (tab === "cancelados" || tab === "canceladas") {
    return status.includes("cancelado") || status.includes("cancelada");
  }

  if (tab === "activas") {
    return status.includes("activa") || text.includes("activa");
  }

  if (tab === "cerradas") {
    return status.includes("cerrada") || text.includes("cerrada");
  }

  if (tab === "confirmadas") {
    return status.includes("confirmada");
  }

  if (tab === "completados") {
    return status.includes("completado") || text.includes("completado");
  }

  if (tab === "asignados") {
    return status.includes("asignado") || text.includes("asignado");
  }

  if (tab === "convenios") {
    return status.includes("convenio") || text.includes("convenio");
  }

  if (tab === "administradores") {
    return text.includes("administrador");
  }

  if (tab === "residentes") {
    return text.includes("residente");
  }

  if (tab === "reglamentos" || tab === "actas" || tab === "contratos") {
    return text.includes(tab.slice(0, -1)) || text.includes(tab);
  }

  return status.includes(tab) || text.includes(tab);
}

function matchesSelectFilter(value, primaryText, allText) {
  if (!value || value.startsWith("todos") || value.startsWith("todas") || value.startsWith("mas ")) {
    return true;
  }

  return primaryText.includes(value) || allText.includes(value);
}

function isStateFilter(text) {
  const value = normalize(text);
  return [
    "todos los estados",
    "pagado",
    "pendiente",
    "vencido",
    "abierto",
    "en proceso",
    "resuelto",
    "cancelado",
    "activo",
    "bloqueado"
  ].includes(value);
}

function normalize(value) {
  return value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
