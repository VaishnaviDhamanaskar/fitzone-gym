import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.slice(7);
    if (!token) return res.status(401).json({ success: false, message: 'Authentication required.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ success: false, message: 'Account no longer exists.' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired session.' });
  }
}
export async function optionalAuthenticate(req, res, next) {
  const token = req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.slice(7);
  if (!token) return next();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.id);
    if (!req.user) return res.status(401).json({ success: false, message: 'Account no longer exists.' });
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired session.' });
  }
}
export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ success: false, message: 'Admin access required.' });
  next();
}
