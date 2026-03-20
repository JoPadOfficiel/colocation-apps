---
epic: "Epic 1 : Fondations & Projet Setup"
storyId: "1.3"
title: "AuthContext et mock data"
assignee: "Jopad"
status: "done"
priority: high
frs: [FR49, FR50]
---

# Story 1.3 : AuthContext et mock data

## User Story

As a **developpeur**,
I want **un AuthContext global et un fichier mock-data.js centralise avec les 7 entites UML**,
So that **tous les modules peuvent acceder a l'utilisateur connecte et aux donnees mockees**.

## Criteres d'Acceptation

**Given** l'app est chargee
**When** un utilisateur est "connecte" (mock)
**Then** `useAuth()` retourne l'utilisateur courant et la colocation active
**And** `mockData.js` contient des donnees realistes pour : Colocation, Utilisateur, Tache, Finance, Abonnement, Food_Recette, Food_Course

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

- `client/src/contexts/AuthContext.jsx` — Provider + hook `useAuth()`
- `server/data/mockData.js` — 7 entites UML, donnees realistes
- `client/src/lib/api.js` — Fonctions fetch vers `/api/*`
- `client/src/lib/utils.js` — Helpers (formatDate, formatCurrency)

### Endpoints API

- `GET /api/users` — Liste des utilisateurs
- `GET /api/colocation` — Colocation active

### Composants Utilises

Aucun composant UI — c'est du code utilitaire.

### Donnees Mock

**7 entites UML a implementer dans `server/data/mockData.js` :**

1. **Colocation** : `{ id, nom: "Coloc Rivoli", codeInvitation: "COLO-7829-X", cagnotteCommune: 250 }`
2. **Utilisateur** (3) :
   - Thomas Durand (Admin) — thomas@coloc.fr
   - Lea Martin (Membre)
   - Marc Lefebvre (Membre)
3. **Tache** (5+) : titres realistes (Sortir poubelles, Menage salon, Vaisselle...), statuts varies, dates, assignations
4. **Finance** (24) : depenses variees (Courses 50EUR, Internet 30EUR, Electricite 45EUR...), dates, payeurs — pour pagination 5/24
5. **Abonnement** (5) : Netflix 17.99EUR, Orange 39.99EUR, Spotify 15.99EUR, Disney+ 8.99EUR, EDF 62.54EUR
6. **Food_Recette** (4) : Pates Carbonara 20min/4p, Quiche Lorraine 45min/6p, Salade Cesar 15min/2p, Pancakes 30min/4p
7. **Food_Course** (12) : articles par categorie (Produits laitiers, Boulangerie, Frais, Epicerie, Hygiene, Menage)

**AuthContext :**
- `user` : utilisateur connecte (Thomas Durand par defaut)
- `colocation` : colocation active
- `login(email, password)` : mock login
- `register(name, email, password)` : mock register
- `logout()` : deconnexion
- `isAdmin` : booleen derive du role

### Reference Design

Pas de reference visuelle directe — ce sont les donnees qui alimentent tous les ecrans.

## Dependances

- Story 1.1 (projet initialise)

## Citations
- [PRD: Section 6.2 - Architecture](file:///Users/jopad/Downloads/colocation-apps/_bmad-output/planning-artifacts/prd.md#L214-215)
- [PRD: Section 6.3 - Modèle de données](file:///Users/jopad/Downloads/colocation-apps/_bmad-output/planning-artifacts/prd.md#L218-220)

## Definition of Done

- [x] Tous les criteres d'acceptation passent
- [x] `useAuth()` retourne user, colocation, login, register, logout, isAdmin
- [x] mockData.js contient les 7 entites avec donnees realistes
- [x] `api.js` exporte des fonctions fetch pour chaque ressource
- [x] Les routes API `/api/users` et `/api/colocation` repondent correctement
- [x] Pas d'erreur console
