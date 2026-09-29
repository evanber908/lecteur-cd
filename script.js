/* ==========================================================================
   ÉCOUTE TAYLOR - SCRIPT PRINCIPAL (script.js)
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. VARIABLES GLOBALES & CONFIGURATION
// --------------------------------------------------------------------------
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .catch((err) => console.error('Erreur Service Worker :', err));
}

let player = null;
let selectedYoutubeId = '';
let selectedCover = '';

// Image neutre par défaut pour les vinyles personnalisés
const NEUTRAL_COVER = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4OVSgDlIcxo5ePibqeZXjjxyMOpdhlMy-9I2Ii7nOFQ&s=10';

// Données des albums et de leurs chansons
const taylorAlbums = [
/*
  {
    id: "",
    albumTitle: "",
    coverImg: "",
    tracks: [
      { title: "", youtubeId: "" },
      { title: "", youtubeId: "" },
      { title: "", youtubeId: "" },
      { title: "", youtubeId: "" },
      { title: "", youtubeId: "" },
      { title: "", youtubeId: "" },
      { title: "", youtubeId: "" },
      { title: "", youtubeId: "" },
      { title: "", youtubeId: "" },
      { title: "", youtubeId: "" },
      { title: "", youtubeId: "" },
    ]
  },
*/
  {
    id: "Fearless",
    albumTitle: "Fearless (Taylor's version)",
    coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLzTIOV6nJwbsxhVVLc_gaYAwAwEEarS34VFr-2g6PZg&s=10",
    tracks: [
      { title: "Fearless (Taylor's Version)", youtubeId: "7lLigiVgJsE" },
      { title: "Fifteen (Taylor's Version)", youtubeId: "rLCol1C3ouc" },
      { title: "Love Story (Taylor's Version)", youtubeId: "aXzVF3XeS8M" },
      { title: "Hey Stephen (Taylor's Version)", youtubeId: "tMhiHrL7rPE" },
      { title: "White Horse (Taylor's Version)", youtubeId: "9-rKvhsjwKU" },
      { title: "You Belong With Me (Taylor's Version)", youtubeId: "vwp8Ur6tO-8" },
      { title: "Breathe (Taylor's Version) [feat. Colbie Caillat]", youtubeId: "qsUK-BG5OQQ" },
      { title: "Tell Me Why (Taylor's Version)", youtubeId: "cwFbq-70EwE" },
      { title: "You're Not Sorry (Taylor's Version)", youtubeId: "DNaSlUYIXBg" },
      { title: "The Way I Loved You (Taylor's Version)", youtubeId: "DlexmDDSDZ0&pp" },
      { title: "Forever & Always (Taylor's Version)", youtubeId: "T-41vMWQTUA" },
      { title: "The Best Day (Taylor's Version)", youtubeId: "KZeI9I875Ig" },
      { title: "Change (Taylor's Version)", youtubeId: "jwWR1cQTKyw" },
      { title: "Jump Then Fall (Taylor's Version)", youtubeId: "vUHDR6Rg3Y4" },
      { title: "Untouchable (Taylor's Version)", youtubeId: "8bNlGwnEUAs" },
      { title: "Forever & Always (Piano Version) (Taylor's Version)", youtubeId: "RcGowZ26sE0" },
      { title: "Come In With The Rain (Taylor's Version)", youtubeId: "ePjcjLRHPOo" },
      { title: "Superstar (Taylor's Version)", youtubeId: "IsCik8wznlU" },
      { title: "The Other Side Of The Door (Taylor's Version)", youtubeId: "425n1NoRtgA" },
      { title: "Today Was A Fairytale (Taylor's Version)", youtubeId: "xSWVPqnKcXQ" },
      { title: "You All Over Me (Taylor's Version) (From The Vault) [feat. Maren Morris]", youtubeId: "XKaMUm7YwZc" },
      { title: "Mr. Perfectly Fine (Taylor's Version) (From The Vault)", youtubeId: "rFjJs6ZjPe8" },
      { title: "We Were Happy (Taylor's Version) (From The Vault)", youtubeId: "seU5y5EgIwk" },
      { title: "That's When (Taylor's Version) (From The Vault) [feat. Keith Urban]", youtubeId: "aOa6D6ku3dM" },
      { title: "Don't You (Taylor's Version) (From The Vault)", youtubeId: "dHdAN4FXzmc" },
      { title: "Bye Bye Baby (Taylor's Version) (From The Vault)", youtubeId: "yuFuwXd-B9E" },
      { title: "Love Story (Taylor's Version) [Elvira Remix]", youtubeId: "FeTHyZJvozc" },
    ]
  },
  {
    id: "TaylorSwift",
    albumTitle: "Taylor Swift",
    coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-x0NlwFE0FWNT_mG33qgYvTbYPojvsuZplPk96X9C3Q&s=10",
    tracks: [
      { title: "Tim McGraw", youtubeId: "GkD20ajVxnY" },
      { title: "Picture to Burn", youtubeId: "yCMqcFAigRg" },
      { title: "Teardrops on My Guitar", youtubeId: "xKCek6_dB0M" },
      { title: "A Place in This World", youtubeId: "" },
      { title: "Cold as You", youtubeId: "" },
      { title: "The Outside", youtubeId: "" },
      { title: "Tied Together with a Smile", youtubeId: "" },
      { title: "Stay Beautiful", youtubeId: "" },
      { title: "Should've Said No", youtubeId: "v9bxXO9fj98" },
      { title: "Mary's Song (Oh My My My)", youtubeId: "" },
      { title: "Our Song", youtubeId: "Jb2stN7kH28" },
    ]
  },
  {
    id: "lover",
    albumTitle: "Lover",
    coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqS4K4pNb0uD_0CsOmaVpP05KJ0y0Ml21Y8Pq1vcdG1g&s=10",
    tracks: [
      { title: "Lover", youtubeId: "tgVYh94QH8k" },
      { title: "Cruel Summer", youtubeId: "ic8j13U5JT0" },
      { title: "You Need To Calm Down", youtubeId: "Dkq3E-v-68s" }
    ]
  },
  {
    id: "midnights",
    albumTitle: "Midnights",
    coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRW60D4TVzghFayK-EH1R0o9JCWoA33NoeAYGBBmfoSGw&s=10",
    tracks: [
      { title: "Midnight Rain", youtubeId: "Odh9ddPUkEY" },
      { title: "Anti-Hero", youtubeId: "b1kbLWVqugk" },
      { title: "Karma", youtubeId: "h8DLofLM7No" }
    ]
  },
  {
    id: "1989",
    albumTitle: "1989 (Taylor's Version)",
    coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSicxT76P3SNGzKmN-Ec-8WewrEx7GM4WMSSA53cquuaA&s=10",
    tracks: [
      { title: "Blank Space", youtubeId: "e-ORhEE9VVg" },
      { title: "Shake It Off", youtubeId: "nfWlot6h_JM" },
      { title: "Bad Blood", youtubeId: "lUvBk4owRNU" }
    ]
  }
];

