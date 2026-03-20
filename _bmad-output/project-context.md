---
project_name: 'colocation-apps'
user_name: 'Jopad'
date: '2026-03-20'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules']
existing_patterns_found: 12
---

# Contexte Projet pour Agents IA

_Ce fichier contient les règles critiques et patterns que les agents IA doivent suivre lors de l'implémentation du code. Focus sur les détails non évidents que les agents pourraient manquer._

Current Progress: All 7 categories documented. Completed.

---

## Technology Stack & Versions

### Frontend (client/)

- **React** 19.2.4 — SPA avec JSX (pas TSX)
- **Vite** 8.0.1 — Bundler, dev server sur :5173
- **Tailwind CSS** 3.4.1 — Classes utilitaires, pas de CSS custom
- **shadcn/ui** 4.0.8 (style `base-nova`) — Composants UI pré-faits (Avatar, Badge, Button, Card, Dialog, Input, Table, Tabs)
- **React Router DOM** 7.13.1 — Routing SPA
- **Lucide React** 0.577.0 — Icônes vectorielles
- **@base-ui/react** 1.3.0 — Primitives Radix UI accessibles
- **class-variance-authority** 0.7.1 — Variantes de composants
- **clsx** 2.1.1 + **tailwind-merge** 3.5.0 — Fusion de classes via `cn()`
- **tw-animate-css** 1.4.0 — Animations CSS
- **Geist Variable** (via @fontsource) — Police principale

### Backend (server/)

- **Express.js** 5.2.1 — Mock API REST sur :3001
- **cors** 2.8.6 — CORS (origin :5173)
- **nodemon** 3.1.14 — Hot reload dev
- **CommonJS** (`type: "commonjs"`) — Pas d'ESM côté serveur

### Monorepo

- **npm workspaces** — `client/` + `server/`
- **concurrently** 9.2.1 — `npm run dev` lance les deux serveurs
- **JavaScript uniquement** — Pas de TypeScript

### Design System

- **OKLCH color space** — Variables CSS en oklch() (pas hex, pas hsl)
- **CSS Variables** — Thème via custom properties (--primary, --background, etc.)
- **Dark mode supporté** — Classe `.dark` définie dans index.css
- **Border radius** — Variable `--radius: 0.625rem`
- **Font** — `--font-sans: 'Geist Variable'` via classe `.theme`

---

## Règles Critiques d'Implémentation

### Règles Spécifiques JavaScript

#### Modules & Imports

- **Frontend (client/) = ESM** — `import/export` uniquement (`"type": "module"` dans package.json)
- **Backend (server/) = CommonJS** — `require()` / `module.exports` (`"type": "commonjs"`)
- **⚠️ Ne JAMAIS mélanger** — Pas de `require()` côté client, pas de `import` côté serveur
- **Alias `@/`** — Utiliser `@/components/`, `@/lib/`, `@/contexts/` pour les imports client (configuré dans vite.config.js + jsconfig.json)

#### Patterns de Code

- **Fonctions, pas classes** — Composants React déclarés avec `function` (pas de classes, pas de arrow functions pour les composants de page)
- **Pas de point-virgules** — Le codebase existant n'utilise PAS de points-virgules côté client (convention stricte)
- **Points-virgules côté serveur** — Le backend utilise des points-virgules (convention Express standard)
- **Pas de TypeScript** — Fichiers `.jsx` et `.js` uniquement, pas de `.tsx`/`.ts`

#### Gestion des Erreurs

- **Pattern API client** : `request()` dans `api.js` centralise le fetch avec extraction automatique de `.data`
- **Erreurs API** : Parse `json.error` en fallback avec message par défaut
- **Erreurs Auth** : Try/catch autour de `res.json()` avec message de fallback

#### Gestion des Données

- **Réponse API toujours wrappée** : `{ data: ... }` pour le succès, `{ error: "..." }` pour les erreurs
- **IDs string** : `"user-1"`, `"task-1"` — jamais des nombres
- **Dates ISO string** : `"2026-03-19T10:00:00Z"` — côté serveur et API
- **Pas de persistance** — Données in-memory, reset au redémarrage serveur

### Règles Spécifiques React & Express

#### React — Composants

- **1 composant = 1 fichier** — Ne jamais définir plusieurs composants exportés dans le même fichier
- **Pages dans `src/pages/`** — PascalCase : `Dashboard.jsx`, `Tasks.jsx`
- **Composants réutilisables dans `src/components/`** — PascalCase : `Layout.jsx`, `Sidebar.jsx`
- **Composants shadcn/ui dans `src/components/ui/`** — Auto-générés par `npx shadcn@latest add`
- **shadcn/ui d'abord** — Toujours utiliser un composant shadcn existant avant de coder du custom
- **Icônes** — Importer depuis `lucide-react` exclusivement

#### React — State & Context

- **`useState` par page** — State local dans chaque page, pas de store global
- **`AuthContext`** seul context global — Fournit `user`, `colocation`, `login()`, `register()`, `logout()`, `updateColocation()`
- **`useAuth()`** hook — Accès au context auth, throw si utilisé hors `AuthProvider`
- **Session via `sessionStorage`** — Clé `colocapp_user`, rechargé au mount

#### React — Routing

- **Routes protégées** — Composant `ProtectedRoute` wraps les routes authentifiées
- **Layout imbriqué** — Routes enfants dans `<Route path="/" element={<Layout />}>` avec `<Outlet />`
- **Redirect par défaut** — `/` redirige vers `/dashboard`, `*` redirige vers `/dashboard`
- **Routes publiques** — `/login`, `/register`, `/forgot-password`, `/onboarding` hors Layout

