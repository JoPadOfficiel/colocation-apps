import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Home, Users } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function Onboarding() {
  const navigate = useNavigate()
  const { user, colocation, updateColocation } = useAuth()
  const [mode, setMode] = useState(null) // null | 'create' | 'join'
  const [colocName, setColocName] = useState("")
  const [joinCode, setJoinCode] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [createdCode, setCreatedCode] = useState(null)

  if (colocation) {
    navigate("/dashboard", { replace: true })
    return null
  }

  async function handleCreate(e) {
    e.preventDefault()
    setError(null)
    if (!colocName.trim()) {
      setError("Nom de la colocation requis")
      return
    }
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch("/api/colocation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: colocName.trim() }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || "Erreur")
        return
      }
      setCreatedCode(json.data.invitationCode)
      if (updateColocation) updateColocation(json.data)
    } catch {
      setError("Erreur réseau")
    } finally {
      setLoading(false)
    }
  }

  async function handleJoin(e) {
    e.preventDefault()
    setError(null)
    if (!joinCode.trim()) {
      setError("Code d'invitation requis")
      return
    }
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch("/api/colocation/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: joinCode.trim().toUpperCase() }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || "Code invalide")
        return
      }
      if (updateColocation) updateColocation(json.data)
      navigate("/dashboard", { replace: true })
    } catch {
      setError("Erreur réseau")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="p-6">
        <h1 className="text-2xl font-bold text-primary">ColocApp</h1>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Bienvenue{user?.name ? `, ${user.name.split(" ")[0]}` : ""} !
            </h2>
            <p className="mt-2 text-gray-600">
              Créez ou rejoignez une colocation pour commencer
            </p>
          </div>

          {createdCode ? (
            <Card>
              <CardContent className="pt-6 text-center space-y-4">
                <p className="text-green-600 font-medium">Colocation créée !</p>
                <p className="text-sm text-gray-600">Partagez ce code avec vos colocataires :</p>
                <p className="text-2xl font-mono font-bold text-primary tracking-wider">
                  {createdCode}
                </p>
                <Button className="w-full" onClick={() => navigate("/dashboard", { replace: true })}>
                  Accéder au dashboard
                </Button>
              </CardContent>
            </Card>
          ) : !mode ? (
            <div className="space-y-4">
              <Card className="cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all" onClick={() => setMode("create")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-primary" />
                    Créer une colocation
                  </CardTitle>
                  <CardDescription>Démarrez une nouvelle colocation et invitez vos colocataires</CardDescription>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all" onClick={() => setMode("join")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Rejoindre une colocation
                  </CardTitle>
                  <CardDescription>Entrez le code d'invitation reçu de vos colocataires</CardDescription>
                </CardHeader>
              </Card>
            </div>
          ) : mode === "create" ? (
            <Card>
              <CardHeader>
                <CardTitle>Créer une colocation</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="coloc-name" className="text-sm font-medium text-gray-700">
                      Nom de la colocation
                    </label>
                    <Input
                      id="coloc-name"
                      placeholder="Ex: Colocation rue de la Paix"
                      value={colocName}
                      onChange={(e) => setColocName(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => { setMode(null); setError(null) }}>
                      Retour
                    </Button>
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? "Création..." : "Créer"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Rejoindre une colocation</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleJoin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="join-code" className="text-sm font-medium text-gray-700">
                      Code d'invitation
                    </label>
                    <Input
                      id="join-code"
                      placeholder="COLO-XXXX-X"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => { setMode(null); setError(null) }}>
                      Retour
                    </Button>
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? "Connexion..." : "Rejoindre"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <footer className="p-6 text-center text-sm text-gray-500">
        © 2026 ColocApp. Tous droits réservés.
      </footer>
    </div>
  )
}
