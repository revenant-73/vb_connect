# Project Roadmap & TODOs

This document tracks the current progress and remaining tasks for the Volleyball Connect PWA.

## ✅ Completed
- [x] Initial project setup (Next.js, Tailwind, TypeScript)
- [x] Database schema design with Drizzle ORM
- [x] Better Auth integration with Magic Links
- [x] Home Page implementation (Upcoming events, Announcements)
- [x] Event Details page (Info, RSVP tracking)
- [x] "Huddle" event message system
- [x] Event creation form
- [x] RSVP Action system (Going/Maybe/Not Going)
- [x] **Generalization**: Metro-agnostic architecture
- [x] **Branding**: Logo integration and PWA icons
- [x] **Map Integration**: Google Places Autocomplete & Map Preview
- [x] **Admin Moderation**: Member management and Location Request UI

## 🚧 In Progress / Next Up
- [ ] **Email Integration:** Connect Better Auth to an email provider (e.g., Resend) for real magic link delivery.
- [ ] **Member Directory:** A list of approved members with basic volleyball profiles.
- [ ] **Announcement Management:** Interface for organizers to create and pin announcements.
- [ ] **Profile Editing:** Allow members to update their display name, bio, and playing level.
- [ ] **PWA Enhancement:** Finalize service worker for robust offline support.

## 📅 Future Features (v2)
- [ ] **Push Notifications:** Web Push for new events and urgent updates.
- [ ] **Map Filters:** Filter events by distance/radius from user location.
- [ ] **Photo Sharing:** Allow members to post photos from gatherings in the event huddle.

## 🐛 Known Issues / Improvements
- [ ] Add loading skeletons for better UX during map loading.
- [ ] Implement robust error boundaries for third-party Map failures.
