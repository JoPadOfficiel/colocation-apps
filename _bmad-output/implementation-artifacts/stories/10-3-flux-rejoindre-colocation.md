---
title: "Story 10.3 : Flux Rejoindre une colocation fonctionnel"
epic: "Epic 10 : Isolation des Donnees & Suppression des Donnees Mockees"
status: "todo"
assignee: "Jopad"
priority: "critical"
dependencies:
  - "story-10.1"
  - "story-10.2"
---

# Story 10.3 : Flux "Rejoindre une colocation" fonctionnel

Status: todo

## Description

Actuellement, le flux "Rejoindre une colocation" presente plusieurs problemes critiques :

1. **Pas de confirmation avant adhesion** : quand un utilisateur saisit un code d'invitation et clique "Rejoindre", il est immediatement ajoute a la colocation sans voir le nom ni les membres existants. Il n'a aucun moyen de verifier qu'il rejoint la bonne colocation.

2. **Le serveur ne gere qu'une seule colocation** : `server/index.js` stocke `colocation` comme un objet unique (pas un tableau). La route `POST /api/colocation/join` compare le code a cette seule colocation. Apres Story 10.2 (support multi-colocation), cette route devra chercher dans un tableau.

3. **Pas de verification "deja membre"** : un utilisateur deja dans une colocation peut tenter d'en rejoindre une autre sans avertissement.

4. **Le flux Login.jsx permet de rejoindre sans etre connecte** : la section "Rejoindre une colocation" sur la page Login envoie `userId: user?.id` qui sera `undefined` si l'utilisateur n'est pas connecte, ce qui ajoute personne.

Cette story corrige le flux complet : ajout d'une etape de preview/confirmation via un Dialog, gestion des erreurs, et mise a jour correcte de l'AuthContext.

## Story

As a **utilisateur connecte sans colocation**,
I want **rejoindre une colocation existante via un code d'invitation et voir une popup de confirmation avec le nom et les membres**,
So that **je suis correctement ajoute a la bonne colocation avec un feedback clair**.

## Acceptance Criteria

1. **Given** je suis connecte mais sans colocation (page Onboarding), **When** je saisis un code d'invitation valide (ex: `COLO-7829-X`) et clique "Rejoindre", **Then** un Dialog de confirmation s'affiche avec le nom de la colocation et la liste de ses membres actuels (noms + avatars).

2. **Given** le Dialog de confirmation est affiche, **When** je clique "Confirmer", **Then** je suis ajoute comme membre de la colocation, l'AuthContext et le sessionStorage sont mis a jour, et je suis redirige vers `/dashboard`.

3. **Given** le Dialog de confirmation est affiche, **When** je clique "Annuler", **Then** le Dialog se ferme et je reste sur la page Onboarding sans etre ajoute.

4. **Given** je saisis un code d'invitation invalide, **When** je clique "Rejoindre", **Then** un message d'erreur s'affiche : "Code d'invitation invalide" (pas de Dialog).

5. **Given** je suis deja membre d'une colocation, **When** je tente de rejoindre une autre colocation, **Then** un message m'informe : "Vous devez quitter votre colocation actuelle avant d'en rejoindre une autre".

6. **Given** je suis sur la page Login (non connecte), **When** je saisis un code dans la section "Rejoindre une colocation existante", **Then** je suis d'abord invite a me connecter ou creer un compte avant de pouvoir rejoindre.

## Tasks / Subtasks

### Task 1 : Creer la route API `POST /api/colocation/preview` (AC: #1, #4)

**Fichier :** `server/index.js`

Ajouter une nouvelle route qui valide le code d'invitation et retourne les informations de la colocation SANS ajouter le membre. Cette route est appelee avant la confirmation.

```javascript
// NEW: Preview colocation before joining
app.post('/api/colocation/preview', (req, res) => {
  const { code } = req.body || {};
  if (!code) return res.status(400).json({ error: 'Code requis' });
  if (colocation.invitationCode.toUpperCase() !== code.toUpperCase()) {
    return res.status(404).json({ error: "Code d'invitation invalide" });
  }
  res.json({ data: enrichColocation(colocation) });
});
```

