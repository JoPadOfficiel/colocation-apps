---
title: "Story 5.3 : Calcul d'équilibre et graphique"
epic: "Epic 5 : Gestion des Finances"
status: "review"
assignee: "Jopad"
---

# Story 5.3 : Calcul d'équilibre et graphique

Status: review

## Story

As a colocataire,
I want que l'équilibre financier soit calculé automatiquement et voir un graphique récapitulatif,
So that chacun sait qui doit quoi à qui.

## Acceptance Criteria

1. **Given** une dépense de 50€ est ajoutée par Jopad (3 colocataires), **When** l'équilibre est recalculé, **Then** Yohan doit 16.67€ à Jopad et Luis-Manuel doit 16.67€ à Jopad.
2. **And** le tableau d'équilibre affiche clairement qui doit combien à qui.
3. **And** je suis sur la page finances, **When** je consulte le graphique, **Then** un graphique récapitulatif des dépenses mensuelles s'affiche.
4. **And** le graphique est responsive et s'adapte aux écrans mobile et desktop.

## Tasks / Subtasks

- [x] **Task 1 : Implémenter le calcul d'équilibre financier** (AC: #1, #2)
  - [x] Créer fonction `calculateBalance()` qui calcule qui doit quoi à qui
  - [x] Algorithme : pour chaque colocataire, calculer (montant payé - part équitable)
  - [x] Si balance > 0 : créance (on lui doit), si balance < 0 : dette (il doit)
  - [x] Générer liste de transactions minimales pour équilibrer (optionnel pour MVP)
  - [x] Retourner tableau d'équilibres par colocataire

