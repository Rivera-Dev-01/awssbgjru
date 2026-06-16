# AWS Learning Club - Website

Website for the AWS Learning Club at José Rizal University. Features a mobile-first responsive design with an AI chatbot (Captain Hima) powered by Groq, member registration flow, event listings, department/office spotlights, and more.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML, CSS, JavaScript |
| Backend | Python 3.14+ · FastAPI |
| Database | Supabase (PostgreSQL) |
| AI Chat | Groq API (`llama3-8b-8192`) |
| Email | Gmail SMTP |
| Hosting | Render (backend) + Vercel (frontend) |
| Fonts | Poppins, Montserrat, Lexend, Lexend Deca |

## Project Structure

```
AWS-Website/
├── frontend/
│   ├── pages/                    # HTML pages
│   │   ├── landingPage.html      # Home / landing page
│   │   ├── about.html            # About the club
│   │   ├── events.html           # Events listing
│   │   ├── partners.html         # Partners & sponsors
│   │   ├── achievements.html     # Club achievements
│   │   ├── contact.html          # Contact form
│   │   ├── members.html          # Members dashboard
│   │   ├── register.html         # Registration — Phase 1 (Basic Details)
│   │   ├── explanation.html      # Registration — Phase 2 (Explanation)
│   │   ├── department.html       # Registration — Phase 3 (Pick Office/Skill Builder)
│   │   ├── office.html           # Office division selection
│   │   ├── skillbuilder.html     # Skill Builder division selection
│   │   ├── loading.html          # Loading animation (4s Lottie)
│   │   └── waiting-approval.html # Post-submission confirmation
│   │
│   ├── components/               # Reusable HTML partials
│   │   ├── header.html           # Navigation bar (loaded dynamically)
│   │   ├── footer.html           # Site footer (loaded dynamically)
│   │   ├── chatbot.html          # Chatbot widget UI
│   │   └── card.html             # Generic card template
│   │
│   ├── css/                      # Per-page + shared stylesheets
│   │   ├── landing-page.css      # Landing page styles
│   │   ├── about.css             # About page styles
│   │   ├── members.css           # Members dashboard styles
│   │   ├── register.css          # Registration flow styles
│   │   ├── waiting-approval.css  # Approval screen styles
│   │   ├── header.css            # Shared header component styles
│   │   ├── footer.css            # Shared footer component styles
│   │   └── chatbot.css           # Chatbot widget styles
│   │
│   ├── js/                       # JavaScript modules
│   │   ├── main.js               # loadComponent() for dynamic loading
│   │   ├── nav.js                # Navigation logic + header/footer loader
│   │   ├── members.js            # Members page interactions
│   │   ├── chatbot.js            # Chatbot UI toggle + SSE streaming
│   │   ├── events.js             # Events page card rendering
│   │   ├── future-cards.js       # Future section card rendering
│   │   ├── skill-queue.js        # Skill Builder interactive queue/spotlight
│   │   ├── gsap.js               # GSAP cloud animations
│   │   ├── register.js           # Registration Phase 1 logic + validation
│   │   ├── explanation.js        # Registration Phase 2 logic
│   │   ├── department.js         # Phase 3: office vs skill-builder choice
│   │   ├── office.js             # Office division pick + API submit
│   │   └── skillbuilder.js       # Skill Builder division pick + API submit
│   │
│   └── assets/                   # Organized per-page
│       ├── landing-page/         # Home page assets
│       ├── about/                # About page assets
│       ├── events/               # Events page assets
│       ├── members/              # Registration icons, badges, animations
│       │   ├── badges/           # Check, home, back icons + warning
│       │   ├── animation/        # Lottie loading animation JSON
│       │   └── icons/            # Custom dropdown, constraint icons
│       └── shared/               # Cross-page shared assets
│
├── backend/                      # FastAPI backend
│   ├── api/
│   │   ├── index.py              # FastAPI app (Vercel entry point)
│   │   ├── chatbot.py            # Groq streaming integration
│   │   ├── config.py             # Environment configuration
│   │   ├── guardrails.py         # Content safety checks
│   │   ├── rate_limiter.py       # IP-based rate limiting (20 req/min)
│   │   ├── cache.py              # In-memory TTL cache (5 min)
│   │   ├── prompts.py            # Captain Hima system prompt
│   │   ├── requirements.txt      # Python dependencies
│   │   └── .env.example          # Env var template
│   ├── main.py                   # Unified FastAPI app (local dev)
│   ├── database.py               # Supabase client init
│   ├── routers/
│   │   ├── registration.py       # POST /api/register + email notification
│   │   ├── members.py            # Members API endpoints
│   │   ├── events.py             # Events API endpoints
│   │   └── sponsors.py           # Sponsors API endpoints
│   ├── schemas/
│   │   └── registration.py       # Pydantic validation models
│   └── data/                     # JSON data files (events, partners, etc.)
│
├── vercel.json                   # Vercel deployment config
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
- **Waiting Approval**: Green progress indicator, checkmark badge, home badge (links to index), "Proceed to members" button

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/register` | Submit registration (validates + inserts to Supabase + email notification) |
| POST | `/api/chat` | Captain Hima AI chatbot (SSE stream) |

## Getting Started

### Prerequisites

- Python 3.8+
- Groq API key (free at https://console.groq.com/)
- Supabase account (free tier)
- Gmail account with app password for email notifications

### 1. Install Backend Dependencies

```bash
pip install -r backend/api/requirements.txt
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
# Start the backend (from project root)
uvicorn backend.main:app --reload --port 8000

# Serve frontend separately (e.g., Live Server on port 5500)
```

Open the frontend URL in your browser.

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

### Vercel (Frontend + Legacy API)

1. Push the repo to GitHub
2. Import in Vercel dashboard
3. Add environment variable: `GROQ_API_KEY`
4. Deploy — `vercel.json` handles routing

### Render (FastAPI Backend)

1. Create a new Web Service on Render
2. Point to the `backend/` directory
3. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add all environment variables from `.env`

## Development Notes

- Always serve via HTTP — `file://` breaks `fetch()` for component loading
- Registration pages use `sessionStorage` to pass data between steps
- The photo upload stores images as base64 directly in Supabase
- Python imports use either `backend.X` (local) or `X` (Vercel) depending on context
- Assets go in per-page folders under `frontend/assets/`
- Browser cache may cause stale CSS — use `Ctrl+F5` hard refresh
