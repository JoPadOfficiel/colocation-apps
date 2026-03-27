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

- Branch: `feat/epic-12-reglages-bugfix` from `main`
- All commands prefixed with `rtk` for token optimization
- Test Gate after EVERY story: `rtk npm run dev` (zero errors), curl API tests, manual smoke test
- JavaScript uniquement — PAS de TypeScript
- Backend = CommonJS (`require`), Frontend = ESM (`import`)
- Commit after each successful story
- IMPORTANT: Toutes les réponses API wrappées `{ data: ... }` ou `{ error: "..." }`
- DEPENDENCY: Epic 10 (Story 10.1) MUST be completed before starting this epic

---

## Story 12.1 — Modification Complète du Profil

> **Story file:** `_bmad-output/implementation-artifacts/stories/12.1-modification-profil.md`
> **Priority:** P1 | **Phase:** 7 | **Risk:** LOW
> **Epic:** 12 — Réglages — Gestion Membres, Profil & Compte
> **Dependency:** Story 10.1

---

### Implementation Pipeline

<pipeline>
  <step n="1" name="CREATE-STORY" condition="SKIP — story already exists at ready-for-dev">
    <command>/bmad-create-story 12.1</command>
    <status>SKIP</status>
  </step>

  <step n="2" name="DEV-STORY" condition="story-status-is-ready-for-dev">
    <command>/bmad-dev-story @_bmad-output/implementation-artifacts/stories/12.1-modification-profil.md</command>
    <context>
      - ACTUELLEMENT: Le formulaire profil (nom/email) existe et appelle updateUser API — fonctionne partiellement
      - MANQUANT: Pas de formulaire de changement de mot de passe
      - MANQUANT: Après modification, la sidebar/header ne se met pas à jour (AuthContext pas rafraîchi)
      - OBJECTIF: Ajouter formulaire mot de passe (ancien + nouveau + confirmation)
      - OBJECTIF: PUT /api/users/:id doit vérifier l'ancien mot de passe si un nouveau est fourni
      - OBJECTIF: Après modification, mettre à jour AuthContext + sessionStorage + sidebar
    </context>
    <output>Story implemented, status changed to review</output>
  </step>

  <step n="3" name="CODE-REVIEW">
    <command>/bmad-code-review</command>
    <scope>server/index.js (PUT /api/users/:id), client/src/pages/Settings.jsx, client/src/contexts/AuthContext.jsx</scope>
    <action>Auto-correct ALL issues. Re-run until clean.</action>
  </step>

  <step n="4" name="TEST-GATE">
    <commands>
      1. rtk npm run dev (0 erreurs)
      2. curl -s -X PUT http://localhost:3001/api/users/user-1 -H "Content-Type: application/json" -d '{"name":"Jopad Updated"}' | jq '.data.name'
      3. curl -s -X PUT http://localhost:3001/api/users/user-1 -H "Content-Type: application/json" -d '{"oldPassword":"wrong","newPassword":"newpass123"}' | jq
      4. # Vérifier: erreur "Ancien mot de passe incorrect"
      5. curl -s -X PUT http://localhost:3001/api/users/user-1 -H "Content-Type: application/json" -d '{"oldPassword":"password123","newPassword":"newpass123"}' | jq
      6. # Vérifier: succès
      7. Smoke test: Settings → modifier nom → vérifier sidebar mise à jour
      8. Smoke test: Settings → changer mot de passe → déconnexion → reconnexion avec nouveau mdp
    </commands>
  </step>
</pipeline>

### Story Context for Dev Agent

**What needs to change:** Ajouter le formulaire de changement de mot de passe et synchroniser le profil après modification.

**Key files to modify:**

| Fichier | Changement |
|---------|-----------|
| `server/index.js` | Modifier `PUT /api/users/:id` : vérifier oldPassword si newPassword fourni |
| `client/src/pages/Settings.jsx` | Ajouter section "Changer le mot de passe" avec 3 champs |
| `client/src/contexts/AuthContext.jsx` | Ajouter `updateUser(userData)` qui met à jour state + sessionStorage |
| `client/src/pages/Settings.jsx` | Après handleSubmit succès, appeler `updateUser()` de AuthContext |

**Route PUT /api/users/:id modifiée:**

