---
epic: "Epic 8 : Reglages & Profil"
storyId: "8.2"
title: "Gestion de la colocation (admin)"
assignee: "Yohan"
status: review
priority: medium
frs: [FR45, FR46, FR47]
---

# Story 8.2 : Gestion de la colocation (admin)

## User Story

As a **admin**,
I want **voir le code d'invitation, la liste des membres avec leurs roles, et inviter de nouveaux colocataires**,
So that **je peux gerer qui fait partie de la colocation**.

## Criteres d'Acceptation

**Given** je suis admin sur la page reglages
**When** je consulte la section "Ma Colocation"
**Then** le code d'invitation s'affiche (COLO-XXXX-X) et est copiable
**And** la liste des membres s'affiche avec leurs roles (Admin/Membre)

**Given** je suis admin
**When** je clique "Inviter un colocataire"
**Then** le code d'invitation est partageable

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

- `client/src/pages/Settings.jsx` — Ajouter section "Ma Colocation" (visible si admin)

### Endpoints API

- `GET /api/colocation` — Retourne colocation avec codeInvitation + membres
- `GET /api/users` — Liste des membres avec roles

### Composants Utilises

- shadcn/ui : `Card`, `CardHeader`, `CardContent`, `Badge`, `Button`, `Avatar`
- Material Symbols : `content_copy`, `person_add`, `admin_panel_settings`

### Donnees Mock

- **Code d'invitation** : COLO-7829-X
- **Membres** :
  - Thomas (Vous) — Badge "Admin"
  - Lea Martin — Badge "Membre"
  - Marc Lefebvre — Badge "Membre"

### Reference Design

**Ecran 8 — Reglages (ui-design.md) :**
- Section "Ma Colocation"
- Code d'invitation : texte monospace COLO-7829-X + icone `content_copy` (copie dans le presse-papier via `navigator.clipboard`)
- Liste membres : Avatar + nom + badge role (Admin = primary, Membre = neutre)
- Bouton `person_add` "Inviter un colocataire" — affiche le code ou ouvre un dialog de partage

## Dependances

- Story 8.1 (page Settings)
- Story 1.3 (AuthContext — isAdmin)

## Definition of Done

- [x] Tous les criteres d'acceptation passent
- [x] Responsive : fonctionne sur desktop (>=768px) et mobile (<768px)
- [x] Utilise shadcn/ui (Card, Badge, Button, Avatar)
- [x] Code copiable via clic (navigator.clipboard)
- [x] Section visible uniquement pour les admins
- [x] Pas d'erreur console

## Dev Agent Record

- Modified: `client/src/pages/Settings.jsx` — section "Ma Colocation" ajoutée après section Profil
- Pattern: `user.role === "admin"` pour visibilité, `colocation.invitationCode` depuis AuthContext, `fetchUsers()` pour liste membres
- `navigator.clipboard.writeText()` avec feedback visuel "Copié !" (2s)
- Bouton "Inviter un colocataire" réutilise `handleCopy` (copie le code dans le presse-papier)
- No new dependencies required
