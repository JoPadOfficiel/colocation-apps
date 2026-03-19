# Procédure de Développement — ColocApp MVP

**Projet :** colocation-apps
**Équipe :** Jopad (lead), Yohan (junior), Luis-Manuel (junior)
**Durée :** 3 jours
**Board Trello :** https://trello.com/b/mkNuQaCR/tableau-kanban-colocation

---

## Stratégie Git

### Branches

```
main                          ← branche de production (protégée)
  └── dev                     ← branche d'intégration
       ├── feat/epic-1-fondations       ← Jopad (J1 matin) — BLOQUANT
       ├── feat/epic-2-auth             ← Yohan (J1 après-midi)
       ├── feat/epic-3-dashboard        ← Jopad (J2)
       ├── feat/epic-4-taches           ← Luis-Manuel (J1 après-midi → J2)
       ├── feat/epic-5-finances         ← Jopad (J2)
       ├── feat/epic-6-alimentation     ← Luis-Manuel (J2)
       ├── feat/epic-7-abonnements      ← Yohan (J2)
       ├── feat/epic-8-reglages         ← Yohan (J1 après-midi)
       └── feat/epic-9-ux-polish        ← Tous (J3)
```

### Règles Git

1. **Chaque dev travaille sur sa branche** — jamais de commit direct sur `dev` ou `main`
2. **Pull Request obligatoire** pour merger dans `dev`
3. **Jopad valide toutes les PRs** avant merge
4. **Rebase sur dev** avant de créer la PR : `git pull --rebase origin dev`
5. **Convention de commit :** `feat(module): description courte` (ex: `feat(auth): add login page`)

---

## Planning jour par jour

### JOUR 1 — Matin (Jopad seul)

| Étape | Action | Branche | Merge dans dev |
|-------|--------|---------|----------------|
| **1** | Epic 1 complet (3 stories) | `feat/epic-1-fondations` | ✅ Merger IMMÉDIATEMENT — bloque tout le monde |

**CRITIQUE :** Yohan et Luis-Manuel NE PEUVENT PAS commencer avant que Epic 1 soit mergé dans `dev`.

**Vérification avant merge :**
- [ ] `npm install && npm run dev` → client :5173 + server :3001
- [ ] Layout responsive fonctionne (sidebar desktop, bottom tab mobile)
- [ ] `useAuth()` retourne l'utilisateur mocké
- [ ] `mockData.js` contient les 7 entités avec données réalistes
- [ ] Toutes les routes React Router sont en place (même vides)

### JOUR 1 — Après-midi (3 devs en parallèle)

| Dev | Épic | Branche | Dépendance |
|-----|------|---------|------------|
| **Yohan** | Epic 2 (Auth) + Epic 8 (Réglages) | `feat/epic-2-auth` puis `feat/epic-8-reglages` | Epic 1 mergé ✅ |
| **Luis-Manuel** | Epic 4 (Tâches) — stories 4.1 + 4.2 | `feat/epic-4-taches` | Epic 1 mergé ✅ |
| **Jopad** | Code review des PRs + support aux juniors | — | — |

**En fin de J1 :**
- Yohan crée PR pour Epic 2 → Jopad review + merge dans `dev`
- Luis-Manuel crée PR pour Epic 4 (partiel) → Jopad review

### JOUR 2 — 3 devs en parallèle

| Dev | Épic | Branche | Dépendance |
|-----|------|---------|------------|
| **Jopad** | Epic 3 (Dashboard) + Epic 5 (Finances) | `feat/epic-3-dashboard` puis `feat/epic-5-finances` | Epic 1 mergé ✅ |
| **Luis-Manuel** | Finir Epic 4 (stories 4.3-4.4) + Epic 6 (Alimentation) | `feat/epic-4-taches` puis `feat/epic-6-alimentation` | Epic 1 mergé ✅ |
| **Yohan** | Epic 7 (Abonnements) + finir Epic 8 si pas fait | `feat/epic-7-abonnements` | Epic 1 mergé ✅ |

