import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email invalide")
      return
    }
    if (loading) return

    setLoading(true)
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      if (!res.ok) {
        const json = await res.json()
        setError(json.error || "Erreur")
        return
      }
      setSent(true)
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
            <h2 className="text-3xl font-bold text-gray-900">Mot de passe oublié</h2>
            <p className="mt-2 text-gray-600">
              Entrez votre email pour recevoir un lien de réinitialisation
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              {sent ? (
                <div className="text-center space-y-4">
                  <p className="text-green-600 font-medium">
                    Un email de réinitialisation a été envoyé
                  </p>
                  <p className="text-sm text-gray-600">
                    Vérifiez votre boîte de réception (et vos spams).
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setSent(false)}>
                      Réessayer
                    </Button>
                    <Link to="/login" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Retour à la connexion
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
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
                      aria-required="true"
                    />
                    {error && <p className="text-sm text-red-500">{error}</p>}
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Envoi..." : "ENVOYER LE LIEN"}
                  </Button>

                  <p className="text-center text-sm text-gray-600">
                    <Link to="/login" className="text-primary hover:underline">
                      Retour à la connexion
                    </Link>
                  </p>
                </form>
              )}
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
