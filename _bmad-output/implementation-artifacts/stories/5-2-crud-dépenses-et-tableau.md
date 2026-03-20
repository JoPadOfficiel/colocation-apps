---
title: "Story 5.2 : CRUD dépenses et tableau"
epic: "Epic 5 : Gestion des Finances"
status: "review"
assignee: "Jopad"
---

# Story 5.2 : CRUD dépenses et tableau

Status: review

## Story

As a colocataire,
I want ajouter, modifier et supprimer des dépenses et les voir dans un tableau,
So that toutes les dépenses sont suivies et traçables.

## Acceptance Criteria

1. **Given** je clique "AJOUTER DÉPENSE", **When** je remplis titre, montant, date et payeur, **Then** la dépense est ajoutée et le tableau se met à jour.
2. **And** le tableau de dépenses s'affiche avec les colonnes : Date, Payé par, Description, Montant.
3. **And** la pagination affiche "1 à 5 sur X résultats" avec boutons Précédent/Suivant.
4. **And** une dépense existante peut être modifiée ou supprimée (avec confirmation).
5. **And** les données et l'équilibre sont recalculés après modification/suppression.

## Tasks / Subtasks

- [x] **Task 1 : Créer le Dialog "Ajouter Dépense"** (AC: #1)
  - [x] Importer Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter depuis shadcn/ui
  - [x] Créer state `isDialogOpen` pour contrôler l'ouverture du dialog
  - [x] Formulaire avec 4 champs : Titre (text), Montant (number), Date (date), Payé par (select)
  - [x] Validation : tous les champs requis, montant > 0
  - [x] Bouton "Annuler" (ferme dialog) + "Ajouter" (soumet et ferme)
  - [x] Au submit : POST /api/finances, refresh liste, recalcul métriques

- [x] **Task 2 : Implémenter le tableau des dépenses** (AC: #2, #3)
  - [x] Importer Table, TableHeader, TableBody, TableRow, TableHead, TableCell depuis shadcn/ui
  - [x] Colonnes : Date (format "24 Oct 2023"), Payé par (prénom), Description, Montant (format "XX,XX €")
  - [x] Ajouter colonne Actions avec menu contextuel (icône more_vert)
  - [x] Pagination : state `currentPage`, `itemsPerPage = 5`
  - [x] Afficher "1 à 5 sur X résultats" + boutons Précédent/Suivant
  - [x] Boutons désactivés si première/dernière page

- [x] **Task 3 : Implémenter modification de dépense** (AC: #4, #5)
  - [x] Réutiliser le même Dialog en mode "edit"
  - [x] State `editingExpense` pour stocker la dépense en cours d'édition
  - [x] Pré-remplir le formulaire avec les données existantes
  - [x] Au submit : PUT /api/finances/:id, refresh liste, recalcul métriques
  - [x] Bouton "Modifier" dans le menu contextuel de chaque ligne

- [x] **Task 4 : Implémenter suppression de dépense** (AC: #4, #5)
  - [x] Importer AlertDialog depuis shadcn/ui pour confirmation
  - [x] Pop-up "Êtes-vous sûr de vouloir supprimer cette dépense ?"
  - [x] Boutons "Annuler" + "Supprimer" (danger)
  - [x] Au confirm : DELETE /api/finances/:id, refresh liste, recalcul métriques
  - [x] Bouton "Supprimer" dans le menu contextuel de chaque ligne

- [x] **Task 5 : Recalcul automatique des métriques** (AC: #5)
  - [x] Après chaque ajout/modification/suppression, refetch /api/finances
  - [x] Recalculer cagnotte, mesDettes, onMeDoit avec la nouvelle liste
  - [x] Mettre à jour les 3 cards métriques en temps réel

- [x] **Task 6 : Styling et responsive** (AC: #2, #3, NFR7)
  - [x] Tableau responsive : scroll horizontal sur mobile si nécessaire
  - [x] Dialog responsive : full-width sur mobile, max-width sur desktop
  - [x] Pagination responsive : boutons empilés sur mobile
  - [x] Tester sur mobile (< 768px) et desktop (≥ 768px)

## Dev Notes

### Architecture Compliance

**Stack technique :**
- React 18+ avec Vite
- shadcn/ui components (Dialog, Table, AlertDialog, Button, Input, Select)
- Tailwind CSS uniquement (pas de CSS custom)
- lucide-react pour les icônes
- fetch() natif pour les appels API

**Patterns obligatoires :**
- Un composant = un fichier
- shadcn/ui d'abord — utiliser Dialog, Table, AlertDialog existants
- Pas de CSS custom — uniquement classes Tailwind
- Mock data centralisé — fetch depuis `/api/finances`
- Responsive dès le début — tester mobile (< 768px)

### Composants shadcn/ui à utiliser

**Dialog (Ajouter/Modifier Dépense) :**
```jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{editingExpense ? "Modifier" : "Ajouter"} une dépense</DialogTitle>
    </DialogHeader>
    <form onSubmit={handleSubmit}>
      <Input name="title" placeholder="Titre" required />
      <Input name="amount" type="number" step="0.01" min="0.01" placeholder="Montant" required />
      <Input name="date" type="date" required />
      <Select name="paidBy" required>
        <SelectTrigger>
          <SelectValue placeholder="Payé par" />
        </SelectTrigger>
        <SelectContent>
          {colocation.members.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
        </SelectContent>
      </Select>
    </form>
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
      <Button type="submit">{editingExpense ? "Modifier" : "Ajouter"}</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Table :**
```jsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Date</TableHead>
      <TableHead>Payé par</TableHead>
      <TableHead>Description</TableHead>
      <TableHead className="text-right">Montant</TableHead>
      <TableHead className="w-[50px]"></TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {paginatedExpenses.map(expense => (
      <TableRow key={expense.id}>
        <TableCell>{formatDate(expense.date)}</TableCell>
        <TableCell>{getUserName(expense.paidBy)}</TableCell>
        <TableCell>{expense.title}</TableCell>
        <TableCell className="text-right">{formatMontant(expense.amount)}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(expense)}>Modifier</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(expense)} className="text-red-600">Supprimer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

**AlertDialog (Confirmation suppression) :**
```jsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Supprimer cette dépense ?</AlertDialogTitle>
      <AlertDialogDescription>
        Cette action est irréversible. La dépense sera définitivement supprimée.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Annuler</AlertDialogCancel>
      <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
        Supprimer
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Icônes lucide-react

```jsx
import { Plus, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
```

### Logique de pagination

```javascript
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5;

const totalPages = Math.ceil(finances.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const paginatedExpenses = finances.slice(startIndex, endIndex);

const handlePrevious = () => {
  if (currentPage > 1) setCurrentPage(currentPage - 1);
};

const handleNext = () => {
  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
};
```

### Format des données

**Dépense (Finance) :**
```javascript
{
  id: "finance-1",
  title: "Courses Carrefour",
  amount: 50.00,
  type: "expense",
  date: "2026-03-15",
  paidBy: "user-1", // ID utilisateur
  colocationId: "coloc-1"
}
```

**Affichage :**
- Date : "15 Mars 2026" (format français)
- Montant : "50,00 €" (virgule comme séparateur décimal)
- Payé par : "Thomas" (prénom depuis colocation.members)

### Helpers utilitaires

```javascript
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
};

const formatMontant = (montant) => {
  if (!isFinite(montant)) return "0,00 €";
  return `${montant.toFixed(2).replace(".", ",")} €`;
};

const getUserName = (userId) => {
  const member = colocation.members?.find(m => m.id === userId);
  return member?.name || "Inconnu";
};
```

### Contexte des stories précédentes

**Story 5.1 (Vue finances et cards métriques) :**
- Page Finances.jsx créée avec 3 cards métriques
- Fetch /api/finances au mount
- Calcul cagnotte, mesDettes, onMeDoit
- formatMontant() déjà implémenté
- Gestion erreurs et loading déjà en place

**Story 1.3 (AuthContext et Mock Data) :**
- AuthContext fournit `user` et `colocation` via `useAuth()`
- mockData.js contient ~10 dépenses réalistes
- Format réponse API : `{ data: [...] }` ou `{ error: "..." }`

### Pièges à éviter

1. **Ne PAS oublier la validation** — montant > 0, tous les champs requis
2. **Ne PAS oublier la confirmation** — AlertDialog avant suppression
3. **Ne PAS oublier le recalcul** — refetch après chaque CRUD
4. **Ne PAS hardcoder les utilisateurs** — utiliser colocation.members
5. **Ne PAS oublier le format français** — virgule pour décimales, format date
6. **Responsive dès le début** — tester mobile et desktop
7. **Pagination correcte** — désactiver boutons si première/dernière page

### Design Reference (Google Stitch)

**Écran 5 : Gestion des Finances**

**Tableau des dépenses récentes :**

| Date | Payé par | Description | Montant |
|------|----------|-------------|---------|
| 24 Oct 2023 | Thomas | Courses Carrefour | 50,00 € |
| 22 Oct 2023 | Léa | Internet Orange | 30,00 € |
| 20 Oct 2023 | Marc | Électricité EDF | 45,00 € |
| 18 Oct 2023 | Thomas | Spotify Family | 15,99 € |
| 15 Oct 2023 | Léa | Netflix Premium | 17,99 € |

**Pagination :** "1 à 5 sur 24 résultats" + boutons Précédent/Suivant

**Menu contextuel (icône more_vert) :**
- Modifier
- Supprimer (rouge)

**Couleurs (Design System) :**
- Primary: #4799eb
- Danger: #ef4444 (bouton supprimer)
- Text main: #0e141b
- Text sub: #4e7397
- Surface: #ffffff (cards, dialog)
- Shadow: shadow-sm

### Testing Requirements

**Tests manuels à effectuer :**
1. Ajouter une dépense — vérifier qu'elle apparaît dans le tableau
2. Modifier une dépense — vérifier que les changements sont appliqués
3. Supprimer une dépense — vérifier la confirmation et la suppression
4. Pagination — vérifier que les boutons fonctionnent correctement
5. Validation — essayer de soumettre un formulaire vide ou montant négatif
6. Recalcul — vérifier que les métriques se mettent à jour après CRUD
7. Responsive — tester sur mobile et desktop
8. Format français — vérifier virgule décimale et format date

**Commandes de test :**
```bash
npm run dev          # Démarrer le serveur de dev
npm run lint         # Vérifier le linting
npm run build        # Vérifier que le build passe
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md — Epic 5, Story 5.2]
- [Source: _bmad-output/planning-artifacts/architecture.md — Frontend Architecture, API Patterns]
- [Source: _bmad-output/planning-artifacts/ui-design.md — Écran 5 : Gestion des Finances]
- [Source: _bmad-output/planning-artifacts/prd.md — FR26-FR30, NFR1-NFR9]
- [Source: _bmad-output/implementation-artifacts/stories/5-1-vue-finances-et-cards-métriques.md — Page Finances existante]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

- Linter: 0 errors
- Build: No errors
- All components render correctly
- CRUD operations functional (add, edit, delete)
- Pagination working as expected
- Metrics recalculation after each operation

### Completion Notes List

- ✅ Extended Finances.jsx with table and CRUD functionality
- ✅ Implemented Dialog for add/edit expense with 4 fields (title, amount, date, paidBy)
- ✅ Implemented Table with 5 columns (Date, Payé par, Description, Montant, Actions)
- ✅ Added pagination (5 items per page) with Previous/Next buttons
- ✅ Implemented DropdownMenu for edit/delete actions on each row
- ✅ Implemented AlertDialog for delete confirmation
- ✅ Added automatic metrics recalculation after each CRUD operation
- ✅ Used shadcn/ui components (Dialog, Table, AlertDialog, DropdownMenu, Select, Input, Label)
- ✅ French date formatting (formatDate helper)
- ✅ French decimal formatting (formatMontant already existed from Story 5.1)
- ✅ Responsive design: table with horizontal scroll on mobile, dialog adapts to screen size
- ✅ Form validation: all fields required, amount > 0
- ✅ All acceptance criteria satisfied

### File List

- `client/src/pages/Finances.jsx` (modifié — ajouté tableau, dialog CRUD, pagination)

