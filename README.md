# Rakesh Godumala — Developer Portfolio

A responsive portfolio (React + Bootstrap 5) with a password-protected admin dashboard (Node.js, Express, MongoDB) for managing projects, certifications and contact messages without editing code.

```
portfolio/
├── frontend/                React 19 + Vite + Bootstrap 5 (React Bootstrap)
│   ├── public/resume/       ← your resume PDF (replace to update)
│   └── src/
│       ├── data/profile.js  ← all static profile content (skills, education, links…)
│       ├── sections/        Hero, About, Skills, Experience, Projects, Education, …
│       ├── components/      NavBar, Footer, ProjectCard, modals, theme toggle…
│       ├── admin/           Login, dashboard, project form, certifications, messages
│       ├── services/        Axios API clients
│       ├── hooks/           Theme, active section, scroll helpers
│       └── styles/          Design tokens (light/dark), global and admin styles
└── backend/                 Express 5 + Mongoose 9
    ├── config/  controllers/  middleware/  models/  routes/  services/  utils/
    ├── scripts/createAdmin.js   create / reset the admin account (CLI only)
    ├── scripts/seed.js          import projects from the old portfolio
    ├── seed/images/             screenshots used by the seed script
    └── tests/api.test.js        API + security integration tests
```

## Features

**Public site:** hero with code-style illustration, about, skills (no fake percentages), internship timeline, projects loaded from the database (with curated local projects shown immediately and used as a fallback if the API is unavailable), category filter, details modal, lazy-loaded images, education, certifications (verification link only when you add one), achievements, contact form, footer, light/dark theme, active-section navbar, mobile menu, 404 page, SEO/Open Graph tags, favicon.

**Admin dashboard (`/admin/login` → `/admin/dashboard`):**
- Add, edit, delete (with confirmation) projects
- Upload screenshots (JPEG/PNG/WebP, max 2 MB, contents verified on the server)
- Technology tags, category, GitHub / live demo URLs, Featured flag
- Save & publish, or save as draft; publish/unpublish toggle
- Move projects up/down to change display order
- Live card preview and details preview while editing
- Manage certifications and their verification links
- Read, reply to and delete contact-form messages

**Security:**
- No registration endpoint. The admin is created from the command line, and no password is stored in source code or frontend config.
- Passwords hashed with bcrypt (cost 12); 5 failed logins lock the account for 15 minutes; IP rate limiting on login.
- Session = signed JWT in an **HttpOnly, SameSite, Secure (in production)** cookie, which JavaScript cannot read. Expires after `SESSION_HOURS` (default 2).
- Logout revokes **all** existing session tokens on the server, not just the cookie.
- Every `/api/admin/*` route is protected by server-side middleware. Hiding the React pages is only cosmetic.
- CSRF protection: state-changing requests need the `X-Requested-With` header and an allow-listed `Origin`. CORS is limited to `CLIENT_ORIGIN`.
- Input validation and sanitisation, MongoDB operator stripping, `javascript:` URLs rejected, Helmet security headers, JSON body size limit, rate-limited contact form with a honeypot.
- Public API never returns drafts or internal storage IDs.

> The bcrypt implementation is `bcryptjs` (pure JavaScript, same algorithm and hash format). It avoids native build problems on Windows and on free hosting.

---

## 1. Local setup

**Requirements:** Node.js 20+, MongoDB (local install or a free MongoDB Atlas cluster).

```bash
# Backend
cd backend
npm install
cp .env.example .env          # Windows PowerShell: Copy-Item .env.example .env
```

Edit `backend/.env`:
- `MONGODB_URI`: `mongodb://127.0.0.1:27017/portfolio` for local MongoDB, or your Atlas URI
- `JWT_SECRET`: generate with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

```bash
npm run create-admin          # asks for email + password (typed hidden)
npm run seed                  # imports the 8 projects + 3 certifications (only into empty collections)
npm run dev                   # API on http://localhost:5000
```

```bash
# Frontend (second terminal)
cd frontend
npm install
npm run dev                   # http://localhost:5173  (proxies /api to :5000)
```

Open http://localhost:5173 for the portfolio and http://localhost:5173/admin/login for the dashboard.

**Admin password rules:** at least 10 characters with upper and lower case letters, a number and a symbol.
Change it any time with `npm run create-admin -- --reset` (this also signs out every session).

**Tests:** `cd backend && npm test` runs 18 API/security tests against a temporary `portfolio_test` database.

## 2. Everyday use

