# Colocation Manager

Application web de gestion de colocation : finances, tâches ménagères, alimentation et abonnements partagés.

---

## Structure du projet

Monorepo avec workspaces NPM :

- `/client` — Frontend React + Vite + TailwindCSS + shadcn/ui
- `/server` — Backend Express + Node.js + persistance JSON (`/server/data/db`)

---

## Stack technique

- **Frontend** : React 19, Vite, TailwindCSS, Lucide React, shadcn/ui
- **Backend** : Express 5, Node.js
- **Stockage** : Fichiers JSON (pas de base de données externe)
- **Outils** : Concurrently, Vitest

---

## Installation

```bash
npm install
npm run dev
```

- Frontend : `http://localhost:5173`
- Backend : `http://localhost:3000`

---

## Fonctionnalités

- **Dashboard** : vue d'ensemble, solde cagnotte, tâches urgentes, activités récentes
- **Finances** : dépenses communes, calcul automatique des dettes/créances, graphique mensuel
- **Tâches** : création, assignation, statuts (À faire / En cours / Terminée), bulk actions
- **Alimentation** : liste de courses partagée, catalogue de recettes, contraintes alimentaires
- **Abonnements** : gestion des abonnements partagés (Netflix, Spotify, etc.)
- **Réglages** : profil, gestion des membres, code d'invitation, notifications

---

## Contributeurs

- **JoPad Officiel** — Architecture, fondations, dashboard, finances, corrections
- **YohannMbongueMbappe** — Authentification, abonnements, réglages
- **luismanuel95** — Tâches, alimentation, composants UI
