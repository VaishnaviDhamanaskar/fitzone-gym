import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const options = { timestamps: true };
const userSchema = new Schema({ name: { type: String, required: true, trim: true, maxlength: 80 }, email: { type: String, required: true, unique: true, lowercase: true, trim: true }, phone: { type: String, trim: true, maxlength: 24 }, password: { type: String, required: true, select: false }, role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' } }, options);
const memberSchema = new Schema({ user: { type: Schema.Types.ObjectId, ref: 'User' }, name: { type: String, required: true, trim: true }, email: { type: String, required: true, lowercase: true, trim: true }, phone: String, plan: String, joinDate: Date, expiryDate: Date, status: { type: String, enum: ['Active', 'Expired', 'Pending', 'Cancelled'], default: 'Pending' } }, options);
const trainerSchema = new Schema({ name: { type: String, required: true, trim: true }, email: String, phone: String, specialization: { type: String, required: true }, experience: { type: String, default: '3+ years' }, bio: String, image: String, availability: { type: String, default: 'Available' }, socialLinks: { type: [String], default: [] } }, options);
const programSchema = new Schema({ name: { type: String, required: true, trim: true }, description: { type: String, required: true }, benefits: { type: [String], default: [] }, duration: String, suitableFor: String, image: String, status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' } }, options);
const membershipSchema = new Schema({ member: { type: Schema.Types.ObjectId, ref: 'Member', required: true }, plan: { type: String, enum: ['Basic', 'Standard', 'Premium'], required: true }, startDate: Date, expiryDate: Date, status: { type: String, enum: ['Active', 'Expired', 'Pending', 'Cancelled'], default: 'Pending' } }, options);
const bookingSchema = new Schema({ user: { type: Schema.Types.ObjectId, ref: 'User' }, fullName: { type: String, required: true, trim: true }, phone: { type: String, required: true }, email: { type: String, required: true, lowercase: true, trim: true }, date: { type: Date, required: true }, time: { type: String, required: true }, program: { type: String, required: true }, trainer: String, message: String, status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' } }, options);
const enquirySchema = new Schema({ name: { type: String, required: true, trim: true }, phone: String, email: { type: String, required: true, lowercase: true, trim: true }, program: String, message: String, status: { type: String, enum: ['New Lead', 'Contacted', 'Trial Booked', 'Converted', 'Not Interested'], default: 'New Lead' } }, options);
const timetableSchema = new Schema({ day: { type: String, required: true }, time: { type: String, required: true }, program: { type: String, required: true }, trainer: String, capacity: { type: Number, min: 1, default: 12 } }, options);
const testimonialSchema = new Schema({ name: { type: String, required: true }, review: { type: String, required: true }, rating: { type: Number, min: 1, max: 5, default: 5 }, image: String, published: { type: Boolean, default: false } }, options);
const contactSchema = new Schema({ name: { type: String, required: true, trim: true }, email: { type: String, required: true, lowercase: true, trim: true }, phone: String, subject: { type: String, required: true }, message: { type: String, required: true }, status: { type: String, enum: ['New', 'Read', 'Responded'], default: 'New' } }, options);
const faqSchema = new Schema({ question: { type: String, required: true }, answer: { type: String, required: true }, published: { type: Boolean, default: true }, order: { type: Number, default: 0 } }, options);

export const User = model('User', userSchema);
export const Member = model('Member', memberSchema);
export const Trainer = model('Trainer', trainerSchema);
export const Program = model('Program', programSchema);
export const Membership = model('Membership', membershipSchema);
export const Booking = model('Booking', bookingSchema);
export const Enquiry = model('Enquiry', enquirySchema);
export const Timetable = model('Timetable', timetableSchema);
export const Testimonial = model('Testimonial', testimonialSchema);
export const ContactMessage = model('ContactMessage', contactSchema);
export const FAQ = model('FAQ', faqSchema);
