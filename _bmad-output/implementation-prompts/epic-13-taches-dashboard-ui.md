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

- Branch: `feat/epic-13-taches-dashboard-ui` from `main`
- All commands prefixed with `rtk` for token optimization
- Test Gate after EVERY story: `rtk npm run dev` (zero errors), curl API tests, manual smoke test
- JavaScript uniquement — PAS de TypeScript
- Backend = CommonJS (`require`), Frontend = ESM (`import`)
- Commit after each successful story
- IMPORTANT: Toutes les réponses API wrappées `{ data: ... }` ou `{ error: "..." }`

---

## Story 13.1 — Correction Globale des Composants Select

> **Story file:** `_bmad-output/implementation-artifacts/stories/13.1-correction-select-composants.md`
> **Priority:** P0 | **Phase:** 3 | **Risk:** MEDIUM
> **Epic:** 13 — Tâches, Dashboard & Composants UI
> **Dependency:** Aucune (peut démarrer en parallèle de Epic 10)

---

### Implementation Pipeline

<pipeline>
  <step n="1" name="CREATE-STORY" condition="SKIP — story already exists at ready-for-dev">
    <command>/bmad-create-story 13.1</command>
    <status>SKIP</status>
  </step>

  <step n="2" name="DEV-STORY" condition="story-status-is-ready-for-dev">
    <command>/bmad-dev-story @_bmad-output/implementation-artifacts/stories/13.1-correction-select-composants.md</command>
    <context>
      - PROBLÈME: Le composant Select de @base-ui/react (v1.3.0) a un conflit de portail z-index avec Dialog
      - Les popups Select s'ouvrent mais les clics ne passent pas quand le Select est dans un Dialog
      - Affecte: Tasks.jsx (assignedTo, category, status), Finances.jsx (paidBy, type), Food.jsx, Subscriptions.jsx
      - OPTION 1 (préférée): Augmenter le z-index du SelectContent dans select.jsx (z-[200] au lieu de z-[100])
      - OPTION 2 (fallback): Remplacer tous les Select dans des Dialog par des <select> natifs HTML stylés Tailwind
      - OPTION 3: Migrer vers le composant Select de shadcn/ui (Radix UI)
      - AUDIT: Vérifier TOUTES les pages qui utilisent Select dans un Dialog
    </context>
    <output>Story implemented, status changed to review</output>
  </step>

  <step n="3" name="CODE-REVIEW">
    <command>/bmad-code-review</command>
    <scope>client/src/components/ui/select.jsx, client/src/pages/Tasks.jsx, client/src/pages/Finances.jsx, client/src/pages/Food.jsx, client/src/pages/Subscriptions.jsx</scope>
    <action>Auto-correct ALL issues. Re-run until clean.</action>
  </step>

  <step n="4" name="TEST-GATE">
    <commands>
      1. rtk npm run dev (0 erreurs)
      2. Smoke test: Tasks → "NOUVELLE TÂCHE" → ouvrir Select "Assigné à" → sélectionner un membre → vérifier valeur enregistrée
      3. Smoke test: Tasks → "NOUVELLE TÂCHE" → ouvrir Select "Catégorie" → sélectionner → vérifier
      4. Smoke test: Finances → "AJOUTER DÉPENSE" → ouvrir Select "Payé par" → sélectionner → vérifier
      5. Smoke test: Subscriptions → "AJOUTER ABONNEMENT" → tous les Select fonctionnent
      6. Vérifier sur mobile (viewport 375px): les Select s'ouvrent et sont utilisables
    </commands>
  </step>
</pipeline>

### Story Context for Dev Agent

**What needs to change:** Corriger tous les composants Select qui ne fonctionnent pas dans les Dialog.

**Key files to modify:**

| Fichier | Changement |
|---------|-----------|
| `client/src/components/ui/select.jsx` | Augmenter z-index du popup portal (z-[200] minimum) |
| `client/src/pages/Tasks.jsx` | Si fix global ne suffit pas → remplacer par select natif |
| `client/src/pages/Finances.jsx` | Idem |
| `client/src/pages/Food.jsx` | Vérifier si des Select sont dans des Dialog |
| `client/src/pages/Subscriptions.jsx` | Vérifier si des Select sont dans des Dialog |

**Fix Option 1 — select.jsx z-index (essayer en premier):**

```jsx
// Dans select.jsx, trouver SelectContent/SelectPopup et changer le z-index:
// AVANT:
className={cn("z-[100] ...", className)}
// APRÈS:
className={cn("z-[200] ...", className)}
```

**Fix Option 2 — fallback select natif (si Option 1 ne marche pas):**

