import { Router } from 'express';
import { Booking, Enquiry, Member, Membership, ContactMessage, Trainer, Program } from '../models/index.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(authenticate, requireAdmin);
router.get('/analytics', async (_req, res, next) => {
  try {
    const [members, active, bookings, newEnquiries, memberships, bookingStatuses, activeMemberships, expiredMemberships, recentMembers, recentBookings, recentEnquiries, trainers, programs, messages] = await Promise.all([
      Member.countDocuments(), Member.countDocuments({ status: 'Active' }), Booking.countDocuments(), Enquiry.countDocuments({ status: 'New Lead' }), Membership.aggregate([{ $group: { _id: '$plan', count: { $sum: 1 } } }]), Booking.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]), Membership.countDocuments({ status: 'Active' }), Membership.countDocuments({ status: 'Expired' }),
      Member.find().sort({ createdAt: -1 }).limit(6).lean(), Booking.find().sort({ createdAt: -1 }).limit(6).lean(), Enquiry.find().sort({ createdAt: -1 }).limit(6).lean(), Trainer.countDocuments(), Program.countDocuments(), ContactMessage.countDocuments({ status: 'New' }),
    ]);
    res.json({ success: true, data: { totals: { members, active, bookings, enquiries: newEnquiries, activeMemberships, expiredMemberships, trainers, programs, messages, expired: await Member.countDocuments({ status: 'Expired' }) }, membershipDistribution: memberships, bookingStatusDistribution: bookingStatuses, recentMembers, recentBookings, recentEnquiries } });
  } catch (error) { next(error); }
});
export default router;
