import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Wallet, CheckCircle, ShoppingCart, CreditCard, Plus, TrendingUp, Clock } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchTasks, fetchFinances, fetchShoppingList, fetchSubscriptions, fetchUsers } from "@/lib/api"

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

function ExpenseChart({ finances }) {
  const byType = {}
  finances.forEach((f) => {
    byType[f.type] = (byType[f.type] || 0) + f.amount
  })
  const entries = Object.entries(byType).sort((a, b) => b[1] - a[1])
  const max = Math.max(...entries.map(([, v]) => v), 1)
  const typeLabels = { shopping: "Courses", rent: "Loyer", utility: "Services", entertainment: "Sorties" }
  const typeColors = { shopping: "bg-blue-500", rent: "bg-purple-500", utility: "bg-amber-500", entertainment: "bg-green-500" }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Dépenses par catégorie
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.map(([type, amount]) => (
            <div key={type} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{typeLabels[type] || type}</span>
                <span className="font-medium">{amount.toFixed(2)} €</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${typeColors[type] || "bg-gray-400"}`}
                  style={{ width: `${(amount / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Total : {finances.reduce((sum, f) => sum + f.amount, 0).toFixed(2)} €
        </p>
      </CardContent>
    </Card>
  )
}

function timeAgo(date) {
  const diff = Date.now() - date.getTime()
  const days = Math.floor(diff / 86400000)
  if (days > 0) return `il y a ${days}j`
  const hours = Math.floor(diff / 3600000)
  if (hours > 0) return `il y a ${hours}h`
  return "à l'instant"
}

function RecentActivity({ finances, tasks, users }) {
  const userMap = {}
  users.forEach((u) => { userMap[u.id] = u.name })

  const activities = [
    ...finances.map((f) => ({
      id: f.id,
      text: `${userMap[f.paidBy] || "Quelqu'un"} a ajouté "${f.title}" (${f.amount.toFixed(2)} €)`,
      date: new Date(f.date),
      type: "finance",
    })),
    ...tasks.filter((t) => t.status === "Terminée").map((t) => ({
      id: t.id,
      text: `${userMap[t.assignedTo] || "Quelqu'un"} a terminé "${t.title}"`,
      date: new Date(t.dueDate),
      type: "task",
    })),
  ]
    .sort((a, b) => b.date - a.date)
    .slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5 text-gray-600" />
          Activités récentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune activité récente</p>
        ) : (
          <div className="space-y-3">
            {activities.map((a) => (
              <div key={a.id} className="flex items-start gap-3">
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${a.type === "finance" ? "bg-blue-500" : "bg-green-500"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">{a.text}</p>
                  <p className="text-xs text-gray-400">{timeAgo(a.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function BalanceTable({ finances, users }) {
  const totals = {}
  users.forEach((u) => { totals[u.id] = 0 })
  const totalAll = finances.reduce((s, f) => s + f.amount, 0)
  const perPerson = totalAll / (users.length || 1)
  finances.forEach((f) => {
    if (totals[f.paidBy] !== undefined) totals[f.paidBy] += f.amount
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Équilibre des dépenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {users.map((u) => {
            const paid = totals[u.id] || 0
            const balance = paid - perPerson
            return (
              <div key={u.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{u.name}</span>
                <div className="text-right">
                  <span className="text-sm text-gray-500 mr-3">payé : {paid.toFixed(2)} €</span>
                  <span className={`text-sm font-medium ${balance >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {balance >= 0 ? "+" : ""}{balance.toFixed(2)} €
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-gray-400 mt-3">Part équitable : {perPerson.toFixed(2)} € par personne</p>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, colocation } = useAuth()
  const [data, setData] = useState({ tasks: [], finances: [], shopping: [], subscriptions: [], users: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchTasks(colocation?.id), fetchFinances(colocation?.id), fetchShoppingList(colocation?.id), fetchSubscriptions(colocation?.id), fetchUsers()])
      .then(([tasks, finances, shopping, subscriptions, users]) => {
        setData({ tasks, finances, shopping, subscriptions, users })
      })
      .catch((err) => console.error("Dashboard load error:", err))
      .finally(() => setLoading(false))
  }, [colocation?.id])

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
            Voici ce qui se passe dans votre colocation aujourd&apos;hui
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
            onClick={() => navigate("/subscriptions")}
          />
        </div>
      )}

      {!loading && <ExpenseChart finances={data.finances} />}
      {!loading && <RecentActivity finances={data.finances} tasks={data.tasks} users={data.users} />}
      {!loading && <BalanceTable finances={data.finances} users={data.users} />}
    </div>
  )
}
