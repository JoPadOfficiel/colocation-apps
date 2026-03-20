---
epic: "Epic 5 : Gestion des Finances"
storyId: "5.2"
title: "CRUD depenses et tableau"
assignee: "Jopad"
status: backlog
priority: high
frs: [FR26, FR27, FR28, FR30]
---

# Story 5.2 : CRUD depenses et tableau

## User Story

As a **colocataire**,
I want **ajouter, modifier et supprimer des depenses et les voir dans un tableau**,
So that **toutes les depenses sont suivies et tracables**.

## Criteres d'Acceptation

**Given** je clique "AJOUTER DEPENSE"
**When** je remplis titre, montant, date et payeur
**Then** la depense est ajoutee et le tableau se met a jour

**Given** le tableau de depenses s'affiche
**When** je consulte les colonnes
**Then** je vois : Date, Paye par, Description, Montant
**And** la pagination affiche "1 a 5 sur X resultats" avec boutons Precedent/Suivant

**Given** une depense existe
**When** je la modifie ou la supprime (avec confirmation)
**Then** les donnees et l'equilibre sont recalcules

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

- `client/src/pages/Finances.jsx` — Ajouter tableau pagine + dialog CRUD

### Endpoints API

- `POST /api/finances` — Body: `{ titre, montant, date, payePar }`
- `PUT /api/finances/:id` — Modifier une depense
- `DELETE /api/finances/:id` — Supprimer une depense

### Composants Utilises

- shadcn/ui : `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `Dialog`, `Input`, `Select`, `Button`, `DropdownMenu`
- Material Symbols : `more_vert`, `edit`, `delete`, `add`
- `ConfirmDialog` pour la suppression

### Donnees Mock

- 24 depenses au total, paginées par 5
- Colonnes : Date ("24 Oct 2023"), Paye par (prenom), Description, Montant (XX,XX EUR)
- Menu contextuel par ligne : Modifier / Supprimer

### Reference Design

**Ecran 5 — Finances (ui-design.md) :**
- Tableau sous les 3 cards metriques
- Colonnes : Date, Paye par, Description, Montant
- Pagination : "1 a 5 sur 24 resultats" + boutons Precedent/Suivant
- Menu `more_vert` par ligne pour Modifier/Supprimer
- Dialog ajout/edition : champs titre, montant (number), date (date picker), payeur (Select avec membres)

## Dependances

- Story 5.1 (vue finances et cards)

## Definition of Done

- [ ] Tous les criteres d'acceptation passent
- [ ] Responsive : tableau scrollable horizontalement sur mobile
- [ ] Utilise shadcn/ui (Table, Dialog, Input, Select, Button)
- [ ] Pagination fonctionnelle (5 par page)
- [ ] Pop-up confirmation suppression
- [ ] Pas d'erreur console
