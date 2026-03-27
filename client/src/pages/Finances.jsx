import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Wallet, TrendingUp, TrendingDown, ArrowUp, ArrowDown, Plus, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchFinances, createFinance, updateFinance, deleteFinance, fetchColocation, updateColocation as apiUpdateColocation } from "@/lib/api";
import FinancesChart from "@/components/FinancesChart";

export default function Finances() {
  const { user, colocation, updateColocation: updateColocationCtx } = useAuth();
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Métriques calculées
  const [cagnotte, setCagnotte] = useState(0);
  const [mesDettes, setMesDettes] = useState(0);
  const [onMeDoit, setOnMeDoit] = useState(0);
  const [tendance, setTendance] = useState(0);

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  // Contribution dialog state
  const [isContribDialogOpen, setIsContribDialogOpen] = useState(false);
  const [contribAmount, setContribAmount] = useState("");
  const [contribError, setContribError] = useState("");
  const [isContribSubmitting, setIsContribSubmitting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    date: "",
    paidBy: "",
    shared: true
  });
  const [formErrors, setFormErrors] = useState({});

  // Fonction de calcul des métriques réutilisable (évite duplication)
  const calculateMetrics = useCallback((financesData) => {
    const nombreColocataires = colocation?.members?.length || 0;

    // Protection contre division par zéro
    if (nombreColocataires === 0) {
      setCagnotte(colocation?.totalFund || 0);
      setMesDettes(0);
      setOnMeDoit(0);
      setTendance(0);
      return;
    }

    // Only shared expenses (not contributions) count for balance
    const sharedExpenses = financesData.filter(f => f.shared === true && f.type !== 'contribution');
    const totalDepenses = sharedExpenses.reduce((sum, f) => sum + (f.amount || 0), 0);
    const partParPersonne = totalDepenses / nombreColocataires;
    const mesDepenses = sharedExpenses
      .filter(f => f.paidBy === user?.id)
      .reduce((sum, f) => sum + (f.amount || 0), 0);
    
    // Calcul de l'équilibre financier
    const balance = mesDepenses - partParPersonne;
    
    // Mise à jour de la cagnotte depuis colocation
    const cagnotteActuelle = colocation?.totalFund || 0;
    setCagnotte(cagnotteActuelle);
    
    // Logique conditionnelle : soit dette, soit créance, pas les deux
    setMesDettes(balance < 0 ? Math.abs(balance) : 0);
    setOnMeDoit(balance > 0 ? balance : 0);
    
    // Calcul de la tendance réelle : dépenses ce mois - dépenses mois dernier
    const now = new Date();
    const thisMonth = now.getMonth();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const thisYear = now.getFullYear();
    const lastYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const thisMonthTotal = financesData
      .filter(f => {
        const d = new Date(f.date);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear && f.type !== 'contribution';
      })
      .reduce((sum, f) => sum + (f.amount || 0), 0);

    const lastMonthTotal = financesData
      .filter(f => {
        const d = new Date(f.date);
        return d.getMonth() === lastMonth && d.getFullYear() === lastYear && f.type !== 'contribution';
      })
      .reduce((sum, f) => sum + (f.amount || 0), 0);

    const tendanceCalculee = thisMonthTotal - lastMonthTotal;
    setTendance(tendanceCalculee);
  }, [colocation, user]);

  useEffect(() => {
    // Validation précoce des dépendances
    if (!colocation || !user) {
      setLoading(false);
      return;
    }

    const loadFinances = async () => {
      try {
        const data = await fetchFinances(colocation?.id);
        setFinances(data);
        calculateMetrics(data);

      } catch (error) {
        console.error("Erreur lors du chargement des finances:", error);
        setError(error.message || "Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    loadFinances();
  }, [colocation, user, calculateMetrics]);

  const formatMontant = (montant) => {
    // Gestion des valeurs non finies (NaN, Infinity)
    if (!isFinite(montant)) {
      return "0,00 €";
    }
    // Arrondir à 2 décimales et format français avec virgule comme séparateur décimal
    const rounded = Math.round(montant * 100) / 100;
    return `${rounded.toFixed(2).replace(".", ",")} €`;
  };

  const formatDate = (dateString) => {
    // Validation de la date
    if (!dateString) return "Date invalide";
    const date = new Date(dateString);
    // Vérification que la date est valide
    if (isNaN(date.getTime())) return "Date invalide";
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  const getUserName = (userId) => {
    const member = colocation?.members?.find(m => m.id === userId);
    return member?.name || "Inconnu";
  };

  // Calcul de l'équilibre financier entre colocataires
  const calculateBalance = (financesData, members) => {
    if (!members || members.length === 0) return [];

    // Only shared expenses (not contributions) count for balance
    const sharedExpenses = financesData.filter(f => f.shared === true && f.type !== 'contribution');

    // Validation et conversion des montants
    const totalDepenses = sharedExpenses.reduce((sum, f) => {
      const amount = Number(f.amount) || 0;
      return sum + amount;
    }, 0);
    const partParPersonne = Math.round((totalDepenses / members.length) * 100) / 100;

    const balances = members.map(member => {
      const montantPaye = sharedExpenses
        .filter(f => f.paidBy === member.id)
        .reduce((sum, f) => {
          const amount = Number(f.amount) || 0;
          return sum + amount;
        }, 0);
      
      // Arrondir à 2 décimales pour éviter les erreurs de précision
      const montantPayeRounded = Math.round(montantPaye * 100) / 100;
      const solde = Math.round((montantPayeRounded - partParPersonne) * 100) / 100;
      
      return {
        memberId: member.id,
        memberName: member.name,
        montantPaye: montantPayeRounded,
        partEquitable: partParPersonne,
        solde,
        status: solde > 0.01 ? "créance" : solde < -0.01 ? "dette" : "équilibré"
      };
    });

    return balances;
  };

  // Calcul des données mensuelles pour le graphique
  const calculateMonthlyData = (financesData) => {
    if (!financesData || financesData.length === 0) return [];

    // Grouper par mois
    const monthlyMap = {};
    
    financesData.forEach(finance => {
      // Validation de la date
      const date = new Date(finance.date);
      if (isNaN(date.getTime())) {
        console.warn(`Date invalide ignorée: ${finance.date}`);
        return; // Skip cette entrée
      }
      
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" })
        .replace('. ', ' ')
        .replace(/\b\w/, c => c.toUpperCase());
      
      // Validation du montant
      const amount = Number(finance.amount) || 0;
      
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { month: monthLabel, amount: 0 };
      }
      monthlyMap[monthKey].amount += amount;
    });
    
    // Convertir en array et trier par date, prendre les 6 derniers mois
    return Object.keys(monthlyMap)
      .sort()
      .slice(-6)
      .map(key => monthlyMap[key]);
  };

  // Calculer les données pour l'affichage (contributions exclues du calcul d'équilibre)
  const expensesForBalance = finances.filter(f => f.type !== 'contribution');
  const balances = calculateBalance(expensesForBalance, colocation?.members || []);
  const monthlyData = calculateMonthlyData(finances);

  // Pagination logic avec protection contre division par zéro
  const sortedFinances = [...finances].sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalPages = sortedFinances.length > 0 ? Math.ceil(sortedFinances.length / itemsPerPage) : 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedExpenses = sortedFinances.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // État de chargement pour les opérations CRUD
  const [isSubmitting, setIsSubmitting] = useState(false);

  // CRUD handlers
  const handleOpenDialog = (expense = null) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        title: expense.title,
        amount: expense.amount.toString(),
        date: expense.date,
        paidBy: expense.paidBy,
        shared: expense.shared !== undefined ? expense.shared : true
      });
    } else {
      setEditingExpense(null);
      setFormData({
        title: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        paidBy: user?.id || "",
        shared: true
      });
    }
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingExpense(null);
    setFormData({ title: "", amount: "", date: "", paidBy: "", shared: true });
    setFormErrors({});
  };

  const handleOpenContribDialog = () => {
    setContribAmount("");
    setContribError("");
    setIsContribDialogOpen(true);
  };

  const handleContribSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(contribAmount);
    if (!contribAmount || isNaN(amount) || amount <= 0) {
      setContribError("Le montant doit être supérieur à 0");
      return;
    }
    setIsContribSubmitting(true);
    try {
      const updatedColoc = await apiUpdateColocation(colocation.id, {
        totalFund: amount,
        paidBy: user?.id,
      });
      // Update colocation in context so cagnotte card refreshes
      updateColocationCtx(updatedColoc);
      // Update cagnotte directly from server response (avoid stale closure)
      setCagnotte(updatedColoc.totalFund || 0);
      // Refetch finances to show new contribution entry in history
      const data = await fetchFinances(colocation?.id);
      setFinances(data);
      setIsContribDialogOpen(false);
    } catch (err) {
      setContribError(err.message || "Erreur lors de la contribution");
    } finally {
      setIsContribSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Le titre est requis";
    if (!formData.date) newErrors.date = "La date est requise";
    if (!formData.paidBy) newErrors.paidBy = "Le payeur est requis";
    else if (!colocation?.members?.some(m => m.id === formData.paidBy)) {
      newErrors.paidBy = "Le membre sélectionné n'existe pas";
    }

    const amount = parseFloat(formData.amount);
    if (!formData.amount) {
      newErrors.amount = "Le montant est requis";
    } else if (isNaN(amount) || amount <= 0) {
      newErrors.amount = "Le montant doit être supérieur à 0";
    }

    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const expenseData = {
        title: formData.title,
        amount: amount,
        date: formData.date,
        paidBy: formData.paidBy,
        type: "expense",
        colocationId: colocation.id,
        shared: formData.shared
      };

      if (editingExpense) {
        await updateFinance(editingExpense.id, expenseData);
      } else {
        await createFinance(expenseData);
      }

      // Refetch finances
      const data = await fetchFinances(colocation?.id);
      setFinances(data);
      setCurrentPage(1);
      calculateMetrics(data);
      handleCloseDialog();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde de la dépense");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (expense) => {
    setExpenseToDelete(expense);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!expenseToDelete || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await deleteFinance(expenseToDelete.id);

      // Refetch finances
      const data = await fetchFinances(colocation?.id);
      setFinances(data);

      // Ajuster la pagination si la page actuelle devient vide
      const newTotalPages = Math.ceil(data.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      } else if (data.length === 0) {
        setCurrentPage(1);
      }

      // Utiliser la fonction centralisée pour recalculer les métriques
      calculateMetrics(data);

      setDeleteDialogOpen(false);
      setExpenseToDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression de la dépense");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#4e7397]">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <p className="text-[#ef4444] font-medium">Erreur</p>
          <p className="text-[#4e7397]">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#0e141b]">Finances</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          AJOUTER DÉPENSE
        </Button>
      </div>

      {/* 3 Cards métriques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Cagnotte Commune */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#4e7397]">
              Cagnotte Commune
            </CardTitle>
            <Wallet className="h-5 w-5 text-[#4799eb]" aria-label="Cagnotte" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0e141b]">
              {formatMontant(cagnotte)}
            </div>
            <Badge
              variant="outline"
              className={`mt-2 ${
                tendance >= 0
                  ? "border-[#22c55e] text-[#22c55e]"
                  : "border-[#ef4444] text-[#ef4444]"
              }`}
            >
              {tendance >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {tendance >= 0 ? "+" : ""}{formatMontant(Math.abs(tendance)).replace(" €", "€")} ce mois
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={handleOpenContribDialog}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter à la cagnotte
            </Button>
          </CardContent>
        </Card>

        {/* Card 2: Mes dettes */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#4e7397]">
              Mes dettes
            </CardTitle>
            <ArrowDown className="h-5 w-5 text-[#ef4444]" aria-label="Dettes" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${
              mesDettes > 0 ? "text-[#ef4444]" : "text-[#22c55e]"
            }`}>
              {formatMontant(mesDettes)}
            </div>
            <p className="text-sm text-[#4e7397] mt-2">À rembourser</p>
          </CardContent>
        </Card>

        {/* Card 3: On me doit */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#4e7397]">
              On me doit
            </CardTitle>
            <ArrowUp className="h-5 w-5 text-[#22c55e]" aria-label="Créances" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${
              onMeDoit > 0 ? "text-[#22c55e]" : "text-[#4e7397]"
            }`}>
              {formatMontant(onMeDoit)}
            </div>
            <p className="text-sm text-[#4e7397] mt-2">À recevoir</p>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des dépenses */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#0e141b]">Dépenses récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Payé par</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-[#4e7397]">
                      Aucune dépense enregistrée
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedExpenses.map(expense => (
                    <TableRow key={expense.id}>
                      <TableCell>{formatDate(expense.date)}</TableCell>
                      <TableCell>{getUserName(expense.paidBy)}</TableCell>
                      <TableCell>{expense.title}</TableCell>
                      <TableCell>
                        {expense.shared === false ? (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-100">
                            Personnelle
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                            Partagée
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{formatMontant(expense.amount)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenDialog(expense)}>
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(expense)} 
                              className="text-red-600"
                            >
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {finances.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-[#4e7397]">
                {startIndex + 1} à {Math.min(endIndex, sortedFinances.length)} sur {sortedFinances.length} résultats
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tableau d'équilibre entre colocataires */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#0e141b]">
            Équilibre entre colocataires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
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
                {balances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-[#4e7397]">
                      Aucun membre dans la colocation
                    </TableCell>
                  </TableRow>
                ) : (
                  balances.map(balance => (
                    <TableRow key={balance.memberId}>
                      <TableCell className="font-medium">{balance.memberName}</TableCell>
                      <TableCell className="text-right">{formatMontant(balance.montantPaye)}</TableCell>
                      <TableCell className="text-right">{formatMontant(balance.partEquitable)}</TableCell>
                      <TableCell className={`text-right font-semibold ${
                        balance.solde > 0.01 ? "text-[#22c55e]" : balance.solde < -0.01 ? "text-[#ef4444]" : "text-[#4e7397]"
                      }`}>
                        {balance.solde > 0.01 ? "+" : ""}{formatMontant(Math.abs(balance.solde))}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={balance.solde > 0.01 ? "default" : balance.solde < -0.01 ? "destructive" : "secondary"}
                          className={balance.solde > 0.01 ? "bg-[#22c55e] hover:bg-[#22c55e]/90" : ""}
                        >
                          {balance.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Graphique des dépenses mensuelles */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#0e141b]">
            Dépenses mensuelles
          </CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-[#4e7397]">Aucune donnée à afficher</p>
            </div>
          ) : (
            <FinancesChart data={monthlyData} />
          )}
        </CardContent>
      </Card>

      {/* Dialog Ajouter/Modifier Dépense */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingExpense ? "Modifier" : "Ajouter"} une dépense
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Courses Carrefour"
                required
              />
              {formErrors.title && <p className="text-sm text-red-500 mt-1">{formErrors.title}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Montant (€)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
              {formErrors.amount && <p className="text-sm text-red-500 mt-1">{formErrors.amount}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
              {formErrors.date && <p className="text-sm text-red-500 mt-1">{formErrors.date}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="paidBy">Payé par</Label>
              <select
                id="paidBy"
                value={formData.paidBy}
                onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Sélectionner le payeur</option>
                {colocation?.members?.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
              {formErrors.paidBy && <p className="text-sm text-red-500 mt-1">{formErrors.paidBy}</p>}
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="shared">Type de dépense</Label>
              <div className="flex items-center gap-3">
                <span className={`text-sm ${formData.shared === false ? "font-semibold text-[#0e141b]" : "text-[#4e7397]"}`}>
                  Personnelle
                </span>
                <button
                  type="button"
                  id="shared"
                  role="switch"
                  aria-checked={formData.shared !== false}
                  onClick={() => setFormData({ ...formData, shared: !formData.shared })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4799eb] focus:ring-offset-2 ${
                    formData.shared !== false ? "bg-[#4799eb]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.shared !== false ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className={`text-sm ${formData.shared !== false ? "font-semibold text-[#0e141b]" : "text-[#4e7397]"}`}>
                  Partagée
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "En cours..." : (editingExpense ? "Modifier" : "Ajouter")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ConfirmDialog Confirmation Suppression */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Supprimer cette dépense ?"
        description={`Cette action est irréversible. La dépense "${expenseToDelete?.title || ''}" sera définitivement supprimée.`}
        onConfirm={confirmDelete}
        confirmText="Supprimer"
        loadingText="Suppression..."
        variant="destructive"
        isLoading={isSubmitting}
      />

      {/* Dialog Ajouter à la cagnotte */}
      <Dialog open={isContribDialogOpen} onOpenChange={setIsContribDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter à la cagnotte</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleContribSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contrib-amount">Montant (€)</Label>
              <Input
                id="contrib-amount"
                type="number"
                step="0.01"
                min="0.01"
                value={contribAmount}
                onChange={(e) => {
                  setContribAmount(e.target.value);
                  setContribError("");
                }}
                placeholder="0.00"
                required
              />
              {contribError && <p className="text-sm text-red-500 mt-1">{contribError}</p>}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsContribDialogOpen(false)}
                disabled={isContribSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isContribSubmitting}>
                {isContribSubmitting ? "En cours..." : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
