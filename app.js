const audio = document.getElementById('audio');
const playlistEl = document.getElementById('playlist');
const trackTitle = document.getElementById('trackTitle');
const trackMeta = document.getElementById('trackMeta');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const seekBar = document.getElementById('seekBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeRange = document.getElementById('volumeRange');
const playlistCount = document.getElementById('playlistCount');
const emptyState = document.getElementById('emptyState');

const tracks = [];
let currentIndex = -1;

const publicFiles = [
  '1323436_Creo---In-Synergy.mp3',
  '1362038_Creo---Mantarave.mp3',
  'creo-aurora-128-ytshorts.savetube.me.mp3',
  'creo-ballistic-funk-128-ytshorts.savetube.me.mp3',
  'creo-crazy-128-ytshorts.savetube.me.mp3',
  'creo-high-tide-128-ytshorts.savetube.me.mp3',
  'creo-lightmare-128-ytshorts.savetube.me.mp3',
  'creo-red-haze-128-ytshorts.savetube.me.mp3',
  'creo-rock-thing-128-ytshorts.savetube.me.mp3',
  'creo-we-can-dream-128-ytshorts.savetube.me.mp3'
];

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function normalizeTitleKey(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function getDisplayTitle(filePath) {
  const name = filePath.split('/').pop().replace(/\.(mp3|m4a|wav)$/i, '');
  const titleMap = {
    '1323436 creo in synergy': 'In Synergy By Creo',
    'creo in synergy': 'In Synergy By Creo',
    '1362038 creo mantarave': 'Mantarave By Creo',
    'creo mantarave': 'Mantarave By Creo',
    'creo aurora 128 ytshorts savetube me': 'Aurora By Creo',
    'creo aurora': 'Aurora By Creo',
    'creo ballistic funk 128 ytshorts savetube me': 'Ballistic Funk By Creo',
    'creo ballistic funk': 'Ballistic Funk By Creo',
    'creo crazy 128 ytshorts savetube me': 'Crazy By Creo',
    'creo crazy': 'Crazy By Creo',
    'creo high tide 128 ytshorts savetube me': 'High Tide By Creo',
    'creo high tide': 'High Tide By Creo',
    'creo lightmare 128 ytshorts savetube me': 'Lightmare By Creo',
    'creo lightmare': 'Lightmare By Creo',
    'creo red haze 128 ytshorts savetube me': 'Red Haze By Creo',
    'creo red haze': 'Red Haze By Creo',
    'creo rock thing 128 ytshorts savetube me': 'Rock Thing By Creo',
    'creo rock thing': 'Rock Thing By Creo',
    'creo we can dream 128 ytshorts savetube me': 'We Can Dream By Creo',
    'creo we can dream': 'We Can Dream By Creo'
  };

  const normalized = normalizeTitleKey(name);
  return titleMap[normalized] || name;
}

function displayTrackInfo(track) {
  trackTitle.textContent = track.title;
  trackMeta.textContent = `Playing • ${track.title}`;
}

function resolveTrackUrl(filePath) {
  const normalizedPath = (filePath || '').replace(/^\/+/, '');
  const repoBase = 'https://lillyr1002.github.io/Birthday-Playlist';
  return `${repoBase}/songs/${normalizedPath}`;
}

function renderPlaylist() {
  playlistEl.innerHTML = '';

  if (!tracks.length) {
    emptyState.hidden = false;
    playlistCount.textContent = '0 tracks';
    return;
  }

  emptyState.hidden = true;
  playlistCount.textContent = `${tracks.length} ${tracks.length === 1 ? 'track' : 'tracks'}`;

  tracks.forEach((track, index) => {
    const item = document.createElement('li');
    item.className = index === currentIndex ? 'active' : '';
    item.innerHTML = `<span class="title">${track.title}</span><span>${track.type}</span>`;
    item.addEventListener('click', () => playTrack(index));
    playlistEl.appendChild(item);
  });
}

function loadTrack(index) {
  if (!tracks[index]) {
    return;
  }

  currentIndex = index;
  const track = tracks[index];
  displayTrackInfo(track);
  audio.src = track.url;
  audio.load();
  renderPlaylist();
  playPauseBtn.textContent = '▶ Play';
}

function playTrack(index) {
  if (!tracks[index]) {
    return;
  }

  if (currentIndex !== index) {
    loadTrack(index);
  }

  audio.play().catch(() => {
    playPauseBtn.textContent = '▶ Play';
  });
  playPauseBtn.textContent = '⏸ Pause';
}

function playPause() {
  if (!tracks.length) {
    return;
  }

  if (audio.paused) {
    audio.play().catch(() => {
      playPauseBtn.textContent = '▶ Play';
    });
    playPauseBtn.textContent = '⏸ Pause';
  } else {
    audio.pause();
    playPauseBtn.textContent = '▶ Play';
  }
}

function playNext() {
  if (!tracks.length) {
    return;
  }

  const nextIndex = (currentIndex + 1) % tracks.length;
  playTrack(nextIndex);
}

function playPrevious() {
  if (!tracks.length) {
    return;
  }

  const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
  playTrack(prevIndex);
}

function buildTracks(files) {
  tracks.length = 0;

  files.forEach((filePath) => {
    const title = getDisplayTitle(filePath);
    tracks.push({
      title,
      url: resolveTrackUrl(filePath),
      type: filePath.toLowerCase().endsWith('.mp3') ? 'MP3' : 'Audio'
    });
  });
}

function loadTracksFromServer() {
  buildTracks(publicFiles);

  if (!tracks.length) {
    trackTitle.textContent = 'No music found';
    trackMeta.textContent = 'Add some audio files to this folder and refresh the page.';
    emptyState.hidden = false;
    emptyState.textContent = 'No music files found in the folder yet.';
  } else {
    loadTrack(0);
  }

  renderPlaylist();
}

playPauseBtn.addEventListener('click', playPause);
prevBtn.addEventListener('click', playPrevious);
nextBtn.addEventListener('click', playNext);

seekBar.addEventListener('input', () => {
  if (!audio.duration) {
    return;
  }
  const newTime = (seekBar.value / 100) * audio.duration;
  audio.currentTime = newTime;
});

volumeRange.addEventListener('input', () => {
  audio.volume = Number(volumeRange.value);
});

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) {
    return;
  }

  const progress = (audio.currentTime / audio.duration) * 100;
  seekBar.value = progress;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', playNext);

audio.addEventListener('play', () => {
  playPauseBtn.textContent = '⏸ Pause';
});

audio.addEventListener('pause', () => {
  playPauseBtn.textContent = '▶ Play';
});

loadTracksFromServer();
