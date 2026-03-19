---
epic: "Epic 4 : Gestion des Taches"
storyId: "4.1"
title: "Liste des taches et creation"
assignee: "Luis-Manuel"
status: backlog
priority: high
frs: [FR16, FR19]
---

# Story 4.1 : Liste des taches et creation

## User Story

As a **colocataire**,
I want **voir les taches en colonnes (A Faire / Terminees) et en creer de nouvelles**,
So that **je peux organiser les taches menageres de la colocation**.

## Criteres d'Acceptation

**Given** je suis sur `/tasks`
**When** la page se charge
**Then** les taches s'affichent en colonnes "A Faire" et "Terminees" avec compteurs
**And** chaque card affiche : categorie, titre, date, assignation

**Given** je clique "NOUVELLE TACHE"
**When** je remplis titre, description, statut, assignation, date d'echeance
**Then** la tache est creee et apparait dans la colonne appropriee

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

- `client/src/pages/Tasks.jsx` — Page principale avec colonnes Kanban + dialog creation
- `client/src/App.jsx` — Route `/tasks` (si pas deja fait)

### Endpoints API

- `GET /api/tasks` — Liste des taches
- `POST /api/tasks` — Body: `{ titre, description, statut, assigneA, dateEcheance, categorie }`

### Composants Utilises

- shadcn/ui : `Card`, `CardContent`, `Badge`, `Button`, `Dialog`, `DialogContent`, `DialogHeader`, `Input`, `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`
- Material Symbols : `add`, `drag_indicator`, `more_horiz`, `calendar_today`, `event_busy`, `check_circle`

### Donnees Mock

- **Taches A Faire (3)** :
  - "Sortir les poubelles" — Cuisine — Yohan — 20 Mars
  - "Nettoyer salle de bain" — Salle de bain — Jopad — 21 Mars
  - "Courses hebdo" — Cuisine — Luis-Manuel — 22 Mars
- **Taches Terminees (2)** :
  - "Vaisselle" — Cuisine — Luis-Manuel — 18 Mars
  - "Menage salon" — Salon — Jopad — 17 Mars

### Reference Design

**Ecran 4 — Gestion des Taches (ui-design.md) :**
- Header : "Taches de la Colocation" + bouton "add NOUVELLE TACHE" (primary)
- 2 colonnes Kanban : "A Faire" (compteur 3) et "Terminees" (compteur 2)
- Card tache : label categorie (Badge), titre, icone `drag_indicator`, menu `more_horiz`, date avec icone `calendar_today`, badge assignation (prenom)
- Dialog creation : champs titre, description, statut (Select), assignation (Select avec membres), date d'echeance (Input date)
- Responsive : colonnes cote a cote desktop, empilees mobile

## Dependances

- Story 1.2 (Layout + navigation)
- Story 1.3 (AuthContext + mock data)

## Definition of Done

- [ ] Tous les criteres d'acceptation passent
- [ ] Responsive : colonnes cote a cote desktop, empilees mobile
- [ ] Utilise shadcn/ui (Card, Badge, Dialog, Select, Input, Button)
- [ ] Donnees mock depuis mockData.js via API
- [ ] Dialog de creation fonctionnel
- [ ] Pas d'erreur console
