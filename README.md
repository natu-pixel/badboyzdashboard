#badboyz — Admin Dashboard

IPTV activation code & subscriber management dashboard.  
Built with **Next.js 14** (App Router) + **Supabase** + **TypeScript**.

---

## Stack

| Layer       | Tech                        |
|-------------|-----------------------------|
| Frontend    | Next.js 14 (App Router)     |
| Styling     | Tailwind CSS + CSS variables |
| Backend     | Supabase (Postgres + Auth)  |
| Language    | TypeScript                  |

---

## Setup

### 1. Clone & install

```bash
cd streamos-dashboard
npm install
```

### 2. Create Supabase project

1. Go to https://app.supabase.com → New project
2. Copy your project URL and anon key

### 3. Configure environment

```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

### 4. Run the database schema

In Supabase → SQL Editor, paste and run the contents of `supabase/schema.sql`.

### 5. Create admin user

In Supabase → Authentication → Users → Add user  
(or use `supabase.auth.signUp()` once)

### 6. Run dev server

```bash
npm run dev
# → http://localhost:3000
```

---

## Pages

| Route                          | Description                    |
|--------------------------------|--------------------------------|
| `/dashboard`                   | Overview + metrics             |
| `/dashboard/codes`             | Generate & manage codes        |
| `/dashboard/users`             | Subscriber management          |
| `/dashboard/devices`           | Device registry & limits       |
| `/dashboard/playlists`         | Playlist assignment            |
| `/dashboard/announcements`     | Push messages to devices       |

---

## Android TV API Endpoints

| Endpoint                  | Method | Description                        |
|---------------------------|--------|------------------------------------|
| `/api/validate-code`      | POST   | Validate code, register device     |
| `/api/announcements`      | GET    | Fetch push announcements           |

### Validate code (Android TV calls this on launch)

```kotlin
// POST /api/validate-code
// Body:
{
  "code": "X82KQ",
  "android_id": "a1b2c3d4e5f6",
  "tv_name": "Samsung 65\""
}

// Response:
{
  "valid": true,
  "playlist_url": "https://...",
  "message": "Activated successfully"
}
```

---

## Database Schema

See `supabase/schema.sql` for full schema.

Key tables:
- `activation_codes` — codes linked to playlists, users, expiry, device limits
- `subscribers` — IPTV users (separate from Supabase auth users)
- `devices` — registered Android TVs with Android ID tracking
- `playlists` — Xtream or M3U sources
- `announcements` — push messages

---

## Deployment

### Vercel (recommended)

```bash
npm i -g vercel
vercel
# Set env vars in Vercel dashboard
```

### Self-hosted

```bash
npm run build
npm start
```
