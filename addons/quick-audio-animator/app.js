(() => {
  'use strict';

  const videos = [...document.querySelectorAll('.qaa-video')];

  function getButton(video) {
    return video.closest('.video-showcase')?.querySelector('.sound-toggle-large') || null;
  }

  function syncButton(video) {
    const button = getButton(video);
    if (!button) return;
    const soundOn = !video.muted;
    button.textContent = soundOn ? 'Mute Sound' : 'Enable Sound';
    button.setAttribute('aria-pressed', String(soundOn));
  }

  function muteOthers(activeVideo) {
    videos.forEach(video => {
      if (video !== activeVideo) {
        video.muted = true;
        syncButton(video);
      }
    });
  }

  videos.forEach(video => {
    video.muted = true;
    video.defaultMuted = true;
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    syncButton(video);

    const button = getButton(video);
    if (button) {
      button.addEventListener('click', () => {
        const enable = video.muted;
        if (enable) muteOthers(video);
        video.muted = !enable;
        syncButton(video);
        if (video.paused) video.play().catch(() => {});
      });
    }
  });

  const picker = document.querySelector('[data-scene-picker]');
  if (picker) {
    const buttons = [...picker.querySelectorAll('[data-scene]')];
    const panels = [...document.querySelectorAll('[data-scene-panel]')];
    picker.setAttribute('role', 'tablist');

    buttons.forEach(button => {
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', 'false');
      button.tabIndex = -1;
    });

    panels.forEach(panel => {
      panel.setAttribute('role', 'tabpanel');
      panel.hidden = true;
    });

    function select(button, focus = false) {
      buttons.forEach(other => {
        const active = other === button;
        other.setAttribute('aria-selected', String(active));
        other.tabIndex = active ? 0 : -1;
      });

      panels.forEach(panel => {
        const active = panel.dataset.scenePanel === button.dataset.scene;
        panel.hidden = !active;
        const video = panel.querySelector('video');
        if (!video) return;
        video.muted = true;
        syncButton(video);
        if (active) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });

      if (focus) button.focus();
    }

    buttons.forEach((button, index) => {
      button.addEventListener('click', () => select(button));
      button.addEventListener('keydown', event => {
        let next;
        if (['ArrowRight','ArrowDown'].includes(event.key)) next = (index + 1) % buttons.length;
        else if (['ArrowLeft','ArrowUp'].includes(event.key)) next = (index - 1 + buttons.length) % buttons.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = buttons.length - 1;
        if (next !== undefined) {
          event.preventDefault();
          select(buttons[next], true);
        }
      });
    });

    if (buttons.length) select(buttons[0]);
  }
})();
