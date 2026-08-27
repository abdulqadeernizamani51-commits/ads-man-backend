// db.js
// Simple JSON-file based storage (no compilation/build tools needed - unlike
// better-sqlite3, this works instantly on any Windows/Mac laptop).
// Stores everything in a file called ads-man-data.json in this same folder.

const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'ads-man-data.json');

function loadData() {
  if (!fs.existsSync(DB_FILE)) {
    return { invites: [], users: [] };
  }
  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    return { invites: [], users: [] };
  }
}

function saveData(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// --- Invites ---
function createInvite(invite) {
  const data = loadData();
  data.invites.push(invite);
  saveData(data);
}

function getInviteByToken(token) {
  const data = loadData();
  return data.invites.find((i) => i.token === token);
}

function updateInviteStatus(token, status, acceptedAt) {
  const data = loadData();
  const invite = data.invites.find((i) => i.token === token);
  if (invite) {
    invite.status = status;
    if (acceptedAt) invite.accepted_at = acceptedAt;
  }
  saveData(data);
}

// --- Users ---
function createUser(user) {
  const data = loadData();
  data.users.push(user);
  saveData(data);
}

function getUserByEmail(email) {
  const data = loadData();
  return data.users.find((u) => u.email === email);
}

module.exports = {
  createInvite,
  getInviteByToken,
  updateInviteStatus,
  createUser,
  getUserByEmail,
};
