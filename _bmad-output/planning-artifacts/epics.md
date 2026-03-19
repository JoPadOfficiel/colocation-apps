---
stepsCompleted: [1, 2, 3, 4]
status: 'complete'
completedAt: '2026-03-19'
inputDocuments:
  - "_bmad-output/planning-artifacts/prd.md"
  - "_bmad-output/planning-artifacts/architecture.md"
  - "_bmad-output/planning-artifacts/ui-design.md"
---

# colocation-apps - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for colocation-apps, decomposing the requirements from the PRD, UX Design, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

- FR1: Un visiteur peut créer un compte avec nom, email et mot de passe
- FR2: Un visiteur peut se connecter avec email et mot de passe
- FR3: Un utilisateur connecté peut créer une nouvelle colocation
- FR4: Un utilisateur connecté peut rejoindre une colocation existante via un code d'invitation
- FR5: Un utilisateur peut demander la réinitialisation de son mot de passe et voit un message de confirmation
- FR6: La page d'inscription affiche des boutons de connexion Google et Facebook (visuels uniquement)
- FR7: Un colocataire peut consulter un dashboard avec des widgets résumant l'état de la colocation
- FR8: Le widget Finances affiche le solde de la cagnotte commune et la tendance
- FR9: Le widget Tâches affiche le nombre de tâches urgentes et la prochaine tâche à faire
- FR10: Le widget Alimentation affiche le nombre d'articles dans la liste de courses
- FR11: Le widget Abonnements affiche le nombre de services actifs
- FR12: Un colocataire peut consulter un graphique des dépenses mensuelles
- FR13: Un colocataire peut consulter le flux d'activités récentes de la colocation
- FR14: Un colocataire peut consulter les soldes/équilibres entre colocataires
- FR15: Un colocataire peut naviguer vers un module en cliquant sur le widget correspondant
- FR16: Un colocataire peut créer une tâche avec titre, description, statut, assignation et date d'échéance
- FR17: Un colocataire peut modifier une tâche existante
- FR18: Un colocataire peut supprimer une tâche
- FR19: Un colocataire peut changer le statut d'une tâche (À faire, En cours, Terminée)
- FR20: Un colocataire peut assigner une tâche à un autre membre
- FR21: Un colocataire peut définir une récurrence sur une tâche (quotidienne, hebdomadaire, mensuelle)
- FR22: Un colocataire peut filtrer les tâches par statut, assignation, date
- FR23: Un colocataire peut consulter l'historique et les statistiques des tâches par membre
- FR24: Un colocataire peut déléguer plusieurs tâches en une action groupée (bulk action)
- FR25: Un colocataire peut consulter la cagnotte commune et son solde
- FR26: Un colocataire peut ajouter une dépense avec titre, montant, date et payeur
- FR27: Un colocataire peut modifier une dépense existante
- FR28: Un colocataire peut supprimer une dépense
- FR29: Le système calcule automatiquement l'équilibre financier entre colocataires
- FR30: Un colocataire peut consulter le tableau historique des dépenses
- FR31: Un colocataire peut consulter un graphique récapitulatif des finances
- FR32: Un colocataire peut consulter le menu du jour avec des recettes suggérées depuis le catalogue mocké
- FR33: Un colocataire peut rechercher des recettes par ingrédient, catégorie ou nom
- FR34: Un colocataire peut créer une recette
- FR35: Un colocataire peut modifier ou supprimer une recette
- FR36: Un colocataire peut ajouter une recette à ses favoris
- FR37: Un colocataire peut consulter et gérer la liste de courses
- FR38: Un colocataire peut définir ses contraintes alimentaires
- FR39: Un colocataire peut consulter la liste des abonnements partagés avec le coût mensuel total
- FR40: Un colocataire peut ajouter un abonnement
- FR41: Un colocataire peut modifier ou supprimer un abonnement
- FR42: Un colocataire peut voir le nombre de places disponibles sur un abonnement partagé
- FR43: Un colocataire peut consulter les identifiants de connexion d'un abonnement partagé
- FR44: Un colocataire peut modifier ses informations de profil
- FR45: Un admin peut consulter et partager le code d'invitation de la colocation
- FR46: Un admin peut voir la liste des membres et leurs rôles
- FR47: Un admin peut inviter un nouveau colocataire
- FR48: Un colocataire peut activer/désactiver les notifications email et push
- FR49: L'application affiche une sidebar de navigation sur desktop
- FR50: L'application affiche une bottom tab bar sur mobile
- FR51: L'application affiche des messages d'erreur clairs lors de saisies invalides
- FR52: L'application affiche des pop-ups de confirmation pour les actions critiques

