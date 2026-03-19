---
epic: "Epic 1 : Fondations & Projet Setup"
storyId: "1.1"
title: "Initialisation du projet"
assignee: "Jopad"
status: backlog
priority: high
frs: [FR49, FR50]
---

# Story 1.1 : Initialisation du projet

## User Story

As a **developpeur**,
I want **un projet Vite + React + shadcn/ui + Express initialise avec la structure monorepo**,
So that **l'equipe peut commencer a developper immediatement**.

## Criteres d'Acceptation

**Given** le repo est clone
**When** je lance `npm install && npm run dev`
**Then** le client React demarre sur :5173 et le serveur Express sur :3001
**And** shadcn/ui et Tailwind sont configures

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

```
colocation-app/
├── package.json                    # Scripts racine (dev: concurrently client + server)
├── client/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   ├── components.json             # Config shadcn/ui
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                 # React Router placeholder
│       └── index.css               # Tailwind directives + design tokens
├── server/
│   ├── package.json
│   └── index.js                    # Express + cors, port 3001
└── .gitignore
```

### Endpoints API

Aucun pour cette story. Le serveur Express doit repondre sur `GET /api/health` avec `{ status: "ok" }`.

### Composants Utilises

- Installation initiale shadcn/ui : `npx shadcn@latest init`
- Composants a installer pour les stories suivantes : Button, Card, Input, Table, Dialog, Tabs, Badge, Avatar, Switch, Select, DropdownMenu

### Donnees Mock

Aucune pour cette story (voir story 1.3).

### Reference Design

- **Palette** : primary `#4799eb`, bg-light `#f6f7f8`, surface `#ffffff`, text-main `#0e141b`, text-sub `#4e7397`
- **Typographie** : "Plus Jakarta Sans" (display), "Inter" (body)
- **Icones** : Material Symbols Outlined (CDN dans index.html)
- Configurer les tokens dans `tailwind.config.js` et `index.css`

## Dependances

Aucune — c'est la premiere story.

## Definition of Done

- [ ] Tous les criteres d'acceptation passent
- [ ] `npm install && npm run dev` demarre client (:5173) et serveur (:3001)
- [ ] shadcn/ui initialise et un composant Button importable
- [ ] Tailwind CSS fonctionne avec les classes utilitaires
- [ ] Design tokens (couleurs, fonts) configures
- [ ] Material Symbols Outlined charge via CDN
- [ ] Pas d'erreur console
