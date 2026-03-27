import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

function JoinConfirmDialog({ open, onOpenChange, colocationData, onConfirm, loading }) {
  if (!colocationData) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rejoindre &quot;{colocationData.name}&quot; ?</DialogTitle>
          <DialogDescription>
            Cette colocation a {colocationData.memberCount} membre(s)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Membres actuels :</span>
          </div>
          <ul className="space-y-1">
            {colocationData.members.map((m, i) => (
              <li key={i} className="flex items-center justify-between px-3 py-2 bg-muted rounded-md">
                <span className="text-sm font-medium">{m.name}</span>
                <Badge variant={m.role === "admin" ? "default" : "secondary"}>{m.role}</Badge>
              </li>
            ))}
          </ul>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={onConfirm} disabled={loading}>
            {loading ? "Connexion..." : "Confirmer et rejoindre"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default JoinConfirmDialog