### NonFunctional Requirements

- NFR1: Interactions < 500ms
- NFR2: Dashboard < 1s chargement
- NFR3: Contraste WCAG AA
- NFR4: Navigation clavier fonctionnelle
- NFR5: Labels sur tous les champs de formulaire
- NFR6: Composants UI accessibles (focus, ARIA)
- NFR7: Responsive desktop ≥1024px + mobile ≥375px, breakpoint 768px
- NFR8: Pas de scroll horizontal
- NFR9: Chrome, Safari, Firefox (2 dernières versions)

### Additional Requirements

- Init Vite + React + shadcn/ui + Tailwind + Express
- Structure monorepo client/ + server/
- AuthContext global (utilisateur connecté + coloc active)
- mock-data.js centralisé (7 entités UML : Colocation, Utilisateur, Tache, Finance, Abonnement, Food_Recette, Food_Course)
- Layout responsive (Sidebar desktop / BottomNav mobile)
- 20 routes API REST Express
- Patterns : camelCase, PascalCase composants, shadcn/ui first, Tailwind only, fetch natif

### UX Design Requirements

- UX-DR1: Design system (couleurs primary #4799eb, typo Plus Jakarta Sans/Inter, Material Symbols icons)
- UX-DR2: Sidebar desktop avec 5 items navigation (Accueil, Tâches, Alimentation, Finances, Réglages) + profil utilisateur + logout
- UX-DR3: Bottom tab bar mobile (Accueil, Tâches, Food, Finances, Plus)
- UX-DR4: 4 widgets Dashboard (Finances 320€, Tâches 2 urgentes, Alimentation 15 articles, Abonnements 4 actifs)
- UX-DR5: Formulaires Login (email/password/forgot/join coloc) et Register (nom/email/password/social) conformes Stitch
- UX-DR6: Cards tâches Kanban (À Faire / Terminées) avec catégorie, titre, date, assignation, drag indicator
- UX-DR7: 3 cards métriques financières (Cagnotte 250€, Mes dettes -12.50€, On me doit 0€) + tableau paginé (5/24)
- UX-DR8: Liste courses par catégorie (12 articles) + 4 cards recettes (nom, durée, portions, favori)
- UX-DR9: 5 cards abonnement (Netflix, Orange, Spotify, Disney+, EDF) avec logo, type, prix, date prélèvement
- UX-DR10: Réglages : profil (nom/email), code invitation COLO-7829-X, 3 membres (rôles), 2 toggles notifications

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1-FR6 | Epic 2 | Auth & Onboarding |
| FR7-FR15 | Epic 3 | Dashboard |
| FR16-FR24 | Epic 4 | Tâches |
| FR25-FR31 | Epic 5 | Finances |
| FR32-FR38 | Epic 6 | Alimentation |
| FR39-FR43 | Epic 7 | Abonnements |
| FR44-FR48 | Epic 8 | Réglages |
| FR49-FR50 | Epic 1 | Fondations (navigation) |
| FR51-FR52 | Epic 9 | UX Polish |

**52/52 FRs couvertes. 0 FR orpheline.**

## Epic List

### Epic 1 : Fondations & Projet Setup
L'équipe de dev peut cloner le repo et démarrer avec une structure fonctionnelle, le layout responsive, l'AuthContext et les données mockées.
**FRs :** FR49, FR50 | **Dev :** Jopad

### Epic 2 : Authentification & Onboarding
Un visiteur peut créer un compte, se connecter, et rejoindre ou créer une colocation via un code d'invitation.
**FRs :** FR1-FR6 | **Dev :** Yohan

### Epic 3 : Dashboard & Vue d'ensemble
Un colocataire voit l'état complet de sa colocation via un dashboard avec widgets, graphiques et activités récentes.
**FRs :** FR7-FR15 | **Dev :** Jopad

### Epic 4 : Gestion des Tâches
Un colocataire peut créer, assigner, suivre et organiser les tâches ménagères avec récurrence, filtres et statistiques.
**FRs :** FR16-FR24 | **Dev :** Luis-Manuel

### Epic 5 : Gestion des Finances
Un colocataire peut gérer la cagnotte commune, ajouter des dépenses, et voir l'équilibre financier entre colocataires.
**FRs :** FR25-FR31 | **Dev :** Jopad

### Epic 6 : Alimentation & Recettes
Un colocataire peut consulter le menu du jour, gérer recettes et liste de courses, définir ses contraintes alimentaires.
**FRs :** FR32-FR38 | **Dev :** Luis-Manuel

### Epic 7 : Gestion des Abonnements
Un colocataire peut consulter, ajouter et gérer les abonnements partagés de la colocation.
**FRs :** FR39-FR43 | **Dev :** Yohan

### Epic 8 : Réglages & Profil
Un colocataire peut gérer son profil, et un admin peut gérer les membres et les notifications.
**FRs :** FR44-FR48 | **Dev :** Yohan

### Epic 9 : UX Polish & Validation
L'application affiche des feedbacks clairs et tous les écrans sont responsive et conformes aux designs Stitch.
**FRs :** FR51-FR52, UX-DR1 à UX-DR10 | **Dev :** Tous

## Epic 1 : Fondations & Projet Setup

L'équipe de dev peut cloner le repo et démarrer avec une structure fonctionnelle, le layout responsive, l'AuthContext et les données mockées.

### Story 1.1 : Initialisation du projet

As a **développeur**,
I want **un projet Vite + React + shadcn/ui + Express initialisé avec la structure monorepo**,
So that **l'équipe peut commencer à développer immédiatement**.

**Acceptance Criteria:**

**Given** le repo est cloné
**When** je lance `npm install && npm run dev`
**Then** le client React démarre sur :5173 et le serveur Express sur :3001
**And** shadcn/ui et Tailwind sont configurés

### Story 1.2 : Layout responsive et navigation

As a **colocataire**,
I want **une navigation avec sidebar sur desktop et bottom tab bar sur mobile**,
So that **je peux accéder à tous les modules depuis n'importe quel écran**.

**Acceptance Criteria:**

**Given** je suis sur n'importe quelle page
**When** la largeur d'écran est ≥768px
**Then** une sidebar s'affiche avec : Accueil, Tâches, Alimentation, Finances, Réglages + profil utilisateur + logout

**Given** je suis sur n'importe quelle page
**When** la largeur d'écran est <768px
**Then** une bottom tab bar s'affiche avec : Accueil, Tâches, Food, Finances, Plus

### Story 1.3 : AuthContext et mock data

As a **développeur**,
I want **un AuthContext global et un fichier mock-data.js centralisé avec les 7 entités UML**,
So that **tous les modules peuvent accéder à l'utilisateur connecté et aux données mockées**.

**Acceptance Criteria:**

**Given** l'app est chargée
**When** un utilisateur est "connecté" (mock)
**Then** `useAuth()` retourne l'utilisateur courant et la colocation active
**And** `mockData.js` contient des données réalistes pour : Colocation, Utilisateur, Tache, Finance, Abonnement, Food_Recette, Food_Course

## Epic 2 : Authentification & Onboarding

Un visiteur peut créer un compte, se connecter, et rejoindre ou créer une colocation via un code d'invitation.

### Story 2.1 : Page de connexion

As a **visiteur**,
I want **me connecter avec mon email et mot de passe**,
So that **j'accède à ma colocation**.

**Acceptance Criteria:**

**Given** je suis sur `/login`
**When** je saisis un email et mot de passe valides et clique "SE CONNECTER"
**Then** je suis redirigé vers le dashboard
**And** le formulaire affiche les champs email et password avec toggle visibilité
**And** un lien "Mot de passe oublié ?" et "Créer un compte" sont visibles
**And** une section "Rejoindre une colocation existante" avec champ code + bouton "Rejoindre" est affichée

### Story 2.2 : Page d'inscription

As a **visiteur**,
I want **créer un compte avec mon nom, email et mot de passe**,
So that **je peux rejoindre ou créer une colocation**.

**Acceptance Criteria:**

**Given** je suis sur `/register`
**When** je remplis nom, email, mot de passe (≥8 caractères) et clique "S'INSCRIRE"
**Then** mon compte est créé et je suis redirigé vers le choix créer/rejoindre colocation
**And** des boutons Google et Facebook sont affichés (visuels uniquement, non fonctionnels)
**And** un lien "Déjà un compte ? Se connecter" est visible

### Story 2.3 : Créer ou rejoindre une colocation

As a **utilisateur connecté**,
I want **créer une nouvelle colocation ou en rejoindre une existante via un code d'invitation**,
So that **je peux commencer à utiliser l'application avec mes colocataires**.

**Acceptance Criteria:**

**Given** je suis connecté mais sans colocation
**When** je crée une colocation
**Then** un code d'invitation unique est généré (format COLO-XXXX-X)

**Given** je suis connecté mais sans colocation
**When** je saisis un code d'invitation valide et clique "Rejoindre"
**Then** je rejoins la colocation et suis redirigé vers le dashboard

### Story 2.4 : Réinitialisation mot de passe (mock)

As a **utilisateur**,
I want **demander la réinitialisation de mon mot de passe**,
So that **je puisse récupérer l'accès à mon compte**.

**Acceptance Criteria:**

**Given** je suis sur `/login`
**When** je clique "Mot de passe oublié ?" et saisis mon email
**Then** un message de confirmation s'affiche : "Un email de réinitialisation a été envoyé"

## Epic 3 : Dashboard & Vue d'ensemble

Un colocataire voit l'état complet de sa colocation en un coup d'oeil via un dashboard avec widgets, graphiques et activités récentes.

### Story 3.1 : Dashboard avec 4 widgets

As a **colocataire**,
I want **voir un dashboard avec 4 widgets résumant finances, tâches, alimentation et abonnements**,
So that **je comprends l'état de ma colocation en 5 secondes**.

**Acceptance Criteria:**

**Given** je suis connecté et sur `/dashboard`
**When** la page se charge
**Then** 4 widgets s'affichent : Finances (solde cagnotte + tendance), Tâches (nombre urgentes + prochaine tâche), Alimentation (nombre articles courses), Abonnements (nombre services actifs)
**And** un header affiche "Bonjour, [prénom] 👋" + bouton "Nouvelle dépense"
**And** la page charge en moins de 1 seconde

### Story 3.2 : Graphique et activités récentes

As a **colocataire**,
I want **voir un graphique des dépenses mensuelles et le flux d'activités récentes**,
So that **je peux suivre les tendances financières et l'activité de la colocation**.

**Acceptance Criteria:**

**Given** je suis sur le dashboard
**When** je scrolle sous les widgets
**Then** un graphique des dépenses mensuelles s'affiche
**And** un flux de 3 activités récentes s'affiche avec timestamps
**And** un tableau des soldes/équilibres entre colocataires s'affiche

### Story 3.3 : Navigation depuis les widgets

As a **colocataire**,
I want **cliquer sur un widget pour aller directement au module correspondant**,
So that **je peux agir rapidement sur ce que je vois dans le dashboard**.

**Acceptance Criteria:**

**Given** je suis sur le dashboard
**When** je clique sur le widget Tâches
**Then** je suis redirigé vers `/tasks`

**Given** je suis sur le dashboard
**When** je clique sur le widget Finances
**Then** je suis redirigé vers `/finances`

## Epic 4 : Gestion des Tâches

Un colocataire peut créer, assigner, suivre et organiser les tâches ménagères avec récurrence, filtres et statistiques.

### Story 4.1 : Liste des tâches et création

As a **colocataire**,
I want **voir les tâches en colonnes (À Faire / Terminées) et en créer de nouvelles**,
So that **je peux organiser les tâches ménagères de la colocation**.

**Acceptance Criteria:**

**Given** je suis sur `/tasks`
**When** la page se charge
**Then** les tâches s'affichent en colonnes "À Faire" et "Terminées" avec compteurs
**And** chaque card affiche : catégorie, titre, date, assignation

**Given** je clique "NOUVELLE TÂCHE"
**When** je remplis titre, description, statut, assignation, date d'échéance
**Then** la tâche est créée et apparaît dans la colonne appropriée

### Story 4.2 : Modification, suppression et changement de statut

As a **colocataire**,
I want **modifier, supprimer ou changer le statut d'une tâche**,
So that **je peux maintenir la liste de tâches à jour**.

**Acceptance Criteria:**

**Given** une tâche existe
**When** je clique modifier et change les champs
**Then** la tâche est mise à jour

**Given** une tâche existe
**When** je clique supprimer et confirme dans la pop-up
**Then** la tâche est supprimée

**Given** une tâche est "À faire"
**When** je change son statut en "Terminée"
**Then** la tâche se déplace dans la colonne "Terminées"

### Story 4.3 : Récurrence, filtres et assignation

As a **colocataire**,
I want **définir des tâches récurrentes, filtrer et assigner des tâches**,
So that **les tâches régulières sont automatisées et organisées**.

**Acceptance Criteria:**

**Given** je crée ou modifie une tâche
**When** je sélectionne une récurrence (quotidienne/hebdo/mensuelle)
**Then** le champ récurrence est sauvegardé sur la tâche

**Given** je suis sur la page tâches
**When** je filtre par statut, assignation ou date
**Then** seules les tâches correspondantes s'affichent

**Given** je suis sur la page tâches
**When** j'assigne une tâche à un autre membre
**Then** le badge assignation de la tâche est mis à jour

### Story 4.4 : Statistiques et bulk action

As a **colocataire**,
I want **voir les statistiques par membre et déléguer plusieurs tâches en une fois**,
So that **la répartition du travail est équitable et efficace**.

**Acceptance Criteria:**

**Given** je suis sur la page tâches
**When** je consulte les statistiques
**Then** l'historique des tâches par membre s'affiche (nombre terminées par personne)

**Given** je sélectionne plusieurs tâches
**When** je choisis "Déléguer" dans le menu bulk action
**Then** toutes les tâches sélectionnées sont réassignées au membre choisi

## Epic 5 : Gestion des Finances

Un colocataire peut gérer la cagnotte commune, ajouter des dépenses, et voir l'équilibre financier entre colocataires.

### Story 5.1 : Vue finances et cards métriques

As a **colocataire**,
I want **voir la cagnotte commune, mes dettes et ce qu'on me doit**,
So that **je connais ma situation financière dans la colocation**.

**Acceptance Criteria:**

**Given** je suis sur `/finances`
**When** la page se charge
**Then** 3 cards s'affichent : Cagnotte Commune (montant + tendance), Mes dettes (montant), On me doit (montant)
**And** un bouton "AJOUTER DÉPENSE" est visible

### Story 5.2 : CRUD dépenses et tableau

As a **colocataire**,
I want **ajouter, modifier et supprimer des dépenses et les voir dans un tableau**,
So that **toutes les dépenses sont suivies et traçables**.

**Acceptance Criteria:**

**Given** je clique "AJOUTER DÉPENSE"
**When** je remplis titre, montant, date et payeur
**Then** la dépense est ajoutée et le tableau se met à jour

**Given** le tableau de dépenses s'affiche
**When** je consulte les colonnes
**Then** je vois : Date, Payé par, Description, Montant
**And** la pagination affiche "1 à 5 sur X résultats" avec boutons Précédent/Suivant

**Given** une dépense existe
**When** je la modifie ou la supprime (avec confirmation)
**Then** les données et l'équilibre sont recalculés

### Story 5.3 : Calcul d'équilibre et graphique

As a **colocataire**,
I want **que l'équilibre financier soit calculé automatiquement et voir un graphique récapitulatif**,
So that **chacun sait qui doit quoi à qui**.

**Acceptance Criteria:**

**Given** une dépense de 50€ est ajoutée par Jopad (3 colocataires)
**When** l'équilibre est recalculé
**Then** Yohan doit 16.67€ à Jopad et Luis-Manuel doit 16.67€ à Jopad

**Given** je suis sur la page finances
**When** je consulte le graphique
**Then** un graphique récapitulatif des dépenses mensuelles s'affiche

## Epic 6 : Alimentation & Recettes

Un colocataire peut consulter le menu du jour, gérer recettes et liste de courses, définir ses contraintes alimentaires.

### Story 6.1 : Menu du jour et recettes

As a **colocataire**,
I want **consulter le menu du jour avec des suggestions et rechercher des recettes**,
So that **je trouve facilement quoi cuisiner**.

**Acceptance Criteria:**

**Given** je suis sur `/food`
**When** la page se charge
**Then** des recettes suggérées depuis le catalogue mocké s'affichent en cards (nom, durée, portions, icône favori)

**Given** je suis sur la page alimentation
**When** je tape dans la barre de recherche
**Then** les recettes se filtrent dynamiquement par ingrédient, catégorie ou nom

### Story 6.2 : CRUD recettes et favoris

As a **colocataire**,
I want **créer, modifier, supprimer des recettes et les ajouter en favoris**,
So that **la colocation a ses propres recettes partagées**.

**Acceptance Criteria:**

**Given** je clique "Proposer une recette"
**When** je remplis nom, ingrédients, temps de préparation, contraintes
**Then** la recette est créée et apparaît dans la liste

**Given** une recette existe
**When** je clique sur l'icône coeur
**Then** la recette est ajoutée à mes favoris (icône remplie)

**Given** une recette existe
**When** je la modifie ou la supprime
**Then** les changements sont appliqués

### Story 6.3 : Liste de courses et contraintes alimentaires

As a **colocataire**,
I want **gérer la liste de courses et définir mes contraintes alimentaires**,
So that **on sait ce qu'il faut acheter et ce que chacun peut manger**.

**Acceptance Criteria:**

**Given** je suis sur la section liste de courses
**When** j'ajoute un article via la barre de recherche + bouton "Ajouter"
**Then** l'article apparaît dans la liste, classé par catégorie

**Given** un article est dans la liste
**When** je le coche
**Then** il est marqué comme acheté (barré visuellement)

**Given** je suis dans mes paramètres alimentaires
**When** je définis mes contraintes (allergies, régimes)
**Then** mes contraintes sont sauvegardées

## Epic 7 : Gestion des Abonnements

Un colocataire peut consulter, ajouter et gérer les abonnements partagés de la colocation.

### Story 7.1 : Liste des abonnements

As a **colocataire**,
I want **voir la liste des abonnements partagés avec le coût mensuel total**,
So that **je sais combien coûtent nos abonnements et quand ils sont prélevés**.

**Acceptance Criteria:**

**Given** je suis sur `/subscriptions`
**When** la page se charge
**Then** les abonnements s'affichent en cards avec : logo/icône, nom, type (badge), prix/mois, date prochain prélèvement, bouton "Modifier"
**And** le coût mensuel total s'affiche en haut

### Story 7.2 : CRUD abonnements et détails

As a **colocataire**,
I want **ajouter, modifier et supprimer des abonnements, voir les places disponibles et les identifiants**,
So that **les abonnements de la colocation sont bien gérés**.

**Acceptance Criteria:**

**Given** je clique "AJOUTER ABONNEMENT"
**When** je remplis nom du service, prix, date de prélèvement
**Then** l'abonnement est ajouté et le coût total est recalculé

**Given** un abonnement existe
**When** je clique "Modifier"
**Then** je peux modifier ses informations ou le supprimer

**Given** un abonnement a des places limitées
**When** je consulte la card
**Then** le nombre de places disponibles s'affiche (ex: 3/4)

**Given** un abonnement a des identifiants partagés
**When** je consulte les détails
**Then** les identifiants de connexion sont visibles

## Epic 8 : Réglages & Profil

Un colocataire peut gérer son profil, et un admin peut gérer les membres et les notifications.

### Story 8.1 : Profil utilisateur

As a **colocataire**,
I want **modifier mon nom et email**,
So that **mes informations sont à jour**.

**Acceptance Criteria:**

**Given** je suis sur `/settings`
**When** je modifie mon nom ou email et clique "Mettre à jour"
**Then** mes informations sont sauvegardées

### Story 8.2 : Gestion de la colocation (admin)

As a **admin**,
I want **voir le code d'invitation, la liste des membres avec leurs rôles, et inviter de nouveaux colocataires**,
So that **je peux gérer qui fait partie de la colocation**.

**Acceptance Criteria:**

**Given** je suis admin sur la page réglages
**When** je consulte la section "Ma Colocation"
**Then** le code d'invitation s'affiche (COLO-XXXX-X) et est copiable
**And** la liste des membres s'affiche avec leurs rôles (Admin/Membre)

**Given** je suis admin
**When** je clique "Inviter un colocataire"
**Then** le code d'invitation est partageable

### Story 8.3 : Notifications

As a **colocataire**,
I want **activer ou désactiver les notifications email et push**,
So that **je contrôle les alertes que je reçois**.

**Acceptance Criteria:**

**Given** je suis sur la page réglages, section notifications
**When** je toggle "Notifications par e-mail"
**Then** le toggle change d'état (activé/désactivé)

**Given** je suis sur la page réglages
**When** je toggle "Notifications Push"
**Then** le toggle change d'état

## Epic 9 : UX Polish & Validation

L'application affiche des feedbacks clairs et tous les écrans sont responsive et conformes aux designs Stitch.

### Story 9.1 : Validation formulaires et messages d'erreur

As a **colocataire**,
I want **voir des messages d'erreur clairs quand je fais une saisie invalide**,
So that **je sais exactement quoi corriger**.

**Acceptance Criteria:**

**Given** je soumets un formulaire avec des champs requis vides
**When** la validation s'exécute
**Then** un message d'erreur rouge s'affiche sous chaque champ invalide

**Given** je tente d'ajouter une dépense de 0€ ou négative
**When** la validation s'exécute
**Then** un message explicite refuse la saisie

### Story 9.2 : Pop-ups de confirmation et responsive final

As a **colocataire**,
I want **des confirmations avant les actions critiques et que tout soit responsive**,
So that **je ne supprime rien par accident et l'app marche bien sur mobile**.

**Acceptance Criteria:**

**Given** je clique supprimer sur une tâche/dépense/abonnement
**When** la pop-up de confirmation s'affiche
**Then** je dois confirmer avant que l'action s'exécute

**Given** je suis sur n'importe quel écran
**When** je passe de desktop à mobile (ou inverse)
**Then** le layout s'adapte sans scroll horizontal et sans perte de fonctionnalité
