// The page works from a local file, with no build step or external dependencies.
// Pause the decorative SVG animation when the visitor prefers reduced motion.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const demoVideos = [...document.querySelectorAll('video[data-autoplay]')];
const visibleVideos = new Set();
function syncVideo(video) {
  video.muted = true;
  video.autoplay = visibleVideos.has(video) && !motionPreference.matches;
  if (video.autoplay) {
    video.play().catch(() => {}); // Native controls remain available if autoplay is blocked.
  } else video.pause();
}
function updateMotion() {
  document.querySelectorAll('svg').forEach((svg) => {
    if (typeof svg.pauseAnimations !== 'function') return;
    if (motionPreference.matches) svg.pauseAnimations();
    else svg.unpauseAnimations();
  });
  demoVideos.forEach(syncVideo);
}
updateMotion();
motionPreference.addEventListener('change', updateMotion);

function loadVideo(video) {
  // Keep a real HTML src so native Play works even when preview scripts are blocked.
  if (video.preload !== 'none') return;
  video.preload = 'metadata';
}
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({target: video, isIntersecting}) => {
      if (isIntersecting) {
        loadVideo(video);
        visibleVideos.add(video);
      } else visibleVideos.delete(video);
      syncVideo(video);
    });
  }, {rootMargin: '160px 0px'});
  demoVideos.forEach(video => observer.observe(video));
} else {
  demoVideos.forEach(video => { loadVideo(video); visibleVideos.add(video); syncVideo(video); });
}
