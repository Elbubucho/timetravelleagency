# TimeTravel Agency — Webapp Interactive

Webapp moderne pour une agence de voyage temporel fictive, développée dans le
cadre du projet M1 Full stack IA. L'application met en
scène trois destinations (Paris 1889, Crétacé -65M, Florence 1504) et intègre
un agent conversationnel ainsi qu'un quiz de recommandation, tous deux
propulsés par l'IA générative.

## 👥 Équipe

- **Valentin Sala**
- **Kevin Vitali**
- **Clément Machtelinckx**
- **Benoit Bremaud**

## 🚀 Démo en ligne

URL publique (Vercel) : https://timetravelleagency.vercel.app

## 🛠️ Stack technique

| Couche | Techno |
|---|---|
| Framework front | **React 19** + **Vite 8** |
| Styling | **Tailwind CSS 3** (thème sombre + accents dorés) |
| Animations | **Framer Motion** (fade-in au scroll, hero stagger, hover cards) |
| Rendu markdown | **react-markdown** (réponses du chatbot) |
| Modèle IA | **Mistral `mistral-small-latest`** via API |
| Backend (API) | Fonctions **Serverless Vercel** (Node runtime) |
| Hébergement | **Vercel** |

Les fonctions serverless `api/chat.js` et `api/recommend.js` servent de proxy
entre le front et l'API Mistral afin que la clé API ne soit **jamais exposée**
côté client. En développement local, un middleware Vite dans
`vite.config.js` fournit exactement les mêmes endpoints pour un DX identique.

## ✨ Fonctionnalités

- 🏠 **Page d'accueil** avec hero plein écran, CTA et présentation de l'agence.
- 🗺️ **Galerie des 3 destinations** (Paris 1889, Crétacé, Florence 1504)
  avec cards interactives — images, highlights, prix, durée.
- 💬 **Agent conversationnel** (chatbot flottant) — propulsé par Mistral
  `mistral-small-latest`, capable de conseiller, répondre aux questions FAQ,
  comparer les destinations et justifier les tarifs.
- 🧭 Navigation sticky, design responsive (mobile-first), thème sombre.
  
- ✨ **Animations** fluides avec Framer Motion (fade-in au scroll, stagger
  hero, hover cards, transitions du modal).
- 🎯 **Quiz de recommandation personnalisée** (4 questions) : l'IA analyse le
  profil du client et recommande la destination idéale avec une explication
  personnalisée (réponse structurée en JSON côté serveur pour fiabilité).

## 🤖 Outils IA utilisés

Dans un souci de transparence et conformément aux bonnes pratiques :

- **Génération de code** : Claude Code (Anthropic) — échafaudage initial,
  composants React, styling Tailwind, intégration API.
- **Chatbot runtime** : Mistral AI — modèle `mistral-small-latest`.
- **Recommandation du quiz** : Mistral AI en mode `response_format: json_object`
  pour garantir une sortie structurée.
- **Visuels** : placeholders Unsplash (images libres de droits).

## 📦 Installation locale

```bash
# 1. Cloner le repo
git clone https://github.com/<user>/timetravel-webapp.git
cd timetravel-webapp

# 2. Installer les dépendances
npm install

# 3. Copier la variable d'environnement
cp .env.example .env
#   puis éditer .env et y renseigner MISTRAL_API_KEY

# 4. Lancer le serveur de développement
npm run dev
# → http://localhost:5173
```

### Obtenir une clé Mistral

1. Créer un compte sur https://console.mistral.ai/
2. Aller dans **API Keys** et générer une clé.
3. Le tier gratuit est suffisant pour tester l'application.

## 🌐 Déploiement sur Vercel

1. Pousser le projet sur GitHub.
2. Se connecter sur https://vercel.com/ et importer le repo.
3. Dans **Settings → Environment Variables**, ajouter :
   - `MISTRAL_API_KEY` = votre clé.
4. Vercel détecte automatiquement Vite, build et déploie.
5. Les fonctions `api/chat.js` et `api/recommend.js` sont détectées comme
   Serverless Functions sans configuration supplémentaire.

## 🗂️ Structure du projet

```
timetravel-webapp/
├── api/
│   ├── chat.js              # Serverless proxy pour le chatbot
│   └── recommend.js         # Serverless proxy pour le quiz (JSON structuré)
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── DestinationCard.jsx
│   │   ├── DestinationsSection.jsx
│   │   ├── QuizSection.jsx
│   │   ├── QuizModal.jsx
│   │   ├── ChatWidget.jsx
│   │   └── Footer.jsx
│   ├── data/
│   │   ├── destinations.js  # Les 3 destinations (données statiques)
│   │   └── quiz.js          # Questions du quiz
│   ├── lib/
│   │   └── motion.js        # Variants Framer Motion partagés
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── vite.config.js           # Dev middleware reproduisant les endpoints /api/*
├── tailwind.config.js
├── .env.example
└── README.md
```

## 🔒 Sécurité

- La clé `MISTRAL_API_KEY` n'est **jamais exposée au navigateur** : elle est
  lue uniquement par les fonctions serverless côté serveur.
- Le fichier `.env` est git-ignoré.
- Les identifiants de destination retournés par l'IA sont validés côté serveur
  pour éviter les hallucinations avant d'être renvoyés au client.

## 📄 Licence

Projet pédagogique sans visée commerciale.

## 🙏 Crédits

- Modèle IA : [Mistral AI](https://mistral.ai/)
- Images : [Unsplash](https://unsplash.com/) (placeholders libres de droits)
- Polices : Playfair Display et Inter via Google Fonts
- Icônes : émojis Unicode
#timetravellagency
