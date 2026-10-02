import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import { SiteLayout } from './components/SiteLayout.jsx';
import { AdminLayout, MemberLayout } from './layouts/DashboardLayout.jsx';
import { Home, About, Membership, Gallery, Privacy, Terms, NotFound } from './pages/PublicPages.jsx';
import { Contact, Booking } from './pages/FormPages.jsx';
import { Programs, Trainers, Timetable, Testimonials, FAQ } from './pages/StudioPages.jsx';
import { Login, Register } from './pages/AuthPages.jsx';
import { DashboardHome, DashboardSection } from './pages/DashboardPages.jsx';

function Protected({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loading">Checking your session…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/member'} replace />;
  return children;
}
function DashboardRoute({ role }) { return <Protected role={role}>{role === 'ADMIN' ? <AdminLayout /> : <MemberLayout />}</Protected>; }
function PageMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const pageName = pathname.split('/').filter(Boolean).at(-1)?.replaceAll('-', ' ') || 'Home';
    document.title = `${pageName.replace(/\b\w/g, (letter) => letter.toUpperCase())} | FitZone Fitness Studio`;
    const description = document.querySelector('meta[name="description"]');
    const pageDescription = `Explore ${pageName} at FitZone Fitness Studio. Train strong. Live strong.`;
    if (description) description.content = pageDescription;
    const socialTitle = document.querySelector('meta[property="og:title"]');
    const socialDescription = document.querySelector('meta[property="og:description"]');
    if (socialTitle) socialTitle.content = document.title;
    if (socialDescription) socialDescription.content = pageDescription;
  }, [pathname]);
  return null;
}
export default function App() {
  return <>
    <PageMetadata />
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="programs" element={<Programs />} />
        <Route path="trainers" element={<Trainers />} />
        <Route path="membership" element={<Membership />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="contact" element={<Contact />} />
        <Route path="booking" element={<Booking />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="member" element={<DashboardRoute role="USER" />}>
        <Route index element={<DashboardHome />} />
        <Route path=":section" element={<DashboardSection />} />
      </Route>
      <Route path="admin" element={<DashboardRoute role="ADMIN" />}>
        <Route index element={<DashboardHome />} />
        <Route path=":section" element={<DashboardSection />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>;
}
