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

// Récupération des informations NRJ en direct
async function fetchNowPlaying() {
  try {
    const nrjApiUrl = 'https://www.nrj.fr/onair.json';
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(nrjApiUrl)}&timestamp=${Date.now()}`;

    const response = await fetch(proxyUrl);
    if (!response.ok) return;

    const wrapper = await response.json();
    if (!wrapper.contents) return;

    const data = JSON.parse(wrapper.contents);

    let station = null;

    // Recherche de la station par son ID ou son slug
    if (Array.isArray(data)) {
      station = data.find(s => s.id === "1109" || s.slug === "nrj-taylor-swift");
    } else if (data['nrj-taylor-swift']) {
      station = data['nrj-taylor-swift'];
    }

    // Extraction du morceau en cours de lecture
    if (station && station.playlist && station.playlist.length > 0) {
      const currentTrack = station.playlist[0].song;

      if (radioTrackTitle && currentTrack.title) {
        radioTrackTitle.textContent = currentTrack.title;
      }
      if (radioTrackArtist && currentTrack.artist) {
        radioTrackArtist.textContent = currentTrack.artist;
      }
      if (radioCover && currentTrack.img_url) {
        radioCover.src = currentTrack.img_url;
      }
      if (radioTrackAlbum) {
        radioTrackAlbum.textContent = "NRJ Taylor Swift (En direct)";
      }
    }
  } catch (err) {
    console.error("Erreur lors de la récupération des métadonnées :", err);
  }
}

// Initialisation du volume sonore
if (radioPlayer && volumeSlider) {
  radioPlayer.volume = parseFloat(volumeSlider.value);
}

// Gestion du slider de volume
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
btnPlay.addEventListener('click', () => {
  radioPlayer.play().then(() => {
    radioStatus.textContent = '🔊 Diffusion en direct...';
    radioStatus.style.color = '#34d399';
    tunerNeedle.classList.add('playing');
    
    // Récupération immédiate au clic, puis mise à jour toutes les 10 secondes
    fetchNowPlaying();
    if (!trackInterval) {
      trackInterval = setInterval(fetchNowPlaying, 10000);
    }
  }).catch((err) => {
    console.error("Erreur de lecture audio :", err);
    radioStatus.textContent = '⚠️ Erreur de connexion au flux';
  });
});

// Arrêt de la radio
btnStop.addEventListener('click', () => {
  radioPlayer.pause();
  radioStatus.textContent = 'Radio éteinte';
  radioStatus.style.color = '#9ca3af';
  tunerNeedle.classList.remove('playing');
  if (trackInterval) {
    clearInterval(trackInterval);
    trackInterval = null;
  }
});