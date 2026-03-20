# Story 6-2: CRUD recettes et favoris

**Status:** review
**Epic:** Epic 6 — Alimentation & Recettes
**Assignee:** Luis-Manuel

## Objective
Un colocataire peut créer, modifier, supprimer des recettes et les ajouter à ses favoris pour partager ses meilleures idées de repas avec la colocation.

## Acceptance Criteria
- [ ] Un utilisateur peut créer une recette avec : nom, ingrédients, temps de préparation, portions et contraintes alimentaires.
- [ ] Un utilisateur peut modifier une recette existante.
- [ ] Un utilisateur peut supprimer une recette (avec confirmation).
- [ ] Un utilisateur peut ajouter/retirer une recette de ses favoris via une icône cœur.
- [ ] Les changements sont persistés via l'API et reflétés immédiatement dans l'interface.
- [ ] La recherche et les filtres fonctionnent toujours après les modifications.

## Tasks
1. [x] Analyser l'implémentation actuelle de `client/src/pages/Food.jsx`.
2. [x] Ajouter le champ "Contraintes alimentaires" dans le formulaire de création/édition de recette.
   - Utiliser les `COMMON_DIETS` définis dans le fichier.
   - Permettre la sélection multiple.
3. [x] Vérifier et assurer que le toggle "Favori" fonctionne correctement.
4. [x] S'assurer que la suppression utilise le `ConfirmDialog`.
5. [x] Tester le flux complet de CRUD.

## Dev Notes
- L'état `recipeForm` contient déjà `dietaryConstraints: []`.
- Les composants `Checkbox` ou `Badge` cliquables peuvent être utilisés pour la sélection des régimes.
- L'API `updateRecipe` est déjà utilisée pour le favori.

## File List
- `client/src/pages/Food.jsx`
- `server/data/mockData.js` (pour référence des données)
