# Repository Guidelines

> **CRITICAL**: This project uses **Next.js 16**. APIs, conventions, and file structures may differ significantly from training data. Consult `node_modules/next/dist/docs/` or official documentation for latest patterns.

This repository contains the Volleyball Connect PWA, built with Next.js 16 (App Router) and Turso/SQLite via Drizzle ORM.

## Project Structure & Module Organization

- **`.\src\app`**: Next.js App Router directory.
  - **`.\src\app\admin`**: Admin-only pages for Member Management and Location Request moderation.
  - **`.\src\app\events`**: Event listings, creation, and detail views (with Map Integration).
- **`.\src\components`**: Reusable UI components.
  - **`.\src\components\admin`**: Admin-specific UI elements.
  - **`.\src\components\LocationPicker.tsx`**: Google Places Autocomplete integration.
  - **`.\src\components\MapPreview.tsx`**: Google Maps display for event locations.
- **`.\src\db`**: Database layer. `schema.ts` is the single source of truth.
- **`.\src\lib\actions`**: Server Actions for data mutations.
- **`.\public`**: Static assets, including the `vbconnect_logo.png` used for branding and PWA icons.

## Build, Test, and Development Commands

- **`npm run dev`**: Starts the development server with Webpack.
- **`npm run build`**: Builds the application for production.
- **`npx drizzle-kit push`**: Pushes schema changes to the database.
- **`npx drizzle-kit generate`**: Generates SQL migrations.

## Key Configurations & Environment Variables

The app requires the following keys in `.env` for full functionality:
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Required for Location Picker and Map Preview.
- `RESEND_API_KEY`: Required for production email/auth delivery.
- `DATABASE_URL` & `DATABASE_AUTH_TOKEN`: Turso connection details.

## Coding Style & Naming Conventions

- **Mobile-First**: Always design and test for mobile screens first.
- **TypeScript**: Strict mode is enabled; avoid `any`.
- **Branding**: Use the provided `vbconnect_logo.png` for brand-related UI.
- **Validations**: Use Zod schemas in `.\src\lib\validations` for all user input.

## Testing Guidelines

No formal testing framework is currently configured. Manually verify:
1. PWA "Add to Home Screen" functionality.
2. Admin access control on `/admin` routes.
3. Map Autocomplete and Pin accuracy.
