const inventoryAssets = [
  {
    "id": "INV-1001",
    "fileName": "demo_s01e02_master_fhd_2398.mov",
    "class": "video",
    "locale": "-",
    "version": "simulcast",
    "status": "Ready"
  },
  {
    "id": "INV-1002",
    "fileName": "demo_s01e02_master_fhd_2398_proxy.mp4",
    "class": "video",
    "locale": "-",
    "version": "proxy",
    "status": "Ready"
  },
  {
    "id": "INV-1003",
    "fileName": "demo_s01e02_audio_en-us_51.wav",
    "class": "audio",
    "locale": "en-US",
    "version": "simulcast",
    "status": "Ready"
  },
  {
    "id": "INV-1004",
    "fileName": "demo_s01e02_audio_ja-jp_20.wav",
    "class": "audio",
    "locale": "ja-JP",
    "version": "simulcast",
    "status": "Ready"
  },
  {
    "id": "INV-1005",
    "fileName": "demo_s01e02_subtitle_en-us_full.vtt",
    "class": "subtitle",
    "locale": "en-US",
    "version": "simulcast",
    "status": "Ready"
  },
  {
    "id": "INV-1006",
    "fileName": "demo_s01e02_subtitle_en-us_forced.vtt",
    "class": "forced",
    "locale": "en-US",
    "version": "simulcast",
    "status": "Review"
  },
  {
    "id": "INV-1007",
    "fileName": "demo_s01e02_caption_en-us_sdh.vtt",
    "class": "caption",
    "locale": "en-US",
    "version": "simulcast",
    "status": "Ready"
  },
  {
    "id": "INV-1008",
    "fileName": "demo_s01e02_subtitle_es-es_full.vtt",
    "class": "subtitle",
    "locale": "es-ES",
    "version": "simulcast",
    "status": "Ready"
  },
  {
    "id": "INV-1009",
    "fileName": "demo_s01e02_subtitle_fr-fr_full.vtt",
    "class": "subtitle",
    "locale": "fr-FR",
    "version": "uncut",
    "status": "Ready"
  },
  {
    "id": "INV-1010",
    "fileName": "demo_s01e02_subtitle_pt-br_forced.vtt",
    "class": "forced",
    "locale": "pt-BR",
    "version": "uncut",
    "status": "Review"
  },
  {
    "id": "INV-1011",
    "fileName": "demo_s01e02_keyart_main.jpg",
    "class": "image",
    "locale": "-",
    "version": "global",
    "status": "Ready"
  },
  {
    "id": "INV-1012",
    "fileName": "demo_s01e02_metadata_delivery.xml",
    "class": "metadata",
    "locale": "-",
    "version": "global",
    "status": "Ready"
  }
];

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks.classList.toggle("is-open", !isOpen);
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navToggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("is-open");
    }
  });
}

