storyId: 9-1
title: "Validation formulaires et messages d'erreur"
epic: "Epic 9: UX Polish & Validation"
status: "done"
---

# Story 9-1 : Validation formulaires et messages d'erreur

**Objective:**
Assurer que l'application fournit des feedbacks clairs lors de saisies invalides et valider les différents formulaires de l'application.

**Acceptance Criteria:**
- [x] Le formulaire de Login valide la saisie de l'email et du mot de passe.
- [x] Le formulaire de Register valide la saisie des champs obligatoires (nom, email, mot de passe > 8 caractères).
- [x] Le formulaire de création de Tâche (Tasks.jsx) affiche un message d'erreur si le titre est vide.
- [x] L'ajout d'une Dépense (Finances.jsx) avec un montant <= 0 affiche un message d'erreur explicite.
- [x] Le formulaire de création de Recette (Food.jsx) valide l'existence des champs obligatoires.
- [x] L'ajout d'un Abonnement (Subscriptions.jsx) est validé correctement.
- [x] Tous les messages d'erreur doivent s'afficher en rouge (`text-red-500` de Tailwind).

**Tasks/Subtasks:**
1. Modifier `client/src/pages/Login.jsx` pour ajouter la validation
2. Modifier `client/src/pages/Register.jsx` pour ajouter la validation
3. Modifier `client/src/pages/Tasks.jsx` pour ajouter la validation sur la création/édition de tâche
4. Modifier `client/src/pages/Finances.jsx` pour bloquer les montants <= 0 et empêcher la soumission de titres vides
5. Modifier `client/src/pages/Food.jsx` pour ajouter la validation au formulaire de recette
6. Modifier `client/src/pages/Subscriptions.jsx` pour ajouter la validation

**Dev Notes:**
- Utiliser le composant HTML5 standard de validation ou l'état local (`useState`) pour la gestion des erreurs.
- Les messages d'erreur doivent être clairs et utiliser la classe `text-red-500` / `text-sm`.

**File List:**
- `client/src/pages/Login.jsx`
- `client/src/pages/Register.jsx`
- `client/src/pages/Tasks.jsx`
- `client/src/pages/Finances.jsx`
- `client/src/pages/Food.jsx`
- `client/src/pages/Subscriptions.jsx`

## Dev Agent Record
- **Action Taken:** Checked Login/Register validations. Added formError state to Tasks.jsx, formErrors to Finances.jsx, and recipeErrors to Food.jsx. Verified Subscriptions.jsx uses form errors nicely.
- **Issues Found:** ESLint reports "unused variables" for react/jsx-runtime components due to a missing rule in the config, this was safely ignored.
- **Files Modified:** `client/src/pages/Tasks.jsx`, `client/src/pages/Finances.jsx`, `client/src/pages/Food.jsx`
