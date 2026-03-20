---
title: "Story 2.2 : Page d'inscription"
epic: "Epic 2 : Authentification & Onboarding"
status: "ready-for-dev"
assignee: "Yohan"
---

# Story 2.2 : Page d'inscription

Status: ready-for-dev

## Story

As a visiteur,
I want créer un compte avec mon nom, email et mot de passe,
so that je peux rejoindre ou créer une colocation.

## Acceptance Criteria

1. **Given** je suis sur `/register`, **When** je remplis nom, email, mot de passe (≥8 caractères) et clique "S'INSCRIRE", **Then** mon compte est créé et je suis redirigé vers le choix créer/rejoindre colocation.
2. **And** des boutons Google et Facebook sont affichés (visuels uniquement, non fonctionnels).
3. **And** un lien "Déjà un compte ? Se connecter" est visible.

## Tasks / Subtasks

- [ ] **Task 1 : Créer Register.jsx** (AC: #1, #2, #3)
  - [ ] Formulaire : nom complet, email, mot de passe (toggle visibilité)
  - [ ] Validation : nom requis, email format, password ≥ 8 chars
  - [ ] Bouton "S'INSCRIRE" pleine largeur, loading state
  - [ ] Boutons Google/Facebook visuels (non fonctionnels)
  - [ ] Lien "Déjà un compte ? Se connecter" → /login
  - [ ] Redirect si déjà authentifié

- [ ] **Task 2 : Route API POST /api/auth/register** (AC: #1)
  - [ ] Ajouter endpoint dans server/index.js
  - [ ] Vérifier que l'email n'existe pas déjà
  - [ ] Créer l'utilisateur dans le mock array
  - [ ] Retourner le user créé (sans password)

- [ ] **Task 3 : Ajouter register() dans AuthContext** (AC: #1)
  - [ ] Fonction register(name, email, password)
  - [ ] Appelle POST /api/auth/register
  - [ ] Met à jour user dans le state + sessionStorage
  - [ ] Retourne success/error

- [ ] **Task 4 : Mettre à jour App.jsx** (AC: #1)
  - [ ] Remplacer le placeholder /register par Register.jsx

## Dev Notes

- Suivre exactement les patterns de Login.jsx
- Après inscription réussie, redirect vers /onboarding (Story 2.3) — pour l'instant /dashboard
- Les boutons social sont visuels uniquement — pas de onClick

### File List
- `client/src/pages/Register.jsx` (nouveau)
- `client/src/contexts/AuthContext.jsx` (modifier — ajouter register())
- `client/src/App.jsx` (modifier — route /register)
- `server/index.js` (modifier — POST /api/auth/register)

## Dev Agent Record

### Agent Model Used
### Completion Notes List
### File List
