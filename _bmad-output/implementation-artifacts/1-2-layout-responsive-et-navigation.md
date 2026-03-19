---
epic: "Epic 1 : Fondations & Projet Setup"
storyId: "1.2"
title: "Layout responsive et navigation"
assignee: "Jopad"
status: backlog
priority: high
frs: [FR49, FR50]
---

# Story 1.2 : Layout responsive et navigation

## User Story

As a **colocataire**,
I want **une navigation avec sidebar sur desktop et bottom tab bar sur mobile**,
So that **je peux acceder a tous les modules depuis n'importe quel ecran**.

## Criteres d'Acceptation

**Given** je suis sur n'importe quelle page
**When** la largeur d'ecran est >=768px
**Then** une sidebar s'affiche avec : Accueil, Taches, Alimentation, Finances, Reglages + profil utilisateur + logout

**Given** je suis sur n'importe quelle page
**When** la largeur d'ecran est <768px
**Then** une bottom tab bar s'affiche avec : Accueil, Taches, Food, Finances, Plus

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

- `client/src/components/Layout.jsx` — Composant wrapper, detecte breakpoint 768px, affiche Sidebar ou BottomNav
- `client/src/components/Sidebar.jsx` — Navigation desktop
- `client/src/components/BottomNav.jsx` — Navigation mobile
- `client/src/App.jsx` — React Router avec toutes les routes, wrappees par Layout

### Routes a Configurer (React Router)

| Route | Page | Label Sidebar | Label Mobile |
|-------|------|--------------|-------------|
| `/dashboard` | Dashboard.jsx | Accueil | Accueil |
| `/tasks` | Tasks.jsx | Taches | Taches |
| `/food` | Food.jsx | Alimentation | Food |
| `/finances` | Finances.jsx | Finances | Finances |
| `/settings` | Settings.jsx | Reglages | (via Plus) |
| `/subscriptions` | Subscriptions.jsx | — | (via Plus) |
| `/login` | Login.jsx | — | — |
| `/register` | Register.jsx | — | — |

### Composants Utilises

- shadcn/ui : `Button`, `Avatar`
- Material Symbols : `dashboard`, `check_circle`, `shopping_cart`, `attach_money`, `settings`, `logout`, `apartment`, `more_horiz`, `restaurant`
- Tailwind responsive : `hidden md:flex`, `flex md:hidden`

### Donnees Mock

- Utilisateur connecte depuis `useAuth()` : nom, email, avatar (pour la sidebar)

### Reference Design

**Sidebar desktop (ui-design.md Ecran 3) :**
- Background : `surface` (#ffffff)
- Logo "ColocApp" avec icone `apartment`
- 5 items navigation avec icones Material Symbols
- Item actif : background `primary-light` (#eef6fd), texte `primary` (#4799eb)
- Profil utilisateur en bas : Avatar + nom + email + icone `logout`

**Bottom tab bar mobile (ui-design.md section Navigation Mobile) :**
- 5 onglets : Accueil, Taches, Food, Finances, Plus
- Icone active : couleur `primary`
- "Plus" ouvre un menu avec Abonnements et Reglages

## Dependances

- Story 1.1 (projet initialise)

## Definition of Done

- [ ] Tous les criteres d'acceptation passent
- [ ] Responsive : sidebar visible >=768px, bottom tab bar visible <768px
- [ ] Utilise shadcn/ui (Button, Avatar)
- [ ] Navigation fonctionne entre toutes les routes
- [ ] Item actif visuellement distinct dans la navigation
- [ ] Profil utilisateur affiche dans la sidebar
- [ ] Pas d'erreur console
