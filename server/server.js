import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDatabase } from './config/db.js';
import { authenticate, requireAdmin } from './middleware/auth.js';
import { User, Member, Trainer, Program, Membership, Booking, Enquiry, Timetable, Testimonial, ContactMessage, FAQ } from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { createResourceRouter } from './routes/resourceRoutes.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '32kb' }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }), authRoutes);
app.use(['/api/booking', '/api/contact'], rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 }));
app.get('/api/health', (_req, res) => res.json({ success: true, data: { status: 'ok' } }));
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);
const resources = [
  ['users', User, true], ['members', Member, true], ['trainers', Trainer, false], ['programs', Program, false], ['memberships', Membership, true], ['bookings', Booking, true], ['enquiries', Enquiry, true], ['timetable', Timetable, false], ['testimonials', Testimonial, false], ['contact', ContactMessage, true], ['faq', FAQ, false],
];
for (const [path, Model, adminOnly] of resources) {
  const router = createResourceRouter(Model, adminOnly, path);
  app.use(`/api/${path}`, (req, res, next) => {
    if (adminOnly && req.method === 'GET') return authenticate(req, res, () => requireAdmin(req, res, next));
    next();
  }, router);
}
app.use('/api/*', (_req, res) => res.status(404).json({ success: false, message: 'API route not found.' }));
app.use((error, _req, res, _next) => {
  if (error.name === 'ValidationError') return res.status(400).json({ success: false, message: Object.values(error.errors).map((item) => item.message).join(' ') });
  if (error.code === 11000) return res.status(409).json({ success: false, message: 'A record with this value already exists.' });
  if (error.name === 'CastError') return res.status(400).json({ success: false, message: 'Invalid record identifier.' });
  console.error(error);
  res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
});
const port = process.env.PORT || 5000;
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be set to at least 32 characters in server/.env.');
  process.exit(1);
}
connectDatabase().then(() => app.listen(port, () => console.log(`FitZone API listening on ${port}`))).catch((error) => { console.error('Database connection failed:', error.message); process.exit(1); });
