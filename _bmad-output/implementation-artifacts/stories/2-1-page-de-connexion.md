---
title: "Story 2.1 : Page de connexion"
epic: "Epic 2 : Authentification & Onboarding"
status: "review"
assignee: "Yohan"
---

# Story 2.1 : Page de connexion

Status: review

## Story

As a visiteur,
I want me connecter avec mon email et mot de passe,
so that j'accède à ma colocation.

## Acceptance Criteria

1. **Given** je suis sur `/login`, **When** je saisis un email et mot de passe valides et clique "SE CONNECTER", **Then** je suis redirigé vers le dashboard.
2. **And** le formulaire affiche les champs email et password avec toggle visibilité.
3. **And** un lien "Mot de passe oublié ?" et "Créer un compte" sont visibles.
4. **And** une section "Rejoindre une colocation existante" avec champ code + bouton "Rejoindre" est affichée.
5. **And** la page `/login` n'a PAS de sidebar/bottom nav (page pleine, hors Layout).

## Tasks / Subtasks

- [x] **Task 1 : Créer la page Login.jsx** (AC: #1, #2, #3, #4, #5)
  - [x] Créer `client/src/pages/Login.jsx`
  - [x] Formulaire avec champs email et password
  - [x] Toggle visibilité password (icône Eye/EyeOff)
  - [x] Bouton "SE CONNECTER" pleine largeur, style primary
  - [x] Liens "Mot de passe oublié ?" et "Créer un compte" (liens vers /forgot-password et /register)
  - [x] Section "Rejoindre une colocation existante" avec champ code + bouton "Rejoindre"
  - [x] Validation client : email format, password non vide
  - [x] État loading sur le bouton pendant la requête
  - [x] Affichage erreurs (email/password invalides, erreur serveur)

- [x] **Task 2 : Étendre AuthContext avec login()** (AC: #1)
  - [x] Ajouter fonction `login(email, password)` dans AuthProvider
  - [x] La fonction appelle POST `/api/auth/login` avec les credentials
  - [x] Met à jour user + colocation dans le state
  - [x] Retourne success/error pour le composant appelant
  - [x] Exposer `login` dans la value du context

- [x] **Task 3 : Modifier le mock login côté serveur** (AC: #1)
  - [x] Modifier POST `/api/auth/login` pour vérifier email/password contre mockData
  - [x] Retourner 401 `{ error: "Email ou mot de passe incorrect" }` si invalide
  - [x] Retourner 200 `{ data: { user, colocation } }` si valide (sans password)

- [x] **Task 4 : Ajouter route /login dans App.jsx** (AC: #5)
  - [x] Importer Login dans `client/src/App.jsx`
  - [x] Ajouter `<Route path="/login" element={<Login />} />` HORS du Layout
  - [x] Créer dossier `client/src/pages/` si inexistant

- [x] **Task 5 : Responsive et polish** (AC: #2, #5)
  - [x] Desktop : formulaire max-w-md centré, fond bg-gray-50
  - [x] Mobile : formulaire pleine largeur avec padding
  - [x] Logo "ColocApp" en haut de la page

## Dev Notes

### Patterns obligatoires
- **shadcn/ui** : utiliser `<Button>`, `<Input>`, `<Card>` existants
- **Fetch natif** via `fetch()`, pas d'axios
- **Tailwind classes** uniquement, pas de CSS custom
- **lucide-react** pour les icônes (Eye, EyeOff, Users)
- La page login est HORS du `<Layout />` — pas de sidebar

### Intégration AuthContext
Le AuthContext actuel auto-login au mount. Pour Story 2.1 :
- Ajouter `login(email, password)` au context
- Supprimer l'auto-login du useEffect (le login sera explicite)
- Après login réussi, `useNavigate('/dashboard')`

### Mock Login (serveur)
Le endpoint POST `/api/auth/login` existe déjà mais retourne toujours users[0].
Modifier pour vérifier email+password contre les users mockés.

### Utilisateurs mock disponibles
| Email | Password | Role |
|-------|----------|------|
| thomas@coloc.fr | password123 | admin |
| lea@coloc.fr | password123 | member |
| marc@coloc.fr | password123 | member |

### Structure
```
client/src/
├── pages/
│   └── Login.jsx          ← NOUVEAU
├── contexts/
│   └── AuthContext.jsx     ← MODIFIER (ajouter login())
├── App.jsx                 ← MODIFIER (route /login)
server/
└── index.js                ← MODIFIER (login avec vérification)
```

### References
- [Source: _bmad-output/planning-artifacts/epics.md — Epic 2, Story 2.1]
- [Source: _bmad-output/planning-artifacts/prd.md — FR2, FR4]
- [Source: _bmad-output/planning-artifacts/ui-design.md — Écran 1 Login]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
- `client/src/pages/Login.jsx` (nouveau)
- `client/src/contexts/AuthContext.jsx` (modifier)
- `client/src/App.jsx` (modifier)
- `server/index.js` (modifier)
