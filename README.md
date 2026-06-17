# AWS Learning Club - Website

Website for the AWS Learning Club at José Rizal University. Features a mobile-first responsive design with an AI chatbot (Captain Hima) powered by Groq, member registration flow, event listings, department/office spotlights, and more.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML, CSS, JavaScript |
| Backend | Python 3.12 · FastAPI |
| Database | Supabase (PostgreSQL) |
| AI Chat | Groq API (`llama3-8b-8192`) |
| Email | Gmail SMTP |
| Hosting | Vercel (frontend + backend via serverless functions) |
| Fonts | Poppins, Montserrat, Lexend, Lexend Deca |

## Project Structure

```
AWS-Website/
├── frontend/
│   ├── pages/                        # HTML pages
│   │   ├── landing-page.html         # Home / landing page
│   │   ├── about.html                # About the club
│   │   ├── events.html               # Events listing
│   │   ├── event-detail.html         # Event detail view
│   │   ├── members.html              # Members dashboard
│   │   ├── register.html             # Registration — Phase 1 (Basic Details)
│   │   ├── explanation.html          # Registration — Phase 2 (Explanation)
│   │   ├── department.html           # Registration — Phase 3 (Pick Office/Skill Builder)
│   │   ├── office.html               # Office division selection
│   │   ├── skillbuilder.html         # Skill Builder division selection
│   │   ├── loading.html              # Loading animation (4s Lottie)
│   │   └── waiting-approval.html     # Post-submission confirmation
│   │
│   ├── components/                   # Reusable HTML partials
│   │   ├── header.html               # Navigation bar (loaded dynamically)
│   │   ├── footer.html               # Site footer (loaded dynamically)
│   │   ├── chatbot.html              # Chatbot widget UI
│   │   └── card.html                 # Generic card template
│   │
│   ├── css/                          # Per-page + shared stylesheets
│   │   ├── landing-page.css          # Landing page styles
│   │   ├── about.css                 # About page styles
│   │   ├── members.css               # Members dashboard styles
│   │   ├── register.css              # Registration flow styles
│   │   ├── events.css                # Events page styles
│   │   ├── event-detail.css          # Event detail styles
│   │   ├── waiting-approval.css      # Approval screen styles
│   │   ├── header.css                # Shared header component styles
│   │   ├── footer.css                # Shared footer component styles
│   │   ├── chatbot.css               # Chatbot widget styles
│   │   ├── department.css            # Department selection styles
│   │   ├── office.css                # Office selection styles
│   │   ├── skillbuilder.css          # Skill Builder selection styles
│   │   └── loading.css               # Loading page styles
│   │
│   ├── js/                           # JavaScript modules
│   │   ├── main.js                   # loadComponent() for dynamic loading
│   │   ├── nav.js                    # Navigation logic + header/footer loader
│   │   ├── members.js                # Members page interactions
│   │   ├── chatbot.js                # Chatbot UI toggle + SSE streaming
│   │   ├── events.js                 # Events page card rendering
│   │   ├── event-detail.js           # Event detail rendering (data-driven)
│   │   ├── future-cards.js           # Future section card rendering
│   │   ├── skill-queue.js            # Skill Builder interactive queue/spotlight
│   │   ├── gsap.js                   # GSAP cloud animations
│   │   ├── register.js               # Registration Phase 1 logic + validation
│   │   ├── explanation.js            # Registration Phase 2 logic
│   │   ├── department.js             # Phase 3: office vs skill-builder choice
│   │   ├── office.js                 # Office division pick + API submit
│   │   └── skillbuilder.js           # Skill Builder division pick + API submit
│   │
│   └── assets/                       # Organized per-page
│       ├── landing-page/
│       ├── about/
│       ├── events/
│       ├── members/
│       └── shared/
│
├── backend/                          # FastAPI backend
│   ├── api/
│   │   ├── index.py                  # FastAPI app (Vercel entry point)
│   │   ├── chatbot.py                # Groq streaming integration
│   │   ├── config.py                 # Environment configuration
│   │   ├── guardrails.py             # Content safety checks
│   │   ├── rate_limiter.py           # IP-based rate limiting (20 req/min)
│   │   ├── cache.py                  # In-memory TTL cache (5 min)
│   │   ├── prompts.py                # Captain Hima system prompt
│   │   ├── requirements.txt          # Python dependencies
│   │   └── .env.example              # Env var template
│   ├── main.py                       # Unified FastAPI app (local dev)
│   ├── database.py                   # Supabase client init
│   ├── routers/
│   │   ├── registration.py           # POST /api/register + email notification
│   │   ├── members.py                # Members API endpoints
│   │   ├── events.py                 # Events API endpoints
│   │   └── sponsors.py               # Sponsors API endpoints
│   ├── schemas/
│   │   └── registration.py           # Pydantic validation models
│   └── data/                         # JSON data files (events, partners, etc.)
│
├── requirements.txt                  # Root dependencies (Vercel build)
├── runtime.txt                       # Python 3.12 pin (Vercel)
├── vercel.json                       # Vercel deployment + rewrite config
├── serve.py                          # Local dev server with Vercel-like rewrites
└── .gitignore
```

