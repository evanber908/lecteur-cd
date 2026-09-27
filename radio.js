const radioPlayer = document.getElementById('web-radio-player');
const btnPlay = document.getElementById('btn-radio-play');
const btnStop = document.getElementById('btn-radio-stop');
const radioStatus = document.getElementById('radio-status');
const tunerNeedle = document.getElementById('tuner-needle');
const volumeKnob = document.getElementById('volume-knob');
const volumeSlider = document.getElementById('volume-slider');
const volumeValText = document.getElementById('volume-val-text');

// Éléments d'affichage du morceau
const radioCover = document.getElementById('radio-cover');
const radioTrackTitle = document.getElementById('radio-track-title');
const radioTrackArtist = document.getElementById('radio-track-artist');
const radioTrackAlbum = document.getElementById('radio-track-album');

// Haut-parleur et conteneur de notes
const speakerGrill = document.querySelector('.speaker-grille') || document.getElementById('speaker-grill');
const notesContainer = document.getElementById('notes-container');

let trackInterval = null;
let noteInterval = null;
const MUSIC_NOTES = ['♪', '♫', '♩', '♬', '✨'];

// Playlist de secours en cas de problème réseau
const FALLBACK_PLAYLIST = [
  {
    title: "Cruel Summer",
    artist: "Taylor Swift",
    album: "Lover",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqS4K4pNb0uD_0CsOmaVpP05KJ0y0Ml21Y8Pq1vcdG1g&s=10"
  },
  {
    title: "Blank Space",
    artist: "Taylor Swift",
    album: "1989 (Taylor's Version)",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSicxT76P3SNGzKmN-Ec-8WewrEx7GM4WMSSA53cquuaA&s=10"
  },
  {
    title: "Anti-Hero",
    artist: "Taylor Swift",
    album: "Midnights",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn8qPUb0kIPLuxzN3mIN4KDs7nrGhyPlCs2X1TFnPnXQ&s=10"
  },
  {
    title: "Shake It Off",
    artist: "Taylor Swift",
    album: "1989 (Taylor's Version)",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQREOfzMO000rhvf6RQ5ZTWmF2RG-QeACHrZwYNsEHqeQ&s=10"
  }
];

let fallbackIndex = 0;

// 1. Récupération du titre en cours (API NRJ)
async function fetchNowPlaying() {
  try {
    const res = await fetch('https://proxy-nrj.evan-berard45.workers.dev/');
    if (!res.ok) throw new Error("Erreur réseau");

    const data = await res.json();
    const station = Array.isArray(data)
      ? data.find(s => s.slug === 'nrj-taylor-swift' || s.id === '1109')
      : (data?.['nrj-taylor-swift'] || data?.webradio);

    const track = station?.playlist?.[0]?.song || station?.current || data?.song;

    if (track) {
      const title = track.title || track.name || track.text;
      const artist = track.artist || track.performer || "Taylor Swift";
      const cover = track.img_url || track.cover || track.image;

      if (radioTrackTitle && title) radioTrackTitle.textContent = title;
      if (radioTrackArtist && artist) radioTrackArtist.textContent = artist;
      if (radioCover && cover) radioCover.src = cover;
      if (radioTrackAlbum) radioTrackAlbum.textContent = "NRJ Taylor Swift (En direct)";
      return;
    }
    useFallbackTrack();
  } catch (err) {
    useFallbackTrack();
  }
}

function useFallbackTrack() {
  const track = FALLBACK_PLAYLIST[fallbackIndex];
  if (radioTrackTitle) radioTrackTitle.textContent = track.title;
  if (radioTrackArtist) radioTrackArtist.textContent = track.artist;
  if (radioTrackAlbum) radioTrackAlbum.textContent = `Album : ${track.album}`;
  if (radioCover) radioCover.src = track.cover;
  fallbackIndex = (fallbackIndex + 1) % FALLBACK_PLAYLIST.length;
}

// 2. Génération des notes de musique flottantes
function spawnNote() {
  if (!notesContainer) return;

  const note = document.createElement('span');
  note.classList.add('floating-note');
  note.textContent = MUSIC_NOTES[Math.floor(Math.random() * MUSIC_NOTES.length)];

  const leftPos = Math.random() * 80 + 10;
  note.style.left = `${leftPos}%`;

  const drift = (Math.random() - 0.5) * 60;
  note.style.setProperty('--drift', `${drift}px`);

  notesContainer.appendChild(note);

  setTimeout(() => {
    note.remove();
  }, 2500);
}

// --- ÉVÉNEMENTS & CONTRÔLES ---

document.addEventListener('DOMContentLoaded', () => {
  fetchNowPlaying();
  if (radioPlayer && volumeSlider) {
    volumeSlider.value = "0.5"; // Force la glissière à 50%
    const val = parseFloat(volumeSlider.value); // Récupère 0.5
    radioPlayer.volume = val; // Définit le volume audio à 50%
    if (volumeValText) volumeValText.textContent = `${Math.round(val * 100)}%`;
    if (volumeKnob) volumeKnob.style.transform = `rotate(${(val * 240) - 120}deg)`;
  }
});

// Réglage du volume
if (volumeSlider) {
  volumeSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (radioPlayer) radioPlayer.volume = val;
    if (volumeValText) volumeValText.textContent = `${Math.round(val * 100)}%`;
    if (volumeKnob) volumeKnob.style.transform = `rotate(${(val * 240) - 120}deg)`;
  });
}

// Lancement de la lecture audio
if (btnPlay) {
  btnPlay.addEventListener('click', () => {
    if (!radioPlayer) return;

    radioPlayer.play().then(() => {
      if (radioStatus) {
        radioStatus.textContent = '🔊 Diffusion en direct...';
        radioStatus.style.color = '#34d399';
      }
      if (tunerNeedle) tunerNeedle.classList.add('playing');
      if (speakerGrill) speakerGrill.classList.add('playing');

      // Démarrage du suivi des titres et de la création de notes
      fetchNowPlaying();
      if (!trackInterval) trackInterval = setInterval(fetchNowPlaying, 10000);
      if (!noteInterval) noteInterval = setInterval(spawnNote, 450);

    }).catch((err) => {
      console.error("Erreur de lecture audio :", err);
      if (radioStatus) radioStatus.textContent = '⚠️ Erreur de connexion au flux';
    });
  });
}

// Arrêt de la lecture audio
if (btnStop) {
  btnStop.addEventListener('click', () => {
    if (!radioPlayer) return;

    radioPlayer.pause();

    if (radioStatus) {
      radioStatus.textContent = 'Radio éteinte';
      radioStatus.style.color = '#9ca3af';
    }
    if (tunerNeedle) tunerNeedle.classList.remove('playing');
    if (speakerGrill) speakerGrill.classList.remove('playing');

    if (trackInterval) { clearInterval(trackInterval); trackInterval = null; }
    if (noteInterval) { clearInterval(noteInterval); noteInterval = null; }
  });
}