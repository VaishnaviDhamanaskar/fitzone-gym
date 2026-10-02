import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDatabase } from '../config/db.js';
import { User } from '../models/index.js';

if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length < 12) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) in server/.env.');
  process.exit(1);
}
await connectDatabase();
const email = process.env.ADMIN_EMAIL.toLowerCase();
const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
const user = await User.findOneAndUpdate({ email }, { $set: { name: process.env.ADMIN_NAME || 'FitZone Admin', password, role: 'ADMIN' } }, { upsert: true, new: true, runValidators: true });
console.log(`Admin account ready for ${user.email}.`);
process.exit(0);
