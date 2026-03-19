---
epic: "Epic 3 : Dashboard & Vue d'ensemble"
storyId: "3.3"
title: "Navigation depuis les widgets"
assignee: "Jopad"
status: backlog
priority: medium
frs: [FR15]
---

# Story 3.3 : Navigation depuis les widgets

## User Story

As a **colocataire**,
I want **cliquer sur un widget pour aller directement au module correspondant**,
So that **je peux agir rapidement sur ce que je vois dans le dashboard**.

## Criteres d'Acceptation

**Given** je suis sur le dashboard
**When** je clique sur le widget Taches
**Then** je suis redirige vers `/tasks`

**Given** je suis sur le dashboard
**When** je clique sur le widget Finances
**Then** je suis redirige vers `/finances`

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

- `client/src/components/WidgetCard.jsx` — Ajouter prop `href` et wrapper `useNavigate()` ou `<Link>`
- `client/src/pages/Dashboard.jsx` — Passer les routes aux widgets

### Endpoints API

Aucun endpoint supplementaire.

### Composants Utilises

- React Router : `useNavigate()` ou `<Link>`
- Le WidgetCard doit avoir `cursor-pointer` et un effet hover

### Donnees Mock

Aucune donnee supplementaire.

### Reference Design

- Chaque widget est cliquable (cursor pointer)
- Effet hover : legere elevation (`shadow-md`) ou changement de bordure
- Mapping widgets → routes :
  - Finances → `/finances`
  - Taches → `/tasks`
  - Alimentation → `/food`
  - Abonnements → `/subscriptions`

## Dependances

- Story 3.1 (dashboard avec widgets)

## Definition of Done

- [ ] Tous les criteres d'acceptation passent
- [ ] Les 4 widgets redirigent vers le bon module
- [ ] Effet hover visible sur chaque widget
- [ ] Cursor pointer sur les widgets
- [ ] Pas d'erreur console
