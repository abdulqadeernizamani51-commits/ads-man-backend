// server.js
// The full backend: create invites, verify invite tokens, and let invited
// users create their account ("Get Started" flow).

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const db = require('./db');
const { sendInviteEmail } = require('./mailer');

const app = express();
app.use(cors()); // allows your Surge.sh frontend to call this backend
app.use(express.json());

const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://ads-man.surge.sh';
const INVITE_EXPIRY_HOURS = Number(process.env.INVITE_EXPIRY_HOURS || 48);

// --- Simple admin protection for the "send invite" endpoint ---
function requireAdminKey(req, res, next) {
  const key = req.header('x-admin-key');
  if (!key || key !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// --- 1) Create + send an invite ---
// POST /api/invite   { "email": "someone@example.com" }
// Header: x-admin-key: <ADMIN_API_KEY>
app.post('/api/invite', requireAdminKey, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const token = uuidv4().replace(/-/g, '') + uuidv4().replace(/-/g, '');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + INVITE_EXPIRY_HOURS * 60 * 60 * 1000);

    db.createInvite({
      id: uuidv4(),
      email,
      token,
      status: 'pending',
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      accepted_at: null,
    });

    const acceptUrl = `${FRONTEND_URL}/accept.html?token=${token}`;
    await sendInviteEmail(email, acceptUrl);

    res.json({ success: true, message: `Invite sent to ${email}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send invite' });
  }
});

// --- 2) Verify a token (called by accept.html when it loads) ---
// GET /api/invite/verify/:token
app.get('/api/invite/verify/:token', (req, res) => {
  const { token } = req.params;
  const invite = db.getInviteByToken(token);

  if (!invite) return res.status(404).json({ valid: false, error: 'Invite not found' });
  if (invite.status === 'accepted') return res.status(400).json({ valid: false, error: 'Invite already used' });
  if (new Date(invite.expires_at) < new Date()) return res.status(400).json({ valid: false, error: 'Invite expired' });

  res.json({ valid: true, email: invite.email });
});

// --- 3) Accept invite: create the account ---
// POST /api/invite/accept   { "token": "...", "name": "...", "password": "..." }
app.post('/api/invite/accept', async (req, res) => {
  try {
    const { token, name, password } = req.body;
    if (!token || !password || password.length < 8) {
      return res.status(400).json({ error: 'Token and an 8+ character password are required' });
    }

    const invite = db.getInviteByToken(token);
    if (!invite) return res.status(404).json({ error: 'Invite not found' });
    if (invite.status === 'accepted') return res.status(400).json({ error: 'Invite already used' });
    if (new Date(invite.expires_at) < new Date()) return res.status(400).json({ error: 'Invite expired' });

    const existingUser = db.getUserByEmail(invite.email);
    if (existingUser) return res.status(400).json({ error: 'Account already exists for this email' });

    const passwordHash = await bcrypt.hash(password, 10);
    db.createUser({
      id: uuidv4(),
      email: invite.email,
      password_hash: passwordHash,
      name: name || '',
      created_at: new Date().toISOString(),
    });

    db.updateInviteStatus(token, 'accepted', new Date().toISOString());

    res.json({ success: true, message: 'Account created', email: invite.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to accept invite' });
  }
});

// --- Health check ---
app.get('/', (req, res) => res.send('ads-man invite backend is running'));

app.listen(PORT, () => {
  console.log(`ads-man invite backend running on port ${PORT}`);
});
