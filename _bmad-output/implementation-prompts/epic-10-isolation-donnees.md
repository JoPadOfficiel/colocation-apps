```
You act as BMAD Orchestrator. You MUST follow the BMAD method in this immutable order:
@_bmad-output/planning-artifacts → prd.md & epics.md
→ /bmad-create-story → /bmad-dev-story → /bmad-code-review
NEVER change this order or skip a step.
```

**MCP Tools (use when available, fallback if not):**

- `@mcp:context-engine` → semantic codebase search (fallback: Grep/Glob)
- `@mcp:playwright` → E2E browser testing (fallback: curl + manual)
- `@mcp:context7` → library docs research (fallback: WebSearch)

**Global Constraints:**

- Branch: `feat/epic-10-isolation-donnees` from `main`
- All commands prefixed with `rtk` for token optimization
- Test Gate after EVERY story: `rtk npm run dev` (zero errors client + server), curl API tests, manual smoke test
- JavaScript uniquement — PAS de TypeScript
- Backend = CommonJS (`require`), Frontend = ESM (`import`)
- Commit after each successful story
- IMPORTANT: Toutes les réponses API wrappées `{ data: ... }` ou `{ error: "..." }`

---

## Story 10.1 — Filtrage API par colocationId

> **Story file:** `_bmad-output/implementation-artifacts/stories/10.1-filtrage-api-colocationid.md`
> **Priority:** P0 | **Phase:** 1 | **Risk:** HIGH
> **Epic:** 10 — Isolation des Données & Suppression Données Mockées
> **Dependency:** Aucune (premier de la chaîne)

---

### Implementation Pipeline