```jsx
// Remplacer dans chaque Dialog:
<select
  value={value}
  onChange={e => onChange(e.target.value)}
  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
>
  <option value="">Sélectionner...</option>
  {options.map(opt => (
    <option key={opt.value} value={opt.value}>{opt.label}</option>
  ))}
</select>
```

**AUDIT checklist — vérifier CHAQUE page:**

- [ ] Tasks.jsx: Select "Assigné à" dans Dialog création/modification
- [ ] Tasks.jsx: Select "Catégorie" dans Dialog
- [ ] Tasks.jsx: Select "Statut" dans Dialog
- [ ] Tasks.jsx: Select "Récurrence" dans Dialog
- [ ] Finances.jsx: Select "Payé par" dans Dialog
- [ ] Finances.jsx: Select "Type" dans Dialog
- [ ] Food.jsx: Select dans Dialog (si existant)
- [ ] Subscriptions.jsx: Select dans Dialog (si existant)
- [ ] Tasks.jsx: Select bulk action (PAS dans Dialog — devrait fonctionner)

**Critical constraints:**

- NE PAS casser les Select qui fonctionnent déjà (ceux en dehors des Dialog)
- Tester sur mobile (viewport 375px) — les Select doivent être utilisables
- Si Option 1 fonctionne pour TOUS les cas, ne pas faire Option 2 (moins de code = mieux)
- Vérifier que les Select affichent des NOMS (pas des IDs) pour les utilisateurs

---

---

## Story 13.2 — Bulk Actions Complètes sur les Tâches

> **Story file:** `_bmad-output/implementation-artifacts/stories/13.2-bulk-actions-taches.md`
> **Priority:** P2 | **Phase:** 8 | **Risk:** LOW
> **Epic:** 13 — Tâches, Dashboard & Composants UI
> **Dependency:** Story 10.1

---

### Implementation Pipeline

<pipeline>
  <step n="1" name="CREATE-STORY" condition="SKIP — story already exists at ready-for-dev">
    <command>/bmad-create-story 13.2</command>
    <status>SKIP</status>
  </step>

  <step n="2" name="DEV-STORY" condition="story-status-is-ready-for-dev">
    <command>/bmad-dev-story @_bmad-output/implementation-artifacts/stories/13.2-bulk-actions-taches.md</command>
    <context>
      - ACTUELLEMENT: La barre de bulk actions existe avec uniquement "Déléguer à..."
      - MANQUANT: Bouton "Marquer Terminée" pour passer toutes les tâches sélectionnées en done
      - MANQUANT: Bouton "Supprimer" pour supprimer en masse avec confirmation
      - Les fonctions existantes: bulkReassign() fonctionne, s'en inspirer
      - Ajouter: bulkMarkDone() → PUT chaque tâche avec status: "Terminée"
      - Ajouter: bulkDelete() → DELETE chaque tâche sélectionnée (après ConfirmDialog)
      - Icônes: CheckCircle pour "Terminée", Trash2 pour "Supprimer" (lucide-react)
    </context>
    <output>Story implemented, status changed to review</output>
  </step>

  <step n="3" name="CODE-REVIEW">
    <command>/bmad-code-review</command>
    <scope>client/src/pages/Tasks.jsx</scope>
    <action>Auto-correct ALL issues. Re-run until clean.</action>
  </step>

  <step n="4" name="TEST-GATE">
    <commands>
      1. rtk npm run dev (0 erreurs)
      2. Smoke test: Tasks → sélectionner 3 tâches → cliquer "Marquer Terminée" → vérifier 3 tâches dans colonne Terminées
      3. Smoke test: Tasks → sélectionner 2 tâches → cliquer "Supprimer" → confirmer → vérifier 2 tâches supprimées
      4. Smoke test: Vérifier que "Déléguer à..." fonctionne toujours
      5. Smoke test: Vérifier que la sélection se réinitialise après chaque action
    </commands>
  </step>
</pipeline>

### Story Context for Dev Agent

**What needs to change:** Ajouter les boutons "Marquer Terminée" et "Supprimer" dans la barre de bulk actions.

**Code à ajouter dans Tasks.jsx — barre de bulk actions:**

```jsx
// Fonctions
async function bulkMarkDone() {
  const promises = selectedTasks.map(taskId =>
    request(`/api/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'Terminée' })
    })
  )
  await Promise.all(promises)
  setSelectedTasks([])
  fetchTasks()
}

async function bulkDelete() {
  const promises = selectedTasks.map(taskId =>
    request(`/api/tasks/${taskId}`, { method: 'DELETE' })
  )
  await Promise.all(promises)
  setSelectedTasks([])
  fetchTasks()
}

