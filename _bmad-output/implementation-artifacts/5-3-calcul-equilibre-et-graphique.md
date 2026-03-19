---
epic: "Epic 5 : Gestion des Finances"
storyId: "5.3"
title: "Calcul d'equilibre et graphique"
assignee: "Jopad"
status: backlog
priority: high
frs: [FR29, FR31]
---

# Story 5.3 : Calcul d'equilibre et graphique

## User Story

As a **colocataire**,
I want **que l'equilibre financier soit calcule automatiquement et voir un graphique recapitulatif**,
So that **chacun sait qui doit quoi a qui**.

## Criteres d'Acceptation

**Given** une depense de 50EUR est ajoutee par Jopad (3 colocataires)
**When** l'equilibre est recalcule
**Then** Yohan doit 16.67EUR a Jopad et Luis-Manuel doit 16.67EUR a Jopad

**Given** je suis sur la page finances
**When** je consulte le graphique
**Then** un graphique recapitulatif des depenses mensuelles s'affiche

## Notes d'Implementation Technique

### Fichiers a Creer/Modifier

- `client/src/pages/Finances.jsx` — Ajouter section equilibre + graphique
- `client/src/lib/utils.js` — Fonction `calculateBalance(depenses, membres)` — logique metier : somme des depenses par personne, calcul de la part egale, dettes resultantes

### Logique Metier (FR29)

```
Pour chaque depense : total += montant, payeur.credit += montant
Part egale = total / nombre_membres
Pour chaque membre : solde = credit - part_egale
Si solde < 0 : le membre doit abs(solde) aux crediteurs
```

### Endpoints API

- `GET /api/finances` — Retourne toutes les depenses (le calcul se fait cote client)

### Composants Utilises

- shadcn/ui : `Card`, `Table`
- Recharts : `BarChart`, `Bar`, `XAxis`, `YAxis`, `Tooltip`, `ResponsiveContainer`

### Donnees Mock

- Equilibre calcule dynamiquement a partir des 24 depenses mockees
- Graphique : depenses agregees par mois sur 6 mois

### Reference Design

- Graphique : barres par mois, couleur `primary` (#4799eb), responsive
- Tableau equilibre : nom, montant du/credit (vert positif, rouge negatif)

## Dependances

- Story 5.2 (CRUD depenses)

## Definition of Done

- [ ] Tous les criteres d'acceptation passent
- [ ] Responsive : graphique et tableau adaptatifs
- [ ] Utilise shadcn/ui (Card, Table) + Recharts
- [ ] Calcul d'equilibre correct (verification avec exemple 50EUR / 3 personnes)
- [ ] Equilibre se met a jour apres ajout/suppression depense
- [ ] Pas d'erreur console
