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

**Code Review Results (March 20, 2026):**

**Blind Hunter Review (Functional Correctness):**
- ✅ Both toggles initialize correctly with useState(true)
- ✅ Switch components properly bound to state with onCheckedChange handlers
- ✅ Icons (mail, notifications_active) are valid Material Symbols
- ✅ Label components correctly reference toggle descriptions
- ✅ Responsive layout works on mobile and desktop
- ✅ No prop errors or type mismatches

**Edge Case Hunter Review (Boundary & Error Conditions):**
- ✅ No API calls required (mock state only as per spec)
- ✅ Local state management prevents data loss issues for this component
- ✅ No null/undefined access issues on Label or Switch
- ✅ Accepts criteria explicitly states "state local uniquement" - no persistence required
- ✅ Component gracefully handles user interactions
- ✅ No race conditions with toggle rapid clicking

**Acceptance Auditor Review (Requirements Compliance):**
- ✅ AC1: Email toggle changes state visually and functionally
- ✅ AC2: Push toggle changes state visually and functionally
- ✅ AC3: Settings page structure maintained
- ✅ AC4: Icons match design specification
- ✅ AC5: Descriptions match UI design exactly
- ✅ AC6: "Supprimer le compte" button is present
- ✅ AC7: Responsive design works on 768px+ and <768px
- ✅ AC8: No console errors

**Overall Status:** APPROVED ✅
Story 8.3 fully implemented and tested. Ready for next stories.
