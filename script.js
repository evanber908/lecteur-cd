let player = null;
let selectedYoutubeId = '';

// 1. Initialisation automatique de l'API YouTube
function onYouTubeIframeAPIReady() {
  player = new YT.Player('youtube-player', {
    height: '100%',
    width: '100%',
    playerVars: {
      'autoplay': 0,
      'controls': 0,
      'showinfo': 0,
      'rel': 0,
      'loop': 1,
      'modestbranding': 1,
      'playsinline': 1,
      'enablejsapi': 1 // Indispensable pour contrôler la vidéo en JS
    },
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

// 2. Gestion du Drag & Drop
const vinyls = document.querySelectorAll('.vinyl-item');
const dropZone = document.getElementById('drop-zone');
const platter = document.getElementById('platter');
const tonearm = document.getElementById('tonearm');

vinyls.forEach(vinyl => {
  vinyl.addEventListener('dragstart', (e) => {
    selectedYoutubeId = vinyl.getAttribute('data-youtube');
    // Ligne OBLIGATOIRE pour que le Drag fonctionne sur Firefox
    e.dataTransfer.setData('text/plain', selectedYoutubeId);
  });
});

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();

  // Sécurité : Vérifier si l'API YouTube a bien pu se charger
  if (!player || typeof player.loadVideoById !== 'function') {
    alert("⚠️ Le lecteur YouTube n'est pas prêt. Vérifiez que vous ouvrez ce site via un serveur local (Live Server) et que vous avez internet.");
    return;
  }

  if (selectedYoutubeId) {
    // 1. Charger ET lancer la vidéo IMMÉDIATEMENT (sans setTimeout)
    player.loadVideoById(selectedYoutubeId);
    player.playVideo();
    
    // 2. Lancer les animations CSS
    platter.classList.add('spinning');
    tonearm.classList.add('active');
  }
});

// 3. Synchroniser les animations selon l'état de la vidéo YouTube
function onPlayerStateChange(event) {
  // Si la vidéo est en pause ou terminée
  if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
    platter.classList.remove('spinning');
    tonearm.classList.remove('active');
  } 
  // Si la vidéo est en lecture
  else if (event.data === YT.PlayerState.PLAYING) {
    platter.classList.add('spinning');
    tonearm.classList.add('active');
  }
}