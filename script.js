let player = null;
let selectedYoutubeId = '';
let selectedCover = '';

// 1. Initialisation de l'API YouTube
function onYouTubeIframeAPIReady() {
  player = new YT.Player('youtube-player', {
    height: '100%',
    width: '100%',
    playerVars: {
      'autoplay': 0,
      'controls': 0,
      'cc_load_policy': 0,
      'disablekb': 1,
      'iv_load_policy': 3,
      'rel': 0,
      'modestbranding': 1,
      'playsinline': 1,
      'enablejsapi': 1
    },
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

// 2. Éléments du DOM
const vinyls = document.querySelectorAll('.vinyl-item');
const dropZone = document.getElementById('drop-zone');
const platter = document.getElementById('platter');
const currentVinyl = document.getElementById('current-vinyl');
const vinylLabel = document.getElementById('vinyl-label');
const tonearm = document.getElementById('tonearm');
const screenDefault = document.getElementById('screen-default');

const btnPlay = document.getElementById('btn-play');
const btnPause = document.getElementById('btn-pause');
const btnEject = document.getElementById('btn-eject');

// 3. Drag & Drop
vinyls.forEach(vinyl => {
  vinyl.addEventListener('dragstart', (e) => {
    selectedYoutubeId = vinyl.getAttribute('data-youtube');
    selectedCover = vinyl.getAttribute('data-cover');
    e.dataTransfer.setData('text/plain', selectedYoutubeId);

    // Sélectionne le disque vinyle/CD à l'intérieur de la pochette
    const disc = vinyl.querySelector('.vinyl-disc');
    if (disc) {
      // (élément, x, y) : 40, 40 centre le disque (de 81px) sous la pointe de la souris
      e.dataTransfer.setDragImage(disc, 40, 40);
    }
  });
});

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();

  if (!player || typeof player.loadVideoById !== 'function') {
    alert("⚠️ Le lecteur YouTube n'est pas prêt. Assurez-vous de lancer le projet via un serveur local (Live Server).");
    return;
  }

  if (selectedYoutubeId) {
    // Masquer l'écran par défaut pour afficher la vidéo
    screenDefault.style.display = 'none';

    if (selectedCover) {
      vinylLabel.style.backgroundImage = `url(${selectedCover})`;
    }
    currentVinyl.style.display = 'flex';

    player.loadVideoById(selectedYoutubeId);
    player.playVideo();
    
    platter.classList.add('spinning');
    tonearm.classList.add('active');
  }
});

// 4. Gestion des boutons personnalisés
btnPlay.addEventListener('click', () => {
  if (player && selectedYoutubeId && typeof player.playVideo === 'function') {
    player.playVideo();
  }
});

btnPause.addEventListener('click', () => {
  if (player && typeof player.pauseVideo === 'function') {
    player.pauseVideo();
  }
});

btnEject.addEventListener('click', () => {
  if (player && typeof player.stopVideo === 'function') {
    player.stopVideo();
  }
  
  // Réinitialiser la platine et réafficher l'écran par défaut
  currentVinyl.style.display = 'none';
  platter.classList.remove('spinning');
  tonearm.classList.remove('active');
  screenDefault.style.display = 'flex';
  selectedYoutubeId = '';
});

// 5. Synchronisation de la rotation et du bras de lecture
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
    platter.classList.remove('spinning');
    tonearm.classList.remove('active');
  } 
  else if (event.data === YT.PlayerState.PLAYING) {
    platter.classList.add('spinning');
    tonearm.classList.add('active');
  }
}

// --- Gestion des Mentions Légales, Confidentialité et Contact (Modale) ---

const modal = document.getElementById('modal-container');
const modalText = document.getElementById('modal-text');
const modalClose = document.getElementById('modal-close');

// Contenus des pages
const legalContent = {
  mentions: `
    <h2>Mentions légales</h2>
    <h3>1. Éditeur du site</h3>
    <p>Le site <strong>MagniVinyl</strong> est un projet personnel sans but lucratif édité par un particulier.</p>
    <p><strong>Directeur de la publication :</strong> evanber908</p>
    <p><strong>Contact :</strong> evanber.pro@gmail.com</p>
    
    <h3>2. Hébergement</h3>
    <p>Le site est hébergé par :<br>
    <strong>GitHub, Inc.</strong><br>
    88 Colin P Kelly Jr St, San Francisco, CA 94107, États-Unis<br>
    Website : <a href="https://pages.github.com" target="_blank">pages.github.com</a></p>

    <h3>3. Propriété intellectuelle</h3>
    <p>Les contenus vidéo et audio intégrés au lecteur proviennent de la plateforme YouTube via son API officielle. Les droits d'auteur restent la propriété exclusive de leurs ayants droit respectifs.</p>
  `,
  privacy: `
    <h2>Politique de confidentialité</h2>
    <h3>1. Collecte des données</h3>
    <p>Le site <strong>MagniVinyl</strong> ne collecte, ne stocke et ne traite aucune donnée personnelle concernant ses utilisateurs.</p>
    
    <h3>2. Cookies et lecteurs tiers</h3>
    <p>Ce site intègre l'API du lecteur vidéo YouTube (Google LLC). L'utilisation de ce lecteur peut entraîner le dépôt de cookies de mesure d'audience par YouTube.</p>
    <p>Pour en savoir plus, consultez la <a href="https://policies.google.com/privacy" target="_blank">Politique de confidentialité de Google</a>.</p>
  `,
  contact: `
    <h2>Contact & Support</h2>
    <p>Pour toute question ou signalement de bug concernant le projet MagniVinyl :</p>
    <p>📧 <strong>Email :</strong> <a href="mailto:evanber.pro@gmail.com">evanber.pro@gmail.com</a></p>
    <p>🐙 <strong>GitHub :</strong> Ouvrir un ticket sur le <a href="https://github.com/evanber908/lecteur-cd/issues" target="_blank">dépôt GitHub de MagniVinyl</a></p>
  `
};

// Événements de clic sur les liens
document.getElementById('link-mentions').addEventListener('click', (e) => {
  e.preventDefault();
  modalText.innerHTML = legalContent.mentions;
  modal.style.display = 'flex';
});

document.getElementById('link-privacy').addEventListener('click', (e) => {
  e.preventDefault();
  modalText.innerHTML = legalContent.privacy;
  modal.style.display = 'flex';
});

document.getElementById('link-contact').addEventListener('click', (e) => {
  e.preventDefault();
  modalText.innerHTML = legalContent.contact;
  modal.style.display = 'flex';
});

// Fermeture de la modale
modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});