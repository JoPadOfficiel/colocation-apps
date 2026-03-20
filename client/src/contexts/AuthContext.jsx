import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [colocation, setColocation] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/auth/login", { method: "POST" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        setUser(json.data.user)
        setColocation(json.data.colocation)
      })
      .catch((err) => {
        console.error("Auth loading failed:", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  function logout() {
    setUser(null)
    setColocation(null)
  }

  return (
    <AuthContext.Provider value={{ user, colocation, loading, logout }}>
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