// Dans la barre flottante (à côté du Select "Déléguer à..."):
<Button size="sm" variant="outline" onClick={bulkMarkDone}>
  <CheckCircle className="h-4 w-4 mr-1" /> Terminée
</Button>
<Button size="sm" variant="destructive" onClick={() => setShowBulkDeleteConfirm(true)}>
  <Trash2 className="h-4 w-4 mr-1" /> Supprimer
</Button>

// ConfirmDialog pour suppression
<ConfirmDialog
  open={showBulkDeleteConfirm}
  onConfirm={bulkDelete}
  onCancel={() => setShowBulkDeleteConfirm(false)}
  title="Supprimer les tâches sélectionnées"
  description={`Voulez-vous vraiment supprimer ${selectedTasks.length} tâche(s) ? Cette action est irréversible.`}
/>
```

---

---

## Story 13.3 — Toggle Statut Complet (À faire / En cours / Terminée)

> **Story file:** `_bmad-output/implementation-artifacts/stories/13.3-toggle-statut-complet.md`
> **Priority:** P2 | **Phase:** 9 | **Risk:** LOW
> **Epic:** 13 — Tâches, Dashboard & Composants UI
> **Dependency:** Aucune

---

### Implementation Pipeline

<pipeline>
  <step n="1" name="CREATE-STORY" condition="SKIP — story already exists at ready-for-dev">
    <command>/bmad-create-story 13.3</command>
    <status>SKIP</status>
  </step>

  <step n="2" name="DEV-STORY" condition="story-status-is-ready-for-dev">
    <command>/bmad-dev-story @_bmad-output/implementation-artifacts/stories/13.3-toggle-statut-complet.md</command>
    <context>
      - ACTUELLEMENT: toggleStatus fait seulement "Terminée" ↔ "À faire", perd "En cours"
      - ACTUELLEMENT: 2 colonnes Kanban seulement (À Faire + Terminées), "En cours" mélangé dans "À Faire"
      - OBJECTIF: Cycle complet "À faire" → "En cours" → "Terminée" → "À faire"
      - OBJECTIF: 3 colonnes Kanban (ou 3 sections)
      - Mettre à jour les badges visuels: orange pour "En cours"
      - Mettre à jour les statistiques pour inclure "En cours"
    </context>
    <output>Story implemented, status changed to review</output>
  </step>

  <step n="3" name="CODE-REVIEW">
    <command>/bmad-code-review</command>
    <scope>client/src/pages/Tasks.jsx, client/src/components/TaskCard.jsx</scope>
    <action>Auto-correct ALL issues. Re-run until clean.</action>
  </step>

  <step n="4" name="TEST-GATE">
    <commands>
      1. rtk npm run dev (0 erreurs)
      2. Smoke test: Tasks → cliquer statut "À faire" → vérifier passage à "En cours" (badge orange)
      3. Smoke test: Cliquer statut "En cours" → vérifier passage à "Terminée" (badge vert)
      4. Smoke test: Cliquer statut "Terminée" → vérifier retour à "À faire"
      5. Smoke test: Vérifier 3 colonnes/sections visibles
      6. Smoke test: Vérifier les statistiques incluent "En cours"
    </commands>
  </step>
</pipeline>

### Story Context for Dev Agent

**What needs to change:** Corriger le cycle de statut et ajouter la colonne "En cours".

**Fix toggleStatus dans Tasks.jsx:**

```javascript
// AVANT:
function toggleStatus(task) {
  const newStatus = task.status === 'Terminée' ? 'À faire' : 'Terminée'
  // ...
}

// APRÈS:
function toggleStatus(task) {
  const cycle = { 'À faire': 'En cours', 'En cours': 'Terminée', 'Terminée': 'À faire' }
  const newStatus = cycle[task.status] || 'À faire'
  // ...
}
```

**Ajouter colonne "En cours" dans le rendu:**

```jsx
// AVANT: 2 colonnes
const todoTasks = filteredTasks.filter(t => t.status !== 'Terminée')
const doneTasks = filteredTasks.filter(t => t.status === 'Terminée')