document.querySelectorAll("[data-current-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

function setupInventoryDemo(root) {
  let loadedCount = 6;
  const selected = new Set();
  const rows = root.querySelector("[data-inventory-rows]");
  const queue = root.querySelector("[data-inventory-queue]");
  const search = root.querySelector("[data-inventory-search]");
  const mode = root.querySelector("[data-inventory-mode]");
  const classFilter = root.querySelector("[data-inventory-class]");
  const localeFilter = root.querySelector("[data-inventory-locale]");
  const loaded = root.querySelector("[data-inventory-loaded]");
  const visible = root.querySelector("[data-inventory-visible]");
  const selectedCount = root.querySelector("[data-inventory-selected]");
  const log = root.querySelector("[data-inventory-log]");
  const modal = root.querySelector("[data-inventory-modal]");

  function matches(asset) {
    const query = search.value.trim();
    const classValue = classFilter.value;
    const localeValue = localeFilter.value;

    if (classValue !== "all" && asset.class !== classValue) return false;
    if (localeValue !== "all" && asset.locale !== localeValue) return false;
    if (!query) return true;

    if (mode.value === "exact") return asset.fileName.toLowerCase() === query.toLowerCase();
    if (mode.value === "regex") {
      try {
        return new RegExp(query, "i").test(asset.fileName);
      } catch {
        return false;
      }
    }

    return query.toLowerCase().split(/\s+/).every((part) => asset.fileName.toLowerCase().includes(part));
  }

  function renderQueue() {
    selectedCount.textContent = String(selected.size);
    queue.innerHTML = Array.from(selected).map((id) => {
      const asset = inventoryAssets.find((item) => item.id === id);
      return asset ? '<li><code>' + asset.fileName + '</code></li>' : "";
    }).join("") || "<li>No files queued.</li>";
  }

  function render() {
    const assets = inventoryAssets.slice(0, loadedCount);
    const filtered = assets.filter(matches);
    rows.innerHTML = filtered.map((asset) => {
      const queued = selected.has(asset.id);
      const label = queued ? "In" : "Add";
      return '<tr><td><button class="queue-toggle" type="button" data-queue-id="' + asset.id + '" aria-pressed="' + String(queued) + '">' + label + '</button></td><td><span class="status-badge">' + asset.class + '</span></td><td><code>' + asset.fileName + '</code></td><td>' + asset.locale + '</td></tr>';
    }).join("");
    loaded.textContent = String(loadedCount);
    visible.textContent = String(filtered.length);
    renderQueue();
  }

  rows.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-queue-id]");
    if (!button) return;
    const id = button.getAttribute("data-queue-id");
    if (!id) return;
    if (selected.has(id)) selected.delete(id);
    else selected.add(id);
    render();
  });

  [search, mode, classFilter, localeFilter].forEach((control) => control.addEventListener("input", render));

  root.querySelector("[data-inventory-hydrate]").addEventListener("click", () => {
    loadedCount = inventoryAssets.length;
    log.textContent = "Hydrated virtualized inventory until row count stabilized. Listed " + loadedCount + " fictional assets.";
    render();
  });

  root.querySelector("[data-inventory-clear]").addEventListener("click", () => {
    search.value = "";
    mode.value = "and";
    classFilter.value = "all";
    localeFilter.value = "all";
    selected.clear();
    log.textContent = "Filters reset.";
    render();
  });

  root.querySelector("[data-inventory-open-modal]").addEventListener("click", () => {
    if (!selected.size) {
      log.textContent = "Select at least one file before reviewing a simulated action.";
      return;
    }
    modal.hidden = false;
  });

  root.querySelector("[data-inventory-cancel]").addEventListener("click", () => {
    modal.hidden = true;
  });

  root.querySelector("[data-inventory-confirm]").addEventListener("click", () => {
    log.textContent = "Simulated review complete for " + selected.size + " queued file(s). No files were deleted.";
    selected.clear();
    modal.hidden = true;
    render();
  });

  render();
}

document.querySelectorAll("[data-inventory-demo]").forEach(setupInventoryDemo);

document.querySelectorAll("[data-reconciliation-demo]").forEach((root) => {
  const run = root.querySelector("[data-recon-run]");
  const activity = root.querySelector("[data-recon-activity]");
  const log = root.querySelector("[data-recon-log]");
  run.addEventListener("click", () => {
    activity.innerHTML = [
      "Read 3 unchecked tracker requirements.",
      "Opened authenticated ingest interface with Puppeteer.",
      "Searched ALP-204 and collected candidates.",
      "Verified DONE status for en-US subtitle and ja-JP dub.",
      "Stopped pt-BR forced narrative row for manual review."
    ].map((item) => "<li>" + item + "</li>").join("");

    root.querySelectorAll(".check").forEach((check, index) => {
      check.classList.toggle("done", index < 2);
      check.classList.toggle("empty", index >= 2);
    });

    log.textContent = "2 fields updated from unchecked to checked. 1 row routed to manual review because multiple candidates matched.";
  });
});

document.querySelectorAll("[data-video-demo]").forEach((root) => {
  const output = root.querySelector("[data-diff-output]");
  root.querySelectorAll("[data-diff-range]").forEach((button) => {
    button.addEventListener("click", () => {
      root.querySelectorAll("[data-diff-range]").forEach((node) => node.classList.remove("is-active"));
      button.classList.add("is-active");
      output.textContent = button.getAttribute("data-diff-range") + " selected for screenshot and report review.";
    });
  });

  const exportButton = root.querySelector("[data-report-export]");
  exportButton.addEventListener("click", () => {
    output.textContent = "Simulated report export: metadata, detected ranges, screenshots and audio-offset notes prepared for human review.";
  });
});

document.querySelectorAll("[data-oped-demo]").forEach((root) => {
  root.querySelector("[data-oped-approve]").addEventListener("click", () => {
    root.querySelector("[data-oped-status]").textContent = "Approved in demo";
    root.querySelector("[data-oped-table-status]").textContent = "Human approved";
  });
});

const motionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (motionAllowed && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  document.querySelectorAll(".project-card, .practice-list article, .metric-card, .demo-panel, .case-section").forEach((node) => {
    node.classList.add("reveal");
    observer.observe(node);
  });
}
