import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { updateUser, fetchUsers } from "@/lib/api"

function getInitials(name) {
  if (!name || typeof name !== "string") return "?"
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?"
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function Settings() {
  const { user, setUser, colocation } = useAuth()
  const [nom, setNom] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const isAdmin = user?.role === "admin"
  const [members, setMembers] = useState([])
  const [membersLoading, setMembersLoading] = useState(false)
  const [membersError, setMembersError] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const copyTimeoutRef = useRef(null)

  // Notifications state
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)

  // F3: dep sur user?.role (stable primitive) au lieu de la dérivée isAdmin
  useEffect(() => {
    if (!isAdmin) return
    setMembersLoading(true)
    setMembersError(false)
    fetchUsers()
      .then((all) => {
        // F5: filtrage par colocation.members (tableau d'ids)
        const ids = colocation?.members || []
        setMembers(ids.length ? all.filter((u) => ids.includes(u.id)) : all)
      })
      .catch(() => setMembersError(true))
      .finally(() => setMembersLoading(false))
  }, [user?.role]) // eslint-disable-line react-hooks/exhaustive-deps

  // F8: nettoyage du setTimeout au démontage
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    }
  }, [])

  // F4: retourne succès/échec pour feedback
  async function copyCode() {
    if (!colocation?.invitationCode) return false
    try {
      await navigator.clipboard.writeText(colocation.invitationCode)
      return true
    } catch {
      return false
    }
  }

  async function handleCopy() {
    const ok = await copyCode()
    setCopied(ok)
    setCopyError(!ok)
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    copyTimeoutRef.current = setTimeout(() => {
      setCopied(false)
      setCopyError(false)
    }, 2000)
  }

  // F1: action distincte — navigator.share() si dispo, sinon clipboard
  async function handleInvite() {
    const code = colocation?.invitationCode
    if (!code) return
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Rejoins ma colocation",
          text: `Utilise ce code pour rejoindre notre colocation : ${code}`,
        })
        return
      } catch (err) {
        console.error("Sharing failed", err)
      }
    }
    await handleCopy()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (saving || !user) return
    const trimmedNom = nom.trim()
    if (!trimmedNom) {
      setError("Le nom ne peut pas être vide.")
      return
    }
    setSaving(true)
    setSuccess(false)
    setError("")
    try {
      const updated = await updateUser(user.id, { name: trimmedNom, email })
      setUser(updated)
      const saved = sessionStorage.getItem("colocapp_user")
      if (saved) {
        try {
          const data = JSON.parse(saved)
          data.user = updated
          sessionStorage.setItem("colocapp_user", JSON.stringify(data))
        } catch (err) {
          console.error("Failed to update session storage", err)
        }
      }
      setSuccess(true)
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4 md:p-6 animate-in fade-in duration-500 max-w-2xl">
      <h1 className="text-2xl font-bold text-[#0e141b] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Réglages
      </h1>

      <Card className="shadow-sm border border-gray-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-[#0e141b]">Profil</CardTitle>
          <p className="text-sm text-[#4e7397]">Mettez à jour vos informations personnelles et votre compte</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#0e141b]" htmlFor="nom">
                <span className="material-symbols-outlined align-middle text-base mr-1 text-[#4e7397]">person</span>
                Nom complet
              </label>
              <Input
                id="nom"
                type="text"
                value={nom}
                onChange={(e) => { setNom(e.target.value); setSuccess(false) }}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-[#0e141b]" htmlFor="email">
                <span className="material-symbols-outlined align-middle text-base mr-1 text-[#4e7397]">mail</span>
                Adresse e-mail
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setSuccess(false) }}
                required
              />
            </div>

            {error && <p className="text-sm text-[#ef4444]">{error}</p>}
            {success && <p className="text-sm text-[#22c55e]">Informations mises à jour.</p>}

            <Button type="submit" disabled={saving} className="bg-[#4799eb] hover:bg-[#3b82f6] text-white">
              {saving ? "Enregistrement..." : "Mettre à jour"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isAdmin && (
        <Card className="shadow-sm border border-gray-100 mt-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-[#0e141b]">
              <span className="material-symbols-outlined align-middle text-base mr-1 text-[#4e7397]">admin_panel_settings</span>
              Ma Colocation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-[#0e141b] mb-1">Code d&apos;invitation</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-md bg-gray-50 border border-gray-200 px-3 py-2 text-sm font-mono text-[#0e141b]">
                  {colocation?.invitationCode || "—"}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  <span className="material-symbols-outlined text-base mr-1">content_copy</span>
                  {copied ? "Copié !" : copyError ? "Erreur" : "Copier"}
                </Button>
              </div>
              {copyError && (
                <p className="text-xs text-[#ef4444] mt-1">Copie impossible. Copiez le code manuellement.</p>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-[#0e141b] mb-2">Membres</p>
              {membersLoading && <p className="text-sm text-[#4e7397]">Chargement...</p>}
              {membersError && <p className="text-sm text-[#ef4444]">Impossible de charger les membres.</p>}
              {!membersLoading && !membersError && (
                <ul className="space-y-2">
                  {members.map((m) => (
                    <li key={m.id} className="flex items-center gap-3">
                      <Avatar size="default">
                        <AvatarFallback className="bg-[#eef6fd] text-[#4799eb] text-xs font-medium">
                          {getInitials(m.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="flex-1 text-sm text-[#0e141b]">
                        {m.name}
                        {m.id === user?.id && <span className="text-[#4e7397] ml-1">(Vous)</span>}
                      </span>
                      <Badge variant={m.role === "admin" ? "default" : "secondary"}>
                        {m.role === "admin" ? "Admin" : "Membre"}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Button type="button" variant="outline" onClick={handleInvite}>
              <span className="material-symbols-outlined text-base mr-1">person_add</span>
              Inviter un colocataire
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm border border-gray-100 mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-[#0e141b]">
            <span className="material-symbols-outlined align-middle text-base mr-1 text-[#4e7397]">notifications</span>
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-3 flex-1">
              <span className="material-symbols-outlined text-xl text-[#4e7397] mt-0.5">mail</span>
              <div>
                <Label className="text-sm font-medium text-[#0e141b]">Notifications par e-mail</Label>
                <p className="text-xs text-[#4e7397] mt-1">Résumé hebdomadaire des dépenses et tâches</p>
              </div>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
              className="ml-2"
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-3 flex-1">
              <span className="material-symbols-outlined text-xl text-[#4e7397] mt-0.5">notifications_active</span>
              <div>
                <Label className="text-sm font-medium text-[#0e141b]">Notifications Push</Label>
                <p className="text-xs text-[#4e7397] mt-1">Alertes immédiates pour nouvelles tâches et messages</p>
              </div>
            </div>
            <Switch
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
              className="ml-2"
            />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <button className="text-sm text-[#ef4444] hover:underline">Supprimer le compte</button>
      </div>
    </div>
  )
}
