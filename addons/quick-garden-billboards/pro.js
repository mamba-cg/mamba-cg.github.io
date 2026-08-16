const proSlider = document.querySelector("[data-pro-slider]");

if (proSlider) {
  const track = proSlider.querySelector(".pro-slider-track");
  const slides = [...proSlider.querySelectorAll(".pro-slide")];
  const current = proSlider.querySelector("[data-pro-current]");
  const progress = proSlider.querySelector(".pro-slider-progress span");
  const timerLine = proSlider.querySelector(".pro-slider-timer span");
  const previous = proSlider.querySelector("[data-pro-prev]");
  const next = proSlider.querySelector("[data-pro-next]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)");
  let index = 0;
  let pointerStart = null;
  let interval = null;

  const restartLine = () => {
    timerLine.style.animation = "none";
    void timerLine.offsetWidth;
    timerLine.style.animation = "";
  };

  const show = (target) => {
    index = (target + slides.length) % slides.length;
    track.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
    current.textContent = String(index + 1).padStart(2, "0");
    progress.style.transform = `scaleX(${(index + 1) / slides.length})`;
    slides.forEach((slide, slideIndex) => {
      slide.setAttribute("aria-hidden", slideIndex !== index);
    });
    if (!reducedMotion.matches) restartLine();
  };

  const stopAuto = () => {
    window.clearInterval(interval);
    interval = null;
    proSlider.classList.add("is-paused");
  };

  const startAuto = () => {
    stopAuto();
    proSlider.classList.remove("is-paused");
    if (reducedMotion.matches) return;
    restartLine();
    interval = window.setInterval(() => show(index + 1), 6500);
  };

  const moveManually = (direction) => {
    show(index + direction);
    startAuto();
  };

  previous.addEventListener("click", () => moveManually(-1));
  next.addEventListener("click", () => moveManually(1));
  proSlider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") moveManually(-1);
    if (event.key === "ArrowRight") moveManually(1);
  });
  track.addEventListener("pointerdown", (event) => {
    pointerStart = event.clientX;
  });
  track.addEventListener("dragstart", (event) => event.preventDefault());
  track.addEventListener("pointerup", (event) => {
    if (pointerStart === null) return;
    const distance = event.clientX - pointerStart;
    if (Math.abs(distance) > 55) moveManually(distance < 0 ? 1 : -1);
    pointerStart = null;
  });
  track.addEventListener("pointercancel", () => {
    pointerStart = null;
  });
  if (hoverCapable.matches) {
    proSlider.addEventListener("pointerenter", stopAuto);
    proSlider.addEventListener("pointerleave", startAuto);
  }
  proSlider.addEventListener("focusin", stopAuto);
  proSlider.addEventListener("focusout", () => {
    window.requestAnimationFrame(() => {
      if (!proSlider.contains(document.activeElement)) startAuto();
    });
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAuto();
    else startAuto();
  });
  reducedMotion.addEventListener("change", startAuto);
  show(0);
  startAuto();
}

const proRevealTargets = document.querySelectorAll(
  ".pro-metrics article, .pro-pitch > div, .pro-cta",
);

if ("IntersectionObserver" in window) {
  const proObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        proObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );
  proRevealTargets.forEach((target, index) => {
    target.classList.add("reveal");
    target.style.setProperty("--reveal-delay", `${(index % 3) * 90}ms`);
    proObserver.observe(target);
  });
}
