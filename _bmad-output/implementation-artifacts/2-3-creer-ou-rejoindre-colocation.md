---
epic: "Epic 2 : Authentification & Onboarding"
storyId: "2.3"
title: "Creer ou rejoindre une colocation"
assignee: "Yohan"
status: backlog
priority: high
frs: [FR3, FR4]
---

# Story 2.3 : Creer ou rejoindre une colocation

## User Story

As a **utilisateur connecte**,
I want **creer une nouvelle colocation ou en rejoindre une existante via un code d'invitation**,
So that **je peux commencer a utiliser l'application avec mes colocataires**.

## Criteres d'Acceptation

**Given** je suis connecte mais sans colocation
**When** je cree une colocation
**Then** un code d'invitation unique est genere (format COLO-XXXX-X)

**Given** je suis connecte mais sans colocation
**When** je saisis un code d'invitation valide et clique "Rejoindre"
**Then** je rejoins la colocation et suis redirige vers le dashboard

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

- `client/src/pages/Login.jsx` — Section "Rejoindre une colocation existante" (deja dans 2.1)
- `client/src/contexts/AuthContext.jsx` — Ajouter `joinColocation(code)` et `createColocation(name)`

### Endpoints API

- `POST /api/colocation` — Body: `{ name }` — Cree une colocation, retourne `{ data: { colocation } }` avec codeInvitation genere
- `POST /api/colocation/join` — Body: `{ code }` — Rejoindre une colocation existante

### Composants Utilises

- shadcn/ui : `Input`, `Button`, `Card`
- Material Symbols : `group_add`, `add_circle`

### Donnees Mock

- Code valide accepte : "COLO-7829-X" (colocation existante dans mockData)
- Code invalide : tout autre code → message d'erreur "Code invalide"
- Creation : genere un code au format `COLO-XXXX-X` (aleatoire)

### Reference Design

- Section sur la page Login : champ texte avec placeholder "Code d'invitation" + bouton "Rejoindre"
- Apres inscription : ecran de choix "Creer une colocation" / "Rejoindre avec un code"

## Dependances

- Story 1.3 (AuthContext + mock data)
- Story 2.1 (page de connexion)
- Story 2.2 (page d'inscription)

## Definition of Done

- [ ] Tous les criteres d'acceptation passent
- [ ] Responsive : fonctionne sur desktop (>=768px) et mobile (<768px)
- [ ] Utilise shadcn/ui (Input, Button, Card)
- [ ] Code d'invitation format COLO-XXXX-X
- [ ] Redirection vers dashboard apres rejoindre
- [ ] Pas d'erreur console
