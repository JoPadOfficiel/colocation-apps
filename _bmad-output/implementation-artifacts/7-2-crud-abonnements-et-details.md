---
epic: "Epic 7 : Gestion des Abonnements"
storyId: "7.2"
title: "CRUD abonnements et details"
assignee: "Yohan"
status: backlog
priority: high
frs: [FR40, FR41, FR42, FR43]
---

# Story 7.2 : CRUD abonnements et details

## User Story

As a **colocataire**,
I want **ajouter, modifier et supprimer des abonnements, voir les places disponibles et les identifiants**,
So that **les abonnements de la colocation sont bien geres**.

## Criteres d'Acceptation

**Given** je clique "AJOUTER ABONNEMENT"
**When** je remplis nom du service, prix, date de prelevement
**Then** l'abonnement est ajoute et le cout total est recalcule

**Given** un abonnement existe
**When** je clique "Modifier"
**Then** je peux modifier ses informations ou le supprimer

**Given** un abonnement a des places limitees
**When** je consulte la card
**Then** le nombre de places disponibles s'affiche (ex: 3/4)

**Given** un abonnement a des identifiants partages
**When** je consulte les details
**Then** les identifiants de connexion sont visibles

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

- `client/src/pages/Subscriptions.jsx` — Ajouter dialog CRUD + affichage places + identifiants

### Endpoints API

- `POST /api/subscriptions` — Body: `{ nomService, coutMensuel, datePrelevement, type, placesTotal, placesUtilisees, identifiantCompte }`
- `PUT /api/subscriptions/:id` — Modifier
- `DELETE /api/subscriptions/:id` — Supprimer

### Composants Utilises

- shadcn/ui : `Dialog`, `DialogContent`, `Input`, `Select`, `Button`, `Badge`
- Material Symbols : `edit`, `delete`, `visibility`, `visibility_off`, `group`
- `ConfirmDialog` pour la suppression

### Donnees Mock

- Places : Netflix 3/4, Spotify 5/6, autres sans limite
- Identifiants : `{ email: "coloc-rivoli@gmail.com", password: "****" }` (masque par defaut, toggle visibilite)

### Reference Design

- Dialog ajout/edition : champs nom service, prix (number), date prelevement (date), type (Select: Premium/Fibre/Famille/Annuel/Fixe)
- Places disponibles : badge "3/4" avec icone `group` sur la card
- Identifiants : section dans le dialog detail avec champ masque + toggle `visibility`/`visibility_off`
- Bouton "Modifier" sur chaque card ouvre le dialog d'edition

## Dependances

- Story 7.1 (liste des abonnements)

## Definition of Done

- [ ] Tous les criteres d'acceptation passent
- [ ] Responsive : fonctionne sur desktop (>=768px) et mobile (<768px)
- [ ] Utilise shadcn/ui (Dialog, Input, Select, Button, Badge)
- [ ] Cout total recalcule apres ajout/suppression
- [ ] Places disponibles affichees
- [ ] Identifiants masquables/affichables
- [ ] Pop-up confirmation suppression
- [ ] Pas d'erreur console
