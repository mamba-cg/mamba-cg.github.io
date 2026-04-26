const storeUrl = "https://superhivemarket.com/creators/mambacg";

const addons = [
  {
    title: "Scene Ready",
    label: "Scene cleanup and export workflow",
    description: "Prepare Blender scenes for production with cleanup, checking, organization, and export-readiness workflows.",
    tags: ["Scene cleanup", "Export ready", "QA workflow"],
    image: "assets-template/addons/scene-ready.svg",
    tone: "rgba(227, 29, 35, 0.22)"
  },
  {
    title: "Quick Water - Ocean FX",
    label: "Water, waves, foam, and cinematic ocean tools",
    description: "Create water surfaces, ocean looks, wave motion, and foam details with a faster artist-facing setup.",
    tags: ["Water FX", "Ocean", "Foam"],
    image: "assets-template/addons/quick-water-oceanfx.svg",
    tone: "rgba(31, 44, 59, 0.18)"
  },
  {
    title: "HDRI Sky Pro",
    label: "HDRI environment lighting workflow",
    description: "Speed up environment lighting and look development with sky-based controls for cinematic scenes.",
    tags: ["HDRI", "Lighting", "Lookdev"],
    image: "assets-template/addons/hdri-sky-pro.svg",
    tone: "rgba(255, 90, 95, 0.20)"
  },
  {
    title: "Quick Sky Pro",
    label: "Procedural clouds and sky controls",
    description: "Build customizable skies and cloud moods through direct controls and reusable presets.",
    tags: ["Clouds", "Atmosphere", "Presets"],
    image: "assets-template/addons/quick-sky-pro.svg",
    tone: "rgba(227, 29, 35, 0.18)"
  },
  {
    title: "Auto Render Pro",
    label: "Render automation for repeatable output",
    description: "Automate render setup and repeatable output tasks when moving across Blender projects.",
    tags: ["Rendering", "Automation", "Batch work"],
    image: "assets-template/addons/auto-render-pro.svg",
    tone: "rgba(31, 44, 59, 0.16)"
  },
  {
    title: "Quick Mushrooms",
    label: "Nature assets-template for stylized and cinematic scenes",
    description: "Add organic details, fantasy accents, and natural set dressing to environment scenes faster.",
    tags: ["Nature", "assets-template", "Environment"],
    image: "assets-template/addons/quick-mushrooms.svg",
    tone: "rgba(255, 90, 95, 0.17)"
  },
  {
    title: "Light Master Pro",
    label: "Focused lighting controls for Blender scenes",
    description: "Manage scene lighting direction, setup choices, and production adjustments from a cleaner workflow layer.",
    tags: ["Lighting", "Control", "Cinematic"],
    image: "assets-template/addons/light-master-pro.svg",
    tone: "rgba(227, 29, 35, 0.20)"
  },
  {
    title: "Easy Fog",
    label: "Atmospheric depth and fog workflow",
    description: "Add fog, haze, and cinematic depth to scenes with practical controls for atmosphere-driven shots.",
    tags: ["Fog", "Atmosphere", "Depth"],
    image: "assets-template/addons/easy-fog.svg",
    tone: "rgba(31, 44, 59, 0.17)"
  }
];

