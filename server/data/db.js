const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, 'db');
const FILES = {
  colocation: path.join(DB_DIR, 'colocation.json'),
  users: path.join(DB_DIR, 'users.json'),
  tasks: path.join(DB_DIR, 'tasks.json'),
  finances: path.join(DB_DIR, 'finances.json'),
  subscriptions: path.join(DB_DIR, 'subscriptions.json'),
  recipes: path.join(DB_DIR, 'recipes.json'),
  shoppingList: path.join(DB_DIR, 'shopping-list.json'),
};

// Ensure db directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initialize from mockData if files don't exist
const mockData = require('./mockData');

function ensureFile(key) {
  const filePath = FILES[key];
  if (!fs.existsSync(filePath)) {
    const data = Array.isArray(mockData[key]) ? mockData[key] : mockData[key];
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  }
}

function load(key) {
  ensureFile(key);
  try {
    const content = fs.readFileSync(FILES[key], 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error loading ${key}:`, err);
    return Array.isArray(mockData[key]) ? [...mockData[key]] : mockData[key];
  }
}

function save(key, data) {
  try {
    fs.writeFileSync(FILES[key], JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error saving ${key}:`, err);
    return false;
  }
}

module.exports = {
  load,
  save,
  ensureFile,
  FILES,
  DB_DIR,
};
