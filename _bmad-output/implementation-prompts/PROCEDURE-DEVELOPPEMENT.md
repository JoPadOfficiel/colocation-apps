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
2. **Pull Request obligatoire** pour merger dans `dev`. Ne pas attendre la fin du projet pour merger.
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

**IMPORTANT :** Avant chaque PR, faire `git pull --rebase origin dev` pour récupérer les merges des autres.

---

## Procédure par story

Pour chaque story, le développeur concerné suit TOUJOURS cet enchaînement :

### 1. Prendre la story
- Déplacer la card Trello dans **"In progress"**
- Se mettre sur la bonne branche : `git checkout feat/epic-X-xxx`

### 2. Lire le fichier story et le prompt
- Naviguer jusqu'au dossier de votre Epic : `_bmad-output/implementation-prompts/epic-X/`
- Ouvrir le fichier de prompt : `EPIC-X-PROMPTS.md`
- Chaque prompt est préparé à l'avance et encapsulé dans un bloc de code.

### 3. Exécution IA (BMAD Method)
- Allez dans la section correspondant à votre sous-story (ex: `Story 1.1`).
- Copier le bloc de code d'instruction complet (du tag `<system-override...` jusqu'à la fin de l'étape 5).
- Le coller dans Claude Code / l'IDE avec IA ou via agent.
- Vérifier que l'IA respecte chaque étape séquentiellement (STORY EXISTENCE CHECK, ANALYSIS, DEV STORY, TESTING, CODE REVIEW).

### 4. Validation et Tests Locaux
- Au terme de l'exécution, réaliser les tests locaux indiqués (`npm run dev`).
- Vérifier le flux fonctionnel.

### 5. Commit + PR
- `git add .` puis `git commit -m "feat(module): ..."`
- A la fin de l'Epic, ouvrir une PR vers `dev`.
- Placer la card sur **"Code Review"** sur Trello.

---

## Ordre d'exécution et Localisation des Prompts

Retrouvez les instructions pour chaque Epic dans :
`_bmad-output/implementation-prompts/epic-[NUM]/EPIC-[NUM]-PROMPTS.md`

### ➔ Jopad (9 stories)
**Epic 1 (Bloquant)** : `epic-1/EPIC-1-PROMPTS.md` (Stories 1.1, 1.2, 1.3)
**Epic 3** : `epic-3/EPIC-3-PROMPTS.md` (Stories 3.1, 3.2, 3.3)
**Epic 5** : `epic-5/EPIC-5-PROMPTS.md` (Stories 5.1, 5.2, 5.3)

### ➔ Yohan (9 stories)
**Epic 2** : `epic-2/EPIC-2-PROMPTS.md` (Stories 2.1, 2.2, 2.3, 2.4)
**Epic 7** : `epic-7/EPIC-7-PROMPTS.md` (Stories 7.1, 7.2)
**Epic 8** : `epic-8/EPIC-8-PROMPTS.md` (Stories 8.1, 8.2, 8.3)

### ➔ Luis-Manuel (7 stories)
**Epic 4** : `epic-4/EPIC-4-PROMPTS.md` (Stories 4.1, 4.2, 4.3, 4.4)
**Epic 6** : `epic-6/EPIC-6-PROMPTS.md` (Stories 6.1, 6.2, 6.3)

---
