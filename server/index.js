const express = require('express');
const cors = require('cors');
const { colocation, users, tasks, finances, subscriptions, recipes, shoppingList } = require('./data/mockData');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}));
app.use(express.json());

let nextId = 100;
const genId = (prefix) => `${prefix}-${nextId++}`;

const stripPassword = ({ password, ...rest }) => rest;

// Health check
app.get('/api', (req, res) => {
  res.json({ message: 'ColocApp API is running' });
});

// Auth
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }
  res.json({ data: { user: stripPassword(user), colocation } });
});

// Users
app.get('/api/users', (req, res) => {
  res.json({ data: users.map(stripPassword) });
});

app.put('/api/users/:id', (req, res) => {
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  Object.assign(users[idx], req.body);
  res.json({ data: users[idx] });
});

// Colocation
app.get('/api/colocation', (req, res) => {
  res.json({ data: colocation });
});

// Tasks CRUD
app.get('/api/tasks', (req, res) => {
  res.json({ data: tasks });
});

app.post('/api/tasks', (req, res) => {
  const task = { id: genId('task'), colocationId: 'coloc-1', ...req.body };
  tasks.push(task);
  res.status(201).json({ data: task });
});

app.put('/api/tasks/:id', (req, res) => {
  const idx = tasks.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Tâche non trouvée' });
  Object.assign(tasks[idx], req.body);
  res.json({ data: tasks[idx] });
});

app.delete('/api/tasks/:id', (req, res) => {
  const idx = tasks.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Tâche non trouvée' });
  const [removed] = tasks.splice(idx, 1);
  res.json({ data: removed });
});

// Finances CRUD
app.get('/api/finances', (req, res) => {
  res.json({ data: finances });
});

app.post('/api/finances', (req, res) => {
  const finance = { id: genId('fin'), colocationId: 'coloc-1', ...req.body };
  finances.push(finance);
  res.status(201).json({ data: finance });
});

app.put('/api/finances/:id', (req, res) => {
  const idx = finances.findIndex((f) => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Dépense non trouvée' });
  Object.assign(finances[idx], req.body);
  res.json({ data: finances[idx] });
});

app.delete('/api/finances/:id', (req, res) => {
  const idx = finances.findIndex((f) => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Dépense non trouvée' });
  const [removed] = finances.splice(idx, 1);
  res.json({ data: removed });
});

// Recipes CRUD
app.get('/api/recipes', (req, res) => {
  res.json({ data: recipes });
});

app.post('/api/recipes', (req, res) => {
  const recipe = { id: genId('recipe'), colocationId: 'coloc-1', ...req.body };
  recipes.push(recipe);
  res.status(201).json({ data: recipe });
});

app.put('/api/recipes/:id', (req, res) => {
  const idx = recipes.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Recette non trouvée' });
  Object.assign(recipes[idx], req.body);
  res.json({ data: recipes[idx] });
});

app.delete('/api/recipes/:id', (req, res) => {
  const idx = recipes.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Recette non trouvée' });
  const [removed] = recipes.splice(idx, 1);
  res.json({ data: removed });
});

// Shopping List CRUD
app.get('/api/shopping-list', (req, res) => {
  res.json({ data: shoppingList });
});

app.post('/api/shopping-list', (req, res) => {
  const item = { id: genId('shop'), colocationId: 'coloc-1', ...req.body };
  shoppingList.push(item);
  res.status(201).json({ data: item });
});

app.put('/api/shopping-list/:id', (req, res) => {
  const idx = shoppingList.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Article non trouvé' });
  Object.assign(shoppingList[idx], req.body);
  res.json({ data: shoppingList[idx] });
});

app.delete('/api/shopping-list/:id', (req, res) => {
  const idx = shoppingList.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Article non trouvé' });
  const [removed] = shoppingList.splice(idx, 1);
  res.json({ data: removed });
});

// Subscriptions CRUD
app.get('/api/subscriptions', (req, res) => {
  res.json({ data: subscriptions });
});

app.post('/api/subscriptions', (req, res) => {
  const sub = { id: genId('sub'), colocationId: 'coloc-1', ...req.body };
  subscriptions.push(sub);
  res.status(201).json({ data: sub });
});

app.put('/api/subscriptions/:id', (req, res) => {
  const idx = subscriptions.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Abonnement non trouvé' });
  Object.assign(subscriptions[idx], req.body);
  res.json({ data: subscriptions[idx] });
});

app.delete('/api/subscriptions/:id', (req, res) => {
  const idx = subscriptions.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Abonnement non trouvé' });
  const [removed] = subscriptions.splice(idx, 1);
  res.json({ data: removed });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
