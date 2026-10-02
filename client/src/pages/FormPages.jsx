import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCheck, faClock, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import api, { request } from '../services/api.js';

const programs = ['Strength Training', 'Weight Loss', 'Personal Training', 'Functional Training', 'Cross Training', 'Yoga & Flexibility'];
const trainers = ['Jordan Reed', 'Amara Ellis', 'Kai Bennett'];

function PageHero({ eyebrow, title, text }) {
  return <section className="page-hero"><div className="container"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div></section>;
}

function FormStatus({ state }) {
  if (!state.message) return null;
  return <p className={state.status === 'error' ? 'form-error' : 'form-success'} role="status">{state.message}</p>;
}

export function Contact() {
  const [state, setState] = useState({ status: 'idle', message: '' });
  async function submit(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const payload = Object.fromEntries(new FormData(formElement));
    setState({ status: 'loading', message: '' });
    try {
      const result = await request(api.post('/contact', payload));
      formElement.reset();
      setState({ status: 'success', message: result.message });
    } catch (error) {
      setState({ status: 'error', message: error.response?.data?.message || 'Could not send your message. Please try again.' });
    }
  }
  return <><PageHero eyebrow="Get in touch" title="We would love to meet you." text="Ask a question, tell us what you are looking for or come by for a look around."/><section className="section"><div className="container contact-grid"><div className="contact-details"><span className="eyebrow">Say hello</span><h2>Come as you are.<br/><em>We will take it from there.</em></h2><p><FontAwesomeIcon icon={faLocationDot}/> 48 Foundry Lane, Northbridge, NY 10001</p><p><FontAwesomeIcon icon={faClock}/> Mon–Fri 5:30am–10pm · Weekends 7am–7pm</p><p><a href="tel:+15550102020">+1 (555) 010-2020</a></p><p><a href="mailto:hello@fitzone.demo">hello@fitzone.demo</a></p><a className="button button-outline" href="https://wa.me/15550102020" target="_blank" rel="noreferrer">WhatsApp us <FontAwesomeIcon icon={faArrowRight}/></a><div className="map-placeholder"><div className="map-lines"/><span><FontAwesomeIcon icon={faLocationDot}/> FITZONE · NORTHBRIDGE</span></div></div><form className="form-panel" onSubmit={submit}><h2>Send us a message</h2><label>Full name<input name="name" required maxLength="80" autoComplete="name"/></label><div className="form-two"><label>Email<input name="email" type="email" required autoComplete="email"/></label><label>Phone <small>Optional</small><input name="phone" type="tel" autoComplete="tel"/></label></div><label>Subject<input name="subject" required maxLength="120"/></label><label>Message<textarea name="message" rows="5" required maxLength="2000"/></label><FormStatus state={state}/><button className="button button-primary" disabled={state.status === 'loading'}>{state.status === 'loading' ? 'Sending…' : 'Send message'} <FontAwesomeIcon icon={faArrowRight}/></button></form></div></section></>;
}

export function Booking() {
  const [state, setState] = useState({ status: 'idle', message: '' });
  async function submit(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const payload = Object.fromEntries(new FormData(formElement));
    setState({ status: 'loading', message: '' });
    try {
      const result = await request(api.post('/booking', payload));
      formElement.reset();
      setState({ status: 'success', message: result.message });
    } catch (error) {
      setState({ status: 'error', message: error.response?.data?.message || 'Booking could not be submitted. Please try again.' });
    }
  }
  return <><PageHero eyebrow="First session, on us" title="Make your first move." text="Tell us a little about yourself. A coach will reach out to confirm the details."/><section className="section"><div className="container booking-layout"><div><span className="eyebrow">A no-pressure first visit</span><h2>Try the studio.<br/><em>See how it feels.</em></h2><p>Your free trial is a chance to meet a coach, look around and get a feel for training here. No payment details. No commitment.</p><div className="booking-points"><span><FontAwesomeIcon icon={faCheck}/> A coach to welcome you</span><span><FontAwesomeIcon icon={faCheck}/> A session matched to your interests</span><span><FontAwesomeIcon icon={faCheck}/> Space to ask every question</span></div></div><form className="form-panel" onSubmit={submit}><h2>Request your free trial</h2><div className="form-two"><label>Full name<input name="fullName" required maxLength="80" autoComplete="name"/></label><label>Phone<input name="phone" type="tel" required pattern="[+()0-9 .-]{7,20}" autoComplete="tel"/></label></div><label>Email<input name="email" type="email" required autoComplete="email"/></label><div className="form-two"><label>Preferred date<input name="date" type="date" min={new Date().toISOString().slice(0,10)} required/></label><label>Preferred time<select name="time" required defaultValue=""><option value="" disabled>Select a time</option><option>Early morning</option><option>Morning</option><option>Lunch</option><option>Afternoon</option><option>Evening</option></select></label></div><div className="form-two"><label>Program<select name="program" required defaultValue=""><option value="" disabled>Choose a focus</option>{programs.map((program) => <option key={program}>{program}</option>)}</select></label><label>Trainer<select name="trainer" defaultValue=""><option value="">No preference</option>{trainers.map((trainer) => <option key={trainer}>{trainer}</option>)}</select></label></div><label>Anything we should know? <small>Optional</small><textarea name="message" rows="3" maxLength="1000"/></label><FormStatus state={state}/><button className="button button-primary" disabled={state.status === 'loading'}>{state.status === 'loading' ? 'Sending request…' : 'Request my free trial'} <FontAwesomeIcon icon={faArrowRight}/></button><small className="form-fineprint">We use these details only to respond to your request.</small></form></div></section></>;
}