---
epic: "Epic 7 : Gestion des Abonnements"
storyId: "7.1"
title: "Liste des abonnements"
assignee: "Yohan"
status: backlog
priority: high
frs: [FR39]
---

# Story 7.1 : Liste des abonnements

## User Story

As a **colocataire**,
I want **voir la liste des abonnements partages avec le cout mensuel total**,
So that **je sais combien coutent nos abonnements et quand ils sont preleves**.

## Criteres d'Acceptation

**Given** je suis sur `/subscriptions`
**When** la page se charge
**Then** les abonnements s'affichent en cards avec : logo/icone, nom, type (badge), prix/mois, date prochain prelevement, bouton "Modifier"
**And** le cout mensuel total s'affiche en haut

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

- `client/src/pages/Subscriptions.jsx` — Page complete avec header + grille de cards

### Endpoints API

- `GET /api/subscriptions` — Liste des abonnements

### Composants Utilises

- shadcn/ui : `Card`, `CardHeader`, `CardContent`, `Badge`, `Button`
- Material Symbols : `movie` (Netflix), `router` (Orange), `audiotrack` (Spotify), `stars` (Disney+), `bolt` (EDF), `calendar_today`, `add`

### Donnees Mock

| Service | Type | Prix/mois | Prochain prelevement | Icone |
|---------|------|-----------|---------------------|-------|
| Netflix | PREMIUM | 17,99 EUR | 12 Oct | movie |
| Internet (Orange) | FIBRE | 39,99 EUR | 01 Oct | router |
| Spotify Family | FAMILLE | 15,99 EUR | 22 Oct | audiotrack |
| Disney+ | ANNUEL | 8,99 EUR | 05 Nov | stars |
| Electricite (EDF) | FIXE | 62,54 EUR | 15 Oct | bolt |

**Cout mensuel total : 145,50 EUR**

### Reference Design

**Ecran 7 — Abonnements (ui-design.md) :**
- Header : "Abonnements — Gerez les services partages de la colocation"
- Bouton "AJOUTER ABONNEMENT" (primary)
- Resume : "Cout Mensuel Total: 145,50 EUR" (texte prominent)
- Cards en grille (2-3 par ligne desktop, 1 colonne mobile)
- Chaque card : icone Material Symbols, nom service, badge type (PREMIUM/FIBRE/FAMILLE/ANNUEL/FIXE), prix/mois, `calendar_today` date prelevement, bouton "Modifier"

## Dependances

- Story 1.2 (Layout + navigation)
- Story 1.3 (AuthContext + mock data)

## Definition of Done

- [ ] Tous les criteres d'acceptation passent
- [ ] Responsive : grille multi-colonnes desktop, 1 colonne mobile
- [ ] Utilise shadcn/ui (Card, Badge, Button)
- [ ] Cout total calcule dynamiquement
- [ ] Donnees mock depuis mockData.js via API
- [ ] Pas d'erreur console