```javascript
app.put('/api/users/:id', (req, res) => {
  const users = db.read('users');
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

  const { name, email, oldPassword, newPassword } = req.body;

  // Changement de mot de passe
  if (newPassword) {
    if (!oldPassword) return res.status(400).json({ error: 'Ancien mot de passe requis' });
    if (user.password !== oldPassword) return res.status(403).json({ error: 'Ancien mot de passe incorrect' });
    if (newPassword.length < 8) return res.status(400).json({ error: 'Le nouveau mot de passe doit faire au moins 8 caractères' });
    user.password = newPassword;
  }

  if (name) user.name = name;
  if (email) user.email = email;

  db.write('users', users);
  res.json({ data: stripPassword(user) });
});
```

---

---

## Story 12.2 — Gestion des Membres (Admin)

> **Story file:** `_bmad-output/implementation-artifacts/stories/12.2-gestion-membres-admin.md`
> **Priority:** P1 | **Phase:** 8 | **Risk:** MEDIUM
> **Epic:** 12 — Réglages — Gestion Membres, Profil & Compte
> **Dependency:** Story 10.1 + Story 10.2

---

### Implementation Pipeline

<pipeline>
  <step n="1" name="CREATE-STORY" condition="SKIP — story already exists at ready-for-dev">
    <command>/bmad-create-story 12.2</command>
    <status>SKIP</status>
  </step>

  <step n="2" name="DEV-STORY" condition="story-status-is-ready-for-dev">
    <command>/bmad-dev-story @_bmad-output/implementation-artifacts/stories/12.2-gestion-membres-admin.md</command>
    <context>
      - ACTUELLEMENT: La liste des membres s'affiche mais AUCUNE action n'est possible
      - Pas de menu contextuel, pas de modification de rôle, pas d'exclusion
      - OBJECTIF: Menu dropdown par membre avec "Promouvoir Admin", "Rétrograder Membre", "Exclure"
      - Nouvelles routes: PUT /api/colocation/:id/members/:userId (changer rôle) + DELETE (exclure)
      - Protection: impossible de supprimer le dernier admin
      - Utiliser DropdownMenu de shadcn/ui pour le menu contextuel
    </context>
    <output>Story implemented, status changed to review</output>
  </step>

  <step n="3" name="CODE-REVIEW">
    <command>/bmad-code-review</command>
    <scope>server/index.js (routes members), client/src/pages/Settings.jsx (DropdownMenu)</scope>
    <action>Auto-correct ALL issues. Re-run until clean.</action>
  </step>

  <step n="4" name="TEST-GATE">
    <commands>
      1. rtk npm run dev (0 erreurs)
      2. curl -s -X PUT http://localhost:3001/api/colocation/coloc-1/members/user-2 -H "Content-Type: application/json" -d '{"role":"admin"}' | jq
      3. # Vérifier: user-2 est maintenant admin
      4. curl -s -X DELETE http://localhost:3001/api/colocation/coloc-1/members/user-3 | jq
      5. # Vérifier: user-3 retiré de la colocation
      6. # Tester protection dernier admin:
      7. curl -s -X PUT http://localhost:3001/api/colocation/coloc-1/members/user-1 -H "Content-Type: application/json" -d '{"role":"member"}' | jq
      8. # Si user-1 est le seul admin → erreur
      9. Smoke test: Settings → cliquer menu membre → Promouvoir → vérifier badge rôle mis à jour
      10. Smoke test: Settings → cliquer menu membre → Exclure → confirmer → membre disparu
    </commands>
  </step>
</pipeline>

### Story Context for Dev Agent

**What needs to change:** Ajouter la gestion complète des membres par l'admin (rôle + exclusion).

**2 nouvelles routes dans server/index.js:**

```javascript
// Modifier le rôle d'un membre
app.put('/api/colocation/:id/members/:userId', (req, res) => {
  const colocations = db.read('colocation');
  const coloc = Array.isArray(colocations)
    ? colocations.find(c => c.id === req.params.id)
    : colocations;
  if (!coloc) return res.status(404).json({ error: 'Colocation non trouvée' });

  const member = coloc.members.find(m => m.userId === req.params.userId);
  if (!member) return res.status(404).json({ error: 'Membre non trouvé' });

  const { role } = req.body;
  if (!['admin', 'member'].includes(role)) return res.status(400).json({ error: 'Rôle invalide' });

  // Protection dernier admin
  if (member.role === 'admin' && role === 'member') {
    const adminCount = coloc.members.filter(m => m.role === 'admin').length;
    if (adminCount <= 1) return res.status(400).json({ error: 'Impossible: vous êtes le seul admin. Promouvez un autre membre d\'abord.' });
  }

  member.role = role;
  db.write('colocation', colocations);
  res.json({ data: coloc });
});

// Exclure un membre
app.delete('/api/colocation/:id/members/:userId', (req, res) => {
  const colocations = db.read('colocation');
  const coloc = Array.isArray(colocations)
    ? colocations.find(c => c.id === req.params.id)
    : colocations;
  if (!coloc) return res.status(404).json({ error: 'Colocation non trouvée' });

  const memberIdx = coloc.members.findIndex(m => m.userId === req.params.userId);
  if (memberIdx === -1) return res.status(404).json({ error: 'Membre non trouvé' });

  // Protection: ne pas exclure le dernier admin
  const member = coloc.members[memberIdx];
  if (member.role === 'admin') {
    const adminCount = coloc.members.filter(m => m.role === 'admin').length;
    if (adminCount <= 1) return res.status(400).json({ error: 'Impossible d\'exclure le dernier admin' });
  }

  coloc.members.splice(memberIdx, 1);
  db.write('colocation', colocations);

  // Retirer la colocationId de l'utilisateur
  const users = db.read('users');
  const user = users.find(u => u.id === req.params.userId);
  if (user) { user.colocationId = null; db.write('users', users); }

  res.json({ data: coloc });
});
```

