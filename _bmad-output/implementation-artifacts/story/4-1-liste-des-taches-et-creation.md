---
epic: "Epic 4 : Gestion des Taches"
storyId: "4.1"
title: "Liste des taches et creation"
assignee: "Luis-Manuel"
status: done
priority: high
frs: [FR16, FR19]
---

# Story 4.1 : Liste des taches et creation

## User Story

As a **colocataire**,
I want **voir les taches en colonnes (A Faire / Terminees) et en creer de nouvelles**,
So that **je peux organiser les taches menageres de la colocation**.

## Criteres d'Acceptation

**Given** je suis sur `/tasks`
**When** la page se charge
**Then** les taches s'affichent en colonnes "A Faire" et "Terminees" avec compteurs
**And** chaque card affiche : categorie, titre, date, assignation

**Given** je clique "NOUVELLE TACHE"
**When** je remplis titre, description, statut, assignation, date d'echeance
**Then** la tache est creee et apparait dans la colonne appropriee

### Citations Code (Tasks.jsx)

- **Composant TaskCard** : `L460-528` (Affiche Badge catégorie, titre, recurrence badge, date, utilisateur assigné)
- **Logique Kanban (Statuts)** : `L192-193` (Filtrage des tâches "À Faire" vs "Terminées")
- **Dialog de Création** : `L287-368` (Intégration du composant `Dialog` avec le formulaire `handleSubmit`)
- **API (CreateTask)** : `L107-109` (Appel à `createTask` dans `handleSubmit`)

## Dependances

- Story 1.2 (Layout + navigation)
- Story 1.3 (AuthContext + mock data)

## Definition of Done

- [x] Tous les criteres d'acceptation passent
- [x] Responsive : colonnes cote a cote desktop, empilees mobile
- [x] Utilise @base-ui/react (Card, Badge, Dialog, Select, Input, Button)
- [x] Donnees mock depuis mockData.js via API
- [x] Dialog de creation fonctionnel
- [x] Pas d'erreur console

## Dev Agent Record

### Implementation Plan

- Vérification du code existant dans `Tasks.jsx` — la page avait déjà l'essentiel de la logique (colonnes Kanban, TaskCard, formulaire de création)
- Le formulaire utilisait un `<Card>` inline au lieu d'un `<Dialog>` shadcn/ui → refactorisé pour utiliser le composant Dialog (Base UI)
- Utilisation des composants UI premium (@base-ui/react) avec support des attributs `data-slot`
- Mise à jour du titre de la page en "Tâches de la Colocation" conformément au design spec
- Remplacement du state `showForm` par `dialogOpen` pour contrôler le Dialog
- Ajout d'une fonction `openCreateDialog()` dédiée

### Completion Notes

✅ Story 4.1 implémentée et vérifiée :
- Page `/tasks` affiche les tâches en colonnes Kanban "À Faire" et "Terminées" avec compteurs de badges
- Cards affichent catégorie (Badge), titre, date locale, et l'avatar/nom de l'assigné
- Dialog de création fonctionnel avec validation des champs requis (titre)
- Données persistées via API mock (`createTask`)
- Responsive : `grid-cols-1 md:grid-cols-2`
- Build Vite réussi et composants UI fixes (index.css et plugins)
- Aucune erreur console en runtime
- Utilise les composants UI `@base-ui/react` (Select, Dialog, etc.) harmonisés avec le reste du projet.

## File List

- `client/src/pages/Tasks.jsx` — Modifié (refactorisation Card → Dialog pour le formulaire)

## Change Log

- 2026-03-20 : Refactorisation du formulaire de création de tâche — remplacement du Card inline par un Dialog shadcn/ui modal. Ajout des labels de champs. Mise à jour du titre de page.
