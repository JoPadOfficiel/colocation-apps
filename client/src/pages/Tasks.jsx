import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Plus, CheckCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchTasks, createTask, updateTask, deleteTask, fetchUsers } from "@/lib/api"
import ConfirmDialog from "@/components/ConfirmDialog"
import TaskCard from "@/components/TaskCard"

const CATEGORIES = ["Cuisine", "Salon", "Salle de bain", "Extérieur", "Courses", "Autre"]
const RECURRENCES = [
  { value: "none", label: "Aucune" },
  { value: "daily", label: "Quotidienne" },
  { value: "weekly", label: "Hebdomadaire" },
  { value: "monthly", label: "Mensuelle" },
]

export default function Tasks() {
  const { user, colocation } = useAuth()
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filter, setFilter] = useState({ status: "all", assignee: "all", date: "all" })
  const [selectedTasks, setSelectedTasks] = useState([])
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false)

  // Form state
  const [form, setForm] = useState({
    title: "", description: "", category: "Autre", assignedTo: "", dueDate: "", recurrence: "none",
  })
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    Promise.all([fetchTasks(colocation?.id), fetchUsers()])
      .then(([t, u]) => { setTasks(t); setUsers(u) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [colocation?.id])

  const userMap = {}
  users.forEach((u) => { userMap[u.id] = u.name })

  function resetForm() {
    setForm({ title: "", description: "", category: "Autre", assignedTo: user?.id || "", dueDate: "", recurrence: "none" })
    setEditingTask(null)
    setFormError(null)
    setDialogOpen(false)
  }

  function openCreateDialog() {
    setForm({ title: "", description: "", category: "Autre", assignedTo: user?.id || "", dueDate: "", recurrence: "none" })
    setEditingTask(null)
    setFormError(null)
    setDialogOpen(true)
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
    setFormError(null)
    setDialogOpen(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) {
      setFormError("Le titre de la tâche est requis")
      return
    }
    setFormError(null)
    const payload = {
      ...form,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : new Date().toISOString(),
      status: editingTask ? editingTask.status : "À faire",
      createdBy: user?.id,
      colocationId: colocation?.id,
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

  async function confirmDelete() {
    if (!taskToDelete) return
    setIsDeleting(true)
    try {
      await deleteTask(taskToDelete)
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete))
    } catch (err) {
      console.error("Delete error:", err)
    } finally {
      setIsDeleting(false)
      setDeleteConfirmOpen(false)
      setTaskToDelete(null)
    }
  }

  function promptDelete(id) {
    setTaskToDelete(id)
    setDeleteConfirmOpen(true)
  }

  async function toggleStatus(task) {
    const cycle = { "À faire": "En cours", "En cours": "Terminée", "Terminée": "À faire" }
    const newStatus = cycle[task.status] || "À faire"
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

  async function bulkMarkDone() {
    try {
      const updates = await Promise.all(
        selectedTasks.map((id) => updateTask(id, { status: "Terminée" }))
      )
      setTasks((prev) =>
        prev.map((t) => {
          const upd = updates.find((u) => u.id === t.id)
          return upd || t
        })
      )
      setSelectedTasks([])
    } catch (err) {
      console.error("Bulk mark done error:", err)
    }
  }

  async function bulkDelete() {
    try {
      await Promise.all(selectedTasks.map((id) => deleteTask(id)))
      setTasks((prev) => prev.filter((t) => !selectedTasks.includes(t.id)))
      setSelectedTasks([])
    } catch (err) {
      console.error("Bulk delete error:", err)
    }
  }

  function toggleSelect(id) {
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  // Filtered tasks
  const sortedTasks = [...tasks].sort((a, b) => {
    // Correctly extract the numeric part of the ID (e.g., 'task-1' -> 1)
    const getNumId = (id) => {
      if (!id) return 0;
      const match = id.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    };
    return getNumId(b.id) - getNumId(a.id);
  });

  const filtered = sortedTasks.filter((t) => {
    if (filter.status !== "all" && t.status !== filter.status) return false
    if (filter.assignee !== "all" && t.assignedTo !== filter.assignee) return false
    
    if (filter.date !== "all") {
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      const due = new Date(t.dueDate)
      due.setHours(0, 0, 0, 0)
      
      if (filter.date === "today") {
        if (due.getTime() !== now.getTime()) return false
      } else if (filter.date === "this-week") {
        const nextWeek = new Date(now)
        nextWeek.setDate(now.getDate() + 7)
        if (due < now || due > nextWeek) return false
      } else if (filter.date === "this-month") {
        const nextMonth = new Date(now)
        nextMonth.setMonth(now.getMonth() + 1)
        if (due < now || due > nextMonth) return false
      }
    }
    return true
  })

  const todo = filtered.filter((t) => t.status === "À faire")
  const inProgress = filtered.filter((t) => t.status === "En cours")
  const done = filtered.filter((t) => t.status === "Terminée")

  // Stats per user
  const stats = {}
  users.forEach((u) => { stats[u.id] = { total: 0, inProgress: 0, done: 0 } })
  tasks.forEach((t) => {
    if (stats[t.assignedTo]) {
      stats[t.assignedTo].total++
      if (t.status === "Terminée") stats[t.assignedTo].done++
      if (t.status === "En cours") stats[t.assignedTo].inProgress++
    }
  })

  if (loading) return <div className="p-4"><p className="text-gray-500">Chargement...</p></div>

  return (
    <div className="p-4 md:p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tâches de la Colocation</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-1" /> NOUVELLE TÂCHE
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Select
          value={filter.status}
          onValueChange={(val) => setFilter((f) => ({ ...f, status: val }))}
        >
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="À faire">À faire</SelectItem>
            <SelectItem value="En cours">En cours</SelectItem>
            <SelectItem value="Terminée">Terminée</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filter.assignee}
          onValueChange={(val) => setFilter((f) => ({ ...f, assignee: val }))}
        >
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Tous les membres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les membres</SelectItem>
            {users.map((u) => (
              <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filter.date}
          onValueChange={(val) => setFilter((f) => ({ ...f, date: val }))}
        >
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Toutes les dates" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les dates</SelectItem>
            <SelectItem value="today">Aujourd&apos;hui</SelectItem>
            <SelectItem value="this-week">7 prochains jours</SelectItem>
            <SelectItem value="this-month">30 prochains jours</SelectItem>
          </SelectContent>
        </Select>

        {selectedTasks.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 px-6 py-3 bg-white/80 backdrop-blur-md border shadow-2xl rounded-full animate-in slide-in-from-bottom-4 duration-300">
            <span className="text-sm font-medium text-gray-700">{selectedTasks.length} sélectionnée(s)</span>
            <div className="h-6 w-px bg-gray-200" />
            <Select
              onValueChange={(val) => { if (val) bulkReassign(val) }}
            >
              <SelectTrigger className="w-[180px] border-none bg-transparent hover:bg-gray-100/50">
                <SelectValue placeholder="Déléguer à..." />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="h-6 w-px bg-gray-200" />
            <Button size="sm" variant="outline" onClick={bulkMarkDone}>
              <CheckCircle className="h-4 w-4 mr-1" /> Terminée
            </Button>
            <Button size="sm" variant="destructive" onClick={() => setShowBulkDeleteConfirm(true)}>
              <Trash2 className="h-4 w-4 mr-1" /> Supprimer
            </Button>
            <div className="h-6 w-px bg-gray-200" />
            <Button variant="ghost" size="sm" onClick={() => setSelectedTasks([])} className="text-gray-500 hover:text-gray-900">
              Annuler
            </Button>
          </div>
        )}
        <ConfirmDialog
          open={showBulkDeleteConfirm}
          onConfirm={() => { setShowBulkDeleteConfirm(false); bulkDelete() }}
          onCancel={() => setShowBulkDeleteConfirm(false)}
          title="Supprimer les tâches sélectionnées"
          description={`Voulez-vous vraiment supprimer ${selectedTasks.length} tâche(s) ? Cette action est irréversible.`}
        />
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetForm() }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Modifier la tâche" : "Nouvelle tâche"}</DialogTitle>
            <DialogDescription>
              {editingTask
                ? "Modifiez les informations de la tâche ci-dessous."
                : "Remplissez les informations pour créer une nouvelle tâche."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Input
                placeholder="Titre de la tâche"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
              {formError && <p className="text-sm text-red-500 mt-1">{formError}</p>}
            </div>
            <Input
              placeholder="Description (optionnel)"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Catégorie</label>
                <Select
                  value={form.category}
                  onValueChange={(val) => setForm((f) => ({ ...f, category: val }))}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Assigné à</label>
                <Select
                  value={form.assignedTo}
                  onValueChange={(val) => setForm((f) => ({ ...f, assignedTo: val }))}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue>
                      {form.assignedTo === 'none' ? 'Non assigné' : (users.find(u => u.id === form.assignedTo)?.name || form.assignedTo)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Non assigné</SelectItem>
                    {users.map((u) => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Date d&apos;échéance</label>
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Récurrence</label>
                <Select
                  value={form.recurrence}
                  onValueChange={(val) => setForm((f) => ({ ...f, recurrence: val }))}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Récurrence" />
                  </SelectTrigger>
                  <SelectContent>
                    {RECURRENCES.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>Annuler</Button>
              <Button type="submit">{editingTask ? "Enregistrer" : "Créer la tâche"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Task Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                onDelete={() => promptDelete(task.id)}
                selected={selectedTasks.includes(task.id)}
                onSelect={() => toggleSelect(task.id)}
              />
            ))}
            {todo.length === 0 && <p className="text-sm text-gray-400">Aucune tâche</p>}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            En cours <Badge variant="secondary" className="bg-orange-100 text-orange-700">{inProgress.length}</Badge>
          </h2>
          <div className="space-y-2">
            {inProgress.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                userMap={userMap}
                onToggle={() => toggleStatus(task)}
                onEdit={() => startEdit(task)}
                onDelete={() => promptDelete(task.id)}
                selected={selectedTasks.includes(task.id)}
                onSelect={() => toggleSelect(task.id)}
              />
            ))}
            {inProgress.length === 0 && <p className="text-sm text-gray-400">Aucune tâche en cours</p>}
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
                onDelete={() => promptDelete(task.id)}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((u) => {
              const userStats = stats[u.id] || { total: 0, done: 0 }
              const percentage = userStats.total > 0 ? Math.round((userStats.done / userStats.total) * 100) : 0
              return (
                <div key={u.id} className="p-4 rounded-xl border bg-gray-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">{u.name}</span>
                    <Badge variant="outline" className="bg-white">{percentage}%</Badge>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{userStats.total} assignées</span>
                    {userStats.inProgress > 0 && <span className="text-orange-600 font-medium">{userStats.inProgress} en cours</span>}
                    <span className="text-green-600 font-medium">{userStats.done} terminées</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Supprimer la tâche ?"
        description="Cette action est irréversible. La tâche sera définitivement supprimée."
        onConfirm={confirmDelete}
        confirmText="Supprimer"
        loadingText="Suppression..."
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  )
}