---

---

## Story 12.3 — Suppression de Compte et de Colocation

> **Story file:** `_bmad-output/implementation-artifacts/stories/12.3-suppression-compte-colocation.md`
> **Priority:** P1 | **Phase:** 9 | **Risk:** HIGH
> **Epic:** 12 — Réglages — Gestion Membres, Profil & Compte
> **Dependency:** Story 12.2

---

### Implementation Pipeline

<pipeline>
  <step n="1" name="CREATE-STORY" condition="SKIP — story already exists at ready-for-dev">
    <command>/bmad-create-story 12.3</command>
    <status>SKIP</status>
  </step>

  <step n="2" name="DEV-STORY" condition="story-status-is-ready-for-dev">
    <command>/bmad-dev-story @_bmad-output/implementation-artifacts/stories/12.3-suppression-compte-colocation.md</command>
    <context>
      - ACTUELLEMENT: Le bouton "Supprimer le compte" existe mais a ZERO onClick handler
      - Pas de route DELETE /api/users/:id
      - Pas de route DELETE /api/colocation/:id
      - OBJECTIF: Implémenter les 2 routes + handlers UI + double confirmation
      - Suppression compte: retirer de la colocation, supprimer le user, logout
      - Suppression colocation (admin only): cascade delete (tâches, finances, etc.), logout tous les membres
      - Double confirmation pour suppression colocation: re-saisir le nom
      - Utiliser AlertDialog de shadcn/ui
    </context>
    <output>Story implemented, status changed to review</output>
  </step>

  <step n="3" name="CODE-REVIEW">
    <command>/bmad-code-review</command>
    <scope>server/index.js (DELETE routes), client/src/pages/Settings.jsx (AlertDialog, handlers)</scope>
    <action>Auto-correct ALL issues. Re-run until clean.</action>
  </step>

  <step n="4" name="TEST-GATE">
    <commands>
      1. rtk npm run dev (0 erreurs)
      2. # Test suppression utilisateur (créer un user test d'abord)
      3. curl -s -X POST http://localhost:3001/api/auth/register -H "Content-Type: application/json" -d '{"name":"Test Delete","email":"delete@test.com","password":"password123"}' | jq '.data.id'
      4. curl -s -X DELETE http://localhost:3001/api/users/USER_ID_FROM_ABOVE | jq
      5. # Vérifier: user supprimé
      6. # Test suppression colocation
      7. curl -s -X DELETE http://localhost:3001/api/colocation/coloc-test -H "Content-Type: application/json" -d '{"confirmName":"Test Coloc"}' | jq
      8. Smoke test: Settings → "Supprimer le compte" → confirmer → redirigé vers /login
      9. Smoke test (admin): Settings → "Supprimer la colocation" → saisir nom → confirmer → redirigé vers /login
    </commands>
  </step>
</pipeline>

### Story Context for Dev Agent

**What needs to change:** Implémenter la suppression de compte et de colocation avec confirmation.

**Key files to modify:**

| Fichier | Changement |
|---------|-----------|
| `server/index.js` | Nouvelle route `DELETE /api/users/:id` |
| `server/index.js` | Nouvelle route `DELETE /api/colocation/:id` (cascade) |
| `client/src/pages/Settings.jsx` | Ajouter onClick au bouton "Supprimer le compte" |
| `client/src/pages/Settings.jsx` | Ajouter bouton "Supprimer la colocation" (admin only) |
| `client/src/pages/Settings.jsx` | 2 AlertDialog (compte + colocation) |
| `client/src/contexts/AuthContext.jsx` | Appeler `logout()` après suppression |

