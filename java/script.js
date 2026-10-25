/* ==========================================================================
   ÉCOUTE TAYLOR - SCRIPT PRINCIPAL (java/script.js)
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
let selectedTitle = '';
let selectedAlbum = '';
let savedAlbums = localStorage.getItem('taylorAlbums');

// Image neutre par défaut pour les vinyles personnalisés
const NEUTRAL_COVER = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4OVSgDlIcxo5ePibqeZXjjxyMOpdhlMy-9I2Ii7nOFQ&s=10';

// Données des albums et de leurs chansons
const taylorAlbums = savedAlbums ? JSON.parse(savedAlbums) : [
/*
  {
    id: "",
    albumTitle: "",
    coverImg: "",
    tracks: [
      { plays: 0, title: "", youtubeId: "" },
      { plays: 0, title: "", youtubeId: "" },
      { plays: 0, title: "", youtubeId: "" },
      { plays: 0, title: "", youtubeId: "" },
      { plays: 0, title: "", youtubeId: "" },
      { plays: 0, title: "", youtubeId: "" },
      { plays: 0, title: "", youtubeId: "" },
      { plays: 0, title: "", youtubeId: "" },
      { plays: 0, title: "", youtubeId: "" },
      { plays: 0, title: "", youtubeId: "" },
      { plays: 0, title: "", youtubeId: "" },
    ],
    plays: 0
  },
*/
  {
    id: "The-life-of-a-Showgirl-The-Encore",
    albumTitle: "The life of a Showgirl : The Encore",
    coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGlyohCKLQNOPi37wNpWIaS920YWd9MdGQX8NZbtCZiQ&s=10",
    tracks: [
      { plays: 0, title: "The Fate of Ophelia", youtubeId: "rbmdfEQODOw" },
      { plays: 0, title: "Elizabeth Taylor", youtubeId: "7X5iDKPrZH0" },
      { plays: 0, title: "Opalite", youtubeId: "3PJC6uPIekc" },
      { plays: 0, title: "Father Figure", youtubeId: "98SmlWOKuME" },
      { plays: 0, title: "Eldest Daughter", youtubeId: "HwQnW_ZRKhc" },
      { plays: 0, title: "Ruin the Friendship", youtubeId: "WQCPl5rTMDQ" },
      { plays: 0, title: "Actually Romantic", youtubeId: "FnEg1RgmqO4" },
      { plays: 0, title: "Wi$h Li$t", youtubeId: "wqgUzLHgNMI" },
      { plays: 0, title: "Wood", youtubeId: "6m50keINEOI" },
      { plays: 0, title: "CANCELLED!", youtubeId: "F-5XoUZ42Tc" },
      { plays: 0, title: "Honey", youtubeId: "4-EzK5UB40U" },
      { plays: 0, title: "The Life of a Showgirl (feat. Sabrina Carpenter)", youtubeId: "OU6362Nggg0" },
      { plays: 0, title: "The patient zero", youtubeId: "BpR280fXISA" },
      { plays: 0, title: "Cleveland!", youtubeId: "jfVVXYTZykw" },
      { plays: 0, title: "Pink Clouding", youtubeId: "kXOKQCtttbw" },
      { plays: 0, title: "Babylon", youtubeId: "tZnNLoPKriU" },
    ]
  },
  {
    id: "The-Life-of-a-Showgirl",
    albumTitle: "The Life of a Showgirl",
    coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0jDSg1NvMW320Ma_jCwwNniKorfQb8eC0y9xtQL4Fdg&s=10",
    tracks: [
      { plays: 0, title: "The Fate of Ophelia", youtubeId: "rbmdfEQODOw" },
      { plays: 0, title: "Elizabeth Taylor", youtubeId: "7X5iDKPrZH0" },
      { plays: 0, title: "Opalite", youtubeId: "3PJC6uPIekc" },
      { plays: 0, title: "Father Figure", youtubeId: "98SmlWOKuME" },
      { plays: 0, title: "Eldest Daughter", youtubeId: "HwQnW_ZRKhc" },
      { plays: 0, title: "Ruin the Friendship", youtubeId: "WQCPl5rTMDQ" },
      { plays: 0, title: "Actually Romantic", youtubeId: "FnEg1RgmqO4" },
      { plays: 0, title: "Wi$h Li$t", youtubeId: "wqgUzLHgNMI" },
      { plays: 0, title: "Wood", youtubeId: "6m50keINEOI" },
      { plays: 0, title: "CANCELLED!", youtubeId: "F-5XoUZ42Tc" },
      { plays: 0, title: "Honey", youtubeId: "4-EzK5UB40U" },
      { plays: 0, title: "The Life of a Showgirl (feat. Sabrina Carpenter)", youtubeId: "OU6362Nggg0" },
    ]
  },
  {
    id: "The-Tortured-Poets-Department",
    albumTitle: "The Tortured Poets Department",
    coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiVT7bjHriVgDbK_lXHgR7MEwqWiBL2ha8-HNeY2B3tw&s=10",
    tracks: [
      { plays: 0, title: "Fortnight (feat. Post Malone)", youtubeId: "HzsQHfBA3MY" },
      { plays: 0, title: "The Tortured Poets Department", youtubeId: "RQMz4JDbtmI" },
      { plays: 0, title: "My Boy Only Breaks His Favorite Toys", youtubeId: "wRKXAAV6jh4" },
      { plays: 0, title: "Down Bad", youtubeId: "EVbtjaWXQVg" },
      { plays: 0, title: "So Long, London", youtubeId: "CCUr2pNJft4" },
      { plays: 0, title: "But Daddy I Love Him", youtubeId: "U2W173hRfyA" },
      { plays: 0, title: "Fresh Out the Slammer", youtubeId: "0EKbEP2L32M" },
      { plays: 0, title: "Florida!!! (feat. Florence and the Machine)", youtubeId: "uEssK8o3jKg" },
      { plays: 0, title: "Guilty as Sin?", youtubeId: "OOYlWF6V8t8" },
      { plays: 0, title: "Who’s Afraid of Little Old Me?", youtubeId: "vOZFiX6hDXQ" },
      { plays: 0, title: "I Can Fix Him (No Really I Can)", youtubeId: "OKWfv-x2rdU" },
      { plays: 0, title: "loml", youtubeId: "GZ4vaTRn0HU" },
      { plays: 0, title: "I Can Do It with a Broken Heart", youtubeId: "i8_w_m6HLJ0" },
      { plays: 0, title: "The Smallest Man Who Ever Lived", youtubeId: "Atdzfj8LcuY" },
      { plays: 0, title: "The Alchemy", youtubeId: "iMMUAd66vxo" },
      { plays: 0, title: "Clara Bow", youtubeId: "fcVUbmdQfaE" },
      { plays: 0, title: "The Black Dog", youtubeId: "56TZ3B8Qxsk" },
      { plays: 0, title: "Imgonnagetyouback", youtubeId: "SBGdvxi2JmU" },
      { plays: 0, title: "The Albatross", youtubeId: "4wOsiM2T_xc" },
      { plays: 0, title: "Chloe or Sam or Sophia or Marcus", youtubeId: "gOtOWeD9YJk" },
      { plays: 0, title: "How Did It End?", youtubeId: "O3wlMR0y4a4" },
      { plays: 0, title: "So High School", youtubeId: "w-FkV0EM_CU" },
      { plays: 0, title: "I Hate It Here", youtubeId: "BpkmUfv1I4Q" },
      { plays: 0, title: "thanK you alMee", youtubeId: "oaBJlKXBvjk" },
      { plays: 0, title: "I Look in People's Window", youtubeId: "6HIA7ouBfGY" },
      { plays: 0, title: "The Prophecy", youtubeId: "_PsBoqNwYo4" },
      { plays: 0, title: "Cassandra", youtubeId: "0hYY86DmqPY" },
      { plays: 0, title: "Peter", youtubeId: "Mxxswu7V1Us" },
      { plays: 0, title: "The Bolter", youtubeId: "bAi80EylyXQ" },
      { plays: 0, title: "Robin", youtubeId: "FQyEZZPbOb0" },
      { plays: 0, title: "The Manuscript", youtubeId: "iY6Qhlua8Zw" },
    ]
  },
  {
    id: "Midnights",
    albumTitle: "Midnights",
    coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbftm-D0w1ZdzXvo40gOm5gsilbXSJVgLyykqqFQQKaA&s=10",
    tracks: [
      { plays: 0, title: "Lavender Haze", youtubeId: "mkR_Qwix4Ho" },
      { plays: 0, title: "Maroon", youtubeId: "lvHZjvIyqsk" },
      { plays: 0, title: "Anti-Hero", youtubeId: "XqN2qFvY64U" },
      { plays: 0, title: "Snow on the Beach (feat. Lana Del Rey)", youtubeId: "ycE7bUq3-2k" },
      { plays: 0, title: "You're on Your Own, Kid", youtubeId: "7Gbg6Z70J7E" },
      { plays: 0, title: "Midnight Rain", youtubeId: "Odh9ddPUkEY" },
      { plays: 0, title: "Question...?", youtubeId: "xxrf_QBD5DE" },
      { plays: 0, title: "Vigilante Shit", youtubeId: "Uoey4W_3bos" },
      { plays: 0, title: "Bejeweled", youtubeId: "XzKSPRqFg9E" },
      { plays: 0, title: "Labyrinth", youtubeId: "xTXsKMXUi7w" },
      { plays: 0, title: "Karma", youtubeId: "rg18Kf4en2o" },
      { plays: 0, title: "Sweet Nothing", youtubeId: "rn0brgg2BpI" },
      { plays: 0, title: "Mastermind", youtubeId: "Tmz1lz0zcLQ" },
    ]
  },
  {
    id: "Evermore",
    albumTitle: "Evermore",
    coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs829B8GwjLPkFBpPR6SprN6QhAObsZ7ybVZ4w5AOggA&s=10",
    tracks: [
      { plays: 0, title: "willow", youtubeId: "7EvwIw4gIyk" },
      { plays: 0, title: "champagne problems", youtubeId: "wMpqCRF7TKg" },
      { plays: 0, title: "gold rush", youtubeId: "Pz-f9mM3Ms8" },
      { plays: 0, title: "'tis the damn season", youtubeId: "WuvhOD-mP8M" },
      { plays: 0, title: "tolerate it", youtubeId: "ukxEKY_7MOc" },
      { plays: 0, title: "no body, no crime (feat. Haim)", youtubeId: "IEPomqor2A8" },
      { plays: 0, title: "happiness", youtubeId: "tP4TTgt4nb0" },
      { plays: 0, title: "dorothea", youtubeId: "zI4DS5GmQWE" },
      { plays: 0, title: "coney island", youtubeId: "bee4lW1bdn4" },
      { plays: 0, title: "ivy", youtubeId: "9nIOx-ezlzA" },
      { plays: 0, title: "cowboy like me", youtubeId: "YPlNBb6I8qU" },
      { plays: 0, title: "long story short", youtubeId: "rqQHa2HcGtM" },
      { plays: 0, title: "marjorie", youtubeId: "hP6QpMeSG6s" },
      { plays: 0, title: "closure", youtubeId: "AIFnKqIeEdY" },
      { plays: 0, title: "evermore (feat. Bon Iver)", youtubeId: "EXLgZZE072g" },
    ]
  },
  {
    id: "Folklore",
    albumTitle: "Folklore",
    coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_o6Vk1iHmGv5ULfC5RvSENjLdLlN9isI9Fo7P0kKO6A&s=10",
    tracks: [
      { plays: 0, title: "the 1", youtubeId: "KsZ6tROaVOQ" },
      { plays: 0, title: "cardigan", youtubeId: "zLSUp53y-HQ" },
      { plays: 0, title: "the last great american dynasty", youtubeId: "2s5xdY6MCeI" },
      { plays: 0, title: "exile [feat. Bon Iver]", youtubeId: "osdoLjUNFnA" },
      { plays: 0, title: "my tears ricochet", youtubeId: "OWbDJFtHl3w" },
      { plays: 0, title: "mirrorball", youtubeId: "KaM1bCuG4xo" },
      { plays: 0, title: "seven", youtubeId: "pEY-GPsru_E" },
      { plays: 0, title: "august", youtubeId: "nn_0zPAfyo8" },
      { plays: 0, title: "this is me trying", youtubeId: "9bdLTPNrlEg" },
      { plays: 0, title: "illicit affairs", youtubeId: "MLV2SJKWk4M" },
      { plays: 0, title: "invisible string", youtubeId: "OuFnpmGwg5k" },
      { plays: 0, title: "mad woman", youtubeId: "6DP4q_1EgQQ" },
      { plays: 0, title: "epiphany", youtubeId: "DUnDkI7l9LQ" },
      { plays: 0, title: "betty", youtubeId: "6TAPqXkZW_I" },
      { plays: 0, title: "peace", youtubeId: "HpxX4ZE4KWE" },
      { plays: 0, title: "hoax", youtubeId: "ryLGxpjwAhM" },
    ]
  },
  {
    id: "Lover",
    albumTitle: "Lover",
    coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqS4K4pNb0uD_0CsOmaVpP05KJ0y0Ml21Y8Pq1vcdG1g&s=10",
    tracks: [
      { plays: 0, title: "I Forgot That You Existed", youtubeId: "p1cEvNn88jM" },
      { plays: 0, title: "Cruel Summer", youtubeId: "ic8j13piAhQ" },
      { plays: 0, title: "Lover", youtubeId: "-BjZmE2gtdo" },
      { plays: 0, title: "The Man", youtubeId: "tbEekLA7J3Y" },
      { plays: 0, title: "The Archer", youtubeId: "8KpKc3C9V3w" },
      { plays: 0, title: "I Think He Knows", youtubeId: "2d1wKn-oJnA" },
      { plays: 0, title: "Miss Americana & the Heartbreak Prince", youtubeId: "Kwf7P2GNAVw" },
      { plays: 0, title: "Paper Rings", youtubeId: "8zdg-pDF10g" },
      { plays: 0, title: "Cornelia Street (Live From Paris)", youtubeId: "3xGvCApIEQY" },
      { plays: 0, title: "Death by a Thousand Cuts", youtubeId: "GTEFSuFfgnU" },
      { plays: 0, title: "London Boy", youtubeId: "VsKoOH6DVys" },
      { plays: 0, title: "Soon You'll Get Better (feat. Dixie Chicks)", youtubeId: "tMoW5G5LU08" },
      { plays: 0, title: "False God (Live on Saturday Night Live / 2019)", youtubeId: "kjD3LoXp-Pw" },
      { plays: 0, title: "You Need to Calm Down", youtubeId: "GWtfOHBF1_w" },
      { plays: 0, title: "Me! (feat. Brendon Urie de Panic! at the Disco)", youtubeId: "S--WI8PUVVo" },
      { plays: 0, title: "It's Nice to Have a Friend", youtubeId: "eaP1VswBF28" },
      { plays: 0, title: "Daylight", youtubeId: "u9raS7-NisU" },
    ]
  },
  {
    id: "Reputation",
    albumTitle: "Reputation",
    coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTge42Pfg5XFXXbNJv9Rpf-bmgpBMxcoFiGXn2Sq3tgjA&s=10",
    tracks: [
      { plays: 0, title: "…Ready for It?", youtubeId: "T62maKYX9tU" },
      { plays: 0, title: "Endgame (feat. Ed Sheeran et Future)", youtubeId: "dfnCAmr569k" },
      { plays: 0, title: "I Did Something Bad", youtubeId: "xYLxUJ9v6KU" },
      { plays: 0, title: "Don't Blame Me", youtubeId: "kRJKB291Z1g" },
      { plays: 0, title: "Delicate", youtubeId: "tCXGJQYZ9JA" },
      { plays: 0, title: "Look What You Made Me Do", youtubeId: "3K0RzZGpyds" },
      { plays: 0, title: "So It Goes…", youtubeId: "iAv1Y1YIwm8" },
      { plays: 0, title: "Gorgeous", youtubeId: "EUoe7cf0HYw" },
      { plays: 0, title: "Getaway Car", youtubeId: "FhPLQVlUiNQ" },
      { plays: 0, title: "King Of My Heart", youtubeId: "5U7bF68xcRg" },
      { plays: 0, title: "Dancing With Our Hands Tied", youtubeId: "erGyUphZSt8" },
      { plays: 0, title: "Dress", youtubeId: "FNEoPctNIUE" },
      { plays: 0, title: "This is Why We Can't Have Nice Things", youtubeId: "6Z3QJ4L1Bg0" },
      { plays: 0, title: "Call It What You Want", youtubeId: "V54CEElTF_U" },
      { plays: 0, title: "New Year's Day", youtubeId: "wnwpBnD4JRg" },
    ]
  },
  {
    id: "1989",
    albumTitle: "1989 (Taylor's Version)",
    coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-ZfJN1Jps-05nwY1E2rHemrdMHPLYOQf-VbTEVtP0KA&s=10",
    tracks: [
      { plays: 0, title: "Welcome to New York", youtubeId: "FsGdznlfE2U" },
      { plays: 0, title: "Blank Space", youtubeId: "gir8BEqAutk" },
      { plays: 0, title: "Style", youtubeId: "2JgvVfOfoWI" },
      { plays: 0, title: "Out Of The Woods", youtubeId: "gp1MR2WAAXY" },
      { plays: 0, title: "All You Had to Do Was Stay", youtubeId: "_Usd5X5XJXM" },
      { plays: 0, title: "Shake it Off", youtubeId: "mvVBuG4IOW4" },
      { plays: 0, title: "I Wish You Would", youtubeId: "89aQIli8aVU" },
      { plays: 0, title: "Bad Blood", youtubeId: "lUvBk4owRNU" },
      { plays: 0, title: "Wildest Dreams", youtubeId: "vtW_4j7SsZk" },
      { plays: 0, title: "How You Get the Girl", youtubeId: "rnwD7veCoFQ" },
      { plays: 0, title: "This Love", youtubeId: "mvxQYPR4lmU" },
      { plays: 0, title: "I Know Places", youtubeId: "0jTGzm-6cYE" },
      { plays: 0, title: "Clean", youtubeId: "AppsjTInqiw" },
      { plays: 0, title: "Wonderland", youtubeId: "JhICcmiIE80" },
      { plays: 0, title: "You Are In Love", youtubeId: "M7ySK0keirY" },
      { plays: 0, title: "New Romantics", youtubeId: "3-BcH7KowGE" },
      { plays: 0, title: "&laquo;Slut!&raquo;", youtubeId: "qrxsceexTBw" },
      { plays: 0, title: "Say Don't Go", youtubeId: "C-z-IckrQK8" },
      { plays: 0, title: "Now That We Don't Talk", youtubeId: "yF4ulRTCn44" },
      { plays: 0, title: "Suburban Legends", youtubeId: "ZGBPKYbzSXs" },
      { plays: 0, title: "Is It Over Now ?", youtubeId: "tNxUxm3-658" },
    ]
  },
  {
    id: "Red",
    albumTitle: "Red (Taylor's Version)",
    coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqJFFtXoomi_ZCLsmlHw0A6533zQyc1THOlroMCnP_sQ&s",
    tracks: [
      { plays: 0, title: "State of Grace", youtubeId: "-mrC5tRkxrY" },
      { plays: 0, title: "Red", youtubeId: "R_rUYuFtNO4" },
      { plays: 0, title: "Treacherous", youtubeId: "u1D1AgDfreg" },
      { plays: 0, title: "I knew you were trouble", youtubeId: "TqAollrUJdA" },
      { plays: 0, title: "All Too Well", youtubeId: "9OQBDdNHmXo" },
      { plays: 0, title: "22", youtubeId: "9boiT64sm0Q" },
      { plays: 0, title: "I Almost Do", youtubeId: "w1AV_35zVwU" },
      { plays: 0, title: "We Are Never Ever Getting Back Together", youtubeId: "zJFcr1KyFqE" },
      { plays: 0, title: "Stay Stay Stay", youtubeId: "OhJ-S9Nrh7Q" },
      { plays: 0, title: "The Last Time [feat. Gary Lightbody de Snow Patrol]", youtubeId: "pCH4QrSx2Jg" },
      { plays: 0, title: "Holy Ground", youtubeId: "S4PuN-IWi2g" },
      { plays: 0, title: "Sad Beautiful Tragic", youtubeId: "jQfB4Gahi3I" },
      { plays: 0, title: "The Lucky One", youtubeId: "4LtQxA_ooLk" },
      { plays: 0, title: "Everything Has Changed [feat. Ed Sheeran]", youtubeId: "eMcMbWl0fDk" },
      { plays: 0, title: "Starlight", youtubeId: "lPvcwgEuKTg" },
      { plays: 0, title: "Begin Again", youtubeId: "dXNZaHuKWNA" },
      { plays: 0, title: "The Moment I Knew", youtubeId: "LmXn6BU16e0" },
      { plays: 0, title: "Come Back… Be Here", youtubeId: "hHWOAUjnmjQ" },
      { plays: 0, title: "Girl At Home", youtubeId: "UNckfN9upqo" },
      { plays: 0, title: "State of Grace (acoustic version)", youtubeId: "D3mJe28un4M" },
      { plays: 0, title: "Ronan", youtubeId: "kdiBc40gW7s" },
      { plays: 0, title: "Better Man (From the Vault)", youtubeId: "PReSQYTFvcs" },
      { plays: 0, title: "Nothing New [feat. Phoebe Bridgers] (From the Vault)", youtubeId: "m3fWCRvz5JA" },
      { plays: 0, title: "Babe (From the Vault)", youtubeId: "3pj39qZZYoQ" },
      { plays: 0, title: "Message in a Bottle (From the Vault)", youtubeId: "cVaG6adE2mA" },
      { plays: 0, title: "I Bet You Think About Me [feat. Chris Stapleton] (From the Vault)", youtubeId: "AccGdO5XeZY" },
      { plays: 0, title: "Forever Winter (From the Vault)", youtubeId: "TkAomsYFsJw" },
      { plays: 0, title: "Run [feat. Ed Sheeran] (From the Vault)", youtubeId: "flv8AEWrRMI" },
      { plays: 0, title: "The Very First Night (From the Vault)", youtubeId: "rVuyi-dPMIc" },
      { plays: 0, title: "All Too Well (10 Minute Version) (From the Vault)", youtubeId: "sRxrwjOtIag" },
    ]
  },
  {
    id: "SpeakNow",
    albumTitle: "Speak Now (Taylor's Version)",
    coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI_DHIjsloyM10HKHQQNQAoIA4J_cf831rA4QQAiwP2A&s",
    tracks: [
      { plays: 0, title: "Mine (Taylor's Version)", youtubeId: "oxNLRqMJMZk" },
      { plays: 0, title: "Sparks Fly (Taylor's Version)", youtubeId: "UlFrV5GJA_4" },
      { plays: 0, title: "Back to December (Taylor's Version)", youtubeId: "qc2Z-OX9wnc" },
      { plays: 0, title: "Speak Now (Taylor's Version)", youtubeId: "JlZnvyBqceY" },
      { plays: 0, title: "Dear John (Taylor's Version)", youtubeId: "N-FYySSy0rM" },
      { plays: 0, title: "Mean (Taylor's Version)", youtubeId: "8AR1dKawCi8" },
      { plays: 0, title: "The Story of Us (Taylor's Version)", youtubeId: "pRhWAXg4xek" },
      { plays: 0, title: "Never Grow Up (Taylor's Version)", youtubeId: "maEVfpxDB8k" },
      { plays: 0, title: "Enchanted (Taylor's Version)", youtubeId: "igIfiqqVHtA" },
      { plays: 0, title: "Better than Revenge (Taylor's Version)", youtubeId: "EH70M5OeS4o" },
      { plays: 0, title: "Innocent (Taylor's Version)", youtubeId: "vO6JqQpJboY" },
      { plays: 0, title: "Haunted (Taylor's Version)", youtubeId: "4cC6fw8EqWU" },
      { plays: 0, title: "Last Kiss (Taylor's Version)", youtubeId: "idWma942CUI" },
      { plays: 0, title: "Long Live (Taylor's Version)", youtubeId: "F5TMU6916U8" },
      { plays: 0, title: "Ours (Taylor's Version)", youtubeId: "PH8Uc0Z_KRY" },
      { plays: 0, title: "Superman (Taylor's Version)", youtubeId: "Fn0er7H1Dm0" },
      { plays: 0, title: "Electric Touch [feat. Fall Out Boy] (Taylor's Version)", youtubeId: "hMPK2vNXr-E" },
      { plays: 0, title: "When Emma Falls in Love (Taylor's Version)", youtubeId: "IYqgVYjN3Go" },
      { plays: 0, title: "I Can See You (Taylor's Version)", youtubeId: "jOD86iMAEY0" },
      { plays: 0, title: "Castles Crumbling [feat. Hayley Williams] (Taylor's Version)", youtubeId: "V80A8qN4fR8" },
      { plays: 0, title: "Foolish One (Taylor's Version)", youtubeId: "6-x1AlDudZw" },
      { plays: 0, title: "Timeless (Taylor's Version)", youtubeId: "osmzwWw4RYM" },
    ]
  },
  {
    id: "Fearless",
    albumTitle: "Fearless (Taylor's version)",
    coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLzTIOV6nJwbsxhVVLc_gaYAwAwEEarS34VFr-2g6PZg&s=10",
    tracks: [
      { plays: 0, title: "Fearless (Taylor's Version)", youtubeId: "7lLigiVgJsE" },
      { plays: 0, title: "Fifteen (Taylor's Version)", youtubeId: "rLCol1C3ouc" },
      { plays: 0, title: "Love Story (Taylor's Version)", youtubeId: "aXzVF3XeS8M" },
      { plays: 0, title: "Hey Stephen (Taylor's Version)", youtubeId: "tMhiHrL7rPE" },
      { plays: 0, title: "White Horse (Taylor's Version)", youtubeId: "9-rKvhsjwKU" },
      { plays: 0, title: "You Belong With Me (Taylor's Version)", youtubeId: "vwp8Ur6tO-8" },
      { plays: 0, title: "Breathe (Taylor's Version) [feat. Colbie Caillat]", youtubeId: "qsUK-BG5OQQ" },
      { plays: 0, title: "Tell Me Why (Taylor's Version)", youtubeId: "cwFbq-70EwE" },
      { plays: 0, title: "You're Not Sorry (Taylor's Version)", youtubeId: "DNaSlUYIXBg" },
      { plays: 0, title: "The Way I Loved You (Taylor's Version)", youtubeId: "DlexmDDSDZ0" },
      { plays: 0, title: "Forever & Always (Taylor's Version)", youtubeId: "T-41vMWQTUA" },
      { plays: 0, title: "The Best Day (Taylor's Version)", youtubeId: "KZeI9I875Ig" },
      { plays: 0, title: "Change (Taylor's Version)", youtubeId: "jwWR1cQTKyw" },
      { plays: 0, title: "Jump Then Fall (Taylor's Version)", youtubeId: "vUHDR6Rg3Y4" },
      { plays: 0, title: "Untouchable (Taylor's Version)", youtubeId: "8bNlGwnEUAs" },
      { plays: 0, title: "Forever & Always (Piano Version) (Taylor's Version)", youtubeId: "RcGowZ26sE0" },
      { plays: 0, title: "Come In With The Rain (Taylor's Version)", youtubeId: "ePjcjLRHPOo" },
      { plays: 0, title: "Superstar (Taylor's Version)", youtubeId: "IsCik8wznlU" },
      { plays: 0, title: "The Other Side Of The Door (Taylor's Version)", youtubeId: "425n1NoRtgA" },
      { plays: 0, title: "Today Was A Fairytale (Taylor's Version)", youtubeId: "xSWVPqnKcXQ" },
      { plays: 0, title: "You All Over Me (Taylor's Version) (From The Vault) [feat. Maren Morris]", youtubeId: "XKaMUm7YwZc" },
      { plays: 0, title: "Mr. Perfectly Fine (Taylor's Version) (From The Vault)", youtubeId: "rFjJs6ZjPe8" },
      { plays: 0, title: "We Were Happy (Taylor's Version) (From The Vault)", youtubeId: "seU5y5EgIwk" },
      { plays: 0, title: "That's When (Taylor's Version) (From The Vault) [feat. Keith Urban]", youtubeId: "aOa6D6ku3dM" },
      { plays: 0, title: "Don't You (Taylor's Version) (From The Vault)", youtubeId: "dHdAN4FXzmc" },
      { plays: 0, title: "Bye Bye Baby (Taylor's Version) (From The Vault)", youtubeId: "yuFuwXd-B9E" },
      { plays: 0, title: "Love Story (Taylor's Version) [Elvira Remix]", youtubeId: "FeTHyZJvozc" },
    ]
  },
  {
    id: "TaylorSwift",
    albumTitle: "Taylor Swift",
    coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-x0NlwFE0FWNT_mG33qgYvTbYPojvsuZplPk96X9C3Q&s=10",
    tracks: [
      { plays: 0, title: "Tim McGraw", youtubeId: "GkD20ajVxnY" },
      { plays: 0, title: "Picture to Burn", youtubeId: "yCMqcFAigRg" },
      { plays: 0, title: "Teardrops on My Guitar", youtubeId: "xKCek6_dB0M" },
      { plays: 0, title: "A Place in This World", youtubeId: "" },
      { plays: 0, title: "Cold as You", youtubeId: "" },
      { plays: 0, title: "The Outside", youtubeId: "" },
      { plays: 0, title: "Tied Together with a Smile", youtubeId: "" },
      { plays: 0, title: "Stay Beautiful", youtubeId: "" },
      { plays: 0, title: "Should've Said No", youtubeId: "v9bxXO9fj98" },
      { plays: 0, title: "Mary's Song (Oh My My My)", youtubeId: "" },
      { plays: 0, title: "Our Song", youtubeId: "Jb2stN7kH28" },
    ]
  },
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
      'controls': 1,
      'cc_load_policy': 0,
      'disablekb': 1,
      'iv_load_policy': 3,
      'rel': 0,
      'modestbranding': 1,
      'playsinline': 1,
      'enablejsapi': 1,
      'pointer-events': 'auto',
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
    selectedTitle = vinyl.getAttribute('data-title') || vinyl.querySelector('span')?.textContent || 'Taylor Swift';
    selectedAlbum = vinyl.getAttribute('data-album') || 'Écoute Taylor';

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
    const title = vinyl.getAttribute('data-title') || vinyl.querySelector('span')?.textContent || 'Taylor Swift';
    const album = vinyl.getAttribute('data-album') || 'Écoute Taylor';

    selectedYoutubeId = ytId;
    selectedCover = cover;
    selectedTitle = title;
    selectedAlbum = album;

    playSelectedVinyl(ytId, cover, title, album);
  });
}

