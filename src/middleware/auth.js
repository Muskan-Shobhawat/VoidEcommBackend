import { HttpError } from './error.js';
import { userForToken } from '../controllers/authController.js';

/** Reads an optional `Authorization: Bearer <token>` header and sets req.user (or leaves it undefined). */
export function attachUser(req, _res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme === 'Bearer' && token) {
    req.user = userForToken(token);
    req.token = token;
  }
  next();
}

export function requireUser(req, _res, next) {
  if (!req.user) throw new HttpError(401, 'Please sign in');
  next();
}
