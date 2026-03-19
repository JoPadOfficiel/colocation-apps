---
epic: "Epic 2 : Authentification & Onboarding"
storyId: "2.1"
title: "Page de connexion"
assignee: "Yohan"
status: backlog
priority: high
frs: [FR2, FR4, FR5]
---

# Story 2.1 : Page de connexion

## User Story

As a **visiteur**,
I want **me connecter avec mon email et mot de passe**,
So that **j'accede a ma colocation**.

## Criteres d'Acceptation

**Given** je suis sur `/login`
**When** je saisis un email et mot de passe valides et clique "SE CONNECTER"
**Then** je suis redirige vers le dashboard
**And** le formulaire affiche les champs email et password avec toggle visibilite
**And** un lien "Mot de passe oublie ?" et "Creer un compte" sont visibles
**And** une section "Rejoindre une colocation existante" avec champ code + bouton "Rejoindre" est affichee

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

- `client/src/pages/Login.jsx` — Page de connexion complete
- `client/src/App.jsx` — Ajouter route `/login`

### Endpoints API

- `POST /api/auth/login` — Body: `{ email, password }` — Reponse: `{ data: { user, colocation } }`

### Composants Utilises

- shadcn/ui : `Button`, `Input`, `Card`, `CardHeader`, `CardContent`
- Material Symbols : `visibility`, `visibility_off`, `group_add`

### Donnees Mock

- Login reussi si email = "thomas@coloc.fr" et password quelconque (>=1 char)
- Erreur si email inconnu ou champs vides

### Reference Design

**Ecran 1 — Connexion (ui-design.md) :**
- Header : logo "ColocManager" + nav (Accueil, Fonctionnalites, Tarifs) + bouton "S'inscrire"
- Formulaire centre sur fond `bg-light` (#f6f7f8)
- Champ Email (type email, placeholder "Email")
- Champ Mot de passe (type password, toggle visibility_off/visibility)
- Bouton "SE CONNECTER" : full-width, couleur `primary` (#4799eb)
- Lien "Mot de passe oublie ?" sous le formulaire
- Lien "Nouveau ici ? Creer un compte" → `/register`
- Section "Rejoindre une colocation existante" : icone `group_add`, champ code, bouton "Rejoindre"
- Footer : "(c) 2023 ColocManager. Tous droits reserves."

## Dependances

- Story 1.1 (projet initialise)
- Story 1.3 (AuthContext + mock data)

## Definition of Done

- [ ] Tous les criteres d'acceptation passent
- [ ] Responsive : fonctionne sur desktop (>=768px) et mobile (<768px)
- [ ] Utilise shadcn/ui (Card, Input, Button)
- [ ] Donnees mock depuis AuthContext
- [ ] Toggle visibilite mot de passe fonctionnel
- [ ] Pas d'erreur console
