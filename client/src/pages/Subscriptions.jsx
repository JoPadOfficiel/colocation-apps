import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { fetchSubscriptions } from "../lib/api";

// Fallback data if API fails
const FALLBACK_SUBSCRIPTIONS = [
  { id: "1", nameService: "Netflix", type: "PREMIUM", costMonthly: 17.99, dateBilling: "12 Oct", icon: "movie" },
  { id: "2", nameService: "Internet (Orange)", type: "FIBRE", costMonthly: 39.99, dateBilling: "01 Oct", icon: "router" },
  { id: "3", nameService: "Spotify Family", type: "FAMILLE", costMonthly: 15.99, dateBilling: "22 Oct", icon: "audiotrack" },
  { id: "4", nameService: "Disney+", type: "ANNUEL", costMonthly: 8.99, dateBilling: "05 Nov", icon: "stars" },
  { id: "5", nameService: "Électricité (EDF)", type: "FIXE", costMonthly: 62.54, dateBilling: "15 Oct", icon: "bolt" },
];

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchSubscriptions();
        if (data && data.length > 0) {
          setSubscriptions(data);
        } else {
          setSubscriptions(FALLBACK_SUBSCRIPTIONS);
        }
      } catch (err) {
        setSubscriptions(FALLBACK_SUBSCRIPTIONS);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalCost = subscriptions.reduce((acc, sub) => acc + Number(sub.costMonthly || sub.coutMensuel || 0), 0);
  const formattedTotal = totalCost.toFixed(2).replace(".", ",");

  return (
    <div className="w-full h-full p-4 md:p-8 space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Abonnements</h1>
          <p className="text-gray-500 mt-1">Gérez les services partagés de la colocation</p>
        </div>
        <Button className="bg-[#4799eb] hover:bg-[#3b82f6] text-white self-start md:self-auto shadow-sm">
          AJOUTER ABONNEMENT
        </Button>
      </div>

      <div className="bg-[#eef6fd] border border-[#4799eb]/20 text-[#0e141b] rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-white p-3 rounded-full text-[#4799eb] shadow-sm">
            <span className="material-symbols-outlined block text-2xl">account_balance_wallet</span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#4e7397]">Coût Mensuel Total</p>
            <p className="text-3xl font-bold tracking-tight">{formattedTotal} €</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((skeleton) => (
            <Card key={skeleton} className="animate-pulse">
              <CardHeader className="h-24 bg-gray-100 rounded-t-xl" />
              <CardContent className="h-20" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((sub) => {
            const iconName = sub.icon || sub.icone || "movie";
            const typeBadge = sub.type || "SERVICE";
            const price = Number(sub.costMonthly || sub.coutMensuel || 0).toFixed(2).replace(".", ",");
            const date = sub.dateBilling || sub.datePrelevement || "N/A";

            return (
              <Card key={sub.id} className="shadow-card border-gray-100/60 overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-[#f6f7f8] text-[#4e7397] p-3 rounded-xl border border-gray-100">
                        <span className="material-symbols-outlined block text-3xl">{iconName}</span>
                      </div>
                      <Badge variant="secondary" className="bg-[#f6f7f8] text-[#4e7397] font-semibold text-xs rounded-full px-3 py-1 border-0">
                        {typeBadge}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-bold text-[#0e141b] mb-1">{sub.nameService || sub.nomService}</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-2xl font-bold text-[#4799eb]">{price} €</span>
                      <span className="text-sm text-[#4e7397]">/mois</span>
                    </div>

                    <div className="flex items-center text-sm mb-6 text-[#4e7397]">
                      <span className="material-symbols-outlined text-base mr-2 opacity-80">calendar_today</span>
                      <span>Prochain prélèvement :</span>
                      <span className="ml-1 font-medium text-[#0e141b]">{date}</span>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-[#f6f7f8] border-t border-gray-100 flex justify-end">
                    <Button variant="outline" size="sm" className="font-medium text-[#4e7397] hover:bg-white hover:text-[#4799eb] border-gray-200">
                      Modifier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="flex justify-center mt-8 pb-4">
        <Button variant="ghost" className="text-[#4e7397] hover:text-[#4799eb] hover:bg-transparent tracking-wide text-sm font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-xl">add_circle</span>
          Nouvel abonnement
        </Button>
      </div>
    </div>
  );
}
