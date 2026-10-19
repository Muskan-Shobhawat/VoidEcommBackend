import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import { HttpError } from '../middleware/error.js';

// In-memory accounts and sessions for the demo; both reset when the server restarts.
const users = new Map(); // email -> user (with password hash)
const sessions = new Map(); // token -> user id

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const hashPassword = (password, salt = randomBytes(16).toString('hex')) => ({
  salt,
  hash: scryptSync(password, salt, 64).toString('hex'),
});

const publicUser = ({ id, name, email, createdAt }) => ({ id, name, email, createdAt });

function startSession(user) {
  const token = randomBytes(32).toString('hex');
  sessions.set(token, user.id);
  return { token, user: publicUser(user) };
}

export function createUser({ name, email, password }) {
  const key = String(email || '').trim().toLowerCase();
  if (!String(name || '').trim()) throw new HttpError(400, 'Name is required');
  if (!EMAIL_RE.test(key)) throw new HttpError(400, 'Valid email required');
  if (String(password || '').length < 6) throw new HttpError(400, 'Password must be at least 6 characters');
  if (users.has(key)) throw new HttpError(409, 'An account with this email already exists');
  const user = { id: randomUUID(), name: name.trim(), email: key, createdAt: new Date().toISOString(), ...hashPassword(password) };
  users.set(key, user);
  return user;
}

export function userForToken(token) {
  const id = sessions.get(token);
  if (!id) return undefined;
  const user = [...users.values()].find((u) => u.id === id);
  return user && publicUser(user);
}

export function signup(req, res) {
  const user = createUser(req.body || {});
  res.status(201).json(startSession(user));
}

export function login(req, res) {
  const { email, password } = req.body || {};
  const user = users.get(String(email || '').trim().toLowerCase());
  const ok = user && timingSafeEqual(Buffer.from(hashPassword(String(password || ''), user.salt).hash, 'hex'), Buffer.from(user.hash, 'hex'));
  if (!ok) throw new HttpError(401, 'Incorrect email or password');
  res.json(startSession(user));
}

export function me(req, res) {
  res.json({ user: req.user });
}

export function logout(req, res) {
  sessions.delete(req.token);
  res.json({ ok: true });
}