<pipeline>
  <step n="1" name="CREATE-STORY" condition="SKIP — story already exists at ready-for-dev">
    <command>/bmad-create-story 10.1</command>
    <status>SKIP</status>
  </step>

  <step n="2" name="DEV-STORY" condition="story-status-is-ready-for-dev">
    <command>/bmad-dev-story @_bmad-output/implementation-artifacts/stories/10.1-filtrage-api-colocationid.md</command>
    <fallback>Read and execute: .claude/skills/bmad-dev-story/workflow.md with story file as input</fallback>
    <context>
      - PROBLÈME: Tous les GET retournent TOUTES les données sans filtre colocationId
      - PROBLÈME: Tous les POST hardcodent `colocationId: 'coloc-1'`
      - 10 routes API à modifier dans server/index.js (5 GET + 5 POST)
      - Le client doit envoyer `colocationId` via query param dans chaque appel API
      - `colocation.id` est disponible via `useAuth()` (stocké dans sessionStorage)
      - Les données JSON existantes ont déjà le champ `colocationId` — pas de migration nécessaire
      - CRITICAL: Ne pas casser les routes d'auth (login/register) qui n'ont pas besoin de colocationId
    </context>
    <output>Story implemented, status changed to review</output>
  </step>

  <step n="3" name="CODE-REVIEW">
    <command>/bmad-code-review</command>
    <fallback>Read and execute: .claude/skills/bmad-code-review/workflow.md</fallback>
    <scope>server/index.js (routes GET/POST), client/src/lib/api.js, client/src/pages/*.jsx</scope>
    <action>Auto-correct ALL issues (critical/medium/low). Re-run until clean.</action>
  </step>

  <step n="4" name="TEST-GATE">
    <action>Run full test gate protocol:</action>
    <commands>
      1. rtk npm run dev (vérifier 0 erreurs console client + serveur)
      2. curl -s http://localhost:3001/api/tasks?colocationId=coloc-1 | jq '.data | length'
      3. curl -s http://localhost:3001/api/tasks | jq  # DOIT retourner erreur 400
      4. curl -s http://localhost:3001/api/finances?colocationId=coloc-1 | jq '.data | length'
      5. curl -s http://localhost:3001/api/subscriptions?colocationId=coloc-1 | jq '.data | length'
      6. curl -s http://localhost:3001/api/recipes?colocationId=coloc-1 | jq '.data | length'
      7. curl -s http://localhost:3001/api/shopping?colocationId=coloc-1 | jq '.data | length'
      8. Smoke test navigateur: login → dashboard → vérifier que les données s'affichent
    </commands>
  </step>
</pipeline>

### Story Context for Dev Agent

**What needs to change:** Ajouter le filtrage par `colocationId` sur TOUTES les routes GET et supprimer le hardcode `coloc-1` sur TOUTES les routes POST.

**Key files to modify:**

| Fichier | Changement |
|---------|-----------|
| `server/index.js` | 5 GET routes: ajouter `const { colocationId } = req.query` + `filter(item => item.colocationId === colocationId)` + retourner 400 si absent |
| `server/index.js` | 5 POST routes: remplacer `colocationId: 'coloc-1'` par `colocationId: req.body.colocationId` |
| `client/src/lib/api.js` | Modifier `request()` ou créer helper pour ajouter `?colocationId=X` aux URLs GET |
| `client/src/pages/Dashboard.jsx` | Passer `colocationId` dans tous les fetch |
| `client/src/pages/Tasks.jsx` | Passer `colocationId` dans fetchTasks + POST/PUT |
| `client/src/pages/Finances.jsx` | Passer `colocationId` dans fetchFinances + POST/PUT |
| `client/src/pages/Food.jsx` | Passer `colocationId` dans fetch recettes + courses |
| `client/src/pages/Subscriptions.jsx` | Passer `colocationId` dans fetch abonnements |

**Pattern à appliquer côté serveur (exemple GET /api/tasks):**

```javascript
// AVANT
app.get('/api/tasks', (req, res) => {
  const tasks = db.read('tasks');
  res.json({ data: tasks });
});

// APRÈS
app.get('/api/tasks', (req, res) => {
  const { colocationId } = req.query;
  if (!colocationId) return res.status(400).json({ error: 'colocationId requis' });
  const tasks = db.read('tasks').filter(t => t.colocationId === colocationId);
  res.json({ data: tasks });
});
```

**Pattern à appliquer côté serveur (exemple POST /api/tasks):**

```javascript
// AVANT
const task = { id: genId(tasks, 'task'), colocationId: 'coloc-1', ...req.body };

// APRÈS
const task = { id: genId(tasks, 'task'), colocationId: req.body.colocationId, ...req.body };
```

**Pattern à appliquer côté client (api.js):**

```javascript
// Helper à ajouter dans api.js
export function apiUrl(path, colocationId) {
  const sep = path.includes('?') ? '&' : '?'
  return colocationId ? `${path}${sep}colocationId=${colocationId}` : path
}

// Usage dans les pages
const { colocation } = useAuth()
const data = await request(apiUrl('/api/tasks', colocation?.id))
```

**Critical constraints:**

- NE PAS toucher aux routes auth (`/api/auth/login`, `/api/auth/register`) — elles n'ont pas besoin de colocationId
- NE PAS toucher à `GET /api/users` — il retourne tous les utilisateurs (nécessaire pour les select d'assignation)
- Le colocationId doit aussi être envoyé dans le body des POST/PUT (pas uniquement en query param)
- Vérifier que `colocation.id` n'est jamais `undefined` avant d'appeler l'API (utilisateur sans colocation = redirect vers onboarding)

---

---

## Story 10.2 — Création de Colocation avec Données Vierges

> **Story file:** `_bmad-output/implementation-artifacts/stories/10.2-colocation-donnees-vierges.md`
> **Priority:** P0 | **Phase:** 2 | **Risk:** HIGH
> **Epic:** 10 — Isolation des Données & Suppression Données Mockées
> **Dependency:** Story 10.1

---

### Implementation Pipeline

<pipeline>
  <step n="1" name="CREATE-STORY" condition="SKIP — story already exists at ready-for-dev">
    <command>/bmad-create-story 10.2</command>
    <status>SKIP</status>
  </step>

  <step n="2" name="DEV-STORY" condition="story-status-is-ready-for-dev">
    <command>/bmad-dev-story @_bmad-output/implementation-artifacts/stories/10.2-colocation-donnees-vierges.md</command>
    <fallback>Read and execute: .claude/skills/bmad-dev-story/workflow.md with story file as input</fallback>
    <context>
      - Actuellement: une seule colocation `coloc-1` hardcodée, objet unique (pas un tableau)
      - OBJECTIF: Transformer en tableau `colocations[]`, supporter la création de nouvelles colocs vierges
      - mockData.js: `colocation` (objet) → `colocations` (tableau)
      - db.js: adapter read/write pour le nouveau format tableau
      - POST /api/colocation: créer une coloc vierge avec `totalFund: 0`, `members: [créateur]`
      - Générer un `invitationCode` unique format `COLO-XXXX-X`
      - Les routes login/register doivent gérer le cas `colocation: null` (utilisateur sans coloc)
      - Conserver coloc-1 avec ses données de démo
    </context>
    <output>Story implemented, status changed to review</output>
  </step>

  <step n="3" name="CODE-REVIEW">
    <command>/bmad-code-review</command>
    <scope>server/index.js, server/data/mockData.js, server/data/db.js, server/data/db/colocation.json, client/src/contexts/AuthContext.jsx, client/src/pages/Onboarding.jsx</scope>
    <action>Auto-correct ALL issues. Re-run until clean.</action>
  </step>

  <step n="4" name="TEST-GATE">
    <commands>
      1. rtk npm run dev (0 erreurs)
      2. curl -s -X POST http://localhost:3001/api/colocation -H "Content-Type: application/json" -d '{"name":"Test Coloc","creatorId":"user-1"}' | jq
      3. # Vérifier: id généré, invitationCode format COLO-XXXX-X, totalFund: 0, members: [user-1]
      4. curl -s http://localhost:3001/api/colocation/coloc-1 | jq  # coloc-1 doit toujours exister
      5. curl -s http://localhost:3001/api/tasks?colocationId=coloc-NEW | jq '.data | length'  # DOIT être 0
      6. Smoke test: register → créer colocation → dashboard → vérifier widgets à 0
    </commands>
  </step>
</pipeline>

### Story Context for Dev Agent

**What needs to change:** Transformer le modèle colocation d'un objet unique en tableau, supporter la création de colocations vierges.

**Key files to modify:**

| Fichier | Changement |
|---------|-----------|
| `server/data/mockData.js` | `colocation: {...}` → `colocations: [{...coloc-1}]` |
| `server/data/db.js` | Adapter `read('colocation')` pour retourner un tableau |
| `server/data/db/colocation.json` | Transformer en tableau `[{...}]` |
| `server/index.js` | `POST /api/colocation` : créer coloc vierge + `GET /api/colocation/:id` |
| `server/index.js` | Adapter login/register pour chercher coloc dans le tableau |
| `client/src/contexts/AuthContext.jsx` | Gérer `colocation: null` après register |
| `client/src/pages/Onboarding.jsx` | Envoyer `userId` quand on crée une colocation |

**Fonction genInvitationCode à ajouter dans server/index.js:**

```javascript
function genInvitationCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const code = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const suffix = chars[Math.floor(Math.random() * chars.length)];
  return `COLO-${code}-${suffix}`;
}
```

**Pattern POST /api/colocation:**

```javascript
app.post('/api/colocation', (req, res) => {
  const { name, creatorId } = req.body;
  if (!name || !creatorId) return res.status(400).json({ error: 'name et creatorId requis' });
  const colocations = db.read('colocation');
  const newColoc = {
    id: genId(colocations, 'coloc'),
    name,
    invitationCode: genInvitationCode(),
    totalFund: 0,
    members: [{ userId: creatorId, role: 'admin' }]
  };
  colocations.push(newColoc);
  db.write('colocation', colocations);
  // Mettre à jour l'utilisateur
  const users = db.read('users');
  const user = users.find(u => u.id === creatorId);
  if (user) { user.colocationId = newColoc.id; db.write('users', users); }
  res.status(201).json({ data: newColoc });
});
```

**Critical constraints:**

- NE PAS supprimer les données mockées de coloc-1 — elles servent de démo
- Les nouvelles colocations doivent avoir 0 tâches, 0 finances, 0 abonnements, 0 recettes
- Le `invitationCode` doit être UNIQUE (vérifier l'unicité avant d'assigner)
- Après `POST /api/auth/register`, l'utilisateur n'a PAS encore de colocation → `colocation: null`
- Le client doit rediriger vers `/onboarding` si `colocation === null`

---

---

## Story 10.3 — Flux "Rejoindre une colocation" Fonctionnel

> **Story file:** `_bmad-output/implementation-artifacts/stories/10-3-flux-rejoindre-colocation.md`
> **Priority:** P0 | **Phase:** 3 | **Risk:** MEDIUM
> **Epic:** 10 — Isolation des Données & Suppression Données Mockées
> **Dependency:** Story 10.1 + Story 10.2

---

### Implementation Pipeline

<pipeline>
  <step n="1" name="CREATE-STORY" condition="SKIP — story already exists at ready-for-dev">
    <command>/bmad-create-story 10.3</command>
    <status>SKIP</status>
  </step>

  <step n="2" name="DEV-STORY" condition="story-status-is-ready-for-dev">
    <command>/bmad-dev-story @_bmad-output/implementation-artifacts/stories/10-3-flux-rejoindre-colocation.md</command>
    <fallback>Read and execute: .claude/skills/bmad-dev-story/workflow.md with story file as input</fallback>
    <context>
      - ACTUELLEMENT: La route POST /api/colocation/join existe mais ne valide pas correctement
      - Le code d'invitation est hardcodé, pas de preview avant de rejoindre
      - OBJECTIF: Flux en 2 étapes — 1) Preview (voir nom + membres) 2) Confirmer
      - Nouvelle route: POST /api/colocation/preview (lecture seule, retourne nom + membres)
      - Modifier: POST /api/colocation/join (valider userId, vérifier pas déjà membre)
      - Nouveau composant: JoinConfirmDialog.jsx avec shadcn/ui Dialog
      - Modifier: Onboarding.jsx pour le flux 2 étapes
      - Modifier: Login.jsx pour le cas non-authentifié qui rejoint
      - Mettre à jour AuthContext et sessionStorage après join
    </context>
    <output>Story implemented, status changed to review</output>
  </step>

  <step n="3" name="CODE-REVIEW">
    <command>/bmad-code-review</command>
    <scope>server/index.js (routes colocation), client/src/pages/Onboarding.jsx, client/src/pages/Login.jsx, client/src/components/JoinConfirmDialog.jsx, client/src/contexts/AuthContext.jsx</scope>
    <action>Auto-correct ALL issues. Re-run until clean.</action>
  </step>

  <step n="4" name="TEST-GATE">
    <commands>
      1. rtk npm run dev (0 erreurs)
      2. curl -s -X POST http://localhost:3001/api/colocation/preview -H "Content-Type: application/json" -d '{"invitationCode":"COLO-7829-X"}' | jq
      3. # Vérifier: retourne nom coloc + liste membres
      4. curl -s -X POST http://localhost:3001/api/colocation/preview -H "Content-Type: application/json" -d '{"invitationCode":"INVALID"}' | jq
      5. # Vérifier: retourne erreur "Code d'invitation invalide"
      6. curl -s -X POST http://localhost:3001/api/colocation/join -H "Content-Type: application/json" -d '{"invitationCode":"COLO-7829-X","userId":"user-4"}' | jq
      7. Smoke test navigateur: register → onboarding → saisir code → voir preview → confirmer → dashboard
    </commands>
  </step>
</pipeline>

### Story Context for Dev Agent

**What needs to change:** Implémenter un flux "Rejoindre colocation" en 2 étapes avec preview et confirmation.

**Key files to modify:**

| Fichier | Changement |
|---------|-----------|
| `server/index.js` | Nouvelle route `POST /api/colocation/preview` |
| `server/index.js` | Modifier `POST /api/colocation/join` — validation complète |
| `client/src/components/JoinConfirmDialog.jsx` | NOUVEAU — Dialog shadcn/ui avec preview |
| `client/src/pages/Onboarding.jsx` | Flux 2 étapes : saisie code → preview → confirmer |
| `client/src/pages/Login.jsx` | Gérer le join depuis la page login (non-authentifié) |
| `client/src/contexts/AuthContext.jsx` | Ajouter `joinColocation()` + update sessionStorage |

**Route POST /api/colocation/preview:**

```javascript
app.post('/api/colocation/preview', (req, res) => {
  const { invitationCode } = req.body;
  if (!invitationCode) return res.status(400).json({ error: 'invitationCode requis' });
  const colocations = db.read('colocation');
  const coloc = colocations.find(c => c.invitationCode === invitationCode);
  if (!coloc) return res.status(404).json({ error: 'Code d\'invitation invalide' });
  const users = db.read('users');
  const members = coloc.members.map(m => {
    const user = users.find(u => u.id === m.userId);
    return { name: user?.name || 'Inconnu', role: m.role };
  });
  res.json({ data: { id: coloc.id, name: coloc.name, memberCount: members.length, members } });
});
```

**Critical constraints:**

- Un utilisateur déjà membre d'une colocation ne peut PAS en rejoindre une autre sans quitter la première
- Vérifier que l'utilisateur n'est pas déjà membre de la colocation cible
- Après join, mettre à jour `user.colocationId` côté serveur
- Après join, mettre à jour `AuthContext.colocation` + `sessionStorage` côté client
- Le Dialog de preview doit être fermable (annuler = rester sur la page)
