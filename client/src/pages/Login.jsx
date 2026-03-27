import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Users } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import JoinConfirmDialog from "@/components/JoinConfirmDialog"

export default function Login() {
  const navigate = useNavigate()
  const { login, user, colocation, loading: authLoading, updateColocation } = useAuth()

  useEffect(() => {
    if (!authLoading && user) {
      navigate(colocation ? "/dashboard" : "/onboarding", { replace: true })
    }
  }, [user, colocation, authLoading, navigate])

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [joinCode, setJoinCode] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  function validate() {
    const errs = {}
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Email invalide"
    }
    if (!password) {
      errs.password = "Mot de passe requis"
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleLogin(e) {
    e.preventDefault()
    setError(null)
    if (!validate()) return

    if (loading) return
    setLoading(true)
    try {
      const result = await login(email.trim().toLowerCase(), password)
      if (result.success) {
        navigate(result.needsOnboarding ? "/onboarding" : "/dashboard", { replace: true })
      } else {
        setError(result.error)
      }
    } catch {
      setError("Erreur réseau, réessayez")
    } finally {
      setLoading(false)
    }
  }

  const [joinError, setJoinError] = useState(null)
  const [previewData, setPreviewData] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  async function handleJoin(e) {
    e.preventDefault()
    setJoinError(null)
    if (!joinCode.trim()) {
      setJoinError("Veuillez entrer un code d'invitation")
      return
    }
    if (!user) {
      setJoinError("Connectez-vous d'abord pour rejoindre une colocation")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/colocation/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationCode: joinCode.trim().toUpperCase() }),
      })
      const json = await res.json()
      if (!res.ok) {
        setJoinError(json.error || "Code invalide")
        return
      }
      setPreviewData(json.data)
      setDialogOpen(true)
    } catch {
      setJoinError("Erreur réseau, réessayez")
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirmJoin() {
    setLoading(true)
    try {
      const res = await fetch("/api/colocation/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationCode: joinCode.trim().toUpperCase(), userId: user?.id }),
      })
      const json = await res.json()
      if (!res.ok) {
        setDialogOpen(false)
        setJoinError(json.error || "Erreur lors de la jonction")
        return
      }
      setDialogOpen(false)
      if (updateColocation) updateColocation(json.data)
      navigate("/dashboard", { replace: true })
    } catch {
      setDialogOpen(false)
      setJoinError("Erreur réseau, réessayez")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="p-6">
        <h1 className="text-2xl font-bold text-primary">LaBonneColoc</h1>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
            <p className="mt-2 text-gray-600">
              Connectez-vous pour accéder à votre colocation
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-required="true"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-invalid={!!errors.password}
                      aria-required="true"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-500 text-center" role="alert">
                    {error}
                  </p>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Connexion..." : "SE CONNECTER"}
                </Button>

                <div className="flex items-center justify-between text-sm">
                  <Link to="/forgot-password" className="text-primary hover:underline">
                    Mot de passe oublié ?
                  </Link>
                  <Link to="/register" className="text-primary hover:underline">
                    Créer un compte
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5" />
                Rejoindre une colocation existante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoin} className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Code : COLO-XXXX-X"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                  />
                  <Button type="submit" variant="outline" disabled={loading}>
                    Vérifier
                  </Button>
                </div>
                {joinError && (
                  <p className="text-sm text-amber-600">{joinError}</p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <JoinConfirmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        colocationData={previewData}
        onConfirm={handleConfirmJoin}
        loading={loading}
      />

      <footer className="p-6 text-center text-sm text-gray-500">
        © 2026 LaBonneColoc. Tous droits réservés.
      </footer>
    </div>
  )
}
