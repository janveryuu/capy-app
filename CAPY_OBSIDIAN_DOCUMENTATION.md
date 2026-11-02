# 🧋 Capy — Deep Project Architecture & System Documentation

```yaml
---
title: Capy - Cozy AI Mood & Travel Companion
tags:
  - project/capy
  - tech/nextjs16
  - tech/react19
  - tech/prisma
  - tech/postgresql
  - tech/gemini-ai
  - tech/tailwind4
  - architecture/fullstack
date: 2026-09-04
status: Production / Active
production_web: https://capy-app-fawn.vercel.app/
production_mobile: https://capy-app-wtj1.vercel.app/login
repo: janveryuu/capy-app
---
```

> [!ABSTRACT] Executive Summary
> **Capy** is a full-stack, mindfulness-oriented web and mobile application designed around a cozy, warm Capybara theme. It blends **mental health journaling and mood tracking**, **mindful travel exploration and planning**, a **box-breathing relaxation engine**, and an **empathetic real-time conversational AI companion** powered by Google Gemini.
> 
> Built on **Next.js 16 (React 19)**, **PostgreSQL with Prisma 7**, **NextAuth.js v5**, and **Tailwind CSS v4 (OKLCH color space)**, Capy features a dual-interface architecture serving both desktop and mobile layouts from a single unified codebase.

---

