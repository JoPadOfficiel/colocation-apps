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

- Branch: `feat/epic-11-finances-bugfix` from `main`
- All commands prefixed with `rtk` for token optimization
- Test Gate after EVERY story: `rtk npm run dev` (zero errors client + server), curl API tests, manual smoke test
- JavaScript uniquement — PAS de TypeScript
- Backend = CommonJS (`require`), Frontend = ESM (`import`)
- Commit after each successful story
- IMPORTANT: Toutes les réponses API wrappées `{ data: ... }` ou `{ error: "..." }`
- DEPENDENCY: Epic 10 (Story 10.1) MUST be completed before starting this epic

---

## Story 11.1 — Alimenter la Cagnotte Commune

> **Story file:** `_bmad-output/implementation-artifacts/stories/11.1-alimenter-cagnotte.md`
> **Priority:** P0 | **Phase:** 4 | **Risk:** MEDIUM
> **Epic:** 11 — Finances — Cagnotte, Dépenses & Graphiques
> **Dependency:** Story 10.1 (filtrage API)

---

### Implementation Pipeline

<pipeline>
  <step n="1" name="CREATE-STORY" condition="SKIP — story already exists at ready-for-dev">
    <command>/bmad-create-story 11.1</command>
    <status>SKIP</status>
  </step>

  <step n="2" name="DEV-STORY" condition="story-status-is-ready-for-dev">
    <command>/bmad-dev-story @_bmad-output/implementation-artifacts/stories/11.1-alimenter-cagnotte.md</command>
    <fallback>Read and execute: .claude/skills/bmad-dev-story/workflow.md with story file as input</fallback>
    <context>
      - ACTUELLEMENT: La cagnotte affiche `colocation.totalFund` (245.50€) mais AUCUN moyen de l'augmenter
      - Pas de bouton "Ajouter à la cagnotte", pas de route PUT /api/colocation/:id
      - OBJECTIF: Bouton + Dialog pour ajouter de l'argent, route API pour incrémenter totalFund
      - Chaque contribution doit être tracée comme une entrée finance de type 'contribution'
      - Les contributions ne doivent PAS être comptées dans le calcul d'équilibre (dettes/créances)
      - La card Cagnotte doit se mettre à jour immédiatement après ajout
    </context>
    <output>Story implemented, status changed to review</output>
  </step>

  <step n="3" name="CODE-REVIEW">
    <command>/bmad-code-review</command>
    <scope>server/index.js (PUT /api/colocation/:id), client/src/pages/Finances.jsx (Dialog + bouton), client/src/lib/api.js</scope>
    <action>Auto-correct ALL issues. Re-run until clean.</action>
  </step>

  <step n="4" name="TEST-GATE">
    <commands>
      1. rtk npm run dev (0 erreurs)
      2. curl -s -X PUT http://localhost:3001/api/colocation/coloc-1 -H "Content-Type: application/json" -d '{"totalFund":50}' | jq
      3. # Vérifier: totalFund augmenté de 50
      4. curl -s http://localhost:3001/api/finances?colocationId=coloc-1 | jq '.data[-1]'
      5. # Vérifier: dernière entrée = type 'contribution', montant 50
      6. curl -s -X PUT http://localhost:3001/api/colocation/coloc-1 -H "Content-Type: application/json" -d '{"totalFund":-10}' | jq
      7. # Vérifier: erreur 400 (montant négatif refusé)
      8. Smoke test: Finances → cliquer "Ajouter à la cagnotte" → saisir 50€ → vérifier card mise à jour
    </commands>
  </step>
</pipeline>

### Story Context for Dev Agent

**What needs to change:** Ajouter un bouton + dialog pour alimenter la cagnotte et créer la route API correspondante.

**Key files to modify:**

| Fichier | Changement |
|---------|-----------|
| `server/index.js` | Nouvelle route `PUT /api/colocation/:id` pour incrémenter `totalFund` |
| `server/index.js` | Modifier `POST /api/finances` pour accepter `type: 'contribution'` |
| `client/src/pages/Finances.jsx` | Nouveau bouton "Ajouter à la cagnotte" sur la card Cagnotte |
| `client/src/pages/Finances.jsx` | Nouveau Dialog avec champ montant + validation |
| `client/src/lib/api.js` | Helper `updateColocation(id, data)` |
| `client/src/pages/Finances.jsx` | Exclure les `type: 'contribution'` du calcul d'équilibre |

**Route PUT /api/colocation/:id:**

