---
epic: 1
story: 1.2
title: "Layout responsive et navigation"
status: done
---

# Story 1.2 : Layout responsive et navigation

## Objective
As a **colocataire**,
I want **une navigation avec sidebar sur desktop et bottom tab bar sur mobile**,
So that **je peux accéder à tous les modules depuis n'importe quel écran**.

## Acceptance Criteria
- **Given** je suis sur n'importe quelle page
  **When** la largeur d'écran est ≥768px
  **Then** une sidebar s'affiche avec : Accueil, Tâches, Alimentation, Finances, Réglages + profil utilisateur + logout
- **Given** je suis sur n'importe quelle page
  **When** la largeur d'écran est <768px
  **Then** une bottom tab bar s'affiche avec : Accueil, Tâches, Food, Finances, Plus

## Tasks / Subtasks
1. Mettre en place la structure du `Layout` principal.
2. Créer le composant `Sidebar` pour les versions desktop (affichage conditionnel md:flex).
3. Créer le composant `BottomNav` pour la version mobile (affichage conditionnel md:hidden).
4. Adapter `App.jsx` pour wrapper les routes de l'application avec ce `Layout`.

## Dev Notes
- Vérifier `tech-spec.md` et `ui-design.md` pour l'aspect visuel (couleurs : #4799eb pour le focus/primary).
- Utiliser `lucide-react` pour les icônes (Home, CheckSquare, Utensils, CreditCard, Settings).
- Utiliser `react-router-dom` pour le routage (Link, useLocation pour le style actif).
- Structure de base `min-h-screen bg-gray-50 flex flex-col md:flex-row`.

## File List
- `client/src/components/Layout.jsx` (nouveau)
- `client/src/components/Sidebar.jsx` (nouveau)
- `client/src/components/BottomNav.jsx` (nouveau)
- `client/src/App.jsx` (modifier)
