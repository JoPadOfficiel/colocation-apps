import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Check, X, Calendar, User } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchTasks, createTask, updateTask, deleteTask, fetchUsers } from "@/lib/api"

const CATEGORIES = ["Cuisine", "Salon", "Salle de bain", "Extérieur", "Courses", "Autre"]
const RECURRENCES = [
  { value: "none", label: "Aucune" },
  { value: "daily", label: "Quotidienne" },
  { value: "weekly", label: "Hebdomadaire" },
  { value: "monthly", label: "Mensuelle" },
]

export default function Tasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filter, setFilter] = useState({ status: "all", assignee: "all" })
  const [selectedTasks, setSelectedTasks] = useState([])

  // Form state
  const [form, setForm] = useState({
    title: "", description: "", category: "Autre", assignedTo: "", dueDate: "", recurrence: "none",
  })

  useEffect(() => {
    Promise.all([fetchTasks(), fetchUsers()])
      .then(([t, u]) => { setTasks(t); setUsers(u) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const userMap = {}
  users.forEach((u) => { userMap[u.id] = u.name })

  function resetForm() {
    setForm({ title: "", description: "", category: "Autre", assignedTo: user?.id || "", dueDate: "", recurrence: "none" })
    setEditingTask(null)
    setShowForm(false)
  }

  function startEdit(task) {
    setForm({
      title: task.title,
      description: task.description || "",
      category: task.category || "Autre",
      assignedTo: task.assignedTo || "",
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      recurrence: task.recurrence || "none",
    })
    setEditingTask(task)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    const payload = {
      ...form,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : new Date().toISOString(),
      status: editingTask ? editingTask.status : "À faire",
      createdBy: user?.id,
    }
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask.id, payload)
        setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? updated : t)))
      } else {
        const created = await createTask(payload)
        setTasks((prev) => [...prev, created])
      }
      resetForm()
    } catch (err) {
      console.error("Task save error:", err)
    }
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer cette tâche ?")) return
    try {
      await deleteTask(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      console.error("Delete error:", err)
    }
  }

  async function toggleStatus(task) {
    const newStatus = task.status === "Terminée" ? "À faire" : "Terminée"
    try {
      const updated = await updateTask(task.id, { status: newStatus })
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)))
    } catch (err) {
      console.error("Status toggle error:", err)
    }
  }

  async function bulkReassign(targetUserId) {
    try {
      const updates = await Promise.all(
        selectedTasks.map((id) => updateTask(id, { assignedTo: targetUserId }))
      )
      setTasks((prev) =>
        prev.map((t) => {
          const upd = updates.find((u) => u.id === t.id)
          return upd || t
        })
      )
      setSelectedTasks([])
    } catch (err) {
      console.error("Bulk reassign error:", err)
    }
  }

  function toggleSelect(id) {
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  // Filtered tasks
  const filtered = tasks.filter((t) => {
    if (filter.status !== "all" && t.status !== filter.status) return false
    if (filter.assignee !== "all" && t.assignedTo !== filter.assignee) return false
    return true
  })

  const todo = filtered.filter((t) => t.status !== "Terminée")
  const done = filtered.filter((t) => t.status === "Terminée")

  // Stats per user
  const stats = {}
  users.forEach((u) => { stats[u.id] = { total: 0, done: 0 } })
  tasks.forEach((t) => {
    if (stats[t.assignedTo]) {
      stats[t.assignedTo].total++
      if (t.status === "Terminée") stats[t.assignedTo].done++
    }
  })

  if (loading) return <div className="p-4"><p className="text-gray-500">Chargement...</p></div>

  return (
    <div className="p-4 md:p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tâches</h1>
        <Button onClick={() => { resetForm(); setForm((f) => ({ ...f, assignedTo: user?.id || "" })); setShowForm(true) }}>
          <Plus className="w-4 h-4 mr-1" /> NOUVELLE TÂCHE
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          className="text-sm border rounded-lg px-3 py-1.5 bg-white"
          value={filter.status}
          onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
        >
          <option value="all">Tous les statuts</option>
          <option value="À faire">À faire</option>
          <option value="En cours">En cours</option>
          <option value="Terminée">Terminée</option>
        </select>
        <select
          className="text-sm border rounded-lg px-3 py-1.5 bg-white"
          value={filter.assignee}
          onChange={(e) => setFilter((f) => ({ ...f, assignee: e.target.value }))}
        >
          <option value="all">Tous les membres</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>

        {selectedTasks.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-500">{selectedTasks.length} sélectionnée(s)</span>
            <select
              className="text-sm border rounded-lg px-3 py-1.5 bg-white"
              onChange={(e) => { if (e.target.value) bulkReassign(e.target.value); e.target.value = "" }}
              defaultValue=""
            >
              <option value="" disabled>Déléguer à...</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingTask ? "Modifier la tâche" : "Nouvelle tâche"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                placeholder="Titre de la tâche"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
              <Input
                placeholder="Description (optionnel)"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  className="text-sm border rounded-lg px-3 py-2 bg-white"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                  className="text-sm border rounded-lg px-3 py-2 bg-white"
                  value={form.assignedTo}
                  onChange={(e) => setForm((f) => ({ ...f, assignedTo: e.target.value }))}
                >
                  <option value="">Assigner à...</option>
                  {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                />
                <select
                  className="text-sm border rounded-lg px-3 py-2 bg-white"
                  value={form.recurrence}
                  onChange={(e) => setForm((f) => ({ ...f, recurrence: e.target.value }))}
                >
                  {RECURRENCES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingTask ? "Enregistrer" : "Créer"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Annuler</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Task Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            À Faire <Badge variant="secondary">{todo.length}</Badge>
          </h2>
          <div className="space-y-2">
            {todo.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                userMap={userMap}
                onToggle={() => toggleStatus(task)}
                onEdit={() => startEdit(task)}
                onDelete={() => handleDelete(task.id)}
                selected={selectedTasks.includes(task.id)}
                onSelect={() => toggleSelect(task.id)}
              />
            ))}
            {todo.length === 0 && <p className="text-sm text-gray-400">Aucune tâche</p>}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Terminées <Badge variant="secondary">{done.length}</Badge>
          </h2>
          <div className="space-y-2">
            {done.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                userMap={userMap}
                onToggle={() => toggleStatus(task)}
                onEdit={() => startEdit(task)}
                onDelete={() => handleDelete(task.id)}
                selected={selectedTasks.includes(task.id)}
                onSelect={() => toggleSelect(task.id)}
              />
            ))}
            {done.length === 0 && <p className="text-sm text-gray-400">Aucune tâche terminée</p>}
          </div>
        </div>
      </div>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Statistiques par membre</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{u.name}</span>
                <div className="flex gap-3 text-sm">
                  <span className="text-gray-500">{stats[u.id]?.total || 0} assignées</span>
                  <span className="text-green-600 font-medium">{stats[u.id]?.done || 0} terminées</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TaskCard({ task, userMap, onToggle, onEdit, onDelete, selected, onSelect }) {
  const isDone = task.status === "Terminée"
  const date = task.dueDate ? new Date(task.dueDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : ""

  return (
    <Card className={`${selected ? "ring-2 ring-primary" : ""} ${isDone ? "opacity-60" : ""}`}>
      <CardContent className="py-3 px-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={onSelect}
            className="mt-1 shrink-0"
            aria-label="Sélectionner"
          />
          <button onClick={onToggle} className="mt-0.5 shrink-0" aria-label="Changer statut">
            {isDone ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">{task.category}</Badge>
              {task.recurrence !== "none" && (
                <Badge variant="secondary" className="text-xs">🔄 {task.recurrence}</Badge>
              )}
            </div>
            <p className={`text-sm font-medium ${isDone ? "line-through text-gray-400" : "text-gray-900"}`}>
              {task.title}
            </p>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              {date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {date}
                </span>
              )}
              {task.assignedTo && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" /> {userMap[task.assignedTo] || "?"}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-1 shrink-0">
            <button onClick={onEdit} className="p-1 text-gray-400 hover:text-blue-500" aria-label="Modifier">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={onDelete} className="p-1 text-gray-400 hover:text-red-500" aria-label="Supprimer">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
