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

  // Métriques calculées
  const [cagnotte, setCagnotte] = useState(0);
  const [mesDettes, setMesDettes] = useState(0);
  const [onMeDoit, setOnMeDoit] = useState(0);
  const [tendance, setTendance] = useState(0);

  useEffect(() => {
    const fetchFinances = async () => {
      try {
        const res = await fetch("/api/finances");
        const json = await res.json();
        setFinances(json.data || []);
        
        // Calcul des métriques
        if (colocation && user && json.data) {
          const totalDepenses = json.data.reduce((sum, f) => sum + f.amount, 0);
          const nombreColocataires = colocation.members.length;
          const partParPersonne = totalDepenses / nombreColocataires;
          const mesDepenses = json.data
            .filter(f => f.paidBy === user.id)
            .reduce((sum, f) => sum + f.amount, 0);
          
          setCagnotte(colocation.totalFund || 0);
          setMesDettes(partParPersonne - mesDepenses);
          setOnMeDoit(mesDepenses - partParPersonne);
          setTendance(45.00); // Mock tendance mensuelle
        }
      } catch (error) {
        console.error("Erreur lors du chargement des finances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinances();
  }, [colocation, user]);

  const formatMontant = (montant) => {
    return `${montant.toFixed(2)} €`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#4e7397]">Chargement...</p>
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
              className="mt-2 border-[#22c55e] text-[#22c55e]"
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              +{formatMontant(tendance)} ce mois
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
            <div className="text-3xl font-bold text-[#ef4444]">
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
            <div className="text-3xl font-bold text-[#22c55e]">
              {formatMontant(onMeDoit)}
            </div>
            <p className="text-sm text-[#4e7397] mt-2">À recevoir</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
