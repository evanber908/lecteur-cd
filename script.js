const vinyls = document.querySelectorAll('.vinyl-item');
const dropZone = document.getElementById('drop-zone');
const platter = document.getElementById('platter');
const currentVinyl = document.getElementById('current-vinyl');
const tonearm = document.getElementById('tonearm');
const audioPlayer = document.getElementById('audio-player');

let selectedAudioSrc = '';
let selectedCover = '';

// 1. Gestion du Drag (Début du glissement)
vinyls.forEach(vinyl => {
  vinyl.addEventListener('dragstart', (e) => {
    selectedAudioSrc = vinyl.getAttribute('data-audio');
    selectedCover = vinyl.getAttribute('data-cover');
  });
});

// 2. Autoriser le dépôt sur la platine
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault(); 
});

// 3. Gestion du Drop (Dépôt du vinyle)
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  
  // Placer visuellement le macaron de l'album au centre du vinyle virtuel
  currentVinyl.style.backgroundImage = `url(${selectedCover})`;
  currentVinyl.style.display = 'block';
  
  // Charger le morceau Taylor Swift correspondant
  audioPlayer.src = selectedAudioSrc;
  
  // Lancer les animations et la musique après un mini délai (effet réaliste)
  setTimeout(() => {
    audioPlayer.play();
    platter.classList.add('spinning'); // Le disque tourne
    tonearm.classList.add('active');   // Le bras se pose
  }, 600);
});

// 4. Si la musique s'arrête ou fait pause
audioPlayer.addEventListener('pause', () => {
  platter.classList.remove('spinning');
  tonearm.classList.remove('active');
});