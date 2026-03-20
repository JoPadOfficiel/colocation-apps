# Story 6-1: Menu du jour et recettes

**Status:** review
**Epic:** Epic 6 — Alimentation & Recettes
**Assignee:** Luis-Manuel

## Objective
Un colocataire peut consulter le menu du jour, gérer recettes et liste de courses, définir ses contraintes alimentaires.

## Acceptance Criteria
- [ ] Consulter le menu du jour avec des suggestions de recettes.
- [ ] Rechercher des recettes par ingrédient, catégorie ou nom.
- [ ] Créer, modifier, supprimer des recettes.
- [ ] Ajouter une recette aux favoris.
- [ ] Gérer la liste de courses (ajouter, cocher, supprimer).
- [ ] Définir les contraintes alimentaires de l'utilisateur.

## Tasks
1. [ ] Créer le composant `client/src/pages/Food.jsx`.
2. [ ] Implémenter la section "Liste de courses".
3. [ ] Implémenter la section "Recettes Partagées".
4. [ ] Implémenter la gestion des contraintes alimentaires.
5. [ ] Connecter le composant `Food` dans `client/src/App.jsx`.
6. [ ] Vérifier le responsive et les interactions.

## Dev Notes
- Utiliser les composants `shadcn/ui` (Card, Button, Input, Checkbox, etc.).
- Utiliser les fonctions API de `client/src/lib/api.js`.
- Respecter le design défini dans `ui-design.md`.

## File List
- `client/src/pages/Food.jsx`
- `client/src/App.jsx`
