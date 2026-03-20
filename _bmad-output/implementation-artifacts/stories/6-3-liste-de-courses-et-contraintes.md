---
epic: "Epic 6 : Alimentation & Recettes"
storyId: "6.3"
title: "Liste de courses et contraintes alimentaires"
assignee: "Luis-Manuel"
status: review
priority: high
frs: [FR37, FR38]
---

# Story 6.3 : Liste de courses et contraintes alimentaires

## User Story

As a **colocataire**,
I want **gerer la liste de courses et definir mes contraintes alimentaires**,
So that **on sait ce qu'il faut acheter et ce que chacun peut manger**.

## Criteres d'Acceptation

**Given** je suis sur la section liste de courses
**When** j'ajoute un article via la barre de recherche + bouton "Ajouter"
**Then** l'article apparait dans la liste, classe par categorie

**Given** un article est dans la liste
**When** je le coche
**Then** il est marque comme achete (barre visuellement)

**Given** je suis dans mes parametres alimentaires
**When** je definis mes contraintes (allergies, regimes)
**Then** mes contraintes sont sauvegardees

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

- `client/src/pages/Food.jsx` — Ajouter section liste de courses (au-dessus des recettes) + section contraintes

### Endpoints API

- `GET /api/shopping-list` — Liste des articles
- `POST /api/shopping-list` — Body: `{ nomArticle, categorie }`
- `PUT /api/shopping-list/:id` — Toggle `estAchete`

### Composants Utilises

- shadcn/ui : `Input`, `Button`, `Checkbox`, `Badge`, `Card`
- Material Symbols : `check_circle`, `shopping_cart`, `add`

### Donnees Mock

**12 articles par categorie :**
- Produits laitiers : Lait, Beurre, Fromage
- Boulangerie : Pain, Croissants
- Frais : Tomates, Salade, Poulet
- Epicerie : Pates, Riz
- Hygiene : Savon
- Menage : Eponges

Chaque article : `{ id, nomArticle, categorie, estAchete, assigneA }`

### Reference Design

**Ecran 6 — Alimentation (ui-design.md) :**
- Section "Liste de courses" + compteur (12 articles)
- Barre de recherche + bouton "Ajouter"
- Articles groupes par categorie (sous-titres)
- Chaque article : checkbox + nom + badge personne assignee
- Article achete : texte barre (`line-through`) + icone `check_circle`
- Section contraintes : checkboxes ou tags (Vegetarien, Sans gluten, Sans lactose, etc.)

## Dependances

- Story 1.3 (mock data)
- Story 6.1 (page Food)

## Definition of Done

- [ ] Tous les criteres d'acceptation passent
- [ ] Responsive : fonctionne sur desktop (>=768px) et mobile (<768px)
- [ ] Utilise shadcn/ui (Checkbox, Input, Button, Badge, Card)
- [ ] Articles groupes par categorie
- [ ] Toggle achete avec effet visuel (barre)
- [ ] Contraintes alimentaires sauvegardees
- [ ] Pas d'erreur console
