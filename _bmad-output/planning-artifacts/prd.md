---
stepsCompleted: ["step-01-init", "step-02-discovery", "step-02b-vision", "step-02c-executive-summary", "step-03-success", "step-04-journeys", "step-05-domain-skipped", "step-06-innovation-skipped", "step-07-project-type", "step-08-scoping", "step-09-functional", "step-10-nonfunctional", "step-11-polish", "step-12-complete"]
classification:
  projectType: "web_app"
  domain: "general"
  complexity: "low"
  projectContext: "greenfield"
  responsive: "mobile-first"
  designReference: "Google Stitch Project 9935372244892167775"
inputDocuments:
  - "docs/Colocation-projet/DSP - colocation app.docx"
  - "docs/Colocation-projet/Correction user story.docx"
  - "docs/Colocation-projet/Tache.docx"
  - "docs/Colocation-projet/UML-app-colocation-MVP.png"
  - "docs/Colocation-projet/User_Flow_app_colocation.png"
  - "docs/Colocation-projet/Wireframes (6 files)"
  - "Google Stitch Project 9935372244892167775 (8 screens)"
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 0
  projectDocs: 7
workflowType: 'prd'
lastEdited: '2026-03-19'
editHistory:
  - date: '2026-03-19'
    changes: 'Clarified mock FRs (FR5, FR6, FR32), removed implementation leakage from NFRs, added acceptance criteria to all 4 user journeys'
---

# Product Requirements Document — LaBonneColoc