- Endpoint: `POST /api/colocation/preview`
- Body: `{ "code": "COLO-7829-X" }`
- Success 200: `{ "data": { "id": "coloc-1", "name": "Colocation Jopad & Co", "members": [...enriched...] } }`
- Error 404: `{ "error": "Code d'invitation invalide" }`

### Task 2 : Modifier la route `POST /api/colocation/join` pour valider les pre-conditions (AC: #2, #5)

**Fichier :** `server/index.js`

Modifier la route existante (lignes 129-147) pour :
- Verifier que `userId` est fourni (sinon 400)
- Verifier que l'utilisateur n'est pas deja membre d'une autre colocation (sinon 409)
- Retourner la colocation enrichie avec les membres complets

```javascript
app.post('/api/colocation/join', (req, res) => {
  const { code, userId } = req.body || {};
  if (!code) return res.status(400).json({ error: 'Code requis' });
  if (!userId) return res.status(400).json({ error: 'userId requis' });

  // Verify user exists
  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouve' });

  // Check if user already belongs to a colocation
  if (user.colocationId && user.colocationId !== colocation.id && colocation.members.includes(user.colocationId)) {
    return res.status(409).json({ error: 'Vous devez quitter votre colocation actuelle avant d\'en rejoindre une autre' });
  }

  // Validate invitation code
  if (colocation.invitationCode.toUpperCase() !== code.toUpperCase()) {
    return res.status(404).json({ error: "Code d'invitation invalide" });
  }

  // Add member if not already in
  if (!colocation.members.includes(userId)) {
    colocation.members.push(userId);
    db.save('colocation', colocation);
  }
  user.colocationId = colocation.id;
  db.save('users', users);

  res.json({ data: enrichColocation(colocation) });
});
```

### Task 3 : Creer le composant `JoinConfirmDialog` (AC: #1, #2, #3)

**Nouveau fichier :** `client/src/components/JoinConfirmDialog.jsx`

Dialog shadcn/ui affichant les details de la colocation avant confirmation :

```
+-----------------------------------------------+
|  Rejoindre cette colocation ?                  |
|                                                |
|  Nom : Colocation Jopad & Co                   |
|                                                |
|  Membres actuels (3) :                         |
|  - Jocelin Padouano (Admin)                    |
|  - Yohan Dubois (Membre)                       |
|  - Luis-Manuel Garcia (Membre)                 |
|                                                |
|  [ Annuler ]          [ Confirmer et rejoindre ]|
+-----------------------------------------------+
```

