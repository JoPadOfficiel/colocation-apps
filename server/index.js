const express = require('express');
const cors = require('cors');
const db = require('./data/db');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}));
app.use(express.json());

// Load data from persistent storage
let colocation = db.load('colocation');
let users = db.load('users');
let tasks = db.load('tasks');
let finances = db.load('finances');
let subscriptions = db.load('subscriptions');
let recipes = db.load('recipes');
let shoppingList = db.load('shoppingList');

const getNextId = (items, prefix) => {
  const maxId = items.reduce((max, item) => {
    const match = String(item.id).match(/\d+/);
    return match ? Math.max(max, parseInt(match[0])) : max;
  }, 0);
  return maxId + 1;
};

const genId = (items, prefix) => `${prefix}-${getNextId(items, prefix)}`;

const stripPassword = ({ password, ...rest }) => rest;

// Health check
app.get('/api', (req, res) => {
  res.json({ message: 'ColocApp API is running' });
});

// Helper: Enrich colocation with full member data
const enrichColocation = (coloc) => {
  return {
    ...coloc,
    members: (coloc.members || []).map(memberId => {
      const memberUser = users.find(u => u.id === memberId);
      return memberUser ? stripPassword(memberUser) : { id: memberId, name: 'Inconnu', email: '' };
    })
  };
};

// Auth
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }
  res.json({ data: { user: stripPassword(user), colocation: enrichColocation(colocation) } });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nom, email et mot de passe requis' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Le mot de passe doit faire au moins 8 caractères' });
  }
  const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(409).json({ error: 'Un compte existe déjà avec cet email' });
  }
  const newUser = {
    id: genId(users, 'user'),
    name,
    email: email.toLowerCase(),
    password,
    profilePhoto: '',
    role: 'member',
    colocationId: 'coloc-1',
    dietaryConstraints: [],
  };
  users.push(newUser);
  colocation.members.push(newUser.id);
  db.save('users', users);
  db.save('colocation', colocation);
  res.status(201).json({ data: { user: stripPassword(newUser), colocation: enrichColocation(colocation) } });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: 'Email requis' });
  }
  // Mock: always return success
  res.json({ data: { message: 'Un email de réinitialisation a été envoyé' } });
});

// Users
app.get('/api/users', (req, res) => {
  res.json({ data: users.map(stripPassword) });
});

app.put('/api/users/:id', (req, res) => {
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  const { id, password, role, ...allowed } = req.body;
  Object.assign(users[idx], allowed);
  db.save('users', users);
  res.json({ data: stripPassword(users[idx]) });
});

// Colocation
app.get('/api/colocation', (req, res) => {
  res.json({ data: enrichColocation(colocation) });
});

app.get('/api/colocation/:id', (req, res) => {
  const colocList = Array.isArray(colocation) ? colocation : [colocation];
  const coloc = colocList.find(c => c.id === req.params.id);
  if (!coloc) return res.status(404).json({ error: 'Colocation non trouvée' });
  res.json({ data: enrichColocation(coloc) });
});

app.post('/api/colocation', (req, res) => {
  const { name } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Nom requis' });
  const code = `COLO-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 3).toUpperCase()}`;
  Object.assign(colocation, { name, invitationCode: code });
  db.save('colocation', colocation);
  res.status(201).json({ data: colocation });
});

app.post('/api/colocation/join', (req, res) => {
  const { code, userId } = req.body || {};
  if (!code) return res.status(400).json({ error: 'Code requis' });
  if (colocation.invitationCode.toUpperCase() !== code.toUpperCase()) {
    return res.status(404).json({ error: 'Code d\'invitation invalide' });
  }
  if (userId) {
    const user = users.find((u) => u.id === userId);
    if (user) {
      if (!colocation.members.includes(userId)) {
        colocation.members.push(userId);
        db.save('colocation', colocation);
      }
      user.colocationId = colocation.id;
      db.save('users', users);
    }
  }
  res.json({ data: enrichColocation(colocation) });
});

// Tasks CRUD
app.get('/api/tasks', (req, res) => {
  res.json({ data: tasks });
});