## Member Registration Flow

A 3-phase signup process that collects member details, validates inputs, and stores data in Supabase.

### Phase 1 — Basic Details (`register.html`)
- Full name, Student ID, Email, Year, Program, Date of Birth, Photo upload
- Custom dropdowns for Year and Program
- Photo preview via file input
- Saves to `sessionStorage.regBasic`

### Phase 2 — Explanation (`explanation.html`)
- Free-text area for "Why do you want to join?"
- Frontend validation (required)
- Saves to `sessionStorage.regExplanation`

### Phase 3 — Department Choice (`department.html`)
- Two cards: **Office** or **Skill Builder**
- Click → redirects to office.html or skillbuilder.html

### Office / Skill Builder Pages
- Grid of division pills (e.g., Technology, Creatives, Marketing)
- Constraint validation (must pick one)
- Gathers all `sessionStorage` data and POSTs to `/api/register`
- On success → `loading.html` → `waiting-approval.html`

### Loading & Approval
- **Loading**: 270×270px Lottie animation via `@dotlottie/player-component`, 4s timeout
- **Waiting Approval**: Green progress indicator, checkmark badge, home button, "Proceed to members" link

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/register` | Submit registration (validates + inserts to Supabase + email notification) |
| POST | `/api/chat` | Captain Hima AI chatbot (SSE stream) |
| GET | `/api/health` | Health check |
| GET | `/api/_debug` | Diagnostic endpoint (env vars, Python version) |

## Getting Started

### Prerequisites

- Python 3.12+
- Groq API key (free at https://console.groq.com/)
- Supabase account (free tier)
- Gmail account with app password for email notifications

### 1. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Environment Variables

```bash
cp backend/api/.env.example backend/api/.env
```

Edit `backend/api/.env`:

```
GROQ_API_KEY=gsk_your_key_here

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_app_password
NOTIFY_EMAIL=notifications@example.com
```

### 3. Run Locally

```bash
# Terminal 1 — Frontend dev server (clean URLs, Vercel-like rewrites)
python serve.py

# Terminal 2 — Backend API
uvicorn backend.main:app --reload --port 8001
```

Open `http://localhost:8000` for the frontend. The backend runs on port 8001 and the frontend rewrites `/api/*` requests accordingly (or configure `serve.py` to proxy).

## Vercel Clean URLs

Navigation uses relative `.html` paths (e.g., `events.html`, `members.html`) so pages work when opened directly from the file system. On Vercel, `vercel.json` rewrites map both clean URLs (`/events`) and extension URLs (`/events.html`) to the correct file in `frontend/pages/`.

## Architecture

### Registration Data Flow

```
register.html → sessionStorage.regBasic
       ↓
explanation.html → sessionStorage.regExplanation
       ↓
department.html → sessionStorage.regDept
       ↓
office.html / skillbuilder.html
       ↓  POST /api/register (JSON body)
       ↓
FastAPI validates → inserts to Supabase → sends email notification
       ↓
loading.html (4s) → waiting-approval.html
```

### Chatbot

The **Captain Hima** chatbot ("Chat with Captain Hima") appears as a floating pill button on every page. It uses `llama3-8b-8192` via Groq with SSE streaming responses.

| Layer | File | Purpose |
|-------|------|---------|
| UI | `frontend/components/chatbot.html` | Floating panel markup |
| Styles | `frontend/css/chatbot.css` | Panel, messages, input, trigger styling |
| Client | `frontend/js/chatbot.js` | Toggle, send, SSE stream reader |
| API | `backend/api/index.py` | FastAPI `/api/chat` POST endpoint |
| Engine | `backend/api/chatbot.py` | Groq streaming call |
| Safety | `backend/api/guardrails.py` | Content filtering |
| Rate Limit | `backend/api/rate_limiter.py` | 20 requests/min per IP |
| Cache | `backend/api/cache.py` | 5-min TTL for identical queries |
| Prompt | `backend/api/prompts.py` | Captain Hima persona |

## Deploying

### Vercel (Frontend + Backend)

1. Push the repo to GitHub
2. Import in Vercel dashboard
3. Set Vercel project's `rootDirectory` to blank (not `frontend`)
4. Add all environment variables from `.env`
5. Deploy — `vercel.json` handles routing and Python serverless functions

The Python backend runs as a serverless function via `backend/api/index.py`. The frontend is served as static files with rewrite rules for clean URLs.

## Development Notes

- Use `python serve.py` for local frontend dev (Vercel-like rewrites)
- Always serve via HTTP — `file://` breaks `fetch()` for component loading
- Registration pages use `sessionStorage` to pass data between steps
- The photo upload stores images as base64 directly in Supabase
- Python imports in `backend/api/` use relative imports (`import config`) for Vercel compatibility; `backend/main.py` adds `backend/api/` to `sys.path` for local dev
- Assets go in per-page folders under `frontend/assets/`
- Browser cache may cause stale CSS — use `Ctrl+F5` hard refresh
