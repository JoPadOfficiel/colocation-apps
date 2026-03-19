---
epic: "Epic 2 : Authentification & Onboarding"
storyId: "2.4"
title: "Reinitialisation mot de passe (mock)"
assignee: "Yohan"
status: backlog
priority: low
frs: [FR5]
---

# Story 2.4 : Reinitialisation mot de passe (mock)

## User Story

As a **utilisateur**,
I want **demander la reinitialisation de mon mot de passe**,
So that **je puisse recuperer l'acces a mon compte**.

## Criteres d'Acceptation

**Given** je suis sur `/login`
**When** je clique "Mot de passe oublie ?" et saisis mon email
**Then** un message de confirmation s'affiche : "Un email de reinitialisation a ete envoye"

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

- `client/src/pages/Login.jsx` — Ajouter dialog/modal "Mot de passe oublie"

### Endpoints API

Aucun — flux purement visuel (mock). Pas d'envoi reel d'email.

### Composants Utilises

- shadcn/ui : `Dialog`, `DialogContent`, `DialogHeader`, `Input`, `Button`
- Material Symbols : `mail`

### Donnees Mock

- Aucune interaction backend. Apres saisie email + clic bouton, afficher un message de succes.

### Reference Design

- Lien "Mot de passe oublie ?" sous le formulaire de connexion
- Dialog modal avec : titre "Reinitialiser le mot de passe", champ email, bouton "Envoyer"
- Message succes : texte vert "Un email de reinitialisation a ete envoye" avec icone `check_circle`

## Dependances

- Story 2.1 (page de connexion)

## Definition of Done

- [ ] Tous les criteres d'acceptation passent
- [ ] Responsive : fonctionne sur desktop (>=768px) et mobile (<768px)
- [ ] Utilise shadcn/ui (Dialog, Input, Button)
- [ ] Message de confirmation visible apres soumission
- [ ] Pas d'erreur console
