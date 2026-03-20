---
epic: "Epic 4 : Gestion des Taches"
storyId: "4.3"
title: "Recurrence, filtres et assignation"
assignee: "Luis-Manuel"
status: done
priority: high
frs: [FR20, FR21, FR22]
---

# Story 4.3 : Recurrence, filtres et assignation

## User Story

As a **colocataire**,
I want **definir des taches recurrentes, filtrer et assigner des taches**,
So that **les taches regulieres sont automatisees et organisees**.

**Given** je suis sur la page taches
**When** je filtre par statut, assignation ou date
**Then** seules les taches correspondantes s'affichent

## Notes d'Implementation Technique

### Fichiers Modifies

- `client/src/pages/Tasks.jsx` — Intégration de la barre de filtres (Select pour statut, membre et date) et gestion de la récurrence dans le formulaire.

### Endpoints API

- `PUT /api/tasks/:id` — Mise à jour du champ `recurrence` et `assignedTo`.
- `GET /api/tasks` — Récupération de toutes les tâches, filtrage effectué côté client pour la réactivité.

### Composants Utilises (Base Nova Style)

- `@base-ui/react` : `Select` (pour les filtres et le formulaire)
- `lucide-react` : `Calendar`, `User`, `Repeat`
- `Badge` : Affichage de la catégorie et de la récurrence sur les cards.

### Code de Référence (Tasks.jsx)

```javascript
// Filtrage côté client (L167-190)
const filtered = tasks.filter((t) => {
  if (filter.status !== "all" && t.status !== filter.status) return false
  if (filter.assignee !== "all" && t.assignedTo !== filter.assignee) return false
  // Logique de filtrage par date...
  return true
})

// Affichage du badge de récurrence (L484-489)
{task.recurrence !== "none" && (
  <Badge variant="secondary" className="text-[10px] font-normal gap-1">
    <Repeat className="w-2.5 h-2.5" />
    {task.recurrence === "daily" ? "Quotidien" : task.recurrence === "weekly" ? "Hebdo" : "Mensuel"}
  </Badge>
)}
```

## Dev Agent Record

### Implementation Plan
1. Vérifier que les filtres de statut, membre et date fonctionnent correctement.
2. S'assurer que le champ récurrence est bien persisté lors de la création/édition.
3. Valider que les badges d'assignation et de récurrence s'affichent correctement sur les cartes de tâches.

### Completion Notes
- Filtrage dynamique implémenté et testé pour tous les critères.
- La récurrence est affichée via un badge discret et une icône `Repeat`.
- L'assignation met à jour le badge utilisateur instantanément.
- Les composants `Select` utilisent le nouveau style "Base Nova".

## Definition of Done

- [x] Tous les criteres d'acceptation passent
- [x] Responsive : filtres empiles sur mobile
- [x] Utilise @base-ui/react (Select) refactorisés
- [x] Filtrage dynamique fonctionnel
- [x] Champ recurrence sauvegarde et affiche
- [x] Pas d'erreur console