## 📑 Table of Contents
1. [[#🌐 System Architecture & High-Level Design]]
2. [[#🛠️ Technology Stack & Dependencies]]
3. [[#📂 Repository & File Structure]]
4. [[#🗄️ Database Architecture & Data Models]]
5. [[#🔐 Authentication & Session Management (NextAuth v5)]]
6. [[#🤖 AI Companion Engine ("Ask Capy" Streaming Pipeline)]]
7. [[#🌿 Core Feature Deep Dive]]
   - [[#1. Mood Tracking & Journaling]]
   - [[#2. Mood Garden Heatmap & Visual Analytics]]
   - [[#3. Breathe With Capy (Box-Breathing Engine)]]
   - [[#4. Travel Planner & Destination Explorer]]
   - [[#5. Polaroid Memories Gallery]]
8. [[#🎨 UI/UX Design System & Animation Architecture]]
9. [[#⚡ Server Actions & Data Mutation Flow]]
10. [[#🚀 Environment Configuration & Deployment]]

---

## 🌐 System Architecture & High-Level Design

Capy is structured as a modern hybrid application with server-side rendering (SSR), client-side interactivity, server actions for database mutations, and server-sent streaming for AI responses.

### High-Level Architecture Diagram

```mermaid
flowchart TB
    subgraph Clients["Dual Client Frontends"]
        DesktopUI["🖥️ Desktop Experience<br/>(/web, components/capy)"]
        MobileUI["📱 Mobile Experience<br/>(/mobile, components/capy-mobile)"]
    end

    subgraph AppRouter["Next.js 16 App Router"]
        RouteSwitch{"Route / App Mode Switcher<br/>(process.env.NEXT_PUBLIC_APP_MODE)"}
        AuthRoute["/api/auth/[...nextauth]"]
        ChatRoute["/api/chat (Streaming Route)"]
        ServerActions["Server Actions (app/actions.ts)"]
    end

    subgraph AuthLayer["Auth Layer (NextAuth.js v5 Beta)"]
        GoogleOAuth["Google Cloud OAuth 2.0"]
        CredentialsAuth["Credentials Provider (bcryptjs)"]
    end

    subgraph AILayer["AI Infrastructure"]
        GeminiAPI["Google Generative AI<br/>(gemini-2.5-flash)"]
    end

    subgraph DataLayer["Database & Persistence"]
        PrismaORM["Prisma 7 Client + pg.Pool Adapter"]
        PostgresDB[("PostgreSQL Database<br/>(Supabase / Neon)")]
    end

    DesktopUI --> RouteSwitch
    MobileUI --> RouteSwitch
    RouteSwitch --> ServerActions
    RouteSwitch --> ChatRoute
    RouteSwitch --> AuthRoute

    AuthRoute --> AuthLayer
    AuthLayer --> PrismaORM
    ChatRoute --> GeminiAPI
    ServerActions --> PrismaORM
    PrismaORM --> PostgresDB
```

### Dual-Platform Routing Strategy
Rather than maintaining separate repositories, Capy uses an adaptive architecture:
1. **Dynamic Environment Variable (`NEXT_PUBLIC_APP_MODE`)**:
   - In production for Desktop (`https://capy-app-fawn.vercel.app/`), `NEXT_PUBLIC_APP_MODE=web` forces `<CapyApp />`.
   - In production for Mobile (`https://capy-app-wtj1.vercel.app/`), `NEXT_PUBLIC_APP_MODE=mobile` forces `<CapyMobileApp />`.
2. **Dedicated Routes**:
   - `/web` directly renders the desktop dashboard and layout.
   - `/mobile` directly renders the mobile phone-viewport container (max 400px width with bottom tab navigation).
3. **Local Dev Fallback**:
   - If `NEXT_PUBLIC_APP_MODE` is undefined, `app/page.tsx` and `app/login/page.tsx` toggle between desktop and mobile using Tailwind responsive breakpoint utilities (`hidden md:block` / `block md:hidden`).

---

## 🛠️ Technology Stack & Dependencies

| Category | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js | `16.2.6` (App Router) | Full-stack framework with React 19 support |
| **Language** | TypeScript | `5.7.3` | Type safety and schema enforcement |
| **UI Library** | React / React DOM | `19.0.0` | Latest concurrent React features & actions |
| **Database & ORM** | PostgreSQL | `v15+` | Primary relational data store |
| | Prisma ORM | `^7.8.0` | Type-safe query builder and database migrations |
| | `@prisma/adapter-pg` / `pg` | `^7.8.0` / `^8.22.0` | Connection pool driver for Postgres |
| **Authentication** | NextAuth.js (Auth.js) | `^5.0.0-beta.31` | JWT session strategy, Google OAuth, Credentials |
| | `@auth/prisma-adapter` | `^2.11.2` | Persistent account/session storage in Prisma |
| | `bcryptjs` | `^3.0.3` | One-way password hashing for local credentials |
| **AI Companion** | `@google/generative-ai` | `^0.24.1` | Direct SDK connection to Gemini 2.5 Flash |
| | Vercel AI SDK (`ai`) | `^6.0.208` | Unified streaming utilities |
| **Styling & Design** | Tailwind CSS | `^4.2.0` | Utility-first CSS using modern `@theme inline` |
| | Motion (Framer Motion) | `^12.40.0` | Physics-based spring animations and cross-fades |
| | `lucide-react` | `^1.16.0` | Scalable UI iconography |
| | `next-themes` | `^0.4.6` | System/light/dark mode toggle engine |
| **Telemetry** | `@vercel/analytics` | `1.6.1` | Web vitals and user traffic monitoring |

---

## 📂 Repository & File Structure

```
CAPY/
├── .agents/
│   └── AGENTS.md                 # Agent context & deployment memory
├── app/
│   ├── actions.ts                # Next.js Server Actions (CRUD for moods, trips, memories)
│   ├── globals.css               # Tailwind v4 theme, OKLCH tokens, animations
│   ├── layout.tsx                # Root HTML layout, Fredoka/Nunito fonts, Providers
│   ├── page.tsx                  # Root landing: Auth check & Web/Mobile viewport router
│   ├── login/
│   │   └── page.tsx              # Split Login page (Web / Mobile switch)
│   ├── web/
│   │   └── page.tsx              # Force Desktop view (/web)
│   ├── mobile/
│   │   └── page.tsx              # Force Mobile view (/mobile)
│   └── api/
│       ├── auth/[...nextauth]/
│       │   └── route.ts          # NextAuth API handlers (GET/POST)
│       └── chat/
│           └── route.ts          # Streaming Gemini 2.5 Flash API endpoint
├── auth.ts                       # NextAuth v5 configuration, adapter, credentials logic
├── components/
│   ├── providers.tsx             # SessionProvider + ThemeProvider wrapper
│   ├── auth/                     # Authentication components
│   │   ├── capy-auth.tsx         # Desktop split login/signup modal & mascot banner
│   │   ├── capy-mobile-auth.tsx  # Mobile-optimized cozy auth card
│   │   ├── capy-story-modal.tsx  # Interactive mascot backstory popup
│   │   ├── login-form.tsx        # Email/password form with validation
│   │   ├── signup-form.tsx       # Account creation form
│   │   ├── forgot-password-form.tsx # Password reset UI
│   │   ├── google-button.tsx     # Google OAuth trigger button with spinner
│   │   ├── cozy-button.tsx       # Reusable squishy action button
│   │   └── cozy-field.tsx        # Cozy-styled rounded form input
│   ├── capy/                     # Desktop / Web Components
│   │   ├── capy-app.tsx          # Desktop layout shell, tab router, bottom pill nav
│   │   ├── dashboard.tsx         # Greeting hero, streak counters, mini trip preview
│   │   ├── mood-checkin.tsx      # 3-step daily check-in (pick -> context -> celebrate)
│   │   ├── mood-analytics.tsx    # 12-week heatmap, area wave chart, factor correlation
│   │   ├── travel.tsx            # Travel manager (Explore sub-tab + My Trips sub-tab)
│   │   ├── explore.tsx           # Daily rotating destination cards with search/filters
│   │   ├── create-trip-modal.tsx # Destination planning modal
│   │   ├── add-memory-modal.tsx  # Polaroid memory upload modal
│   │   ├── breathe-with-capy.tsx # 4x4 box-breathing SVG orb engine
│   │   ├── capy-chat.tsx         # Real-time streaming AI chatbot interface
│   │   └── capy-mascot.tsx       # Animated SVG/PNG interactive mascot
│   ├── capy-mobile/              # Mobile-First Components
│   │   ├── capy-mobile-app.tsx   # 400px centered mobile shell & state coordinator
│   │   ├── bottom-nav.tsx        # Mobile tab bar with spring pill indicator
│   │   ├── home-screen.tsx       # Mobile check-in, quick stats, upcoming trip preview
│   │   ├── mood-screen.tsx       # Mobile mood heatmap & reflections timeline
│   │   ├── travel-screen.tsx     # Mobile explore feed & travel cards
│   │   ├── profile-screen.tsx    # User stats, dark mode toggle, reminders, sign out
│   │   ├── mood-picker.tsx       # Mobile-tailored mood bubble selector
│   │   └── capy-mobile-mascot.tsx # Animated mobile avatar
│   └── ui/                       # shadcn/ui primitives (button, checkbox, input, label)
├── lib/
│   ├── capy-data.ts              # Desktop static data, destination pool, mood definitions
│   ├── capy-mobile-data.ts       # Mobile-specific data structures & initial seed states
│   └── utils.ts                  # clsx & tailwind-merge helper (cn())
├── prisma/
│   ├── schema.prisma             # PostgreSQL schema definition
│   └── prisma.config.ts          # Database generator settings
├── public/                       # Static mascot graphics, polaroids, travel photography
│   └── destinations/             # Curated destination images (Santorini, Kyoto, etc.)
├── next.config.mjs               # Turbopack external packages, server actions limit
└── package.json                  # Scripts and dependencies
```

---

## 🗄️ Database Architecture & Data Models

The database is built on **PostgreSQL** and managed using **Prisma 7**. To ensure compatibility with serverless environments (Vercel) without exhausting connection limits, Prisma utilizes a pooled PostgreSQL connection (`@prisma/adapter-pg` wrapping `pg.Pool`).

```mermaid
erDiagram
    User ||--o{ Account : "has many"
    User ||--o{ Session : "has many"
    User ||--o{ PlannedTrip : "creates"
    User ||--o{ Memory : "stores"
    User ||--o{ MoodEntry : "logs"

    User {
        String id PK "cuid"
        String name
        String email UK
        String password "hashed with bcrypt"
        DateTime emailVerified
        String image
        DateTime createdAt
        DateTime updatedAt
    }

    Account {
        String id PK "cuid"
        String userId FK
        String type
        String provider
        String providerAccountId
        String refresh_token
        String access_token
        Int expires_at
        String token_type
        String scope
        String id_token
        String session_state
    }

    Session {
        String id PK "cuid"
        String sessionToken UK
        String userId FK
        DateTime expires
    }

    MoodEntry {
        String id PK "uuid"
        String userId FK
        Int moodId "1 (Stressed) to 5 (Amazing)"
        String[] tags "e.g. ['friends', 'food']"
        String note "Up to 200 chars"
        DateTime timestamp
    }

    PlannedTrip {
        String id PK "uuid"
        String userId FK
        String destination
        String country
        String dateRange
        String emoji
        Int days
        String note
        String status "'planned' or 'completed'"
        DateTime createdAt
        DateTime updatedAt
    }

    Memory {
        String id PK "uuid"
        String userId FK
        String src "Image URL"
        String caption
        String location
        Float rotate "Tilt angle for Polaroid UI (-6 to +6)"
        DateTime createdAt
    }
```

### Key Prisma Models Breakdown
1. **`User`**: Central identity node. Links NextAuth accounts, sessions, and all user-generated wellness and travel data.
2. **`MoodEntry`**: Captures granular emotional snapshots. Stores `moodId` (1–5 corresponding to Stressed, Low, Okay, Good, Amazing), an array of contextual tag strings (`tags: ["sleep", "exercise"]`), and an optional written reflection (`note`).
3. **`PlannedTrip`**: Represents trips scheduled by the user. Includes flight/destination countdown days, custom emoji markers, and status (`planned` vs `completed`).
4. **`Memory`**: Stores cozy polaroid snapshots. Stores image paths, captions, geographical tags, and a pseudo-random rotation angle (`rotate`) that persists the visual polaroid tilt.

---

## 🔐 Authentication & Session Management (NextAuth v5)

Configured in [auth.ts](file:///c:/Users/LEGION/Documents/CAPY/auth.ts), Capy runs on **NextAuth.js v5 Beta** (`@auth/prisma-adapter`).

### Supported Authentication Methods
1. **Google OAuth 2.0**:
   - One-tap sign-in with offline access and account linking (`allowDangerousEmailAccountLinking: true`).
2. **Credentials Authentication with Auto-Signup**:
   - Users can register and log in using an email and password.
   - **Auto-Account Creation**: If a user submits credentials for an email that does not exist yet, the `authorize` callback automatically hashes the password using `bcryptjs` (salt rounds: `10`) and provisions a new `User` record on the fly.
   - Returns a custom `CredentialsSignin` error if the password does not match.

### Session Strategy
- **Strategy:** `jwt` (JSON Web Tokens).
- **Callbacks:**
  ```typescript
  async session({ session, token }) {
    if (token?.sub) {
      session.user.id = token.sub; // Exposes user database ID to client session
    }
    return session;
  }
  ```
- **Route Protection:** Handled at the page level (`app/page.tsx`, `app/web/page.tsx`, `app/mobile/page.tsx`). If `const session = await auth()` returns `null`, the request is immediately redirected to `/login`.

---

## 🤖 AI Companion Engine ("Ask Capy" Streaming Pipeline)

Capy features an embedded AI friend accessible on both desktop and mobile.

### Architecture Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Client
    participant Hook as useCapyChat() Hook
    participant API as /api/chat Route
    participant Gemini as Google Gemini 2.5 Flash

    User->>Hook: Submits prompt ("I feel anxious today")
    Hook->>Hook: Optimistically render user message & empty assistant placeholder
    Hook->>API: POST /api/chat { messages: [...] }
    API->>API: Normalize messages (merge consecutive roles, guarantee user start)
    API->>Gemini: Start chat stream with System Persona
    Gemini-->>API: Yields text chunks
    API-->>Hook: HTTP 200 Streaming Response (ReadableStream)
    loop Stream reader
        Hook->>Hook: Decode chunk & append to assistant message in-place
        Hook->>User: Renders real-time text generation
    end
```

### Capy's System Persona
Configured in [app/api/chat/route.ts](file:///c:/Users/LEGION/Documents/CAPY/app/api/chat/route.ts):
```text
You are Capy, a cozy, supportive, and friendly capybara companion.
Your job is to listen, chat, and help the user feel a little better about their day.

Guidelines:
- Keep your responses relatively short, empathetic, simple, and supportive.
- Occasionally use capybara or nature emojis (🦦, 🌿, 🤎, ✨, ☁️).
- Remember you are a capybara. You love warm puddles, eating grass, and taking things slow.
- Do not break character. Do not be overly verbose or sound like an AI assistant. Be a chill friend.
```

### Resilience & Message Normalization
Gemini requires strict alternating roles (`user` ➔ `model` ➔ `user`). To prevent API rejection:
- Consecutive messages from the same role are automatically concatenated into a single string.
- Any leading assistant messages are pruned to guarantee the interaction begins with `user`.

---

## 🌿 Core Feature Deep Dive

### 1. Mood Tracking & Journaling
The core interaction loop of Capy is its **3-Step Mood Check-in**:
- **Step 1: Emotion Selection**:
  5 defined emotional levels mapped to custom colors and Lucide icons:
  - `5 - Amazing`: Laugh icon, Matcha green (`oklch(0.86 0.08 138)`)
  - `4 - Good`: Smile icon, Honey yellow (`oklch(0.88 0.11 92)`)
  - `3 - Okay`: Meh icon, Warm tan
  - `2 - Low`: Frown icon, Caramel (`oklch(0.7 0.11 58)`)
  - `1 - Stressed`: CloudRain icon, Soft coral destructive
- **Step 2: Contextual Influences & Reflection**:
  Users can select contextual tags (`Sleep`, `Work`, `Friends`, `Exercise`, `Weather`, `Food`) and write an optional journal note up to 200 characters.
- **Step 3: Celebration & Adaptive Care**:
  Triggers a confetti animation (`PartyPopper`). If the user logs a **Low** or **Stressed** mood (score $\le 2$), the UI dynamically offers an inline action: **"Breathe with Capy"**.

### 2. Mood Garden Heatmap & Visual Analytics
- **GitHub-Style 12-Week Mood Garden**:
  - Displays a grid of 84 days (12 weeks $\times$ 7 days).
  - Uses deterministic seeded random generation (`seededRandom(42)`) to prevent server/client hydration mismatches, while seamlessly merging live database entries.
- **Weekly Trend Wave**:
  - Custom SVG Area Chart computing a smooth cubic Bézier spline curve (`smoothPath()`) through 7-day mood averages.
  - Filled with an OKLCH gradient from Matcha to Honey.
- **Factor Correlation (Diverging Bar Chart)**:
  - Analyzes which tags positively lift the mood versus which tags weigh on the user.

### 3. Breathe With Capy (Box-Breathing Engine)
Located in `components/capy/breathe-with-capy.tsx`:
- Implements standard **Square / Box Breathing** (16-second cycle):
  1. **Breathe in** (4s) $\rightarrow$ Orb expands ($1.0 \rightarrow 1.3\times$), Capy inhale mascot appears.
  2. **Hold** (4s) $\rightarrow$ Orb remains expanded.
  3. **Breathe out** (4s) $\rightarrow$ Orb contracts ($1.3 \rightarrow 1.0\times$), Capy exhale mascot appears.
  4. **Hold** (4s) $\rightarrow$ Orb remains contracted.
- Features a synchronized SVG progress ring computing stroke-dashoffset:
  $$\text{circumference} = 2 \times \pi \times 78 \approx 490.08\text{px}$$
- Tracks completed cycle counts.

### 4. Travel Planner & Destination Explorer
- **Curated Destination Pool**: 30+ destinations (Santorini, Kyoto, Maldives, Banff, Cappadocia, etc.) with stored metadata: temperature, country, photography, and vibe tags (`Cozy`, `Adventure`, `Tropical`, `Zen`, `Sunny`, `Romantic`, `Cultural`, `Nature`).
- **Daily Seeded Rotation (`getDailyDestinations`)**:
  - Calculates an integer hash of the current calendar date (`YYYY-M-D`).
  - Runs a linear congruential generator (LCG) shuffle so every user across the globe sees the exact same **4 Grid Picks + 1 Spotlight Destination** on any given day without SSR mismatch.
- **Trip Scheduler**: Users can create upcoming trips, set target dates, assign emojis, and track a live countdown ("Days until takeoff").

### 5. Polaroid Memories Gallery
- Renders past travel moments as nostalgic physical Polaroids.
- Features realistic washi-tape decorations, subtle sepia filters (`[filter:saturate(0.8)_blur(0.8px)_sepia(0.15)]`), and dynamic tilt rotation angles (`-6°` to `+6°`).
- Hovering over any Polaroid un-tilts it, scales it up, removes the sepia filter, and elevates its `z-index`.

---

## 🎨 UI/UX Design System & Animation Architecture

Capy is built around a custom "Warm Paper & Tea" aesthetic, avoiding harsh contrast or stark dark colors.

### OKLCH Color Palette
The color tokens are declared in [app/globals.css](file:///c:/Users/LEGION/Documents/CAPY/app/globals.css) using modern CSS `@theme inline` and OKLCH definitions:

| Token | Light Value | Visual Description |
| :--- | :--- | :--- |
| `--background` | `oklch(0.971 0.018 78)` | Warm oat milk / cream canvas |
| `--foreground` | `oklch(0.31 0.045 52)` | Rich espresso dark brown |
| `--card` | `oklch(0.985 0.014 84)` | Soft ivory card surface |
| `--caramel` | `oklch(0.7 0.11 58)` | Warm toasted caramel accent |
| `--matcha` | `oklch(0.86 0.08 138)` | Calming soft green |
| `--honey` | `oklch(0.88 0.11 92)` | Gentle honey golden yellow |

### Textures & Effects
- **`.capy-paper`**: A subtle radial dotted grid (`background-size: 22px 22px`) simulating a textured physical journal.
- **`.capy-glass`**: Frosted glassmorphism navigation container with `backdrop-filter: blur(14px)`.
- **Typography**:
  - Headings: `Fredoka` (soft, rounded, cheerful).
  - Body: `Nunito` (high readability, approachable).
  - Mono: `Geist Mono`.

### Physics & Motion
Animations leverage Framer Motion (`motion/react`) with spring physics rather than linear CSS transitions:
- Tap feedback: `whileTap={{ scale: 0.92 }}`
- Card lift: `whileHover={{ y: -4, scale: 1.02 }}`
- Layout ID pills: Tab switches smoothly glide across buttons using `<motion.span layoutId="capy-nav-pill" />`.

---

## ⚡ Server Actions & Data Mutation Flow

Located in [app/actions.ts](file:///c:/Users/LEGION/Documents/CAPY/app/actions.ts), all database mutations execute securely via Next.js Server Actions with zero client-side exposed database credentials.

```mermaid
sequenceDiagram
    autonumber
    participant Client as React Client Component
    participant ServerAction as Server Action (actions.ts)
    participant Auth as auth() Session Check
    participant DB as PostgreSQL (via Prisma)
    participant Cache as Next.js Cache Revalidation

    Client->>ServerAction: createMoodEntry(moodId, tags, note)
    ServerAction->>Auth: Validate session
    alt Unauthorized
        Auth-->>Client: Error: Unauthorized
    else Authorized
        ServerAction->>DB: prisma.moodEntry.create({ data: { userId, moodId, tags, note } })
        DB-->>ServerAction: Entry created
        ServerAction->>Cache: revalidatePath('/dashboard')
        ServerAction-->>Client: Void / Success
        Client->>ServerAction: getMoodEntries()
        ServerAction->>DB: prisma.moodEntry.findMany({ where: { userId } })
        DB-->>Client: Return updated MoodEntry[]
    end
```

### Exported Server Actions
1. `createMoodEntry(moodId: number, tags: string[], note?: string)`: Stores mood and triggers path revalidation.
2. `getMoodEntries(): Promise<MoodEntry[]>`: Queries user mood history sorted by timestamp descending, computing relative human times (`"2 hours ago"`).
3. `createPlannedTrip(data)`: Persists a new travel itinerary.
4. `getPlannedTrips()`: Fetches planned and completed trips.
5. `createMemory(data)`: Saves a polaroid picture record.
6. `getMemories()`: Queries all saved polaroid items.

---

## 🚀 Environment Configuration & Deployment

### Required Environment Variables (`.env.local`)

```env
# ─── PostgreSQL Database (Pooled Connection) ───
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# ─── NextAuth Configuration ───
AUTH_SECRET="your_generated_secret_key" # Generated via `npx auth secret`

# ─── Google OAuth (Google Cloud Console) ───
GOOGLE_CLIENT_ID="xxxx-xxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxx"

# ─── Google Gemini AI ───
GOOGLE_GENERATIVE_AI_API_KEY="AIzaSy..."

# ─── Deployment Mode Switcher (Optional) ───
# Options: 'web' | 'mobile' | undefined (responsive fallback)
NEXT_PUBLIC_APP_MODE="web"
```

### Next.js Engine Configuration (`next.config.mjs`)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['pg', 'bcryptjs', '@prisma/client', '@prisma/adapter-pg'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}

export default nextConfig
```

> [!IMPORTANT] Production Deployment Note
> The `serverExternalPackages` property in `next.config.mjs` is mandatory when bundling on Vercel to ensure native binaries for `pg` and `bcryptjs` are not incorrectly bundled by Turbopack.

---

## 📖 Mascot Lore: The Story of Capy
*(Embedded in the interactive Story Modal)*

> **Most people think capybaras are naturally born with zero stress. But not Capy.**
>
> A few years ago, Capy was a highly strung, over-caffeinated corporate rodent. He lived in the fast lane—rushing from one stressful meeting to the next, doomscrolling on his tiny smartphone, and constantly forgetting to use his vacation days. He was the only capybara in the world with high blood pressure.
>
> Everything changed during a chaotic business trip. After missing a bullet train because he was answering emails, a completely exhausted Capy wandered into a quiet, misty *onsen* (hot spring) in the mountains.
>
> He slipped into the warm water, placed a single yuzu fruit on his head, and took a deep breath. For the first time in his life, his heart rate slowed down. He realized that life wasn't a race to the finish line—it is a slow, gentle wander.
>
> He traded his suit for a backpack and dedicated his life to slow travel and mental well-being. Now, he is your personal mood and travel buddy.

---

## 🔗 Obsidian Quick-Links & Tags
- Tags: #capy #nextjs16 #prisma #postgresql #gemini #mentalhealth #travel
- Related Notes: `[[NextAuth-v5-Setup]]`, `[[Prisma-Connection-Pooling]]`, `[[Gemini-Streaming-API]]`, `[[Tailwind-v4-OKLCH]]`
