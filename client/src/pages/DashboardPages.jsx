import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faCalendarCheck,
  faChartLine,
  faClock,
  faDumbbell,
  faEnvelope,
  faIdCard,
  faMagnifyingGlass,
  faPeopleGroup,
  faPlus,
  faTrash,
  faUserGroup,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import api, { request } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

ChartJS.register(ArcElement, BarElement, CategoryScale, Legend, LinearScale, Tooltip);

const config = {
  members: {
    title: 'Members',
    endpoint: 'members',
    fields: ['name', 'email', 'phone', 'plan', 'joinDate', 'expiryDate', 'status'],
    labels: ['Name', 'Email', 'Phone', 'Plan', 'Join date', 'Expiry date', 'Status'],
    search: ['name', 'email', 'phone'],
    statuses: ['Active', 'Expired', 'Pending', 'Cancelled'],
  },
  trainers: {
    title: 'Trainers',
    endpoint: 'trainers',
    fields: ['name', 'email', 'phone', 'specialization', 'experience', 'bio', 'image', 'availability'],
    labels: ['Name', 'Email', 'Phone', 'Specialization', 'Experience', 'Bio', 'Image URL', 'Availability'],
    search: ['name', 'specialization'],
  },
  programs: {
    title: 'Programs',
    endpoint: 'programs',
    fields: ['name', 'description', 'benefits', 'duration', 'suitableFor', 'image', 'status'],
    labels: ['Name', 'Description', 'Benefits', 'Duration', 'Suitable for', 'Image URL', 'Status'],
    search: ['name'],
    statuses: ['Active', 'Inactive'],
  },
  memberships: {
    title: 'Memberships',
    endpoint: 'memberships',
    fields: ['member', 'plan', 'startDate', 'expiryDate', 'status'],
    labels: ['Member ID', 'Plan', 'Start date', 'Expiry date', 'Status'],
    statuses: ['Active', 'Expired', 'Pending', 'Cancelled'],
  },
  bookings: {
    title: 'Bookings',
    endpoint: 'bookings',
    fields: ['fullName', 'phone', 'email', 'program', 'trainer', 'date', 'time', 'status'],
    labels: ['Member', 'Phone', 'Email', 'Program', 'Trainer', 'Date', 'Time', 'Status'],
    search: ['fullName', 'phone', 'program'],
    statuses: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
  },
  enquiries: {
    title: 'Enquiries',
    endpoint: 'enquiries',
    fields: ['name', 'phone', 'email', 'program', 'message', 'status'],
    labels: ['Name', 'Phone', 'Email', 'Program', 'Message', 'Status'],
    search: ['name', 'phone', 'email'],
    statuses: ['New Lead', 'Contacted', 'Trial Booked', 'Converted', 'Not Interested'],
  },
  timetable: {
    title: 'Timetable',
    endpoint: 'timetable',
    fields: ['day', 'time', 'program', 'trainer', 'capacity'],
    labels: ['Day', 'Time', 'Program', 'Trainer', 'Capacity'],
  },
  testimonials: {
    title: 'Testimonials',
    endpoint: 'testimonials',
    fields: ['name', 'review', 'rating', 'image', 'published'],
    labels: ['Name', 'Review', 'Rating', 'Image URL', 'Published'],
  },
  contact: {
    title: 'Contact messages',
    endpoint: 'contact',
    fields: ['name', 'email', 'phone', 'subject', 'message', 'status'],
    labels: ['Name', 'Email', 'Phone', 'Subject', 'Message', 'Status'],
    statuses: ['New', 'Read', 'Responded'],
  },
  faq: {
    title: 'Frequently asked questions',
    endpoint: 'faq',
    fields: ['question', 'answer', 'published', 'order'],
    labels: ['Question', 'Answer', 'Published', 'Order'],
  },
};

