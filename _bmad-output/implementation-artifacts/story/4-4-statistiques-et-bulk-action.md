---
epic: "Epic 4 : Gestion des Taches"
storyId: "4.4"
title: "Statistiques et bulk action"
assignee: "Luis-Manuel"
status: backlog
priority: medium
frs: [FR23, FR24]
---

# Story 4.4 : Statistiques et bulk action

## User Story

As a **colocataire**,
I want **voir les statistiques par membre et deleguer plusieurs taches en une fois**,
So that **la repartition du travail est equitable et efficace**.

## Criteres d'Acceptation

**Given** je suis sur la page taches
**When** je consulte les statistiques
**Then** l'historique des taches par membre s'affiche (nombre terminees par personne)

**Given** je selectionne plusieurs taches
**When** je choisis "Deleguer" dans le menu bulk action
**Then** toutes les taches selectionnees sont reassignees au membre choisi

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

- `client/src/pages/Tasks.jsx` — Ajouter section statistiques + mode selection multiple + barre bulk action

### Endpoints API

- `GET /api/tasks` — Calculer les stats cote client a partir des donnees
- `PUT /api/tasks/:id` — Appele en boucle pour chaque tache reassignee (ou creer `PUT /api/tasks/bulk`)

### Composants Utilises

- shadcn/ui : `Card`, `Badge`, `Button`, `Select`, `Checkbox`
- Material Symbols : `bar_chart`, `group`, `swap_horiz`

### Donnees Mock

- **Statistiques par membre** :
  - Thomas : 5 taches terminees
  - Lea : 3 taches terminees
  - Marc : 4 taches terminees
- Calculees dynamiquement a partir des taches mockees

### Reference Design

- Section statistiques : cards avec nom du membre, nombre de taches terminees, barre de progression ou pourcentage
- Mode bulk : checkbox sur chaque card tache, barre d'action en bas "X taches selectionnees" + bouton "Deleguer a..." (Select membre) + bouton "Appliquer"
- Responsive : statistiques en grille, barre bulk fixe en bas

## Dependances

- Story 4.1 (liste des taches)
- Story 4.2 (modification)

## Definition of Done

- [ ] Tous les criteres d'acceptation passent
- [ ] Responsive : fonctionne sur desktop (>=768px) et mobile (<768px)
- [ ] Utilise shadcn/ui (Card, Checkbox, Select, Button)
- [ ] Statistiques calculees dynamiquement
- [ ] Bulk action reassigne les taches selectionnees
- [ ] Pas d'erreur console
