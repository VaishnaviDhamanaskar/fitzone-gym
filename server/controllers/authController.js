import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Member } from '../models/index.js';

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role });
const tokenFor = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
export async function register(req, res, next) {
  try {
    const { name, email, phone, password } = req.body;
    if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(email || '') || !/^.{8,}$/.test(password || '')) return res.status(400).json({ success: false, message: 'Enter a name, valid email and password of at least 8 characters.' });
    if (await User.exists({ email: email.toLowerCase() })) return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    const user = await User.create({ name, email, phone, password: await bcrypt.hash(password, 12) });
    await Member.create({ user: user._id, name, email, phone, joinDate: new Date(), status: 'Pending' });
    res.status(201).json({ success: true, data: publicUser(user), token: tokenFor(user) });
  } catch (error) { next(error); }
}
export async function login(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email?.toLowerCase() }).select('+password');
    if (!user || !await bcrypt.compare(req.body.password || '', user.password)) return res.status(401).json({ success: false, message: 'Email or password is incorrect.' });
    res.json({ success: true, data: publicUser(user), token: tokenFor(user) });
  } catch (error) { next(error); }
}
export function me(req, res) { res.json({ success: true, data: publicUser(req.user) }); }