**Auteur :** Jopad
**Date :** 2026-03-19
**Référence design :** [Google Stitch #9935372244892167775](https://stitch.withgoogle.com/projects/9935372244892167775)

## Résumé Exécutif

**LaBonneColoc** est une application web responsive (mobile-first) de gestion collaborative de colocation. Elle centralise en un seul dashboard les quatre piliers de la vie en commun : **tâches ménagères, finances partagées, alimentation/repas et abonnements communs**.

L'application cible les colocataires qui perdent du temps et créent des conflits en jonglant entre WhatsApp, tableurs et notes de frigo. LaBonneColoc remplace ces 4+ outils fragmentés par **un dashboard unifié avec des widgets** : en un coup d'oeil, chaque colocataire voit ses tâches, ses soldes, le menu du jour et les abonnements actifs.

Le produit est un **MVP fonctionnel** réalisé en 3 jours par 3 développeurs (projet de formation IHM). Données mockées, composants UI existants, 8 écrans Google Stitch comme référence visuelle et fonctionnelle. L'application doit être testable, fonctionnelle de bout en bout, et responsive.

## Classification du Projet

| Critère | Valeur |
|---------|--------|
| **Type** | Application web SPA, responsive mobile-first |
| **Domaine** | Général — gestion collaborative de colocation (lifestyle) |
| **Complexité** | Faible — CRUD standard, calcul d'équilibre financier, données mockées |
| **Contexte** | Greenfield — nouveau produit, aucun système existant |
| **Équipe** | 3 développeurs, 3 jours (9 jours-homme) |
| **Design** | 8 écrans Google Stitch + wireframes desktop/mobile |
| **Données** | Mockées (PostgreSQL optionnel) |

## Critères de Succès

### Succès Utilisateur

- Un colocataire comprend **en 5 secondes** l'état de sa colocation via le dashboard
- Chaque flux est fonctionnel de bout en bout : inscription → connexion → créer/rejoindre coloc → naviguer → effectuer des actions (CRUD)
- Navigation intuitive : sidebar sur desktop, bottom tab bar sur mobile, conforme aux designs Stitch

### Succès Technique

- **8/8 écrans** Stitch implémentés et fonctionnels
- Application responsive (desktop + mobile)
- Tests passants sur les flux principaux
- Données mockées cohérentes pour une démo réaliste
- Chaque bouton, formulaire et widget produit une action visible

### Succès Scolaire (Cours IHM)

- **Démo fonctionnelle** devant le jury — tous les flux marchent en live
- **Design fidèle** aux maquettes Stitch — le prof évalue l'implémentation de l'interface
- Ergonomie conforme aux principes IHM (navigation claire, feedback utilisateur, cohérence visuelle)

### Résultats Mesurables

| Métrique | Cible MVP |
|----------|-----------|
| Écrans implémentés | 8/8 (tous les écrans Stitch) |
| Flux fonctionnels | 100% — chaque action produit un résultat |
| Responsive | Desktop + Mobile fonctionnels |
| Tests | Passants sur les flux principaux |
| Délai | 3 jours, livré fonctionnel |

## Périmètre & Développement Phasé

### Stratégie MVP

**Approche :** MVP "Experience-first" — démontrer une expérience utilisateur complète devant un jury IHM. **Tous les 8 écrans** doivent être intégrés, fonctionnels et fidèles aux designs Stitch. Aucun écran ne peut être omis.

### Périmètre MVP (Phase 1 — 3 jours)

- **Auth** : Inscription, connexion, mot de passe oublié (mock), rejoindre coloc via code d'invitation
- **Dashboard** : 4 widgets (finances, tâches, alimentation, abonnements), graphique dépenses, activités récentes, soldes colocataires
- **Tâches** : CRUD complet, assignation, statuts (À faire/En cours/Terminée), récurrence (quotidienne/hebdo/mensuelle), filtres, bulk action
- **Finances** : Cagnotte commune, ajouter dépense, historique/tableau, calcul d'équilibre entre colocataires, graphique
- **Alimentation** : Liste de courses, recettes partagées, menu du jour avec suggestions, recherche par ingrédient/catégorie, favoris
- **Abonnements** : Liste des services partagés, ajout/modification, coût mensuel total, dates de prélèvement, places disponibles
- **Réglages** : Profil, code invitation, gestion des membres (rôles), notifications (toggles)
- **Statistiques** : Historique des tâches par membre, répartition du travail

### Post-MVP (Phase 2)

- Backend réel (Node.js/Express + PostgreSQL)
- Auth OAuth (Google/Facebook)
- Notifications push réelles
- Suggestions IA pour les recettes
- Génération auto de liste de courses depuis le menu planifié

### Vision (Phase 3)

- Application mobile native (React Native / Flutter)
- Paiements intégrés entre colocataires
- Gamification des tâches ménagères

### Répartition par compétence

| Dev | Profil | Modules assignés | Justification |
|-----|--------|-----------------|---------------|
| **Jopad** | Expérimenté | Dashboard, Finances, Architecture (routing, layout, mock data) | Tâches complexes : calcul d'équilibre, architecture SPA, responsive layout |
| **Yohan** | Débutant | Auth (Connexion/Inscription), Réglages, Abonnements | Formulaires simples, CRUD basique, cards abonnement |
| **Luis-Manuel** | Débutant | Tâches, Alimentation | CRUD Kanban + recherche dynamique, guidé par les designs Stitch |

### Mitigation des risques

| Risque | Impact | Mitigation |
|--------|--------|------------|
| **Temps insuffisant** | Écrans incomplets | Jopad pose architecture + layout + mock data dès J1 matin. Intégration continue dès J2 |
| **Devs débutants bloqués** | Retard sur modules | Composants shadcn/ui prêts à l'emploi + structure posée par Jopad |
| **Responsive mal géré** | Mauvaise impression jury | Classes responsive Tailwind/shadcn dès le début, pas en fin de sprint |
| **Données incohérentes** | Bugs visuels à la démo | Fichier `mock-data.js` centralisé dès J1 avec données réalistes |

## Parcours Utilisateurs

### Parcours 1 : Yohan, nouveau colocataire (Onboarding)

Yohan vient d'emménager dans une coloc de 3 personnes. Son colocataire Jopad lui envoie un code d'invitation : **COLO-7829-X**. Il ouvre LaBonneColoc, clique sur **"S'inscrire"**, entre son nom, email et mot de passe. Après l'inscription, il clique sur **"Rejoindre une colocation existante"**, entre le code, et atterrit sur le **dashboard**. D'un coup d'oeil, il voit les tâches en cours, la cagnotte commune à 320€, le menu du jour, et les 4 abonnements partagés. Il clique sur le widget Tâches et voit qu'il doit sortir les poubelles.

**Capacités :** Inscription, code d'invitation, rejoindre coloc, dashboard avec widgets, navigation vers modules

**Critères d'acceptation :**

- [ ] Le formulaire d'inscription valide nom, email et mot de passe (≥8 caractères)
- [ ] Le code d'invitation COLO-XXXX-X permet de rejoindre une colocation existante
- [ ] Après connexion, le dashboard affiche les 4 widgets en moins de 1 seconde
- [ ] Cliquer sur un widget redirige vers le module correspondant

### Parcours 2 : Jopad, admin de la coloc (Gestion quotidienne)

Jopad est l'admin de la coloc. Il ouvre le dashboard et voit 2 tâches urgentes. Il va dans le module **Tâches**, crée "Ménage salon" avec récurrence hebdomadaire, l'assigne à Yohan. Il passe aux **Finances** — il ajoute une dépense courses de 50€. L'équilibre se met à jour : Yohan lui doit 16.67€, Luis-Manuel aussi. Il vérifie les **Abonnements** — Netflix sera prélevé dans 3 jours. Il finit par les **Réglages** où il confirme que les 3 membres sont listés.

**Capacités :** CRUD tâches + récurrence, ajout dépenses, calcul d'équilibre, consultation abonnements, gestion membres

**Critères d'acceptation :**

- [ ] Une tâche créée avec récurrence hebdomadaire affiche le champ fréquence
- [ ] L'ajout d'une dépense de 50€ met à jour l'équilibre : chaque colocataire doit 16.67€
- [ ] Le tableau des dépenses affiche date, libellé, payeur et montant
- [ ] La page Réglages liste les 3 membres avec leurs rôles (Admin/Membre)

### Parcours 3 : Luis-Manuel, colocataire gourmand (Alimentation)

Luis-Manuel ouvre le module **Alimentation** pour voir le menu du jour. Il cherche une recette de pâtes carbonara via la barre de recherche. Il la trouve, l'ajoute aux favoris, et ajoute les ingrédients manquants à la **liste de courses** (crème, lardons, parmesan). Yohan voit la liste mise à jour sur son dashboard via le widget Alimentation. Luis-Manuel revient des courses, coche les articles achetés et ajoute la dépense de 23€ dans les **Finances**.

**Capacités :** Recherche recettes, favoris, liste de courses (CRUD articles), lien alimentation→finances

**Critères d'acceptation :**

- [ ] La recherche par ingrédient retourne des résultats filtrés dynamiquement
- [ ] Un clic sur le coeur ajoute la recette aux favoris (état visuel mis à jour)
- [ ] Les articles ajoutés à la liste de courses apparaissent immédiatement
- [ ] Cocher un article le marque comme acheté (barré visuellement)

### Parcours 4 : Jopad, admin — gestion d'erreur (Edge case)

Jopad essaie de créer une tâche sans titre — message d'erreur. Il ajoute une dépense de 0€ — refusé. Il tente de se retirer comme admin — impossible sans transférer le rôle. L'app guide l'utilisateur avec des **feedbacks clairs** : pop-ups de confirmation, messages d'erreur, validations de formulaire.

**Capacités :** Validation formulaires, messages d'erreur, pop-ups de confirmation, contraintes de rôle admin

**Critères d'acceptation :**

- [ ] Soumettre un formulaire vide affiche un message d'erreur sur le champ requis
- [ ] Une dépense de 0€ ou négative est refusée avec un message explicite
- [ ] La suppression d'un élément affiche une pop-up de confirmation avant exécution
- [ ] Un admin ne peut pas se retirer sans transférer le rôle à un autre membre

### Résumé des capacités par parcours

| Parcours | Capacités clés |
|----------|---------------|
| **Yohan (onboarding)** | Auth, inscription, code invitation, dashboard, navigation |
| **Jopad (gestion)** | CRUD tâches, récurrence, finances, équilibre, abonnements, réglages |
| **Luis-Manuel (alimentation)** | Recettes, recherche, favoris, liste de courses, lien finances |
| **Jopad (edge case)** | Validation, feedbacks, gestion d'erreur, contraintes UX |

## Exigences Techniques

### Stack technique

| Critère | Choix |
|---------|-------|
| **Type** | SPA (Single Page Application) |
| **Framework** | React |
| **Composants UI** | Radix UI + shadcn/ui |
| **State** | State local (useState/useContext) |
| **Routing** | React Router |
| **Responsive** | Mobile-first, breakpoints desktop/mobile |
| **Données** | Mockées (JSON/in-memory) |
| **Navigateurs** | Chrome, Safari, Firefox (dernières 2 versions) |

### Architecture

- **SPA avec React Router** — navigation client-side entre les 8 écrans (Connexion, Inscription, Dashboard, Tâches, Finances, Alimentation, Abonnements, Réglages)
- **Composants shadcn/ui** — Card, Button, Input, Table, Dialog, Tabs, Badge, Avatar, etc.
- **State local simple** — `useState` par module, `useContext` pour données partagées (utilisateur connecté, colocation active)
- **Mock data** — fichier centralisé `mock-data.js` simulant les données (utilisateurs, tâches, finances, recettes, abonnements)
- **Layout responsive** — Sidebar (desktop ≥768px) / Bottom tab bar (mobile <768px)

### Modèle de données (UML)

7 entités : **Colocation** (id, nom, codeInvitation, cagnotteCommune) → **Utilisateur** (id, nom, email, motDePasse, photoProfil) → **Tache** (id, titre, statut, dateEcheance, assigneA, creePar) + **Finance** (id, titre, montant, type, dateOperation, payePar) + **Abonnement** (id, nomService, identifiantCompte, datePrelevement, coutMensuel) + **Food_Recette** (id, nomPlat, tempsPreparation, contraintesDiets, estFavori) + **Food_Course** (id, nomArticle, estAchete)

## Exigences Fonctionnelles

### Authentification & Onboarding

- **FR1** : Un visiteur peut créer un compte avec nom, email et mot de passe
- **FR2** : Un visiteur peut se connecter avec email et mot de passe
- **FR3** : Un utilisateur connecté peut créer une nouvelle colocation
- **FR4** : Un utilisateur connecté peut rejoindre une colocation existante via un code d'invitation
- **FR5** : Un utilisateur peut demander la réinitialisation de son mot de passe et voit un message de confirmation (flux visuel, sans envoi réel d'email)
- **FR6** : La page d'inscription affiche des boutons de connexion Google et Facebook (visuels uniquement, non fonctionnels pour le MVP)

### Dashboard

- **FR7** : Un colocataire peut consulter un dashboard avec des widgets résumant l'état de la colocation
- **FR8** : Le widget Finances affiche le solde de la cagnotte commune et la tendance
- **FR9** : Le widget Tâches affiche le nombre de tâches urgentes et la prochaine tâche à faire
- **FR10** : Le widget Alimentation affiche le nombre d'articles dans la liste de courses
- **FR11** : Le widget Abonnements affiche le nombre de services actifs
- **FR12** : Un colocataire peut consulter un graphique des dépenses mensuelles
- **FR13** : Un colocataire peut consulter le flux d'activités récentes de la colocation
- **FR14** : Un colocataire peut consulter les soldes/équilibres entre colocataires
- **FR15** : Un colocataire peut naviguer vers un module en cliquant sur le widget correspondant

### Gestion des Tâches

- **FR16** : Un colocataire peut créer une tâche avec titre, description, statut, assignation et date d'échéance
- **FR17** : Un colocataire peut modifier une tâche existante
- **FR18** : Un colocataire peut supprimer une tâche
- **FR19** : Un colocataire peut changer le statut d'une tâche (À faire, En cours, Terminée)
- **FR20** : Un colocataire peut assigner une tâche à un autre membre
- **FR21** : Un colocataire peut définir une récurrence sur une tâche (quotidienne, hebdomadaire, mensuelle)
- **FR22** : Un colocataire peut filtrer les tâches par statut, assignation, date
- **FR23** : Un colocataire peut consulter l'historique et les statistiques des tâches par membre
- **FR24** : Un colocataire peut déléguer plusieurs tâches en une action groupée (bulk action)

### Gestion des Finances

- **FR25** : Un colocataire peut consulter la cagnotte commune et son solde
- **FR26** : Un colocataire peut ajouter une dépense avec titre, montant, date et payeur
- **FR27** : Un colocataire peut modifier une dépense existante
- **FR28** : Un colocataire peut supprimer une dépense
- **FR29** : Le système calcule automatiquement l'équilibre financier entre colocataires (qui doit quoi à qui)
- **FR30** : Un colocataire peut consulter le tableau historique des dépenses (date, libellé, payeur, montant)
- **FR31** : Un colocataire peut consulter un graphique récapitulatif des finances

### Alimentation

- **FR32** : Un colocataire peut consulter le menu du jour avec des recettes suggérées depuis le catalogue mocké
- **FR33** : Un colocataire peut rechercher des recettes par ingrédient, catégorie ou nom
- **FR34** : Un colocataire peut créer une recette (nom, ingrédients, temps de préparation, contraintes)
- **FR35** : Un colocataire peut modifier ou supprimer une recette
- **FR36** : Un colocataire peut ajouter une recette à ses favoris
- **FR37** : Un colocataire peut consulter et gérer la liste de courses (ajouter, cocher, supprimer des articles)
- **FR38** : Un colocataire peut définir ses contraintes alimentaires (allergies, régimes)

### Gestion des Abonnements

- **FR39** : Un colocataire peut consulter la liste des abonnements partagés avec le coût mensuel total
- **FR40** : Un colocataire peut ajouter un abonnement (nom du service, prix, date de prélèvement)
- **FR41** : Un colocataire peut modifier ou supprimer un abonnement
- **FR42** : Un colocataire peut voir le nombre de places disponibles sur un abonnement partagé
- **FR43** : Un colocataire peut consulter les identifiants de connexion d'un abonnement partagé

### Réglages & Profil

- **FR44** : Un colocataire peut modifier ses informations de profil (nom, email)
- **FR45** : Un admin peut consulter et partager le code d'invitation de la colocation
- **FR46** : Un admin peut voir la liste des membres et leurs rôles (Admin/Membre)
- **FR47** : Un admin peut inviter un nouveau colocataire
- **FR48** : Un colocataire peut activer/désactiver les notifications email et push (toggles)

### Navigation & UX

- **FR49** : L'application affiche une sidebar de navigation sur desktop (Accueil, Tâches, Alimentation, Finances, Réglages)
- **FR50** : L'application affiche une bottom tab bar sur mobile (Accueil, Tâches, Food, Finances, Plus)
- **FR51** : L'application affiche des messages d'erreur clairs lors de saisies invalides
- **FR52** : L'application affiche des pop-ups de confirmation pour les actions critiques (suppression, validation)

## Exigences Non-Fonctionnelles

### Performance

- Interactions utilisateur (navigation, CRUD) : réponse en moins de **500ms**
- Dashboard et widgets : chargement en moins de **1 seconde**

### Accessibilité (Cours IHM)

- Contraste des couleurs : ratio WCAG AA minimum
- Navigation au clavier fonctionnelle sur les éléments interactifs
- Labels sur tous les champs de formulaire
- Les composants UI fournissent l'accessibilité de base (gestion du focus, attributs ARIA, rôles sémantiques)

### Responsive Design

- Fonctionnelle sur desktop (≥1024px) et mobile (≥375px)
- Breakpoint principal : **768px** (sidebar → bottom tab bar)
- Aucun scroll horizontal
- Composants adaptés à la largeur sans perte de fonctionnalité

### Compatibilité Navigateurs

- Chrome (dernières 2 versions)
- Safari (dernières 2 versions)
- Firefox (dernières 2 versions)
