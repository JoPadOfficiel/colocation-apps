import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateUser } from "@/lib/api"

export default function Settings() {
  const { user, setUser } = useAuth()
  const [nom, setNom] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

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
        } catch {}
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
    </div>
  )
}
