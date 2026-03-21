---
epic: "Epic 9 : UX Polish & Validation"
storyId: "9-2"
title: "Pop-ups de confirmation et responsive final"
assignee: "Tous"
status: "done"
priority: "high"
frs: [FR52]
---


## Story 9-2 : Pop-ups de confirmation et responsive final

## Objective

As a **colocataire**,
I want **des confirmations avant les actions critiques et que tout soit responsive**,
So that **je ne supprime rien par accident et l'app marche bien sur mobile**.

## Acceptance Criteria

- **Given** je clique supprimer sur une tache/depense/abonnement/recette
- **When** la pop-up de confirmation s'affiche
- **Then** je dois confirmer avant que l'action s'execute
- **And** le composant ConfirmDialog doit s'afficher avec titre et description

- **Given** je suis sur n'importe quel ecran
- **When** je passe de desktop a mobile (ou inverse)
- **Then** le layout s'adapte sans scroll horizontal et sans perte de fonctionnalite

## Tasks / Subtasks

- [x] 1. Tâche 1 : Vérifier la présence et l'utilisation du composant `ConfirmDialog.jsx`.
  - [x] 1.1 S'il n'existe pas ou n'utilise pas la bonne stack shadcn/ui, le créer avec `AlertDialog`.
- [x] 2. Tâche 2 : Implémenter et brancher les pop-ups de confirmation de suppression sur les différentes pages.
  - [x] 2.1 Brancher sur `Tasks.jsx` (suppression de tâche).
  - [x] 2.2 Brancher sur `Finances.jsx` (suppression de dépense).
  - [x] 2.3 Brancher sur `Food.jsx` (suppression de recette).
  - [x] 2.4 Brancher sur `Subscriptions.jsx` (suppression d'abonnement).
- [x] 3. Tâche 3 : Effectuer un audit responsive complet et corriger les éléments défaillants.
  - [x] 3.1 Vérifier Dashboard, Tasks, Finances, Food, Subscriptions, Settings (breakpoints 768px, pas d'overflow).

## Dev Notes

- Le composant `ConfirmDialog.jsx` doit encapsuler `AlertDialog` de shadcn/ui.
- Il doit recevoir au minimum : `open`, `onOpenChange`, `onConfirm`, `title`, `description`.
- S'assurer que le bouton d'annulation est de variant 'outline' et le bouton de suppression de variant 'destructive'.
- Sur mobile (<768px), vérifier le padding de la page et la présence de la BottomNav sans gêner le contenu principal. Les grilles (ex: Dashboard 2x2, Recettes) doivent passer en 1 colonne sur mobile (`grid-cols-1 md:grid-cols-2`).

## File List

- `client/src/components/ConfirmDialog.jsx`
- `client/src/pages/Tasks.jsx`
- `client/src/pages/Finances.jsx`
- `client/src/pages/Subscriptions.jsx`
- `client/src/pages/Food.jsx`
- `client/src/pages/Dashboard.jsx` (pour audit responsive)
- `client/src/pages/Settings.jsx` (pour audit responsive)
