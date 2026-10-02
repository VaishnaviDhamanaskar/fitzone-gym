import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { authenticate, optionalAuthenticate, requireAdmin } from '../middleware/auth.js';

const definitions = {
  members: ['Member', true], trainers: ['Trainer', false], programs: ['Program', false], memberships: ['Membership', true], bookings: ['Booking', true], enquiries: ['Enquiry', true], timetable: ['Timetable', false], testimonials: ['Testimonial', false], contact: ['ContactMessage', true], faq: ['FAQ', false],
};
export function createResourceRouter(Model, adminOnly = false, resource = '') {
  const router = Router();
  const sanitizeRecord = (record) => {
    if (Model.modelName !== 'User') return record;
    const safe = record.toObject();
    delete safe.password;
    return safe;
  };
  router.get('/', optionalAuthenticate, async (req, res, next) => {
    try {
      const filter = {};
      if (!req.user || req.user.role !== 'ADMIN') {
        if (resource === 'testimonials') filter.published = true;
        if (resource === 'faq') filter.published = true;
        if (resource === 'programs') filter.status = 'Active';
      }
      let query = Model.find(filter);
      if (resource === 'memberships') query = query.populate({ path: 'member', select: 'name email phone' });
      const data = await query.sort({ createdAt: -1 }).limit(200).lean();
      res.json({ success: true, data });
    } catch (error) { next(error); }
  });
  router.post('/', authenticate, requireAdmin, async (req, res, next) => {
    try {
      const values = { ...req.body };
      if (Model.modelName === 'User') {
        if (typeof values.password !== 'string' || values.password.length < 8) return res.status(400).json({ success: false, message: 'User passwords must contain at least 8 characters.' });
        values.password = await bcrypt.hash(values.password, 12);
      }
      const data = await Model.create(values);
      res.status(201).json({ success: true, data: sanitizeRecord(data) });
    } catch (error) { next(error); }
  });
  router.put('/:id', authenticate, requireAdmin, async (req, res, next) => {
    try {
      const values = { ...req.body };
      if (Model.modelName === 'User' && values.password !== undefined) {
        if (typeof values.password !== 'string' || values.password.length < 8) return res.status(400).json({ success: false, message: 'User passwords must contain at least 8 characters.' });
        values.password = await bcrypt.hash(values.password, 12);
      }
      const data = await Model.findByIdAndUpdate(req.params.id, values, { new: true, runValidators: true, omitUndefined: true });
      if (!data) return res.status(404).json({ success: false, message: 'Record not found.' });
      res.json({ success: true, data: sanitizeRecord(data) });
    } catch (error) { next(error); }
  });
  router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
    try {
      const data = await Model.findByIdAndDelete(req.params.id);
      if (!data) return res.status(404).json({ success: false, message: 'Record not found.' });
      res.json({ success: true, data: { id: req.params.id } });
    } catch (error) { next(error); }
  });
  return router;
}
export { definitions };
