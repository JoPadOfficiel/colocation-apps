---
epic: "Epic 3 : Dashboard & Vue d'ensemble"
storyId: "3.1"
title: "Dashboard avec 4 widgets"
assignee: "Jopad"
status: backlog
priority: high
frs: [FR7, FR8, FR9, FR10, FR11]
---

# Story 3.1 : Dashboard avec 4 widgets

## User Story

As a **colocataire**,
I want **voir un dashboard avec 4 widgets resumant finances, taches, alimentation et abonnements**,
So that **je comprends l'etat de ma colocation en 5 secondes**.

## Criteres d'Acceptation

**Given** je suis connecte et sur `/dashboard`
**When** la page se charge
**Then** 4 widgets s'affichent : Finances (solde cagnotte + tendance), Taches (nombre urgentes + prochaine tache), Alimentation (nombre articles courses), Abonnements (nombre services actifs)
**And** un header affiche "Bonjour, [prenom] :wave:" + bouton "Nouvelle depense"
**And** la page charge en moins de 1 seconde

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

- `client/src/pages/Dashboard.jsx` — Page principale avec header + grille widgets
- `client/src/components/WidgetCard.jsx` — Composant reutilisable pour chaque widget

### Endpoints API

- `GET /api/tasks` — Pour compter les taches urgentes
- `GET /api/finances` — Pour le solde cagnotte
- `GET /api/shopping-list` — Pour le nombre d'articles
- `GET /api/subscriptions` — Pour le nombre de services actifs

### Composants Utilises

- shadcn/ui : `Card`, `CardHeader`, `CardContent`, `Badge`, `Button`
- Material Symbols : `attach_money`, `check_circle`, `shopping_cart`, `subscriptions`, `add`, `trending_up`

### Donnees Mock

| Widget | Valeur | Badge | Detail |
|--------|--------|-------|--------|
| Finances | 320,00 EUR | +15 EUR | Solde cagnotte + tendance |
| Taches | 2 taches | Urgent | Prochaine : "Sortir les poubelles" |
| Alimentation | 15 articles | +3 items | Articles liste de courses |
| Abonnements | 4 services | Actifs | Nombre de services |

### Reference Design

**Ecran 3 — Dashboard (ui-design.md) :**
- Header : "Bonjour, Thomas :wave:" + sous-titre "Voici ce qui se passe dans votre colocation aujourd'hui" + bouton "add Nouvelle depense" (primary)
- Grille 2x2 de widgets (responsive : 1 colonne sur mobile)
- Chaque widget : Card avec icone, titre, valeur principale (grande), badge tendance, detail secondaire
- Couleurs badges : `success` (#22c55e) pour tendance positive, `danger` (#ef4444) pour urgent, `warning` (#f59e0b) pour attention
- Cards sur fond `surface` (#ffffff) avec `shadow-card`

## Dependances

- Story 1.2 (Layout + navigation)
- Story 1.3 (AuthContext + mock data)

## Definition of Done

- [ ] Tous les criteres d'acceptation passent
- [ ] Responsive : grille 2x2 desktop, 1 colonne mobile
- [ ] Utilise shadcn/ui (Card, Badge, Button)
- [ ] Donnees mock depuis mockData.js via API
- [ ] Chargement < 1 seconde
- [ ] Pas d'erreur console
