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

let trackInterval = null;

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

// Récupération des informations NRJ via ton Worker Cloudflare
async function fetchNowPlaying() {
  try {
    const res = await fetch('https://proxy-nrj.evan-berard45.workers.dev/');
    if (!res.ok) throw new Error("Erreur réseau");

    const data = await res.json();
    
    // Identification de la station dans le JSON NRJ
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
    console.warn("Impossible de charger les métadonnées en direct, bascule sur la playlist de secours.", err);
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

// Initialisation au chargement du document
document.addEventListener('DOMContentLoaded', () => {
  fetchNowPlaying();

  if (radioPlayer && volumeSlider) {
    radioPlayer.volume = parseFloat(volumeSlider.value);
  }
});

// Réglage du volume
if (volumeSlider) {
  volumeSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (radioPlayer) radioPlayer.volume = val;
    
    const pct = Math.round(val * 100);
    if (volumeValText) volumeValText.textContent = `${pct}%`;
    
    const angle = (val * 240) - 120;
    if (volumeKnob) volumeKnob.style.transform = `rotate(${angle}deg)`;
  });
}

// Lancement de la radio
if (btnPlay) {
  btnPlay.addEventListener('click', () => {
    if (!radioPlayer) return;
    radioPlayer.play().then(() => {
      if (radioStatus) {
        radioStatus.textContent = '🔊 Diffusion en direct...';
        radioStatus.style.color = '#34d399';
      }
      if (tunerNeedle) tunerNeedle.classList.add('playing');
      
      fetchNowPlaying();
      if (!trackInterval) {
        trackInterval = setInterval(fetchNowPlaying, 10000);
      }
    }).catch((err) => {
      console.error("Erreur de lecture audio :", err);
      if (radioStatus) radioStatus.textContent = '⚠️ Erreur de connexion au flux';
    });
  });
}

// Arrêt de la radio
if (btnStop) {
  btnStop.addEventListener('click', () => {
    if (!radioPlayer) return;
    radioPlayer.pause();
    if (radioStatus) {
      radioStatus.textContent = 'Radio éteinte';
      radioStatus.style.color = '#9ca3af';
    }
    if (tunerNeedle) tunerNeedle.classList.remove('playing');
    if (trackInterval) {
      clearInterval(trackInterval);
      trackInterval = null;
    }
  });
}