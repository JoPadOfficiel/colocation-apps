export function apiUrl(path, colocationId) {
  if (!colocationId) return path
  const sep = path.includes('?') ? '&' : '?'
  return `${path}${sep}colocationId=${colocationId}`
}

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

export function loginUser(email, password) {
  return request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) })
}

export function fetchUsers() {
  return request("/api/users")
}

export function updateUser(id, data) {
  return request(`/api/users/${id}`, { method: "PUT", body: JSON.stringify(data) })
}

export function deleteUser(userId) {
  return request(`/api/users/${userId}`, { method: "DELETE" })
}

export function deleteColocation(colocId, confirmName) {
  return request(`/api/colocation/${colocId}`, { method: "DELETE", body: JSON.stringify({ confirmName }) })
}

export function fetchColocation() {
  return request("/api/colocation")
}

export function updateColocation(id, data) {
  return request(`/api/colocation/${id}`, { method: "PUT", body: JSON.stringify(data) })
}

export function fetchColocationById(id) {
  return request(`/api/colocation/${id}`)
}

export function updateMemberRole(colocId, userId, role) {
  return request(`/api/colocation/${colocId}/members/${userId}`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  })
}

export function removeMember(colocId, userId) {
  return request(`/api/colocation/${colocId}/members/${userId}`, {
    method: "DELETE",
  })
}

export function leaveColocation(colocId, userId) {
  return removeMember(colocId, userId)
}

export async function getMembers(colocationData) {
  // If colocationData.members is already enriched (has 'name' property), use it
  if (colocationData?.members?.[0]?.name) {
    return colocationData.members;
  }
  // Otherwise fetch users and map them
  try {
    const allUsers = await fetchUsers();
    const memberIds = colocationData?.members || [];
    return memberIds.map(id => allUsers.find(u => u.id === id) || { id, name: 'Inconnu', email: '' });
  } catch {
    return colocationData?.members?.map(id => ({ id, name: 'Inconnu', email: '' })) || [];
  }
}

export function fetchTasks(colocationId) {
  return request(apiUrl("/api/tasks", colocationId))
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

export function fetchFinances(colocationId) {
  return request(apiUrl("/api/finances", colocationId))
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

export function fetchRecipes(colocationId) {
  return request(apiUrl("/api/recipes", colocationId))
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

export function fetchShoppingList(colocationId) {
  return request(apiUrl("/api/shopping-list", colocationId))
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

export function fetchSubscriptions(colocationId) {
  return request(apiUrl("/api/subscriptions", colocationId))
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
