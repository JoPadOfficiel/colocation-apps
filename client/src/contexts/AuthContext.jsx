import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [colocation, setColocation] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = sessionStorage.getItem("colocapp_user")
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setUser(data.user)
        setColocation(data.colocation)
      } catch {}
    }
    setLoading(false)
  }, [])

  async function login(email, password) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    let json
    try {
      json = await res.json()
    } catch {
      return { success: false, error: "Réponse serveur invalide" }
    }
    if (!res.ok) {
      return { success: false, error: json.error || "Erreur de connexion" }
    }
    if (!json.data?.user) {
      return { success: false, error: "Données utilisateur manquantes" }
    }
    setUser(json.data.user)
    setColocation(json.data.colocation)
    sessionStorage.setItem("colocapp_user", JSON.stringify(json.data))
    return { success: true }
  }

  async function register(name, email, password) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
    let json
    try {
      json = await res.json()
    } catch {
      return { success: false, error: "Réponse serveur invalide" }
    }
    if (!res.ok) {
      return { success: false, error: json.error || "Erreur d'inscription" }
    }
    if (!json.data?.user) {
      return { success: false, error: "Données utilisateur manquantes" }
    }
    setUser(json.data.user)
    setColocation(json.data.colocation || null)
    sessionStorage.setItem("colocapp_user", JSON.stringify(json.data))
    return { success: true }
  }

  function updateColocation(coloc) {
    setColocation(coloc)
    const saved = sessionStorage.getItem("colocapp_user")
    if (saved) {
      try {
        const data = JSON.parse(saved)
        data.colocation = coloc
        sessionStorage.setItem("colocapp_user", JSON.stringify(data))
      } catch {}
    }
  }

  function logout() {
    setUser(null)
    setColocation(null)
    sessionStorage.removeItem("colocapp_user")
  }

  return (
    <AuthContext.Provider value={{ user, colocation, loading, login, register, updateColocation, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export { AuthProvider, useAuth }
