const audio = document.getElementById('audio');
const trackTitle = document.getElementById('trackTitle');
const trackMeta = document.getElementById('trackMeta');

const playlistLinks = Array.from(document.querySelectorAll('.inline-playlist a'));

playlistLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const src = link.getAttribute('href');
    if (!src) {
      return;
    }

    trackTitle.textContent = link.textContent;
    trackMeta.textContent = 'Now playing';
    audio.src = src;
    audio.load();
    audio.play().catch(() => {
      trackMeta.textContent = 'Tap play to start the music.';
    });
  });
});