function playSelectedVinyl(youtubeId, coverUrl, title = selectedTitle, album = selectedAlbum) {
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

  taylorAlbums.forEach(album => {
    album.tracks.forEach(track => {
      if (track.youtubeId === youtubeId) {
        track.plays++;

        localStorage.setItem('taylorAlbums', JSON.stringify(taylorAlbums));
      }
    });
  })

  const titleSpan = document.getElementById('current-music-title');
  titleSpan.textContent = title;
  const AlbumSpan = document.getElementById('current-album-title');
  AlbumSpan.textContent = album;

  renderTopTracks()

  if (platter) platter.classList.add('spinning');
  if (tonearm) tonearm.classList.add('active');

  // Mise à jour de la notification multimédia système
  updateMediaSession(title || 'Titre inconnu', 'Taylor Swift', album || 'Écoute Taylor', coverUrl);
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
  selectedTitle = '';
  selectedAlbum = '';
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
      playSelectedVinyl(selectedYoutubeId, selectedCover, selectedTitle, selectedAlbum);
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
    vinylItem.setAttribute('data-title', title);
    vinylItem.setAttribute('data-album', 'Ajout personnalisé');

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
    item.setAttribute('data-title', track.title);
    item.setAttribute('data-album', album.albumTitle);

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
  renderTopTracks();
  setupTopTracksAccordion();
}

