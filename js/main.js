const navShell = document.querySelector('.nav-shell');
const menuButton = document.querySelector('.menu-button');

if (menuButton && navShell) {
  menuButton.addEventListener('click', () => {
    const isOpen = navShell.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelectorAll('img[data-fallback]').forEach((image) => {
  image.addEventListener('error', () => {
    const fallback = image.getAttribute('data-fallback');
    if (fallback && image.src.indexOf(fallback) === -1) image.src = fallback;
  });
});

const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.16 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