**Route DELETE /api/colocation/:id (cascade):**

```javascript
app.delete('/api/colocation/:id', (req, res) => {
  const colocations = db.read('colocation');
  const idx = Array.isArray(colocations)
    ? colocations.findIndex(c => c.id === req.params.id)
    : -1;
  if (idx === -1) return res.status(404).json({ error: 'Colocation non trouvée' });

  const coloc = colocations[idx];
  const { confirmName } = req.body;
  if (confirmName !== coloc.name) return res.status(400).json({ error: 'Le nom de confirmation ne correspond pas' });

  // Cascade delete
  const entities = ['tasks', 'finances', 'subscriptions', 'recipes', 'shopping'];
  entities.forEach(entity => {
    const data = db.read(entity).filter(item => item.colocationId !== req.params.id);
    db.write(entity, data);
  });

  // Retirer colocationId des utilisateurs
  const users = db.read('users');
  coloc.members.forEach(m => {
    const user = users.find(u => u.id === m.userId);
    if (user) user.colocationId = null;
  });
  db.write('users', users);

  // Supprimer la colocation
  colocations.splice(idx, 1);
  db.write('colocation', colocations);

  res.json({ data: { message: 'Colocation supprimée' } });
});
```

---

---

## Story 12.4 — Persistance des Notifications

> **Story file:** `_bmad-output/implementation-artifacts/stories/12.4-persistance-notifications.md`
> **Priority:** P2 | **Phase:** 10 | **Risk:** LOW
> **Epic:** 12 — Réglages — Gestion Membres, Profil & Compte
> **Dependency:** Story 12.1

---

### Implementation Pipeline

<pipeline>
  <step n="1" name="CREATE-STORY" condition="SKIP — story already exists at ready-for-dev">
    <command>/bmad-create-story 12.4</command>
    <status>SKIP</status>
  </step>

  <step n="2" name="DEV-STORY" condition="story-status-is-ready-for-dev">
    <command>/bmad-dev-story @_bmad-output/implementation-artifacts/stories/12.4-persistance-notifications.md</command>
    <context>
      - ACTUELLEMENT: Les 2 Switch (email/push) changent le state local MAIS ne persistent rien
      - Pas de champ emailNotifications/pushNotifications dans le modèle utilisateur
      - OBJECTIF: Ajouter ces champs au user, initialiser depuis l'API, persister via PUT /api/users/:id
      - Pattern optimiste: toggle immédiat visuellement, appel API en background, rollback si erreur
    </context>
    <output>Story implemented, status changed to review</output>
  </step>

  <step n="3" name="CODE-REVIEW">
    <command>/bmad-code-review</command>
    <scope>server/data/mockData.js, server/index.js (PUT /api/users/:id), client/src/pages/Settings.jsx</scope>
    <action>Auto-correct ALL issues. Re-run until clean.</action>
  </step>

  <step n="4" name="TEST-GATE">
    <commands>
      1. rtk npm run dev (0 erreurs)
      2. curl -s -X PUT http://localhost:3001/api/users/user-1 -H "Content-Type: application/json" -d '{"emailNotifications":false}' | jq '.data.emailNotifications'
      3. # Vérifier: false
      4. Smoke test: Settings → toggle email OFF → refresh page → vérifier toggle toujours OFF
    </commands>
  </step>
</pipeline>

### Story Context for Dev Agent

**What needs to change:** Ajouter les préférences de notifications au modèle utilisateur et les persister.

**Key files to modify:**

| Fichier | Changement |
|---------|-----------|
| `server/data/mockData.js` | Ajouter `emailNotifications: true, pushNotifications: true` à chaque user |
| `server/index.js` | `PUT /api/users/:id` : accepter `emailNotifications`, `pushNotifications` |
| `client/src/pages/Settings.jsx` | Initialiser les toggles depuis `user.emailNotifications` |
| `client/src/pages/Settings.jsx` | Au toggle, appeler `PUT /api/users/:id` avec la nouvelle valeur |

**Pattern optimiste dans Settings.jsx:**

```jsx
async function handleToggleEmail(checked) {
  const prev = emailNotifications
  setEmailNotifications(checked) // Optimiste
  try {
    await request(`/api/users/${user.id}`, {
      method: 'PUT',
      body: JSON.stringify({ emailNotifications: checked })
    })
  } catch {
    setEmailNotifications(prev) // Rollback
  }
}
```
