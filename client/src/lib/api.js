async function request(url, options = {}) {
  const headers = options.body ? { "Content-Type": "application/json" } : {}
  const res = await fetch(url, { ...options, headers: { ...headers, ...options.headers } })
  if (!res.ok) {
    const text = await res.text()
    let message = "Request failed"
    try {
      message = JSON.parse(text).error || message
    } catch (err) {
      console.error("Failed to parse error response", err)
    }
    throw new Error(message)
  }
  const json = await res.json()
  return json.data
}

export function loginUser() {
  return request("/api/auth/login", { method: "POST" })
}

export function fetchUsers() {
  return request("/api/users")
}

export function updateUser(id, data) {
  return request(`/api/users/${id}`, { method: "PUT", body: JSON.stringify(data) })
}

export function fetchColocation() {
  return request("/api/colocation")
}

export function fetchTasks() {
  return request("/api/tasks")
}

export function createTask(data) {
  return request("/api/tasks", { method: "POST", body: JSON.stringify(data) })
}

export function updateTask(id, data) {
  return request(`/api/tasks/${id}`, { method: "PUT", body: JSON.stringify(data) })
}

export function deleteTask(id) {
  return request(`/api/tasks/${id}`, { method: "DELETE" })
}

export function fetchFinances() {
  return request("/api/finances")
}

export function createFinance(data) {
  return request("/api/finances", { method: "POST", body: JSON.stringify(data) })
}

export function updateFinance(id, data) {
  return request(`/api/finances/${id}`, { method: "PUT", body: JSON.stringify(data) })
}

export function deleteFinance(id) {
  return request(`/api/finances/${id}`, { method: "DELETE" })
}

export function fetchRecipes() {
  return request("/api/recipes")
}

export function createRecipe(data) {
  return request("/api/recipes", { method: "POST", body: JSON.stringify(data) })
}

export function updateRecipe(id, data) {
  return request(`/api/recipes/${id}`, { method: "PUT", body: JSON.stringify(data) })
}

export function deleteRecipe(id) {
  return request(`/api/recipes/${id}`, { method: "DELETE" })
}

export function fetchShoppingList() {
  return request("/api/shopping-list")
}

export function createShoppingItem(data) {
  return request("/api/shopping-list", { method: "POST", body: JSON.stringify(data) })
}

export function updateShoppingItem(id, data) {
  return request(`/api/shopping-list/${id}`, { method: "PUT", body: JSON.stringify(data) })
}

export function deleteShoppingItem(id) {
  return request(`/api/shopping-list/${id}`, { method: "DELETE" })
}

export function fetchSubscriptions() {
  return request("/api/subscriptions")
}

export function createSubscription(data) {
  return request("/api/subscriptions", { method: "POST", body: JSON.stringify(data) })
}

export function updateSubscription(id, data) {
  return request(`/api/subscriptions/${id}`, { method: "PUT", body: JSON.stringify(data) })
}

export function deleteSubscription(id) {
  return request(`/api/subscriptions/${id}`, { method: "DELETE" })
}