// APRÈS: 3 colonnes
const todoTasks = filteredTasks.filter(t => t.status === 'À faire')
const inProgressTasks = filteredTasks.filter(t => t.status === 'En cours')
const doneTasks = filteredTasks.filter(t => t.status === 'Terminée')
```

**Badge couleur "En cours" dans TaskCard.jsx:**

```jsx
// Ajouter le cas "En cours"
const statusColors = {
  'À faire': 'bg-yellow-100 text-yellow-800',
  'En cours': 'bg-orange-100 text-orange-800',
  'Terminée': 'bg-green-100 text-green-800'
}
```

---

---

## Story 13.4 — Rafraîchissement du Dashboard et Activités Récentes

> **Story file:** `_bmad-output/implementation-artifacts/stories/13.4-rafraichissement-dashboard.md`
> **Priority:** P2 | **Phase:** 10 | **Risk:** LOW
> **Epic:** 13 — Tâches, Dashboard & Composants UI
> **Dependency:** Story 10.1 + Story 11.3

---

### Implementation Pipeline

<pipeline>
  <step n="1" name="CREATE-STORY" condition="SKIP — story already exists at ready-for-dev">
    <command>/bmad-create-story 13.4</command>
    <status>SKIP</status>
  </step>

  <step n="2" name="DEV-STORY" condition="story-status-is-ready-for-dev">
    <command>/bmad-dev-story @_bmad-output/implementation-artifacts/stories/13.4-rafraichissement-dashboard.md</command>
    <context>
      - PROBLÈME 1: Le dashboard ne refetch pas les données quand on y revient (stale data)
      - PROBLÈME 2: Les activités récentes utilisent `dueDate` au lieu de `createdAt`/`updatedAt`
      - PROBLÈME 3: Le graphique ExpenseChart groupe par TYPE (shopping, loyer...) au lieu de par MOIS
      - FIX 1: Ajouter `location.key` ou un compteur dans le useEffect pour forcer le refetch
      - FIX 2: Utiliser `updatedAt` ou `date` pour les timestamps d'activité
      - FIX 3: Modifier ExpenseChart pour grouper par mois (comme FinancesChart dans Finances.jsx)
      - Ajouter `createdAt` et `updatedAt` aux routes POST/PUT du serveur
    </context>
    <output>Story implemented, status changed to review</output>
  </step>

  <step n="3" name="CODE-REVIEW">
    <command>/bmad-code-review</command>
    <scope>client/src/pages/Dashboard.jsx, server/index.js (POST/PUT timestamps)</scope>
    <action>Auto-correct ALL issues. Re-run until clean.</action>
  </step>

  <step n="4" name="TEST-GATE">
    <commands>
      1. rtk npm run dev (0 erreurs)
      2. Smoke test: Finances → ajouter dépense → naviguer vers Dashboard → vérifier widget Finances mis à jour
      3. Smoke test: Tasks → terminer une tâche → Dashboard → vérifier widget Tâches mis à jour
      4. Smoke test: Dashboard → vérifier que les activités récentes ont des timestamps corrects
      5. Smoke test: Dashboard → vérifier que le graphique affiche des barres par mois (pas par type)
    </commands>
  </step>
</pipeline>

### Story Context for Dev Agent

**What needs to change:** Corriger le rafraîchissement, les timestamps et le graphique du dashboard.

**Key files to modify:**

| Fichier | Changement |
|---------|-----------|
| `client/src/pages/Dashboard.jsx` | useEffect avec `location.key` pour forcer refetch |
| `client/src/pages/Dashboard.jsx` | Activités récentes: utiliser `date` ou `updatedAt` |
| `client/src/pages/Dashboard.jsx` | ExpenseChart: grouper par mois au lieu de par type |
| `server/index.js` | POST tasks/finances: ajouter `createdAt: new Date().toISOString()` |
| `server/index.js` | PUT tasks/finances: ajouter `updatedAt: new Date().toISOString()` |

**Fix refetch au montage:**

```jsx
import { useLocation } from 'react-router-dom'

function Dashboard() {
  const location = useLocation()

  useEffect(() => {
    fetchAll()
  }, [location.key]) // Force refetch à chaque navigation vers le dashboard

  async function fetchAll() {
    // fetch tasks, finances, subscriptions, shopping...
  }
}
```

**Fix ExpenseChart — grouper par mois:**

```jsx
// AVANT: groupe par type
const chartData = Object.entries(
  finances.reduce((acc, f) => { acc[f.type] = (acc[f.type] || 0) + f.amount; return acc }, {})
)

// APRÈS: groupe par mois
const chartData = Object.entries(
  finances.reduce((acc, f) => {
    const month = new Date(f.date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
    acc[month] = (acc[month] || 0) + f.amount
    return acc
  }, {})
).sort((a, b) => new Date('01 ' + a[0]) - new Date('01 ' + b[0]))
```

**Timestamps serveur — pattern POST:**

```javascript
// Dans CHAQUE route POST (tasks, finances, subscriptions, recipes, shopping):
const item = {
  id: genId(items, prefix),
  ...req.body,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Dans CHAQUE route PUT:
Object.assign(item, req.body, { updatedAt: new Date().toISOString() });
```
