---
epic: "Epic 2 : Authentification & Onboarding"
storyId: "2.2"
title: "Page d'inscription"
assignee: "Yohan"
status: done
priority: high
frs: [FR1, FR6]
---

# Story 2.2 : Page d'inscription

## User Story

As a **visiteur**,
I want **creer un compte avec mon nom, email et mot de passe**,
So that **je peux rejoindre ou creer une colocation**.

## Criteres d'Acceptation

**Given** je suis sur `/register`
**When** je remplis nom, email, mot de passe (>=8 caracteres) et clique "S'INSCRIRE"
**Then** mon compte est cree et je suis redirige vers le choix creer/rejoindre colocation
**And** des boutons Google et Facebook sont affiches (visuels uniquement, non fonctionnels)
**And** un lien "Deja un compte ? Se connecter" est visible (`Register.jsx:L157-162`)

## Code Citations

- **Validation Inscription** : `Register.jsx:L25-32` (Validation du nom long, email regex et mot de passe >= 8 caractères)
- **Formulaire d'Inscription** : `Register.jsx:L72-137` (Champs Name, Email, Password avec toggle)
- **Logique d'Authentification** : `Register.jsx:L34-53` (Appel à `register` de `AuthContext`)
- **Boutons Sociaux (Visuels)** : `Register.jsx:L149-155` (Boutons désactivés conformes à l'AC)
- **Navigation vers Connexion** : `Register.jsx:L157-162` (Lien vers `/login`)

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

- `client/src/pages/Register.jsx` — Page d'inscription complete
- `client/src/App.jsx` — Ajouter route `/register`

### Endpoints API

- `POST /api/auth/register` — Body: `{ name, email, password }` — Reponse: `{ data: { user } }`

### Composants Utilises

- shadcn/ui : `Button`, `Input`, `Card`, `CardHeader`, `CardContent`
- Material Symbols : `person`, `mail`, `lock`, `visibility_off`

### Donnees Mock

- Inscription reussie pour tout email non deja pris
- Validation : nom requis, email format valide, mot de passe >= 8 caracteres

### Reference Design

**Ecran 2 — Inscription (ui-design.md) :**
- Header : logo "ColocApp" + nav (Accueil, Fonctionnalites, Tarifs) + lien "Se connecter"
- Titre : "Creer un compte"
- Sous-titre : "Rejoignez notre communaute de colocataires"
- Champ Nom complet (icone `person`, requis)
- Champ Adresse email (icone `mail`, requis, format email)
- Champ Mot de passe (icone `lock` + toggle `visibility_off`, "Au moins 8 caracteres")
- Bouton "S'INSCRIRE" : full-width, couleur `primary`
- Boutons Google + Facebook (visuels uniquement — `onClick` affiche toast "Bientot disponible")
- Lien "Deja un compte ? Se connecter" → `/login`

## Dependances

- Story 1.1 (projet initialise)
- Story 1.3 (AuthContext)

## Definition of Done

- [ ] Tous les criteres d'acceptation passent
- [ ] Responsive : fonctionne sur desktop (>=768px) et mobile (<768px)
- [ ] Utilise shadcn/ui (Card, Input, Button)
- [ ] Validation : nom requis, email format, password >= 8 chars
- [ ] Boutons Google/Facebook visibles mais non fonctionnels
- [ ] Pas d'erreur console