**Merges J2 (dans l'ordre) :**
1. Epic 4 (Tâches) → merge dans `dev`
2. Epic 2 (Auth) si pas fait → merge dans `dev`
3. Epic 8 (Réglages) → merge dans `dev`
4. Epic 3 (Dashboard) → merge dans `dev`
5. Epic 5 (Finances) → merge dans `dev`
6. Epic 6 (Alimentation) → merge dans `dev`
7. Epic 7 (Abonnements) → merge dans `dev`

**IMPORTANT :** Avant chaque PR, faire `git pull --rebase origin dev` pour récupérer les merges des autres.

### JOUR 3 — Intégration + Polish + Démo

| Étape | Action | Qui |
|-------|--------|-----|
| **1** | Merger toutes les branches restantes dans `dev` | Jopad |
| **2** | Résoudre les conflits éventuels | Jopad |
| **3** | Epic 9 — UX Polish (validation, erreurs, responsive) | Tous sur `feat/epic-9-ux-polish` |
| **4** | Test complet de bout en bout : tous les flux | Tous |
| **5** | Fix des bugs trouvés | Tous |
| **6** | Merge `dev` → `main` | Jopad |
| **7** | Préparer la démo | Tous |

---

## Checklist par merge

Avant chaque merge dans `dev`, vérifier :

- [ ] `npm run dev` — pas d'erreur console
- [ ] Page concernée s'affiche correctement
- [ ] Responsive OK (tester < 768px)
- [ ] Pas de données en dur — tout vient de mockData.js
- [ ] Composants shadcn/ui utilisés (pas de CSS custom)
- [ ] Navigation vers/depuis le module fonctionne

---

## Gestion des conflits

### Fichiers à risque de conflit

| Fichier | Pourquoi | Solution |
|---------|----------|----------|
| `App.jsx` | Tous ajoutent des routes | Jopad pose TOUTES les routes dans Epic 1 (même vides) |
| `mockData.js` | Tous lisent/modifient | Jopad crée le fichier complet dans Epic 1 — les autres ne le modifient PAS |
| `Layout.jsx` | Sidebar items | Jopad fixe la nav dans Epic 1 — les autres ne touchent PAS |
| `api.js` | Fonctions fetch partagées | Chaque dev ajoute ses fonctions en bas du fichier, pas au milieu |

### Résolution

1. `git pull --rebase origin dev` AVANT de push
2. Si conflit : **garder les deux versions** (les ajouts des deux devs)
3. Si conflit sur mockData.js : appeler Jopad
4. Si conflit non résolvable : `git rebase --abort` et demander à Jopad

---

## Procédure par story

Pour chaque story, le dev suit ces étapes :

### 1. Prendre la story
- Déplacer la card Trello dans **"In progress"**
- Se mettre sur la bonne branche : `git checkout feat/epic-X-xxx`

### 2. Lire le fichier story
- Ouvrir `_bmad-output/implementation-artifacts/X-Y-nom-story.md`
- Lire TOUS les acceptance criteria avant de coder

### 3. Coder
- Copier le prompt d'implémentation (voir fichier PROMPTS.md)
- Le coller dans Claude Code / l'IDE avec IA
- Vérifier le code généré

### 4. Tester localement
- `npm run dev` — pas d'erreur
- Tester le flux manuellement dans le navigateur
- Tester en mobile (DevTools → responsive)

### 5. Commit + Push
```bash
git add .
git commit -m "feat(module): description de ce qui a été fait"
git push origin feat/epic-X-xxx
```

### 6. Story suivante ou PR
- Si d'autres stories dans l'epic : continuer
- Si epic terminé : créer la PR vers `dev`
- Déplacer la card Trello dans **"Code Review"**

### 7. Review + Merge
- Jopad review la PR
- Si OK → merge dans `dev`
- Déplacer la card Trello dans **"Done"**

---

## Ordre d'exécution des prompts

### Jopad (9 stories + 2 shared)

| # | Story | Prompt | Quand | Bloquant ? |
|---|-------|--------|-------|------------|
| 1 | 1.1 | `PROMPT-1-1` | J1 matin | ⛔ OUI — bloque tout |
| 2 | 1.2 | `PROMPT-1-2` | J1 matin | ⛔ OUI — bloque tout |
| 3 | 1.3 | `PROMPT-1-3` | J1 matin | ⛔ OUI — bloque tout |
| 4 | 3.1 | `PROMPT-3-1` | J2 matin | Non |
| 5 | 3.2 | `PROMPT-3-2` | J2 matin | Non |
| 6 | 3.3 | `PROMPT-3-3` | J2 matin | Non |
| 7 | 5.1 | `PROMPT-5-1` | J2 après-midi | Non |
| 8 | 5.2 | `PROMPT-5-2` | J2 après-midi | Non |
| 9 | 5.3 | `PROMPT-5-3` | J2 après-midi | Non |

### Yohan (9 stories + 2 shared)

| # | Story | Prompt | Quand | Prérequis |
|---|-------|--------|-------|-----------|
| 1 | 2.1 | `PROMPT-2-1` | J1 après-midi | Epic 1 mergé |
| 2 | 2.2 | `PROMPT-2-2` | J1 après-midi | Story 2.1 |
| 3 | 2.3 | `PROMPT-2-3` | J1 après-midi | Story 2.2 |
| 4 | 2.4 | `PROMPT-2-4` | J1 fin | Story 2.1 |
| 5 | 8.1 | `PROMPT-8-1` | J1 fin ou J2 | Epic 1 mergé |
| 6 | 8.2 | `PROMPT-8-2` | J2 | Story 8.1 |
| 7 | 8.3 | `PROMPT-8-3` | J2 | Story 8.1 |
| 8 | 7.1 | `PROMPT-7-1` | J2 | Epic 1 mergé |
| 9 | 7.2 | `PROMPT-7-2` | J2 | Story 7.1 |

### Luis-Manuel (7 stories + 2 shared)

| # | Story | Prompt | Quand | Prérequis |
|---|-------|--------|-------|-----------|
| 1 | 4.1 | `PROMPT-4-1` | J1 après-midi | Epic 1 mergé |
| 2 | 4.2 | `PROMPT-4-2` | J1 après-midi | Story 4.1 |
| 3 | 4.3 | `PROMPT-4-3` | J2 matin | Story 4.2 |
| 4 | 4.4 | `PROMPT-4-4` | J2 matin | Story 4.3 |
| 5 | 6.1 | `PROMPT-6-1` | J2 après-midi | Epic 1 mergé |
| 6 | 6.2 | `PROMPT-6-2` | J2 après-midi | Story 6.1 |
| 7 | 6.3 | `PROMPT-6-3` | J2 fin | Story 6.2 |
