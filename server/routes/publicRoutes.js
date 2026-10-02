import { Router } from 'express';
import { Booking, ContactMessage, Enquiry, Member, Membership } from '../models/index.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';

const router = Router();
router.post('/booking', optionalAuthenticate, async (req, res, next) => {
  try {
    const { fullName, phone, email, date, time, program, trainer, message } = req.body;
    if (!fullName?.trim() || !/^\S+@\S+\.\S+$/.test(email || '') || !/^\+?[\d\s().-]{7,20}$/.test(phone || '') || !date || !time || !program) return res.status(400).json({ success: false, message: 'Complete all required fields with valid contact details.' });
    if (new Date(date) < new Date(new Date().toDateString())) return res.status(400).json({ success: false, message: 'Choose a date that is today or later.' });
    const booking = await Booking.create({ fullName, phone, email, date, time, program, trainer, message, user: req.user?._id });
    await Enquiry.create({ name: fullName, phone, email, program, message: `Trial request: ${message || 'No additional message'}` });
    res.status(201).json({ success: true, data: booking, message: 'Your free trial request is in. Our team will be in touch.' });
  } catch (error) { next(error); }
});
router.post('/contact', async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(email || '') || !subject?.trim() || !message?.trim()) return res.status(400).json({ success: false, message: 'Please complete your name, valid email, subject and message.' });
    const data = await ContactMessage.create({ name, email, phone, subject, message });
    res.status(201).json({ success: true, data: { id: data._id }, message: 'Thanks for reaching out. We will reply soon.' });
  } catch (error) { next(error); }
});
router.get('/member/overview', authenticate, async (req, res, next) => {
  try {
    const [member, bookings, memberships] = await Promise.all([Member.findOne({ user: req.user._id }).lean(), Booking.find({ user: req.user._id }).sort({ date: -1 }).limit(10).lean(), Membership.find().populate('member').sort({ createdAt: -1 }).limit(100).lean()]);
    const membership = memberships.find((item) => item.member?.user?.toString() === req.user._id.toString());
    res.json({ success: true, data: { member, membership, bookings } });
  } catch (error) { next(error); }
});
export default router;
