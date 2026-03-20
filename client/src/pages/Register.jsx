import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function Register() {
  const navigate = useNavigate()
  const { register, user } = useAuth()

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true })
  }, [user, navigate])

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  function validate() {
    const errs = {}
    if (!name.trim()) errs.name = "Nom requis"
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Email invalide"
    if (!password || password.length < 8) errs.password = "Au moins 8 caractères"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleRegister(e) {
    e.preventDefault()
    setError(null)
    if (!validate()) return
    if (loading) return

    setLoading(true)
    try {
      const result = await register(name.trim(), email.trim().toLowerCase(), password)
      if (result.success) {
        navigate("/dashboard", { replace: true })
      } else {
        setError(result.error)
      }
    } catch {
      setError("Erreur réseau, réessayez")
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
            <h2 className="text-3xl font-bold text-gray-900">Créer un compte</h2>
            <p className="mt-2 text-gray-600">
              Rejoignez notre communauté de colocataires
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Nom complet
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Votre nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={!!errors.name}
                    aria-required="true"
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Adresse email
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
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Au moins 8 caractères"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-invalid={!!errors.password}
                      aria-required="true"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={showPassword ? "Masquer" : "Afficher"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>

                {error && (
                  <p className="text-sm text-red-500 text-center" role="alert">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Inscription..." : "S'INSCRIRE"}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">ou</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button type="button" variant="outline" className="w-full" disabled>
                    Continuer avec Google
                  </Button>
                  <Button type="button" variant="outline" className="w-full" disabled>
                    Continuer avec Facebook
                  </Button>
                </div>

                <p className="text-center text-sm text-gray-600">
                  Déjà un compte ?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Se connecter
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="p-6 text-center text-sm text-gray-500">
        © 2026 ColocApp. Tous droits réservés.
      </footer>
    </div>
  )
}