// Contenus de la fenêtre modale
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
    <p>Les contenus vidéo et audio intégrés au lecteur proviennent de la plateforme YouTube via son API officielle. Les droits d'auteur restent la propriété exclusive de leurs ayants droit respectifs.</p>
  `,
  privacy: `
    <h2>Politique de confidentialité</h2>
    <h3>1. Collecte des données</h3>
    <p>Le site <strong>Écoute Taylor</strong> ne collecte, ne stocke et ne traite aucune donnée personnelle concernant ses utilisateurs.</p>
    
    <h3>2. Cookies et lecteurs tiers</h3>
    <p>Ce site intègre l'API du lecteur vidéo YouTube (Google LLC). L'utilisation de ce lecteur peut entraîner le dépôt de cookies de mesure d'audience par YouTube.</p>
    <p>Pour en savoir plus, consultez la <a href="https://policies.google.com/privacy" target="_blank">Politique de confidentialité de Google</a>.</p>
  `,
  contact: `
    <h2>Contact & Support</h2>
    <p>Pour toute question ou signalement de bug concernant le projet Écoute Taylor :</p>
    <p>📧 <strong>Email :</strong> <a href="mailto:evanber.pro@gmail.com">evanber.pro@gmail.com</a></p>
    <p>🐙 <strong>GitHub :</strong> Ouvrir un ticket sur le <a href="https://github.com/evanber908/lecteur-cd/issues" target="_blank">dépôt GitHub de Écoute Taylor</a></p>
  `
};

// --------------------------------------------------------------------------
// 2. RÉCUPÉRATION SÉCURISÉE DES ÉLÉMENTS DU DOM
// --------------------------------------------------------------------------
const dropZone = document.getElementById('drop-zone');
const platter = document.getElementById('platter');
const currentVinyl = document.getElementById('current-vinyl');
const vinylLabel = document.getElementById('vinyl-label');
const tonearm = document.getElementById('tonearm');
const screenDefault = document.getElementById('screen-default');

const btnPlay = document.getElementById('btn-play');
const btnPause = document.getElementById('btn-pause');
const btnEject = document.getElementById('btn-eject');

const modal = document.getElementById('modal-container');
const modalText = document.getElementById('modal-text');
const modalClose = document.getElementById('modal-close');
const linkMentions = document.getElementById('link-mentions');
const linkPrivacy = document.getElementById('link-privacy');
const linkContact = document.getElementById('link-contact');

const btnAddVinyl = document.getElementById('btn-add-vinyl');
const customUrlInput = document.getElementById('custom-url');
const customTitleInput = document.getElementById('custom-title');
const customRack = document.getElementById('custom-rack');

const albumsGrid = document.getElementById('albums-grid');
const tracksContainer = document.getElementById('tracks-container');
const tracksList = document.getElementById('tracks-list');
const selectedAlbumTitle = document.getElementById('selected-album-title');
const btnBack = document.getElementById('btn-back-albums');

// --------------------------------------------------------------------------
// 3. INITIALISATION DU LECTEUR YOUTUBE (API IFRAME)
// --------------------------------------------------------------------------
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

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
    if (platter) platter.classList.remove('spinning');
    if (tonearm) tonearm.classList.remove('active');
  } 
  else if (event.data === YT.PlayerState.PLAYING) {
    if (platter) platter.classList.add('spinning');
    if (tonearm) tonearm.classList.add('active');
  }
}

// --------------------------------------------------------------------------
// 4. LOGIQUE DES VINYLES ET DU LECTEUR
// --------------------------------------------------------------------------
function makeVinylDraggable(vinyl) {
  if (!vinyl) return;

  // Glisser-déposer (PC)
  vinyl.addEventListener('dragstart', (e) => {
    selectedYoutubeId = vinyl.getAttribute('data-youtube') || '';
    selectedCover = vinyl.getAttribute('data-cover') || '';
    e.dataTransfer.setData('text/plain', selectedYoutubeId);

    const disc = vinyl.querySelector('.vinyl-disc');
    if (disc) {
      e.dataTransfer.setDragImage(disc, 40, 40);
    }
  });

  // Clic / Tap (Mobile & Raccourci)
  vinyl.addEventListener('click', () => {
    const ytId = vinyl.getAttribute('data-youtube');
    const cover = vinyl.getAttribute('data-cover');
    selectedYoutubeId = ytId;
    selectedCover = cover;
    playSelectedVinyl(ytId, cover);
  });
}

function playSelectedVinyl(youtubeId, coverUrl) {
  if (!youtubeId) return;

  if (!player || typeof player.loadVideoById !== 'function') {
    alert("⚠️ Le lecteur YouTube n'est pas prêt. Assurez-vous de lancer le projet via un serveur local (Live Server).");
    return;
  }

  if (screenDefault) screenDefault.style.display = 'none';

  if (coverUrl && vinylLabel) {
    vinylLabel.style.backgroundImage = `url("${coverUrl}")`;
  }
  if (currentVinyl) currentVinyl.style.display = 'flex';

  player.loadVideoById(youtubeId);
  player.playVideo();

  if (platter) platter.classList.add('spinning');
  if (tonearm) tonearm.classList.add('active');
}

function ejectVinyl() {
  if (player && typeof player.stopVideo === 'function') {
    player.stopVideo();
  }
  
  if (currentVinyl) currentVinyl.style.display = 'none';
  if (platter) platter.classList.remove('spinning');
  if (tonearm) tonearm.classList.remove('active');
  if (screenDefault) screenDefault.style.display = 'flex';
  
  selectedYoutubeId = '';
  selectedCover = '';
}

function extractYoutubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// --------------------------------------------------------------------------
// 5. COMMANDES DU LECTEUR ET ZONE DE DÉPÔT
// --------------------------------------------------------------------------
function setupControlButtons() {
  if (btnPlay) {
    btnPlay.addEventListener('click', () => {
      if (player && selectedYoutubeId && typeof player.playVideo === 'function') {
        player.playVideo();
      }
    });
  }

  if (btnPause) {
    btnPause.addEventListener('click', () => {
      if (player && typeof player.pauseVideo === 'function') {
        player.pauseVideo();
      }
    });
  }

  if (btnEject) {
    btnEject.addEventListener('click', ejectVinyl);
  }

  if (dropZone) {
    dropZone.addEventListener('dragover', (e) => e.preventDefault());
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      playSelectedVinyl(selectedYoutubeId, selectedCover);
    });
  }
}

// --------------------------------------------------------------------------
// 6. GESTION DES MODALES (MENTIONS LÉGALES / PRIVACY / CONTACT)
// --------------------------------------------------------------------------
function setupModal() {
  const openModal = (content) => {
    if (modalText && modal) {
      modalText.innerHTML = content;
      modal.style.display = 'flex';
    }
  };

  if (linkMentions) linkMentions.addEventListener('click', (e) => { e.preventDefault(); openModal(legalContent.mentions); });
  if (linkPrivacy) linkPrivacy.addEventListener('click', (e) => { e.preventDefault(); openModal(legalContent.privacy); });
  if (linkContact) linkContact.addEventListener('click', (e) => { e.preventDefault(); openModal(legalContent.contact); });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      if (modal) modal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (modal && e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// --------------------------------------------------------------------------
// 7. FORMULAIRE D'AJOUT DE VINYLE PERSONNALISÉ
// --------------------------------------------------------------------------
function setupCustomVinylForm() {
  if (!btnAddVinyl) return;

  btnAddVinyl.addEventListener('click', () => {
    if (!customUrlInput) return;
    const rawUrl = customUrlInput.value.trim();
    const title = (customTitleInput && customTitleInput.value.trim()) || 'Musique perso';
    const youtubeId = extractYoutubeId(rawUrl);

    if (!youtubeId) {
      alert("⚠️ Veuillez entrer un lien YouTube valide (ex: https://www.youtube.com/watch?v=...)");
      return;
    }

    const vinylItem = document.createElement('div');
    vinylItem.className = 'vinyl-item';
    vinylItem.setAttribute('draggable', 'true');
    vinylItem.setAttribute('data-youtube', youtubeId);
    vinylItem.setAttribute('data-cover', NEUTRAL_COVER);

    vinylItem.innerHTML = `
      <div class="sleeve">
        <div class="vinyl-disc">
          <div class="disc-label">
            <img src="${NEUTRAL_COVER}" alt="${title}">
          </div>
        </div>
        <img src="${NEUTRAL_COVER}" alt="${title}">
      </div>
      <span>${title}</span>
    `;

    makeVinylDraggable(vinylItem);
    if (customRack) customRack.appendChild(vinylItem);

    customUrlInput.value = '';
    if (customTitleInput) customTitleInput.value = '';
  });
}

// --------------------------------------------------------------------------
// 8. SECTION DES ALBUMS TAYLOR SWIFT
// --------------------------------------------------------------------------
function renderAlbums() {
  if (!albumsGrid) return;
  albumsGrid.innerHTML = '';

  taylorAlbums.forEach(album => {
    const card = document.createElement('div');
    card.className = 'album-card';
    card.innerHTML = `
      <div class="sleeve">
        <img src="${album.coverImg}" alt="${album.albumTitle}">
      </div>
      <span>${album.albumTitle}</span>
    `;

    card.addEventListener('click', () => showAlbumTracks(album));
    albumsGrid.appendChild(card);
  });
}

function showAlbumTracks(album) {
  if (!albumsGrid || !tracksContainer || !selectedAlbumTitle || !tracksList) return;

  albumsGrid.style.display = 'none';
  tracksContainer.style.display = 'block';
  selectedAlbumTitle.textContent = album.albumTitle;
  tracksList.innerHTML = '';

  album.tracks.forEach(track => {
    const item = document.createElement('div');
    item.className = 'vinyl-item';
    item.setAttribute('draggable', 'true');
    item.setAttribute('data-youtube', track.youtubeId);
    item.setAttribute('data-cover', album.coverImg);

    item.innerHTML = `
      <div class="sleeve">
        <div class="vinyl-disc">
          <div class="disc-label">
            <img src="${album.coverImg}" alt="${track.title}">
          </div>
        </div>
        <img src="${album.coverImg}" alt="${track.title}">
      </div>
      <span>${track.title}</span>
    `;

    // Active la glissabilité et le clic pour chaque chanson
    makeVinylDraggable(item);
    tracksList.appendChild(item);
  });
}

function setupAlbumsSection() {
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      if (tracksContainer) tracksContainer.style.display = 'none';
      if (albumsGrid) albumsGrid.style.display = 'grid'; // Rétablit la grille CSS
    });
  }
  renderAlbums();
}

// --------------------------------------------------------------------------
// 9. INITIALISATION GLOBALE DU SCRIPT
// --------------------------------------------------------------------------
function init() {
  // Activer les vinyles présents par défaut dans le fichier HTML
  const initialVinyls = document.querySelectorAll('.vinyl-item');
  initialVinyls.forEach(makeVinylDraggable);

  setupControlButtons();
  setupModal();
  setupCustomVinylForm();
  setupAlbumsSection();
}

// Lancement automatique dès le chargement du DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}