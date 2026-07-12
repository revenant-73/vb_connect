# Volleyball Connect PWA

A lightweight Progressive Web App for organizing casual volleyball gatherings in any metro area. Built for efficiency, mobile-first use, and local community building.

## 🚀 Overview

This app replaces the practical functions of social media groups for volleyball organizers. It prioritizes upcoming events, low-friction RSVPs, and essential coordination across multiple metro areas.

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Turso (SQLite)
- **ORM:** Drizzle ORM
- **Authentication:** Better Auth (Magic Links)
- **Maps:** Google Maps Platform (Places Autocomplete & Map Preview)
- **Styling:** Tailwind CSS 4.0 & Framer Motion

## 🏗️ Project Structure

- `.\src\app`: Next.js pages and API routes
- `.\src\components`: UI components (including Map integration)
- `.\src\db`: Database schema (Source of truth: `schema.ts`)
- `.\src\lib`: Server Actions, Auth config, and Validations
- `.\public`: Static assets and PWA manifest

## 🚦 Getting Started

### 1. Prerequisites
- Node.js 18+
- A Turso database
- A Google Cloud project with Maps JavaScript, Places, and Geocoding APIs enabled.

### 2. Environment Variables
Create a `.env` file in the root:
```env
# Database
DATABASE_URL=
DATABASE_AUTH_TOKEN=

# Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# Google Maps (Client Side)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# Email
RESEND_API_KEY=
```

### 3. Installation & Setup
```bash
npm install
npx drizzle-kit push
npm run dev
```

## 📱 Features

- **PWA Ready:** Installable on mobile devices with custom branding.
- **Smart Location Search:** Find parks and courts instantly using Google Places.
- **Map Previews:** Visual confirmation of event locations.
- **Admin Moderation:** Manage members and approve new metro areas/zones.
- **Huddle:** Event-specific discussion boards.

## 📄 License
MIT
