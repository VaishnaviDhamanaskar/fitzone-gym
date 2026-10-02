import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faDumbbell, faStar } from '@fortawesome/free-solid-svg-icons';

export function ButtonLink({ to, children, variant = 'primary', className = '' }) {
  return <Link className={`button button-${variant} ${className}`} to={to}>{children}<FontAwesomeIcon icon={faArrowRight} /></Link>;
}
export function SectionHeading({ eyebrow, title, copy, light = false }) {
  return <div className={`section-heading${light ? ' light' : ''}`}><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</div>;
}
export function ProgramCard({ program }) {
  return <article className="program-card"><div className="program-image" style={{ backgroundImage: `url(${program.image})` }} role="img" aria-label={program.name}><span className="program-icon"><FontAwesomeIcon icon={faDumbbell} /></span></div><div className="program-copy"><span className="eyebrow">{program.duration || 'All levels'}</span><h3>{program.name}</h3><p>{program.description}</p><Link to="/booking">Explore program <FontAwesomeIcon icon={faArrowRight} /></Link></div></article>;
}
export function Rating({ value = 5 }) { return <span className="rating" aria-label={`${value} out of 5 stars`}>{Array.from({ length: value }, (_, i) => <FontAwesomeIcon icon={faStar} key={i} />)}</span>; }
