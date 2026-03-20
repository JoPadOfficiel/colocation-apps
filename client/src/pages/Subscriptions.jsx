import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { fetchSubscriptions } from "../lib/api";
import ConfirmDialog from "../components/ConfirmDialog";

// Fallback data if API fails
const FALLBACK_SUBSCRIPTIONS = [
  { id: "1", nameService: "Netflix", type: "PREMIUM", costMonthly: 17.99, dateBilling: "12 Oct", icon: "movie", placesLimit: 4, placesUsed: 4, credentials: { user: "coloc@gmail.com", pass: "Netflix123!" } },
  { id: "2", nameService: "Internet (Orange)", type: "FIBRE", costMonthly: 39.99, dateBilling: "01 Oct", icon: "router" },
  { id: "3", nameService: "Spotify Family", type: "FAMILLE", costMonthly: 15.99, dateBilling: "22 Oct", icon: "audiotrack", placesLimit: 6, placesUsed: 3, credentials: { user: "coloc@gmail.com", pass: "Spotify123!" } },
  { id: "4", nameService: "Disney+", type: "ANNUEL", costMonthly: 8.99, dateBilling: "05 Nov", icon: "stars", placesLimit: 4, placesUsed: 2, credentials: { user: "coloc@gmail.com", pass: "Disney123!" } },
  { id: "5", nameService: "Électricité (EDF)", type: "FIXE", costMonthly: 62.54, dateBilling: "15 Oct", icon: "bolt" },
];

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [currentSub, setCurrentSub] = useState(null);
  const [formData, setFormData] = useState({ nameService: "", type: "", costMonthly: "", dateBilling: "", placesLimit: "", placesUsed: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchSubscriptions();
        if (data && data.length > 0) {
          // ensure data schema compatibility
          setSubscriptions(data.map(d => ({
            ...d, 
            placesLimit: d.placesLimit || null,
            placesUsed: d.placesUsed || null,
            credentials: d.credentials || null
          })));
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

  const openAddDialog = () => {
    setCurrentSub(null);
    setFormData({ nameService: "", type: "SERVICE", costMonthly: "", dateBilling: "", placesLimit: "", placesUsed: "" });
    setErrors({});
    setIsDialogOpen(true);
  };

  const openEditDialog = (sub) => {
    setCurrentSub(sub);
    setFormData({
      nameService: sub.nameService || sub.nomService || "",
      type: sub.type || "SERVICE",
      costMonthly: sub.costMonthly || sub.coutMensuel || "",
      dateBilling: sub.dateBilling || sub.datePrelevement || "",
      placesLimit: sub.placesLimit || "",
      placesUsed: sub.placesUsed || ""
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const openConfirmDialog = (sub) => {
    setCurrentSub(sub);
    setIsConfirmOpen(true);
  };

  const openDetailsDialog = (sub) => {
    setCurrentSub(sub);
    setShowPassword(false);
    setIsDetailsOpen(true);
  };

  const handleDelete = () => {
    if (currentSub) {
      setSubscriptions(subscriptions.filter(s => s.id !== currentSub.id));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nameService.trim()) newErrors.nameService = "Le nom du service est requis.";
    if (!formData.costMonthly || isNaN(formData.costMonthly) || Number(formData.costMonthly) <= 0) {
      newErrors.costMonthly = "Le coût doit être un nombre positif.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (currentSub) {
      // Edit
      setSubscriptions(subscriptions.map(s => 
        s.id === currentSub.id 
          ? { ...s, ...formData, costMonthly: Number(formData.costMonthly) } 
          : s
      ));
    } else {
      // Add
      const newSub = {
        id: Date.now().toString(),
        icon: "stars",
        ...formData,
        costMonthly: Number(formData.costMonthly)
      };
      setSubscriptions([...subscriptions, newSub]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="w-full h-full p-4 md:p-8 space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Abonnements</h1>
          <p className="text-gray-500 mt-1">Gérez les services partagés de la colocation</p>
        </div>
        <Button onClick={openAddDialog} className="bg-[#4799eb] hover:bg-[#3b82f6] text-white self-start md:self-auto shadow-sm">
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
              <Card key={sub.id} className="shadow-card border-gray-100/60 overflow-hidden hover:shadow-md transition-shadow relative">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-[#f6f7f8] text-[#4e7397] p-3 rounded-xl border border-gray-100">
                        <span className="material-symbols-outlined block text-3xl">{iconName}</span>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="secondary" className="bg-[#f6f7f8] text-[#4e7397] font-semibold text-xs rounded-full px-3 py-1 border-0">
                          {typeBadge}
                        </Badge>
                        <button onClick={() => openConfirmDialog(sub)} className="text-red-400 hover:text-red-600 transition-colors">
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-[#0e141b] mb-1">{sub.nameService || sub.nomService}</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-2xl font-bold text-[#4799eb]">{price} €</span>
                      <span className="text-sm text-[#4e7397]">/mois</span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-[#4e7397]">
                        <span className="material-symbols-outlined text-base mr-2 opacity-80">calendar_today</span>
                        <span>Prochain prélèvement :</span>
                        <span className="ml-1 font-medium text-[#0e141b]">{date}</span>
                      </div>
                      
                      {sub.placesLimit && (
                        <div className="flex items-center text-sm text-[#4e7397]">
                          <span className="material-symbols-outlined text-base mr-2 opacity-80">group</span>
                          <span>Places :</span>
                          <span className="ml-1 font-medium text-[#0e141b]">{sub.placesUsed}/{sub.placesLimit}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-[#f6f7f8] border-t border-gray-100 flex items-center justify-between mt-auto">
                    {sub.credentials ? (
                       <Button variant="ghost" size="sm" onClick={() => openDetailsDialog(sub)} className="text-[#4e7397] font-medium hover:text-[#4799eb] border border-transparent shadow-none px-0 hover:bg-transparent -ml-2">
                         <span className="material-symbols-outlined mr-1 text-sm">key</span> Identifiants
                       </Button>
                    ) : <div></div>}
                    <Button onClick={() => openEditDialog(sub)} variant="outline" size="sm" className="font-medium text-[#4e7397] hover:bg-white hover:text-[#4799eb] border-gray-200">
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
        <Button onClick={openAddDialog} variant="ghost" className="text-[#4e7397] hover:text-[#4799eb] hover:bg-transparent tracking-wide text-sm font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-xl">add_circle</span>
          Nouvel abonnement
        </Button>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentSub ? "Modifier l'abonnement" : "Ajouter un abonnement"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Nom du service</label>
              <Input 
                value={formData.nameService} 
                onChange={(e) => setFormData({ ...formData, nameService: e.target.value })} 
                placeholder="Ex: Netflix, Internet..." 
              />
              {errors.nameService && <span className="text-red-500 text-xs">{errors.nameService}</span>}
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Type (Badge)</label>
              <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                  <SelectItem value="FIBRE">FIBRE</SelectItem>
                  <SelectItem value="FAMILLE">FAMILLE</SelectItem>
                  <SelectItem value="ANNUEL">ANNUEL</SelectItem>
                  <SelectItem value="FIXE">FIXE</SelectItem>
                  <SelectItem value="SERVICE">SERVICE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Coût Mensuel (€)</label>
                <Input 
                  type="number" 
                  step="0.01" 
                  value={formData.costMonthly} 
                  onChange={(e) => setFormData({ ...formData, costMonthly: e.target.value })} 
                />
                {errors.costMonthly && <span className="text-red-500 text-xs">{errors.costMonthly}</span>}
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Date prélèvement</label>
                <Input 
                  value={formData.dateBilling} 
                  onChange={(e) => setFormData({ ...formData, dateBilling: e.target.value })} 
                  placeholder="Ex: 12 Oct" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Places (limite)</label>
                <Input 
                  type="number" 
                  value={formData.placesLimit} 
                  onChange={(e) => setFormData({ ...formData, placesLimit: e.target.value })} 
                  placeholder="Optionnel"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Places utilisées</label>
                <Input 
                  type="number" 
                  value={formData.placesUsed} 
                  onChange={(e) => setFormData({ ...formData, placesUsed: e.target.value })} 
                  placeholder="Optionnel"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSave} className="bg-[#4799eb] text-white hover:bg-[#3b82f6]">Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details (Credentials) Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Identifiants de connexion</DialogTitle>
            <DialogDescription>
              Service: <span className="font-bold">{currentSub?.nameService}</span>
            </DialogDescription>
          </DialogHeader>
          {currentSub?.credentials && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-500">Nom d'utilisateur / Email</label>
                <div className="p-3 bg-gray-50 rounded-md border text-sm font-mono flex justify-between">
                  <span>{currentSub.credentials.user}</span>
                  <button className="text-[#4799eb] hover:underline text-xs my-auto" onClick={() => navigator.clipboard.writeText(currentSub.credentials.user)}>Copier</button>
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-500">Mot de passe</label>
                <div className="p-3 bg-gray-50 rounded-md border text-sm font-mono flex justify-between items-center group">
                  <span>{showPassword ? currentSub.credentials.pass : '••••••••••••'}</span>
                  <div className="flex gap-2">
                    <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)}>
                      <span className="material-symbols-outlined text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                    <button className="text-[#4799eb] hover:underline text-xs my-auto" onClick={() => navigator.clipboard.writeText(currentSub.credentials.pass)}>Copier</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailsOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog 
        open={isConfirmOpen} 
        onOpenChange={setIsConfirmOpen}
        title="Supprimer cet abonnement"
        description="Êtes-vous sûr de vouloir supprimer cet abonnement ? Cette action mettra à jour le coût total."
        onConfirm={handleDelete}
        confirmText="Supprimer"
        variant="destructive"
      />
    </div>
  );
}
