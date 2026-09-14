let player;
let selectedYoutubeId = '';

// 1. Initialisation automatique de l'API YouTube
function onYouTubeIframeAPIReady() {
  player = new YT.Player('youtube-player', {
    height: '100%',
    width: '100%',
    playerVars: {
      'autoplay': 0,
      'controls': 0,      // Cache les contrôles YouTube (pause, barre de progression)
      'showinfo': 0,
      'rel': 0,
      'loop': 1,
      'modestbranding': 1,
      'playsinline': 1
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
  });
});

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();

  if (selectedYoutubeId && player && player.loadVideoById) {
    // Charger la vidéo correspondante dans le lecteur
    player.loadVideoById(selectedYoutubeId);
    
    // Effet réaliste : la vidéo se lance et les animations démarrent
    setTimeout(() => {
      player.playVideo();
      platter.classList.add('spinning');
      tonearm.classList.add('active');
    }, 500);
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