# 🏠 Colocation Manager

Une application moderne et intuitive pour la gestion quotidienne d'une colocation. Simplifiez vos finances, vos tâches ménagères et vos repas en un seul endroit.

---

## 📂 Structure du Projet

Le projet est organisé en un **Monorepo** utilisant les **Workspaces NPM**, divisé en deux parties principales :

### 📡 Server (Backend)
- **Localisation** : `/server`
- **Technologie** : Node.js avec **Express**.
- **Base de données** : Fichiers **JSON** (`/server/data/db`), permettant une persistence légère et rapide sans base de données externe.
- **Fonctionnalités** : API REST pour la gestion des utilisateurs, des tâches, des finances (dépenses et cagnotte), de la liste de courses et des abonnements.

### 💻 Client (Frontend)
- **Localisation** : `/client`
- **Technologie** : **React** avec **Vite**.
- **Design** : **Vanilla CSS** et composants personnalisés basés sur **Base UI** pour une expérience fluide et premium.
- **Gestion d'état** : React Context API pour l'authentification et les données globales.

---

## 🛠️ Stack Technique

- **Frontend** : React 19, Vite, TailwindCSS (pour certaines utilités), Lucide React (icones).
- **Backend** : Express 5, Node.js.
- **Stockage** : Persistence via système de fichiers JSON.
- **Outils** : Concurrently (pour lancer client et serveur en une commande), Vitest (tests).

---

## 🚀 Installation et Lancement

Pour lancer l'application en mode développement (Client + Serveur) :

```bash
# Dans la racine du projet
npm install
npm run dev
```

- **Frontend** : Accessible sur `http://localhost:5173`
- **Backend** : Accessible sur `http://localhost:3000`

---

## ✨ Fonctionnalités Principales

1. **Tableau de Bord** : Vue d'ensemble de la colocation, solde actuel et tâches urgentes.
2. **Finances** : Gestion des dépenses communes, calcul automatique des dettes/créances et historique détaillé.
3. **Tâches** : Attribution et suivi des tâches ménagères avec tri intelligent par priorité.
4. **Alimentation** : Liste de courses partagée (avec assignation par membre) et carnet de recettes.
5. **Abonnements** : Centralisation des contrats (Netflix, Électricité, Internet) pour ne jamais oublier un paiement.

---

## 👥 Qui a travaillé sur ce projet ?

Ce projet est le fruit d'une collaboration en **Pair Programming** entre :
- **JoPad** : Porteur du projet, responsable de la vision produit et du pilotage des développements.
- **Antigravity (AI)** : Agent d'IA spécialisé dans le développement logiciel, responsable de l'implémentation technique, du refactoring et de la résolution de bugs.

---

## 📝 Historique des Développements

Le projet a été développé de manière itérative, en mettant l'accent sur la qualité du code et l'expérience utilisateur (UX). Les derniers correctifs majeurs ont porté sur la fiabilisation de la persistance des données (génération d'IDs robustes) et le perfectionnement des interfaces de saisie.

---
*© 2026 Colocation Manager - Développé avec passion.*
