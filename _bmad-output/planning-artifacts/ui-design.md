---
source: "Google Stitch Project #9935372244892167775"
sourceUrl: "https://stitch.withgoogle.com/projects/9935372244892167775"
date: "2026-03-19"
screens: 8
---

# UI Design Reference — LaBonneColoc

**Source :** Google Stitch Project #9935372244892167775
**Ce document capture l'intégralité des designs Stitch pour servir de référence d'implémentation.**

## Design System

### Palette de couleurs

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#4799eb` | Boutons principaux, liens actifs, icônes actives |
| `primary-hover` | `#3b82f6` | Hover sur boutons/liens |
| `primary-light` | `#eef6fd` | Backgrounds d'éléments actifs dans la sidebar |
| `bg-light` | `#f6f7f8` | Background général des pages |
| `bg-dark` | `#111921` | Background mode sombre |
| `surface` | `#ffffff` | Cards, formulaires, sidebar |
| `surface-dark` | `#1a2632` | Cards mode sombre |
| `text-main` | `#0e141b` | Texte principal |
| `text-sub` | `#4e7397` | Texte secondaire, labels |
| `success` | `#22c55e` | Badges positifs, tendances hausse |
| `warning` | `#f59e0b` | Badges attention |
| `danger` | `#ef4444` | Badges urgents, dettes |

### Typographie

| Propriété | Valeur |
|-----------|--------|
| **Font display** | "Plus Jakarta Sans", sans-serif |
| **Font body** | "Inter", sans-serif |
| **Icônes** | Material Symbols Outlined (fill: 0, weight: 400, grade: 0, size: 24px) |

### Espacements & Bordures

| Token | Valeur |
|-------|--------|
| `radius-sm` | 0.25rem |
| `radius-default` | 0.375rem–0.5rem |
| `radius-lg` | 0.75rem |
| `radius-xl` | 1rem |
| `radius-full` | 9999px |
| `shadow-sm` | 0 1px 2px rgba(0,0,0,0.05) |
| `shadow-md` | 0 4px 6px -1px rgba(0,0,0,0.1) |
| `shadow-card` | 0 1px 3px rgba(0,0,0,0.1) |

---

## Écran 1 : Connexion

**Route :** `/login`

### Structure

- Header : logo "ColocManager" + nav (Accueil, Fonctionnalités, Tarifs) + bouton "S'inscrire"
- Formulaire centré

### Formulaire

| Champ | Type | Icône | Placeholder |
|-------|------|-------|-------------|
| Email | email | — | "Email" |
| Mot de passe | password | visibility_off (toggle) | "Mot de passe" |

### Actions

- **Bouton principal :** "SE CONNECTER" (primary, full-width)
- **Lien :** "Mot de passe oublié ?"
- **Lien :** "Nouveau ici ? Créer un compte"
- **Section :** "Rejoindre une colocation existante" + icône `group_add` + bouton "Rejoindre"

### Footer

- "© 2023 ColocManager. Tous droits réservés."

---

## Écran 2 : Inscription

**Route :** `/register`

### Structure

- Header : logo "LaBonneColoc" + nav (Accueil, Fonctionnalités, Tarifs) + lien "Se connecter"
- Titre : "Créer un compte"
- Sous-titre : "Rejoignez notre communauté de colocataires"

### Formulaire

| Champ | Type | Icône | Validation |
|-------|------|-------|------------|
| Nom complet | text | person | Requis |
| Adresse email | email | mail | Requis, format email |
| Mot de passe | password | lock + visibility_off | "Au moins 8 caractères" |

### Actions

- **Bouton principal :** "S'INSCRIRE" (primary, full-width)
- **Social login :** Boutons Google + Facebook (visuels uniquement MVP)
- **Lien :** "Déjà un compte ? Se connecter"

---

## Écran 3 : Dashboard

**Route :** `/dashboard`

### Sidebar (Desktop)

| Icône | Label | Route |
|-------|-------|-------|
| `apartment` | LaBonneColoc (logo) | — |
| `dashboard` | Accueil | `/dashboard` |
| `check_circle` | Tâches | `/tasks` |
| `shopping_cart` | Alimentation | `/food` |
| `attach_money` | Finances | `/finances` |
| `settings` | Réglages | `/settings` |

**Profil utilisateur en bas :** Avatar + "Thomas Durand" + "<thomas@coloc.fr>" + icône `logout`

### Contenu principal

**Header :**

- "Bonjour, Thomas 👋"
- "Voici ce qui se passe dans votre colocation aujourd'hui"
- Bouton : "add Nouvelle dépense"

**4 Widgets (grille 2×2) :**

| Widget | Valeur | Badge | Détail |
|--------|--------|-------|--------|
| Finances | 320,00 € | +15 € | Solde cagnotte + tendance |
| Tâches | 2 tâches | Urgent | Prochaine : "Sortir les poubelles" |
| Alimentation | 15 articles | +3 items | Articles liste de courses |
| Abonnements | 4 services | Actifs | Nombre de services |

**Sections supplémentaires :**

- Graphique dépenses mensuelles (barres comparatives)
- Flux d'activités récentes (3 entrées avec timestamps)
- Tableau des soldes colocataires (3 personnes, montants)
- Card prochaine tâche
- Liste événements à venir (2 événements)

---

## Écran 4 : Gestion des Tâches

**Route :** `/tasks`

### Header

- Titre : "Tâches de la Colocation"
- Bouton : "add NOUVELLE TÂCHE"

### Colonnes (Kanban-style)

- **À Faire** (compteur : 3) — cards de tâches
- **Terminées** (compteur : 2) — cards de tâches

### Card Tâche