```javascript
app.put('/api/colocation/:id', (req, res) => {
  const colocations = db.read('colocation');
  const coloc = Array.isArray(colocations)
    ? colocations.find(c => c.id === req.params.id)
    : (colocations.id === req.params.id ? colocations : null);
  if (!coloc) return res.status(404).json({ error: 'Colocation non trouvée' });
  const { totalFund, name } = req.body;
  if (totalFund !== undefined) {
    if (totalFund < 0) return res.status(400).json({ error: 'Le montant doit être positif' });
    coloc.totalFund = (coloc.totalFund || 0) + totalFund;
  }
  if (name) coloc.name = name;
  db.write('colocation', colocations);
  res.json({ data: coloc });
});
```

**Dialog dans Finances.jsx (pattern):**

```jsx
// État
const [showFundDialog, setShowFundDialog] = useState(false)
const [fundAmount, setFundAmount] = useState('')

// Dans la card Cagnotte Commune, ajouter:
<Button size="sm" onClick={() => setShowFundDialog(true)}>
  <Plus className="h-4 w-4 mr-1" /> Ajouter
</Button>

// Dialog
<Dialog open={showFundDialog} onOpenChange={setShowFundDialog}>
  <DialogContent>
    <DialogHeader><DialogTitle>Ajouter à la cagnotte</DialogTitle></DialogHeader>
    <Input type="number" min="1" value={fundAmount} onChange={e => setFundAmount(e.target.value)} placeholder="Montant (€)" />
    <DialogFooter>
      <Button variant="outline" onClick={() => setShowFundDialog(false)}>Annuler</Button>
      <Button onClick={handleAddFund}>Ajouter</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Critical constraints:**

- Le montant ajouté à la cagnotte est un INCRÉMENT, pas un remplacement (totalFund += amount)
- Les contributions (`type: 'contribution'`) doivent être visibles dans le tableau d'historique mais EXCLUES du calcul d'équilibre
- Validation: montant > 0, entier ou décimal, pas de texte
- Après ajout, refetch les données pour mettre à jour TOUTES les cards (cagnotte + tendance)

---

---

## Story 11.2 — Distinction Dépenses Partagées vs Personnelles

> **Story file:** `_bmad-output/implementation-artifacts/stories/11.2-depenses-partagees-personnelles.md`
> **Priority:** P0 | **Phase:** 5 | **Risk:** MEDIUM
> **Epic:** 11 — Finances — Cagnotte, Dépenses & Graphiques
> **Dependency:** Story 11.1

---

### Implementation Pipeline

<pipeline>
  <step n="1" name="CREATE-STORY" condition="SKIP — story already exists at ready-for-dev">
    <command>/bmad-create-story 11.2</command>
    <status>SKIP</status>
  </step>

  <step n="2" name="DEV-STORY" condition="story-status-is-ready-for-dev">
    <command>/bmad-dev-story @_bmad-output/implementation-artifacts/stories/11.2-depenses-partagees-personnelles.md</command>
    <context>
      - ACTUELLEMENT: Toutes les dépenses sont traitées comme partagées — pas de distinction
      - OBJECTIF: Ajouter un champ `shared: true|false` au modèle Finance
      - Le Dialog d'ajout doit proposer un toggle "Partagée / Personnelle"
      - Le calcul d'équilibre ne doit prendre en compte que les dépenses `shared: true`
      - Le tableau doit afficher un badge "Partagée" (bleu) ou "Personnelle" (gris)
      - Les données mockées existantes doivent être mises à jour avec `shared: true` par défaut
    </context>
    <output>Story implemented, status changed to review</output>
  </step>

  <step n="3" name="CODE-REVIEW">
    <command>/bmad-code-review</command>
    <scope>server/data/mockData.js, server/index.js (POST/PUT finances), client/src/pages/Finances.jsx, client/src/pages/Dashboard.jsx</scope>
    <action>Auto-correct ALL issues. Re-run until clean.</action>
  </step>

  <step n="4" name="TEST-GATE">
    <commands>
      1. rtk npm run dev (0 erreurs)
      2. curl -s -X POST http://localhost:3001/api/finances -H "Content-Type: application/json" -d '{"title":"Test perso","amount":25,"paidBy":"user-1","date":"2026-03-27","type":"shopping","shared":false,"colocationId":"coloc-1"}' | jq
      3. # Vérifier: shared: false dans la réponse
      4. curl -s http://localhost:3001/api/finances?colocationId=coloc-1 | jq '.data[-1].shared'
      5. Smoke test: Finances → ajouter dépense personnelle → vérifier badge "Personnelle" → vérifier que l'équilibre N'a PAS changé
      6. Smoke test: Finances → ajouter dépense partagée → vérifier badge "Partagée" → vérifier que l'équilibre A changé
    </commands>
  </step>
</pipeline>

### Story Context for Dev Agent

**What needs to change:** Ajouter la distinction dépenses partagées/personnelles avec impact sur le calcul d'équilibre.

**Key files to modify:**

| Fichier | Changement |
|---------|-----------|
| `server/data/mockData.js` | Ajouter `shared: true` à toutes les finances existantes |
| `server/index.js` | POST/PUT finances: accepter et sauvegarder le champ `shared` |
| `client/src/pages/Finances.jsx` | Toggle dans le Dialog d'ajout + badge dans le tableau |
| `client/src/pages/Finances.jsx` | Modifier `calculateBalance()` : filtrer `shared: true` uniquement |
| `client/src/pages/Dashboard.jsx` | Si l'équilibre y est affiché, même filtre |

**Calcul d'équilibre modifié:**

```javascript
// AVANT: prend TOUTES les dépenses
const total = finances.reduce((sum, f) => sum + f.amount, 0)