#### React — Styling

- **Tailwind uniquement** — Zéro CSS custom, uniquement classes Tailwind
- **`cn()` pour les classes conditionnelles** — Import depuis `@/lib/utils`
- **Animations** — `animate-in fade-in duration-500` pour les transitions de page
- **Responsive** — Breakpoint mobile < 768px (sidebar → bottom nav)

#### Express — Backend Mock

- **Routes dans `server/index.js`** — Tout dans un seul fichier (MVP)
- **Pattern CRUD uniforme** : GET /api/{resource}, POST, PUT /:id, DELETE /:id
- **ID auto-généré** : `genId(prefix)` → `"task-100"`, `"fin-101"`, etc.
- **Validation minimale** : Champs requis vérifiés, sinon 400
- **Pas de middleware auth** — Mock, pas de vérification de token
- **`stripPassword()`** — Toujours retirer le mot de passe des réponses utilisateur

### Règles de Tests

#### État Actuel

- **Aucun framework de test installé** — Vitest prévu par l'architecture mais pas encore configuré
- **Pas de fichiers de test existants** — Zéro test unitaire ou d'intégration
- **Script serveur** — `"test": "echo \"Error: no test specified\" && exit 1"` (placeholder)

#### Règles à Suivre (quand les tests seront ajoutés)

- **Vitest** recommandé par l'architecture (compatible Vite)
- **Fichiers de test** : `*.test.jsx` ou `*.test.js` co-localisés ou dans `__tests__/`
- **Mock data** : Réutiliser les structures de `server/data/mockData.js` pour la cohérence
- **Pas de tests E2E** — MVP scolaire, tests unitaires/composants suffisants

---

### Code Quality & Style Rules

#### Conventions de Nommage
- **Composants & Pages** : `PascalCase.jsx` (ex: `Dashboard.jsx`, `TaskCard.jsx`)
- **Utilitaires & Fonctions** : `camelCase.js` (ex: `mockData.js`, `getUserById`)
- **Dossiers** : `lowercase` (ex: `src/pages/`, `src/components/ui/`)
- **API Routes** : `pluriel lowercase` (ex: `/api/tasks`, `/api/finances/:id`)

#### Qualité UI/UX (Critères PRD)
- **Fidélité Design** : Respecter strictement les 8 écrans **Google Stitch #9935372244892167775**.
- **Responsive-First** : Tester systématiquement le mobile (< 768px). Sidebar desktop vs Bottom Tab bar mobile (FR55).
- **Accessibilité (WCAG AA)** : Labels sur tous les champs, contraste respecté, navigation clavier fonctionnelle.
- **Feedback Utilisateur** : 
  - Afficher un message de chargement (`loading && <p>...`)
  - Afficher les erreurs en rouge (`text-red-500`)
  - Pop-ups de confirmation pour toute suppression ou action critique (ConfirmDialog) (FR52).

#### Organisation du Code
- **Clean Code** : Extraire la logique API dans `src/lib/api.js`.
- **DRY** : Réutiliser les composants UI de shadcn au lieu de recréer des éléments natifs modifiés.
- **Données** : Ne JAMAIS mettre de données en dur (hardcoded). Toujours utiliser `mockData.js`.

---

### Development Workflow Rules

#### Workflows BMAD
- **Priorité Absolue** : Suivre la séquence BMAD (Product Brief → PRD → UX → Architecture → Epics → Stories → Implement).
- **Développement de Story** : 
  1. Lire le fichier story (`.agent/sprints/...`)
  2. Implémenter logic + UI
  3. Vérifier localement (Client + Server)
  4. Mettre à jour `sprint-status.yaml`

#### Git & Branches
- **Convention de branche** : `feat/epic-X-story-Y-description`
- **Commits Atomiques** : Un commit par fonctionnalité ou correctif logique. Message clair en français ou anglais.

#### Vérification Post-Implement
- **Build & Dev** : S'assurer que `npm run dev` ne génère aucune erreur console ou terminal.
- **Proxy API** : Vérifier que les appels pointent bien vers `/api/...` (proxied vers :3001).

---

### Critical Don't-Miss Rules (Anti-patterns & Edge Cases)

#### 🚨 À NE PAS FAIRE (Anti-patterns)
- **Pas de données Hardcoded** : Ne pas recréer des listes d'utilisateurs ou de tâches dans les composants. Utiliser l'API.
- **Pas de manipulation directe du DOM** : Utiliser uniquement les outils React (`useRef` si nécessaire, mais jamais `document.getElementById`).
- **Éviter les gros composants** : Si un fichier page dépasse 300 lignes, extraire des composants (`TaskCard`, `SummaryWidget`, etc.).
- **Pas de secrets en clair** : Pas d'API keys ou secrets dans le code frontend.

#### 🛠️ Cas Limites (Edge Cases)
- **Liste Vide** : Toujours prévoir un état "Empty State" (ex: "Aucune tâche pour le moment").
- **Déconnexion brutale** : Gérer le cas où le `sessionStorage` est vidé (redirection auto vers `/login` via `ProtectedRoute`).
- **Conflits de données** : Comme le serveur est en mémoire, un refresh perd les modifs. Toujours prévenir l'utilisateur que c'est une démo MVP.
- **Responsive Check** : Toujours vérifier que les boîtes de dialogue (`Dialog`, `ConfirmDialog`) sont utilisables sur petit écran (scrollable si besoin).