- Label catégorie (ex: "Cuisine", "Salon")
- Titre de la tâche
- Icône drag : `drag_indicator`
- Menu : `more_horiz`
- Date avec icône : `calendar_today` (à venir), `event_busy` (en retard), `check_circle` (terminée)
- Badge assignation (prénom)

### Actions

- Bouton "Ajouter une tâche" (secondaire, par colonne)
- Filtres par statut, assignation, date

---

## Écran 5 : Gestion des Finances

**Route :** `/finances`

### Header

- Titre : "Finances"
- Boutons : "AJOUTER DÉPENSE" + `filter_list` + `download`

### 3 Cards métriques

| Métrique | Valeur | Icône tendance |
|----------|--------|----------------|
| Cagnotte Commune | 250,00 € | trending_up +45.00€ ce mois |
| Mes dettes | -12,50 € | — |
| On me doit | 0,00 € | — |

### Tableau des dépenses récentes

| Colonne | Contenu |
|---------|---------|
| Date | Format "24 Oct 2023" |
| Payé par | Prénom |
| Description | Libellé de la dépense |
| Montant | XX,XX € |

- Pagination : "1 à 5 sur 24 résultats" + boutons Précédent/Suivant
- Menu contextuel par ligne : `more_vert`

---

## Écran 6 : Alimentation

**Route :** `/food`

### Section Liste de courses

- Titre : "Liste de courses" + compteur (12 articles)
- Barre de recherche + bouton "Ajouter"
- Articles groupés par catégorie :
  - Produits laitiers, Boulangerie, Frais, Épicerie, Hygiène, Ménage
- Chaque article : checkbox + nom + badge personne assignée
- Icônes : `check_circle` (acheté), `shopping_cart`

### Section Recettes Partagées

- Titre : "Recettes Partagées"
- Cards recette :
  - Image placeholder
  - Nom du plat
  - `schedule` Durée (ex: "20 min")
  - `person` Portions (ex: "4 portions")
  - Icône `favorite` (coeur pour favoris)
- Recettes mockées : Pâtes Carbonara (20min/4p), Quiche Lorraine (45min/6p), Salade César (15min/2p), Pancakes du Dimanche (30min/4p)
- Bouton : "Proposer une recette" (+ icône `restaurant_menu`)

---

## Écran 7 : Abonnements

**Route :** `/subscriptions`

### Header

- Titre : "Abonnements — Gérez les services partagés de la colocation"
- Bouton : "AJOUTER ABONNEMENT"
- Résumé : "Coût Mensuel Total: 145,50 €"

### Cards Abonnement

| Service | Type | Prix/mois | Prochain prélèvement |
|---------|------|-----------|---------------------|
| Netflix | PREMIUM | 17,99 € | 12 Oct |
| Internet (Orange) | FIBRE | 39,99 € | 01 Oct |
| Spotify Family | FAMILLE | 15,99 € | 22 Oct |
| Disney+ | ANNUEL | 8,99 € | 05 Nov |
| Électricité (EDF) | FIXE | 62,54 € | 15 Oct |

Chaque card :

- Logo/icône du service (`movie`, `router`, `audiotrack`, `stars`, `bolt`)
- Nom + type (badge)
- Prix/mois
- `calendar_today` Date prochain prélèvement
- Bouton "Modifier"

**Footer :** Bouton `add_circle` "Nouvel abonnement"

---

## Écran 8 : Réglages

**Route :** `/settings`

### Section Profil

- Titre : "Profil"
- Sous-titre : "Mettez à jour vos informations personnelles et votre compte"
- Champs : Nom complet (text), Adresse e-mail (email)
- Bouton : "Mettre à jour"

### Section Ma Colocation

- **Code d'invitation :** `COLO-7829-X` (copiable)
- **Liste des membres :**
  - Thomas (Vous) — Admin
  - Léa Martin — Membre
  - Marc Lefebvre — Membre
- Bouton : `person_add` "Inviter un colocataire"

### Section Notifications

| Toggle | Label | Description |
|--------|-------|-------------|
| ✅ | `mail` Notifications par e-mail | Résumé hebdomadaire des dépenses et tâches |
| ✅ | `notifications_active` Notifications Push | Alertes immédiates pour nouvelles tâches et messages |

### Footer

- Lien : "Supprimer le compte" (danger)

---

## Navigation Mobile (Bottom Tab Bar)

Pour les écrans < 768px, la sidebar est remplacée par une bottom tab bar :

| Icône | Label | Route |
|-------|-------|-------|
| `dashboard` | Accueil | `/dashboard` |
| `check_circle` | Tâches | `/tasks` |
| `restaurant` | Food | `/food` |
| `attach_money` | Finances | `/finances` |
| `more_horiz` | Plus | Menu (Abonnements, Réglages) |

---

## Données Mockées de Référence

### Utilisateurs

- Thomas Durand (Admin) — <thomas@coloc.fr>
- Léa Martin (Membre)
- Marc Lefebvre (Membre)

### Tâches

- Sortir les poubelles (Yohan, À faire, urgent)
- Ménage salon (Jopad, En cours)
- Vaisselle (Luis-Manuel, Terminée)

### Finances

- Cagnotte commune : 250,00 €
- Dépenses : Courses (50€, Thomas), Internet (30€, Léa), Électricité (45€, Marc)...
- 24 transactions au total (paginées par 5)

### Recettes

- Pâtes Carbonara (20min, 4 portions)
- Quiche Lorraine (45min, 6 portions)
- Salade César (15min, 2 portions)
- Pancakes du Dimanche (30min, 4 portions)

### Abonnements

- Netflix Premium : 17,99€/mois
- Internet Orange Fibre : 39,99€/mois
- Spotify Family : 15,99€/mois
- Disney+ Annuel : 8,99€/mois
- Électricité EDF Fixe : 62,54€/mois
