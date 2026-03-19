---
epic: "Epic 5 : Gestion des Finances"
storyId: "5.1"
title: "Vue finances et cards metriques"
assignee: "Jopad"
status: backlog
priority: high
frs: [FR25]
---

# Story 5.1 : Vue finances et cards metriques

## User Story

As a **colocataire**,
I want **voir la cagnotte commune, mes dettes et ce qu'on me doit**,
So that **je connais ma situation financiere dans la colocation**.

## Criteres d'Acceptation

**Given** je suis sur `/finances`
**When** la page se charge
**Then** 3 cards s'affichent : Cagnotte Commune (montant + tendance), Mes dettes (montant), On me doit (montant)
**And** un bouton "AJOUTER DEPENSE" est visible

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

- `client/src/pages/Finances.jsx` — Page principale avec header + 3 cards metriques

### Endpoints API

- `GET /api/finances` — Retourne les depenses + soldes calcules

### Composants Utilises

- shadcn/ui : `Card`, `CardHeader`, `CardContent`, `Button`, `Badge`
- Material Symbols : `attach_money`, `trending_up`, `add`, `filter_list`, `download`

### Donnees Mock

| Metrique | Valeur | Detail |
|----------|--------|--------|
| Cagnotte Commune | 250,00 EUR | trending_up +45.00EUR ce mois |
| Mes dettes | -12,50 EUR | Couleur danger |
| On me doit | 0,00 EUR | — |

### Reference Design

**Ecran 5 — Gestion des Finances (ui-design.md) :**
- Header : "Finances" + boutons "AJOUTER DEPENSE" (primary) + `filter_list` + `download`
- 3 cards metriques en grille horizontale (1 colonne mobile)
- Card Cagnotte : icone `attach_money`, montant en grand, badge tendance `success` (+45.00EUR)
- Card Dettes : montant en `danger` (#ef4444)
- Card On me doit : montant neutre
- Fond cards : `surface` (#ffffff), shadow-card

## Dependances

- Story 1.2 (Layout + navigation)
- Story 1.3 (AuthContext + mock data)

## Definition of Done

- [ ] Tous les criteres d'acceptation passent
- [ ] Responsive : 3 cards en ligne desktop, empilees mobile
- [ ] Utilise shadcn/ui (Card, Badge, Button)
- [ ] Donnees mock depuis mockData.js via API
- [ ] Pas d'erreur console