- [x] **Task 2 : Créer section "Équilibre entre colocataires"** (AC: #2)
  - [x] Ajouter Card après les 3 cards métriques
  - [x] Titre : "Équilibre entre colocataires"
  - [x] Afficher tableau avec colonnes : Membre, Solde, Statut
  - [x] Solde positif en vert (créance), négatif en rouge (dette)
  - [x] Format : "Thomas doit 16,67 € à Jopad" ou "Jopad : +33,34 €"
  - [x] Utiliser Table shadcn/ui pour l'affichage

- [x] **Task 3 : Implémenter le graphique des dépenses mensuelles** (AC: #3, #4)
  - [x] Installer Recharts : `npm install recharts`
  - [x] Créer composant FinancesChart.jsx
  - [x] Utiliser BarChart ou LineChart de Recharts
  - [x] Données : agréger dépenses par mois (dernier 6 mois)
  - [x] Axe X : mois (format "Jan", "Fév", "Mar"...)
  - [x] Axe Y : montant total en €
  - [x] Couleur primary #4799eb pour les barres/ligne
  - [x] Responsive : width="100%" height={300}

- [x] **Task 4 : Intégrer le graphique dans la page Finances** (AC: #3, #4)
  - [x] Ajouter Card "Dépenses mensuelles" après le tableau d'équilibre
  - [x] Importer et afficher <FinancesChart data={monthlyData} />
  - [x] Calculer monthlyData depuis finances array
  - [x] Tester responsive : mobile (<768px) et desktop (≥768px)

- [x] **Task 5 : Styling et polish** (AC: #4, NFR7)
  - [x] Graphique responsive : adapte hauteur sur mobile
  - [x] Tableau équilibre responsive : scroll horizontal si nécessaire
  - [x] Couleurs conformes au design system (primary #4799eb, success #22c55e, danger #ef4444)
  - [x] Tester sur mobile et desktop

## Dev Notes

### Architecture Compliance

**Stack technique :**
- React 18+ avec Vite
- shadcn/ui components (Card, Table, Badge)
- Recharts pour le graphique (à installer)
- Tailwind CSS uniquement (pas de CSS custom)
- lucide-react pour les icônes

**Patterns obligatoires :**
- Un composant = un fichier
- shadcn/ui d'abord — utiliser Card, Table existants
- Pas de CSS custom — uniquement classes Tailwind
- Mock data centralisé — fetch depuis `/api/finances`
- Responsive dès le début — tester mobile (< 768px)

### Algorithme de calcul d'équilibre

**Principe :**
1. Calculer le total des dépenses : `totalDepenses = sum(finances.amount)`
2. Calculer la part équitable par personne : `partParPersonne = totalDepenses / nombreColocataires`
3. Pour chaque colocataire :
   - Calculer ce qu'il a payé : `montantPaye = sum(finances where paidBy === colocataire.id)`
   - Calculer son solde : `solde = montantPaye - partParPersonne`
   - Si solde > 0 : il a une créance (on lui doit)
   - Si solde < 0 : il a une dette (il doit)

**Exemple avec 3 colocataires :**
- Jopad paie 50€
- Yohan paie 0€
- Luis-Manuel paie 0€
- Total : 50€
- Part par personne : 50€ / 3 = 16.67€
- Soldes :
  - Jopad : 50€ - 16.67€ = +33.33€ (créance)
  - Yohan : 0€ - 16.67€ = -16.67€ (dette)
  - Luis-Manuel : 0€ - 16.67€ = -16.67€ (dette)

**Fonction calculateBalance() :**

```javascript
const calculateBalance = (finances, members, userId) => {
  const nombreColocataires = members.length;
  if (nombreColocataires === 0) return [];

  const totalDepenses = finances.reduce((sum, f) => sum + (f.amount || 0), 0);
  const partParPersonne = totalDepenses / nombreColocataires;

  const balances = members.map(member => {
    const montantPaye = finances
      .filter(f => f.paidBy === member.id)
      .reduce((sum, f) => sum + (f.amount || 0), 0);
    
    const solde = montantPaye - partParPersonne;
    
    return {
      memberId: member.id,
      memberName: member.name,
      montantPaye,
      partEquitable: partParPersonne,
      solde,
      status: solde > 0 ? "créance" : solde < 0 ? "dette" : "équilibré"
    };
  });

  return balances;
};
```

### Composant Recharts

**Installation :**
```bash
npm install recharts
```

**Exemple BarChart :**

```jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FinancesChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="amount" fill="#4799eb" />
      </BarChart>
    </ResponsiveContainer>
  );
};
```

**Format des données :**
```javascript
const monthlyData = [
  { month: "Jan", amount: 150 },
  { month: "Fév", amount: 200 },
  { month: "Mar", amount: 180 },
  // ...
];
```

**Calcul des données mensuelles :**

```javascript
const calculateMonthlyData = (finances) => {
  // Grouper par mois
  const monthlyMap = {};
  
  finances.forEach(finance => {
    const date = new Date(finance.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = date.toLocaleDateString("fr-FR", { month: "short" });
    
    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { month: monthLabel, amount: 0 };
    }
    monthlyMap[monthKey].amount += finance.amount;
  });
  
  // Convertir en array et trier par date
  return Object.keys(monthlyMap)
    .sort()
    .slice(-6) // Derniers 6 mois
    .map(key => monthlyMap[key]);
};
```

### Tableau d'équilibre

**Composant Table shadcn/ui :**

```jsx
<Card className="shadow-sm">
  <CardHeader>
    <CardTitle className="text-xl font-bold text-[#0e141b]">
      Équilibre entre colocataires
    </CardTitle>
  </CardHeader>
  <CardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Membre</TableHead>
          <TableHead className="text-right">Montant payé</TableHead>
          <TableHead className="text-right">Part équitable</TableHead>
          <TableHead className="text-right">Solde</TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {balances.map(balance => (
          <TableRow key={balance.memberId}>
            <TableCell>{balance.memberName}</TableCell>
            <TableCell className="text-right">{formatMontant(balance.montantPaye)}</TableCell>
            <TableCell className="text-right">{formatMontant(balance.partEquitable)}</TableCell>
            <TableCell className={`text-right font-semibold ${
              balance.solde > 0 ? "text-[#22c55e]" : balance.solde < 0 ? "text-[#ef4444]" : "text-[#4e7397]"
            }`}>
              {balance.solde > 0 ? "+" : ""}{formatMontant(Math.abs(balance.solde))}
            </TableCell>
            <TableCell>
              <Badge variant={balance.solde > 0 ? "success" : balance.solde < 0 ? "destructive" : "secondary"}>
                {balance.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </CardContent>
</Card>
```

### Contexte des stories précédentes

**Story 5.1 (Vue finances et cards métriques) :**
- Page Finances.jsx créée avec 3 cards métriques
- Fetch /api/finances au mount
- Calcul cagnotte, mesDettes, onMeDoit déjà implémenté
- formatMontant() déjà implémenté
- calculateMetrics() fonction réutilisable déjà créée

**Story 5.2 (CRUD dépenses et tableau) :**
- Tableau des dépenses avec pagination
- Dialog CRUD (ajouter/modifier/supprimer)
- AlertDialog pour confirmation suppression
- Recalcul automatique des métriques après CRUD
- Tous les composants shadcn/ui déjà importés

**Learnings des stories précédentes :**
- ✅ Utiliser calculateMetrics() pour recalculer après chaque changement
- ✅ Format français : virgule décimale, espace insécable ("250,00 €")
- ✅ Validation : montant > 0, tous les champs requis
- ✅ Responsive dès le début : tester mobile et desktop
- ✅ Gestion d'erreur : try/catch avec messages clairs
- ✅ Loading states : disabled buttons pendant les opérations

### Pièges à éviter

1. **Ne PAS oublier d'installer Recharts** — `npm install recharts`
2. **Ne PAS oublier le format français** — virgule pour décimales, mois en français
3. **Ne PAS oublier la responsive** — graphique doit s'adapter à la largeur
4. **Ne PAS hardcoder les données** — calculer depuis finances array
5. **Ne PAS oublier les couleurs du design system** — primary #4799eb, success #22c55e, danger #ef4444
6. **Responsive dès le début** — tester mobile et desktop
7. **Réutiliser calculateMetrics()** — ne pas dupliquer la logique

### Design Reference (Google Stitch)

**Écran 5 : Gestion des Finances**

**Section Équilibre entre colocataires :**

| Membre | Montant payé | Part équitable | Solde | Statut |
|--------|--------------|----------------|-------|--------|
| Jopad | 50,00 € | 16,67 € | +33,33 € | Créance |
| Yohan | 0,00 € | 16,67 € | -16,67 € | Dette |
| Luis-Manuel | 0,00 € | 16,67 € | -16,67 € | Dette |

**Graphique des dépenses mensuelles :**
- Type : BarChart (barres verticales)
- Couleur : #4799eb (primary)
- Axe X : mois (Jan, Fév, Mar, Avr, Mai, Jun)
- Axe Y : montant en €
- Hauteur : 300px
- Responsive : width 100%

**Couleurs (Design System) :**
- Primary: #4799eb (graphique, liens)
- Success: #22c55e (créance, solde positif)
- Danger: #ef4444 (dette, solde négatif)
- Text main: #0e141b
- Text sub: #4e7397
- Surface: #ffffff (cards)
- Shadow: shadow-sm

### Testing Requirements

**Tests manuels à effectuer :**
1. Calcul d'équilibre — vérifier que les soldes sont corrects
2. Tableau d'équilibre — vérifier l'affichage des membres et soldes
3. Graphique — vérifier que les données mensuelles s'affichent
4. Responsive — tester sur mobile et desktop
5. Format français — vérifier virgule décimale et mois en français
6. Couleurs — vérifier que les couleurs correspondent au design system
7. Intégration — vérifier que tout fonctionne avec les stories 5.1 et 5.2

**Commandes de test :**
```bash
npm run dev          # Démarrer le serveur de dev
npm run lint         # Vérifier le linting
npm run build        # Vérifier que le build passe
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 5, Story 5.3]
- [Source: _bmad-output/planning-artifacts/architecture.md — Frontend Architecture, API Patterns]
- [Source: _bmad-output/planning-artifacts/prd.md — FR29, FR31, NFR1-NFR9]
- [Source: _bmad-output/implementation-artifacts/stories/5-1-vue-finances-et-cards-métriques.md — Page Finances existante]
- [Source: _bmad-output/implementation-artifacts/stories/5-2-crud-dépenses-et-tableau.md — Tableau et CRUD]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

- Recharts installed successfully (v2.x)
- Fixed React hooks error: moved CustomTooltip outside render function
- No TypeScript/linting errors in final implementation
- All components render correctly

### Completion Notes List

- ✅ Installed Recharts library for chart visualization
- ✅ Created FinancesChart.jsx component with BarChart
- ✅ Implemented calculateBalance() function for financial equilibrium calculation
- ✅ Implemented calculateMonthlyData() function to aggregate expenses by month
- ✅ Added "Équilibre entre colocataires" section with Table showing balances
- ✅ Added "Dépenses mensuelles" section with chart
- ✅ Used shadcn/ui components (Card, Table, Badge)
- ✅ French formatting: months in French (Jan, Fév, Mar...), decimal comma
- ✅ Color coding: green for créance (#22c55e), red for dette (#ef4444), primary for chart (#4799eb)
- ✅ Responsive design: table with horizontal scroll, chart adapts to width
- ✅ All acceptance criteria satisfied
- ✅ Fixed React hooks error by declaring CustomTooltip outside component

### File List

- `client/src/pages/Finances.jsx` (modifié — ajouté section équilibre + graphique)
- `client/src/components/FinancesChart.jsx` (créé — composant graphique Recharts)
