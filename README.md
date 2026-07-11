# Hillsboro Grass Volleyball PWA

A lightweight Progressive Web App for organizing casual grass volleyball gatherings in and around Hillsboro, Oregon.

## 🚀 Overview

This app replaces the practical functions of Facebook groups for local volleyball organizers. It prioritizes upcoming events, low-friction RSVPs, and essential group communication without the noise of social media feeds.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Database:** [Turso](https://turso.tech) (SQLite)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team)
- **Authentication:** [Better Auth](https://better-auth.com) (Magic Links)
- **Validation:** [Zod](https://zod.dev)
- **Icons:** [Lucide](https://lucide.dev)

## 🏗️ Project Structure

- `.\src\app`: Next.js pages and API routes
- `.\src\components`: Reusable UI components
- `.\src\db`: Database schema and configuration
- `.\src\lib`: Utility functions and third-party integrations (Auth, Actions)
- `.\src\context`: React Context providers
- `.\drizzle`: Database migrations

## 🚦 Getting Started

### 1. Prerequisites
- Node.js 18+
- A Turso database (or local SQLite for dev)

### 2. Environment Variables
Create a `.env` file in the root:
```env
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=file:local.db
DATABASE_AUTH_TOKEN=
```

### 3. Installation
```bash
npm install
```

### 4. Database Setup
```bash
npx drizzle-kit push
```

### 5. Development
```bash
npm run dev
```

## 📱 Features

- **PWA Ready:** Installable on iOS and Android.
- **Magic Link Auth:** No passwords to remember.
- **Event Management:** Create and manage volleyball gatherings.
- **RSVP System:** Real-time attendance tracking with "Going", "Maybe", and "Not Going".
- **Huddle:** Event-specific message boards for coordination.
- **Announcements:** Group-wide updates pinned by organizers.

## 📄 License

MIT
