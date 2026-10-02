import 'dotenv/config';
import { connectDatabase } from '../config/db.js';
import { Booking, Enquiry, FAQ, Member, Membership, Program, Testimonial, Timetable, Trainer } from '../models/index.js';

await connectDatabase();
const trainers = [
  { name: 'Jordan Reed', email: 'jordan@fitzone.demo', specialization: 'Strength & conditioning', experience: '8 years', bio: 'Patient, detail-focused strength coach who makes room for every starting point.', availability: 'Weekdays' },
  { name: 'Amara Ellis', email: 'amara@fitzone.demo', specialization: 'Mobility & yoga', experience: '6 years', bio: 'Helps members build balance, mobility and a steadier relationship with movement.', availability: 'Weekdays and Saturday' },
  { name: 'Kai Bennett', email: 'kai@fitzone.demo', specialization: 'Functional training', experience: '10 years', bio: 'Brings practical strength and conditioning to upbeat, welcoming group sessions.', availability: 'Tuesday to Saturday' },
];
const programs = [
  { name: 'Strength Training', description: 'Progressive, coach-led resistance training for real-world strength.', benefits: ['Build strength', 'Learn technique', 'Train progressively'], duration: '45–60 minutes', suitableFor: 'All levels', status: 'Active' },
  { name: 'Weight Loss', description: 'Sustainable movement and coaching centered on energy, habits and consistency.', benefits: ['Build routine', 'Improve conditioning', 'Personal guidance'], duration: 'Flexible', suitableFor: 'All levels', status: 'Active' },
  { name: 'Personal Training', description: 'One-to-one coaching with a plan shaped around your goals and experience.', benefits: ['Individual plan', 'Focused feedback', 'Flexible sessions'], duration: '45 minutes', suitableFor: 'All levels', status: 'Active' },
  { name: 'Functional Training', description: 'Practical movement patterns that build confidence for everyday activity.', benefits: ['Move confidently', 'Build coordination', 'Small group options'], duration: '50 minutes', suitableFor: 'All levels', status: 'Active' },
  { name: 'Cross Training', description: 'A varied combination of strength and conditioning in a supportive group.', benefits: ['Variety', 'Cardio and strength', 'Community energy'], duration: '45 minutes', suitableFor: 'Beginner to advanced', status: 'Active' },
  { name: 'Yoga & Flexibility', description: 'An accessible practice for mobility, balance and mindful recovery.', benefits: ['Improve mobility', 'Build balance', 'Relax and reset'], duration: '50 minutes', suitableFor: 'All levels', status: 'Active' },
];
const faqs = [
  ['Do you offer a free trial?', 'Yes. Request a complimentary introductory session through our booking form.'],
  ['What membership plans are available?', 'Choose from Basic, Standard and Premium options. Contact the studio for details.'],
  ['Do you provide personal training?', 'Yes. Our coaches offer individual sessions and goal-led training.'],
  ['Is the gym beginner-friendly?', 'Absolutely. Coaches can help you get comfortable and progress at your own pace.'],
  ['What are gym timings?', 'Monday to Friday 5:30am–10pm; Saturday and Sunday 7am–7pm.'],
  ['Can I book a trainer?', 'Yes. Use the free trial form and mention your preferred coach.'],
  ['How can I renew membership?', 'Contact the studio team or visit the front desk for renewal support.'],
];
for (const trainer of trainers) await Trainer.findOneAndUpdate({ email: trainer.email }, { $setOnInsert: trainer }, { upsert: true, new: true });
for (const program of programs) await Program.findOneAndUpdate({ name: program.name }, { $setOnInsert: program }, { upsert: true, new: true });
for (const [index, [question, answer]] of faqs.entries()) await FAQ.findOneAndUpdate({ question }, { $setOnInsert: { question, answer, published: true, order: index } }, { upsert: true });
const timetable = [
  ['Monday','6:15 AM','Strength Training','Jordan Reed',12], ['Monday','12:00 PM','Yoga & Flexibility','Amara Ellis',10], ['Tuesday','6:00 PM','Functional Training','Kai Bennett',14], ['Wednesday','6:15 AM','Strength Training','Jordan Reed',12], ['Wednesday','6:00 PM','Yoga & Flexibility','Amara Ellis',10], ['Thursday','12:00 PM','Cross Training','Kai Bennett',12], ['Friday','5:30 PM','Strength Training','Jordan Reed',12], ['Saturday','9:00 AM','Yoga & Flexibility','Amara Ellis',14],
];
for (const [day, time, program, trainer, capacity] of timetable) await Timetable.findOneAndUpdate({ day, time }, { $setOnInsert: { day, time, program, trainer, capacity } }, { upsert: true });
for (const [name, review, rating] of [['Morgan Lane','The coaches meet you where you are. I feel stronger and genuinely look forward to training.',5],['Taylor Avery','Small-group sessions give me accountability without losing that personal coaching feel.',5],['Riley Quinn','Friendly from day one. I finally found a routine that fits my life.',5]]) await Testimonial.findOneAndUpdate({ name }, { $setOnInsert: { name, review, rating, published: true } }, { upsert: true });
const member = await Member.findOneAndUpdate({ email: 'casey.member@example.invalid' }, { $setOnInsert: { name: 'Casey Morgan', email: 'casey.member@example.invalid', phone: '555-010-0101', plan: 'Standard', joinDate: new Date(Date.now() - 45 * 86400000), expiryDate: new Date(Date.now() + 320 * 86400000), status: 'Active' } }, { upsert: true, new: true });
await Membership.findOneAndUpdate({ member: member._id }, { $setOnInsert: { member: member._id, plan: 'Standard', startDate: member.joinDate, expiryDate: member.expiryDate, status: 'Active' } }, { upsert: true });
await Booking.findOneAndUpdate({ email: member.email, program: 'Strength Training' }, { $setOnInsert: { fullName: member.name, email: member.email, phone: member.phone, date: new Date(Date.now() + 3 * 86400000), time: '6:15 AM', program: 'Strength Training', trainer: 'Jordan Reed', status: 'Confirmed' } }, { upsert: true });
await Enquiry.findOneAndUpdate({ email: 'alex.visitor@example.invalid' }, { $setOnInsert: { name: 'Alex Rivera', email: 'alex.visitor@example.invalid', phone: '555-010-0102', program: 'Personal Training', message: 'Interested in meeting a coach.', status: 'New Lead' } }, { upsert: true });
console.log('Fictional FitZone demo records are ready.');
process.exit(0);
