---
epic: "Epic 4 : Gestion des Taches"
storyId: "4.3"
title: "Recurrence, filtres et assignation"
assignee: "Luis-Manuel"
status: backlog
priority: medium
frs: [FR20, FR21, FR22]
---

# Story 4.3 : Recurrence, filtres et assignation

## User Story

As a **colocataire**,
I want **definir des taches recurrentes, filtrer et assigner des taches**,
So that **les taches regulieres sont automatisees et organisees**.

## Criteres d'Acceptation

**Given** je cree ou modifie une tache
**When** je selectionne une recurrence (quotidienne/hebdo/mensuelle)
**Then** le champ recurrence est sauvegarde sur la tache

**Given** je suis sur la page taches
**When** je filtre par statut, assignation ou date
**Then** seules les taches correspondantes s'affichent

**Given** je suis sur la page taches
**When** j'assigne une tache a un autre membre
**Then** le badge assignation de la tache est mis a jour

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

- `client/src/pages/Tasks.jsx` — Ajouter barre de filtres + champ recurrence dans le dialog creation/edition

### Endpoints API

- `PUT /api/tasks/:id` — Inclure champ `recurrence` (quotidienne/hebdomadaire/mensuelle/aucune)
- `GET /api/tasks?statut=X&assigneA=Y` — Filtrage cote serveur (ou filtrage cote client)

### Composants Utilises

- shadcn/ui : `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `Badge`, `Button`
- Filtres : 3 Select (Statut, Assignation, Date) alignes horizontalement

### Donnees Mock

- Recurrence : champ `recurrence` sur l'entite Tache ("quotidienne", "hebdomadaire", "mensuelle", null)
- Filtrage cote client acceptable (pas besoin de query params serveur pour le MVP)

### Reference Design

- Barre de filtres sous le header, avant les colonnes
- 3 selects inline : "Tous les statuts", "Tous les membres", "Toutes les dates"
- Champ recurrence dans le dialog creation/edition : Select avec options Aucune/Quotidienne/Hebdomadaire/Mensuelle
- Badge recurrence visible sur la card si defini (ex: icone `repeat` + "Hebdo")

## Dependances

- Story 4.1 (liste des taches et creation)
- Story 4.2 (modification)

## Definition of Done

- [ ] Tous les criteres d'acceptation passent
- [ ] Responsive : filtres empiles sur mobile
- [ ] Utilise shadcn/ui (Select, Badge)
- [ ] Filtrage dynamique fonctionnel
- [ ] Champ recurrence sauvegarde et affiche
- [ ] Pas d'erreur console
