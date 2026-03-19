---
epic: "Epic 3 : Dashboard & Vue d'ensemble"
storyId: "3.2"
title: "Graphique et activites recentes"
assignee: "Jopad"
status: backlog
priority: medium
frs: [FR12, FR13, FR14]
---

# Story 3.2 : Graphique et activites recentes

## User Story

As a **colocataire**,
I want **voir un graphique des depenses mensuelles et le flux d'activites recentes**,
So that **je peux suivre les tendances financieres et l'activite de la colocation**.

## Criteres d'Acceptation

**Given** je suis sur le dashboard
**When** je scrolle sous les widgets
**Then** un graphique des depenses mensuelles s'affiche
**And** un flux de 3 activites recentes s'affiche avec timestamps
**And** un tableau des soldes/equilibres entre colocataires s'affiche

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

- `client/src/pages/Dashboard.jsx` — Ajouter sections sous les widgets
- Installer `recharts` pour le graphique : `npm install recharts`

### Endpoints API

- `GET /api/finances` — Donnees pour le graphique mensuel
- `GET /api/colocation` — Activites recentes et soldes

### Composants Utilises

- shadcn/ui : `Card`, `CardHeader`, `CardContent`, `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`
- Recharts : `BarChart`, `Bar`, `XAxis`, `YAxis`, `Tooltip`, `ResponsiveContainer`
- Material Symbols : `trending_up`, `schedule`

### Donnees Mock

- **Graphique** : 6 mois de depenses (Oct-Mars), barres comparatives
- **Activites recentes** (3 entrees) :
  - "Thomas a ajoute une depense : Courses (50EUR)" — il y a 2h
  - "Lea a termine la tache : Vaisselle" — il y a 5h
  - "Marc a ajoute un abonnement : Disney+" — hier
- **Soldes colocataires** (tableau) :
  - Thomas Durand : +45,00 EUR
  - Lea Martin : -12,50 EUR
  - Marc Lefebvre : -32,50 EUR

### Reference Design

**Ecran 3 — Dashboard (ui-design.md) :**
- Graphique : barres comparatives par mois, couleur `primary` (#4799eb)
- Activites : liste avec avatar, texte descriptif, timestamp relatif
- Soldes : tableau simple avec nom, montant (vert si positif, rouge si negatif)
- Disposition : graphique a gauche, activites a droite (desktop) / empile (mobile)

## Dependances

- Story 3.1 (dashboard avec widgets)

## Definition of Done

- [ ] Tous les criteres d'acceptation passent
- [ ] Responsive : disposition cote a cote desktop, empilee mobile
- [ ] Utilise shadcn/ui (Card, Table) + Recharts
- [ ] Donnees mock depuis mockData.js
- [ ] Graphique interactif (tooltip au hover)
- [ ] Pas d'erreur console
