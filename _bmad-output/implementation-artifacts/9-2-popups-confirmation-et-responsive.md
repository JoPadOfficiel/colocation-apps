---
epic: "Epic 9 : UX Polish & Validation"
storyId: "9.2"
title: "Pop-ups de confirmation et responsive final"
assignee: "Tous"
status: backlog
priority: medium
frs: [FR52]
---

# Story 9.2 : Pop-ups de confirmation et responsive final

## User Story

As a **colocataire**,
I want **des confirmations avant les actions critiques et que tout soit responsive**,
So that **je ne supprime rien par accident et l'app marche bien sur mobile**.

## Criteres d'Acceptation

**Given** je clique supprimer sur une tache/depense/abonnement
**When** la pop-up de confirmation s'affiche
**Then** je dois confirmer avant que l'action s'execute

**Given** je suis sur n'importe quel ecran
**When** je passe de desktop a mobile (ou inverse)
**Then** le layout s'adapte sans scroll horizontal et sans perte de fonctionnalite

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

- `client/src/components/ConfirmDialog.jsx` — Composant reutilisable (si pas deja cree)
- Verification responsive sur TOUTES les pages :
  - `Dashboard.jsx` — Grille widgets 2x2 → 1 col
  - `Tasks.jsx` — Colonnes Kanban → empilees
  - `Finances.jsx` — Cards metriques + tableau → empiles, tableau scroll-x
  - `Food.jsx` — Grille recettes 2x2 → 1 col
  - `Subscriptions.jsx` — Grille cards → 1 col
  - `Settings.jsx` — Formulaires pleine largeur

### Composant ConfirmDialog

```jsx
// Props : open, onConfirm, onCancel, title, description
// Utilise shadcn/ui AlertDialog
```

### Composants Utilises

- shadcn/ui : `AlertDialog`, `AlertDialogAction`, `AlertDialogCancel`, `AlertDialogContent`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogHeader`, `AlertDialogTitle`

### Donnees Mock

Aucune donnee supplementaire.

### Reference Design

- Pop-up : fond overlay sombre, card centree, titre "Confirmer la suppression", description "Cette action est irreversible", boutons "Annuler" (outline) et "Supprimer" (danger, rouge)
- Responsive : aucun scroll horizontal (`overflow-x-hidden`), breakpoint 768px respecte partout
- NFR7 : Desktop >=1024px, Mobile >=375px
- NFR8 : Pas de scroll horizontal

## Dependances

- Toutes les stories precedentes (c'est une story de polish transversale)

## Definition of Done

- [ ] Tous les criteres d'acceptation passent
- [ ] ConfirmDialog utilise partout pour les suppressions
- [ ] TOUS les ecrans responsive : desktop + mobile sans scroll horizontal
- [ ] Navigation sidebar/bottom tab bar fonctionne correctement
- [ ] Aucune perte de fonctionnalite entre desktop et mobile
- [ ] Pas d'erreur console
