---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
status: 'complete'
completedAt: '2026-03-19'
inputDocuments:
  - "_bmad-output/planning-artifacts/prd.md"
  - "docs/Colocation-projet/UML-app-colocation-MVP.png"
  - "Google Stitch Project 9935372244892167775 (8 screens)"
workflowType: 'architecture'
project_name: 'colocation-apps'
user_name: 'Jopad'
date: '2026-03-19'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Analyse du Contexte Projet

### Vue d'ensemble des exigences

**Exigences Fonctionnelles :**
52 FRs organisées en 8 domaines : Auth (6), Dashboard (9), Tâches (9), Finances (7), Alimentation (7), Abonnements (5), Réglages (5), Navigation/UX (4). CRUD dominant (~80%), une seule logique métier non triviale (calcul d'équilibre financier FR29).

**Exigences Non-Fonctionnelles :**
- Performance : < 500ms interactions, < 1s chargement dashboard
- Responsive : breakpoint 768px (sidebar → bottom tab)
- Accessibilité : WCAG AA (Radix UI)
- Navigateurs : Chrome, Safari, Firefox (2 dernières versions)

**Complexité & Échelle :**

| Indicateur | Niveau |
|-----------|--------|
| Temps réel | Non |
| Multi-tenancy | Non (1 coloc mockée) |
| Réglementation | Non |
| Intégrations externes | Non |
| Complexité interactions | Faible |
| Volume de données | Mock — minimal |

- Domaine technique : Full-stack web (React + Node.js mock API)
- Complexité : Low
- Composants architecturaux : ~10

### Contraintes techniques & Dépendances

- React + shadcn/ui + Radix UI
- State local (useState/useContext)
- React Router
- Node.js pour APIs mock
- Données mockées (JSON/in-memory)
- 3 devs × 3 jours — architecture compréhensible en 5 minutes

### Préoccupations transversales

- **Auth context** — utilisateur connecté et coloc active partagés entre tous les modules via React Context
- **Mock data centralisé** — un seul fichier/module pour la cohérence des données
- **Layout responsive** — composant Layout partagé : sidebar desktop / bottom tab mobile

## Évaluation du Starter Template

### Domaine technologique

Full-stack web : React frontend + Node.js mock API backend

### Options considérées

| Option | Pour | Contre |
|--------|------|--------|
| **Vite + React** | Ultra-rapide, minimal, shadcn/ui compatible | Pas de backend intégré |
| Next.js | Full-stack, routing intégré | Trop complexe pour un MVP mock, SSR inutile |
| Create React App | Familier | Déprécié, lent |
| T3 Stack | Type-safe full-stack | Beaucoup trop complexe pour 3 jours |

### Starter sélectionné : Vite + React

**Raison :** Le plus simple, le plus rapide à démarrer, compatible shadcn/ui. Parfait pour un MVP de 3 jours.

**Commande d'initialisation :**

```bash
npm create vite@latest colocation-app -- --template react
cd colocation-app
npx shadcn@latest init
```

**Décisions fournies par le starter :**

- **Langage & Runtime :** JavaScript (React 18+), Vite comme bundler
- **Styling :** Tailwind CSS (requis par shadcn/ui)
- **Build :** Vite — build rapide, HMR instantané
- **Testing :** Vitest (compatible Vite)
- **Organisation :** Structure par défaut Vite, organisée par module
- **Dev Experience :** Hot Module Replacement, fast refresh

**Backend mock :**

```bash
npm install express cors
# Serveur Express minimal avec routes JSON mockées
```

**Note :** L'initialisation du projet sera la première story d'implémentation.

## Décisions Architecturales Core

### Priorité des décisions

**Déjà décidées (PRD + Starter) :** React + Vite + shadcn/ui + Tailwind CSS, useState/useContext, React Router, Express mock backend.

### Data Architecture

| Décision | Choix | Raison |
|----------|-------|--------|
| Base de données | Aucune — mock data en mémoire | MVP 3 jours, pas de persistance |
| Modèle de données | `mock-data.js` centralisé (7 entités UML) | Cohérence pour la démo |
| Validation | Côté client (formulaires React) | Suffisant pour MVP mock |

### Auth & Sécurité

| Décision | Choix | Raison |
|----------|-------|--------|
| Auth | Mock — `AuthContext` avec utilisateur en state | Pas de vrai login |
| Session | State React en mémoire | Simple, acceptable pour MVP |
| Rôles | Champ `role` ("admin"/"membre") | Afficher/masquer fonctions admin |

### API & Communication

| Décision | Choix | Raison |
|----------|-------|--------|
| Backend | Express.js minimal, routes JSON | ~10 routes, données en mémoire |
| Pattern | REST : `GET/POST/PUT/DELETE /api/{resource}` | Standard, facile |
| Erreurs | HTTP standard (200, 400, 404, 500) + JSON | Simple et clair |
| CORS | Package `cors` (front :5173, API :3001) | Dev local |

### Frontend Architecture

| Décision | Choix | Raison |
|----------|-------|--------|
| State | `useState` par page + `AuthContext` global | Pas besoin de Redux |
| Structure | Par module : `src/pages/`, `src/components/`, `src/lib/`, `src/data/` | Pas de conflits entre devs |
| Composants | shadcn/ui (Card, Button, Input, Table, Dialog, Tabs, Badge, Avatar) | Designs Stitch |
| Layout | Composant `Layout` : sidebar desktop / bottom tab mobile (768px) | Partagé |
| Fetch | `fetch()` natif | Pas besoin d'axios |

### Infrastructure & Déploiement

| Décision | Choix | Raison |
|----------|-------|--------|
| Hosting | Local — `npm run dev` | Démo en live sur PC |
| CI/CD | Aucun | MVP scolaire |
| Monitoring | Console.log | MVP 3 jours |
| Structure | Monorepo : `/client` (React) + `/server` (Express) | Simple |

### Séquence d'implémentation

1. **J1 matin** — Jopad : init Vite + shadcn + Express, structure, Layout responsive, AuthContext, mock-data.js
2. **J1 après-midi** — Yohan : Login/Register + Réglages | Luis-Manuel : Tâches
3. **J2** — Jopad : Dashboard + Finances | Luis-Manuel : Alimentation | Yohan : Abonnements
4. **J3** — Intégration, tests, responsive, préparation démo

### Dépendances

- `AuthContext` → avant toutes les pages (Jopad J1 matin)
- `mock-data.js` → avant tous les modules CRUD (Jopad J1 matin)
- `Layout` + routing → avant les pages individuelles (Jopad J1 matin)

## Patterns d'Implémentation & Règles de Cohérence

### Naming Patterns

| Catégorie | Convention | Exemple |
|-----------|-----------|---------|
| Pages | PascalCase.jsx | `Dashboard.jsx`, `Tasks.jsx` |
| Composants | PascalCase.jsx | `TaskCard.jsx`, `WidgetFinance.jsx` |
| Utilitaires | camelCase.js | `mockData.js`, `authContext.js` |
| Dossiers | lowercase | `src/pages/`, `src/components/` |
| Variables/Fonctions | camelCase | `getUserById`, `taskList` |
| API Routes | pluriel lowercase | `/api/tasks`, `/api/finances/:id` |

### Structure Projet

```
colocation-app/
├── client/                  # React (Vite)
│   ├── src/
│   │   ├── components/      # Réutilisables (Layout, Sidebar, BottomNav)
│   │   ├── pages/           # 1 fichier par écran
│   │   ├── contexts/        # AuthContext.js
│   │   ├── lib/             # utils, helpers
│   │   └── data/            # mock-data.js (client-side)
│   └── package.json
├── server/                  # Express mock API
│   ├── index.js             # Routes
│   ├── data/                # mock-data.js (serveur)
│   └── package.json
└── README.md
```

### Format Patterns

**Réponses API :**
- Succès : `{ "data": [...] }` ou `{ "data": { ... } }`
- Erreur : `{ "error": "Message lisible" }`
- Dates : ISO string `"2026-03-19T10:00:00Z"`, affiché "19 Mars 2026" côté client
- IDs : Strings simples `"1"`, `"2"` (mock)

### Process Patterns

- **Formulaires :** `useState` + `handleSubmit` + validation basique inline
- **Loading :** `{loading && <p>Chargement...</p>}`
- **Erreurs :** `{error && <p className="text-red-500">{error}</p>}`
- **Navigation :** `<Link to="/route">` ou `useNavigate()`

### Règles obligatoires

1. Un composant = un fichier
2. shadcn/ui d'abord — utiliser les composants existants avant du custom
3. Pas de CSS custom — uniquement classes Tailwind
4. Mock data centralisé — jamais de données en dur dans les composants
5. Responsive dès le début — tester mobile (< 768px) pour chaque page

## Structure Projet & Boundaries

### Arborescence complète

```
colocation-app/
├── README.md
├── package.json                    # Scripts racine
├── client/                         # React (Vite + shadcn/ui)
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   ├── components.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                 # Routes (React Router)
│       ├── index.css
│       ├── components/
│       │   ├── ui/                 # shadcn/ui (auto-généré)
│       │   ├── Layout.jsx          # Sidebar desktop + BottomNav mobile
│       │   ├── Sidebar.jsx
│       │   ├── BottomNav.jsx
│       │   ├── WidgetCard.jsx
│       │   └── ConfirmDialog.jsx
│       ├── contexts/
│       │   └── AuthContext.jsx
│       ├── pages/
│       │   ├── Login.jsx           # FR1-FR2 (Yohan)
│       │   ├── Register.jsx        # FR1, FR3-FR6 (Yohan)
│       │   ├── Dashboard.jsx       # FR7-FR15 (Jopad)
│       │   ├── Tasks.jsx           # FR16-FR24 (Luis-Manuel)
│       │   ├── Finances.jsx        # FR25-FR31 (Jopad)
│       │   ├── Food.jsx            # FR32-FR38 (Luis-Manuel)
│       │   ├── Subscriptions.jsx   # FR39-FR43 (Luis-Manuel)
│       │   └── Settings.jsx        # FR44-FR48 (Yohan)
│       └── lib/
│           ├── api.js              # Fonctions fetch vers /api/*
│           └── utils.js
├── server/                         # Express mock API
│   ├── package.json
│   ├── index.js                    # Routes
│   └── data/
│       └── mockData.js             # 7 entités UML
└── .gitignore
```

### Mapping FRs → Fichiers

| Module | Fichier(s) | FRs | Dev |
|--------|-----------|-----|-----|
| Auth | Login.jsx, Register.jsx, AuthContext.jsx | FR1-FR6 | Yohan |
| Dashboard | Dashboard.jsx, WidgetCard.jsx | FR7-FR15 | Jopad |
| Tâches | Tasks.jsx | FR16-FR24 | Luis-Manuel |
| Finances | Finances.jsx | FR25-FR31 | Jopad |
| Alimentation | Food.jsx | FR32-FR38 | Luis-Manuel |
| Abonnements | Subscriptions.jsx | FR39-FR43 | Yohan |
| Réglages | Settings.jsx | FR44-FR48 | Yohan |
| Navigation | Layout.jsx, Sidebar.jsx, BottomNav.jsx | FR49-FR50 | Jopad |
| UX | ConfirmDialog.jsx, validations inline | FR51-FR52 | Tous |

### Routes API

```
POST   /api/auth/login         POST   /api/auth/register
GET    /api/users              GET    /api/colocation
GET    /api/tasks              POST   /api/tasks
PUT    /api/tasks/:id          DELETE /api/tasks/:id
GET    /api/finances           POST   /api/finances
PUT    /api/finances/:id       DELETE /api/finances/:id
GET    /api/recipes            POST   /api/recipes
GET    /api/shopping-list      POST   /api/shopping-list
PUT    /api/shopping-list/:id
GET    /api/subscriptions      POST   /api/subscriptions
PUT    /api/subscriptions/:id  DELETE /api/subscriptions/:id
PUT    /api/users/:id
```

### Data Flow

Client (React :5173) → fetch() → Express API (:3001) → mockData.js (in-memory). Pas de persistance — refresh serveur réinitialise les données.

## Validation de l'Architecture

### Coherence ✅

- Compatibilité stack : Vite + React + shadcn/ui + Tailwind + Express — stack standard éprouvée, aucun conflit
- Patterns cohérents : camelCase JS, PascalCase composants, REST pluriel lowercase
- Structure alignée avec les décisions frontend/backend

### Coverage des Exigences ✅

- **52/52 FRs** mappées à un fichier spécifique et un dev assigné
- **9/9 NFRs** supportées architecturalement (performance mock, responsive 768px, WCAG AA via Radix, navigateurs modernes)
- **0 gap critique**, 0 gap important

### Implementation Readiness ✅

- [x] Contexte projet analysé
- [x] Stack technique spécifiée
- [x] Décisions architecturales documentées
- [x] Patterns d'implémentation définis (5 règles obligatoires)
- [x] Structure projet complète avec mapping FR → fichier → dev
- [x] Routes API listées (20 endpoints)
- [x] Data flow documenté
- [x] Séquence d'implémentation planifiée (J1/J2/J3)

**Status : READY FOR IMPLEMENTATION**
**Confiance : High**

**Première priorité d'implémentation :**
```bash
npm create vite@latest colocation-app -- --template react
cd colocation-app && npx shadcn@latest init
```