// APRÈS: ne prend que les dépenses partagées
const sharedExpenses = finances.filter(f => f.shared === true && f.type !== 'contribution')
const total = sharedExpenses.reduce((sum, f) => sum + f.amount, 0)
```

---

---

## Story 11.3 — Mise à Jour des Tarifs et Tendance Réelle

> **Story file:** `_bmad-output/implementation-artifacts/stories/11.3-tarifs-tendance-reelle.md`
> **Priority:** P1 | **Phase:** 6 | **Risk:** LOW
> **Epic:** 11 — Finances — Cagnotte, Dépenses & Graphiques
> **Dependency:** Story 11.1 + Story 11.2

---

### Implementation Pipeline

<pipeline>
  <step n="1" name="CREATE-STORY" condition="SKIP — story already exists at ready-for-dev">
    <command>/bmad-create-story 11.3</command>
    <status>SKIP</status>
  </step>

  <step n="2" name="DEV-STORY" condition="story-status-is-ready-for-dev">
    <command>/bmad-dev-story @_bmad-output/implementation-artifacts/stories/11.3-tarifs-tendance-reelle.md</command>
    <context>
      - ACTUELLEMENT: Tendance = `cagnotte * 0.18` (FAKE, hardcodé)
      - ACTUELLEMENT: Graphique finances = 1 seul mois (mars) car toutes les données seed sont en mars
      - OBJECTIF 1: Calculer la vraie tendance (mois N vs mois N-1)
      - OBJECTIF 2: Ajouter des données seed sur plusieurs mois (jan, fév, mars 2026)
      - OBJECTIF 3: Le graphique FinancesChart doit grouper par mois et afficher tous les mois disponibles
      - OBJECTIF 4: Après chaque POST/PUT/DELETE, refetch et recalculer tous les soldes
    </context>
    <output>Story implemented, status changed to review</output>
  </step>

  <step n="3" name="CODE-REVIEW">
    <command>/bmad-code-review</command>
    <scope>client/src/pages/Finances.jsx (tendance + refetch), client/src/pages/Dashboard.jsx (ExpenseChart), server/data/mockData.js (seed multi-mois)</scope>
    <action>Auto-correct ALL issues. Re-run until clean.</action>
  </step>

  <step n="4" name="TEST-GATE">
    <commands>
      1. rtk npm run dev (0 erreurs)
      2. Smoke test: Finances → vérifier que la tendance affiche un montant réaliste (pas cagnotte*0.18)
      3. Smoke test: Finances → vérifier que le graphique affiche jan, fév, mars (3 barres minimum)
      4. Smoke test: Ajouter dépense → vérifier que les 3 cards se mettent à jour immédiatement
      5. Smoke test: Dashboard → vérifier que le graphique dépenses montre aussi plusieurs mois
    </commands>
  </step>
</pipeline>

### Story Context for Dev Agent

**What needs to change:** Remplacer la tendance fake, ajouter des données multi-mois, corriger le graphique.

**Calcul de tendance réelle:**

```javascript
// SUPPRIMER:
const tendanceCalculee = cagnotteActuelle * 0.18;