| I want to… | Do this |
|---|---|
| Add a project | Dashboard → **Add Project** → fill in → **Save & publish** |
| Hide a project temporarily | Flip its **Live** switch off (it becomes a draft) |
| Change order | Use the ↑ / ↓ arrows on the dashboard |
| Add a demo link later | **Edit** → Live demo URL → Save |
| Add a certificate verification link | **Certifications** tab → Edit |
| Update my resume | Replace `frontend/public/resume/Rakesh_Godumala_Resume.pdf` (keep the name) and redeploy the frontend, or set `VITE_RESUME_URL` |
| Change skills, education, summary, links | Edit `frontend/src/data/profile.js` |
| Change my profile photo | Replace `frontend/src/assets/profile.jpg` |

## 3. Contact form email (optional)

Every message is **always saved** in MongoDB and shown in the dashboard's **Messages** tab. To also get it by email, set SMTP variables on the backend. For Gmail:

1. Turn on 2-Step Verification for your Google account.
2. Create an **App Password** (Google Account → Security → App passwords).
3. Set:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=rakeshgodumala22@gmail.com
   SMTP_PASS=<16-character app password>
   CONTACT_TO_EMAIL=rakeshgodumala22@gmail.com
   ```
Never use your normal Gmail password, and never put SMTP values in the frontend. If sending fails, the visitor still gets a confirmation (the message is stored). If the API is unreachable, the form offers a `mailto:` fallback.

---

## 4. Deployment (recommended: Vercel + Render + MongoDB Atlas + Cloudinary)

GitHub Pages can only host static files. It **cannot** run the Node.js API or keep the admin login secure, so the backend must run elsewhere.

```
Browser ──► Vercel (frontend, HTTPS) ──/api/* rewrite──► Render (Express API) ──► MongoDB Atlas
                                                               └──► Cloudinary (images)
```

With the Vercel rewrite, the browser only ever talks to your Vercel domain, so the session cookie is first-party (`SameSite=Lax`) and works in every browser, including Safari, which blocks third-party cookies.

### 4.1 MongoDB Atlas
1. Create a free M0 cluster at https://cloud.mongodb.com.
2. **Database Access**: add a user with a strong password.
3. **Network Access**: allow `0.0.0.0/0` (Render's free tier has no fixed IP); access is still protected by the credentials.
4. **Connect → Drivers**: copy the URI and add the database name: `…mongodb.net/portfolio?retryWrites=true&w=majority`.

### 4.2 Cloudinary (persistent images)
1. Sign up at https://cloudinary.com (free tier).
2. Copy the **API environment variable** from the dashboard: `cloudinary://<key>:<secret>@<cloud_name>`.

Render's disk is wiped on every deploy, so in production the API **refuses uploads** until `CLOUDINARY_URL` is set, rather than saving images that would disappear. The dashboard shows a warning when it is missing.

### 4.3 Backend on Render
1. Push this repository to GitHub (the `.gitignore` keeps `.env` and `node_modules` out).
2. Render → **New → Web Service** → pick the repo.
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
   - Health check path: `/api/health`
3. Environment variables:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Atlas URI |
| `JWT_SECRET` | new random 96-character hex string (not the local one) |
| `CLIENT_ORIGIN` | `https://<your-app>.vercel.app` (add your custom domain too, comma-separated) |
| `COOKIE_SAMESITE` | `lax` |
| `TRUST_PROXY` | `2` (Vercel rewrite + Render proxy; use `1` if browsers call Render directly) |
| `SESSION_HOURS` | `2` |
| `CLOUDINARY_URL` | from Cloudinary |
| `SMTP_*`, `CONTACT_*` | optional, see section 3 |

4. After the first deploy, open Render's **Shell** tab and run:
   ```bash
   npm run create-admin      # type your email and a strong password
   npm run seed              # uploads the old-portfolio screenshots to Cloudinary
   ```
   (Alternatively, run the same commands on your computer with `MONGODB_URI` and `CLOUDINARY_URL` temporarily pointing at production.)

### 4.4 Frontend on Vercel
1. Edit `frontend/vercel.json` and replace `https://YOUR-BACKEND.onrender.com` with your Render URL. Commit.
2. Vercel → **Add New Project** → pick the repo.
   - Root directory: `frontend`
   - Framework preset: Vite (build `npm run build`, output `dist`)
   - Environment variables: leave `VITE_API_BASE_URL` **empty** (the rewrite handles `/api`). Optionally set `VITE_RESUME_URL`.
3. Deploy, then put the final Vercel URL into Render's `CLIENT_ORIGIN` and redeploy the backend.

`VITE_*` variables are compiled into public JavaScript. Never put passwords, API keys or the JWT secret there.

### 4.5 Custom domain (optional)
- Vercel → Project → **Domains** → add `rakeshgodumala.dev` (or similar) and follow the DNS instructions. HTTPS certificates are automatic.
- Add the new origin to `CLIENT_ORIGIN` on Render (for example `https://rakeshgodumala.dev,https://www.rakeshgodumala.dev`).
- Update `og:image` in `frontend/index.html` to an absolute URL on that domain for nicer link previews.
- Your old GitHub Pages site can link to (or redirect to) the new domain.

### 4.6 Free-tier note
Render's free web services sleep after inactivity, so the first request can take 30–60 seconds. The projects section shows a "waking up the server" message during that time. Upgrading to a paid instance or using a keep-alive ping avoids it.

### 4.7 Alternative: API on a different domain (no rewrite)
Set `VITE_API_BASE_URL=https://<api>/api` on the frontend and `COOKIE_SAMESITE=none` on the backend. Browsers that block third-party cookies (Safari, some Chrome settings) may then refuse the admin login, which is why the rewrite setup above is recommended.

---

## 5. Testing checklist

**Public site**
- [ ] Home page loads; navbar links scroll smoothly and highlight the active section
- [ ] Mobile (≤ 400 px): hamburger menu opens and closes, no horizontal scrolling
- [ ] Theme toggle switches light/dark and is remembered after refresh
- [ ] **Download Resume** (hero, navbar, footer) downloads the real PDF
- [ ] Projects load from the API; category filter works; **View Details** opens the modal
- [ ] Projects without a demo show "Demo Coming Soon"; without GitHub, no GitHub button
- [ ] Draft projects do **not** appear
- [ ] Certifications show verification links only where one was added
- [ ] Contact form: empty or invalid fields show errors; a valid message shows success and appears in **Messages**
- [ ] Unknown URL (e.g. `/abc`) shows the 404 page
- [ ] Lighthouse (Chrome DevTools): check Performance, Accessibility, SEO

**Admin**
- [ ] `/admin/dashboard` while signed out → redirected to `/admin/login`
- [ ] Wrong password → "Invalid email or password"; 5 wrong attempts → temporary lock
- [ ] Correct login → dashboard; refresh keeps you signed in
- [ ] Add project with validation errors → fields highlighted; fix → saved, toast shown
- [ ] Upload a > 2 MB image or a non-image → clear error; valid image → preview
- [ ] Save & publish → appears on the public site; Save as draft → hidden
- [ ] Edit title/links/image → public site updates; old image is removed from storage
- [ ] Live switch off/on → project hides/reappears publicly
- [ ] ↑ / ↓ reorder → public order changes
- [ ] Delete → confirmation dialog → project gone publicly
- [ ] Log out → dashboard inaccessible; browser back button does not restore access
- [ ] `curl https://<api>/api/admin/projects` without a cookie → `401`

**Production**
- [ ] HTTPS on frontend and API; cookie shows `HttpOnly; Secure; SameSite=Lax` in DevTools
- [ ] Uploaded images are Cloudinary URLs and survive a backend redeploy
- [ ] Data survives a frontend redeploy, a browser restart and a logout

## 6. API reference

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/health` | – | Health / DB status |
| GET | `/api/projects` | – | Published projects |
| GET | `/api/projects/:slug` | – | One published project |
| GET | `/api/certifications` | – | Certifications |
| POST | `/api/contact` | – | Send a message (rate-limited) |
| POST | `/api/auth/login` | – | Sign in (rate-limited) |
| POST | `/api/auth/logout` | cookie | Sign out and revoke sessions |
| GET | `/api/auth/me` | admin | Current admin |
| GET/POST | `/api/admin/projects` | admin | List all / create |
| GET/PUT/DELETE | `/api/admin/projects/:id` | admin | Read / update / delete |
| PATCH | `/api/admin/projects/:id/publish` | admin | `{ "published": true }` |
| PUT | `/api/admin/projects/reorder` | admin | `{ "ids": [...] }` |
| POST | `/api/admin/uploads` | admin | Multipart field `image` |
| GET/POST/PUT/DELETE | `/api/admin/certifications[/:id]` | admin | Certifications CRUD |
| GET/PATCH/DELETE | `/api/admin/messages[/:id]` | admin | Contact messages |
| GET | `/api/admin/status` | admin | Image storage / email config status |

**Project schema:** `title, slug, description, technologies[], category, githubUrl, liveDemoUrl, imageUrl, featured, published, displayOrder, createdAt, updatedAt` (plus an internal `imagePublicId` used to delete images).
