import { Calendar, User, MoreHorizontal, Pencil, Trash2, Repeat } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const STATUS_STYLES = {
  "Terminée": { button: "bg-green-100 border-green-500 text-green-600", dot: "bg-green-500 scale-100" },
  "En cours": { button: "bg-orange-100 border-orange-400 text-orange-600", dot: "bg-orange-400 scale-100" },
}

export default function TaskCard({ task, userMap, onToggle, onEdit, onDelete, selected, onSelect }) {
  const isDone = task.status === "Terminée"
  const statusStyle = STATUS_STYLES[task.status] || { button: "border-gray-300 hover:border-primary/50 text-gray-300", dot: "bg-transparent scale-0" }
  const date = task.dueDate ? new Date(task.dueDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : ""

  return (
    <Card className={`group border transition-all duration-300 hover:shadow-md hover:border-gray-200 ${selected ? "ring-2 ring-primary ring-offset-2 border-primary" : "border-gray-100"}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-3 shrink-0 pt-0.5" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={selected}
              onCheckedChange={onSelect}
              className="h-4 w-4 border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <button
              onClick={onToggle}
              className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${statusStyle.button}`}
            >
              <div className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${statusStyle.dot}`} />
            </button>
          </div>
          <div className="flex-1 min-w-0 py-0.5">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider bg-white/50">{task.category}</Badge>
              {task.recurrence !== "none" && (
                <Badge variant="secondary" className="text-[10px] font-normal gap-1">
                  <Repeat className="w-2.5 h-2.5" />
                  {task.recurrence === "daily" ? "Quotidien" : task.recurrence === "weekly" ? "Hebdo" : "Mensuel"}
                </Badge>
              )}
            </div>
            <p className={`text-sm font-semibold leading-snug ${isDone ? "line-through text-gray-400" : task.status === "En cours" ? "text-orange-800" : "text-gray-900"}`}>
              {task.title}
            </p>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
              {date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {date}
                </span>
              )}
              {task.assignedTo && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" /> {userMap[task.assignedTo] || "Inconnu"}
                </span>
              )}
            </div>
          </div>
          <div className="shrink-0 self-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="w-3 h-3 mr-2" /> Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-red-600 focus:text-red-600">
                  <Trash2 className="w-3 h-3 mr-2" /> Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
