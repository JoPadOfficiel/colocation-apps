---
epic: "Epic 6 : Alimentation & Recettes"
storyId: "6.2"
title: "CRUD recettes et favoris"
assignee: "Luis-Manuel"
status: backlog
priority: high
frs: [FR34, FR35, FR36]
---

# Story 6.2 : CRUD recettes et favoris

## User Story

As a **colocataire**,
I want **creer, modifier, supprimer des recettes et les ajouter en favoris**,
So that **la colocation a ses propres recettes partagees**.

## Criteres d'Acceptation

**Given** je clique "Proposer une recette"
**When** je remplis nom, ingredients, temps de preparation, contraintes
**Then** la recette est creee et apparait dans la liste

**Given** une recette existe
**When** je clique sur l'icone coeur
**Then** la recette est ajoutee a mes favoris (icone remplie)

**Given** une recette existe
**When** je la modifie ou la supprime
**Then** les changements sont appliques

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

- `client/src/pages/Food.jsx` — Ajouter dialog creation recette + toggle favori + menu edition/suppression

### Endpoints API

- `POST /api/recipes` — Body: `{ nomPlat, ingredients, tempsPreparation, contraintesDiets, portions }`
- `PUT /api/recipes/:id` — Modifier (inclut toggle `estFavori`)
- `DELETE /api/recipes/:id`

### Composants Utilises

- shadcn/ui : `Dialog`, `DialogContent`, `Input`, `Button`, `DropdownMenu`
- Material Symbols : `favorite`, `favorite_border`, `edit`, `delete`, `restaurant_menu`
- `ConfirmDialog` pour la suppression

### Donnees Mock

- Toggle favori : change `estFavori` true/false
- Creation : ajoute une recette au tableau en memoire

### Reference Design

- Bouton "Proposer une recette" avec icone `restaurant_menu`
- Dialog creation : champs nom, ingredients (textarea), temps preparation, portions, contraintes alimentaires (tags)
- Icone coeur sur chaque card : `favorite_border` → `favorite` (couleur `danger` #ef4444 quand actif)
- Menu contextuel par card : Modifier / Supprimer

## Dependances

- Story 6.1 (liste des recettes)

## Definition of Done

- [ ] Tous les criteres d'acceptation passent
- [ ] Responsive : fonctionne sur desktop (>=768px) et mobile (<768px)
- [ ] Utilise shadcn/ui (Dialog, Input, Button, DropdownMenu)
- [ ] Toggle favori avec changement visuel immediat
- [ ] Pop-up confirmation suppression
- [ ] Pas d'erreur console
