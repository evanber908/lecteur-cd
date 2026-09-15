let player = null;
let selectedYoutubeId = '';
let selectedCover = '';

// 1. Initialisation automatique de l'API YouTube
function onYouTubeIframeAPIReady() {
  player = new YT.Player('youtube-player', {
    height: '100%',
    width: '100%',
    playerVars: {
      'autoplay': 0,
      'controls': 1,      // Affichage des contrôles vidéo sur l'écran du haut
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

// 2. Gestion du Drag & Drop
const vinyls = document.querySelectorAll('.vinyl-item');
const dropZone = document.getElementById('drop-zone');
const platter = document.getElementById('platter');
const currentVinyl = document.getElementById('current-vinyl');
const vinylLabel = document.getElementById('vinyl-label');
const tonearm = document.getElementById('tonearm');

vinyls.forEach(vinyl => {
  vinyl.addEventListener('dragstart', (e) => {
    selectedYoutubeId = vinyl.getAttribute('data-youtube');
    selectedCover = vinyl.getAttribute('data-cover');
    e.dataTransfer.setData('text/plain', selectedYoutubeId);
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
    // 1. Afficher le vinyle physique et sa pochette au centre
    if (selectedCover) {
      vinylLabel.style.backgroundImage = `url(${selectedCover})`;
    }
    currentVinyl.style.display = 'flex';

    // 2. Lancer la vidéo sur l'écran du haut
    player.loadVideoById(selectedYoutubeId);
    player.playVideo();
    
    // 3. Lancer la rotation du disque et abaisser le bras
    platter.classList.add('spinning');
    tonearm.classList.add('active');
  }
});

// 3. Synchroniser la rotation du disque avec l'état de la vidéo
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