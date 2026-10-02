# FitZone Fitness Studio

**This is a fictional/demo project created for portfolio and client presentation purposes.** Names, profiles, reviews, schedules, prices and sample records are invented. The application does not take payments.

## Overview

FitZone is a responsive gym website and management application with a React public site, member workspace, role-protected admin interface, Express REST API and MongoDB persistence. The client and server are separate npm projects.

## Features

- Public home, about, programs, trainers, membership, timetable, gallery, testimonials, FAQ, contact, trial booking, login, registration, privacy, terms and 404 routes.
- Responsive navigation, BMI estimate, accessible FAQ accordion, gallery filters/lightbox and enquiry forms.
- JWT authentication, bcrypt password hashing and USER/ADMIN authorization.
- Member overview, profile, membership and booking history.
- Admin analytics and database-backed CRUD for members, trainers, programs, memberships, bookings, enquiries, timetable, testimonials, contact messages and FAQs; searchable management lists.
- Mongoose schemas, request validation, API rate limiting, secure headers, CORS configuration and consistent JSON errors.

## Technology

React 18, JavaScript, Vite, React Router, Axios, Font Awesome, Chart.js, Node.js, Express, MongoDB, Mongoose, JWT and bcryptjs.

## Project layout

```text
FitZone/
├── client/                 React/Vite application
│   └── src/{components,context,layouts,pages,services}
├── server/                 Express REST API
│   ├── config/ controllers/ middleware/ models/ routes/ scripts/
├── .env.example
└── README.md
```

## Requirements and setup

Install Node.js 20+ (which includes npm) and run MongoDB locally, use MongoDB Atlas, or point `MONGO_URI` to another MongoDB deployment. This project does not use PHP, MySQL or Firebase.

1. From the project root, create the server environment file and edit it:

   ```powershell
   Copy-Item .env.example server/.env
   notepad server/.env
   ```

   Set `MONGO_URI`, a random `JWT_SECRET` of at least 32 characters, `PORT=5000`, and `CLIENT_URL=http://localhost:5173`. Never commit `server/.env`.
2. Start or provision MongoDB. A local default URI is `mongodb://127.0.0.1:27017/fitzone`.
3. In a terminal, install and start the API:

   ```powershell
   cd server
   npm install
   npm run dev
   ```

4. In a second terminal, install and start the website:

   ```powershell
   cd client
   npm install
   npm run dev
   ```

   Open the Vite URL (normally `http://localhost:5173`). Set `VITE_API_URL` in `client/.env` only if the API is not at `http://localhost:5000/api`.

## Database and demo records

With MongoDB available and `server/.env` configured, run `npm run seed:demo` from `server/`. It idempotently creates fictional trainers, programs, FAQs, class schedule, testimonials and example member activity. Admin dashboards use API/database results; public marketing sections also include static sample content so the site remains presentable before seeding.

## Admin account

Set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` of at least 12 characters in `server/.env` (optionally `ADMIN_NAME`), then run `npm run seed:admin` from `server/`. The script hashes the password and creates or promotes that account. Do not put these credentials in the client or publish them. Public registration always creates a USER account.

## API overview

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- CRUD resources: `/api/users`, `/api/members`, `/api/trainers`, `/api/programs`, `/api/memberships`, `/api/bookings`, `/api/enquiries`, `/api/timetable`, `/api/testimonials`, `/api/contact`, `/api/faq`
- Public submissions: `POST /api/booking`, `POST /api/contact`
- Member data: `GET /api/member/overview`
- Admin summary: `GET /api/admin/analytics`
- Health check: `GET /api/health`

Admin resource writes and private resource reads require `Authorization: Bearer <JWT>` and ADMIN role. Public resource reads return published/active content where applicable. API responses use `{ success, data, message? }`.

## Screenshots

No screenshots are included yet. Run the client locally to view the public site and dashboards.

## Responsive design and accessibility

The UI adapts to mobile, tablet and desktop widths, with a touch-friendly collapsible menu, scrollable data tables, semantic forms and visible focus styles. Images use descriptive alternative text. Test locally at narrow mobile and standard laptop viewport sizes.

## Portfolio notes and future scope

This codebase is a development portfolio/demo, not a production fitness business. Configure real contact details, legal documents, security controls, operational monitoring and policies before any real deployment. Sample legal pages are not legal advice.

Future scope (not implemented): online payment gateway, automated WhatsApp, email/SMS notifications, QR attendance, workout tracking, diet plans, progress photos, wearable integration, subscription auto-renewal, advanced analytics, cloud image storage and production infrastructure.