- Props: `open`, `onClose`, `onConfirm`, `colocationData`, `loading`
- Composants shadcn/ui: `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `Button`, `Avatar`
- Afficher le nom de la colocation en gras
- Lister les membres avec leur nom et role (badge Admin/Membre)
- Bouton "Annuler" (variant outline) et "Confirmer et rejoindre" (variant default)

### Task 4 : Modifier `Onboarding.jsx` — flux en 2 etapes avec preview (AC: #1, #2, #3, #4)

**Fichier :** `client/src/pages/Onboarding.jsx`

Modifier la fonction `handleJoin` pour implementer le flux en 2 etapes :

1. **Etape 1 (preview)** : Appeler `POST /api/colocation/preview` avec le code. Si succes, stocker les data et ouvrir le `JoinConfirmDialog`. Si erreur, afficher le message.

2. **Etape 2 (confirm)** : Quand l'utilisateur confirme dans le Dialog, appeler `POST /api/colocation/join` avec `code` et `userId`. Mettre a jour AuthContext via `updateColocation()`, puis `navigate("/dashboard")`.

Changes specifiques :
- Ajouter les states : `previewData` (object|null), `showConfirmDialog` (boolean)
- `handleJoin` -> appelle `/api/colocation/preview` au lieu de `/api/colocation/join`
- Nouvelle fonction `handleConfirmJoin` -> appelle `/api/colocation/join`
- Importer et rendre `JoinConfirmDialog`

### Task 5 : Modifier `Login.jsx` — securiser le flux "Rejoindre" (AC: #6)

**Fichier :** `client/src/pages/Login.jsx`

Le formulaire "Rejoindre une colocation existante" (lignes 174-198) pose probleme : l'utilisateur n'est pas connecte donc `user?.id` est `undefined`.

Options (choisir une) :
- **Option A (recommandee)** : Modifier `handleJoin` pour d'abord verifier que `user` existe. Si non, stocker le code dans `sessionStorage` sous `colocapp_pendingJoinCode`, afficher un toast "Connectez-vous d'abord", et apres login reussie, detecter le code pending et rediriger vers le flux de join.
- **Option B (simple)** : Masquer la section "Rejoindre une colocation" si l'utilisateur n'est pas connecte, ou afficher un message "Connectez-vous d'abord pour rejoindre une colocation".

Implementation recommandee (Option B, plus simple) :
- Wrapper la Card "Rejoindre" dans une condition : si `!user`, afficher un texte "Connectez-vous ou creez un compte pour rejoindre une colocation avec un code d'invitation."
- Si `user` est present (cas rare sur Login), garder le formulaire actuel mais ajouter le meme flux preview/confirm que Onboarding.

### Task 6 : Mettre a jour AuthContext apres join (AC: #2)

**Fichier :** `client/src/contexts/AuthContext.jsx`

La fonction `updateColocation` (lignes 78-90) est deja correcte pour mettre a jour le state et sessionStorage. Verifier que :
- Apres `updateColocation(coloc)`, le `colocation` dans le context est bien mis a jour
- Le user dans sessionStorage a aussi son `colocationId` mis a jour

Ajouter une fonction `updateUser` si necessaire :

```javascript
function updateUser(updatedUser) {
  setUser(updatedUser);
  const saved = sessionStorage.getItem("colocapp_user");
  if (saved) {
    try {
      const data = JSON.parse(saved);
      data.user = updatedUser;
      sessionStorage.setItem("colocapp_user", JSON.stringify(data));
    } catch (err) {
      console.error("Failed to update user in session", err);
    }
  }
}
```

Exposer `updateUser` dans le Provider value.

## Files to Modify

| File | Action | Description |
|------|--------|-------------|
| `server/index.js` | MODIFY | Ajouter route `POST /api/colocation/preview`, modifier route `POST /api/colocation/join` |
| `client/src/components/JoinConfirmDialog.jsx` | CREATE | Nouveau composant Dialog de confirmation |
| `client/src/pages/Onboarding.jsx` | MODIFY | Flux en 2 etapes (preview puis confirm) |
| `client/src/pages/Login.jsx` | MODIFY | Securiser section "Rejoindre" quand non connecte |
| `client/src/contexts/AuthContext.jsx` | MODIFY | Ajouter `updateUser` si absent |

## API Changes

### New Endpoint: `POST /api/colocation/preview`

Preview colocation info without joining.

**Request:**
```json
{
  "code": "COLO-7829-X"
}
```

**Response 200:**
```json
{
  "data": {
    "id": "coloc-1",
    "name": "Colocation Jopad & Co",
    "invitationCode": "COLO-7829-X",
    "totalFund": 245.50,
    "members": [
      { "id": "user-1", "name": "Jocelin Padouano", "email": "jopad@mail.com", "role": "admin" },
      { "id": "user-2", "name": "Yohan Dubois", "email": "yohan@mail.com", "role": "member" },
      { "id": "user-3", "name": "Luis-Manuel Garcia", "email": "luis@mail.com", "role": "member" }
    ]
  }
}
```

**Response 404:**
```json
{
  "error": "Code d'invitation invalide"
}
```

### Modified Endpoint: `POST /api/colocation/join`

Now requires `userId` and validates pre-conditions.

**Request:**
```json
{
  "code": "COLO-7829-X",
  "userId": "user-4"
}
```

**Response 200:** Same as preview (enriched colocation with members)

**Response 400:**
```json
{
  "error": "userId requis"
}
```

**Response 409:**
```json
{
  "error": "Vous devez quitter votre colocation actuelle avant d'en rejoindre une autre"
}
```

## Curl Tests

```bash
# Test 1: Preview with valid code
curl -X POST http://localhost:3001/api/colocation/preview \
  -H "Content-Type: application/json" \
  -d '{"code": "COLO-7829-X"}'
# Expected: 200 with colocation name + members array

# Test 2: Preview with invalid code
curl -X POST http://localhost:3001/api/colocation/preview \
  -H "Content-Type: application/json" \
  -d '{"code": "COLO-FAKE-Z"}'
# Expected: 404 {"error": "Code d'invitation invalide"}

# Test 3: Preview without code
curl -X POST http://localhost:3001/api/colocation/preview \
  -H "Content-Type: application/json" \
  -d '{}'
