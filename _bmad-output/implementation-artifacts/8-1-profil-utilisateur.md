---
epic: "Epic 8 : Reglages & Profil"
storyId: "8.1"
title: "Profil utilisateur"
assignee: "Yohan"
status: backlog
priority: medium
frs: [FR44]
---

# Story 8.1 : Profil utilisateur

## User Story

As a **colocataire**,
I want **modifier mon nom et email**,
So that **mes informations sont a jour**.

## Criteres d'Acceptation

**Given** je suis sur `/settings`
**When** je modifie mon nom ou email et clique "Mettre a jour"
**Then** mes informations sont sauvegardees

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

- `client/src/pages/Settings.jsx` — Section Profil avec formulaire

### Endpoints API

- `PUT /api/users/:id` — Body: `{ nom, email }`

### Composants Utilises

- shadcn/ui : `Card`, `CardHeader`, `CardContent`, `Input`, `Button`
- Material Symbols : `person`, `mail`

### Donnees Mock

- Utilisateur connecte (Thomas Durand, thomas@coloc.fr) pre-rempli dans les champs
- PUT met a jour en memoire et dans l'AuthContext

### Reference Design

**Ecran 8 — Reglages (ui-design.md) :**
- Section "Profil"
- Sous-titre : "Mettez a jour vos informations personnelles et votre compte"
- Champ "Nom complet" (text, pre-rempli)
- Champ "Adresse e-mail" (email, pre-rempli)
- Bouton "Mettre a jour" (primary)

## Dependances

- Story 1.2 (Layout + navigation)
- Story 1.3 (AuthContext)

## Definition of Done

- [ ] Tous les criteres d'acceptation passent
- [ ] Responsive : fonctionne sur desktop (>=768px) et mobile (<768px)
- [ ] Utilise shadcn/ui (Card, Input, Button)
- [ ] Champs pre-remplis avec donnees utilisateur
- [ ] Mise a jour refletee dans l'AuthContext
- [ ] Pas d'erreur console