const workflowTabs = {
  choose: {
    title: "Choose",
    text: "Select a tool for sky, water, lighting, scene cleanup, render automation, or environment assets-template based on the shot you are building.",
    label: "Choose the production tool",
    art: "radial-gradient(circle at 24% 22%, rgba(227,29,35,.26), transparent 30%), radial-gradient(circle at 72% 24%, rgba(31,44,59,.18), transparent 28%)"
  },
  import: {
    title: "Import",
    text: "Add presets, objects, atmosphere systems, or node-driven setups directly into Blender without rebuilding every piece by hand.",
    label: "Bring presets into Blender",
    art: "linear-gradient(135deg, rgba(227,29,35,.22), transparent 38%), repeating-linear-gradient(90deg, rgba(31,44,59,.08) 0 10px, transparent 10px 28px)"
  },
  adjust: {
    title: "Adjust",
    text: "Use clean UI controls to tune the result, change the look, and keep the workflow editable as the scene evolves.",
    label: "Tune with artist controls",
    art: "radial-gradient(circle at 58% 30%, rgba(255,90,95,.25), transparent 30%), linear-gradient(90deg, rgba(31,44,59,.12), transparent)"
  },
  render: {
    title: "Render",
    text: "Produce cinematic images faster with organized setup, lighting choices, and automation that supports repeatable output.",
    label: "Render cleaner final images",
    art: "conic-gradient(from 140deg at 50% 50%, rgba(227,29,35,.26), rgba(255,255,255,.25), rgba(31,44,59,.18), rgba(227,29,35,.26))"
  },
  export: {
    title: "Export",
    text: "Prepare scenes, reports, assets-template, or final outputs with a workflow mindset that keeps handoff and reuse clearer.",
    label: "Prepare final output",
    art: "linear-gradient(135deg, rgba(31,44,59,.18), transparent 44%), radial-gradient(circle at 30% 70%, rgba(227,29,35,.24), transparent 28%)"
  }
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const slider = document.querySelector("#addonSlider");
const dots = document.querySelector("#sliderDots");
const prev = document.querySelector("#prevSlide");
const next = document.querySelector("#nextSlide");
let current = 0;
let timer = null;

function buildSlider() {
  if (!slider || !dots) return;

  slider.innerHTML = addons.map((addon, index) => `
    <article class="slide ${index === 0 ? "active" : ""}" style="--tone:${addon.tone};">
      <div class="slide-info">
        <div>
          <div class="slide-number"><span>${String(index + 1).padStart(2, "0")}</span><span>${String(addons.length).padStart(2, "0")}</span></div>
          <h3>${addon.title}</h3>
          <p>${addon.description}</p>
          <div class="tags">${addon.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}</div>
        </div>
        <div class="slide-actions">
          <a class="btn btn-primary" href="${storeUrl}" target="_blank" rel="noreferrer">View Product</a>
          <a class="btn btn-secondary" href="#workflow">See Workflow</a>
        </div>
      </div>
      <div class="slide-media">
        <div class="addon-image"><img src="${addon.image}" alt="${addon.title} product visual"></div>
        <div class="mock-ui">
          <div class="mock-title"><b>${addon.title}</b><span>${addon.label}</span></div>
          <div class="mock-button">Blender Tool</div>
        </div>
      </div>
    </article>
  `).join("");

  dots.innerHTML = addons.map((_, index) => `
    <button class="dot ${index === 0 ? "active" : ""}" type="button" aria-label="Go to slide ${index + 1}"></button>
  `).join("");

  dots.querySelectorAll(".dot").forEach((dot, index) => {
    dot.addEventListener("click", () => goToSlide(index));
  });
}

function updateSlider() {
  document.querySelectorAll(".slide").forEach((slide, index) => {
    slide.classList.toggle("active", index === current);
  });

  document.querySelectorAll(".dot").forEach((dot, index) => {
    dot.classList.toggle("active", index === current);
  });
}

function goToSlide(index) {
  current = (index + addons.length) % addons.length;
  updateSlider();
  restartAutoplay();
}

function nextSlide() {
  goToSlide(current + 1);
}

function prevSlide() {
  goToSlide(current - 1);
}

function startAutoplay() {
  if (prefersReducedMotion || !slider) return;
  stopAutoplay();
  timer = window.setInterval(() => {
    current = (current + 1) % addons.length;
    updateSlider();
  }, 5200);
}

function stopAutoplay() {
  if (timer) window.clearInterval(timer);
  timer = null;
}

function restartAutoplay() {
  stopAutoplay();
  startAutoplay();
}

function setupSlider() {
  buildSlider();
  startAutoplay();
  next?.addEventListener("click", nextSlide);
  prev?.addEventListener("click", prevSlide);
  slider?.addEventListener("mouseenter", stopAutoplay);
  slider?.addEventListener("mouseleave", startAutoplay);
  slider?.addEventListener("focusin", stopAutoplay);
  slider?.addEventListener("focusout", startAutoplay);

  document.addEventListener("keydown", (event) => {
    const activeTag = document.activeElement?.tagName;
    if (activeTag === "INPUT" || activeTag === "TEXTAREA") return;
    if (event.key === "ArrowRight") nextSlide();
    if (event.key === "ArrowLeft") prevSlide();
  });
}

function setupTabs() {
  const tabCopy = document.querySelector("#tabCopy");
  const tabVisual = document.querySelector("#tabVisual");
  const tabs = document.querySelectorAll(".tab");

  function activateTab(name) {
    const data = workflowTabs[name] || workflowTabs.choose;
    tabs.forEach(tab => {
      const active = tab.dataset.tab === name;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    if (tabCopy) {
      tabCopy.innerHTML = `<h3>${data.title}</h3><p>${data.text}</p>`;
    }
    if (tabVisual) {
      tabVisual.style.setProperty("--tab-art", data.art);
      tabVisual.dataset.label = data.label;
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => activateTab(tab.dataset.tab));
  });

  activateTab("choose");
}

function setupMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#navLinks");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupGalleryFilters() {
  const filters = document.querySelectorAll(".filter");
  const tiles = document.querySelectorAll(".gallery-tile");

  filters.forEach(filter => {
    filter.addEventListener("click", () => {
      const selected = filter.dataset.filter;
      filters.forEach(item => item.classList.toggle("active", item === filter));
      tiles.forEach(tile => {
        tile.hidden = selected !== "all" && tile.dataset.category !== selected;
      });
    });
  });
}

function setupReveal() {
  const elements = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach(element => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  elements.forEach(element => observer.observe(element));
}

setupSlider();
setupTabs();
setupMobileMenu();
setupGalleryFilters();
setupReveal();

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();