# Expected: 400 {"error": "Code requis"}

# Test 4: Join with valid code and userId
curl -X POST http://localhost:3001/api/colocation/join \
  -H "Content-Type: application/json" \
  -d '{"code": "COLO-7829-X", "userId": "user-4"}'
# Expected: 200 with enriched colocation (user-4 added to members)

# Test 5: Join without userId
curl -X POST http://localhost:3001/api/colocation/join \
  -H "Content-Type: application/json" \
  -d '{"code": "COLO-7829-X"}'
# Expected: 400 {"error": "userId requis"}

# Test 6: Join with invalid code
curl -X POST http://localhost:3001/api/colocation/join \
  -H "Content-Type: application/json" \
  -d '{"code": "COLO-WRONG-Z", "userId": "user-4"}'
# Expected: 404 {"error": "Code d'invitation invalide"}
```

## Dependencies

- **Story 10.1** (Filtrage API par colocationId) : si multi-colocation est implemente, la route preview/join devra chercher dans un tableau de colocations au lieu d'un objet unique.
- **Story 10.2** (Creation de colocation avec donnees vierges) : le `POST /api/colocation` doit creer des colocations distinctes pour que le join ait du sens.
- **shadcn/ui Dialog** : le composant `client/src/components/ui/dialog.jsx` existe deja.
- **AuthContext** : `updateColocation` existe deja dans `client/src/contexts/AuthContext.jsx` (ligne 78).

## Dev Notes

### Architecture Compliance

**Stack technique :**
- React 18+ avec Vite
- shadcn/ui components (Dialog, Button, Avatar, Badge)
- Tailwind CSS uniquement (pas de CSS custom)
- lucide-react pour les icones (Users, UserPlus, Shield, Check)
- fetch() natif pour les appels API

**Patterns :**
- camelCase pour les variables/fonctions
- PascalCase pour les composants React
- API responses wrapped in `{ data: ... }` or `{ error: "..." }`
- Session persistence via `sessionStorage` key `colocapp_user`

### Current Code Issues to Fix

1. **`server/index.js` ligne 82-83** : `register` hardcode `colocationId: 'coloc-1'` et ajoute automatiquement le nouvel utilisateur a `colocation.members`. Un nouvel inscrit ne devrait pas etre automatiquement dans une colocation — il devrait passer par Onboarding (creer ou rejoindre). Ce fix est lie a Story 10.2 mais impacte cette story.

2. **`Login.jsx` ligne 72** : `userId: user?.id` sera `undefined` quand non connecte. Le backend accepte quand meme et retourne la colocation sans ajouter personne — comportement silencieusement incorrect.

3. **`server/index.js` ligne 14** : `colocation` est un objet unique, pas un tableau. Le flux suppose qu'il n'y a qu'une seule colocation dans le systeme. Apres Story 10.2, cela devra evoluer.

### UI Flow Diagram

```
Onboarding.jsx (mode: 'join')
    |
    v
[User enters code] -> [Click "Rejoindre"]
    |
    v
POST /api/colocation/preview { code }
    |
    +-- 404 -> Show error "Code d'invitation invalide"
    |
    +-- 200 -> Open JoinConfirmDialog
                    |
                    +-- [Annuler] -> Close dialog, stay on page
                    |
                    +-- [Confirmer] -> POST /api/colocation/join { code, userId }
                                          |
                                          +-- 200 -> updateColocation() + navigate("/dashboard")
                                          +-- 4xx -> Show error in dialog
```

### Testing Checklist

- [ ] Preview avec code valide affiche le Dialog avec nom + membres
- [ ] Preview avec code invalide affiche erreur inline (pas de Dialog)
- [ ] Confirm dans le Dialog ajoute le membre et redirige
- [ ] Annuler dans le Dialog ferme sans effet
- [ ] L'utilisateur apparait dans la liste des membres apres join
- [ ] Le sessionStorage contient la colocation mise a jour
- [ ] La sidebar affiche le nom de la colocation apres join
- [ ] Sur Login.jsx, la section "Rejoindre" gere le cas non-connecte
- [ ] Double-join (meme colocation) ne cree pas de doublon dans members
- [ ] Responsive : le Dialog est lisible sur mobile (min-width 375px)
