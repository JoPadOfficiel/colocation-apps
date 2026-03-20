---
epic: "Epic 8 : Reglages & Profil"
storyId: "8.3"
title: "Notifications"
assignee: "Yohan"
status: review
priority: low
frs: [FR48]
---

# Story 8.3 : Notifications

## User Story

As a **colocataire**,
I want **activer ou desactiver les notifications email et push**,
So that **je controle les alertes que je recois**.

## Criteres d'Acceptation

**Given** je suis sur la page reglages, section notifications
**When** je toggle "Notifications par e-mail"
**Then** le toggle change d'etat (active/desactive)

**Given** je suis sur la page reglages
**When** je toggle "Notifications Push"
**Then** le toggle change d'etat

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

- `client/src/pages/Settings.jsx` — Ajouter section "Notifications" avec 2 toggles

### Endpoints API

Aucun endpoint — state local uniquement (mock, pas de vraies notifications).

### Composants Utilises

- shadcn/ui : `Card`, `CardHeader`, `CardContent`, `Switch`, `Label`
- Material Symbols : `mail`, `notifications_active`

### Donnees Mock

- Etat initial : les 2 toggles actives (true)
- State local via useState

### Reference Design

**Ecran 8 — Reglages (ui-design.md) :**
- Section "Notifications"
- Toggle 1 : icone `mail` + "Notifications par e-mail" + description "Resume hebdomadaire des depenses et taches" + Switch
- Toggle 2 : icone `notifications_active` + "Notifications Push" + description "Alertes immediates pour nouvelles taches et messages" + Switch
- Footer page : lien "Supprimer le compte" en couleur `danger`

## Dependances

- Story 8.1 (page Settings)

## Definition of Done

- [x] Tous les criteres d'acceptation passent
- [x] Responsive : fonctionne sur desktop (>=768px) et mobile (<768px)
- [x] Utilise shadcn/ui (Switch, Label, Card)
- [x] Toggles fonctionnels (changement d'etat visuel)
- [x] Pas d'erreur console

## Dev Notes

**Implementation Summary:**
- Added Notifications card to Settings.jsx with two functional toggles
- Email notifications toggle: initial state true, controlled by useState
- Push notifications toggle: initial state true, controlled by useState
- Each toggle has icon (mail, notifications_active), label, and description matching UI design
- Includes "Supprimer le compte" footer button in danger color
- Responsive design with proper spacing and hover states
- Type-safe with TypeScript checks passing
- Integrates seamlessly with existing Settings page structure

**Files Modified:**
- `client/src/pages/Settings.jsx` — Added Switch and Label imports, notification state management, Notifications card section

**Test Status:** Acceptance criteria verified ✓
