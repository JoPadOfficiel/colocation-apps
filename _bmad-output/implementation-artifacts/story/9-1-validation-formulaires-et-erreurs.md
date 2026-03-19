---
epic: "Epic 9 : UX Polish & Validation"
storyId: "9.1"
title: "Validation formulaires et messages d'erreur"
assignee: "Tous"
status: backlog
priority: medium
frs: [FR51]
---

# Story 9.1 : Validation formulaires et messages d'erreur

## User Story

As a **colocataire**,
I want **voir des messages d'erreur clairs quand je fais une saisie invalide**,
So that **je sais exactement quoi corriger**.

## Criteres d'Acceptation

**Given** je soumets un formulaire avec des champs requis vides
**When** la validation s'execute
**Then** un message d'erreur rouge s'affiche sous chaque champ invalide

**Given** je tente d'ajouter une depense de 0EUR ou negative
**When** la validation s'execute
**Then** un message explicite refuse la saisie

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

Tous les fichiers contenant des formulaires :
- `client/src/pages/Login.jsx` — Validation email/password
- `client/src/pages/Register.jsx` — Validation nom/email/password (>=8 chars)
- `client/src/pages/Tasks.jsx` — Validation titre requis
- `client/src/pages/Finances.jsx` — Validation montant > 0, titre requis
- `client/src/pages/Food.jsx` — Validation nom recette requis
- `client/src/pages/Subscriptions.jsx` — Validation nom/prix requis
- `client/src/pages/Settings.jsx` — Validation nom/email requis

### Pattern de Validation

```jsx
const [errors, setErrors] = useState({});

const validate = () => {
  const newErrors = {};
  if (!form.titre) newErrors.titre = "Le titre est requis";
  if (form.montant <= 0) newErrors.montant = "Le montant doit etre superieur a 0";
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

Message d'erreur sous chaque champ : `<p className="text-sm text-red-500 mt-1">{errors.champ}</p>`

### Composants Utilises

- shadcn/ui : `Input` (avec bordure rouge si erreur), `Label`
- Classes Tailwind : `text-red-500`, `border-red-500`

### Donnees Mock

Aucune donnee supplementaire — c'est de la logique de validation cote client.

### Reference Design

- Champ en erreur : bordure rouge (`border-red-500`)
- Message sous le champ : texte rouge petit (`text-sm text-red-500`)
- Messages clairs en francais : "Le titre est requis", "Le montant doit etre superieur a 0", "L'email n'est pas valide", "Le mot de passe doit contenir au moins 8 caracteres"

## Dependances

- Stories 2.1, 2.2, 4.1, 5.2, 6.2, 7.2, 8.1 (tous les formulaires doivent exister)

## Definition of Done

- [ ] Tous les criteres d'acceptation passent
- [ ] Validation sur TOUS les formulaires de l'application
- [ ] Messages d'erreur en francais, clairs et specifiques
- [ ] Style coherent (rouge, sous le champ)
- [ ] Pas de soumission si formulaire invalide
- [ ] Pas d'erreur console
