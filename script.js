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