// REMPLACER PAR:
function calculateTrend(finances) {
  const now = new Date()
  const thisMonth = now.getMonth()
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1
  const thisYear = now.getFullYear()
  const lastYear = thisMonth === 0 ? thisYear - 1 : thisYear

  const thisMonthTotal = finances
    .filter(f => { const d = new Date(f.date); return d.getMonth() === thisMonth && d.getFullYear() === thisYear })
    .reduce((sum, f) => sum + f.amount, 0)

  const lastMonthTotal = finances
    .filter(f => { const d = new Date(f.date); return d.getMonth() === lastMonth && d.getFullYear() === lastYear })
    .reduce((sum, f) => sum + f.amount, 0)

  return thisMonthTotal - lastMonthTotal
}
```

**Données seed à ajouter dans mockData.js (janvier + février 2026):**

```javascript
// Ajouter ~5 entrées en janvier et ~5 en février
{ id: 'fin-20', title: 'Courses Leclerc', amount: 67.30, type: 'shopping', paidBy: 'user-1', date: '2026-01-15T10:00:00Z', shared: true, colocationId: 'coloc-1' },
{ id: 'fin-21', title: 'Électricité janvier', amount: 62.54, type: 'utility', paidBy: 'user-3', date: '2026-01-20T10:00:00Z', shared: true, colocationId: 'coloc-1' },
// ... etc
```

---

---

## Story 11.4 — Correction du Select "Payé par" dans le Dialog

> **Story file:** `_bmad-output/implementation-artifacts/stories/11.4-correction-select-dialog.md`
> **Priority:** P1 | **Phase:** 7 | **Risk:** LOW
> **Epic:** 11 — Finances — Cagnotte, Dépenses & Graphiques
> **Dependency:** Story 13.1 (correction globale Select) OU indépendant si fix natif

---

### Implementation Pipeline

<pipeline>
  <step n="1" name="CREATE-STORY" condition="SKIP — story already exists at ready-for-dev">
    <command>/bmad-create-story 11.4</command>
    <status>SKIP</status>
  </step>

  <step n="2" name="DEV-STORY" condition="story-status-is-ready-for-dev">
    <command>/bmad-dev-story @_bmad-output/implementation-artifacts/stories/11.4-correction-select-dialog.md</command>
    <context>
      - PROBLÈME: Le Select @base-ui/react pour "Payé par" ne fonctionne pas dans le Dialog
      - Cause: conflit de portail z-index entre Select popup et Dialog overlay
      - FIX RAPIDE: Remplacer par un `<select>` natif HTML stylé avec Tailwind dans Finances.jsx
      - FIX ALTERNATIF: Utiliser le composant shadcn/ui Select (si Story 13.1 est faite avant)
      - Vérifier que le onChange transmet l'ID utilisateur et que l'affichage montre le nom
    </context>
    <output>Story implemented, status changed to review</output>
  </step>

  <step n="3" name="CODE-REVIEW">
    <command>/bmad-code-review</command>
    <scope>client/src/pages/Finances.jsx (Select dans Dialog)</scope>
    <action>Auto-correct ALL issues. Re-run until clean.</action>
  </step>

  <step n="4" name="TEST-GATE">
    <commands>
      1. rtk npm run dev (0 erreurs)
      2. Smoke test: Finances → "AJOUTER DÉPENSE" → cliquer sur "Payé par" → vérifier que la liste s'ouvre
      3. Smoke test: Sélectionner un membre → vérifier que le NOM s'affiche (pas l'ID)
      4. Smoke test: Valider la dépense → vérifier que le bon paidBy est enregistré
    </commands>
  </step>
</pipeline>

### Story Context for Dev Agent

**What needs to change:** Remplacer le composant Select cassé par un select natif fonctionnel dans le Dialog des finances.

**Fix — remplacer dans Finances.jsx:**

```jsx
// AVANT (@base-ui/react Select cassé dans Dialog):
<Select value={form.paidBy} onValueChange={v => setForm({...form, paidBy: v})}>
  <SelectTrigger>
    <SelectValue>{...}</SelectValue>
  </SelectTrigger>
  <SelectContent>
    {members.map(m => <SelectItem key={m.userId} value={m.userId}>{m.name}</SelectItem>)}
  </SelectContent>
</Select>

// APRÈS (select natif HTML stylé):
<select
  value={form.paidBy}
  onChange={e => setForm({...form, paidBy: e.target.value})}
  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
>
  <option value="">Sélectionner le payeur</option>
  {members.map(m => (
    <option key={m.userId} value={m.userId}>{m.name}</option>
  ))}
</select>
```

**Critical constraints:**

- Le `value` doit être l'ID utilisateur (`m.userId`), le texte visible doit être le nom (`m.name`)
- Appliquer le même fix à TOUS les Select dans des Dialog de cette page (paidBy, type)
- Si Story 13.1 est implémentée avant, utiliser le composant shadcn/ui Select corrigé plutôt que le natif
