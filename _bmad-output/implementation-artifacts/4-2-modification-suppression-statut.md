---
epic: "Epic 4 : Gestion des Taches"
storyId: "4.2"
title: "Modification, suppression et changement de statut"
assignee: "Luis-Manuel"
status: backlog
priority: high
frs: [FR17, FR18, FR19]
---

# Story 4.2 : Modification, suppression et changement de statut

## User Story

As a **colocataire**,
I want **modifier, supprimer ou changer le statut d'une tache**,
So that **je peux maintenir la liste de taches a jour**.

## Criteres d'Acceptation

**Given** une tache existe
**When** je clique modifier et change les champs
**Then** la tache est mise a jour

**Given** une tache existe
**When** je clique supprimer et confirme dans la pop-up
**Then** la tache est supprimee

**Given** une tache est "A faire"
**When** je change son statut en "Terminee"
**Then** la tache se deplace dans la colonne "Terminees"

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

- `client/src/pages/Tasks.jsx` — Ajouter menu contextuel (more_horiz) avec Modifier/Supprimer, dialog edition
- `client/src/components/ConfirmDialog.jsx` — Composant reutilisable de confirmation

### Endpoints API

- `PUT /api/tasks/:id` — Body: `{ titre, description, statut, assigneA, dateEcheance }`
- `DELETE /api/tasks/:id`

### Composants Utilises

- shadcn/ui : `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `Dialog`, `AlertDialog`
- Material Symbols : `more_horiz`, `edit`, `delete`
- `ConfirmDialog` (composant partage) pour la confirmation de suppression

### Donnees Mock

- PUT met a jour la tache en memoire et retourne la tache modifiee
- DELETE supprime la tache en memoire

### Reference Design

- Menu contextuel via icone `more_horiz` sur chaque card tache
- Options : "Modifier" (icone edit), "Supprimer" (icone delete, couleur danger)
- Dialog modification : memes champs que la creation, pre-remplis
- Pop-up confirmation suppression : "Etes-vous sur de vouloir supprimer cette tache ?" + boutons Annuler / Supprimer

## Dependances

- Story 4.1 (liste des taches)

## Definition of Done

- [ ] Tous les criteres d'acceptation passent
- [ ] Responsive : fonctionne sur desktop (>=768px) et mobile (<768px)
- [ ] Utilise shadcn/ui (DropdownMenu, Dialog, AlertDialog)
- [ ] Pop-up de confirmation avant suppression
- [ ] Changement de statut deplace la card entre colonnes
- [ ] Pas d'erreur console
