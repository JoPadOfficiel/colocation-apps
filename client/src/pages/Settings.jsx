import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { User, Mail, ShieldCheck, Copy, UserPlus, Bell, BellRing, ChevronDown } from "lucide-react"
import { updateUser, fetchUsers, updateMemberRole, removeMember, fetchColocationById } from "@/lib/api"

function getInitials(name) {
  if (!name || typeof name !== "string") return "?"
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?"
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function Settings() {
  const { user, setUser, colocation, updateColocation } = useAuth()
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

  // Member action state
  const [actionError, setActionError] = useState("")
  const [actionLoading, setActionLoading] = useState(null) // userId currently being acted on
  const [openMenuId, setOpenMenuId] = useState(null) // userId with open dropdown
  const [confirmExclude, setConfirmExclude] = useState(null) // member to confirm exclusion

  // Notifications state
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)

  // Load members from enriched colocation data or fetch separately
  useEffect(() => {
    if (!isAdmin) return
    setMembersLoading(true)
    setMembersError(false)

    // Check if members are already enriched (have name property)
    if (colocation?.members?.[0]?.name !== undefined) {
      setMembers(colocation.members)
      setMembersLoading(false)
      return
    }

    // Otherwise fetch users and map them
    fetchUsers()
      .then((all) => {
        const ids = colocation?.members || []
        setMembers(ids.length ? all.filter((u) => ids.includes(u.id)) : all)
      })
      .catch(() => setMembersError(true))
      .finally(() => setMembersLoading(false))
  }, [isAdmin, colocation]) // eslint-disable-line react-hooks/exhaustive-deps

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!openMenuId) return
    function handleClick() { setOpenMenuId(null) }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [openMenuId])

  async function refreshColocation() {
    if (!colocation?.id) return
    try {
      const updated = await fetchColocationById(colocation.id)
      updateColocation(updated)
    } catch {
      // non-critical — members list will be stale but not broken
    }
  }

  async function handleRoleChange(memberId, newRole) {
    setActionError("")
    setActionLoading(memberId)
    setOpenMenuId(null)
    try {
      await updateMemberRole(colocation.id, memberId, newRole)
      await refreshColocation()
    } catch (err) {
      setActionError(err.message || "Erreur lors du changement de rôle")
    } finally {
      setActionLoading(null)
    }
  }

  async function handleExcludeConfirmed() {
    if (!confirmExclude) return
    const memberId = confirmExclude.id
    setActionError("")
    setActionLoading(memberId)
    setConfirmExclude(null)
    try {
      await removeMember(colocation.id, memberId)
      await refreshColocation()
    } catch (err) {
      setActionError(err.message || "Erreur lors de l'exclusion du membre")
    } finally {
      setActionLoading(null)
    }
  }

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
                <User size={16} className="inline-block align-middle mr-1 text-[#4e7397]" />
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
                <Mail size={16} className="inline-block align-middle mr-2 text-[#4e7397]" />
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
            <CardTitle className="text-lg font-semibold text-[#0e141b] flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#4e7397]" />
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
                   className="shrink-0 flex items-center gap-1"
                 >
                   <Copy size={16} />
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
              {actionError && <p className="text-sm text-[#ef4444] mb-2">{actionError}</p>}
              {!membersLoading && !membersError && (
                <ul className="space-y-2">
                  {members.map((m) => {
                    const isSelf = m.id === user?.id
                    const isLoading = actionLoading === m.id
                    const isMenuOpen = openMenuId === m.id
                    return (
                      <li key={m.id} className="flex items-center gap-3">
                        <Avatar size="default">
                          <AvatarFallback className="bg-[#eef6fd] text-[#4799eb] text-xs font-medium">
                            {getInitials(m.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="flex-1 text-sm text-[#0e141b]">
                          {m.name}
                          {isSelf && <span className="text-[#4e7397] ml-1">(Vous)</span>}
                        </span>
                        <Badge variant={m.role === "admin" ? "default" : "secondary"}>
                          {m.role === "admin" ? "Admin" : "Membre"}
                        </Badge>
                        {!isSelf && (
                          <div className="relative">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={isLoading}
                              onClick={(e) => {
                                e.stopPropagation()
                                setOpenMenuId(isMenuOpen ? null : m.id)
                              }}
                              className="flex items-center gap-1 h-7 px-2 text-xs"
                            >
                              {isLoading ? "..." : <><ChevronDown size={14} /></>}
                            </Button>
                            {isMenuOpen && (
                              <div
                                className="absolute right-0 top-8 z-10 bg-white border border-gray-200 rounded-md shadow-lg min-w-[160px]"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {m.role !== "admin" && (
                                  <button
                                    className="w-full text-left px-3 py-2 text-sm text-[#0e141b] hover:bg-gray-50"
                                    onClick={() => handleRoleChange(m.id, "admin")}
                                  >
                                    Promouvoir Admin
                                  </button>
                                )}
                                {m.role === "admin" && (
                                  <button
                                    className="w-full text-left px-3 py-2 text-sm text-[#0e141b] hover:bg-gray-50"
                                    onClick={() => handleRoleChange(m.id, "member")}
                                  >
                                    Rétrograder Membre
                                  </button>
                                )}
                                <button
                                  className="w-full text-left px-3 py-2 text-sm text-[#ef4444] hover:bg-red-50 border-t border-gray-100"
                                  onClick={() => { setConfirmExclude(m); setOpenMenuId(null) }}
                                >
                                  Exclure
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {/* Confirmation dialog for member exclusion */}
            {confirmExclude && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
                  <h3 className="text-base font-semibold text-[#0e141b] mb-2">Exclure ce membre ?</h3>
                  <p className="text-sm text-[#4e7397] mb-4">
                    <strong>{confirmExclude.name}</strong> sera retiré de la colocation. Cette action est immédiate.
                  </p>
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setConfirmExclude(null)}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="button"
                      className="bg-[#ef4444] hover:bg-[#dc2626] text-white"
                      onClick={handleExcludeConfirmed}
                    >
                      Exclure
                    </Button>
                  </div>
                </div>
              </div>
            )}

             <Button type="button" variant="outline" onClick={handleInvite} className="flex items-center gap-2">
               <UserPlus size={18} />
               Inviter un colocataire
             </Button>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm border border-gray-100 mt-6">
        <CardHeader className="pb-2">
           <CardTitle className="text-lg font-semibold text-[#0e141b] flex items-center gap-2">
             <Bell size={18} className="text-[#4e7397]" />
             Notifications
           </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
             <div className="flex items-start gap-3 flex-1">
               <Mail size={20} className="text-[#4e7397] mt-0.5" />
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
               <BellRing size={20} className="text-[#4e7397] mt-0.5" />
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
