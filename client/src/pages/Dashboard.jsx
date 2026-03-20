import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Wallet, CheckCircle, ShoppingCart, CreditCard, Plus } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { fetchTasks, fetchFinances, fetchShoppingList, fetchSubscriptions } from "@/lib/api"

function WidgetCard({ icon: Icon, iconColor, title, value, badge, badgeColor, onClick }) {
  return (
    <Card
      className="cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all"
      onClick={onClick}
    >
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-500">{title}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {badge && (
              <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${badgeColor}`}>
                {badge}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, colocation } = useAuth()
  const [data, setData] = useState({ tasks: [], finances: [], shopping: [], subscriptions: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchTasks(), fetchFinances(), fetchShoppingList(), fetchSubscriptions()])
      .then(([tasks, finances, shopping, subscriptions]) => {
        setData({ tasks, finances, shopping, subscriptions })
      })
      .catch((err) => console.error("Dashboard load error:", err))
      .finally(() => setLoading(false))
  }, [])

  const firstName = user?.name?.split(" ")[0] || "Utilisateur"
  const urgentTasks = data.tasks.filter((t) => t.status === "À faire" || t.status === "En cours")
  const nextTask = data.tasks
    .filter((t) => t.status === "À faire")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0]
  const unpurchasedItems = data.shopping.filter((s) => !s.isPurchased).length
  const totalSubscriptions = data.subscriptions.length

  return (
    <div className="p-4 md:p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Bonjour, {firstName} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Voici ce qui se passe dans votre colocation aujourd'hui
          </p>
        </div>
        <Button onClick={() => navigate("/finances")} className="self-start sm:self-auto">
          <Plus className="w-4 h-4 mr-1" />
          Nouvelle dépense
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <WidgetCard
            icon={Wallet}
            iconColor="bg-blue-100 text-blue-600"
            title="Finances"
            value={`${colocation?.totalFund?.toFixed(2) ?? "0.00"} €`}
            badge={`${data.finances.length} dépenses ce mois`}
            badgeColor="bg-blue-50 text-blue-600"
            onClick={() => navigate("/finances")}
          />

          <WidgetCard
            icon={CheckCircle}
            iconColor="bg-orange-100 text-orange-600"
            title="Tâches"
            value={`${urgentTasks.length} urgente${urgentTasks.length > 1 ? "s" : ""}`}
            badge={nextTask ? `Prochaine : ${nextTask.title}` : "Tout est fait !"}
            badgeColor={urgentTasks.length > 0 ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"}
            onClick={() => navigate("/tasks")}
          />

          <WidgetCard
            icon={ShoppingCart}
            iconColor="bg-green-100 text-green-600"
            title="Alimentation"
            value={`${unpurchasedItems} article${unpurchasedItems > 1 ? "s" : ""}`}
            badge="à acheter"
            badgeColor="bg-green-50 text-green-600"
            onClick={() => navigate("/food")}
          />

          <WidgetCard
            icon={CreditCard}
            iconColor="bg-purple-100 text-purple-600"
            title="Abonnements"
            value={`${totalSubscriptions} actif${totalSubscriptions > 1 ? "s" : ""}`}
            badge="services partagés"
            badgeColor="bg-purple-50 text-purple-600"
            onClick={() => navigate("/settings")}
          />
        </div>
      )}
    </div>
  )
}
