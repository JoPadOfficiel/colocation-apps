---
epic: "Epic 4 : Gestion des Taches"
storyId: "4.4"
title: "Statistiques et bulk action"
assignee: "Luis-Manuel"
status: done
priority: medium
frs: [FR23, FR24]
---

# Story 4.4 : Statistiques et bulk action

## User Story

As a **colocataire**,
I want **voir les statistiques par membre et deleguer plusieurs taches en une fois**,
So that **la repartition du travail est equitable et efficace**.

## Criteres d'Acceptation

**Given** je suis sur la page taches
**When** je consulte les statistiques
**Then** un dashboard de progression par membre s'affiche en bas de page (`Tasks.jsx:L415-446`)

**Given** je selectionne plusieurs taches
**And** les membres peuvent se voir assigner des tâches via un Select (`Tasks.jsx:L325-337`)

## Notes d'Implementation Technique

### Fichiers Modifies

- `client/src/pages/Tasks.jsx` — Implémentation des statistiques par membre et de la gestion de sélection multiple avec barre d'actions groupées.

### Endpoints API

- `GET /api/tasks` — Données utilisées pour calculer les stats localement.
- `PUT /api/tasks/:id` — Appelé en série pour chaque tâche lors d'une action groupée.

### Composants Utilises (Base Nova Style)

- `@base-ui/react` : `Checkbox`, `Select`
- `ui` components : `Card`, `Badge`, `Button`
- Animations : Barre bulk action flottante avec `animate-in slide-in-from-bottom-4`.

### Code de Référence (Tasks.jsx)

```javascript
// Calcul des stats (L196-203)
const stats = {}
users.forEach((u) => { stats[u.id] = { total: 0, done: 0 } })
tasks.forEach((t) => {
  if (stats[t.assignedTo]) {
    stats[t.assignedTo].total++
    if (t.status === "Terminée") stats[t.assignedTo].done++
  }
})

// Bulk reassign (L143-158)
async function bulkReassign(targetUserId) {
  try {
    const updates = await Promise.all(
      selectedTasks.map((id) => updateTask(id, { assignedTo: targetUserId }))
    )
    setTasks((prev) => prev.map((t) => updates.find((u) => u.id === t.id) || t))
    setSelectedTasks([])
  } catch (err) {
    console.error("Bulk reassign error:", err)
  }
}
```

## Code Citations

- **Bulk Reassign** : `Tasks.jsx:L143-158` (Logique de mise à jour groupée)
- **Interface Bulk (Floating Bar)** : `Tasks.jsx:L263-282` (Barre de sélection contextuelle en bas de l'écran)
- **Stats par membre** : `Tasks.jsx:L415-446` (Widget de progression par colocataire)

## Dev Agent Record

### Implementation Plan
1. Vérifier le calcul dynamique des statistiques par membre.
2. Tester le mode de sélection multiple et l'apparition de la barre d'actions groupées.
3. Valider le fonctionnement de la réassignation en masse (bulk reassign).

### Completion Notes
- Statistiques visuelles implémentées avec pourcentage et barres de progression.
- Mode de sélection multiple fluide avec barre flottante persistante en cas de sélection.
- Actions groupées fonctionnelles utilisant le nouveau système de `Select` refactorisé.

## Dependances

- Story 4.1 (liste des taches)
- Story 4.2 (modification)

## Definition of Done

- [x] Tous les criteres d'acceptation passent
- [x] Responsive : barre bulk fixe en bas, grille de stats responsive
- [x] Utilise @base-ui/react (Checkbox, Select) refactorisés
- [x] Statistiques calculees dynamiquement
- [x] Bulk action reassigne les taches selectionnees
- [x] Pas d'erreur console