// Lancement automatique dès le chargement du DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// --------------------------------------------------------------------------
// 10. NOTIFICATION MULTIMÉDIA (MEDIA SESSION API)
// --------------------------------------------------------------------------
function updateMediaSession(title, artist, album, coverUrl) {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title || 'Titre inconnu',
      artist: artist || 'Taylor Swift',
      album: album || 'Écoute Taylor',
      artwork: [
        { src: coverUrl || NEUTRAL_COVER, sizes: '512x512', type: 'image/png' }
      ]
    });

    // Bouton Play sur la notification système
    navigator.mediaSession.setActionHandler('play', () => {
      if (player && typeof player.playVideo === 'function') {
        player.playVideo();
      }
    });

    // Bouton Pause sur la notification système
    navigator.mediaSession.setActionHandler('pause', () => {
      if (player && typeof player.pauseVideo === 'function') {
        player.pauseVideo();
      }
    });
  }
}

// --------------------------------------------------------------------------
// 11. SECTION TOP RACK 10 CHANSONS LES PLUS ÉCOUTÉES + DÉFILEMENT TELEPHONE
// --------------------------------------------------------------------------

function renderTopTracks() {
  const swiftRack = document.getElementById('swift-rack');
  if (!swiftRack) return;

  // 1. Aplatir tous les tableaux de pistes de tous les albums en une seule liste
  let allTracks = [];
  taylorAlbums.forEach(album => {
    album.tracks.forEach(track => {
      // On associe la piste à l'image de son album pour l'affichage
      allTracks.push({
        title: track.title,
        youtubeId: track.youtubeId,
        plays: track.plays,
        coverImg: album.coverImg,
        albumTitle: album.albumTitle
      });
    });
  });

  // 2. Trier du plus grand nombre de plays au plus petit
  allTracks.sort((a, b) => b.plays - a.plays);

  // 3. Vider l'ancien affichage et recréer les 10 premiers vinyles
  swiftRack.innerHTML = '';
  
  // On prend les 10 premiers éléments avec .slice(0, 10)
  allTracks.slice(0, 10).forEach(track => {
    const item = document.createElement('div');
    item.className = 'vinyl-item';
    item.setAttribute('draggable', 'true');
    item.setAttribute('data-youtube', track.youtubeId);
    item.setAttribute('data-cover', track.coverImg);
    item.setAttribute('data-title', track.title);
    item.setAttribute('data-album', track.albumTitle);

    item.innerHTML = `
      <div class="sleeve">
        <div class="vinyl-disc">
          <div class="disc-label">
            <img src="${track.coverImg}" alt="${track.title}">
          </div>
        </div>
        <img src="${track.coverImg}" alt="${track.title}">
      </div>
      <span>${track.title} (${track.plays} écoutes)</span>
    `;

    // On réactive le glisser-déposer / clic sur ces nouveaux éléments générés
    makeVinylDraggable(item);
    swiftRack.appendChild(item);
  });
}

function setupTopTracksAccordion() {
  const toggleBtn = document.getElementById('top-tracks-toggle');
  const section = document.querySelector('.top-tracks-section');

  if (toggleBtn && section) {
    toggleBtn.addEventListener('click', () => {
      // Uniquement actif sur les écrans mobiles (< 768px)
      if (window.innerWidth <= 768) {
        section.classList.toggle('open');
      }
    });
  }
}