app.post('/api/tasks', (req, res) => {
  const task = { id: genId(tasks, 'task'), colocationId: 'coloc-1', ...req.body };
  tasks.push(task);
  db.save('tasks', tasks);
  res.status(201).json({ data: task });
});

app.put('/api/tasks/:id', (req, res) => {
  const idx = tasks.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Tâche non trouvée' });
  Object.assign(tasks[idx], req.body);
  db.save('tasks', tasks);
  res.json({ data: tasks[idx] });
});

app.delete('/api/tasks/:id', (req, res) => {
  const idx = tasks.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Tâche non trouvée' });
  const [removed] = tasks.splice(idx, 1);
  db.save('tasks', tasks);
  res.json({ data: removed });
});

// Finances CRUD
app.get('/api/finances', (req, res) => {
  res.json({ data: finances });
});

app.post('/api/finances', (req, res) => {
  const finance = { id: genId(finances, 'fin'), colocationId: 'coloc-1', ...req.body };
  finances.push(finance);
  db.save('finances', finances);
  res.status(201).json({ data: finance });
});

app.put('/api/finances/:id', (req, res) => {
  const idx = finances.findIndex((f) => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Dépense non trouvée' });
  Object.assign(finances[idx], req.body);
  db.save('finances', finances);
  res.json({ data: finances[idx] });
});

app.delete('/api/finances/:id', (req, res) => {
  const idx = finances.findIndex((f) => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Dépense non trouvée' });
  const [removed] = finances.splice(idx, 1);
  db.save('finances', finances);
  res.json({ data: removed });
});

// Recipes CRUD
app.get('/api/recipes', (req, res) => {
  res.json({ data: recipes });
});

app.post('/api/recipes', (req, res) => {
  const recipe = { id: genId(recipes, 'recipe'), colocationId: 'coloc-1', ...req.body };
  recipes.push(recipe);
  db.save('recipes', recipes);
  res.status(201).json({ data: recipe });
});

app.put('/api/recipes/:id', (req, res) => {
  const idx = recipes.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Recette non trouvée' });
  Object.assign(recipes[idx], req.body);
  db.save('recipes', recipes);
  res.json({ data: recipes[idx] });
});

app.delete('/api/recipes/:id', (req, res) => {
  const idx = recipes.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Recette non trouvée' });
  const [removed] = recipes.splice(idx, 1);
  db.save('recipes', recipes);
  res.json({ data: removed });
});

// Shopping List CRUD
app.get('/api/shopping-list', (req, res) => {
  res.json({ data: shoppingList });
});

app.post('/api/shopping-list', (req, res) => {
  const item = { id: genId(shoppingList, 'shop'), colocationId: 'coloc-1', ...req.body };
  shoppingList.push(item);
  db.save('shoppingList', shoppingList);
  res.status(201).json({ data: item });
});

app.put('/api/shopping-list/:id', (req, res) => {
  const idx = shoppingList.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Article non trouvé' });
  Object.assign(shoppingList[idx], req.body);
  db.save('shoppingList', shoppingList);
  res.json({ data: shoppingList[idx] });
});

app.delete('/api/shopping-list/:id', (req, res) => {
  const idx = shoppingList.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Article non trouvé' });
  const [removed] = shoppingList.splice(idx, 1);
  db.save('shoppingList', shoppingList);
  res.json({ data: removed });
});

// Subscriptions CRUD
app.get('/api/subscriptions', (req, res) => {
  res.json({ data: subscriptions });
});

app.post('/api/subscriptions', (req, res) => {
  const sub = { id: genId(subscriptions, 'sub'), colocationId: 'coloc-1', ...req.body };
  subscriptions.push(sub);
  db.save('subscriptions', subscriptions);
  res.status(201).json({ data: sub });
});

app.put('/api/subscriptions/:id', (req, res) => {
  const idx = subscriptions.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Abonnement non trouvé' });
  Object.assign(subscriptions[idx], req.body);
  db.save('subscriptions', subscriptions);
  res.json({ data: subscriptions[idx] });
});

app.delete('/api/subscriptions/:id', (req, res) => {
  const idx = subscriptions.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Abonnement non trouvé' });
  const [removed] = subscriptions.splice(idx, 1);
  db.save('subscriptions', subscriptions);
  res.json({ data: removed });
});

// Helper: resolve member ID from string or object format
function resolveMemberId(m) {
  return typeof m === 'object' && m !== null ? m.userId : m;
}

// Helper: count admins in a colocation
function countAdmins(coloc, usersList) {
  return (coloc.members || []).reduce((count, m) => {
    const id = resolveMemberId(m);
    // Role can be on the member object or on the user record
    const memberRole = (typeof m === 'object' && m !== null && m.role) ? m.role : null;
    const userRecord = usersList.find(u => u.id === id);
    const role = memberRole || userRecord?.role || 'member';
    return role === 'admin' ? count + 1 : count;
  }, 0);
}

// PUT /api/colocation/:id/members/:userId — Change member role
app.put('/api/colocation/:id/members/:userId', (req, res) => {
  const { role } = req.body || {};
  if (!role || !['admin', 'member'].includes(role)) {
    return res.status(400).json({ error: 'Le rôle doit être "admin" ou "member"' });
  }

  // Support both single object and array of colocations
  const colocList = Array.isArray(colocation) ? colocation : [colocation];
  const coloc = colocList.find(c => c.id === req.params.id);
  if (!coloc) return res.status(404).json({ error: 'Colocation non trouvée' });

  const { userId } = req.params;
  const memberIdx = (coloc.members || []).findIndex(m => resolveMemberId(m) === userId);
  if (memberIdx === -1) return res.status(404).json({ error: 'Membre non trouvé' });

  // Protect last admin: cannot demote if only one admin remains
  if (role === 'member') {
    const adminCount = countAdmins(coloc, users);
    const m = coloc.members[memberIdx];
    const memberRole = (typeof m === 'object' && m !== null && m.role) ? m.role : null;
    const userRecord = users.find(u => u.id === userId);
    const currentRole = memberRole || userRecord?.role || 'member';
    if (currentRole === 'admin' && adminCount <= 1) {
      return res.status(400).json({ error: 'Impossible de rétrograder le dernier administrateur' });
    }
  }

  // Update role: if member entry is an object, update its role; otherwise update the user record
  const m = coloc.members[memberIdx];
  if (typeof m === 'object' && m !== null) {
    coloc.members[memberIdx] = { ...m, role };
  } else {
    // Role stored on user record
    const userRecord = users.find(u => u.id === userId);
    if (userRecord) {
      userRecord.role = role;
      db.save('users', users);
    }
  }
  db.save('colocation', colocation);
  res.json({ data: enrichColocation(coloc) });
});

// DELETE /api/colocation/:id/members/:userId — Remove member
app.delete('/api/colocation/:id/members/:userId', (req, res) => {
  const colocList = Array.isArray(colocation) ? colocation : [colocation];
  const coloc = colocList.find(c => c.id === req.params.id);
  if (!coloc) return res.status(404).json({ error: 'Colocation non trouvée' });

  const { userId } = req.params;
  const memberIdx = (coloc.members || []).findIndex(m => resolveMemberId(m) === userId);
  if (memberIdx === -1) return res.status(404).json({ error: 'Membre non trouvé' });

  // Protect last admin from being removed
  const m = coloc.members[memberIdx];
  const memberRole = (typeof m === 'object' && m !== null && m.role) ? m.role : null;
  const userRecord = users.find(u => u.id === userId);
  const currentRole = memberRole || userRecord?.role || 'member';
  if (currentRole === 'admin' && countAdmins(coloc, users) <= 1) {
    return res.status(400).json({ error: 'Impossible de supprimer le dernier administrateur' });
  }

  // Remove member from colocation
  coloc.members.splice(memberIdx, 1);
  db.save('colocation', colocation);

  // Clear user's colocationId
  if (userRecord) {
    userRecord.colocationId = null;
    db.save('users', users);
  }

  res.json({ data: enrichColocation(coloc) });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
