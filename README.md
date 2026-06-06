# AWS Learning Club Website

Welcome to the AWS Learning Club website project! A beginner-friendly web application with a **Cumulus Helm**-themed chatbot powered by Groq AI.

## Project Structure

```
AWS-Website/
├── frontend/                     # Static frontend
│   ├── pages/                    # HTML pages
│   │   ├── landingPage.html      # Landing page
│   │   ├── about.html            # About page
│   │   ├── events.html           # Events page
│   │   ├── partners.html         # Partners page
│   │   ├── achievements.html     # Achievements page
│   │   └── contact.html          # Contact page
│   ├── components/               # Reusable HTML partials
│   │   ├── header.html           # Navigation header
│   │   ├── footer.html           # Site footer
│   │   ├── card.html             # Card template
│   │   └── chatbot.html          # Chatbot widget (Cumulus Helm)
│   ├── css/
│   │   ├── styles.css            # Main styles
│   │   ├── landing-page.css      # Landing page styles
│   │   ├── header.css            # Header styles
│   │   ├── footer.css            # Footer styles
│   │   └── chatbot.css           # Chatbot styles
│   ├── js/
│   │   ├── main.js               # Template loader
│   │   ├── nav.js                # Navigation logic
│   │   ├── gsap.js               # Cloud animations
│   │   ├── events.js             # Events page logic
│   │   ├── future-cards.js       # Future section cards
│   │   └── chatbot.js            # Chatbot UI + SSE streaming
│   └── assets/                   # Images, icons, mascot
│
├── backend/                      # Backend
│   ├── api/                      # FastAPI chatbot API
│   │   ├── index.py              # FastAPI app (entry point for Vercel)
│   │   ├── chatbot.py            # Groq API integration (streaming)
│   │   ├── config.py             # Environment configuration
│   │   ├── guardrails.py         # Content safety checks
│   │   ├── rate_limiter.py       # IP-based rate limiting
│   │   ├── cache.py              # In-memory TTL cache
│   │   ├── prompts.py            # Captain Hima system prompt
│   │   ├── requirements.txt      # Python dependencies
│   │   ├── .env.example          # Environment variable template
│   │   └── .env                  # Local env vars (gitignored)
│   └── data/                     # JSON data files
│       ├── events.json
│       ├── partners.json
│       ├── achievements.json
│       └── team.json
│
├── vercel.json                   # Vercel deployment config
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- **Python 3.8+** - [Download here](https://www.python.org/downloads/)
- **Groq API key** - [Get one free](https://console.groq.com/)

### 1. Install Dependencies

```bash
cd backend/api
pip install -r requirements.txt
```

### 2. Set Environment Variables

Copy the example env file and add your Groq key:

```bash
copy backend/api/.env.example backend/api/.env
```

Then edit `backend/api/.env` and set:

```
GROQ_API_KEY=gsk_your_key_here
```

### 3. Run the Backend (API + Frontend)

From the project root, run:

```bash
uvicorn backend.api.index:app --reload --port 8001 --host 0.0.0.0
```

Or navigate to `backend/` first:

```bash
cd backend
uvicorn api.index:app --reload --port 8001 --host 0.0.0.0
```

Open `http://localhost:8001` in your browser — the frontend and API are served from the same port.

## Chatbot

The **Cumulus Helm** chatbot ("Chat with Hima") appears as a floating pill button on every page. Powered by `llama3-8b-8192` via Groq with streaming responses.

### How It Works

```
User types message
       ↓
Frontend creates empty bot bubble
       ↓
POST /api/chat  { "message": "..." }
       ↓
Backend: rate limit check → guardrails → cache lookup → Groq API (stream)
       ↓
SSE stream: tokens arrive one by one
       ↓
Frontend appends tokens to bot bubble in real-time
```

### Architecture

| Layer | File | Purpose |
|---|---|---|
| UI | `frontend/components/chatbot.html` | Chat widget HTML |
| Styles | `frontend/css/chatbot.css` | Cumulus Helm styling |
| Client | `frontend/js/chatbot.js` | Toggle, send, SSE streaming |
| API | `backend/api/index.py` | FastAPI endpoints |
| Engine | `backend/api/chatbot.py` | Groq integration |
| Safety | `backend/api/guardrails.py` | Content filtering |
| Rate Limit | `backend/api/rate_limiter.py` | 20 req/min per IP |
| Cache | `backend/api/cache.py` | 5-min TTL for identical queries |
| Prompt | `backend/api/prompts.py` | Captain Hima persona |

## Deploying to Vercel

1. Push the repo to GitHub
2. Import it in Vercel
3. Add environment variable in Vercel dashboard → Settings → Environment Variables:
   - `GROQ_API_KEY` = your Groq API key
4. Deploy — `vercel.json` handles routing:
   - `/api/*` → Python serverless function
   - `/*` → static frontend files

## Development Notes

- The backend auto-reloads when you change files (thanks to `--reload`)
- Rate limit resets every 60 seconds
- Identical messages within 5 minutes return cached responses
- All CSS uses `Poppins` font family matching the existing site design
- The chatbot trigger toggles open/close on click

## Common Tasks

- **Change the system prompt**: Edit `backend/api/prompts.py`
- **Adjust rate limits**: Edit `backend/api/config.py`
- **Update chatbot styles**: Edit `frontend/css/chatbot.css`
- **Modify streaming behavior**: Edit `frontend/js/chatbot.js`
