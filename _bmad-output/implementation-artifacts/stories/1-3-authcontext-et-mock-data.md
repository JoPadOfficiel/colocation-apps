---
title: "Story 1.3 : AuthContext et Mock Data"
epic: "Epic 1 : Fondations & Projet Setup"
status: "review"
assignee: "Jopad"
---

# Story 1.3 : AuthContext et Mock Data

Status: review

## Story

As a développeur,
I want un AuthContext global et un fichier mockData.js centralisé avec les 7 entités UML,
so that tous les modules puissent accéder à l'utilisateur connecté et aux données mockées via API REST.

## Acceptance Criteria

1. **Given** l'app est chargée, **When** un utilisateur est "connecté" (mock), **Then** `useAuth()` retourne l'utilisateur courant et la colocation active.
2. **And** `mockData.js` contient des données réalistes pour : Colocation, Utilisateur, Tache, Finance, Abonnement, Food_Recette, Food_Course.
3. **And** toutes les routes API REST retournent les données mockées au format `{ data: ... }`.
4. **And** le Sidebar affiche le nom/email de l'utilisateur connecté via `useAuth()` et le bouton Déconnexion fonctionne.
5. **And** `main.jsx` wrappe l'app avec `<AuthProvider>`.

## Tasks / Subtasks

- [x] **Task 1 : Créer le fichier mockData.js côté serveur** (AC: #2)
  - [x]Créer `server/data/mockData.js`
  - [x]Définir 1 colocation : "Colocation Jopad & Co", code COLO-7829-X
  - [x]Définir 3 utilisateurs : Thomas Durand (admin), Léa Martin (member), Marc Lefebvre (member)
  - [x]Définir 5 tâches avec statuts mixtes ("À faire", "En cours", "Terminée")
  - [x]Définir ~10 dépenses réalistes (courses, loyer, sorties)
  - [x]Définir 5 abonnements (Netflix, Orange, Spotify, Disney+, EDF)
  - [x]Définir 4 recettes (Pâtes Carbonara, Quiche Lorraine, Salade César, Pancakes)
  - [x]Définir 12 items liste de courses groupés par catégorie
  - [x]Tous les IDs uniques, dates réalistes (derniers 30-60 jours), chaque entité a `colocationId`

- [x] **Task 2 : Ajouter toutes les routes API dans server/index.js** (AC: #3)
  - [x]Importer mockData dans `server/index.js`
  - [x]POST `/api/auth/login` — retourne user + colocation (mock, pas de vrai check)
  - [x]GET `/api/users` — liste des utilisateurs de la colocation
  - [x]PUT `/api/users/:id` — modifier profil
  - [x]GET `/api/colocation` — colocation active
  - [x]CRUD `/api/tasks` — GET (liste), POST (créer), PUT /:id (modifier), DELETE /:id
  - [x]CRUD `/api/finances` — GET, POST, PUT /:id, DELETE /:id
  - [x]CRUD `/api/recipes` — GET, POST, PUT /:id, DELETE /:id
  - [x]CRUD `/api/shopping-list` — GET, POST, PUT /:id
  - [x]CRUD `/api/subscriptions` — GET, POST, PUT /:id, DELETE /:id
  - [x]Format réponse succès : `{ data: [...] }` ou `{ data: { ... } }`
  - [x]Format réponse erreur : `{ error: "message" }`

- [x] **Task 3 : Créer AuthContext.jsx** (AC: #1)
  - [x]Créer `client/src/contexts/AuthContext.jsx`
  - [x]`AuthContext` avec `createContext()`
  - [x]`AuthProvider` : au mount, fetch `/api/auth/login` pour charger user + colocation
  - [x]State : `{ user, colocation, loading }`
  - [x]`logout()` : clear state user/colocation
  - [x]Hook `useAuth()` : retourne `{ user, colocation, loading, logout }`
  - [x]Exporter AuthContext, AuthProvider, useAuth

- [x] **Task 4 : Créer api.js (fonctions fetch)** (AC: #3)
  - [x]Créer `client/src/lib/api.js`
  - [x]Base URL vide (le proxy Vite redirige `/api` vers :3001)
  - [x]Fonctions : `fetchTasks()`, `fetchFinances()`, `fetchRecipes()`, `fetchShoppingList()`, `fetchSubscriptions()`, `fetchUsers()`, `fetchColocation()`, `loginUser()`
  - [x]Pattern : `const res = await fetch('/api/xxx'); const json = await res.json(); return json.data;`

- [x] **Task 5 : Wrapper main.jsx avec AuthProvider** (AC: #5)
  - [x]Importer `AuthProvider` dans `client/src/main.jsx`
  - [x]Wrapper `<App />` avec `<AuthProvider>`

- [x] **Task 6 : Intégrer useAuth() dans Sidebar** (AC: #4)
  - [x]Importer `useAuth` dans `client/src/components/Sidebar.jsx`
  - [x]Afficher `user.name` et `user.email` dans la section profil
  - [x]Brancher `logout()` sur le bouton Déconnexion
  - [x]Remplacer le nom hardcodé "Jopad" par les données du contexte

## Dev Notes

### Patterns obligatoires
- **Fetch natif** uniquement (`fetch()`), pas d'axios
- **Pas de CSS custom** — Tailwind classes uniquement
- **Un composant = un fichier**
- **Données centralisées** — jamais de data hardcodée dans les composants
- Le proxy Vite (`/api` → `localhost:3001`) est déjà configuré dans `vite.config.js`

### Structure des entités mockées

**Utilisateur** : `{ id, name, email, password, profilePhoto, role: "admin"|"member", colocationId, dietaryConstraints: [] }`

**Colocation** : `{ id, name, invitationCode, totalFund, createdAt, members: [userId...] }`

**Tache** : `{ id, title, description, status: "À faire"|"En cours"|"Terminée", dueDate, assignedTo, createdBy, category, recurrence: "none"|"daily"|"weekly"|"monthly", colocationId }`

**Finance** : `{ id, title, amount, type, date, paidBy, colocationId }`

**Abonnement** : `{ id, serviceName, type, monthlyPrice, nextWithdrawalDate, sharedPlaces, colocationId }`

**Food_Recette** : `{ id, dishName, prepTime, portions, ingredients: [], dietaryConstraints: [], isFavorite, colocationId }`

**Food_Course** : `{ id, itemName, category, isPurchased, assignedTo, colocationId }`

### Utilisateurs mock
| Nom | Email | Role | ID |
|-----|-------|------|----|
| Thomas Durand | thomas@coloc.fr | admin | user-1 |
| Léa Martin | lea@coloc.fr | member | user-2 |
| Marc Lefebvre | marc@coloc.fr | member | user-3 |

L'utilisateur connecté par défaut est **Thomas Durand** (admin).

### Project Structure Notes

```
client/src/
├── contexts/
│   └── AuthContext.jsx    ← NOUVEAU
├── lib/
│   ├── api.js             ← NOUVEAU
│   └── utils.js           (existant)
├── components/
│   ├── Sidebar.jsx        ← MODIFIER (useAuth)
│   ├── BottomNav.jsx      (existant)
│   └── Layout.jsx         (existant)
└── main.jsx               ← MODIFIER (AuthProvider)

server/
├── data/
│   └── mockData.js        ← NOUVEAU
└── index.js               ← MODIFIER (routes API)
```

### Contexte Story 1.2 (précédente)
- `Sidebar.jsx` a un nom hardcodé "Jopad" et un bouton Déconnexion sans handler → Task 6 corrige ça
- `Layout.jsx` utilise `<Outlet />` pour le contenu des pages
- Navigation utilise `useLocation()` + `lucide-react` icons
- Icônes : Home, CheckSquare, Utensils, CreditCard, Settings

### Pièges à éviter
1. Ne PAS oublier le wrapper `<AuthProvider>` dans main.jsx
2. Ne PAS hardcoder de données dans les composants
3. Toutes les réponses API DOIVENT suivre `{ data: ... }` / `{ error: "..." }`
4. Chaque entité DOIT avoir un `colocationId`
5. Les IDs des users dans les tâches/finances doivent correspondre aux users mockés

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 1, Story 1.3]
- [Source: _bmad-output/planning-artifacts/architecture.md — Auth Decision, API Routes, Mock Data]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — Sidebar user profile, Dashboard greeting]
- [Source: _bmad-output/planning-artifacts/prd.md — 7 entités UML]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (1M context)

### Debug Log References

Build: 0 errors, 35 warnings (shadcn generated components). Lint: 0 errors. Server mockData: loads OK.

### Completion Notes List

- mockData.js: 7 entités complètes avec données réalistes FR, IDs uniques, colocationId sur chaque entité
- server/index.js: 20 routes CRUD REST, format { data } / { error }, ID auto-increment pour POST
- AuthContext.jsx: createContext + AuthProvider (fetch au mount) + useAuth hook
- api.js: fonctions fetch pour chaque ressource, utilise le proxy Vite
- main.jsx: App wrappée dans AuthProvider
- Sidebar.jsx: nom hardcodé remplacé par useAuth(), logout branché

### File List
- `server/data/mockData.js` (nouveau)
- `server/index.js` (modifié — 20 routes API)
- `client/src/contexts/AuthContext.jsx` (nouveau)
- `client/src/lib/api.js` (nouveau)
- `client/src/main.jsx` (modifié — AuthProvider wrapper)
- `client/src/components/Sidebar.jsx` (modifié — useAuth integration)
