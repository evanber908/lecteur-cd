const radioPlayer = document.getElementById('web-radio-player');
const btnPlay = document.getElementById('btn-radio-play');
const btnStop = document.getElementById('btn-radio-stop');
const radioStatus = document.getElementById('radio-status');
const tunerNeedle = document.getElementById('tuner-needle');
const volumeKnob = document.getElementById('volume-knob');
const volumeSlider = document.getElementById('volume-slider');
const volumeValText = document.getElementById('volume-val-text');

// Éléments d'affichage de la chanson en cours
const radioCover = document.getElementById('radio-cover');
const radioTrackTitle = document.getElementById('radio-track-title');
const radioTrackArtist = document.getElementById('radio-track-artist');
const radioTrackAlbum = document.getElementById('radio-track-album');

let trackInterval = null;

// Récupération du titre et de la pochette en temps réel
async function fetchNowPlaying() {
  try {
    const nrjApiUrl = 'https://www.nrj.fr/live-api/metadata/nrj-taylor-swift';
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(nrjApiUrl)}&timestamp=${Date.now()}`;

    const response = await fetch(proxyUrl);
    if (!response.ok) return;

    const wrapper = await response.json();
    if (!wrapper.contents) return;

    const data = JSON.parse(wrapper.contents);

    // Si une chanson est actuellement transmise par l'API
    if (data && data.current) {
      const track = data.current;

      if (radioCover && track.cover) {
        radioCover.src = track.cover;
      }
      if (radioTrackTitle) {
        radioTrackTitle.textContent = track.title || 'Titre inconnu';
      }
      if (radioTrackArtist) {
        radioTrackArtist.textContent = track.artist || 'Taylor Swift';
      }
      if (radioTrackAlbum) {
        radioTrackAlbum.textContent = track.album ? `Album : ${track.album}` : 'NRJ Taylor Swift';
      }
    }
  } catch (err) {
    console.error("Erreur lors de la récupération des informations du titre :", err);
  }
}

// Initialisation du volume sonore
if (radioPlayer && volumeSlider) {
  radioPlayer.volume = parseFloat(volumeSlider.value);
}

// Gestion du volume au slider
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