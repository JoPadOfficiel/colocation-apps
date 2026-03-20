import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, TrendingDown, ArrowUp, ArrowDown, Plus } from "lucide-react";

export default function Finances() {
  const { user, colocation } = useAuth();
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Métriques calculées
  const [cagnotte, setCagnotte] = useState(0);
  const [mesDettes, setMesDettes] = useState(0);
  const [onMeDoit, setOnMeDoit] = useState(0);
  const [tendance, setTendance] = useState(0);

  useEffect(() => {
    // Validation précoce des dépendances
    if (!colocation || !user) {
      setLoading(false);
      return;
    }

    const fetchFinances = async () => {
      try {
        const res = await fetch("/api/finances");
        
        // Vérification du statut HTTP
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        const json = await res.json();
        
        // Validation de la structure de la réponse
        if (!json.data || !Array.isArray(json.data)) {
          throw new Error("Format de réponse invalide");
        }
        
        setFinances(json.data);
        
        // Calcul des métriques avec validation
        const nombreColocataires = colocation.members?.length || 0;
        
        // Protection contre division par zéro
        if (nombreColocataires === 0) {
          setCagnotte(colocation.totalFund || 0);
          setMesDettes(0);
          setOnMeDoit(0);
          setTendance(0);
          return;
        }
        
        const totalDepenses = json.data.reduce((sum, f) => sum + (f.amount || 0), 0);
        const partParPersonne = totalDepenses / nombreColocataires;
        const mesDepenses = json.data
          .filter(f => f.paidBy === user.id)
          .reduce((sum, f) => sum + (f.amount || 0), 0);
        
        // Calcul de l'équilibre financier
        const balance = mesDepenses - partParPersonne;
        
        setCagnotte(colocation.totalFund || 0);
        // Logique conditionnelle : soit dette, soit créance, pas les deux
        setMesDettes(balance < 0 ? Math.abs(balance) : 0);
        setOnMeDoit(balance > 0 ? balance : 0);
        
        // Calcul de la tendance (pour l'instant simplifié)
        // TODO Story 5.3: Calculer depuis l'historique réel
        const tendanceCalculee = (colocation.totalFund || 0) * 0.18; // 18% de la cagnotte comme approximation
        setTendance(tendanceCalculee);
        
      } catch (error) {
        console.error("Erreur lors du chargement des finances:", error);
        setError(error.message || "Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchFinances();
  }, [colocation, user]);

  const formatMontant = (montant) => {
    // Gestion des valeurs non finies (NaN, Infinity)
    if (!isFinite(montant)) {
      return "0,00 €";
    }
    // Format français avec virgule comme séparateur décimal
    return `${montant.toFixed(2).replace(".", ",")} €`;
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
        <Button>
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
              {tendance >= 0 ? "+" : ""}{formatMontant(Math.abs(tendance))} ce mois
            </Badge>
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
    </div>
  );
}
