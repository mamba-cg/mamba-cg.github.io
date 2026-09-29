(() => {
  const video = document.getElementById('demo-video');
  const status = document.getElementById('video-status');
  const chapters = [...document.querySelectorAll('.chapters button')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!video) return;
  document.querySelectorAll('button[data-time]').forEach(button => {
    button.addEventListener('click', async () => {
      video.currentTime = Number(button.dataset.time);
      if (button.classList.contains('scene-play')) {
        document.getElementById('showreel').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
      }
      try { await video.play(); status.textContent = ''; }
      catch { status.textContent = 'Press Play in the video player to start this scene.'; }
    });
  });
  video.addEventListener('timeupdate', () => {
    const active = Math.min(5, Math.floor(video.currentTime / 8));
    chapters.forEach((button, i) => {
      if (i === active) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
  });
  video.addEventListener('error', () => {
    status.textContent = 'The video could not be loaded. Please reload the page or try again later.';
  });
})();
