---
epic: "Epic 6 : Alimentation & Recettes"
storyId: "6.1"
title: "Menu du jour et recettes"
assignee: "Luis-Manuel"
status: backlog
priority: high
frs: [FR32, FR33]
---

# Story 6.1 : Menu du jour et recettes

## User Story

As a **colocataire**,
I want **consulter le menu du jour avec des suggestions et rechercher des recettes**,
So that **je trouve facilement quoi cuisiner**.

## Criteres d'Acceptation

**Given** je suis sur `/food`
**When** la page se charge
**Then** des recettes suggerees depuis le catalogue mocke s'affichent en cards (nom, duree, portions, icone favori)

**Given** je suis sur la page alimentation
**When** je tape dans la barre de recherche
**Then** les recettes se filtrent dynamiquement par ingredient, categorie ou nom

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

- `client/src/pages/Food.jsx` — Page principale avec section recettes + barre de recherche

### Endpoints API

- `GET /api/recipes` — Liste des recettes

### Composants Utilises

- shadcn/ui : `Card`, `CardContent`, `Input`, `Badge`, `Button`
- Material Symbols : `schedule`, `person`, `favorite`, `favorite_border`, `restaurant_menu`, `search`

### Donnees Mock

**4 recettes mockees :**
| Nom | Duree | Portions | Favori |
|-----|-------|----------|--------|
| Pates Carbonara | 20 min | 4 portions | Oui |
| Quiche Lorraine | 45 min | 6 portions | Non |
| Salade Cesar | 15 min | 2 portions | Non |
| Pancakes du Dimanche | 30 min | 4 portions | Oui |

Chaque recette a aussi : `ingredients`, `categorie`, `contraintesDiets`

### Reference Design

**Ecran 6 — Alimentation (ui-design.md) :**
- Section "Recettes Partagees"
- Cards en grille (2x2 desktop, 1 colonne mobile)
- Chaque card : image placeholder (fond gris), nom du plat, `schedule` duree, `person` portions, icone `favorite`/`favorite_border`
- Barre de recherche en haut avec icone `search`
- Bouton "Proposer une recette" avec icone `restaurant_menu`

## Dependances

- Story 1.2 (Layout + navigation)
- Story 1.3 (AuthContext + mock data)

## Definition of Done

- [ ] Tous les criteres d'acceptation passent
- [ ] Responsive : grille 2x2 desktop, 1 colonne mobile
- [ ] Utilise shadcn/ui (Card, Input, Badge)
- [ ] Recherche dynamique filtre en temps reel
- [ ] Donnees mock depuis mockData.js via API
- [ ] Pas d'erreur console
