import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCheck, faChevronDown, faClock, faUsers } from '@fortawesome/free-solid-svg-icons';
import api, { request } from '../services/api.js';
import { Rating, SectionHeading } from '../components/UI.jsx';

const programImages = [
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
];
const demoPrograms = ['Strength Training','Weight Loss','Personal Training','Functional Training','Cross Training','Yoga & Flexibility'].map((name, index) => ({ name, description: 'Coach-led sessions built around practical goals, thoughtful progress and a welcoming training floor.', duration: index === 2 ? '45 minutes' : '50 minutes', suitableFor: 'All levels', benefits: ['Build consistency', 'Learn good technique', 'Train with support'] }));
const demoTrainers = [
  { name: 'Jordan Reed', specialization: 'Strength & conditioning', experience: '8 years', bio: 'Patient, detail-focused strength coach who makes room for every starting point.' },
  { name: 'Amara Ellis', specialization: 'Mobility & yoga', experience: '6 years', bio: 'Helps members build balance, mobility and a steadier relationship with movement.' },
  { name: 'Kai Bennett', specialization: 'Functional training', experience: '10 years', bio: 'Brings practical strength and conditioning to upbeat, welcoming group sessions.' },
];
const demoFaqs = [
  ['Do you offer a free trial?', 'Yes. Request a complimentary introductory session through our booking form.'],
  ['What membership plans are available?', 'Choose from Basic, Standard and Premium options. Contact the studio for details.'],
  ['Do you provide personal training?', 'Yes. Our coaches offer individual sessions and goal-led training.'],
  ['Is the gym beginner-friendly?', 'Absolutely. Coaches can help you get comfortable and progress at your own pace.'],
  ['What are gym timings?', 'Monday to Friday 5:30am–10pm; Saturday and Sunday 7am–7pm.'],
  ['Can I book a trainer?', 'Yes. Use the free trial form and mention your preferred coach.'],
  ['How can I renew membership?', 'Contact the studio team or visit the front desk for renewal support.'],
].map(([question, answer]) => ({ question, answer }));
const demoTestimonials = [
  { name: 'Morgan Lane', review: 'The coaches meet you where you are. I feel stronger and genuinely look forward to training.', rating: 5 },
  { name: 'Taylor Avery', review: 'Small-group sessions give me accountability without losing that personal coaching feel.', rating: 5 },
  { name: 'Riley Quinn', review: 'Friendly from day one. I finally found a routine that fits my life.', rating: 5 },
];
function useRecords(endpoint, fallback) {
  const [state, setState] = useState({ loading: true, records: fallback, error: '' });
  useEffect(() => {
    let active = true;
    request(api.get(`/${endpoint}`)).then(({ data }) => { if (active) setState({ loading: false, records: data, error: '' }); }).catch((error) => { if (active) setState({ loading: false, records: fallback, error: error.response?.data?.message || 'Showing demo content because the studio API is unavailable.' }); });
    return () => { active = false; };
  }, [endpoint]);
  return state;
}
function PageHero({ eyebrow, title, text }) { return <section className="page-hero"><div className="container"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div></section>; }
function PageCTA() { return <section className="final-cta"><div className="container cta-inner"><span className="eyebrow">Your next chapter starts here</span><h2>Ready to start your<br/><em>fitness journey?</em></h2><p>Come meet your coaches, see the space and try a session on us.</p><Link className="button button-primary" to="/booking">Book a free trial <FontAwesomeIcon icon={faArrowRight}/></Link></div></section>; }
function LoadingMessage({ loading, error }) { return loading ? <p className="loading-state">Loading studio information…</p> : error ? <p className="demo-note">{error}</p> : null; }

