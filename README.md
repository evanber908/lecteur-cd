# 🎵 Écoute Taylor - MagniVinyl & Swiftie FM

Une application web immersive et Progressive Web App (PWA) dédiée à l'univers de **Taylor Swift**, regroupant un lecteur de type platine CD/vinyle interactive par album et une web radio en direct 24/7[cite: 1, 3, 5].

---

## ✨ Fonctionnalités

* **Platine CD / Vinyle interactive :** Navigation fluide à travers les albums de Taylor Swift, affichage des pochettes d'albums et listes de pistes dynamiques connectées à YouTube[cite: 1, 4].
* **Web Radio en direct (Swiftie FM 103.9) :** Diffusion en continu de la radio dédiée, avec récupération dynamique des métadonnées en temps réel (titre, artiste, pochette)[cite: 1, 2, 3].
* **Intégration Media Session :** Contrôle de la lecture et affichage des pochettes directement sur l'écran de verrouillage et le volet de notification du système (mobile / PC).
* **Progressive Web App (PWA) :** Installable sur mobile et bureau comme une véritable application native grâce au manifeste et au Service Worker[cite: 3, 5].

---

## 📂 Structure du Projet

```text
├── index.html          # Page principale (Lecteur CD / Albums)
├── radio.html          # Page Web Radio en direct
├── style.css           # Styles globaux et design rétro / vinyle
├── script.js           # Logique du lecteur CD et gestion des albums
├── radio.js            # Logique de la web radio, flux audio et Media Session
├── manifest.json       # Configuration PWA pour l'installation mobile
├── sw.js               # Service Worker pour la validation PWA
├── favicon.svg         # Icône du site
└── icons/              # Icônes de l'application (formats PNG 192x192 et 512x512)

---

## 📜 Crédits & Mentions Légales
* Projet personnel de fan sans but lucratif. Les contenus musicaux, les pochettes d'albums et les visuels appartiennent exclusivement à Taylor Swift et à ses ayants droit (Universal Music Group / TAS Rights Management)[cite: 3].