function Heading({ eyebrow, title, description, action }) {
  return (
    <div className="dash-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

function Metric({ icon, label, value, note, tone = '' }) {
  return (
    <article className="metric-card">
      <span className={`metric-icon ${tone}`}>
        <FontAwesomeIcon icon={icon} />
      </span>
      <div>
        <small>{label}</small>
        <strong>{value ?? '—'}</strong>
        <span>{note}</span>
      </div>
    </article>
  );
}

function Empty({ message }) {
  return <div className="empty-state">{message}</div>;
}

export function DataTable({ rows, columns, empty = 'No records found.' }) {
  if (!rows.length) return <Empty message={empty} />;

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>
                {column.replace(/[A-Z]/g, (match) => ` ${match}`).replace(/^./, (match) => match.toUpperCase())}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row._id || row.id || row.name || row.email || row.program}>
              {columns.map((column) => {
                const value = row[column];
                const text = value && typeof value === 'object' ? value.name || new Date(value).toLocaleDateString() : value;
                return (
                  <td key={`${row._id || row.id || row.name || row.email || row.program}-${column}`}>
                    {column === 'status' ? (
                      <span className={`status-pill ${String(text || 'Pending').toLowerCase().replaceAll(' ', '-')}`}>
                        {text || 'Pending'}
                      </span>
                    ) : column.toLowerCase().includes('date') && text ? (
                      new Date(text).toLocaleDateString()
                    ) : (
                      text || '—'
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecordModal({ record, spec, onClose, onSave }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    const form = Object.fromEntries(new FormData(event.currentTarget));

    if ('benefits' in form && typeof form.benefits === 'string') {
      form.benefits = form.benefits.split(',').map((value) => value.trim()).filter(Boolean);
    }

    if ('published' in form) {
      form.published = form.published === 'true';
    }

    try {
      await onSave(form);
      onClose();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Could not save this record.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form className="record-modal" onSubmit={submit}>
        <div className="modal-head">
          <h2>{record ? `Edit ${spec.title.toLowerCase()}` : `Add ${spec.title.toLowerCase()}`}</h2>
          <button type="button" aria-label="Close" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="modal-fields">
          {spec.fields.map((field, index) => {
            const label = spec.labels[index];
            const value = record?.[field] ?? '';

            if (field === 'status' || field === 'plan' || field === 'day' || field === 'published') {
              return (
                <label key={field}>
                  {label}
                  <select name={field} defaultValue={record?.[field] ?? (field === 'published' ? 'false' : '')} required={field !== 'published'}>
                    {field === 'status' && (spec.statuses || ['Active', 'Inactive']).map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                    {field === 'plan' && ['Basic', 'Standard', 'Premium'].map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                    {field === 'day' && ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                    {field === 'published' && (
                      <>
                        <option value="true">Published</option>
                        <option value="false">Unpublished</option>
                      </>
                    )}
                  </select>
                </label>
              );
            }

            if (field === 'description' || field === 'bio' || field === 'review' || field === 'message') {
              return (
                <label key={field}>
                  {label}
                  <textarea name={field} defaultValue={value} required />
                </label>
              );
            }

            return (
              <label key={field}>
                {label}
                <input name={field} defaultValue={value} required={field !== 'image' && field !== 'availability'} />
              </label>
            );
          })}
        </div>

        {error && <div className="form-error" role="alert">{error}</div>}

        <div className="modal-actions">
          <button type="button" className="button button-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="button button-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

function MemberDashboardHome() {
  const { user } = useAuth();
  const [state, setState] = useState({ loading: true, error: '', data: null });

  useEffect(() => {
    request(api.get('/member/overview'))
      .then(({ data }) => setState({ loading: false, error: '', data }))
      .catch((error) => setState({ loading: false, error: error.response?.data?.message || 'Dashboard could not load.', data: null }));
  }, []);

  if (state.loading) return <div className="loading-state">Loading your dashboard…</div>;
  if (state.error) return <div className="error-state" role="alert">{state.error}</div>;

  const data = state.data || {};

  return (
    <>
      <Heading
        eyebrow="MEMBER SPACE"
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'member'}.`}
        description="A good day to keep your promise to yourself."
      />
      <div className="member-summary">
        <Metric icon={faUserGroup} label="Membership status" value={data.member?.status || 'Pending'} note={data.member?.plan || 'Choose a plan with our team'} />
        <Metric icon={faCalendarCheck} label="Upcoming bookings" value={(data.bookings || []).filter((item) => new Date(item.date) >= new Date()).length} note="Sessions on your calendar" tone="red" />
        <Metric icon={faClock} label="Member since" value={data.member?.joinDate ? new Date(data.member.joinDate).toLocaleDateString() : 'Just getting started'} note="Your FitZone journey" tone="green" />
      </div>
      <section className="dash-panel">
        <div className="panel-title">
          <div>
            <span className="eyebrow">YOUR SCHEDULE</span>
            <h2>Recent bookings</h2>
          </div>
          <a href="/member/bookings">View bookings <FontAwesomeIcon icon={faArrowRight} /></a>
        </div>
        <DataTable rows={data.bookings || []} columns={['program', 'date', 'time', 'status']} empty="No bookings found." />
      </section>
      <div className="dash-welcome">
        <span className="eyebrow">YOUR NEXT STEP</span>
        <h2>Consistency beats perfect timing.</h2>
        <p>Pick a session that works for you and let your coach handle the rest.</p>
        <a className="button button-primary" href="/booking">Book a free trial <FontAwesomeIcon icon={faArrowRight} /></a>
      </div>
    </>
  );
}

function AdminDashboardHome() {
  const [state, setState] = useState({ loading: true, error: '', data: null });

  useEffect(() => {
    request(api.get('/admin/analytics'))
      .then(({ data }) => setState({ loading: false, error: '', data }))
      .catch((error) => setState({ loading: false, error: error.response?.data?.message || 'Dashboard could not load.', data: null }));
  }, []);

  if (state.loading) return <div className="loading-state">Loading your dashboard…</div>;
  if (state.error) return <div className="error-state" role="alert">{state.error}</div>;

  const data = state.data || {};
  const totals = data.totals || {};
  const membership = data.membershipDistribution || [];
  const bookingStatuses = data.bookingStatusDistribution || [];

  return (
    <>
      <Heading eyebrow="STUDIO OVERVIEW" title="Good morning, team." description="A live snapshot of your FitZone studio data." />
      <div className="metrics-grid">
        <Metric icon={faUserGroup} label="Total members" value={totals.members} note="Registered members" />
        <Metric icon={faPeopleGroup} label="Active members" value={totals.active} note={`${totals.expired || 0} expired profiles`} tone="green" />
        <Metric icon={faCalendarCheck} label="Trial bookings" value={totals.bookings} note="All booking statuses" tone="red" />
        <Metric icon={faEnvelope} label="New enquiries" value={totals.enquiries} note={`${totals.messages || 0} unread messages`} />
        <Metric icon={faIdCard} label="Active memberships" value={totals.activeMemberships} note="Current paid-plan records" tone="green" />
        <Metric icon={faClock} label="Expired memberships" value={totals.expiredMemberships} note="Membership records" />
      </div>

      <div className="analytics-grid">
        <section className="dash-panel">
          <div className="panel-title">
            <div>
              <span className="eyebrow">MEMBERSHIP MIX</span>
              <h2>Plans in the database</h2>
            </div>
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          {membership.length ? (
            <div className="chart-wrap">
              <Doughnut
                data={{
                  labels: membership.map((item) => item._id || 'Unassigned'),
                  datasets: [{
                    data: membership.map((item) => item.count),
                    backgroundColor: ['#e63946', '#111111', '#9b9b9b', '#e9b4b8'],
                    borderWidth: 0,
                  }],
                }}
                options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }}
              />
            </div>
          ) : (
            <Empty message="No membership records to chart yet." />
          )}
        </section>

        <section className="dash-panel">
          <div className="panel-title">
            <div>
              <span className="eyebrow">BOOKING STATUS</span>
              <h2>Requests by status</h2>
            </div>
            <a href="/admin/bookings">Manage <FontAwesomeIcon icon={faArrowRight} /></a>
          </div>
          {bookingStatuses.length ? (
            <div className="chart-wrap">
              <Doughnut
                data={{
                  labels: bookingStatuses.map((item) => item._id),
                  datasets: [{
                    data: bookingStatuses.map((item) => item.count),
                    backgroundColor: ['#e63946', '#111111', '#9b9b9b', '#e9b4b8'],
                    borderWidth: 0,
                  }],
                }}
                options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }}
              />
            </div>
          ) : (
            <Empty message="No bookings found." />
          )}
        </section>
      </div>

      <section className="dash-panel">
        <div className="panel-title">
          <div>
            <span className="eyebrow">LATEST ACTIVITY</span>
            <h2>Recent bookings</h2>
          </div>
          <a href="/admin/bookings">Manage bookings <FontAwesomeIcon icon={faArrowRight} /></a>
        </div>
        <DataTable rows={data.recentBookings || []} columns={['fullName', 'program', 'date', 'time', 'status']} />
      </section>

      <section className="dash-panel">
        <div className="panel-title">
          <div>
            <span className="eyebrow">LEAD PIPELINE</span>
            <h2>Recent enquiries</h2>
          </div>
          <a href="/admin/enquiries">Manage enquiries <FontAwesomeIcon icon={faArrowRight} /></a>
        </div>
        <DataTable rows={data.recentEnquiries || []} columns={['name', 'email', 'program', 'status']} />
      </section>

      <section className="dash-panel">
        <div className="panel-title">
          <div>
            <span className="eyebrow">MEMBER ACTIVITY</span>
            <h2>Recently joined members</h2>
          </div>
          <a href="/admin/members">Manage members <FontAwesomeIcon icon={faArrowRight} /></a>
        </div>
        <DataTable rows={data.recentMembers || []} columns={['name', 'email', 'plan', 'status']} />
      </section>
    </>
  );
}

export function DashboardHome() {
  const { user } = useAuth();
  return user?.role === 'ADMIN' ? <AdminDashboardHome /> : <MemberDashboardHome />;
}

function PublicRecords({ section }) {
  const [state, setState] = useState({ loading: true, rows: [] });

  useEffect(() => {
    request(api.get(`/${section}`))
      .then(({ data }) => setState({ loading: false, rows: data }))
      .catch(() => setState({ loading: false, rows: [] }));
  }, [section]);

  if (state.loading) return <div className="loading-state">Loading…</div>;
  if (!state.rows.length) return <section className="dash-panel"><Empty message={`No ${section} to show right now.`} /></section>;

  return (
    <div className="member-cards">
      {state.rows.map((item) => (
        <article className="dash-panel" key={item._id || item.name || item.program || item.day}>
          <span className="eyebrow">{section === 'timetable' ? item.day : item.specialization || item.duration || 'FITZONE'}</span>
          <h2>{item.name || item.program}</h2>
          <p>{item.description || item.bio || item.time}</p>
          <a href="/booking">Explore / book <FontAwesomeIcon icon={faArrowRight} /></a>
        </article>
      ))}
    </div>
  );
}

export function DashboardSection() {
  const { user } = useAuth();
  const admin = user?.role === 'ADMIN';
  const section = useLocation().pathname.split('/').filter(Boolean)[1] || 'overview';
  const spec = config[section];

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(undefined);
  const [memberOverview, setMemberOverview] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    if (!admin) {
      request(api.get('/member/overview'))
        .then(({ data }) => {
          if (active) {
            setMemberOverview(data);
            setLoading(false);
          }
        })
        .catch((failure) => {
          if (active) {
            setError(failure.response?.data?.message || 'Could not load your account.');
            setLoading(false);
          }
        });
      return () => { active = false; };
    }

    if (!spec) {
      setLoading(false);
      return () => { active = false; };
    }

    request(api.get(`/${spec.endpoint}`))
      .then(({ data }) => {
        if (active) {
          setRows(data);
          setLoading(false);
        }
      })
      .catch((failure) => {
        if (active) {
          setError(failure.response?.data?.message || 'Could not load records.');
          setLoading(false);
        }
      });

    return () => { active = false; };
  }, [admin, spec, section]);

  if (!admin) {
    if (loading) return <div className="loading-state">Loading…</div>;
    if (error) return <div className="error-state">{error}</div>;

    const views = {
      profile: ['Your profile', 'Your account information'],
      membership: ['Membership', 'Membership details from your account'],
      bookings: ['Booking history', 'Your trial and session requests'],
      programs: ['Programs', 'Find your next training focus'],
      trainers: ['Trainers', 'Meet the coaching team'],
      timetable: ['Timetable', 'Plan a session around your week'],
      notifications: ['Notifications', 'Updates from the studio'],
    };

    const [title, intro] = views[section] || ['Your member space', 'Your FitZone account'];
    const bookings = memberOverview?.bookings || [];

    return (
      <>
        <Heading eyebrow="MEMBER SPACE" title={title} description={intro} />
        {section === 'profile' ? (
          <section className="dash-panel profile-panel">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <p>{user.phone || 'No phone number added'}</p>
            <span className="status-pill active">{user.role}</span>
          </section>
        ) : section === 'membership' ? (
          <section className="dash-panel">
            <h2>{memberOverview?.membership?.plan || memberOverview?.member?.plan || 'No active plan yet'}</h2>
            <p>Status: {memberOverview?.membership?.status || memberOverview?.member?.status || 'Pending'}</p>
            <p>
              Start date: {memberOverview?.membership?.startDate ? new Date(memberOverview.membership.startDate).toLocaleDateString() : '—'} · Expiry: {memberOverview?.membership?.expiryDate ? new Date(memberOverview.membership.expiryDate).toLocaleDateString() : '—'}
            </p>
            <a className="button button-primary" href="/contact">Ask about membership</a>
          </section>
        ) : section === 'bookings' ? (
          <section className="dash-panel">
            <DataTable rows={bookings} columns={['program', 'date', 'time', 'trainer', 'status']} />
          </section>
        ) : section === 'programs' || section === 'trainers' || section === 'timetable' ? (
          <PublicRecords section={section} />
        ) : (
          <section className="dash-panel">
            <Empty message={section === 'notifications' ? 'You are all caught up.' : 'No information to show yet.'} />
          </section>
        )}
      </>
    );
  }

  if (loading) return <div className="loading-state">Loading {spec?.title.toLowerCase() || 'records'}…</div>;
  if (!spec) return <section className="dash-panel"><Heading eyebrow="ADMINISTRATION" title="Choose a workspace" /><p>Select a section from the navigation.</p></section>;

  const filtered = rows.filter((row) => !query || JSON.stringify(row).toLowerCase().includes(query.toLowerCase()));

  async function save(values) {
    if (modal?._id) {
      await request(api.put(`/${spec.endpoint}/${modal._id}`, values));
    } else {
      await request(api.post(`/${spec.endpoint}`, values));
    }

    const { data } = await request(api.get(`/${spec.endpoint}`));
    setRows(data);
  }

  async function remove(record) {
    if (!window.confirm(`Delete this ${spec.title.toLowerCase().replace(/s$/, '')}? This cannot be undone.`)) {
      return;
    }

    try {
      await request(api.delete(`/${spec.endpoint}/${record._id}`));
      setRows((current) => current.filter((row) => row._id !== record._id));
    } catch (failure) {
      setError(failure.response?.data?.message || 'Could not delete record.');
    }
  }

  const statusIndex = spec.fields.indexOf('status');
  const columns = spec.fields
    .map((field, index) => ({ field, label: spec.labels[index] }))
    .filter((column) => column.field !== 'status' && column.field !== 'published');

  return (
    <>
      <Heading
        eyebrow="STUDIO MANAGEMENT"
        title={spec.title}
        description={`Manage ${spec.title.toLowerCase()} in your FitZone database.`}
        action={
          <button className="button button-primary" onClick={() => setModal(null)}>
            <FontAwesomeIcon icon={faPlus} /> Add new
          </button>
        }
      />

      {error && <div className="error-state">{error}</div>}

      <section className="dash-panel manager-panel">
        <div className="manager-toolbar">
          <label className="search-box">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${spec.title.toLowerCase()}…`}
              aria-label={`Search ${spec.title}`}
            />
          </label>
          <span>
            {filtered.length} {filtered.length === 1 ? 'record' : 'records'}
          </span>
        </div>

        {filtered.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  {columns.map(({ field, label }) => (
                    <th key={field}>{label}</th>
                  ))}
                  {statusIndex >= 0 || spec.fields.includes('published') ? <th>Status</th> : null}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row._id}>
                    {columns.map(({ field }) => {
                      const value = row[field];
                      const display = Array.isArray(value)
                        ? value.join(', ')
                        : field.toLowerCase().includes('date') && value
                          ? new Date(value).toLocaleDateString()
                          : value;

                      return <td key={field}>{display || '—'}</td>;
                    })}

                    {statusIndex >= 0 || spec.fields.includes('published') ? (
                      <td>
                        <span className={`status-pill ${String(row.status || (row.published ? 'Published' : 'Unpublished')).toLowerCase().replaceAll(' ', '-')}`}>
                          {row.status || (row.published ? 'Published' : 'Unpublished')}
                        </span>
                      </td>
                    ) : null}

                    <td className="row-actions">
                      <button aria-label={`Edit ${row.name || row.fullName || spec.title}`} onClick={() => setModal(row)}>Edit</button>
                      <button aria-label={`Delete ${row.name || row.fullName || spec.title}`} onClick={() => remove(row)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty message={query ? 'No records match your search.' : `No ${spec.title.toLowerCase()} found.`} />
        )}
      </section>

      {modal !== undefined && <RecordModal record={modal} spec={spec} onClose={() => setModal(undefined)} onSave={save} />}
    </>
  );
}
