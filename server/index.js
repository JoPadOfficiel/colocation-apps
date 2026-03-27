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
let colocations = db.load('colocation'); // always an array
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
      // members can be a string ID or an object {userId, role}
      const id = typeof memberId === 'object' ? memberId.userId : memberId;
      const memberUser = users.find(u => u.id === id);
      return memberUser ? stripPassword(memberUser) : { id, name: 'Inconnu', email: '' };
    })
  };
};

// Helper: generate unique invitation code
function genInvitationCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  do {
    const body = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const suffix = chars[Math.floor(Math.random() * chars.length)];
    code = `COLO-${body}-${suffix}`;
  } while (colocations.some(c => c.invitationCode === code));
  return code;
}

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
  const userColoc = user.colocationId
    ? (colocations.find(c => c.id === user.colocationId) || null)
    : null;
  res.json({ data: { user: stripPassword(user), colocation: userColoc ? enrichColocation(userColoc) : null } });
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
    colocationId: null,
    dietaryConstraints: [],
  };
  users.push(newUser);
  db.save('users', users);
  res.status(201).json({ data: { user: stripPassword(newUser), colocation: null } });
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
  const user = users[idx];
  const { id, password, role, oldPassword, newPassword, ...allowed } = req.body;
  if (newPassword) {
    if (!oldPassword) return res.status(400).json({ error: 'Ancien mot de passe requis' });
    if (user.password !== oldPassword) return res.status(403).json({ error: 'Ancien mot de passe incorrect' });
    if (newPassword.length < 8) return res.status(400).json({ error: 'Le nouveau mot de passe doit faire au moins 8 caractères' });
    user.password = newPassword;
  }
  Object.assign(users[idx], allowed);
  db.save('users', users);
  res.json({ data: stripPassword(users[idx]) });
});

app.delete('/api/users/:id', (req, res) => {
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  const user = users[idx];
  // Remove user from their colocation's members array
  if (user.colocationId) {
    const coloc = colocations.find(c => c.id === user.colocationId);
    if (coloc) {
      coloc.members = coloc.members.filter(m => {
        const id = typeof m === 'object' ? m.userId : m;
        return id !== user.id;
      });
      db.save('colocation', colocations);
    }
  }
  users.splice(idx, 1);
  db.save('users', users);
  res.json({ data: { message: 'Compte supprimé' } });
});

// Colocation
app.get('/api/colocation', (req, res) => {
  res.json({ data: colocations.map(enrichColocation) });
});

app.get('/api/colocation/:id', (req, res) => {
  const coloc = colocations.find(c => c.id === req.params.id);
  if (!coloc) return res.status(404).json({ error: 'Colocation non trouvée' });
  res.json({ data: enrichColocation(coloc) });
});

app.post('/api/colocation/preview', (req, res) => {
  const { invitationCode } = req.body || {};
  if (!invitationCode) return res.status(400).json({ error: 'invitationCode requis' });
  const list = colocations;
  const coloc = list.find(c => c.invitationCode === invitationCode);
  if (!coloc) return res.status(404).json({ error: "Code d'invitation invalide" });
  const members = coloc.members.map(memberId => {
    const user = users.find(u => u.id === memberId);
    return { name: user?.name || 'Inconnu', role: user?.role || 'member' };
  });
  res.json({ data: { id: coloc.id, name: coloc.name, memberCount: members.length, members } });
});

app.put('/api/colocation/:id', (req, res) => {
  const coloc = colocations.find(c => c.id === req.params.id);
  if (!coloc) {
    return res.status(404).json({ error: 'Colocation non trouvée' });
  }
  const { totalFund, name, paidBy } = req.body;
  if (totalFund !== undefined) {
    if (totalFund < 0) return res.status(400).json({ error: 'Le montant doit être positif' });
    coloc.totalFund = (coloc.totalFund || 0) + totalFund;
    const contribution = {
      id: genId(finances, 'fin'),
      colocationId: coloc.id,
      type: 'contribution',
      title: 'Contribution à la cagnotte',
      amount: totalFund,
      date: new Date().toISOString().split('T')[0],
      paidBy: paidBy || null,
      shared: false,
    };
    finances.push(contribution);
    db.save('finances', finances);
  }
  if (name) coloc.name = name;
  db.save('colocation', colocations);
  res.json({ data: enrichColocation(coloc) });
});

app.post('/api/colocation/join', (req, res) => {
  const { code, invitationCode, userId } = req.body || {};
  const resolvedCode = code || invitationCode;
  if (!resolvedCode) return res.status(400).json({ error: 'Code requis' });
  const coloc = colocations.find(c => c.invitationCode.toUpperCase() === resolvedCode.toUpperCase());
  if (!coloc) {
    return res.status(404).json({ error: 'Code d\'invitation invalide' });
  }
  if (userId) {
    const user = users.find((u) => u.id === userId);
    if (user) {
      const alreadyMember = coloc.members.some(m => {
        const id = typeof m === 'object' ? m.userId : m;
        return id === userId;
      });
      if (!alreadyMember) {
        coloc.members.push(userId);
        db.save('colocation', colocations);
      }
      user.colocationId = coloc.id;
      db.save('users', users);
    }
  }
  res.json({ data: enrichColocation(coloc) });
});

