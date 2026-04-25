const addons = [
  {
    title: "Scene Ready",
    label: "Blender Scene Cleanup & Export Ready",
    description: "A practical scene preparation system for cleanup, checking, export readiness, reporting, and organized production workflows.",
    tags: ["Scene cleanup", "Export ready", "QA workflow"],
    image: "assets/addons/scene-ready.svg",
    tone: "rgba(227, 29, 35, 0.22)"
  },
  {
    title: "Quick Water - Ocean FX",
    label: "Water, waves, foam, and cinematic ocean tools",
    description: "A visual water toolkit for faster creation of ocean surfaces, wave setups, foam details, and animated water-based scenes.",
    tags: ["Water FX", "Ocean", "Foam"],
    image: "assets/addons/quick-water-oceanfx.svg",
    tone: "rgba(31, 44, 59, 0.16)"
  },
  {
    title: "HDRI Sky Pro",
    label: "Lighting and HDRI environment workflow",
    description: "A focused environment lighting tool for artists who want better mood, faster look development, and easier sky-based lighting control.",
    tags: ["HDRI", "Lighting", "Lookdev"],
    image: "assets/addons/hdri-sky-pro.svg",
    tone: "rgba(255, 90, 95, 0.18)"
  },
  {
    title: "Quick Sky Pro",
    label: "Procedural clouds and customizable sky controls",
    description: "A Blender addon focused on realistic, customizable cloud creation with presets and direct artist controls for sky scenes.",
    tags: ["Clouds", "Atmosphere", "Presets"],
    image: "assets/addons/quick-sky-pro.svg",
    tone: "rgba(227, 29, 35, 0.18)"
  },
  {
    title: "Auto Render Pro",
    label: "Render automation for repeatable output",
    description: "A compact production helper for faster render setup, repeatable output, and cleaner automation when working across Blender projects.",
    tags: ["Rendering", "Automation", "Batch work"],
    image: "assets/addons/auto-render-pro.svg",
    tone: "rgba(31, 44, 59, 0.14)"
  },
  {
    title: "Quick Mushrooms",
    label: "Nature assets for stylized and cinematic scenes",
    description: "A nature-focused product for enriching environments with organic details, fantasy accents, and fast scene decoration.",
    tags: ["Nature", "Assets", "Environment"],
    image: "assets/addons/quick-mushrooms.svg",
    tone: "rgba(255, 90, 95, 0.16)"
  }
];

const slider = document.querySelector("#addonSlider");
const dots = document.querySelector("#sliderDots");
const prev = document.querySelector("#prevSlide");
const next = document.querySelector("#nextSlide");
let current = 0;
let timer;

function buildSlider() {
  slider.innerHTML = addons.map((addon, index) => `
    <article class="slide ${index === 0 ? "active" : ""}" style="--tone:${addon.tone};">
      <div class="slide-info">
        <div>
          <div class="slide-number"><span>0${index + 1}</span><span>${addons.length < 10 ? "0" + addons.length : addons.length}</span></div>
          <h3>${addon.title}</h3>
          <p>${addon.description}</p>
          <div class="tags">${addon.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}</div>
        </div>
        <a class="btn btn-soft" href="https://superhivemarket.com/creators/mambacg" target="_blank" rel="noreferrer">View on Superhive</a>
      </div>
      <div class="slide-media">
        <div class="addon-image" style="--image:url('${addon.image}');"></div>
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
  timer = window.setInterval(() => {
    current = (current + 1) % addons.length;
    updateSlider();
  }, 5200);
}

function restartAutoplay() {
  window.clearInterval(timer);
  startAutoplay();
}

buildSlider();
startAutoplay();

next.addEventListener("click", nextSlide);
prev.addEventListener("click", prevSlide);
slider.addEventListener("mouseenter", () => window.clearInterval(timer));
slider.addEventListener("mouseleave", startAutoplay);

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") nextSlide();
  if (event.key === "ArrowLeft") prevSlide();
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
document.querySelector("#year").textContent = new Date().getFullYear();
