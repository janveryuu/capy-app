<div align="center">
  <img src="public/capy-newicon.png" alt="Capy Mascot" width="120" />
  <h1>🧋 Capy</h1>
  <p><strong>Your cozy, AI-powered mood and travel buddy.</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  </p>
</div>

<br />

Welcome to **Capy**! A beautiful, warm, and interactive web application designed to help you track your mental wellbeing, plan your next relaxing getaway, and chat with an AI companion—all wrapped in an incredibly cozy, Capybara-themed interface.

## ✨ Features

- 🌿 **Mood Analytics & Journaling:** Log your daily emotions with tags and notes. Visualize your mental wellbeing over time with a beautiful GitHub-style mood heatmap.
- ✈️ **Travel Explorer:** Plan your dream trips and explore new destinations. Capy helps you find the perfect place to unwind and recharge.
- 💬 **Ask Capy (AI Companion):** An intelligent, conversational AI buddy integrated directly into the app. Ask Capy for advice, travel tips, or just have a comforting chat.
- 🔐 **Secure Authentication:** Seamless login via Google OAuth or traditional Email/Password credentials, powered by NextAuth v5.
- 🎨 **Stunning & Cozy UI:** Fluid animations with Framer Motion, accessible components via `shadcn/ui`, and a meticulously crafted Tailwind CSS theme designed to feel like a "soft place to land".

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) & Lucide Icons
- **Database & ORM:** [PostgreSQL](https://www.postgresql.org/) & [Prisma](https://www.prisma.io/)
- **Authentication:** [NextAuth.js (v5)](https://authjs.dev/)
- **AI Integration:** Google Generative AI SDK (`@google/generative-ai`, `@ai-sdk/react`)
- **Deployment:** [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### 1. Clone the repository

```bash
git clone https://github.com/janveryuu/capy-app.git
cd capy-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Environment Variables

Create a `.env.local` file in the root of the project and add the following keys. You will need to set up a PostgreSQL database (e.g., via Supabase or Neon) and get OAuth credentials from Google Cloud Console.

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/db?schema=public"

# NextAuth Configuration
AUTH_SECRET="your_generated_secret_key" # Run `npx auth secret` to generate

# Google OAuth (For Google Login)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### 4. Setup the Database

Generate the Prisma client and push the schema to your database:

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application!

---

## 📦 Deployment

This project is perfectly configured to be deployed on **Vercel**. 

1. Push your code to GitHub.
2. Import the repository into Vercel.
3. Add your `.env.local` variables into the Vercel **Environment Variables** settings.
4. Vercel will automatically detect Next.js and Prisma, run `prisma generate`, and build your application!

*(Note: Ensure your `serverExternalPackages` in `next.config.mjs` remains intact to prevent Turbopack build errors with `pg` and `bcryptjs` on Vercel).*

---

<div align="center">
  <p>Built with ❤️ and plenty of matcha.</p>
</div>
