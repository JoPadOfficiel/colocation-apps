# Prompts d'Implémentation — ColocApp

> **22 prompts** couvrant les 9 epics du projet ColocApp.
> Chaque prompt est dans un bloc de code `markdown` prêt à copier-coller dans Claude Code.

---

## Table des Matières

| Epic | Stories | Prompts |
|------|---------|---------|
| [Epic 1 : Fondations & Projet Setup](#epic-1--fondations--projet-setup) | 1.1, 1.2, 1.3 | PROMPT-1-1, PROMPT-1-2, PROMPT-1-3 |
| [Epic 2 : Authentification & Onboarding](#epic-2--authentification--onboarding) | 2.1, 2.2, 2.3, 2.4 | PROMPT-2-1, PROMPT-2-2, PROMPT-2-3, PROMPT-2-4 |
| [Epic 3 : Dashboard & Vue d'ensemble](#epic-3--dashboard--vue-densemble) | 3.1, 3.2, 3.3 | PROMPT-3-1, PROMPT-3-2, PROMPT-3-3 |
| [Epic 4 : Gestion des Tâches](#epic-4--gestion-des-tâches) | 4.1, 4.2, 4.3, 4.4 | PROMPT-4-1, PROMPT-4-2, PROMPT-4-3, PROMPT-4-4 |
| [Epic 5 : Gestion des Finances](#epic-5--gestion-des-finances) | 5.1, 5.2, 5.3 | PROMPT-5-1, PROMPT-5-2, PROMPT-5-3 |
| [Epic 6 : Alimentation & Recettes](#epic-6--alimentation--recettes) | 6.1, 6.2, 6.3 | PROMPT-6-1, PROMPT-6-2, PROMPT-6-3 |
| [Epic 7 : Gestion des Abonnements](#epic-7--gestion-des-abonnements) | 7.1, 7.2 | PROMPT-7-1, PROMPT-7-2 |
| [Epic 8 : Réglages & Profil](#epic-8--réglages--profil) | 8.1, 8.2, 8.3 | PROMPT-8-1, PROMPT-8-2, PROMPT-8-3 |
| [Epic 9 : UX Polish & Validation](#epic-9--ux-polish--validation) | 9.1, 9.2 | PROMPT-9-1, PROMPT-9-2 |

---

## EPIC 1 : Fondations & Projet Setup

---

### PROMPT-1-1

```markdown
# PROMPT-1-1: Story 1.1 — Initialisation du projet

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **développeur**,
I want **un projet Vite + React + shadcn/ui + Express initialisé avec la structure monorepo**,
So that **l'équipe peut commencer à développer immédiatement**.

## ACCEPTANCE CRITERIA
**Given** le repo est cloné
**When** je lance `npm install && npm run dev`
**Then** le client React démarre sur :5173 et le serveur Express sur :3001
**And** shadcn/ui et Tailwind sont configurés

## FICHIERS À CRÉER/MODIFIER
- `package.json` (racine — scripts pour lancer client + serveur)
- `client/package.json`
- `client/vite.config.js`
- `client/tailwind.config.js`
- `client/components.json` (shadcn/ui config)
- `client/index.html`
- `client/src/main.jsx`
- `client/src/App.jsx`
- `client/src/index.css`
- `server/package.json`
- `server/index.js`
- `.gitignore`

## ROUTES API CONCERNÉES
Aucune pour cette story (juste le serveur Express qui démarre avec un GET /api/health → `{ status: "ok" }`)

## COMPOSANTS SHADCN/UI À UTILISER
Aucun composant visuel — juste l'initialisation de shadcn/ui (npx shadcn@latest init)

## DESIGN REFERENCE
- Police display : "Plus Jakarta Sans", sans-serif
- Police body : "Inter", sans-serif
- Couleur primary : `#4799eb`
- Background : `#f6f7f8`
- Surface : `#ffffff`

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Créer la structure monorepo :**
   ```bash
   mkdir -p client server
   ```

1. **Initialiser le client React + Vite :**

   ```bash
   cd client
   npm create vite@latest . -- --template react
   npm install
   ```

2. **Installer et configurer Tailwind CSS :**

   ```bash
   npm install -D tailwindcss @tailwindcss/vite
   ```

   Dans `client/vite.config.js` :

   ```js
   import tailwindcss from '@tailwindcss/vite'
   import react from '@vitejs/plugin-react'
   import { defineConfig } from 'vite'
   import path from 'path'

   export default defineConfig({
     plugins: [react(), tailwindcss()],
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './src'),
       },
     },
     server: {
       port: 5173,
     },
   })
   ```

3. **Configurer `client/src/index.css` :**

   ```css
   @import "tailwindcss";
   @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
   ```

   Ajouter les variables CSS pour les couleurs du design system (primary #4799eb, bg-light #f6f7f8, etc.)

4. **Initialiser shadcn/ui :**

   ```bash
   npx shadcn@latest init
   ```

   Choisir : TypeScript = No, style = New York, base color = Slate, CSS variables = Yes.

5. **Configurer `client/src/App.jsx` avec React Router :**

   ```bash
   npm install react-router-dom
   ```

   ```jsx
   // Story 1.1: Initialisation du projet
   import { BrowserRouter, Routes, Route } from 'react-router-dom'

   function App() {
     return (
       <BrowserRouter>
         <Routes>
           <Route path="/login" element={<div>Login</div>} />
           <Route path="/register" element={<div>Register</div>} />
           <Route path="/dashboard" element={<div>Dashboard</div>} />
           <Route path="/tasks" element={<div>Tasks</div>} />
           <Route path="/finances" element={<div>Finances</div>} />
           <Route path="/food" element={<div>Food</div>} />
           <Route path="/subscriptions" element={<div>Subscriptions</div>} />
           <Route path="/settings" element={<div>Settings</div>} />
           <Route path="*" element={<Navigate to="/login" />} />
         </Routes>
       </BrowserRouter>
     )
   }
   export default App
   ```

6. **Initialiser le serveur Express :**

   ```bash
   cd server
   npm init -y
   npm install express cors
   ```

   Créer `server/index.js` :

   ```js
   // Story 1.1: Initialisation du projet
   const express = require('express')
   const cors = require('cors')
   const app = express()

   app.use(cors({ origin: 'http://localhost:5173' }))
   app.use(express.json())

   app.get('/api/health', (req, res) => {
     res.json({ status: 'ok' })
   })

   app.listen(3001, () => {
     console.log('API server running on http://localhost:3001')
   })
   ```

7. **Créer le package.json racine avec scripts concurrents :**

   ```bash
   npm init -y
   npm install -D concurrently
   ```

   Ajouter dans le `package.json` racine :

   ```json
   {
     "scripts": {
       "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",
       "dev:client": "cd client && npm run dev",
       "dev:server": "cd server && node index.js"
     }
   }
   ```

8. **Créer `.gitignore` :**

   ```
   node_modules/
   dist/
   .env
   ```

9. **Tester** : lancer `npm run dev` à la racine, vérifier que :
    - <http://localhost:5173> affiche l'app React
    - <http://localhost:3001/api/health> retourne `{ "status": "ok" }`

## MOCK DATA NÉCESSAIRE

Aucune donnée mock pour cette story. Le fichier `server/data/mockData.js` sera créé dans la story 1.3.

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```

---

### PROMPT-1-2

```markdown
# PROMPT-1-2: Story 1.2 — Layout responsive et navigation

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **colocataire**,
I want **une navigation avec sidebar sur desktop et bottom tab bar sur mobile**,
So that **je peux accéder à tous les modules depuis n'importe quel écran**.

## ACCEPTANCE CRITERIA
**Given** je suis sur n'importe quelle page
**When** la largeur d'écran est ≥768px
**Then** une sidebar s'affiche avec : Accueil, Tâches, Alimentation, Finances, Réglages + profil utilisateur + logout

**Given** je suis sur n'importe quelle page
**When** la largeur d'écran est <768px
**Then** une bottom tab bar s'affiche avec : Accueil, Tâches, Food, Finances, Plus

## FICHIERS À CRÉER/MODIFIER
- `client/src/components/Layout.jsx` (nouveau)
- `client/src/components/Sidebar.jsx` (nouveau)
- `client/src/components/BottomNav.jsx` (nouveau)
- `client/src/App.jsx` (modifier — wrapper les routes avec Layout)

## ROUTES API CONCERNÉES
Aucune route API pour cette story.

## COMPOSANTS SHADCN/UI À UTILISER
- **Button** — pour les items de navigation
- **Avatar** — pour le profil utilisateur dans la sidebar
- **Separator** — pour séparer les sections de la sidebar

## DESIGN REFERENCE
**Sidebar Desktop (≥768px) — depuis ui-design.md Écran 3 :**
- Fond blanc (`#ffffff` / surface)
- Largeur : ~240px fixe
- Logo : icône `apartment` + texte "ColocApp"
- Items de navigation avec icône Material Symbols + label :
  - `dashboard` → Accueil → `/dashboard`
  - `check_circle` → Tâches → `/tasks`
  - `shopping_cart` → Alimentation → `/food`
  - `attach_money` → Finances → `/finances`
  - `settings` → Réglages → `/settings`
- Item actif : fond `#eef6fd` (primary-light), texte `#4799eb` (primary)
- Item inactif : texte `#4e7397` (text-sub)
- En bas : Avatar + "Thomas Durand" + "thomas@coloc.fr" + icône `logout`

**Bottom Tab Bar Mobile (<768px) — depuis ui-design.md :**
- Fond blanc, ombre top, hauteur ~60px
- 5 tabs :
  - `dashboard` → Accueil → `/dashboard`
  - `check_circle` → Tâches → `/tasks`
  - `restaurant` → Food → `/food`
  - `attach_money` → Finances → `/finances`
  - `more_horiz` → Plus → menu déroulant (Abonnements `/subscriptions`, Réglages `/settings`)
- Tab active : couleur `#4799eb` (primary)
- Tab inactive : couleur `#4e7397` (text-sub)

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Installer les icônes Material Symbols.** Ajouter dans `client/index.html` :
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />
   ```

1. **Créer `client/src/components/Sidebar.jsx` :**

   ```jsx
   // Story 1.2: Layout responsive et navigation
   ```

   - Importer `Link`, `useLocation` de react-router-dom
   - Importer `Avatar`, `AvatarFallback` de shadcn/ui
   - Créer un tableau `navItems` :

     ```js
     const navItems = [
       { icon: 'dashboard', label: 'Accueil', path: '/dashboard' },
       { icon: 'check_circle', label: 'Tâches', path: '/tasks' },
       { icon: 'shopping_cart', label: 'Alimentation', path: '/food' },
       { icon: 'attach_money', label: 'Finances', path: '/finances' },
       { icon: 'settings', label: 'Réglages', path: '/settings' },
     ]
     ```

   - Rendre une `<aside>` fixe à gauche, largeur `w-60`, fond `bg-white`, bordure droite
   - Logo en haut : `<span className="material-symbols-outlined">apartment</span>` + "ColocApp" en gras
   - Map sur `navItems` : chaque item est un `<Link>` avec classes conditionnelles :
     - Actif : `bg-[#eef6fd] text-[#4799eb]`
     - Inactif : `text-[#4e7397] hover:bg-gray-100`
   - En bas (position sticky) : Avatar avec initiales "TD", nom "Thomas Durand", email "<thomas@coloc.fr>", bouton logout (icône `logout`)

2. **Créer `client/src/components/BottomNav.jsx` :**

   ```jsx
   // Story 1.2: Layout responsive et navigation
   ```

   - Importer `Link`, `useLocation` de react-router-dom
   - `useState` pour gérer le menu "Plus" (ouvert/fermé)
   - Créer un tableau `tabItems` :

     ```js
     const tabItems = [
       { icon: 'dashboard', label: 'Accueil', path: '/dashboard' },
       { icon: 'check_circle', label: 'Tâches', path: '/tasks' },
       { icon: 'restaurant', label: 'Food', path: '/food' },
       { icon: 'attach_money', label: 'Finances', path: '/finances' },
       { icon: 'more_horiz', label: 'Plus', path: null },
     ]
     ```

   - Rendre une `<nav>` fixe en bas, fond blanc, ombre `shadow-[0_-2px_10px_rgba(0,0,0,0.1)]`, hauteur `h-16`
   - Flex row, items répartis uniformément
   - Pour "Plus" : clic ouvre un menu popup au-dessus avec "Abonnements" et "Réglages"
   - Tab active : `text-[#4799eb]`, inactive : `text-[#4e7397]`

3. **Créer `client/src/components/Layout.jsx` :**

   ```jsx
   // Story 1.2: Layout responsive et navigation
   ```

   - Importer Sidebar et BottomNav
   - Utiliser `useLocation()` pour détecter si on est sur `/login` ou `/register` (pas de layout nav pour ces pages)
   - Structure :

     ```jsx
     const isAuthPage = ['/login', '/register'].includes(location.pathname)
     if (isAuthPage) return <Outlet />

     return (
       <div className="flex min-h-screen bg-[#f6f7f8]">
         {/* Sidebar visible ≥768px */}
         <div className="hidden md:block">
           <Sidebar />
         </div>
         {/* Contenu principal */}
         <main className="flex-1 p-6 pb-20 md:pb-6">
           <Outlet />
         </main>
         {/* BottomNav visible <768px */}
         <div className="md:hidden">
           <BottomNav />
         </div>
       </div>
     )
     ```

4. **Modifier `client/src/App.jsx` :**
   - Importer `Layout`
   - Wrapper les routes protégées dans un `<Route element={<Layout />}>` :

     ```jsx
     <Routes>
       <Route path="/login" element={<Login />} />
       <Route path="/register" element={<Register />} />
       <Route element={<Layout />}>
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/tasks" element={<Tasks />} />
         <Route path="/finances" element={<Finances />} />
         <Route path="/food" element={<Food />} />
         <Route path="/subscriptions" element={<Subscriptions />} />
         <Route path="/settings" element={<Settings />} />
       </Route>
       <Route path="*" element={<Navigate to="/login" />} />
     </Routes>
     ```

5. **Installer le composant Avatar de shadcn/ui :**

   ```bash
   cd client && npx shadcn@latest add avatar separator button
   ```

6. **Tester responsive** : ouvrir DevTools, basculer entre desktop (≥768px → sidebar visible) et mobile (<768px → bottom tab visible). Vérifier que la navigation fonctionne sur chaque item.

## MOCK DATA NÉCESSAIRE

Données utilisateur hardcodées temporairement dans Sidebar.jsx (sera remplacé par AuthContext dans story 1.3) :

```js
const currentUser = { name: 'Thomas Durand', email: 'thomas@coloc.fr', initials: 'TD' }
```

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```

---

### PROMPT-1-3

```markdown
# PROMPT-1-3: Story 1.3 — AuthContext et mock data

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **développeur**,
I want **un AuthContext global et un fichier mock-data.js centralisé avec les 7 entités UML**,
So that **tous les modules peuvent accéder à l'utilisateur connecté et aux données mockées**.

## ACCEPTANCE CRITERIA
**Given** l'app est chargée
**When** un utilisateur est "connecté" (mock)
**Then** `useAuth()` retourne l'utilisateur courant et la colocation active
**And** `mockData.js` contient des données réalistes pour : Colocation, Utilisateur, Tache, Finance, Abonnement, Food_Recette, Food_Course

## FICHIERS À CRÉER/MODIFIER
- `client/src/contexts/AuthContext.jsx` (nouveau)
- `server/data/mockData.js` (nouveau)
- `server/index.js` (modifier — ajouter toutes les routes API)
- `client/src/lib/api.js` (nouveau — fonctions fetch)
- `client/src/main.jsx` (modifier — wrapper avec AuthProvider)
- `client/src/components/Sidebar.jsx` (modifier — utiliser useAuth())
- `client/src/components/BottomNav.jsx` (modifier — utiliser useAuth())

## ROUTES API CONCERNÉES
Toutes les routes de base :
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

## COMPOSANTS SHADCN/UI À UTILISER
Aucun composant visuel pour cette story (logique et données).

## DESIGN REFERENCE
Données mockées de référence depuis ui-design.md :

**Utilisateurs :**
- Thomas Durand (Admin) — thomas@coloc.fr
- Léa Martin (Membre) — lea@coloc.fr
- Marc Lefebvre (Membre) — marc@coloc.fr

**Colocation :**
- Nom : "Coloc Centrale"
- Code invitation : COLO-7829-X
- Cagnotte commune : 250,00 €

**Tâches :**
- Sortir les poubelles (Thomas, À faire, urgent, 2026-03-20)
- Ménage salon (Léa, En cours, 2026-03-21)
- Vaisselle (Marc, Terminée, 2026-03-18)
- Courses (Thomas, À faire, 2026-03-22)
- Nettoyer salle de bain (Léa, À faire, 2026-03-23)

**Finances :**
- Courses alimentaires (50€, Thomas, 2026-03-15)
- Internet (30€, Léa, 2026-03-10)
- Électricité (45€, Marc, 2026-03-05)
- Restaurant (35€, Thomas, 2026-03-12)
- Produits ménagers (18€, Léa, 2026-03-08)
- ... (24 transactions au total, paginées par 5)

**Recettes :**
- Pâtes Carbonara (20min, 4 portions, catégorie: Pâtes, ingrédients: pâtes, crème, lardons, parmesan, oeufs)
- Quiche Lorraine (45min, 6 portions, catégorie: Tartes, ingrédients: pâte brisée, lardons, crème, oeufs, gruyère)
- Salade César (15min, 2 portions, catégorie: Salades, ingrédients: salade, poulet, croutons, parmesan, sauce César)
- Pancakes du Dimanche (30min, 4 portions, catégorie: Petit-déjeuner, ingrédients: farine, oeufs, lait, beurre, sucre)

**Liste de courses (12 articles) :**
- Produits laitiers : Lait, Beurre, Crème fraîche
- Boulangerie : Pain, Croissants
- Frais : Poulet, Tomates
- Épicerie : Pâtes, Riz
- Hygiène : Savon, Dentifrice
- Ménage : Éponges

**Abonnements :**
- Netflix Premium : 17,99€/mois, prochain prélèvement 12 Oct, icône movie, 4/4 places
- Internet Orange Fibre : 39,99€/mois, prochain prélèvement 01 Oct, icône router
- Spotify Family : 15,99€/mois, prochain prélèvement 22 Oct, icône audiotrack, 3/6 places
- Disney+ Annuel : 8,99€/mois, prochain prélèvement 05 Nov, icône stars, 2/4 places
- Électricité EDF Fixe : 62,54€/mois, prochain prélèvement 15 Oct, icône bolt

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Créer `server/data/mockData.js` avec les 7 entités UML :**
   ```js
   // Story 1.3: AuthContext et mock data
   const mockData = {
     colocation: {
       id: '1',
       nom: 'Coloc Centrale',
       codeInvitation: 'COLO-7829-X',
       cagnotteCommune: 250.00,
     },
     utilisateurs: [
       { id: '1', nom: 'Thomas Durand', email: 'thomas@coloc.fr', motDePasse: 'password123', role: 'admin', photoProfil: null },
       { id: '2', nom: 'Léa Martin', email: 'lea@coloc.fr', motDePasse: 'password123', role: 'membre', photoProfil: null },
       { id: '3', nom: 'Marc Lefebvre', email: 'marc@coloc.fr', motDePasse: 'password123', role: 'membre', photoProfil: null },
     ],
     taches: [
       { id: '1', titre: 'Sortir les poubelles', description: 'Poubelles jaunes et grises', statut: 'a_faire', categorie: 'Extérieur', dateEcheance: '2026-03-20', assigneA: '1', creePar: '2', recurrence: null },
       { id: '2', titre: 'Ménage salon', description: 'Aspirateur et serpillère', statut: 'en_cours', categorie: 'Salon', dateEcheance: '2026-03-21', assigneA: '2', creePar: '1', recurrence: 'hebdomadaire' },
       { id: '3', titre: 'Vaisselle', description: 'Laver et ranger', statut: 'terminee', categorie: 'Cuisine', dateEcheance: '2026-03-18', assigneA: '3', creePar: '1', recurrence: null },
       { id: '4', titre: 'Courses', description: 'Supermarché', statut: 'a_faire', categorie: 'Extérieur', dateEcheance: '2026-03-22', assigneA: '1', creePar: '1', recurrence: null },
       { id: '5', titre: 'Nettoyer salle de bain', description: 'Lavabo, douche, toilettes', statut: 'a_faire', categorie: 'Salle de bain', dateEcheance: '2026-03-23', assigneA: '2', creePar: '3', recurrence: 'mensuelle' },
     ],
     finances: [ /* 24 transactions — voir détail dans MOCK DATA */ ],
     recettes: [
       { id: '1', nomPlat: 'Pâtes Carbonara', tempsPreparation: 20, portions: 4, categorie: 'Pâtes', ingredients: ['pâtes', 'crème', 'lardons', 'parmesan', 'oeufs'], contraintesDiets: [], estFavori: false },
       { id: '2', nomPlat: 'Quiche Lorraine', tempsPreparation: 45, portions: 6, categorie: 'Tartes', ingredients: ['pâte brisée', 'lardons', 'crème', 'oeufs', 'gruyère'], contraintesDiets: [], estFavori: true },
       { id: '3', nomPlat: 'Salade César', tempsPreparation: 15, portions: 2, categorie: 'Salades', ingredients: ['salade', 'poulet', 'croutons', 'parmesan', 'sauce César'], contraintesDiets: [], estFavori: false },
       { id: '4', nomPlat: 'Pancakes du Dimanche', tempsPreparation: 30, portions: 4, categorie: 'Petit-déjeuner', ingredients: ['farine', 'oeufs', 'lait', 'beurre', 'sucre'], contraintesDiets: ['végétarien'], estFavori: true },
     ],
     courses: [
       { id: '1', nomArticle: 'Lait', categorie: 'Produits laitiers', estAchete: false, ajoutePar: '1' },
       { id: '2', nomArticle: 'Beurre', categorie: 'Produits laitiers', estAchete: false, ajoutePar: '2' },
       { id: '3', nomArticle: 'Crème fraîche', categorie: 'Produits laitiers', estAchete: true, ajoutePar: '1' },
       { id: '4', nomArticle: 'Pain', categorie: 'Boulangerie', estAchete: false, ajoutePar: '3' },
       { id: '5', nomArticle: 'Croissants', categorie: 'Boulangerie', estAchete: false, ajoutePar: '2' },
       { id: '6', nomArticle: 'Poulet', categorie: 'Frais', estAchete: false, ajoutePar: '1' },
       { id: '7', nomArticle: 'Tomates', categorie: 'Frais', estAchete: true, ajoutePar: '3' },
       { id: '8', nomArticle: 'Pâtes', categorie: 'Épicerie', estAchete: false, ajoutePar: '1' },
       { id: '9', nomArticle: 'Riz', categorie: 'Épicerie', estAchete: false, ajoutePar: '2' },
       { id: '10', nomArticle: 'Savon', categorie: 'Hygiène', estAchete: false, ajoutePar: '1' },
       { id: '11', nomArticle: 'Dentifrice', categorie: 'Hygiène', estAchete: true, ajoutePar: '3' },
       { id: '12', nomArticle: 'Éponges', categorie: 'Ménage', estAchete: false, ajoutePar: '2' },
     ],
     abonnements: [
       { id: '1', nomService: 'Netflix', type: 'PREMIUM', coutMensuel: 17.99, datePrelevement: '2026-10-12', icone: 'movie', placesTotal: 4, placesUtilisees: 4, identifiant: 'coloc.centrale@gmail.com', motDePasseService: 'N3tfl1x2026' },
       { id: '2', nomService: 'Internet (Orange)', type: 'FIBRE', coutMensuel: 39.99, datePrelevement: '2026-10-01', icone: 'router', placesTotal: null, placesUtilisees: null, identifiant: null, motDePasseService: null },
       { id: '3', nomService: 'Spotify Family', type: 'FAMILLE', coutMensuel: 15.99, datePrelevement: '2026-10-22', icone: 'audiotrack', placesTotal: 6, placesUtilisees: 3, identifiant: 'coloc.music@gmail.com', motDePasseService: 'Sp0t1fy!' },
       { id: '4', nomService: 'Disney+', type: 'ANNUEL', coutMensuel: 8.99, datePrelevement: '2026-11-05', icone: 'stars', placesTotal: 4, placesUtilisees: 2, identifiant: 'coloc.disney@gmail.com', motDePasseService: 'D1sn3y+' },
       { id: '5', nomService: 'Électricité (EDF)', type: 'FIXE', coutMensuel: 62.54, datePrelevement: '2026-10-15', icone: 'bolt', placesTotal: null, placesUtilisees: null, identifiant: 'REF-CLI-78432', motDePasseService: null },
     ],
   }
   module.exports = mockData
   ```

   Pour les finances, générer 24 transactions réalistes avec des montants, dates et payeurs variés.

1. **Modifier `server/index.js` — ajouter toutes les routes API :**

   ```js
   const mockData = require('./data/mockData')

   // AUTH
   app.post('/api/auth/login', (req, res) => { /* vérifier email/password dans mockData.utilisateurs */ })
   app.post('/api/auth/register', (req, res) => { /* ajouter un utilisateur */ })

   // USERS
   app.get('/api/users', (req, res) => res.json({ data: mockData.utilisateurs }))
   app.put('/api/users/:id', (req, res) => { /* modifier utilisateur */ })

   // COLOCATION
   app.get('/api/colocation', (req, res) => res.json({ data: mockData.colocation }))

   // TASKS
   app.get('/api/tasks', (req, res) => res.json({ data: mockData.taches }))
   app.post('/api/tasks', (req, res) => { /* ajouter tâche */ })
   app.put('/api/tasks/:id', (req, res) => { /* modifier tâche */ })
   app.delete('/api/tasks/:id', (req, res) => { /* supprimer tâche */ })

   // FINANCES
   app.get('/api/finances', (req, res) => res.json({ data: mockData.finances }))
   app.post('/api/finances', (req, res) => { /* ajouter dépense */ })
   app.put('/api/finances/:id', (req, res) => { /* modifier dépense */ })
   app.delete('/api/finances/:id', (req, res) => { /* supprimer dépense */ })

   // RECIPES
   app.get('/api/recipes', (req, res) => res.json({ data: mockData.recettes }))
   app.post('/api/recipes', (req, res) => { /* ajouter recette */ })

   // SHOPPING LIST
   app.get('/api/shopping-list', (req, res) => res.json({ data: mockData.courses }))
   app.post('/api/shopping-list', (req, res) => { /* ajouter article */ })
   app.put('/api/shopping-list/:id', (req, res) => { /* toggle acheté */ })

   // SUBSCRIPTIONS
   app.get('/api/subscriptions', (req, res) => res.json({ data: mockData.abonnements }))
   app.post('/api/subscriptions', (req, res) => { /* ajouter abonnement */ })
   app.put('/api/subscriptions/:id', (req, res) => { /* modifier abonnement */ })
   app.delete('/api/subscriptions/:id', (req, res) => { /* supprimer abonnement */ })
   ```

   Chaque route POST doit générer un nouvel ID (auto-increment), chaque PUT doit trouver l'objet par ID et le modifier, chaque DELETE doit le retirer du tableau.

2. **Créer `client/src/lib/api.js` :**

   ```js
   // Story 1.3: AuthContext et mock data
   const API_BASE = 'http://localhost:3001/api'

   export async function apiGet(endpoint) {
     const res = await fetch(`${API_BASE}${endpoint}`)
     if (!res.ok) throw new Error('Erreur API')
     return res.json()
   }

   export async function apiPost(endpoint, data) {
     const res = await fetch(`${API_BASE}${endpoint}`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(data),
     })
     if (!res.ok) throw new Error('Erreur API')
     return res.json()
   }

   export async function apiPut(endpoint, data) {
     const res = await fetch(`${API_BASE}${endpoint}`, {
       method: 'PUT',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(data),
     })
     if (!res.ok) throw new Error('Erreur API')
     return res.json()
   }

   export async function apiDelete(endpoint) {
     const res = await fetch(`${API_BASE}${endpoint}`, { method: 'DELETE' })
     if (!res.ok) throw new Error('Erreur API')
     return res.json()
   }
   ```

3. **Créer `client/src/contexts/AuthContext.jsx` :**

   ```jsx
   // Story 1.3: AuthContext et mock data
   import { createContext, useContext, useState } from 'react'

   const AuthContext = createContext(null)

   export function AuthProvider({ children }) {
     const [user, setUser] = useState(null)
     const [colocation, setColocation] = useState(null)

     const login = async (email, password) => {
       const res = await fetch('http://localhost:3001/api/auth/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email, password }),
       })
       const data = await res.json()
       if (data.error) throw new Error(data.error)
       setUser(data.data.user)
       setColocation(data.data.colocation)
       return data.data
     }

     const register = async (nom, email, password) => {
       const res = await fetch('http://localhost:3001/api/auth/register', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ nom, email, motDePasse: password }),
       })
       const data = await res.json()
       if (data.error) throw new Error(data.error)
       setUser(data.data.user)
       return data.data
     }

     const logout = () => {
       setUser(null)
       setColocation(null)
     }

     return (
       <AuthContext.Provider value={{ user, colocation, login, register, logout, setUser, setColocation }}>
         {children}
       </AuthContext.Provider>
     )
   }

   export function useAuth() {
     const context = useContext(AuthContext)
     if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider')
     return context
   }
   ```

4. **Modifier `client/src/main.jsx` :**

   ```jsx
   import { AuthProvider } from './contexts/AuthContext'
   // Wrapper <App /> dans <AuthProvider>
   ```

5. **Modifier `client/src/components/Sidebar.jsx` et `BottomNav.jsx` :**
   - Remplacer les données hardcodées par `const { user, logout } = useAuth()`
   - Afficher `user?.nom` et `user?.email` dans le profil sidebar
   - Bouton logout appelle `logout()` puis `navigate('/login')`

6. **Tester** : se connecter avec <thomas@coloc.fr> / password123, vérifier que le nom s'affiche dans la sidebar, et que les routes API retournent les données correctes.

## MOCK DATA NÉCESSAIRE

Toutes les 7 entités UML documentées dans la section DESIGN REFERENCE ci-dessus. Le fichier `server/data/mockData.js` est LE fichier centralisé de données mock pour tout le projet. Chaque module fera des fetch vers les routes Express qui lisent ce fichier.

Pour les 24 transactions financières, utiliser ce pattern :

```js
finances: [
  { id: '1', titre: 'Courses alimentaires', montant: 50.00, type: 'depense', dateOperation: '2026-03-15', payePar: '1' },
  { id: '2', titre: 'Facture Internet', montant: 30.00, type: 'depense', dateOperation: '2026-03-10', payePar: '2' },
  { id: '3', titre: 'Électricité', montant: 45.00, type: 'depense', dateOperation: '2026-03-05', payePar: '3' },
  // ... 21 transactions supplémentaires avec des montants et dates variés
]
```

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```

---

## EPIC 2 : Authentification & Onboarding

---

### PROMPT-2-1

```markdown
# PROMPT-2-1: Story 2.1 — Page de connexion

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **visiteur**,
I want **me connecter avec mon email et mot de passe**,
So that **j'accède à ma colocation**.

## ACCEPTANCE CRITERIA
**Given** je suis sur `/login`
**When** je saisis un email et mot de passe valides et clique "SE CONNECTER"
**Then** je suis redirigé vers le dashboard
**And** le formulaire affiche les champs email et password avec toggle visibilité
**And** un lien "Mot de passe oublié ?" et "Créer un compte" sont visibles
**And** une section "Rejoindre une colocation existante" avec champ code + bouton "Rejoindre" est affichée

## FICHIERS À CRÉER/MODIFIER
- `client/src/pages/Login.jsx` (nouveau)
- `client/src/App.jsx` (modifier — importer Login)

## ROUTES API CONCERNÉES
- `POST /api/auth/login` — body: `{ email, password }` → réponse: `{ data: { user, colocation } }`

## COMPOSANTS SHADCN/UI À UTILISER
- **Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter** — conteneur du formulaire
- **Input** — champs email et password
- **Button** — bouton "SE CONNECTER" et "Rejoindre"
- **Label** — labels des champs

## DESIGN REFERENCE
**Écran 1 — Connexion (ui-design.md) :**
- Header : logo "ColocManager" + nav (Accueil, Fonctionnalités, Tarifs) + bouton "S'inscrire"
- Formulaire centré sur fond `#f6f7f8`
- Champ Email : type email, placeholder "Email"
- Champ Mot de passe : type password, icône `visibility_off` (toggle), placeholder "Mot de passe"
- Bouton principal : "SE CONNECTER" — fond `#4799eb`, texte blanc, full-width
- Lien : "Mot de passe oublié ?" — texte `#4799eb`
- Lien : "Nouveau ici ? Créer un compte" — texte `#4799eb`
- Section "Rejoindre une colocation existante" : icône `group_add`, champ code, bouton "Rejoindre"
- Footer : "© 2023 ColocManager. Tous droits réservés."

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Installer les composants shadcn/ui nécessaires :**
   ```bash
   cd client && npx shadcn@latest add card input button label
   ```

1. **Créer `client/src/pages/Login.jsx` :**

   ```jsx
   // Story 2.1: Page de connexion
   ```

   - Importer `useState` de React
   - Importer `useNavigate`, `Link` de react-router-dom
   - Importer `useAuth` depuis `@/contexts/AuthContext`
   - Importer Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input, Button, Label depuis shadcn/ui

2. **Créer le state local :**

   ```jsx
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [showPassword, setShowPassword] = useState(false)
   const [error, setError] = useState('')
   const [codeInvitation, setCodeInvitation] = useState('')
   ```

3. **Créer la fonction handleLogin :**

   ```jsx
   const handleLogin = async (e) => {
     e.preventDefault()
     setError('')
     try {
       await login(email, password)
       navigate('/dashboard')
     } catch (err) {
       setError('Email ou mot de passe incorrect')
     }
   }
   ```

4. **Rendre le JSX :**
   - **Header** : barre de navigation avec logo "ColocManager" (icône `apartment`), liens Accueil/Fonctionnalités/Tarifs, bouton "S'inscrire" → `/register`
   - **Formulaire** (centré, max-w-md, fond blanc, padding) :
     - `<Label htmlFor="email">Email</Label>`
     - `<Input id="email" type="email" placeholder="Email" value={email} onChange={...} />`
     - `<Label htmlFor="password">Mot de passe</Label>`
     - `<div className="relative">` pour le champ password avec bouton toggle visibilité (icône `visibility` / `visibility_off`)
     - `{error && <p className="text-red-500 text-sm">{error}</p>}`
     - `<Button className="w-full bg-[#4799eb] hover:bg-[#3b82f6]">SE CONNECTER</Button>`
     - `<Link to="#" className="text-[#4799eb] text-sm">Mot de passe oublié ?</Link>`
     - `<p>Nouveau ici ? <Link to="/register" className="text-[#4799eb]">Créer un compte</Link></p>`
   - **Section "Rejoindre une colocation existante" :**
     - Icône `group_add`, titre
     - `<Input placeholder="Code d'invitation" value={codeInvitation} />`
     - `<Button variant="outline">Rejoindre</Button>`
   - **Footer** : "© 2023 ColocManager. Tous droits réservés." — texte `#4e7397`

5. **Modifier `client/src/App.jsx` :** importer Login et utiliser dans la route `/login`.

6. **Tester :**
   - Saisir <thomas@coloc.fr> / password123 → redirigé vers dashboard
   - Saisir un mauvais email → message d'erreur "Email ou mot de passe incorrect"
   - Toggle visibilité mot de passe fonctionne
   - Liens vers inscription et mot de passe oublié visibles
   - Responsive : le formulaire s'adapte sur mobile

## MOCK DATA NÉCESSAIRE

Utilisateurs dans `server/data/mockData.js` (déjà créé dans story 1.3) :

- <thomas@coloc.fr> / password123
- <lea@coloc.fr> / password123
- <marc@coloc.fr> / password123

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```

---

### PROMPT-2-2

```markdown
# PROMPT-2-2: Story 2.2 — Page d'inscription

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **visiteur**,
I want **créer un compte avec mon nom, email et mot de passe**,
So that **je peux rejoindre ou créer une colocation**.

## ACCEPTANCE CRITERIA
**Given** je suis sur `/register`
**When** je remplis nom, email, mot de passe (≥8 caractères) et clique "S'INSCRIRE"
**Then** mon compte est créé et je suis redirigé vers le choix créer/rejoindre colocation
**And** des boutons Google et Facebook sont affichés (visuels uniquement, non fonctionnels)
**And** un lien "Déjà un compte ? Se connecter" est visible

## FICHIERS À CRÉER/MODIFIER
- `client/src/pages/Register.jsx` (nouveau)
- `client/src/App.jsx` (modifier — importer Register)

## ROUTES API CONCERNÉES
- `POST /api/auth/register` — body: `{ nom, email, motDePasse }` → réponse: `{ data: { user } }`

## COMPOSANTS SHADCN/UI À UTILISER
- **Card, CardHeader, CardTitle, CardDescription, CardContent** — conteneur du formulaire
- **Input** — champs nom, email, mot de passe
- **Button** — bouton "S'INSCRIRE" + boutons sociaux
- **Label** — labels des champs

## DESIGN REFERENCE
**Écran 2 — Inscription (ui-design.md) :**
- Header : logo "ColocApp" + nav (Accueil, Fonctionnalités, Tarifs) + lien "Se connecter"
- Titre : "Créer un compte"
- Sous-titre : "Rejoignez notre communauté de colocataires"
- Champs :
  - Nom complet : icône `person`, type text, requis
  - Adresse email : icône `mail`, type email, requis + format email
  - Mot de passe : icône `lock` + toggle `visibility_off`, "Au moins 8 caractères"
- Bouton principal : "S'INSCRIRE" — fond `#4799eb`, texte blanc, full-width
- Séparateur "ou" puis boutons Google + Facebook (visuels, non fonctionnels)
- Lien : "Déjà un compte ? Se connecter"

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Créer `client/src/pages/Register.jsx` :**
   ```jsx
   // Story 2.2: Page d'inscription
   ```

- Importer useState, useNavigate, Link, useAuth
- Importer Card, Input, Button, Label de shadcn/ui

1. **Créer le state local :**

   ```jsx
   const [nom, setNom] = useState('')
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [showPassword, setShowPassword] = useState(false)
   const [error, setError] = useState('')
   ```

2. **Créer la fonction handleRegister :**

   ```jsx
   const handleRegister = async (e) => {
     e.preventDefault()
     setError('')
     if (password.length < 8) {
       setError('Le mot de passe doit contenir au moins 8 caractères')
       return
     }
     try {
       await register(nom, email, password)
       navigate('/dashboard') // ou page choix créer/rejoindre coloc
     } catch (err) {
       setError(err.message)
     }
   }
   ```

3. **Rendre le JSX :**
   - **Header** : logo "ColocApp" (icône `apartment`), liens Accueil/Fonctionnalités/Tarifs, lien "Se connecter" → `/login`
   - **Card** centrée (max-w-md) :
     - CardHeader : titre "Créer un compte", description "Rejoignez notre communauté de colocataires"
     - Champ Nom complet : `<div className="relative">` avec icône `person` à gauche dans l'input, `<Input placeholder="Nom complet" />`
     - Champ Email : icône `mail`, `<Input type="email" placeholder="Adresse email" />`
     - Champ Mot de passe : icône `lock` + toggle visibilité, texte helper "Au moins 8 caractères" en `text-[#4e7397] text-xs`
     - `{error && <p className="text-red-500 text-sm">{error}</p>}`
     - `<Button className="w-full bg-[#4799eb] hover:bg-[#3b82f6]">S'INSCRIRE</Button>`
   - **Séparateur :** `<div className="flex items-center gap-2"><hr className="flex-1" /><span className="text-[#4e7397] text-sm">ou</span><hr className="flex-1" /></div>`
   - **Boutons sociaux :**
     - `<Button variant="outline" className="w-full" disabled>Continuer avec Google</Button>`
     - `<Button variant="outline" className="w-full" disabled>Continuer avec Facebook</Button>`
   - **Lien :** "Déjà un compte ? <Link to="/login">Se connecter</Link>"

4. **Modifier `client/src/App.jsx` :** importer Register.

5. **Tester :**
   - Remplir les 3 champs et cliquer S'INSCRIRE → redirection
   - Mot de passe < 8 caractères → message d'erreur
   - Boutons Google/Facebook visibles mais non fonctionnels
   - Lien "Se connecter" redirige vers `/login`
   - Responsive sur mobile

## MOCK DATA NÉCESSAIRE

La route `POST /api/auth/register` ajoute un nouvel utilisateur au tableau `mockData.utilisateurs` avec un ID auto-généré et le rôle "membre".

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```

---

### PROMPT-2-3

```markdown
# PROMPT-2-3: Story 2.3 — Créer ou rejoindre une colocation

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **utilisateur connecté**,
I want **créer une nouvelle colocation ou en rejoindre une existante via un code d'invitation**,
So that **je peux commencer à utiliser l'application avec mes colocataires**.

## ACCEPTANCE CRITERIA
**Given** je suis connecté mais sans colocation
**When** je crée une colocation
**Then** un code d'invitation unique est généré (format COLO-XXXX-X)

**Given** je suis connecté mais sans colocation
**When** je saisis un code d'invitation valide et clique "Rejoindre"
**Then** je rejoins la colocation et suis redirigé vers le dashboard

## FICHIERS À CRÉER/MODIFIER
- `client/src/pages/JoinColoc.jsx` (nouveau — page choix créer/rejoindre)
- `client/src/App.jsx` (modifier — ajouter route `/join`)
- `server/index.js` (modifier — ajouter routes POST /api/colocation et POST /api/colocation/join)

## ROUTES API CONCERNÉES
- `POST /api/colocation` — body: `{ nom }` → réponse: `{ data: { colocation } }` (avec code généré)
- `POST /api/colocation/join` — body: `{ codeInvitation }` → réponse: `{ data: { colocation } }`

## COMPOSANTS SHADCN/UI À UTILISER
- **Card, CardHeader, CardTitle, CardDescription, CardContent** — deux cards côte à côte
- **Input** — champ nom colocation + champ code invitation
- **Button** — boutons "Créer" et "Rejoindre"
- **Label** — labels des champs
- **Tabs, TabsList, TabsTrigger, TabsContent** — onglets Créer / Rejoindre

## DESIGN REFERENCE
Page non présente dans les designs Stitch, mais inspirée du style général :
- Fond `#f6f7f8`, card centrée max-w-md
- 2 onglets (Tabs shadcn) : "Créer une colocation" / "Rejoindre une colocation"
- Onglet Créer : champ "Nom de la colocation", bouton "Créer" (primary `#4799eb`)
- Onglet Rejoindre : champ "Code d'invitation" (placeholder "COLO-XXXX-X"), bouton "Rejoindre"
- Code généré affiché dans un bloc copiable après création

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Installer les composants shadcn/ui nécessaires :**
   ```bash
   cd client && npx shadcn@latest add tabs
   ```

1. **Créer `client/src/pages/JoinColoc.jsx` :**

   ```jsx
   // Story 2.3: Créer ou rejoindre une colocation
   ```

   - Importer useState, useNavigate, useAuth
   - Importer Tabs, TabsList, TabsTrigger, TabsContent, Card, Input, Button, Label

2. **Onglet "Créer une colocation" :**
   - Champ : nom de la colocation
   - Bouton : "Créer ma colocation"
   - Au clic : `POST /api/colocation` avec `{ nom }`
   - Afficher le code généré (format COLO-XXXX-X) dans un bloc avec bouton copier
   - Mettre à jour `setColocation()` dans AuthContext

3. **Onglet "Rejoindre une colocation" :**
   - Champ : code d'invitation (placeholder "COLO-XXXX-X")
   - Bouton : "Rejoindre"
   - Au clic : `POST /api/colocation/join` avec `{ codeInvitation }`
   - Si code valide → `setColocation()` + navigate('/dashboard')
   - Si code invalide → message d'erreur "Code d'invitation invalide"

4. **Ajouter les routes côté Express dans `server/index.js` :**

   ```js
   app.post('/api/colocation', (req, res) => {
     const code = 'COLO-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + String.fromCharCode(65 + Math.floor(Math.random() * 26))
     const newColoc = { id: String(Date.now()), nom: req.body.nom, codeInvitation: code, cagnotteCommune: 0 }
     mockData.colocation = newColoc
     res.json({ data: newColoc })
   })

   app.post('/api/colocation/join', (req, res) => {
     if (req.body.codeInvitation === mockData.colocation.codeInvitation) {
       res.json({ data: mockData.colocation })
     } else {
       res.status(400).json({ error: 'Code d\'invitation invalide' })
     }
   })
   ```

5. **Modifier `client/src/App.jsx` :** ajouter route `/join` pointant vers JoinColoc.

6. **Tester :**
   - Créer une coloc → code affiché
   - Rejoindre avec COLO-7829-X → redirigé vers dashboard
   - Rejoindre avec code invalide → message d'erreur
   - Responsive mobile

## MOCK DATA NÉCESSAIRE

La colocation existante dans mockData : `{ codeInvitation: 'COLO-7829-X' }`. Le code valide pour rejoindre est COLO-7829-X.

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```

---

### PROMPT-2-4

```markdown
# PROMPT-2-4: Story 2.4 — Réinitialisation mot de passe (mock)

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **utilisateur**,
I want **demander la réinitialisation de mon mot de passe**,
So that **je puisse récupérer l'accès à mon compte**.

## ACCEPTANCE CRITERIA
**Given** je suis sur `/login`
**When** je clique "Mot de passe oublié ?" et saisis mon email
**Then** un message de confirmation s'affiche : "Un email de réinitialisation a été envoyé"

## FICHIERS À CRÉER/MODIFIER
- `client/src/pages/Login.jsx` (modifier — ajouter Dialog/modale pour mot de passe oublié)

## ROUTES API CONCERNÉES
Aucune route API réelle — le flux est purement visuel (mock). On peut optionnellement ajouter :
- `POST /api/auth/forgot-password` — body: `{ email }` → réponse: `{ data: { message: "Email envoyé" } }`

## COMPOSANTS SHADCN/UI À UTILISER
- **Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription** — modale mot de passe oublié
- **Input** — champ email
- **Button** — bouton "Envoyer"
- **Label** — label du champ

## DESIGN REFERENCE
Pas de design Stitch spécifique pour cette modale. Suivre le style général :
- Dialog modale centrée, fond blanc
- Titre : "Mot de passe oublié"
- Description : "Entrez votre adresse email pour recevoir un lien de réinitialisation"
- Champ email
- Bouton "Envoyer" (primary `#4799eb`)
- Après soumission : message de succès en vert `#22c55e` : "Un email de réinitialisation a été envoyé à [email]"

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Installer le composant Dialog de shadcn/ui :**
   ```bash
   cd client && npx shadcn@latest add dialog
   ```

1. **Modifier `client/src/pages/Login.jsx` :**
   - Ajouter un state `const [forgotOpen, setForgotOpen] = useState(false)`
   - Ajouter un state `const [forgotEmail, setForgotEmail] = useState('')`
   - Ajouter un state `const [forgotSuccess, setForgotSuccess] = useState(false)`

2. **Remplacer le lien "Mot de passe oublié ?" par un DialogTrigger :**

   ```jsx
   <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
     <DialogTrigger asChild>
       <button className="text-[#4799eb] text-sm hover:underline">
         Mot de passe oublié ?
       </button>
     </DialogTrigger>
     <DialogContent>
       <DialogHeader>
         <DialogTitle>Mot de passe oublié</DialogTitle>
         <DialogDescription>
           Entrez votre adresse email pour recevoir un lien de réinitialisation
         </DialogDescription>
       </DialogHeader>
       {forgotSuccess ? (
         <p className="text-[#22c55e] text-sm">
           Un email de réinitialisation a été envoyé à {forgotEmail}
         </p>
       ) : (
         <form onSubmit={handleForgotPassword} className="space-y-4">
           <div>
             <Label htmlFor="forgot-email">Email</Label>
             <Input
               id="forgot-email"
               type="email"
               placeholder="Votre adresse email"
               value={forgotEmail}
               onChange={(e) => setForgotEmail(e.target.value)}
               required
             />
           </div>
           <Button type="submit" className="w-full bg-[#4799eb] hover:bg-[#3b82f6]">
             Envoyer
           </Button>
         </form>
       )}
     </DialogContent>
   </Dialog>
   ```

3. **Créer la fonction handleForgotPassword :**

   ```jsx
   const handleForgotPassword = (e) => {
     e.preventDefault()
     // Pas d'appel API réel — juste le flux visuel
     setForgotSuccess(true)
   }
   ```

4. **Tester :**
   - Cliquer "Mot de passe oublié ?" → modale s'ouvre
   - Saisir un email → cliquer "Envoyer" → message vert "Un email de réinitialisation a été envoyé"
   - Fermer la modale et la rouvrir → état réinitialisé

## MOCK DATA NÉCESSAIRE

Aucune donnée mock supplémentaire. Le flux est purement visuel.

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```

---

## EPIC 3 : Dashboard & Vue d'ensemble

---

### PROMPT-3-1

```markdown
# PROMPT-3-1: Story 3.1 — Dashboard avec 4 widgets

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **colocataire**,
I want **voir un dashboard avec 4 widgets résumant finances, tâches, alimentation et abonnements**,
So that **je comprends l'état de ma colocation en 5 secondes**.

## ACCEPTANCE CRITERIA
**Given** je suis connecté et sur `/dashboard`
**When** la page se charge
**Then** 4 widgets s'affichent : Finances (solde cagnotte + tendance), Tâches (nombre urgentes + prochaine tâche), Alimentation (nombre articles courses), Abonnements (nombre services actifs)
**And** un header affiche "Bonjour, [prénom] 👋" + bouton "Nouvelle dépense"
**And** la page charge en moins de 1 seconde

## FICHIERS À CRÉER/MODIFIER
- `client/src/pages/Dashboard.jsx` (nouveau)
- `client/src/components/WidgetCard.jsx` (nouveau — composant réutilisable)
- `client/src/App.jsx` (modifier — importer Dashboard)

## ROUTES API CONCERNÉES
- `GET /api/tasks` — pour compter les tâches urgentes
- `GET /api/finances` — pour le solde cagnotte
- `GET /api/shopping-list` — pour compter les articles
- `GET /api/subscriptions` — pour compter les services actifs
- `GET /api/colocation` — pour la cagnotte commune

## COMPOSANTS SHADCN/UI À UTILISER
- **Card, CardHeader, CardTitle, CardContent** — WidgetCard
- **Badge** — pour les tendances (+15€, Urgent, +3 items, Actifs)
- **Button** — bouton "Nouvelle dépense"

## DESIGN REFERENCE
**Écran 3 — Dashboard (ui-design.md) :**
- Header : "Bonjour, Thomas 👋" + sous-titre "Voici ce qui se passe dans votre colocation aujourd'hui" + bouton "add Nouvelle dépense" (primary `#4799eb`)
- **4 widgets en grille 2×2 (desktop) / 1 colonne (mobile) :**

| Widget | Icône | Valeur | Badge | Détail |
|--------|-------|--------|-------|--------|
| Finances | `attach_money` | 320,00 € | `+15 €` (vert `#22c55e`) | Solde cagnotte + tendance |
| Tâches | `check_circle` | 2 tâches | `Urgent` (rouge `#ef4444`) | Prochaine : "Sortir les poubelles" |
| Alimentation | `shopping_cart` | 15 articles | `+3 items` (bleu `#4799eb`) | Articles liste de courses |
| Abonnements | `subscriptions` | 4 services | `Actifs` (vert `#22c55e`) | Nombre de services |

- Chaque widget est une Card cliquable avec icône, titre, valeur grande, badge et détail

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Installer les composants shadcn/ui :**
   ```bash
   cd client && npx shadcn@latest add badge
   ```

1. **Créer `client/src/components/WidgetCard.jsx` :**

   ```jsx
   // Story 3.1: Dashboard avec 4 widgets
   ```

   - Props : `{ icon, title, value, badge, badgeColor, detail, onClick }`
   - Structure :

     ```jsx
     <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
       <CardHeader className="flex flex-row items-center justify-between pb-2">
         <CardTitle className="text-sm font-medium text-[#4e7397]">{title}</CardTitle>
         <span className="material-symbols-outlined text-[#4799eb]">{icon}</span>
       </CardHeader>
       <CardContent>
         <div className="text-2xl font-bold text-[#0e141b]">{value}</div>
         <div className="flex items-center gap-2 mt-1">
           <Badge className={badgeColor}>{badge}</Badge>
           <span className="text-xs text-[#4e7397]">{detail}</span>
         </div>
       </CardContent>
     </Card>
     ```

2. **Créer `client/src/pages/Dashboard.jsx` :**

   ```jsx
   // Story 3.1: Dashboard avec 4 widgets
   ```

   - Importer useState, useEffect, useNavigate, useAuth
   - Importer WidgetCard, Button, Badge
   - Importer apiGet depuis `@/lib/api`

3. **Charger les données au mount :**

   ```jsx
   const [tasks, setTasks] = useState([])
   const [finances, setFinances] = useState([])
   const [shoppingList, setShoppingList] = useState([])
   const [subscriptions, setSubscriptions] = useState([])
   const [colocation, setColocation] = useState(null)

   useEffect(() => {
     Promise.all([
       apiGet('/tasks'),
       apiGet('/finances'),
       apiGet('/shopping-list'),
       apiGet('/subscriptions'),
       apiGet('/colocation'),
     ]).then(([t, f, s, sub, c]) => {
       setTasks(t.data)
       setFinances(f.data)
       setShoppingList(s.data)
       setSubscriptions(sub.data)
       setColocation(c.data)
     })
   }, [])
   ```

4. **Calculer les valeurs des widgets :**

   ```jsx
   const urgentTasks = tasks.filter(t => t.statut === 'a_faire').length
   const nextTask = tasks.find(t => t.statut === 'a_faire')
   const articlesCount = shoppingList.filter(a => !a.estAchete).length
   const activeSubscriptions = subscriptions.length
   const cagnotte = colocation?.cagnotteCommune || 0
   ```

5. **Rendre le header :**

   ```jsx
   <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
     <div>
       <h1 className="text-2xl font-bold text-[#0e141b] font-['Plus_Jakarta_Sans']">
         Bonjour, {user?.nom?.split(' ')[0]} 👋
       </h1>
       <p className="text-[#4e7397]">Voici ce qui se passe dans votre colocation aujourd'hui</p>
     </div>
     <Button className="mt-4 md:mt-0 bg-[#4799eb] hover:bg-[#3b82f6]">
       <span className="material-symbols-outlined mr-2">add</span>
       Nouvelle dépense
     </Button>
   </div>
   ```

6. **Rendre les 4 widgets en grille :**

   ```jsx
   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
     <WidgetCard icon="attach_money" title="Finances" value={`${cagnotte.toFixed(2)} €`}
       badge="+15 €" badgeColor="bg-[#22c55e] text-white" detail="Solde cagnotte"
       onClick={() => navigate('/finances')} />
     <WidgetCard icon="check_circle" title="Tâches" value={`${urgentTasks} tâches`}
       badge="Urgent" badgeColor="bg-[#ef4444] text-white" detail={nextTask ? `Prochaine : ${nextTask.titre}` : ''}
       onClick={() => navigate('/tasks')} />
     <WidgetCard icon="shopping_cart" title="Alimentation" value={`${articlesCount} articles`}
       badge="+3 items" badgeColor="bg-[#4799eb] text-white" detail="Articles liste de courses"
       onClick={() => navigate('/food')} />
     <WidgetCard icon="subscriptions" title="Abonnements" value={`${activeSubscriptions} services`}
       badge="Actifs" badgeColor="bg-[#22c55e] text-white" detail="Nombre de services"
       onClick={() => navigate('/subscriptions')} />
   </div>
   ```

7. **Tester :** vérifier les 4 widgets avec valeurs correctes, le header avec le prénom, responsive 2×2 → 1 colonne, clic sur widget navigue vers le module.

## MOCK DATA NÉCESSAIRE

Données chargées depuis les routes API existantes (créées dans story 1.3) :

- `/api/colocation` → cagnotte 250€
- `/api/tasks` → 5 tâches (3 à faire = urgent)
- `/api/shopping-list` → 12 articles (certains achetés)
- `/api/subscriptions` → 5 services

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```

---

### PROMPT-3-2

```markdown
# PROMPT-3-2: Story 3.2 — Graphique et activités récentes

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **colocataire**,
I want **voir un graphique des dépenses mensuelles et le flux d'activités récentes**,
So that **je peux suivre les tendances financières et l'activité de la colocation**.

## ACCEPTANCE CRITERIA
**Given** je suis sur le dashboard
**When** je scrolle sous les widgets
**Then** un graphique des dépenses mensuelles s'affiche
**And** un flux de 3 activités récentes s'affiche avec timestamps
**And** un tableau des soldes/équilibres entre colocataires s'affiche

## FICHIERS À CRÉER/MODIFIER
- `client/src/pages/Dashboard.jsx` (modifier — ajouter sections graphique, activités, soldes)

## ROUTES API CONCERNÉES
- `GET /api/finances` — pour les données du graphique
- `GET /api/users` — pour les noms dans le tableau des soldes

## COMPOSANTS SHADCN/UI À UTILISER
- **Card, CardHeader, CardTitle, CardContent** — conteneurs des sections
- **Table, TableHeader, TableRow, TableHead, TableBody, TableCell** — tableau des soldes
- **Avatar, AvatarFallback** — avatars dans le tableau des soldes
- **Badge** — pour les statuts (positif/négatif)

## DESIGN REFERENCE
**Écran 3 — Dashboard (ui-design.md), sections supplémentaires :**

- **Graphique dépenses mensuelles :**
  - Barres comparatives par mois (simple, en CSS/Tailwind — pas besoin de chart.js)
  - Mois : Jan, Fév, Mar, Avr, Mai, Jun (derniers 6 mois)
  - Valeurs mockées : 450€, 380€, 520€, 410€, 490€, 350€

- **Flux d'activités récentes :**
  - 3 entrées avec icône, texte et timestamp :
    1. "Thomas a ajouté une dépense de 50€" — il y a 2h
    2. "Léa a terminé 'Ménage salon'" — il y a 5h
    3. "Marc a ajouté 'Éponges' à la liste de courses" — hier

- **Tableau des soldes colocataires :**
  - 3 lignes : Thomas (+25.50€, vert), Léa (-12.50€, rouge), Marc (-13.00€, rouge)
  - Colonnes : Avatar + Nom, Statut (À jour / Doit), Montant

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Installer les composants shadcn/ui :**
   ```bash
   cd client && npx shadcn@latest add table
   ```

1. **Ajouter le graphique des dépenses mensuelles dans `Dashboard.jsx` :**
   - Créer des barres en CSS/Tailwind (pas de bibliothèque de graphiques) :

   ```jsx
   const monthlyData = [
     { month: 'Jan', amount: 450 },
     { month: 'Fév', amount: 380 },
     { month: 'Mar', amount: 520 },
     { month: 'Avr', amount: 410 },
     { month: 'Mai', amount: 490 },
     { month: 'Jun', amount: 350 },
   ]
   const maxAmount = Math.max(...monthlyData.map(d => d.amount))
   ```

   - Rendre les barres :

   ```jsx
   <Card>
     <CardHeader><CardTitle>Dépenses mensuelles</CardTitle></CardHeader>
     <CardContent>
       <div className="flex items-end gap-2 h-40">
         {monthlyData.map(d => (
           <div key={d.month} className="flex-1 flex flex-col items-center">
             <div className="w-full bg-[#4799eb] rounded-t"
               style={{ height: `${(d.amount / maxAmount) * 100}%` }} />
             <span className="text-xs text-[#4e7397] mt-1">{d.month}</span>
             <span className="text-xs font-medium">{d.amount}€</span>
           </div>
         ))}
       </div>
     </CardContent>
   </Card>
   ```

2. **Ajouter le flux d'activités récentes :**

   ```jsx
   const activities = [
     { icon: 'attach_money', text: 'Thomas a ajouté une dépense de 50€', time: 'il y a 2h' },
     { icon: 'check_circle', text: 'Léa a terminé "Ménage salon"', time: 'il y a 5h' },
     { icon: 'shopping_cart', text: 'Marc a ajouté "Éponges" à la liste de courses', time: 'hier' },
   ]
   ```

   ```jsx
   <Card>
     <CardHeader><CardTitle>Activités récentes</CardTitle></CardHeader>
     <CardContent>
       <div className="space-y-4">
         {activities.map((a, i) => (
           <div key={i} className="flex items-center gap-3">
             <span className="material-symbols-outlined text-[#4799eb]">{a.icon}</span>
             <div className="flex-1">
               <p className="text-sm text-[#0e141b]">{a.text}</p>
               <p className="text-xs text-[#4e7397]">{a.time}</p>
             </div>
           </div>
         ))}
       </div>
     </CardContent>
   </Card>
   ```

3. **Ajouter le tableau des soldes colocataires :**

   ```jsx
   const soldes = [
     { nom: 'Thomas Durand', initials: 'TD', montant: 25.50, positif: true },
     { nom: 'Léa Martin', initials: 'LM', montant: -12.50, positif: false },
     { nom: 'Marc Lefebvre', initials: 'ML', montant: -13.00, positif: false },
   ]
   ```

   ```jsx
   <Card>
     <CardHeader><CardTitle>Soldes colocataires</CardTitle></CardHeader>
     <CardContent>
       <Table>
         <TableHeader>
           <TableRow>
             <TableHead>Colocataire</TableHead>
             <TableHead>Statut</TableHead>
             <TableHead className="text-right">Montant</TableHead>
           </TableRow>
         </TableHeader>
         <TableBody>
           {soldes.map(s => (
             <TableRow key={s.nom}>
               <TableCell className="flex items-center gap-2">
                 <Avatar className="h-8 w-8"><AvatarFallback>{s.initials}</AvatarFallback></Avatar>
                 {s.nom}
               </TableCell>
               <TableCell>
                 <Badge className={s.positif ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}>
                   {s.positif ? 'À jour' : 'Doit'}
                 </Badge>
               </TableCell>
               <TableCell className={`text-right font-medium ${s.positif ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                 {s.montant > 0 ? '+' : ''}{s.montant.toFixed(2)} €
               </TableCell>
             </TableRow>
           ))}
         </TableBody>
       </Table>
     </CardContent>
   </Card>
   ```

4. **Organiser le layout :** sous les widgets, disposer en grille 2 colonnes (desktop) / 1 colonne (mobile) :

   ```jsx
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
     {/* Graphique */}
     {/* Activités récentes */}
   </div>
   <div className="mt-4">
     {/* Tableau des soldes */}
   </div>
   ```

5. **Tester :** vérifier graphique avec barres proportionnelles, activités récentes avec timestamps, tableau des soldes avec couleurs, responsive.

## MOCK DATA NÉCESSAIRE

- Données mensuelles du graphique : hardcodées dans le composant (pas de route API dédiée)
- Activités récentes : hardcodées dans le composant
- Soldes : calculés à partir des finances (simplifié pour le MVP)

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```

---

### PROMPT-3-3

```markdown
# PROMPT-3-3: Story 3.3 — Navigation depuis les widgets

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **colocataire**,
I want **cliquer sur un widget pour aller directement au module correspondant**,
So that **je peux agir rapidement sur ce que je vois dans le dashboard**.

## ACCEPTANCE CRITERIA
**Given** je suis sur le dashboard
**When** je clique sur le widget Tâches
**Then** je suis redirigé vers `/tasks`

**Given** je suis sur le dashboard
**When** je clique sur le widget Finances
**Then** je suis redirigé vers `/finances`

## FICHIERS À CRÉER/MODIFIER
- `client/src/pages/Dashboard.jsx` (modifier — vérifier que onClick navigue)
- `client/src/components/WidgetCard.jsx` (modifier — ajouter cursor-pointer et effet hover)

## ROUTES API CONCERNÉES
Aucune nouvelle route API.

## COMPOSANTS SHADCN/UI À UTILISER
- **Card** — avec classes `cursor-pointer hover:shadow-md transition-shadow`

## DESIGN REFERENCE
Chaque widget doit avoir :
- Cursor pointer au survol
- Ombre plus marquée au hover (`shadow-md`)
- Transition fluide (`transition-shadow duration-200`)
- La totalité de la card est cliquable

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Vérifier `client/src/components/WidgetCard.jsx` :**
   - S'assurer que la prop `onClick` est bien passée à la Card
   - Ajouter les classes Tailwind :
     ```jsx
     <Card
       className="cursor-pointer hover:shadow-md transition-shadow duration-200"
       onClick={onClick}
     >
     ```

2. **Vérifier `client/src/pages/Dashboard.jsx` :**
   - S'assurer que chaque WidgetCard a un `onClick` avec `navigate` :
     ```jsx
     <WidgetCard ... onClick={() => navigate('/finances')} />
     <WidgetCard ... onClick={() => navigate('/tasks')} />
     <WidgetCard ... onClick={() => navigate('/food')} />
     <WidgetCard ... onClick={() => navigate('/subscriptions')} />
     ```

3. **Ajouter le bouton "Nouvelle dépense" dans le header du dashboard :**
   - Au clic, naviguer vers `/finances` (ou ouvrir la modale d'ajout dépense si déjà implémentée)

4. **Tester la navigation :**
   - Cliquer widget Finances → `/finances`
   - Cliquer widget Tâches → `/tasks`
   - Cliquer widget Alimentation → `/food`
   - Cliquer widget Abonnements → `/subscriptions`
   - Vérifier que la sidebar marque bien l'item actif après navigation
   - Tester sur mobile : clic sur widget → navigation + bottom tab active mise à jour

## MOCK DATA NÉCESSAIRE
Aucune donnée mock supplémentaire.

## DEFINITION OF DONE
- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page
```

---

## EPIC 4 : Gestion des Tâches

---

### PROMPT-4-1

```markdown
# PROMPT-4-1: Story 4.1 — Liste des tâches et création

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **colocataire**,
I want **voir les tâches en colonnes (À Faire / Terminées) et en créer de nouvelles**,
So that **je peux organiser les tâches ménagères de la colocation**.

## ACCEPTANCE CRITERIA
**Given** je suis sur `/tasks`
**When** la page se charge
**Then** les tâches s'affichent en colonnes "À Faire" et "Terminées" avec compteurs
**And** chaque card affiche : catégorie, titre, date, assignation

**Given** je clique "NOUVELLE TÂCHE"
**When** je remplis titre, description, statut, assignation, date d'échéance
**Then** la tâche est créée et apparaît dans la colonne appropriée

## FICHIERS À CRÉER/MODIFIER
- `client/src/pages/Tasks.jsx` (nouveau)
- `client/src/App.jsx` (modifier — importer Tasks)

## ROUTES API CONCERNÉES
- `GET /api/tasks` — liste de toutes les tâches
- `POST /api/tasks` — body: `{ titre, description, statut, categorie, dateEcheance, assigneA, recurrence }` → réponse: `{ data: task }`
- `GET /api/users` — pour la liste des membres (assignation)

## COMPOSANTS SHADCN/UI À UTILISER
- **Card, CardHeader, CardContent** — cards tâches
- **Button** — bouton "NOUVELLE TÂCHE"
- **Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle** — modale de création
- **Input** — champs titre, description
- **Label** — labels des champs
- **Select, SelectTrigger, SelectValue, SelectContent, SelectItem** — sélection statut, assignation, catégorie
- **Badge** — catégorie et assignation sur les cards

## DESIGN REFERENCE
**Écran 4 — Gestion des Tâches (ui-design.md) :**
- Header : titre "Tâches de la Colocation" + bouton "add NOUVELLE TÂCHE" (primary `#4799eb`)
- **2 colonnes Kanban :**
  - **À Faire** (compteur : nombre) — fond `#f6f7f8`
  - **Terminées** (compteur : nombre) — fond `#f6f7f8`
- **Card tâche :**
  - Badge catégorie en haut (ex: "Cuisine" en bleu, "Salon" en vert, "Extérieur" en orange)
  - Titre de la tâche en gras
  - Icône `drag_indicator` à gauche (visuel uniquement)
  - Menu `more_horiz` en haut à droite
  - Date avec icône : `calendar_today` + texte date (couleur rouge si en retard, gris sinon)
  - Badge assignation : prénom du membre assigné

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Installer les composants shadcn/ui :**
   ```bash
   cd client && npx shadcn@latest add select dialog
   ```

1. **Créer `client/src/pages/Tasks.jsx` :**

   ```jsx
   // Story 4.1: Liste des tâches et création
   ```

   - Importer useState, useEffect
   - Importer apiGet, apiPost depuis `@/lib/api`
   - Importer Card, Button, Dialog, Input, Label, Select, Badge

2. **Charger les données :**

   ```jsx
   const [tasks, setTasks] = useState([])
   const [users, setUsers] = useState([])
   const [showCreateDialog, setShowCreateDialog] = useState(false)

   useEffect(() => {
     Promise.all([apiGet('/tasks'), apiGet('/users')]).then(([t, u]) => {
       setTasks(t.data)
       setUsers(u.data)
     })
   }, [])
   ```

3. **Séparer les tâches par colonnes :**

   ```jsx
   const todoTasks = tasks.filter(t => t.statut === 'a_faire' || t.statut === 'en_cours')
   const doneTasks = tasks.filter(t => t.statut === 'terminee')
   ```

4. **Rendre le header :**

   ```jsx
   <div className="flex items-center justify-between mb-6">
     <h1 className="text-2xl font-bold text-[#0e141b] font-['Plus_Jakarta_Sans']">
       Tâches de la Colocation
     </h1>
     <Button className="bg-[#4799eb] hover:bg-[#3b82f6]" onClick={() => setShowCreateDialog(true)}>
       <span className="material-symbols-outlined mr-2">add</span>
       NOUVELLE TÂCHE
     </Button>
   </div>
   ```

5. **Rendre les 2 colonnes Kanban :**

   ```jsx
   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
     {/* Colonne À Faire */}
     <div>
       <div className="flex items-center gap-2 mb-4">
         <h2 className="font-semibold text-[#0e141b]">À Faire</h2>
         <Badge variant="secondary">{todoTasks.length}</Badge>
       </div>
       <div className="space-y-3">
         {todoTasks.map(task => (
           <TaskCard key={task.id} task={task} users={users} />
         ))}
       </div>
     </div>
     {/* Colonne Terminées */}
     <div>
       <div className="flex items-center gap-2 mb-4">
         <h2 className="font-semibold text-[#0e141b]">Terminées</h2>
         <Badge variant="secondary">{doneTasks.length}</Badge>
       </div>
       <div className="space-y-3">
         {doneTasks.map(task => (
           <TaskCard key={task.id} task={task} users={users} />
         ))}
       </div>
     </div>
   </div>
   ```

6. **Créer le sous-composant TaskCard (dans le même fichier ou séparé) :**

   ```jsx
   function TaskCard({ task, users }) {
     const assignee = users.find(u => u.id === task.assigneA)
     const categoryColors = {
       'Cuisine': 'bg-blue-100 text-blue-800',
       'Salon': 'bg-green-100 text-green-800',
       'Extérieur': 'bg-orange-100 text-orange-800',
       'Salle de bain': 'bg-purple-100 text-purple-800',
     }
     const isOverdue = new Date(task.dateEcheance) < new Date() && task.statut !== 'terminee'

     return (
       <Card className="bg-white">
         <CardContent className="p-4">
           <div className="flex items-start justify-between">
             <div className="flex items-center gap-2">
               <span className="material-symbols-outlined text-gray-400 text-sm">drag_indicator</span>
               <Badge className={categoryColors[task.categorie] || 'bg-gray-100 text-gray-800'}>
                 {task.categorie}
               </Badge>
             </div>
             <button><span className="material-symbols-outlined text-gray-400">more_horiz</span></button>
           </div>
           <h3 className="font-medium text-[#0e141b] mt-2">{task.titre}</h3>
           <div className="flex items-center justify-between mt-3">
             <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-[#ef4444]' : 'text-[#4e7397]'}`}>
               <span className="material-symbols-outlined text-sm">
                 {task.statut === 'terminee' ? 'check_circle' : isOverdue ? 'event_busy' : 'calendar_today'}
               </span>
               {new Date(task.dateEcheance).toLocaleDateString('fr-FR')}
             </div>
             {assignee && <Badge variant="outline">{assignee.nom.split(' ')[0]}</Badge>}
           </div>
         </CardContent>
       </Card>
     )
   }
   ```

7. **Créer la Dialog de création de tâche :**

   ```jsx
   const [newTask, setNewTask] = useState({ titre: '', description: '', statut: 'a_faire', categorie: 'Cuisine', dateEcheance: '', assigneA: '', recurrence: '' })

   const handleCreateTask = async () => {
     const res = await apiPost('/tasks', newTask)
     setTasks([...tasks, res.data])
     setShowCreateDialog(false)
     setNewTask({ titre: '', description: '', statut: 'a_faire', categorie: 'Cuisine', dateEcheance: '', assigneA: '', recurrence: '' })
   }
   ```

   Dialog avec champs : Titre (Input), Description (Input), Catégorie (Select : Cuisine/Salon/Extérieur/Salle de bain), Statut (Select : a_faire/en_cours), Date d'échéance (Input type date), Assigné à (Select : liste des users), bouton "Créer" (primary).

8. **Tester :** vérifier les 2 colonnes avec compteurs, créer une tâche → elle apparaît dans la colonne "À Faire", responsive.

## MOCK DATA NÉCESSAIRE

Tâches depuis `server/data/mockData.js` (créées dans story 1.3) :

- Sortir les poubelles (Thomas, a_faire, Extérieur)
- Ménage salon (Léa, en_cours, Salon)
- Vaisselle (Marc, terminee, Cuisine)
- Courses (Thomas, a_faire, Extérieur)
- Nettoyer salle de bain (Léa, a_faire, Salle de bain)

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```

---

### PROMPT-4-2

```markdown
# PROMPT-4-2: Story 4.2 — Modification, suppression et changement de statut

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **colocataire**,
I want **modifier, supprimer ou changer le statut d'une tâche**,
So that **je peux maintenir la liste de tâches à jour**.

## ACCEPTANCE CRITERIA
**Given** une tâche existe
**When** je clique modifier et change les champs
**Then** la tâche est mise à jour

**Given** une tâche existe
**When** je clique supprimer et confirme dans la pop-up
**Then** la tâche est supprimée

**Given** une tâche est "À faire"
**When** je change son statut en "Terminée"
**Then** la tâche se déplace dans la colonne "Terminées"

## FICHIERS À CRÉER/MODIFIER
- `client/src/pages/Tasks.jsx` (modifier — ajouter menu contextuel, edit dialog, delete confirm)
- `client/src/components/ConfirmDialog.jsx` (nouveau — composant réutilisable de confirmation)

## ROUTES API CONCERNÉES
- `PUT /api/tasks/:id` — body: `{ ...fieldsToUpdate }` → réponse: `{ data: updatedTask }`
- `DELETE /api/tasks/:id` → réponse: `{ data: { message: "Tâche supprimée" } }`

## COMPOSANTS SHADCN/UI À UTILISER
- **Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter** — modale d'édition
- **DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem** — menu contextuel (more_horiz)
- **Button** — boutons Modifier, Supprimer, Sauvegarder, Annuler
- **Input, Label, Select** — champs du formulaire d'édition

## DESIGN REFERENCE
- Menu contextuel (icône `more_horiz`) avec 3 options :
  - "Modifier" (icône `edit`)
  - "Changer le statut" (icône `swap_horiz`) → sous-menu avec les 3 statuts
  - "Supprimer" (icône `delete`, texte rouge `#ef4444`)
- Dialog de modification : mêmes champs que la création
- Dialog de confirmation de suppression : "Êtes-vous sûr de vouloir supprimer cette tâche ?" + boutons "Annuler" (outline) et "Supprimer" (rouge `#ef4444`)

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Installer le composant DropdownMenu de shadcn/ui :**
   ```bash
   cd client && npx shadcn@latest add dropdown-menu
   ```

1. **Créer `client/src/components/ConfirmDialog.jsx` :**

   ```jsx
   // Story 4.2: Modification, suppression et changement de statut
   import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
   import { Button } from '@/components/ui/button'

   export function ConfirmDialog({ open, onOpenChange, title, description, onConfirm, confirmLabel = 'Confirmer', variant = 'destructive' }) {
     return (
       <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>{title}</DialogTitle>
           </DialogHeader>
           <p className="text-sm text-[#4e7397]">{description}</p>
           <DialogFooter>
             <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
             <Button variant={variant} onClick={onConfirm}>{confirmLabel}</Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
     )
   }
   ```

2. **Modifier le sous-composant TaskCard dans `Tasks.jsx` :**
   - Remplacer le bouton `more_horiz` par un DropdownMenu :

   ```jsx
   <DropdownMenu>
     <DropdownMenuTrigger asChild>
       <button><span className="material-symbols-outlined text-gray-400">more_horiz</span></button>
     </DropdownMenuTrigger>
     <DropdownMenuContent>
       <DropdownMenuItem onClick={() => openEditDialog(task)}>
         <span className="material-symbols-outlined mr-2 text-sm">edit</span> Modifier
       </DropdownMenuItem>
       <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'a_faire')}>À faire</DropdownMenuItem>
       <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'en_cours')}>En cours</DropdownMenuItem>
       <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'terminee')}>Terminée</DropdownMenuItem>
       <DropdownMenuItem className="text-[#ef4444]" onClick={() => openDeleteDialog(task.id)}>
         <span className="material-symbols-outlined mr-2 text-sm">delete</span> Supprimer
       </DropdownMenuItem>
     </DropdownMenuContent>
   </DropdownMenu>
   ```

3. **Ajouter les handlers :**

   ```jsx
   const handleStatusChange = async (taskId, newStatus) => {
     const res = await apiPut(`/tasks/${taskId}`, { statut: newStatus })
     setTasks(tasks.map(t => t.id === taskId ? res.data : t))
   }

   const handleEditTask = async () => {
     const res = await apiPut(`/tasks/${editingTask.id}`, editingTask)
     setTasks(tasks.map(t => t.id === editingTask.id ? res.data : t))
     setEditingTask(null)
   }

   const handleDeleteTask = async () => {
     await apiDelete(`/tasks/${deletingTaskId}`)
     setTasks(tasks.filter(t => t.id !== deletingTaskId))
     setDeletingTaskId(null)
   }
   ```

4. **Ajouter les states pour les modales :**

   ```jsx
   const [editingTask, setEditingTask] = useState(null)
   const [deletingTaskId, setDeletingTaskId] = useState(null)
   ```

5. **Ajouter la Dialog d'édition :** même structure que la création, pré-remplie avec les données de `editingTask`.

6. **Ajouter le ConfirmDialog de suppression :**

   ```jsx
   <ConfirmDialog
     open={!!deletingTaskId}
     onOpenChange={() => setDeletingTaskId(null)}
     title="Supprimer la tâche"
     description="Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible."
     onConfirm={handleDeleteTask}
     confirmLabel="Supprimer"
   />
   ```

7. **Tester :**
   - Modifier une tâche → les champs changent
   - Supprimer une tâche → confirmation → tâche disparaît
   - Changer statut "À faire" → "Terminée" → la tâche se déplace dans la colonne Terminées
   - Responsive

## MOCK DATA NÉCESSAIRE

Mêmes tâches que story 4.1. Les routes PUT et DELETE modifient le tableau `mockData.taches` en mémoire.

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```

---

### PROMPT-4-3

```markdown
# PROMPT-4-3: Story 4.3 — Récurrence, filtres et assignation

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **colocataire**,
I want **définir des tâches récurrentes, filtrer et assigner des tâches**,
So that **les tâches régulières sont automatisées et organisées**.

## ACCEPTANCE CRITERIA
**Given** je crée ou modifie une tâche
**When** je sélectionne une récurrence (quotidienne/hebdo/mensuelle)
**Then** le champ récurrence est sauvegardé sur la tâche

**Given** je suis sur la page tâches
**When** je filtre par statut, assignation ou date
**Then** seules les tâches correspondantes s'affichent

**Given** je suis sur la page tâches
**When** j'assigne une tâche à un autre membre
**Then** le badge assignation de la tâche est mis à jour

## FICHIERS À CRÉER/MODIFIER
- `client/src/pages/Tasks.jsx` (modifier — ajouter filtres, champ récurrence, assignation)

## ROUTES API CONCERNÉES
- `PUT /api/tasks/:id` — pour modifier récurrence et assignation
- `GET /api/tasks` — filtrage côté client

## COMPOSANTS SHADCN/UI À UTILISER
- **Select, SelectTrigger, SelectValue, SelectContent, SelectItem** — filtres et champ récurrence
- **Badge** — afficher la récurrence sur les cards
- **Input** — filtre par date

## DESIGN REFERENCE
**Filtres (au-dessus des colonnes) :**
- 3 selects en ligne :
  - Filtre statut : Tous / À faire / En cours / Terminée
  - Filtre assignation : Tous / Thomas / Léa / Marc
  - Filtre date : Tous / Aujourd'hui / Cette semaine / Ce mois

**Récurrence (dans la Dialog de création/édition) :**
- Select : Aucune / Quotidienne / Hebdomadaire / Mensuelle
- Badge récurrence affiché sur la card : icône `repeat` + label (ex: "Hebdo")
- Couleur badge récurrence : bleu clair `bg-blue-50 text-blue-700`

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Ajouter les states de filtre dans `Tasks.jsx` :**
   ```jsx
   const [filterStatut, setFilterStatut] = useState('tous')
   const [filterAssignee, setFilterAssignee] = useState('tous')
   const [filterDate, setFilterDate] = useState('tous')
   ```

1. **Créer la logique de filtrage :**

   ```jsx
   const filteredTasks = tasks.filter(task => {
     if (filterStatut !== 'tous' && task.statut !== filterStatut) return false
     if (filterAssignee !== 'tous' && task.assigneA !== filterAssignee) return false
     if (filterDate === 'aujourdhui') {
       const today = new Date().toISOString().split('T')[0]
       if (task.dateEcheance !== today) return false
     }
     if (filterDate === 'semaine') {
       const now = new Date()
       const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
       const taskDate = new Date(task.dateEcheance)
       if (taskDate < now || taskDate > weekEnd) return false
     }
     return true
   })
   ```

2. **Rendre les filtres au-dessus des colonnes :**

   ```jsx
   <div className="flex flex-wrap gap-3 mb-4">
     <Select value={filterStatut} onValueChange={setFilterStatut}>
       <SelectTrigger className="w-[150px]"><SelectValue placeholder="Statut" /></SelectTrigger>
       <SelectContent>
         <SelectItem value="tous">Tous les statuts</SelectItem>
         <SelectItem value="a_faire">À faire</SelectItem>
         <SelectItem value="en_cours">En cours</SelectItem>
         <SelectItem value="terminee">Terminée</SelectItem>
       </SelectContent>
     </Select>
     <Select value={filterAssignee} onValueChange={setFilterAssignee}>
       <SelectTrigger className="w-[150px]"><SelectValue placeholder="Assigné à" /></SelectTrigger>
       <SelectContent>
         <SelectItem value="tous">Tous</SelectItem>
         {users.map(u => <SelectItem key={u.id} value={u.id}>{u.nom.split(' ')[0]}</SelectItem>)}
       </SelectContent>
     </Select>
     <Select value={filterDate} onValueChange={setFilterDate}>
       <SelectTrigger className="w-[150px]"><SelectValue placeholder="Date" /></SelectTrigger>
       <SelectContent>
         <SelectItem value="tous">Toutes les dates</SelectItem>
         <SelectItem value="aujourdhui">Aujourd'hui</SelectItem>
         <SelectItem value="semaine">Cette semaine</SelectItem>
         <SelectItem value="mois">Ce mois</SelectItem>
       </SelectContent>
     </Select>
   </div>
   ```

3. **Ajouter le champ récurrence dans les Dialogs de création et édition :**

   ```jsx
   <div>
     <Label>Récurrence</Label>
     <Select value={newTask.recurrence || ''} onValueChange={(v) => setNewTask({...newTask, recurrence: v || null})}>
       <SelectTrigger><SelectValue placeholder="Aucune" /></SelectTrigger>
       <SelectContent>
         <SelectItem value="">Aucune</SelectItem>
         <SelectItem value="quotidienne">Quotidienne</SelectItem>
         <SelectItem value="hebdomadaire">Hebdomadaire</SelectItem>
         <SelectItem value="mensuelle">Mensuelle</SelectItem>
       </SelectContent>
     </Select>
   </div>
   ```

4. **Afficher le badge récurrence sur les TaskCards :**

   ```jsx
   {task.recurrence && (
     <Badge className="bg-blue-50 text-blue-700 text-xs">
       <span className="material-symbols-outlined text-xs mr-1">repeat</span>
       {task.recurrence === 'quotidienne' ? 'Quotidien' : task.recurrence === 'hebdomadaire' ? 'Hebdo' : 'Mensuel'}
     </Badge>
   )}
   ```

5. **Utiliser `filteredTasks` au lieu de `tasks` pour le rendu des colonnes.**

6. **Tester :**
   - Filtrer par statut "À faire" → seules les tâches à faire s'affichent
   - Filtrer par assignation "Léa" → seules les tâches de Léa s'affichent
   - Créer une tâche avec récurrence "hebdomadaire" → badge "Hebdo" visible
   - Modifier l'assignation → badge mis à jour
   - Responsive : filtres empilés sur mobile

## MOCK DATA NÉCESSAIRE

Mêmes tâches que story 4.1 avec champs `recurrence` déjà présents (certaines ont "hebdomadaire" ou "mensuelle", d'autres null).

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```

---

### PROMPT-4-4

```markdown
# PROMPT-4-4: Story 4.4 — Statistiques et bulk action

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **colocataire**,
I want **voir les statistiques par membre et déléguer plusieurs tâches en une fois**,
So that **la répartition du travail est équitable et efficace**.

## ACCEPTANCE CRITERIA
**Given** je suis sur la page tâches
**When** je consulte les statistiques
**Then** l'historique des tâches par membre s'affiche (nombre terminées par personne)

**Given** je sélectionne plusieurs tâches
**When** je choisis "Déléguer" dans le menu bulk action
**Then** toutes les tâches sélectionnées sont réassignées au membre choisi

## FICHIERS À CRÉER/MODIFIER
- `client/src/pages/Tasks.jsx` (modifier — ajouter section stats + bulk action)

## ROUTES API CONCERNÉES
- `GET /api/tasks` — pour calculer les stats
- `PUT /api/tasks/:id` — pour réassigner en boucle (bulk)

## COMPOSANTS SHADCN/UI À UTILISER
- **Card, CardHeader, CardTitle, CardContent** — conteneur des statistiques
- **Checkbox** — sélection multiple de tâches
- **Button** — bouton "Déléguer"
- **Select** — choix du membre pour la délégation
- **Avatar, AvatarFallback** — dans les stats
- **Badge** — compteurs par membre
- **Tabs, TabsList, TabsTrigger, TabsContent** — onglets Kanban / Statistiques

## DESIGN REFERENCE
**Section statistiques :**
- Barres horizontales par membre : nom + avatar + nombre de tâches terminées + barre proportionnelle
- Thomas : 5 tâches terminées (bleu `#4799eb`)
- Léa : 3 tâches terminées
- Marc : 2 tâches terminées

**Bulk action :**
- Checkbox sur chaque card tâche (visible uniquement en mode sélection)
- Barre d'action en haut quand ≥1 tâche sélectionnée : "X sélectionnées" + Select membre + bouton "Déléguer" (primary)

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Installer les composants shadcn/ui :**
   ```bash
   cd client && npx shadcn@latest add checkbox tabs
   ```

1. **Ajouter des onglets Kanban / Statistiques dans `Tasks.jsx` :**

   ```jsx
   <Tabs defaultValue="kanban">
     <TabsList>
       <TabsTrigger value="kanban">Kanban</TabsTrigger>
       <TabsTrigger value="stats">Statistiques</TabsTrigger>
     </TabsList>
     <TabsContent value="kanban">
       {/* Colonnes Kanban existantes */}
     </TabsContent>
     <TabsContent value="stats">
       {/* Section statistiques */}
     </TabsContent>
   </Tabs>
   ```

2. **Créer la section statistiques :**

   ```jsx
   const stats = users.map(user => ({
     ...user,
     completed: tasks.filter(t => t.assigneA === user.id && t.statut === 'terminee').length,
     total: tasks.filter(t => t.assigneA === user.id).length,
   }))
   const maxCompleted = Math.max(...stats.map(s => s.completed), 1)
   ```

   ```jsx
   <Card>
     <CardHeader><CardTitle>Répartition des tâches par membre</CardTitle></CardHeader>
     <CardContent className="space-y-4">
       {stats.map(s => (
         <div key={s.id} className="flex items-center gap-3">
           <Avatar className="h-8 w-8"><AvatarFallback>{s.nom.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
           <div className="flex-1">
             <div className="flex justify-between text-sm mb-1">
               <span>{s.nom.split(' ')[0]}</span>
               <span className="text-[#4e7397]">{s.completed} / {s.total} terminées</span>
             </div>
             <div className="h-2 bg-gray-100 rounded-full">
               <div className="h-2 bg-[#4799eb] rounded-full" style={{ width: `${(s.completed / maxCompleted) * 100}%` }} />
             </div>
           </div>
         </div>
       ))}
     </CardContent>
   </Card>
   ```

3. **Ajouter la sélection multiple (bulk action) :**

   ```jsx
   const [selectedTasks, setSelectedTasks] = useState([])
   const [bulkAssignee, setBulkAssignee] = useState('')

   const toggleTaskSelection = (taskId) => {
     setSelectedTasks(prev =>
       prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
     )
   }
   ```

4. **Ajouter une Checkbox sur chaque TaskCard :**

   ```jsx
   <Checkbox
     checked={selectedTasks.includes(task.id)}
     onCheckedChange={() => toggleTaskSelection(task.id)}
   />
   ```

5. **Afficher la barre de bulk action quand ≥1 sélectionnée :**

   ```jsx
   {selectedTasks.length > 0 && (
     <div className="flex items-center gap-3 p-3 bg-[#eef6fd] rounded-lg mb-4">
       <span className="text-sm font-medium">{selectedTasks.length} sélectionnée(s)</span>
       <Select value={bulkAssignee} onValueChange={setBulkAssignee}>
         <SelectTrigger className="w-[150px]"><SelectValue placeholder="Déléguer à..." /></SelectTrigger>
         <SelectContent>
           {users.map(u => <SelectItem key={u.id} value={u.id}>{u.nom.split(' ')[0]}</SelectItem>)}
         </SelectContent>
       </Select>
       <Button className="bg-[#4799eb] hover:bg-[#3b82f6]" onClick={handleBulkDelegate} disabled={!bulkAssignee}>
         Déléguer
       </Button>
     </div>
   )}
   ```

6. **Handler bulk delegate :**

   ```jsx
   const handleBulkDelegate = async () => {
     const updates = await Promise.all(
       selectedTasks.map(id => apiPut(`/tasks/${id}`, { assigneA: bulkAssignee }))
     )
     setTasks(tasks.map(t => {
       const updated = updates.find(u => u.data.id === t.id)
       return updated ? updated.data : t
     }))
     setSelectedTasks([])
     setBulkAssignee('')
   }
   ```

7. **Tester :**
   - Onglet Statistiques : barres proportionnelles par membre
   - Sélectionner 2 tâches → barre bulk visible → choisir "Marc" → Déléguer → badges mis à jour
   - Responsive

## MOCK DATA NÉCESSAIRE

Mêmes tâches que précédemment. Les stats sont calculées côté client à partir des données.

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```

---

## EPIC 5 : Gestion des Finances

---

### PROMPT-5-1

```markdown
# PROMPT-5-1: Story 5.1 — Vue finances et cards métriques

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **colocataire**,
I want **voir la cagnotte commune, mes dettes et ce qu'on me doit**,
So that **je connais ma situation financière dans la colocation**.

## ACCEPTANCE CRITERIA
**Given** je suis sur `/finances`
**When** la page se charge
**Then** 3 cards s'affichent : Cagnotte Commune (montant + tendance), Mes dettes (montant), On me doit (montant)
**And** un bouton "AJOUTER DÉPENSE" est visible

## FICHIERS À CRÉER/MODIFIER
- `client/src/pages/Finances.jsx` (nouveau)
- `client/src/App.jsx` (modifier — importer Finances)

## ROUTES API CONCERNÉES
- `GET /api/finances` — liste des dépenses
- `GET /api/colocation` — cagnotte commune
- `GET /api/users` — pour calculer les équilibres

## COMPOSANTS SHADCN/UI À UTILISER
- **Card, CardHeader, CardTitle, CardContent** — 3 cards métriques
- **Button** — bouton "AJOUTER DÉPENSE"
- **Badge** — tendance

## DESIGN REFERENCE
**Écran 5 — Gestion des Finances (ui-design.md) :**
- Header : titre "Finances" + boutons "AJOUTER DÉPENSE" (primary `#4799eb`) + icônes `filter_list` et `download`
- **3 Cards métriques en ligne (desktop) / empilées (mobile) :**

| Métrique | Icône | Valeur | Tendance |
|----------|-------|--------|----------|
| Cagnotte Commune | `account_balance` | 250,00 € | `trending_up` +45.00€ ce mois (vert `#22c55e`) |
| Mes dettes | `trending_down` | -12,50 € | texte rouge `#ef4444` |
| On me doit | `trending_up` | 0,00 € | texte `#4e7397` |

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Créer `client/src/pages/Finances.jsx` :**
   ```jsx
   // Story 5.1: Vue finances et cards métriques
   ```

- Importer useState, useEffect, useAuth
- Importer apiGet depuis `@/lib/api`
- Importer Card, CardHeader, CardTitle, CardContent, Button, Badge

1. **Charger les données :**

   ```jsx
   const { user } = useAuth()
   const [finances, setFinances] = useState([])
   const [colocation, setColocation] = useState(null)
   const [users, setUsers] = useState([])

   useEffect(() => {
     Promise.all([apiGet('/finances'), apiGet('/colocation'), apiGet('/users')])
       .then(([f, c, u]) => {
         setFinances(f.data)
         setColocation(c.data)
         setUsers(u.data)
       })
   }, [])
   ```

2. **Calculer l'équilibre financier :**

   ```jsx
   // Formule : equilibre = totalDepenses / nbColocataires per person
   const nbColocs = users.length || 3
   const totalDepenses = finances.reduce((sum, f) => sum + f.montant, 0)
   const partParPersonne = totalDepenses / nbColocs

   // Ce que chaque personne a payé
   const paiements = users.map(u => ({
     ...u,
     totalPaye: finances.filter(f => f.payePar === u.id).reduce((sum, f) => sum + f.montant, 0),
   }))

   // Équilibre = payé - part
   const currentUser = paiements.find(p => p.id === user?.id)
   const balance = currentUser ? currentUser.totalPaye - partParPersonne : 0
   const mesDettes = balance < 0 ? balance : 0
   const onMeDoit = balance > 0 ? balance : 0
   ```

3. **Rendre le header :**

   ```jsx
   <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
     <h1 className="text-2xl font-bold text-[#0e141b] font-['Plus_Jakarta_Sans']">Finances</h1>
     <div className="flex gap-2 mt-4 md:mt-0">
       <Button className="bg-[#4799eb] hover:bg-[#3b82f6]">
         AJOUTER DÉPENSE
       </Button>
       <Button variant="outline" size="icon">
         <span className="material-symbols-outlined">filter_list</span>
       </Button>
       <Button variant="outline" size="icon">
         <span className="material-symbols-outlined">download</span>
       </Button>
     </div>
   </div>
   ```

4. **Rendre les 3 cards métriques :**

   ```jsx
   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
     <Card>
       <CardContent className="pt-6">
         <div className="flex items-center justify-between">
           <span className="text-sm text-[#4e7397]">Cagnotte Commune</span>
           <span className="material-symbols-outlined text-[#4799eb]">account_balance</span>
         </div>
         <p className="text-2xl font-bold text-[#0e141b] mt-2">{colocation?.cagnotteCommune?.toFixed(2)} €</p>
         <div className="flex items-center gap-1 mt-1">
           <span className="material-symbols-outlined text-[#22c55e] text-sm">trending_up</span>
           <span className="text-sm text-[#22c55e]">+45.00€ ce mois</span>
         </div>
       </CardContent>
     </Card>
     <Card>
       <CardContent className="pt-6">
         <div className="flex items-center justify-between">
           <span className="text-sm text-[#4e7397]">Mes dettes</span>
           <span className="material-symbols-outlined text-[#ef4444]">trending_down</span>
         </div>
         <p className="text-2xl font-bold text-[#ef4444] mt-2">{mesDettes.toFixed(2)} €</p>
       </CardContent>
     </Card>
     <Card>
       <CardContent className="pt-6">
         <div className="flex items-center justify-between">
           <span className="text-sm text-[#4e7397]">On me doit</span>
           <span className="material-symbols-outlined text-[#22c55e]">trending_up</span>
         </div>
         <p className="text-2xl font-bold text-[#0e141b] mt-2">{onMeDoit.toFixed(2)} €</p>
       </CardContent>
     </Card>
   </div>
   ```

5. **Tester :** vérifier les 3 cards avec valeurs calculées, responsive 3 colonnes → 1 colonne.

## MOCK DATA NÉCESSAIRE

- `/api/colocation` → cagnotte 250,00€
- `/api/finances` → 24 transactions avec montant et payePar
- `/api/users` → 3 utilisateurs

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```

---

### PROMPT-5-2

```markdown
# PROMPT-5-2: Story 5.2 — CRUD dépenses et tableau

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **colocataire**,
I want **ajouter, modifier et supprimer des dépenses et les voir dans un tableau**,
So that **toutes les dépenses sont suivies et traçables**.

## ACCEPTANCE CRITERIA
**Given** je clique "AJOUTER DÉPENSE"
**When** je remplis titre, montant, date et payeur
**Then** la dépense est ajoutée et le tableau se met à jour

**Given** le tableau de dépenses s'affiche
**When** je consulte les colonnes
**Then** je vois : Date, Payé par, Description, Montant
**And** la pagination affiche "1 à 5 sur X résultats" avec boutons Précédent/Suivant

**Given** une dépense existe
**When** je la modifie ou la supprime (avec confirmation)
**Then** les données et l'équilibre sont recalculés

## FICHIERS À CRÉER/MODIFIER
- `client/src/pages/Finances.jsx` (modifier — ajouter tableau, CRUD, pagination)

## ROUTES API CONCERNÉES
- `POST /api/finances` — body: `{ titre, montant, dateOperation, payePar }` → réponse: `{ data: finance }`
- `PUT /api/finances/:id` — body: `{ ...fields }` → réponse: `{ data: updatedFinance }`
- `DELETE /api/finances/:id` → réponse: `{ data: { message: "Dépense supprimée" } }`

## COMPOSANTS SHADCN/UI À UTILISER
- **Table, TableHeader, TableRow, TableHead, TableBody, TableCell** — tableau des dépenses
- **Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter** — modale ajout/édition
- **Input** — champs titre, montant, date
- **Label** — labels
- **Select** — sélection du payeur
- **Button** — boutons d'action
- **DropdownMenu** — menu contextuel par ligne

## DESIGN REFERENCE
**Écran 5 — Tableau des dépenses récentes (ui-design.md) :**
- Tableau avec colonnes : Date (format "24 Oct 2023"), Payé par (prénom), Description (libellé), Montant (XX,XX €)
- Menu contextuel par ligne : icône `more_vert` → Modifier / Supprimer
- Pagination : "1 à 5 sur 24 résultats" + boutons "Précédent" (outline) / "Suivant" (outline)

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Ajouter la pagination dans `Finances.jsx` :**
   ```jsx
   const [currentPage, setCurrentPage] = useState(1)
   const itemsPerPage = 5
   const totalPages = Math.ceil(finances.length / itemsPerPage)
   const paginatedFinances = finances
     .sort((a, b) => new Date(b.dateOperation) - new Date(a.dateOperation))
     .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
   ```

1. **Rendre le tableau :**

   ```jsx
   <Card>
     <CardHeader><CardTitle>Dépenses récentes</CardTitle></CardHeader>
     <CardContent>
       <Table>
         <TableHeader>
           <TableRow>
             <TableHead>Date</TableHead>
             <TableHead>Payé par</TableHead>
             <TableHead>Description</TableHead>
             <TableHead className="text-right">Montant</TableHead>
             <TableHead></TableHead>
           </TableRow>
         </TableHeader>
         <TableBody>
           {paginatedFinances.map(f => {
             const payeur = users.find(u => u.id === f.payePar)
             return (
               <TableRow key={f.id}>
                 <TableCell>{new Date(f.dateOperation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</TableCell>
                 <TableCell>{payeur?.nom.split(' ')[0]}</TableCell>
                 <TableCell>{f.titre}</TableCell>
                 <TableCell className="text-right font-medium">{f.montant.toFixed(2)} €</TableCell>
                 <TableCell>
                   <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                       <button><span className="material-symbols-outlined">more_vert</span></button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent>
                       <DropdownMenuItem onClick={() => setEditingFinance(f)}>Modifier</DropdownMenuItem>
                       <DropdownMenuItem className="text-[#ef4444]" onClick={() => setDeletingFinanceId(f.id)}>Supprimer</DropdownMenuItem>
                     </DropdownMenuContent>
                   </DropdownMenu>
                 </TableCell>
               </TableRow>
             )
           })}
         </TableBody>
       </Table>
       {/* Pagination */}
       <div className="flex items-center justify-between mt-4">
         <span className="text-sm text-[#4e7397]">
           {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, finances.length)} sur {finances.length} résultats
         </span>
         <div className="flex gap-2">
           <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Précédent</Button>
           <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Suivant</Button>
         </div>
       </div>
     </CardContent>
   </Card>
   ```

2. **Créer la Dialog d'ajout de dépense :**

   ```jsx
   const [showAddDialog, setShowAddDialog] = useState(false)
   const [newFinance, setNewFinance] = useState({ titre: '', montant: '', dateOperation: '', payePar: '' })

   const handleAddFinance = async () => {
     if (!newFinance.titre || !newFinance.montant || parseFloat(newFinance.montant) <= 0) {
       setFormError('Montant invalide (doit être supérieur à 0)')
       return
     }
     const res = await apiPost('/finances', { ...newFinance, montant: parseFloat(newFinance.montant) })
     setFinances([...finances, res.data])
     setShowAddDialog(false)
     setNewFinance({ titre: '', montant: '', dateOperation: '', payePar: '' })
   }
   ```

   Dialog avec : Titre (Input), Montant (Input type number, min 0.01), Date (Input type date), Payé par (Select des users), bouton "Ajouter".

3. **Ajouter la Dialog d'édition et le ConfirmDialog de suppression** (réutiliser ConfirmDialog de story 4.2).

4. **Relier le bouton "AJOUTER DÉPENSE" du header à `setShowAddDialog(true)`.**

5. **Tester :**
   - Ajouter une dépense → apparaît dans le tableau
   - Pagination : 5 par page, boutons Précédent/Suivant
   - Modifier une dépense → valeurs mises à jour
   - Supprimer → confirmation → disparaît
   - Montant 0 ou négatif → message d'erreur
   - Responsive : tableau scrollable horizontalement sur mobile

## MOCK DATA NÉCESSAIRE

24 transactions financières dans `mockData.finances` avec des montants entre 10€ et 80€, des dates sur le mois de mars 2026, et des payeurs variés (Thomas, Léa, Marc).

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```

---

### PROMPT-5-3

```markdown
# PROMPT-5-3: Story 5.3 — Calcul d'équilibre et graphique

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **colocataire**,
I want **que l'équilibre financier soit calculé automatiquement et voir un graphique récapitulatif**,
So that **chacun sait qui doit quoi à qui**.

## ACCEPTANCE CRITERIA
**Given** une dépense de 50€ est ajoutée par Jopad (3 colocataires)
**When** l'équilibre est recalculé
**Then** Yohan doit 16.67€ à Jopad et Luis-Manuel doit 16.67€ à Jopad

**Given** je suis sur la page finances
**When** je consulte le graphique
**Then** un graphique récapitulatif des dépenses mensuelles s'affiche

## FICHIERS À CRÉER/MODIFIER
- `client/src/pages/Finances.jsx` (modifier — ajouter section équilibre + graphique)

## ROUTES API CONCERNÉES
- `GET /api/finances` — pour calculer les équilibres
- `GET /api/users` — pour les noms des colocataires

## COMPOSANTS SHADCN/UI À UTILISER
- **Card, CardHeader, CardTitle, CardContent** — conteneurs
- **Table, TableHeader, TableRow, TableHead, TableBody, TableCell** — tableau "qui doit quoi à qui"
- **Avatar, AvatarFallback** — avatars dans le tableau
- **Badge** — statuts dettes/crédits

## DESIGN REFERENCE
**Section équilibre (sous le tableau des dépenses) :**
- Titre : "Qui doit quoi à qui ?"
- Tableau : Débiteur → Montant → Créditeur
- Ex : Léa → 12,50 € → Thomas
- Ex : Marc → 13,00 € → Thomas

**Graphique dépenses mensuelles :**
- Barres verticales par mois (même style que dashboard)
- 6 derniers mois avec montants totaux
- Couleur barres : `#4799eb`

**Formule d'équilibre :**
```

equilibre = totalDepenses / nbColocataires (part par personne)
Pour chaque colocataire : balance = totalPayé - partParPersonne
Si balance > 0 → on lui doit de l'argent (créditeur)
Si balance < 0 → il doit de l'argent (débiteur)
Transferts optimisés : chaque débiteur rembourse les créditeurs proportionnellement

```

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Ajouter le calcul d'équilibre détaillé dans `Finances.jsx` :**
   ```jsx
   // Formule : equilibre = totalDepenses / nbColocataires per person
   const calculateBalances = () => {
     const nbColocs = users.length
     const totalDepenses = finances.reduce((sum, f) => sum + f.montant, 0)
     const partParPersonne = totalDepenses / nbColocs

     const balances = users.map(u => ({
       ...u,
       totalPaye: finances.filter(f => f.payePar === u.id).reduce((sum, f) => sum + f.montant, 0),
       balance: 0,
     }))
     balances.forEach(b => { b.balance = b.totalPaye - partParPersonne })

     // Calculer les transferts (qui doit quoi à qui)
     const debiteurs = balances.filter(b => b.balance < 0).map(b => ({ ...b, dette: Math.abs(b.balance) }))
     const crediteurs = balances.filter(b => b.balance > 0).map(b => ({ ...b, credit: b.balance }))

     const transferts = []
     debiteurs.forEach(d => {
       let resteDu = d.dette
       crediteurs.forEach(c => {
         if (resteDu > 0 && c.credit > 0) {
           const montant = Math.min(resteDu, c.credit)
           transferts.push({ de: d.nom, a: c.nom, montant: Math.round(montant * 100) / 100 })
           resteDu -= montant
           c.credit -= montant
         }
       })
     })
     return transferts
   }
   ```

1. **Rendre le tableau "Qui doit quoi à qui ?" :**

   ```jsx
   <Card className="mt-6">
     <CardHeader><CardTitle>Qui doit quoi à qui ?</CardTitle></CardHeader>
     <CardContent>
       {transferts.length === 0 ? (
         <p className="text-[#4e7397] text-sm">Tout le monde est à jour !</p>
       ) : (
         <Table>
           <TableHeader>
             <TableRow>
               <TableHead>Débiteur</TableHead>
               <TableHead className="text-center">Montant</TableHead>
               <TableHead className="text-right">Créditeur</TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             {transferts.map((t, i) => (
               <TableRow key={i}>
                 <TableCell className="flex items-center gap-2">
                   <Avatar className="h-6 w-6"><AvatarFallback className="text-xs">{t.de.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                   {t.de.split(' ')[0]}
                 </TableCell>
                 <TableCell className="text-center font-medium text-[#ef4444]">{t.montant.toFixed(2)} €</TableCell>
                 <TableCell className="text-right flex items-center justify-end gap-2">
                   {t.a.split(' ')[0]}
                   <Avatar className="h-6 w-6"><AvatarFallback className="text-xs">{t.a.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                 </TableCell>
               </TableRow>
             ))}
           </TableBody>
         </Table>
       )}
     </CardContent>
   </Card>
   ```

2. **Ajouter le graphique des dépenses mensuelles :**

   ```jsx
   const monthlyData = [
     { month: 'Oct', amount: 450 },
     { month: 'Nov', amount: 380 },
     { month: 'Déc', amount: 520 },
     { month: 'Jan', amount: 410 },
     { month: 'Fév', amount: 490 },
     { month: 'Mar', amount: 350 },
   ]
   const maxAmount = Math.max(...monthlyData.map(d => d.amount))
   ```

   Même pattern de barres Tailwind que dans le dashboard (story 3.2).

3. **Organiser le layout :**

   ```jsx
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
     {/* Graphique */}
     {/* Qui doit quoi */}
   </div>
   ```

4. **S'assurer que l'ajout/suppression/modification de dépense recalcule les équilibres :** appeler `calculateBalances()` après chaque mutation.

5. **Tester :**
   - Vérifier que Thomas (qui a payé le plus) est créditeur
   - Ajouter une dépense de 50€ par Thomas → Léa et Marc doivent 16.67€ chacun
   - Graphique avec barres proportionnelles
   - Responsive

## MOCK DATA NÉCESSAIRE

Mêmes données financières que précédemment. Les transferts sont calculés dynamiquement côté client.

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```

---

## EPIC 6 : Alimentation & Recettes

---

### PROMPT-6-1

```markdown
# PROMPT-6-1: Story 6.1 — Menu du jour et recettes

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **colocataire**,
I want **consulter le menu du jour avec des suggestions et rechercher des recettes**,
So that **je trouve facilement quoi cuisiner**.

## ACCEPTANCE CRITERIA
**Given** je suis sur `/food`
**When** la page se charge
**Then** des recettes suggérées depuis le catalogue mocké s'affichent en cards (nom, durée, portions, icône favori)

**Given** je suis sur la page alimentation
**When** je tape dans la barre de recherche
**Then** les recettes se filtrent dynamiquement par ingrédient, catégorie ou nom

## FICHIERS À CRÉER/MODIFIER
- `client/src/pages/Food.jsx` (nouveau)
- `client/src/App.jsx` (modifier — importer Food)

## ROUTES API CONCERNÉES
- `GET /api/recipes` — liste de toutes les recettes
- `GET /api/shopping-list` — liste de courses

## COMPOSANTS SHADCN/UI À UTILISER
- **Card, CardHeader, CardContent, CardFooter** — cards recettes
- **Input** — barre de recherche
- **Button** — bouton "Proposer une recette"
- **Badge** — catégorie, durée, portions
- **Tabs, TabsList, TabsTrigger, TabsContent** — onglets Recettes / Liste de courses

## DESIGN REFERENCE
**Écran 6 — Alimentation (ui-design.md), section Recettes :**
- Titre : "Recettes Partagées"
- Cards recette (grille 2×2 desktop, 1 colonne mobile) :
  - Image placeholder (rectangle gris avec icône `restaurant`)
  - Nom du plat en gras
  - `schedule` Durée (ex: "20 min") — texte `#4e7397`
  - `person` Portions (ex: "4 portions") — texte `#4e7397`
  - Icône `favorite` (coeur pour favoris) — rouge `#ef4444` si favori, gris sinon
- Recettes mockées :
  - Pâtes Carbonara (20min, 4 portions)
  - Quiche Lorraine (45min, 6 portions)
  - Salade César (15min, 2 portions)
  - Pancakes du Dimanche (30min, 4 portions)
- Bouton : "Proposer une recette" (+ icône `restaurant_menu`)
- Barre de recherche avec icône `search` et placeholder "Rechercher une recette..."

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Créer `client/src/pages/Food.jsx` :**
   ```jsx
   // Story 6.1: Menu du jour et recettes
   ```

- Importer useState, useEffect
- Importer apiGet depuis `@/lib/api`
- Importer Card, Input, Button, Badge, Tabs, TabsList, TabsTrigger, TabsContent

1. **Charger les données :**

   ```jsx
   const [recipes, setRecipes] = useState([])
   const [shoppingList, setShoppingList] = useState([])
   const [searchQuery, setSearchQuery] = useState('')

   useEffect(() => {
     Promise.all([apiGet('/recipes'), apiGet('/shopping-list')])
       .then(([r, s]) => {
         setRecipes(r.data)
         setShoppingList(s.data)
       })
   }, [])
   ```

2. **Filtrer les recettes dynamiquement :**

   ```jsx
   const filteredRecipes = recipes.filter(r => {
     const query = searchQuery.toLowerCase()
     return r.nomPlat.toLowerCase().includes(query)
       || r.categorie.toLowerCase().includes(query)
       || r.ingredients.some(i => i.toLowerCase().includes(query))
   })
   ```

3. **Rendre la structure avec Tabs :**

   ```jsx
   <Tabs defaultValue="recettes">
     <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
       <h1 className="text-2xl font-bold text-[#0e141b] font-['Plus_Jakarta_Sans']">Alimentation</h1>
       <TabsList>
         <TabsTrigger value="recettes">Recettes</TabsTrigger>
         <TabsTrigger value="courses">Liste de courses</TabsTrigger>
       </TabsList>
     </div>
     <TabsContent value="recettes">
       {/* Barre de recherche + grille de recettes */}
     </TabsContent>
     <TabsContent value="courses">
       {/* Liste de courses — sera complétée dans story 6.3 */}
     </TabsContent>
   </Tabs>
   ```

4. **Rendre la barre de recherche :**

   ```jsx
   <div className="relative mb-6">
     <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
     <Input
       className="pl-10"
       placeholder="Rechercher une recette par nom, catégorie ou ingrédient..."
       value={searchQuery}
       onChange={(e) => setSearchQuery(e.target.value)}
     />
   </div>
   ```

5. **Rendre la grille de recettes :**

   ```jsx
   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
     {filteredRecipes.map(recipe => (
       <Card key={recipe.id}>
         {/* Image placeholder */}
         <div className="h-40 bg-gray-100 rounded-t-lg flex items-center justify-center">
           <span className="material-symbols-outlined text-4xl text-gray-400">restaurant</span>
         </div>
         <CardContent className="p-4">
           <div className="flex items-center justify-between">
             <h3 className="font-semibold text-[#0e141b]">{recipe.nomPlat}</h3>
             <button onClick={() => toggleFavorite(recipe.id)}>
               <span className={`material-symbols-outlined ${recipe.estFavori ? 'text-[#ef4444]' : 'text-gray-400'}`}
                 style={{ fontVariationSettings: recipe.estFavori ? "'FILL' 1" : "'FILL' 0" }}>
                 favorite
               </span>
             </button>
           </div>
           <div className="flex items-center gap-4 mt-2 text-sm text-[#4e7397]">
             <span className="flex items-center gap-1">
               <span className="material-symbols-outlined text-sm">schedule</span>
               {recipe.tempsPreparation} min
             </span>
             <span className="flex items-center gap-1">
               <span className="material-symbols-outlined text-sm">person</span>
               {recipe.portions} portions
             </span>
           </div>
           <Badge className="mt-2 bg-gray-100 text-gray-800">{recipe.categorie}</Badge>
         </CardContent>
       </Card>
     ))}
   </div>
   ```

6. **Ajouter le bouton "Proposer une recette" :**

   ```jsx
   <Button className="mt-4 bg-[#4799eb] hover:bg-[#3b82f6]">
     <span className="material-symbols-outlined mr-2">restaurant_menu</span>
     Proposer une recette
   </Button>
   ```

7. **Tester :**
   - 4 recettes s'affichent au chargement
   - Taper "carbonara" → seule Pâtes Carbonara visible
   - Taper "oeufs" → Carbonara, Quiche, Pancakes (contiennent oeufs)
   - Taper "pâtes" → Carbonara (catégorie Pâtes) + résultats par ingrédient
   - Coeur cliquable (toggle favori)
   - Responsive : 2 colonnes → 1 colonne

## MOCK DATA NÉCESSAIRE

Recettes depuis `server/data/mockData.js` :

- Pâtes Carbonara : 20min, 4 portions, catégorie Pâtes, ingrédients [pâtes, crème, lardons, parmesan, oeufs], favori: false
- Quiche Lorraine : 45min, 6 portions, catégorie Tartes, ingrédients [pâte brisée, lardons, crème, oeufs, gruyère], favori: true
- Salade César : 15min, 2 portions, catégorie Salades, ingrédients [salade, poulet, croutons, parmesan, sauce César], favori: false
- Pancakes du Dimanche : 30min, 4 portions, catégorie Petit-déjeuner, ingrédients [farine, oeufs, lait, beurre, sucre], favori: true

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```

---

### PROMPT-6-2

```markdown
# PROMPT-6-2: Story 6.2 — CRUD recettes et favoris

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **colocataire**,
I want **créer, modifier, supprimer des recettes et les ajouter en favoris**,
So that **la colocation a ses propres recettes partagées**.

## ACCEPTANCE CRITERIA
**Given** je clique "Proposer une recette"
**When** je remplis nom, ingrédients, temps de préparation, contraintes
**Then** la recette est créée et apparaît dans la liste

**Given** une recette existe
**When** je clique sur l'icône coeur
**Then** la recette est ajoutée à mes favoris (icône remplie)

**Given** une recette existe
**When** je la modifie ou la supprime
**Then** les changements sont appliqués

## FICHIERS À CRÉER/MODIFIER
- `client/src/pages/Food.jsx` (modifier — ajouter Dialog création/édition, toggle favori, suppression)
- `server/index.js` (modifier — ajouter PUT /api/recipes/:id et DELETE /api/recipes/:id)

## ROUTES API CONCERNÉES
- `POST /api/recipes` — body: `{ nomPlat, tempsPreparation, portions, categorie, ingredients, contraintesDiets }` → réponse: `{ data: recipe }`
- `PUT /api/recipes/:id` — body: `{ ...fields }` → réponse: `{ data: updatedRecipe }`
- `DELETE /api/recipes/:id` → réponse: `{ data: { message: "Recette supprimée" } }`

## COMPOSANTS SHADCN/UI À UTILISER
- **Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter** — modale création/édition
- **Input** — champs nom, temps, portions, ingrédients
- **Label** — labels
- **Select** — catégorie, contraintes
- **Button** — actions
- **Textarea** — ingrédients (un par ligne)

## DESIGN REFERENCE
**Dialog "Proposer une recette" :**
- Titre : "Nouvelle recette"
- Champs :
  - Nom du plat (Input)
  - Temps de préparation en minutes (Input type number)
  - Nombre de portions (Input type number)
  - Catégorie (Select : Pâtes / Tartes / Salades / Petit-déjeuner / Plats / Desserts)
  - Ingrédients (Textarea, un par ligne)
  - Contraintes alimentaires (Select multiple ou checkboxes : Végétarien / Végan / Sans gluten / Sans lactose)
- Bouton : "Ajouter la recette" (primary `#4799eb`)

**Toggle favori :**
- Coeur vide (outline) : `material-symbols-outlined` avec `FILL: 0`, couleur grise
- Coeur plein : `FILL: 1`, couleur rouge `#ef4444`

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Installer le composant Textarea de shadcn/ui :**
   ```bash
   cd client && npx shadcn@latest add textarea
   ```

1. **Ajouter les routes manquantes dans `server/index.js` :**

   ```js
   app.put('/api/recipes/:id', (req, res) => {
     const idx = mockData.recettes.findIndex(r => r.id === req.params.id)
     if (idx === -1) return res.status(404).json({ error: 'Recette non trouvée' })
     mockData.recettes[idx] = { ...mockData.recettes[idx], ...req.body }
     res.json({ data: mockData.recettes[idx] })
   })

   app.delete('/api/recipes/:id', (req, res) => {
     mockData.recettes = mockData.recettes.filter(r => r.id !== req.params.id)
     res.json({ data: { message: 'Recette supprimée' } })
   })
   ```

2. **Ajouter le state et Dialog de création dans `Food.jsx` :**

   ```jsx
   const [showRecipeDialog, setShowRecipeDialog] = useState(false)
   const [newRecipe, setNewRecipe] = useState({
     nomPlat: '', tempsPreparation: '', portions: '', categorie: 'Pâtes',
     ingredients: '', contraintesDiets: [],
   })
   ```

3. **Créer la Dialog :**
   - Champ Nom : `<Input value={newRecipe.nomPlat} onChange={...} />`
   - Champ Temps : `<Input type="number" min="1" value={newRecipe.tempsPreparation} />`
   - Champ Portions : `<Input type="number" min="1" value={newRecipe.portions} />`
   - Catégorie : `<Select>` avec les options
   - Ingrédients : `<Textarea placeholder="Un ingrédient par ligne" />`
   - Contraintes : checkboxes ou multi-select

4. **Handler de création :**

   ```jsx
   const handleCreateRecipe = async () => {
     const ingredients = newRecipe.ingredients.split('\n').filter(i => i.trim())
     const res = await apiPost('/recipes', {
       ...newRecipe,
       tempsPreparation: parseInt(newRecipe.tempsPreparation),
       portions: parseInt(newRecipe.portions),
       ingredients,
       estFavori: false,
     })
     setRecipes([...recipes, res.data])
     setShowRecipeDialog(false)
   }
   ```

5. **Handler toggle favori :**

   ```jsx
   const toggleFavorite = async (recipeId) => {
     const recipe = recipes.find(r => r.id === recipeId)
     const res = await apiPut(`/recipes/${recipeId}`, { estFavori: !recipe.estFavori })
     setRecipes(recipes.map(r => r.id === recipeId ? res.data : r))
   }
   ```

6. **Ajouter un menu contextuel sur chaque card recette** avec Modifier / Supprimer (comme pour les tâches).

7. **Relier le bouton "Proposer une recette" à `setShowRecipeDialog(true)`.**

8. **Tester :**
   - Créer une recette → apparaît dans la grille
   - Cliquer coeur → passe en rouge (favori)
   - Cliquer coeur à nouveau → repasse en gris
   - Modifier une recette → valeurs mises à jour
   - Supprimer → confirmation → disparaît
   - Responsive

## MOCK DATA NÉCESSAIRE

Mêmes recettes que story 6.1. Les routes PUT et DELETE modifient `mockData.recettes` en mémoire.

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```

---

### PROMPT-6-3

```markdown
# PROMPT-6-3: Story 6.3 — Liste de courses et contraintes alimentaires

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **colocataire**,
I want **gérer la liste de courses et définir mes contraintes alimentaires**,
So that **on sait ce qu'il faut acheter et ce que chacun peut manger**.

## ACCEPTANCE CRITERIA
**Given** je suis sur la section liste de courses
**When** j'ajoute un article via la barre de recherche + bouton "Ajouter"
**Then** l'article apparaît dans la liste, classé par catégorie

**Given** un article est dans la liste
**When** je le coche
**Then** il est marqué comme acheté (barré visuellement)

**Given** je suis dans mes paramètres alimentaires
**When** je définis mes contraintes (allergies, régimes)
**Then** mes contraintes sont sauvegardées

## FICHIERS À CRÉER/MODIFIER
- `client/src/pages/Food.jsx` (modifier — compléter l'onglet Liste de courses + section contraintes)

## ROUTES API CONCERNÉES
- `GET /api/shopping-list` — liste de courses
- `POST /api/shopping-list` — body: `{ nomArticle, categorie }` → réponse: `{ data: article }`
- `PUT /api/shopping-list/:id` — body: `{ estAchete: true/false }` → réponse: `{ data: updatedArticle }`
- `DELETE /api/shopping-list/:id` → réponse: `{ data: { message: "Article supprimé" } }`

## COMPOSANTS SHADCN/UI À UTILISER
- **Checkbox** — cocher les articles achetés
- **Input** — barre d'ajout d'article
- **Button** — bouton "Ajouter"
- **Badge** — catégorie d'article, personne assignée
- **Select** — catégorie pour nouvel article, contraintes alimentaires
- **Card, CardHeader, CardContent** — sections

## DESIGN REFERENCE
**Écran 6 — Liste de courses (ui-design.md) :**
- Titre : "Liste de courses" + compteur (12 articles)
- Barre d'ajout : Input "Ajouter un article..." + Select catégorie + bouton "Ajouter"
- Articles groupés par catégorie :
  - **Produits laitiers** : Lait, Beurre, Crème fraîche
  - **Boulangerie** : Pain, Croissants
  - **Frais** : Poulet, Tomates
  - **Épicerie** : Pâtes, Riz
  - **Hygiène** : Savon, Dentifrice
  - **Ménage** : Éponges
- Chaque article : Checkbox + nom (barré si acheté avec `line-through text-gray-400`) + badge personne
- Icônes : `check_circle` (acheté, vert `#22c55e`), `shopping_cart` (non acheté)

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Compléter le TabsContent "courses" dans `Food.jsx` :**

2. **Grouper les articles par catégorie :**
   ```jsx
   const groupedItems = shoppingList.reduce((groups, item) => {
     const cat = item.categorie
     if (!groups[cat]) groups[cat] = []
     groups[cat].push(item)
     return groups
   }, {})
   ```

1. **Rendre la barre d'ajout :**

   ```jsx
   const [newArticle, setNewArticle] = useState('')
   const [newCategorie, setNewCategorie] = useState('Épicerie')
   const categories = ['Produits laitiers', 'Boulangerie', 'Frais', 'Épicerie', 'Hygiène', 'Ménage']

   const handleAddArticle = async () => {
     if (!newArticle.trim()) return
     const res = await apiPost('/shopping-list', { nomArticle: newArticle, categorie: newCategorie })
     setShoppingList([...shoppingList, res.data])
     setNewArticle('')
   }
   ```

   ```jsx
   <div className="flex gap-2 mb-6">
     <Input placeholder="Ajouter un article..." value={newArticle}
       onChange={(e) => setNewArticle(e.target.value)}
       onKeyDown={(e) => e.key === 'Enter' && handleAddArticle()} />
     <Select value={newCategorie} onValueChange={setNewCategorie}>
       <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
       <SelectContent>
         {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
       </SelectContent>
     </Select>
     <Button className="bg-[#4799eb] hover:bg-[#3b82f6]" onClick={handleAddArticle}>Ajouter</Button>
   </div>
   ```

2. **Rendre les articles groupés par catégorie :**

   ```jsx
   const nonAchetes = shoppingList.filter(a => !a.estAchete).length
   ```

   ```jsx
   <h2 className="text-lg font-semibold mb-4">
     Liste de courses <Badge variant="secondary">{nonAchetes} articles</Badge>
   </h2>
   {Object.entries(groupedItems).map(([categorie, items]) => (
     <div key={categorie} className="mb-4">
       <h3 className="text-sm font-medium text-[#4e7397] uppercase mb-2">{categorie}</h3>
       <div className="space-y-2">
         {items.map(item => (
           <div key={item.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
             <Checkbox
               checked={item.estAchete}
               onCheckedChange={() => handleToggleArticle(item.id, !item.estAchete)}
             />
             <span className={item.estAchete ? 'line-through text-gray-400' : 'text-[#0e141b]'}>
               {item.nomArticle}
             </span>
             {item.estAchete && <span className="material-symbols-outlined text-[#22c55e] text-sm">check_circle</span>}
           </div>
         ))}
       </div>
     </div>
   ))}
   ```

3. **Handler toggle acheté :**

   ```jsx
   const handleToggleArticle = async (id, estAchete) => {
     const res = await apiPut(`/shopping-list/${id}`, { estAchete })
     setShoppingList(shoppingList.map(a => a.id === id ? res.data : a))
   }
   ```

4. **Ajouter la section contraintes alimentaires (simple) :**

   ```jsx
   <Card className="mt-6">
     <CardHeader><CardTitle>Mes contraintes alimentaires</CardTitle></CardHeader>
     <CardContent>
       <div className="space-y-2">
         {['Végétarien', 'Végan', 'Sans gluten', 'Sans lactose', 'Halal'].map(c => (
           <div key={c} className="flex items-center gap-2">
             <Checkbox id={c} />
             <Label htmlFor={c}>{c}</Label>
           </div>
         ))}
       </div>
       <Button className="mt-4 bg-[#4799eb] hover:bg-[#3b82f6]">Sauvegarder</Button>
     </CardContent>
   </Card>
   ```

5. **Ajouter la route DELETE pour les articles dans le serveur** (si pas déjà fait).

6. **Tester :**
   - Ajouter "Fromage" dans catégorie "Produits laitiers" → apparaît dans le groupe
   - Cocher "Lait" → texte barré + icône check verte
   - Décocher → retour normal
   - Contraintes : cocher/décocher fonctionne
   - Responsive

## MOCK DATA NÉCESSAIRE

12 articles de courses depuis `server/data/mockData.js` (créés dans story 1.3), groupés par catégorie.

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```

---

## EPIC 7 : Gestion des Abonnements

---

### PROMPT-7-1

```markdown
# PROMPT-7-1: Story 7.1 — Liste des abonnements

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **colocataire**,
I want **voir la liste des abonnements partagés avec le coût mensuel total**,
So that **je sais combien coûtent nos abonnements et quand ils sont prélevés**.

## ACCEPTANCE CRITERIA
**Given** je suis sur `/subscriptions`
**When** la page se charge
**Then** les abonnements s'affichent en cards avec : logo/icône, nom, type (badge), prix/mois, date prochain prélèvement, bouton "Modifier"
**And** le coût mensuel total s'affiche en haut

## FICHIERS À CRÉER/MODIFIER
- `client/src/pages/Subscriptions.jsx` (nouveau)
- `client/src/App.jsx` (modifier — importer Subscriptions)

## ROUTES API CONCERNÉES
- `GET /api/subscriptions` — liste des abonnements

## COMPOSANTS SHADCN/UI À UTILISER
- **Card, CardHeader, CardTitle, CardContent, CardFooter** — cards abonnement
- **Badge** — type d'abonnement (PREMIUM, FIBRE, FAMILLE, ANNUEL, FIXE)
- **Button** — boutons "AJOUTER ABONNEMENT", "Modifier"

## DESIGN REFERENCE
**Écran 7 — Abonnements (ui-design.md) :**
- Header : titre "Abonnements" + sous-titre "Gérez les services partagés de la colocation"
- Bouton : "AJOUTER ABONNEMENT" (primary `#4799eb`)
- Résumé : "Coût Mensuel Total: **145,50 €**"

- **Cards abonnement (grille responsive) :**

| Service | Icône | Type | Prix/mois | Prochain prélèvement |
|---------|-------|------|-----------|---------------------|
| Netflix | `movie` | PREMIUM | 17,99 € | 12 Oct |
| Internet (Orange) | `router` | FIBRE | 39,99 € | 01 Oct |
| Spotify Family | `audiotrack` | FAMILLE | 15,99 € | 22 Oct |
| Disney+ | `stars` | ANNUEL | 8,99 € | 05 Nov |
| Électricité (EDF) | `bolt` | FIXE | 62,54 € | 15 Oct |

- Chaque card :
  - Icône du service (Material Symbols, taille 32px, couleur `#4799eb`)
  - Nom du service en gras
  - Badge type (couleur secondaire)
  - Prix/mois en gras
  - `calendar_today` + date prochain prélèvement en texte `#4e7397`
  - Bouton "Modifier" (variant outline)

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Créer `client/src/pages/Subscriptions.jsx` :**
   ```jsx
   // Story 7.1: Liste des abonnements
   ```

- Importer useState, useEffect
- Importer apiGet depuis `@/lib/api`
- Importer Card, CardContent, Button, Badge

1. **Charger les données :**

   ```jsx
   const [subscriptions, setSubscriptions] = useState([])

   useEffect(() => {
     apiGet('/subscriptions').then(res => setSubscriptions(res.data))
   }, [])
   ```

2. **Calculer le coût mensuel total :**

   ```jsx
   const totalCost = subscriptions.reduce((sum, s) => sum + s.coutMensuel, 0)
   ```

3. **Rendre le header :**

   ```jsx
   <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
     <div>
       <h1 className="text-2xl font-bold text-[#0e141b] font-['Plus_Jakarta_Sans']">Abonnements</h1>
       <p className="text-[#4e7397]">Gérez les services partagés de la colocation</p>
     </div>
     <Button className="mt-4 md:mt-0 bg-[#4799eb] hover:bg-[#3b82f6]">
       AJOUTER ABONNEMENT
     </Button>
   </div>
   <div className="mb-6">
     <p className="text-[#4e7397]">Coût Mensuel Total: <span className="font-bold text-[#0e141b] text-xl">{totalCost.toFixed(2)} €</span></p>
   </div>
   ```

4. **Rendre les cards abonnement :**

   ```jsx
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
     {subscriptions.map(sub => (
       <Card key={sub.id}>
         <CardContent className="p-6">
           <div className="flex items-start justify-between">
             <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-lg bg-[#eef6fd] flex items-center justify-center">
                 <span className="material-symbols-outlined text-[#4799eb]">{sub.icone}</span>
               </div>
               <div>
                 <h3 className="font-semibold text-[#0e141b]">{sub.nomService}</h3>
                 <Badge variant="secondary">{sub.type}</Badge>
               </div>
             </div>
           </div>
           <div className="mt-4">
             <p className="text-xl font-bold text-[#0e141b]">{sub.coutMensuel.toFixed(2)} €<span className="text-sm font-normal text-[#4e7397]">/mois</span></p>
           </div>
           <div className="flex items-center gap-1 mt-2 text-sm text-[#4e7397]">
             <span className="material-symbols-outlined text-sm">calendar_today</span>
             Prochain prélèvement : {new Date(sub.datePrelevement).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
           </div>
           {sub.placesTotal && (
             <div className="flex items-center gap-1 mt-1 text-sm text-[#4e7397]">
               <span className="material-symbols-outlined text-sm">group</span>
               {sub.placesUtilisees}/{sub.placesTotal} places
             </div>
           )}
           <Button variant="outline" className="w-full mt-4" onClick={() => openEditDialog(sub)}>
             Modifier
           </Button>
         </CardContent>
       </Card>
     ))}
   </div>
   ```

5. **Ajouter le bouton "Nouvel abonnement" en bas :**

   ```jsx
   <div className="mt-6 flex justify-center">
     <Button variant="outline" className="text-[#4799eb]">
       <span className="material-symbols-outlined mr-2">add_circle</span>
       Nouvel abonnement
     </Button>
   </div>
   ```

6. **Tester :** 5 cards avec icônes, noms, types, prix, dates, places. Coût total = 145,50€. Responsive : 3 → 2 → 1 colonne.

## MOCK DATA NÉCESSAIRE

5 abonnements depuis `server/data/mockData.js` (créés dans story 1.3) avec icônes, types, prix, dates et places.

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```

---

### PROMPT-7-2

```markdown
# PROMPT-7-2: Story 7.2 — CRUD abonnements et détails

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **colocataire**,
I want **ajouter, modifier et supprimer des abonnements, voir les places disponibles et les identifiants**,
So that **les abonnements de la colocation sont bien gérés**.

## ACCEPTANCE CRITERIA
**Given** je clique "AJOUTER ABONNEMENT"
**When** je remplis nom du service, prix, date de prélèvement
**Then** l'abonnement est ajouté et le coût total est recalculé

**Given** un abonnement existe
**When** je clique "Modifier"
**Then** je peux modifier ses informations ou le supprimer

**Given** un abonnement a des places limitées
**When** je consulte la card
**Then** le nombre de places disponibles s'affiche (ex: 3/4)

**Given** un abonnement a des identifiants partagés
**When** je consulte les détails
**Then** les identifiants de connexion sont visibles

## FICHIERS À CRÉER/MODIFIER
- `client/src/pages/Subscriptions.jsx` (modifier — ajouter CRUD dialogs, détails identifiants)

## ROUTES API CONCERNÉES
- `POST /api/subscriptions` — body: `{ nomService, type, coutMensuel, datePrelevement, icone, placesTotal, placesUtilisees, identifiant, motDePasseService }`
- `PUT /api/subscriptions/:id` — body: `{ ...fields }`
- `DELETE /api/subscriptions/:id`

## COMPOSANTS SHADCN/UI À UTILISER
- **Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter** — modales CRUD
- **Input** — champs du formulaire
- **Label** — labels
- **Select** — type d'abonnement, icône
- **Button** — actions
- **Separator** — séparer les sections dans la Dialog

## DESIGN REFERENCE
**Dialog "Ajouter un abonnement" :**
- Champs : Nom du service (Input), Type (Select : PREMIUM/FIBRE/FAMILLE/ANNUEL/FIXE), Prix mensuel (Input number), Date de prélèvement (Input date), Icône (Select : movie/router/audiotrack/stars/bolt/wifi/tv/music_note), Places total (Input number, optionnel), Identifiant (Input, optionnel), Mot de passe (Input type password, optionnel)
- Bouton : "Ajouter" (primary `#4799eb`)

**Dialog détails/modification :**
- Même formulaire pré-rempli
- Section "Identifiants de connexion" :
  - Email/identifiant : affiché en texte, bouton copier
  - Mot de passe : masqué par défaut (••••••), bouton toggle visibilité + bouton copier
- Bouton "Sauvegarder" + bouton "Supprimer" (rouge `#ef4444`)

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Ajouter les states pour les dialogs dans `Subscriptions.jsx` :**
   ```jsx
   const [showAddDialog, setShowAddDialog] = useState(false)
   const [editingSub, setEditingSub] = useState(null)
   const [deletingSubId, setDeletingSubId] = useState(null)
   const [showPassword, setShowPassword] = useState(false)
   const [newSub, setNewSub] = useState({
     nomService: '', type: 'PREMIUM', coutMensuel: '', datePrelevement: '',
     icone: 'movie', placesTotal: '', placesUtilisees: '', identifiant: '', motDePasseService: ''
   })
   ```

1. **Créer la Dialog d'ajout :**
   - Formulaire avec tous les champs listés dans DESIGN REFERENCE
   - Handler :

   ```jsx
   const handleAddSubscription = async () => {
     const res = await apiPost('/subscriptions', {
       ...newSub,
       coutMensuel: parseFloat(newSub.coutMensuel),
       placesTotal: newSub.placesTotal ? parseInt(newSub.placesTotal) : null,
       placesUtilisees: newSub.placesUtilisees ? parseInt(newSub.placesUtilisees) : null,
     })
     setSubscriptions([...subscriptions, res.data])
     setShowAddDialog(false)
   }
   ```

2. **Créer la Dialog d'édition/détails :**
   - Pré-remplir avec les données de `editingSub`
   - Ajouter la section identifiants :

   ```jsx
   {editingSub?.identifiant && (
     <>
       <Separator className="my-4" />
       <h3 className="font-medium mb-2">Identifiants de connexion</h3>
       <div className="space-y-2">
         <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
           <span className="text-sm">{editingSub.identifiant}</span>
           <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(editingSub.identifiant)}>
             <span className="material-symbols-outlined text-sm">content_copy</span>
           </Button>
         </div>
         {editingSub.motDePasseService && (
           <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
             <span className="text-sm font-mono">
               {showPassword ? editingSub.motDePasseService : '••••••••'}
             </span>
             <div className="flex gap-1">
               <Button variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)}>
                 <span className="material-symbols-outlined text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
               </Button>
               <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(editingSub.motDePasseService)}>
                 <span className="material-symbols-outlined text-sm">content_copy</span>
               </Button>
             </div>
           </div>
         )}
       </div>
     </>
   )}
   ```

3. **Ajouter les handlers d'édition et suppression :**

   ```jsx
   const handleEditSubscription = async () => {
     const res = await apiPut(`/subscriptions/${editingSub.id}`, editingSub)
     setSubscriptions(subscriptions.map(s => s.id === editingSub.id ? res.data : s))
     setEditingSub(null)
   }

   const handleDeleteSubscription = async () => {
     await apiDelete(`/subscriptions/${deletingSubId}`)
     setSubscriptions(subscriptions.filter(s => s.id !== deletingSubId))
     setDeletingSubId(null)
   }
   ```

4. **Relier les boutons :**
   - "AJOUTER ABONNEMENT" → `setShowAddDialog(true)`
   - "Modifier" sur chaque card → `setEditingSub(sub)`
   - "Supprimer" dans la dialog d'édition → `setDeletingSubId(editingSub.id)`

5. **Ajouter le ConfirmDialog de suppression** (réutiliser celui de story 4.2).

6. **Tester :**
   - Ajouter un abonnement → apparaît dans la grille, coût total recalculé
   - Modifier prix → coût total mis à jour
   - Voir places disponibles (3/6 pour Spotify)
   - Voir identifiants : email affiché, mot de passe masqué puis visible au clic
   - Copier identifiant/mot de passe (clipboard)
   - Supprimer → confirmation → disparaît
   - Responsive

## MOCK DATA NÉCESSAIRE

5 abonnements avec identifiants et places depuis `mockData.js` (story 1.3) :

- Netflix : identifiant <coloc.centrale@gmail.com>, mdp N3tfl1x2026, 4/4 places
- Spotify : identifiant <coloc.music@gmail.com>, mdp Sp0t1fy!, 3/6 places
- Disney+ : identifiant <coloc.disney@gmail.com>, mdp D1sn3y+, 2/4 places
- EDF : identifiant REF-CLI-78432, pas de mdp

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```

---

## EPIC 8 : Réglages & Profil

---

### PROMPT-8-1

```markdown
# PROMPT-8-1: Story 8.1 — Profil utilisateur

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **colocataire**,
I want **modifier mon nom et email**,
So that **mes informations sont à jour**.

## ACCEPTANCE CRITERIA
**Given** je suis sur `/settings`
**When** je modifie mon nom ou email et clique "Mettre à jour"
**Then** mes informations sont sauvegardées

## FICHIERS À CRÉER/MODIFIER
- `client/src/pages/Settings.jsx` (nouveau)
- `client/src/App.jsx` (modifier — importer Settings)

## ROUTES API CONCERNÉES
- `PUT /api/users/:id` — body: `{ nom, email }` → réponse: `{ data: updatedUser }`

## COMPOSANTS SHADCN/UI À UTILISER
- **Card, CardHeader, CardTitle, CardDescription, CardContent** — conteneur profil
- **Input** — champs nom, email
- **Label** — labels
- **Button** — bouton "Mettre à jour"
- **Avatar, AvatarFallback** — avatar utilisateur

## DESIGN REFERENCE
**Écran 8 — Réglages, section Profil (ui-design.md) :**
- Titre page : "Réglages"
- Section "Profil" :
  - Sous-titre : "Mettez à jour vos informations personnelles et votre compte"
  - Avatar large (64px) avec initiales
  - Champ "Nom complet" : pré-rempli avec le nom actuel
  - Champ "Adresse e-mail" : pré-rempli avec l'email actuel
  - Bouton "Mettre à jour" (primary `#4799eb`)

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Créer `client/src/pages/Settings.jsx` :**
   ```jsx
   // Story 8.1: Profil utilisateur
   ```

- Importer useState, useEffect, useAuth
- Importer apiPut depuis `@/lib/api`
- Importer Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Label, Button, Avatar, AvatarFallback

1. **Créer le state local :**

   ```jsx
   const { user, setUser } = useAuth()
   const [nom, setNom] = useState(user?.nom || '')
   const [email, setEmail] = useState(user?.email || '')
   const [success, setSuccess] = useState('')
   const [error, setError] = useState('')
   ```

2. **Handler de mise à jour :**

   ```jsx
   const handleUpdateProfile = async (e) => {
     e.preventDefault()
     setError('')
     setSuccess('')
     try {
       const res = await apiPut(`/users/${user.id}`, { nom, email })
       setUser(res.data)
       setSuccess('Profil mis à jour avec succès')
     } catch (err) {
       setError('Erreur lors de la mise à jour')
     }
   }
   ```

3. **Rendre la page :**

   ```jsx
   <div className="max-w-2xl">
     <h1 className="text-2xl font-bold text-[#0e141b] font-['Plus_Jakarta_Sans'] mb-6">Réglages</h1>

     {/* Section Profil */}
     <Card>
       <CardHeader>
         <CardTitle>Profil</CardTitle>
         <CardDescription>Mettez à jour vos informations personnelles et votre compte</CardDescription>
       </CardHeader>
       <CardContent>
         <div className="flex items-center gap-4 mb-6">
           <Avatar className="h-16 w-16">
             <AvatarFallback className="text-lg bg-[#4799eb] text-white">
               {nom.split(' ').map(n => n[0]).join('')}
             </AvatarFallback>
           </Avatar>
           <div>
             <p className="font-medium text-[#0e141b]">{nom}</p>
             <p className="text-sm text-[#4e7397]">{email}</p>
           </div>
         </div>

         <form onSubmit={handleUpdateProfile} className="space-y-4">
           <div>
             <Label htmlFor="nom">Nom complet</Label>
             <Input id="nom" value={nom} onChange={(e) => setNom(e.target.value)} />
           </div>
           <div>
             <Label htmlFor="email">Adresse e-mail</Label>
             <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
           </div>
           {success && <p className="text-[#22c55e] text-sm">{success}</p>}
           {error && <p className="text-[#ef4444] text-sm">{error}</p>}
           <Button type="submit" className="bg-[#4799eb] hover:bg-[#3b82f6]">Mettre à jour</Button>
         </form>
       </CardContent>
     </Card>

     {/* Les sections suivantes (colocation, notifications) seront ajoutées dans les stories 8.2 et 8.3 */}
   </div>
   ```

4. **Modifier `client/src/App.jsx` :** importer Settings.

5. **Tester :**
   - Le nom et email actuels sont pré-remplis
   - Modifier le nom → cliquer "Mettre à jour" → message vert "Profil mis à jour"
   - Le nom dans la sidebar se met à jour (via setUser)
   - Responsive

## MOCK DATA NÉCESSAIRE

Utilisateur connecté depuis AuthContext (Thomas Durand, <thomas@coloc.fr>).

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```

---

### PROMPT-8-2

```markdown
# PROMPT-8-2: Story 8.2 — Gestion de la colocation (admin)

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **admin**,
I want **voir le code d'invitation, la liste des membres avec leurs rôles, et inviter de nouveaux colocataires**,
So that **je peux gérer qui fait partie de la colocation**.

## ACCEPTANCE CRITERIA
**Given** je suis admin sur la page réglages
**When** je consulte la section "Ma Colocation"
**Then** le code d'invitation s'affiche (COLO-XXXX-X) et est copiable
**And** la liste des membres s'affiche avec leurs rôles (Admin/Membre)

**Given** je suis admin
**When** je clique "Inviter un colocataire"
**Then** le code d'invitation est partageable

## FICHIERS À CRÉER/MODIFIER
- `client/src/pages/Settings.jsx` (modifier — ajouter section "Ma Colocation")

## ROUTES API CONCERNÉES
- `GET /api/colocation` — code d'invitation
- `GET /api/users` — liste des membres

## COMPOSANTS SHADCN/UI À UTILISER
- **Card, CardHeader, CardTitle, CardContent** — conteneur section
- **Avatar, AvatarFallback** — avatars membres
- **Badge** — rôles Admin/Membre
- **Button** — boutons copier, inviter
- **Separator** — entre les sections

## DESIGN REFERENCE
**Écran 8 — Réglages, section Ma Colocation (ui-design.md) :**
- **Code d'invitation :** `COLO-7829-X` dans un bloc fond gris clair, avec bouton copier (icône `content_copy`)
- **Liste des membres :**
  - Thomas (Vous) — Badge "Admin" (bleu `#4799eb`)
  - Léa Martin — Badge "Membre" (gris)
  - Marc Lefebvre — Badge "Membre" (gris)
  - Chaque membre : Avatar (initiales) + nom + badge rôle
- Bouton : `person_add` "Inviter un colocataire" (outline)

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Ajouter le chargement des données dans `Settings.jsx` :**
   ```jsx
   const [colocation, setColocation] = useState(null)
   const [members, setMembers] = useState([])
   const [copied, setCopied] = useState(false)

   useEffect(() => {
     Promise.all([apiGet('/colocation'), apiGet('/users')])
       .then(([c, u]) => {
         setColocation(c.data)
         setMembers(u.data)
       })
   }, [])
   ```

1. **Ajouter la section "Ma Colocation" sous le profil :**

   ```jsx
   {user?.role === 'admin' && (
     <Card className="mt-6">
       <CardHeader>
         <CardTitle>Ma Colocation</CardTitle>
       </CardHeader>
       <CardContent>
         {/* Code d'invitation */}
         <div className="mb-6">
           <Label className="text-sm text-[#4e7397]">Code d'invitation</Label>
           <div className="flex items-center gap-2 mt-1">
             <div className="flex-1 p-3 bg-gray-50 rounded-lg font-mono text-lg font-bold text-[#0e141b]">
               {colocation?.codeInvitation}
             </div>
             <Button variant="outline" onClick={() => {
               navigator.clipboard.writeText(colocation?.codeInvitation)
               setCopied(true)
               setTimeout(() => setCopied(false), 2000)
             }}>
               <span className="material-symbols-outlined">{copied ? 'check' : 'content_copy'}</span>
             </Button>
           </div>
           {copied && <p className="text-[#22c55e] text-xs mt-1">Code copié !</p>}
         </div>

         <Separator className="my-4" />

         {/* Liste des membres */}
         <h3 className="font-medium mb-3">Membres de la colocation</h3>
         <div className="space-y-3">
           {members.map(member => (
             <div key={member.id} className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <Avatar className="h-10 w-10">
                   <AvatarFallback className={member.role === 'admin' ? 'bg-[#4799eb] text-white' : 'bg-gray-200'}>
                     {member.nom.split(' ').map(n => n[0]).join('')}
                   </AvatarFallback>
                 </Avatar>
                 <div>
                   <p className="font-medium text-[#0e141b]">
                     {member.nom} {member.id === user?.id && <span className="text-[#4e7397]">(Vous)</span>}
                   </p>
                   <p className="text-xs text-[#4e7397]">{member.email}</p>
                 </div>
               </div>
               <Badge className={member.role === 'admin' ? 'bg-[#4799eb] text-white' : 'bg-gray-100 text-gray-800'}>
                 {member.role === 'admin' ? 'Admin' : 'Membre'}
               </Badge>
             </div>
           ))}
         </div>

         <Separator className="my-4" />

         {/* Bouton inviter */}
         <Button variant="outline" className="text-[#4799eb]">
           <span className="material-symbols-outlined mr-2">person_add</span>
           Inviter un colocataire
         </Button>
       </CardContent>
     </Card>
   )}
   ```

2. **Le bouton "Inviter un colocataire"** peut ouvrir un Dialog avec le code d'invitation et un lien de partage, ou simplement copier le code.

3. **Tester :**
   - Se connecter en tant que Thomas (admin) → section "Ma Colocation" visible
   - Code COLO-7829-X affiché → cliquer copier → "Code copié !"
   - 3 membres listés avec rôles corrects (Thomas Admin, Léa Membre, Marc Membre)
   - Thomas marqué "(Vous)"
   - Responsive

## MOCK DATA NÉCESSAIRE

- Colocation : `{ codeInvitation: 'COLO-7829-X' }`
- Utilisateurs : Thomas (admin), Léa (membre), Marc (membre)

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```

---

### PROMPT-8-3

```markdown
# PROMPT-8-3: Story 8.3 — Notifications

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **colocataire**,
I want **activer ou désactiver les notifications email et push**,
So that **je contrôle les alertes que je reçois**.

## ACCEPTANCE CRITERIA
**Given** je suis sur la page réglages, section notifications
**When** je toggle "Notifications par e-mail"
**Then** le toggle change d'état (activé/désactivé)

**Given** je suis sur la page réglages
**When** je toggle "Notifications Push"
**Then** le toggle change d'état

## FICHIERS À CRÉER/MODIFIER
- `client/src/pages/Settings.jsx` (modifier — ajouter section Notifications)

## ROUTES API CONCERNÉES
Aucune route API (toggles en state local pour le MVP).

## COMPOSANTS SHADCN/UI À UTILISER
- **Card, CardHeader, CardTitle, CardContent** — conteneur section
- **Switch** — toggles notifications
- **Label** — labels des toggles
- **Separator** — entre les sections

## DESIGN REFERENCE
**Écran 8 — Réglages, section Notifications (ui-design.md) :**
- 2 toggles :

| Toggle | Icône | Label | Description | État par défaut |
|--------|-------|-------|-------------|-----------------|
| ✅ | `mail` | Notifications par e-mail | Résumé hebdomadaire des dépenses et tâches | Activé |
| ✅ | `notifications_active` | Notifications Push | Alertes immédiates pour nouvelles tâches et messages | Activé |

- **Footer page :** Lien "Supprimer le compte" en rouge `#ef4444` (non fonctionnel pour le MVP)

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Installer le composant Switch de shadcn/ui :**
   ```bash
   cd client && npx shadcn@latest add switch
   ```

1. **Ajouter les states de notification dans `Settings.jsx` :**

   ```jsx
   const [emailNotif, setEmailNotif] = useState(true)
   const [pushNotif, setPushNotif] = useState(true)
   ```

2. **Ajouter la section Notifications après la section colocation :**

   ```jsx
   <Card className="mt-6">
     <CardHeader>
       <CardTitle>Notifications</CardTitle>
     </CardHeader>
     <CardContent className="space-y-6">
       {/* Toggle email */}
       <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
           <span className="material-symbols-outlined text-[#4799eb]">mail</span>
           <div>
             <Label htmlFor="email-notif" className="font-medium">Notifications par e-mail</Label>
             <p className="text-sm text-[#4e7397]">Résumé hebdomadaire des dépenses et tâches</p>
           </div>
         </div>
         <Switch id="email-notif" checked={emailNotif} onCheckedChange={setEmailNotif} />
       </div>

       <Separator />

       {/* Toggle push */}
       <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
           <span className="material-symbols-outlined text-[#4799eb]">notifications_active</span>
           <div>
             <Label htmlFor="push-notif" className="font-medium">Notifications Push</Label>
             <p className="text-sm text-[#4e7397]">Alertes immédiates pour nouvelles tâches et messages</p>
           </div>
         </div>
         <Switch id="push-notif" checked={pushNotif} onCheckedChange={setPushNotif} />
       </div>
     </CardContent>
   </Card>
   ```

3. **Ajouter le lien "Supprimer le compte" en bas de la page :**

   ```jsx
   <div className="mt-8 pb-8">
     <button className="text-[#ef4444] text-sm hover:underline">
       Supprimer le compte
     </button>
   </div>
   ```

4. **Tester :**
   - Toggle email : clic → passe de activé à désactivé (visuellement)
   - Toggle push : clic → passe de activé à désactivé
   - Les toggles sont bien alignés avec les labels et descriptions
   - Le lien "Supprimer le compte" est visible en rouge (non fonctionnel)
   - Responsive

## MOCK DATA NÉCESSAIRE

Aucune donnée mock — les toggles sont gérés en state local.

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```

---

## EPIC 9 : UX Polish & Validation

---

### PROMPT-9-1

```markdown
# PROMPT-9-1: Story 9.1 — Validation formulaires et messages d'erreur

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **colocataire**,
I want **voir des messages d'erreur clairs quand je fais une saisie invalide**,
So that **je sais exactement quoi corriger**.

## ACCEPTANCE CRITERIA
**Given** je soumets un formulaire avec des champs requis vides
**When** la validation s'exécute
**Then** un message d'erreur rouge s'affiche sous chaque champ invalide

**Given** je tente d'ajouter une dépense de 0€ ou négative
**When** la validation s'exécute
**Then** un message explicite refuse la saisie

## FICHIERS À CRÉER/MODIFIER
- `client/src/pages/Login.jsx` (modifier — ajouter validation)
- `client/src/pages/Register.jsx` (modifier — ajouter validation)
- `client/src/pages/Tasks.jsx` (modifier — ajouter validation formulaire tâche)
- `client/src/pages/Finances.jsx` (modifier — ajouter validation montant > 0)
- `client/src/pages/Food.jsx` (modifier — ajouter validation recette)
- `client/src/pages/Subscriptions.jsx` (modifier — ajouter validation)

## ROUTES API CONCERNÉES
Aucune nouvelle route API — validation côté client.

## COMPOSANTS SHADCN/UI À UTILISER
- **Input** — avec classes d'erreur (`border-red-500`)
- **Label** — avec couleur d'erreur

## DESIGN REFERENCE
**Pattern de validation uniforme :**
- Champ invalide : bordure rouge `border-[#ef4444]`
- Message d'erreur : `<p className="text-[#ef4444] text-xs mt-1">Message</p>` sous le champ
- Messages standards :
  - Champ vide : "Ce champ est requis"
  - Email invalide : "Adresse email invalide"
  - Mot de passe < 8 : "Le mot de passe doit contenir au moins 8 caractères"
  - Montant ≤ 0 : "Le montant doit être supérieur à 0"
  - Titre vide : "Le titre est requis"

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Créer une fonction utilitaire de validation dans `client/src/lib/utils.js` :**
   ```jsx
   // Story 9.1: Validation formulaires et messages d'erreur
   export function validateRequired(value, fieldName) {
     if (!value || !value.toString().trim()) return `${fieldName} est requis`
     return null
   }

   export function validateEmail(email) {
     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
     if (!email) return 'L\'adresse email est requise'
     if (!re.test(email)) return 'Adresse email invalide'
     return null
   }

   export function validatePassword(password) {
     if (!password) return 'Le mot de passe est requis'
     if (password.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères'
     return null
   }

   export function validateAmount(amount) {
     const num = parseFloat(amount)
     if (!amount && amount !== 0) return 'Le montant est requis'
     if (isNaN(num) || num <= 0) return 'Le montant doit être supérieur à 0'
     return null
   }
   ```

1. **Modifier `Login.jsx` — ajouter validation :**

   ```jsx
   const [errors, setErrors] = useState({})

   const handleLogin = async (e) => {
     e.preventDefault()
     const newErrors = {}
     const emailErr = validateEmail(email)
     if (emailErr) newErrors.email = emailErr
     if (!password) newErrors.password = 'Le mot de passe est requis'
     if (Object.keys(newErrors).length > 0) {
       setErrors(newErrors)
       return
     }
     setErrors({})
     // ... login logic
   }
   ```

   Sous chaque Input :

   ```jsx
   {errors.email && <p className="text-[#ef4444] text-xs mt-1">{errors.email}</p>}
   ```

   Sur l'Input en erreur :

   ```jsx
   <Input className={errors.email ? 'border-[#ef4444]' : ''} ... />
   ```

2. **Modifier `Register.jsx` — ajouter validation nom + email + password :**
   Même pattern avec validateRequired, validateEmail, validatePassword.

3. **Modifier `Tasks.jsx` — validation du formulaire de création :**

   ```jsx
   // Le titre est requis
   if (!newTask.titre.trim()) { setErrors({ titre: 'Le titre est requis' }); return }
   ```

4. **Modifier `Finances.jsx` — validation montant :**

   ```jsx
   const montantErr = validateAmount(newFinance.montant)
   if (montantErr) { setErrors({ montant: montantErr }); return }
   // Titre requis
   if (!newFinance.titre.trim()) { setErrors({ titre: 'Le titre est requis' }); return }
   ```

5. **Modifier `Food.jsx` — validation recette (nom requis).**

6. **Modifier `Subscriptions.jsx` — validation nom et prix.**

7. **Tester TOUS les formulaires :**
   - Login : soumettre vide → erreurs sur email et password
   - Register : password < 8 → erreur
   - Tâche : titre vide → "Le titre est requis"
   - Finance : montant 0 → "Le montant doit être supérieur à 0"
   - Finance : montant -5 → même message
   - Recette : nom vide → erreur
   - Abonnement : prix vide → erreur
   - Vérifier que les erreurs disparaissent quand le champ est corrigé

## MOCK DATA NÉCESSAIRE

Aucune donnée mock supplémentaire.

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```

---

### PROMPT-9-2

```markdown
# PROMPT-9-2: Story 9.2 — Pop-ups de confirmation et responsive final

## CONTEXTE PROJET
- **Projet :** ColocApp — app de gestion de colocation
- **Stack :** React + Vite + shadcn/ui + Tailwind CSS + Express mock API
- **Structure :** Monorepo client/ + server/
- **Design ref :** Fichier ui-design.md dans _bmad-output/planning-artifacts/

## STORY
As a **colocataire**,
I want **des confirmations avant les actions critiques et que tout soit responsive**,
So that **je ne supprime rien par accident et l'app marche bien sur mobile**.

## ACCEPTANCE CRITERIA
**Given** je clique supprimer sur une tâche/dépense/abonnement
**When** la pop-up de confirmation s'affiche
**Then** je dois confirmer avant que l'action s'exécute

**Given** je suis sur n'importe quel écran
**When** je passe de desktop à mobile (ou inverse)
**Then** le layout s'adapte sans scroll horizontal et sans perte de fonctionnalité

## FICHIERS À CRÉER/MODIFIER
- `client/src/components/ConfirmDialog.jsx` (vérifier qu'il existe et est utilisé partout)
- `client/src/pages/Tasks.jsx` (vérifier confirmation suppression)
- `client/src/pages/Finances.jsx` (vérifier confirmation suppression)
- `client/src/pages/Subscriptions.jsx` (vérifier confirmation suppression)
- `client/src/pages/Food.jsx` (vérifier confirmation suppression recette)
- Tous les fichiers — audit responsive

## ROUTES API CONCERNÉES
Aucune nouvelle route API.

## COMPOSANTS SHADCN/UI À UTILISER
- **Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter** — ConfirmDialog
- **Button** — boutons Annuler / Confirmer

## DESIGN REFERENCE
**Pop-up de confirmation :**
- Dialog modale centrée
- Titre : "Confirmer la suppression" (ou selon contexte)
- Description : "Êtes-vous sûr de vouloir supprimer [élément] ? Cette action est irréversible."
- 2 boutons :
  - "Annuler" (variant outline)
  - "Supprimer" (variant destructive, fond `#ef4444`, texte blanc)
- Overlay semi-transparent derrière

**Checklist responsive :**
- Sidebar visible ≥768px, BottomNav visible <768px
- Grilles : 2-3 colonnes desktop → 1 colonne mobile
- Tableaux : scroll horizontal sur mobile (overflow-x-auto)
- Formulaires : pleine largeur sur mobile
- Boutons : pleine largeur sur mobile si seul, inline sinon
- Padding : p-6 desktop, p-4 mobile
- Textes : pas de troncature, wrap naturel

## CONTRAINTES TECHNIQUES
- Pas de CSS custom — uniquement Tailwind
- Composants shadcn/ui first
- Mock data depuis server/data/mockData.js (fetch vers API Express :3001)
- State local avec useState (pas de Redux)
- Responsive : breakpoint 768px

## INSTRUCTIONS D'IMPLÉMENTATION
1. **Vérifier que `ConfirmDialog.jsx` existe** (créé dans story 4.2). Si non, le créer :
   ```jsx
   // Story 9.2: Pop-ups de confirmation et responsive final
   import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
   import { Button } from '@/components/ui/button'

   export function ConfirmDialog({ open, onOpenChange, title, description, onConfirm, confirmLabel = 'Supprimer' }) {
     return (
       <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>{title}</DialogTitle>
             <DialogDescription>{description}</DialogDescription>
           </DialogHeader>
           <DialogFooter>
             <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
             <Button variant="destructive" onClick={() => { onConfirm(); onOpenChange(false) }}>
               {confirmLabel}
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
     )
   }
   ```

1. **Auditer chaque page pour la confirmation de suppression :**
   - **Tasks.jsx** : supprimer tâche → ConfirmDialog ✓ (story 4.2)
   - **Finances.jsx** : supprimer dépense → ajouter ConfirmDialog si manquant
   - **Subscriptions.jsx** : supprimer abonnement → ajouter ConfirmDialog si manquant
   - **Food.jsx** : supprimer recette → ajouter ConfirmDialog si manquant

2. **Pour chaque page où le ConfirmDialog manque, ajouter :**

   ```jsx
   import { ConfirmDialog } from '@/components/ConfirmDialog'

   // State
   const [deletingId, setDeletingId] = useState(null)

   // Dans le JSX
   <ConfirmDialog
     open={!!deletingId}
     onOpenChange={() => setDeletingId(null)}
     title="Confirmer la suppression"
     description="Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible."
     onConfirm={handleDelete}
   />
   ```

3. **Audit responsive complet — vérifier chaque page :**

   **Layout.jsx :**
   - `<main>` a `pb-20 md:pb-6` (padding bottom pour BottomNav sur mobile)

   **Dashboard.jsx :**
   - Widgets : `grid-cols-1 md:grid-cols-2`
   - Graphique + activités : `grid-cols-1 lg:grid-cols-2`

   **Tasks.jsx :**
   - Colonnes : `grid-cols-1 md:grid-cols-2`
   - Filtres : `flex flex-wrap gap-3`

   **Finances.jsx :**
   - Cards métriques : `grid-cols-1 md:grid-cols-3`
   - Tableau : wrapper `<div className="overflow-x-auto">` autour du Table

   **Food.jsx :**
   - Recettes : `grid-cols-1 md:grid-cols-2`
   - Liste courses : une colonne

   **Subscriptions.jsx :**
   - Cards : `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

   **Settings.jsx :**
   - `max-w-2xl` sur le conteneur

4. **Vérifier les points critiques :**
   - [ ] Aucun scroll horizontal sur mobile (375px)
   - [ ] BottomNav ne chevauche pas le contenu (padding bottom suffisant)
   - [ ] Tableaux scrollables horizontalement si trop larges
   - [ ] Dialogs/Modales fonctionnent sur mobile (pleine largeur)
   - [ ] Boutons d'action accessibles au pouce sur mobile

5. **Tester sur toutes les tailles :**
   - Desktop 1280px
   - Tablet 768px (point de bascule)
   - Mobile 375px
   - Vérifier chaque page avec DevTools responsive

## MOCK DATA NÉCESSAIRE

Aucune donnée mock supplémentaire.

## DEFINITION OF DONE

- [ ] Tous les acceptance criteria passent
- [ ] Responsive : desktop (≥768px) et mobile (<768px)
- [ ] shadcn/ui utilisé (pas de CSS custom)
- [ ] Mock data depuis mockData.js centralisé
- [ ] Pas d'erreur console
- [ ] Navigation fonctionne vers/depuis cette page

```
