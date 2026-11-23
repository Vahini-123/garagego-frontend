# GarageGo— Frontend (React + Vite)

Talks to the Django backend (`csms-django`) over its REST API. Pages:

- `/` — Home (public)
- `/login` — customer sign in
- `/register` — customer signup (auto-logs-in after success)
- `/admin/login` — same login form, rejects non-admin accounts
- `/dashboard` — customer: manage cars, book a service, see own requests + live status
- `/admin` — admin: manage the service catalog (CRUD), see all bookings, move status forward

## ⚠️ About this build

Written in a sandbox with no network access, so `npm install` could not actually
run here — I could not build or boot this app to confirm it end-to-end. Every
file's braces/parens were balance-checked and the import graph was reviewed by
hand, but **please run it yourself** before relying on it.

## Setup

```bash
cd csms-frontend
npm install
cp .env.example .env   # defaults to http://localhost:8000/api — adjust if needed
npm run dev
```

Make sure the Django backend is running first (`python manage.py runserver`,
default `http://localhost:8000`) — this app calls it directly, there's no mock
data. The backend now includes `django-cors-headers`, allowing requests from
`http://localhost:5173` (Vite's default port).

## How the pieces fit together

- **`src/api/client.js`** — one fetch wrapper. Attaches the JWT to every
  request, silently refreshes the access token on a 401 and retries once, and
  throws a readable `ApiError` (using the `{error, detail, status_code}` shape
  your Django exception handler returns) so forms can show real messages.
- **`src/context/AuthContext.jsx`** — holds the logged-in user and role,
  re-hydrates from a stored token on page refresh via `GET /accounts/me/`.
- **`src/components/ProtectedRoute.jsx`** — gates `/dashboard` and `/admin`,
  and `requireAdmin` bounces a logged-in-but-non-admin user back to `/dashboard`.
- **Admin ↔ customer sync**: both dashboards read/write the same
  `ServiceRequest` rows. When admin calls `PATCH /bookings/<id>/status/`, the
  next time the customer's dashboard re-fetches `/bookings/mine/` it sees the
  new status — there's no separate copy of the data to drift out of sync.
- **Future-date guard**: the date `<input>` on the booking form has
  `min={today}` as a first line of defense, but the real enforcement is
  server-side in `ServiceRequestCreateSerializer.validate()` — if that's ever
  bypassed client-side, the API still rejects it and the error surfaces in
  the form.
- **Status transitions**: `AdminDashboard.jsx` mirrors the backend's
  `ALLOWED_TRANSITIONS` map so the "Move to…" dropdown only ever offers legal
  next states — but the backend is still the source of truth and re-validates
  on every request.

## Known gaps to fill in yourself

- No password-reset flow.
- No pagination on the admin bookings/services lists (fine for a college
  project's data volume; add `page`/`page_size` handling if it grows).
- Styling is inline `style={}` objects to match the single-file `Home.jsx`
  you started with — fine at this size, but consider extracting to CSS
  modules if the app keeps growing.