export function Programs() {
  const { records, loading, error } = useRecords('programs', demoPrograms);
  return <><PageHero eyebrow="Find your focus" title="Training that meets you here." text="Start with a goal, a question or just a first visit. We will help you find a program that feels right."/><section className="section"><div className="container"><LoadingMessage loading={loading} error={error}/>{records.length ? <><div className="program-grid program-grid-wide">{records.map((program, index) => <article className="program-card" key={program._id || program.name}><div className="program-image" style={{ backgroundImage: `url(${program.image || programImages[index % programImages.length]})` }} role="img" aria-label={program.name}/><div className="program-copy"><span className="eyebrow">{program.duration || 'All levels'}</span><h3>{program.name}</h3><p>{program.description}</p><Link to="/booking">Book a session <FontAwesomeIcon icon={faArrowRight}/></Link></div></article>)}</div><div className="program-detail-list">{records.map((program, index) => <article className="program-detail" key={program._id || `${program.name}-detail`}><span className="eyebrow">0{index + 1} / PROGRAM</span><div><h2>{program.name}</h2><p>{program.description}</p><div className="program-meta"><span><FontAwesomeIcon icon={faClock}/> {program.duration || 'Flexible schedule'}</span><span><FontAwesomeIcon icon={faUsers}/> {program.suitableFor || 'All levels'}</span></div><p className="benefit-line"><strong>Benefits:</strong> {(program.benefits || []).join(', ') || 'Build consistency and confidence.'}</p><Link className="button button-text" to="/booking">Book a session <FontAwesomeIcon icon={faArrowRight}/></Link></div><img src={program.image || programImages[index % programImages.length]} alt={`${program.name} session`} loading="lazy"/></article>)}</div></> : <div className="empty-state">No programs are currently available.</div>}</div></section><PageCTA/></>;
}
export function Trainers() {
  const { records, loading, error } = useRecords('trainers', demoTrainers);
  return <><PageHero eyebrow="Your people" title="Coaches in your corner." text="Good coaching starts with listening. Meet the team that will help you train with purpose."/><section className="section"><div className="container"><LoadingMessage loading={loading} error={error}/>{records.length ? <><div className="trainer-grid">{records.map((trainer, index) => <article className="trainer-card" key={trainer._id || trainer.name}><div className="trainer-photo"><img src={trainer.image || programImages[index % programImages.length]} alt={`${trainer.name}, ${trainer.specialization} coach`} loading="lazy"/><span>0{index + 1}</span></div><div className="trainer-info"><h3>{trainer.name}</h3><p>{trainer.specialization}</p><small>{trainer.experience} experience</small></div></article>)}</div><div className="trainer-bios">{records.map((trainer) => <article key={`${trainer._id || trainer.name}-bio`}><span className="eyebrow">{trainer.availability || 'COACH'} · {trainer.experience}</span><h2>{trainer.name}</h2><h3>{trainer.specialization}</h3><p>{trainer.bio}</p>{trainer.socialLinks?.map((link) => <a key={link} href={link} target="_blank" rel="noreferrer">Social profile ↗</a>)}<Link className="button button-text" to="/booking">Book a session <FontAwesomeIcon icon={faArrowRight}/></Link></article>)}</div></> : <div className="empty-state">No trainer profiles are available.</div>}<p className="demo-note">Trainer profiles are fictional portfolio content.</p></div></section><PageCTA/></>;
}
export function Timetable() {
  const demoClasses = [['Monday','6:15 AM','Strength Training','Jordan Reed',12],['Monday','12:00 PM','Yoga & Flexibility','Amara Ellis',10],['Tuesday','6:00 PM','Functional Training','Kai Bennett',14],['Wednesday','6:15 AM','Strength Training','Jordan Reed',12],['Wednesday','6:00 PM','Yoga & Flexibility','Amara Ellis',10],['Thursday','12:00 PM','Cross Training','Kai Bennett',12],['Friday','5:30 PM','Strength Training','Jordan Reed',12],['Saturday','9:00 AM','Yoga & Flexibility','Amara Ellis',14]].map(([day,time,program,trainer,capacity]) => ({ day,time,program,trainer,capacity }));
  const { records, loading, error } = useRecords('timetable', demoClasses);
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  return <><PageHero eyebrow="Weekly rhythm" title="Find a time that feels good." text="A current snapshot of our weekly studio schedule. Book ahead to reserve your place."/><section className="section"><div className="container"><div className="timetable-head"><h2>This week at FitZone</h2><span><i/> Spaces shown as sample capacity</span></div><LoadingMessage loading={loading} error={error}/><div className="timetable-days">{days.map((day) => { const classes = records.filter((entry) => entry.day === day); return <section className="day-column" key={day}><h3>{day.slice(0,3)}<small>{classes.length ? `${classes.length} sessions` : 'Studio open'}</small></h3>{classes.length ? classes.map((entry) => <article className="class-entry" key={`${entry.day}${entry.time}`}><span>{entry.time}</span><strong>{entry.program}</strong><small>{entry.trainer}</small><small>{entry.capacity} spots · Demo</small><Link to="/booking" aria-label={`Book ${entry.program}`}>Book <FontAwesomeIcon icon={faArrowRight}/></Link></article>) : <p className="empty-day">Open gym<br/>coach on floor</p>}</section>; })}</div>{!records.length && !loading && <p className="empty-state">No classes are scheduled right now.</p>}<p className="demo-note">Schedule and capacities are fictional sample data. Contact the studio to confirm availability.</p></div></section><PageCTA/></>;
}
export function Testimonials() {
  const { records, loading, error } = useRecords('testimonials', demoTestimonials);
  return <><PageHero eyebrow="Member stories" title="Progress feels personal." text="A few words from fictional FitZone members about finding their rhythm."/><section className="section"><div className="container"><SectionHeading eyebrow="Member stories" title="Showing up adds up"/><LoadingMessage loading={loading} error={error}/>{records.length ? <div className="quote-grid">{records.map((item) => <article className="quote-card" key={item._id || item.name}><Rating value={item.rating}/><p>“{item.review}”</p><strong>{item.name}</strong><small>Fictional demo review</small></article>)}</div> : <div className="empty-state">No testimonials have been published.</div>}</div></section><PageCTA/></>;
}
export function FAQ() {
  const { records, loading, error } = useRecords('faq', demoFaqs);
  const [open, setOpen] = useState(0);
  return <><PageHero eyebrow="Good to know" title="Questions, answered." text="Everything you need to feel comfortable before your first visit."/><section className="section"><div className="container faq-page"><LoadingMessage loading={loading} error={error}/>{records.length ? <div className="faq-list">{records.map((faq, index) => <section className={`faq-item${open === index ? ' is-open' : ''}`} key={faq._id || faq.question}><button aria-expanded={open === index} onClick={() => setOpen(open === index ? -1 : index)}>{faq.question}<FontAwesomeIcon icon={faChevronDown}/></button>{open === index && <p>{faq.answer}</p>}</section>)}</div> : <div className="empty-state">No frequently asked questions are published yet.</div>}<div className="contact-nudge"><h2>Still have a question?</h2><p>Talk it through with a real person on our team.</p><Link className="button button-primary" to="/contact">Contact us <FontAwesomeIcon icon={faArrowRight}/></Link></div></div></section><PageCTA/></>;
}