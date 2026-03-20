---
epic: "Epic 4 : Gestion des Taches"
storyId: "4.2"
title: "Modification, suppression et changement de statut"
assignee: "Luis-Manuel"
status: done
priority: high
frs: [FR17, FR18, FR19]
---

# Story 4.2 : Modification, suppression et changement de statut

## User Story

As a **colocataire**,
I want **modifier, supprimer ou changer le statut d'une tache**,
So that **je peux maintenir la liste de taches a jour**.

## Criteres d'Acceptation

**Given** une tache existe
**When** je clique modifier et change les champs
**Then** la tache est mise a jour

**Given** une tache existe
**When** je clique supprimer et confirme dans la pop-up
**Then** la tache est supprimee

**Given** une tache est "A faire"
**When** je change son statut en "Terminee"
**Then** la tache se deplace dans la colonne "Terminees"

## Notes d'Implementation Technique

### Fichiers Modifies

- `client/src/pages/Tasks.jsx` — Implémentation de `startEdit`, `handleSubmit` pour l'édition, `promptDelete` pour la suppression, et `toggleStatus` pour le changement de statut.
- `client/src/components/ConfirmDialog.jsx` — Utilisation de `@base-ui/react/dialog` pour une confirmation cohérente.

### Endpoints API

- `PUT /api/tasks/:id` — Mise à jour complète ou partielle (statut).
- `DELETE /api/tasks/:id` — Suppression définitive.

### Composants Utilises (Base Nova Style)

- `@base-ui/react` : `DropdownMenu`, `Dialog`, `Checkbox`
- Icones : `MoreHorizontal`, `Pencil`, `Trash2`, `Check`
- `ConfirmDialog` personnalisé utilisant le système de Dialog du projet.

### Code de Référence (Tasks.jsx)

```javascript
// Edition (L80-91)
function startEdit(task) {
  setForm({
    title: task.title,
    description: task.description || "",
    category: task.category || "Autre",
    assignedTo: task.assignedTo || "",
    dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    recurrence: task.recurrence || "none",
  })
  setEditingTask(task)
  setDialogOpen(true)
}

// Changement de statut (L133-141)
async function toggleStatus(task) {
  const newStatus = task.status === "Terminée" ? "À faire" : "Terminée"
  try {
    const updated = await updateTask(task.id, { status: newStatus })
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)))
  } catch (err) {
    console.error("Status toggle error:", err)
  }
}
```

## Dev Agent Record

### Implementation Plan
1. Vérifier l'implémentation des fonctions de modification et suppression dans `Tasks.jsx`.
2. S'assurer que les composants UI utilisés (`DropdownMenu`, `Dialog`) respectent le style "Base Nova".
3. Mettre à jour la documentation de la story avec les références de code exactes.

### Completion Notes
- Les fonctions `startEdit`, `handleSubmit`, `promptDelete` et `toggleStatus` sont fonctionnelles et intégrées.
- Le menu contextuel `DropdownMenu` permet d'accéder aux actions d'édition et de suppression.
- La suppression est sécurisée par un `ConfirmDialog`.
- Le style a été uniformisé avec le reste du système "Base Nova" (ring styles, data-slots via les composants refactorisés).

## Definition of Done

- [x] Tous les criteres d'acceptation passent
- [x] Responsive : fonctionne sur desktop (>=768px) et mobile (<768px)
- [x] Utilise @base-ui/react (DropdownMenu, Dialog) refactorisés
- [x]**And** un dialogue de confirmation s'affiche avant suppression (`Tasks.jsx:L116-131` via `ConfirmDialog`)

## Code Citations

- **Modification de Tâche** : `Tasks.jsx:L80-91` (setForm avec données existantes et ouverture Dialog)
- **Suppression (ConfirmDialog)** : `Tasks.jsx:L447-455` (Intégration du composant ConfirmDialog)
- **Changement de Statut** : `Tasks.jsx:L133-141` (Logique de toggle À faire / Terminée)
- **Update API** : `Tasks.jsx:L103-105` (Appel à `updateTask`)
- [x] Changement de statut deplace la card entre colonnes
- [x] Pas d'erreur console
