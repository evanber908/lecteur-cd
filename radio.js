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

// Playlist simulée avec image de pochette et métadonnées
const playlist = [
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
  },
  {
    title: "Love Story (Taylor's Version)",
    artist: "Taylor Swift",
    album: "Fearless (Taylor's Version)",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLzTIOV6nJwbsxhVVLc_gaYAwAwEEarS34VFr-2g6PZg&s=10"
  },
  {
    title: "All Too Well (10 Minute Version)",
    artist: "Taylor Swift",
    album: "Red (Taylor's Version)",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzIZjMCYX7MEv5SvFccHOt0s9oiy55jlComr0_TRfgyw&s=10"
  },
  {
    title: "Lover",
    artist: "Taylor Swift",
    album: "Lover",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqS4K4pNb0uD_0CsOmaVpP05KJ0y0Ml21Y8Pq1vcdG1g&s=10"
  }
];

let trackInterval = null;
let currentTrackIndex = 0;

function updateNowPlayingInfo(index) {
  const track = playlist[index];
  if (radioCover) radioCover.src = track.cover;
  if (radioTrackTitle) radioTrackTitle.textContent = track.title;
  if (radioTrackArtist) radioTrackArtist.textContent = track.artist;
  if (radioTrackAlbum) radioTrackAlbum.textContent = `Album : ${track.album}`;
}

// Initialisation du volume sonore
if (radioPlayer && volumeSlider) {
  radioPlayer.volume = parseFloat(volumeSlider.value);
}

// Gestion du volume à la souris via le slider
if (volumeSlider) {
  volumeSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (radioPlayer) radioPlayer.volume = val;
    
    // Affichage du pourcentage
    const pct = Math.round(val * 100);
    if (volumeValText) volumeValText.textContent = `${pct}%`;
    
    // Animation synchrone du potentiomètre rotatif
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
    
    // Rotation automatique des titres diffusés
    updateNowPlayingInfo(currentTrackIndex);
    if (!trackInterval) {
      trackInterval = setInterval(() => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        updateNowPlayingInfo(currentTrackIndex);
      }, 12000); // Change le titre affiché toutes les 12 secondes
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

// --- Modales (Mentions légales, Politique de confidentialité, Contact) ---
const modal = document.getElementById('modal-container');
const modalText = document.getElementById('modal-text');
const modalClose = document.getElementById('modal-close');

const legalContent = {
  mentions: `
    <h2>Mentions légales</h2>
    <h3>1. Éditeur du site</h3>
    <p>Le site <strong>Écoute Taylor</strong> est un projet personnel sans but lucratif édité par un particulier.</p>
    <p><strong>Directeur de la publication :</strong> evanber908</p>
    <p><strong>Contact :</strong> evanber.pro@gmail.com</p>
    
    <h3>2. Hébergement</h3>
    <p>Le site est hébergé par :<br>
    <strong>GitHub, Inc.</strong><br>
    88 Colin P Kelly Jr St, San Francisco, CA 94107, États-Unis<br>
    Website : <a href="https://pages.github.com" target="_blank">pages.github.com</a></p>

    <h3>3. Propriété intellectuelle</h3>
    <p>Les contenus audio et visuels sont diffusés à titre éducatif et récréatif. Les droits d'auteur appartiennent à Taylor Swift et à ses ayants droit respectifs.</p>
  `,
  privacy: `
    <h2>Politique de confidentialité</h2>
    <h3>1. Collecte des données</h3>
    <p>Le site <strong>Écoute Taylor</strong> ne collecte, ne stocke et ne traite aucune donnée personnelle concernant ses utilisateurs.</p>
    
    <h3>2. Cookies et lecteurs tiers</h3>
    <p>Ce site n'utilise aucun cookie publicitaire ni de traçage. Le lecteur audio utilise le cache standard de votre navigateur.</p>
  `,
  contact: `
    <h2>Contact & Support</h2>
    <p>Pour toute question ou demande concernant la Web Radio :</p>
    <p>📧 <strong>Email :</strong> <a href="mailto:evanber.pro@gmail.com">evanber.pro@gmail.com</a></p>
    <p>🐙 <strong>GitHub :</strong> Ouvrir un ticket sur le <a href="https://github.com/evanber908/lecteur-cd/issues" target="_blank">dépôt GitHub de Écoute Taylor</a></p>
  `
};

if (document.getElementById('link-mentions')) {
  document.getElementById('link-mentions').addEventListener('click', (e) => {
    e.preventDefault();
    modalText.innerHTML = legalContent.mentions;
    modal.style.display = 'flex';
  });
}

if (document.getElementById('link-privacy')) {
  document.getElementById('link-privacy').addEventListener('click', (e) => {
    e.preventDefault();
    modalText.innerHTML = legalContent.privacy;
    modal.style.display = 'flex';
  });
}

if (document.getElementById('link-contact')) {
  document.getElementById('link-contact').addEventListener('click', (e) => {
    e.preventDefault();
    modalText.innerHTML = legalContent.contact;
    modal.style.display = 'flex';
  });
}

if (modalClose) {
  modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});