app.post('/api/colocation', (req, res) => {
  const { name, creatorId } = req.body || {};
  if (!name || !creatorId) return res.status(400).json({ error: 'name et creatorId requis' });
  const newColoc = {
    id: genId(colocations, 'coloc'),
    name,
    invitationCode: genInvitationCode(),
    totalFund: 0,
    createdAt: new Date().toISOString(),
    members: [{ userId: creatorId, role: 'admin' }],
  };
  colocations.push(newColoc);
  db.save('colocation', colocations);
  const creator = users.find(u => u.id === creatorId);
  if (creator) {
    creator.colocationId = newColoc.id;
    db.save('users', users);
  }
  res.status(201).json({ data: enrichColocation(newColoc) });
});

app.delete('/api/colocation/:id', (req, res) => {
  const colocIdx = colocations.findIndex(c => c.id === req.params.id);
  if (colocIdx === -1) return res.status(404).json({ error: 'Colocation non trouvée' });
  const coloc = colocations[colocIdx];
  const { confirmName } = req.body || {};
  if (!confirmName || confirmName !== coloc.name) {
    return res.status(400).json({ error: 'Le nom de confirmation ne correspond pas' });
  }
  const colocId = coloc.id;
  // Cascade delete: remove all related data
  tasks = tasks.filter(t => t.colocationId !== colocId);
  finances = finances.filter(f => f.colocationId !== colocId);
  subscriptions = subscriptions.filter(s => s.colocationId !== colocId);
  recipes = recipes.filter(r => r.colocationId !== colocId);
  shoppingList = shoppingList.filter(s => s.colocationId !== colocId);
  db.save('tasks', tasks);
  db.save('finances', finances);
  db.save('subscriptions', subscriptions);
  db.save('recipes', recipes);
  db.save('shoppingList', shoppingList);
  // Reset colocationId to null for all member users
  users = users.map(u => u.colocationId === colocId ? { ...u, colocationId: null } : u);
  db.save('users', users);
  // Remove the colocation
  colocations.splice(colocIdx, 1);
  db.save('colocation', colocations);
  res.json({ data: { message: 'Colocation supprimée' } });
});

// Tasks CRUD
app.get('/api/tasks', (req, res) => {
  const { colocationId } = req.query;
  if (!colocationId) return res.status(400).json({ error: 'colocationId requis' });
  const items = tasks.filter(item => item.colocationId === colocationId);
  res.json({ data: items });
});

app.post('/api/tasks', (req, res) => {
  const task = { id: genId(tasks, 'task'), ...req.body };
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
  const { colocationId } = req.query;
  if (!colocationId) return res.status(400).json({ error: 'colocationId requis' });
  const items = finances.filter(item => item.colocationId === colocationId);
  res.json({ data: items });
});

app.post('/api/finances', (req, res) => {
  const shared = req.body.shared !== undefined ? req.body.shared : true;
  const finance = { id: genId(finances, 'fin'), shared, ...req.body };
  finances.push(finance);
  db.save('finances', finances);
  res.status(201).json({ data: finance });
});

app.put('/api/finances/:id', (req, res) => {
  const idx = finances.findIndex((f) => f.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Dépense non trouvée' });
  const updates = { ...req.body };
  if (updates.shared === undefined) {
    // preserve existing shared value if not provided
    updates.shared = finances[idx].shared !== undefined ? finances[idx].shared : true;
  }
  Object.assign(finances[idx], updates);
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
  const { colocationId } = req.query;
  if (!colocationId) return res.status(400).json({ error: 'colocationId requis' });
  const items = recipes.filter(item => item.colocationId === colocationId);
  res.json({ data: items });
});

app.post('/api/recipes', (req, res) => {
  const recipe = { id: genId(recipes, 'recipe'), ...req.body };
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
  const { colocationId } = req.query;
  if (!colocationId) return res.status(400).json({ error: 'colocationId requis' });
  const items = shoppingList.filter(item => item.colocationId === colocationId);
  res.json({ data: items });
});

app.post('/api/shopping-list', (req, res) => {
  const item = { id: genId(shoppingList, 'shop'), ...req.body };
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
  const { colocationId } = req.query;
  if (!colocationId) return res.status(400).json({ error: 'colocationId requis' });
  const items = subscriptions.filter(item => item.colocationId === colocationId);
  res.json({ data: items });
});

app.post('/api/subscriptions', (req, res) => {
  const sub = { id: genId(subscriptions, 'sub'), ...req.body };
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

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
