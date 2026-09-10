# Echo — Project Context

## What This Is
A mind-wellness journal web app. Core differentiator: it automatically resurfaces
past journal entries (1 week / 1 month / 1 year ago) and generates a full AI
reflection on them — not a one-line caption, a grounded reflective passage on
how the user was feeling that day, based strictly on what they actually wrote.

## Core Loop
User journals today → entry stored with date + mood score → on future days,
app finds entries from ~7d/~30d/~365d ago (small ±2-3 day window, not exact
match) → AI generates a reflection from the old entry → shown on web dashboard
and pushed via Telegram/email/WhatsApp.

## Journaling Modes
- **Freeform**: open textarea, no structure.
- **Prompted**: 5 fixed fields every time —
  1. Things I'm grateful for
  2. My to-do list
  3. Affirm my goals as if they've already happened
  4. Things I did right today
  5. Things I did wrong today

## Architecture
| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router), TypeScript, Tailwind |
| Database + Auth | Neon (Postgres) — Supabase free tier pauses after 7 days idle, breaking local dev; migrate to Supabase at Phase 6 for multi-user auth |
| Hosting | Vercel |
| Scheduler | Vercel Cron |
| Notifications | Telegram Bot API (first) → Brevo email (second) → Twilio WhatsApp (last) |
| AI | Google Gemini (free tier) — for reflection generation and later digest generation; cost-driven choice at current ~3-user scale, revisit (likely Claude Haiku via Batch API) once usage outgrows the free tier |

## Data Model
entries: id, user_id, date, mode ('freeform'|'prompted'), freeform_text,
gratitude, todo, affirmations, did_right, did_wrong, mood_score (1-10), created_at

users: id, email, timezone, telegram_chat_id, whatsapp_number,
notify_email, notify_telegram, notify_whatsapp

reflections: id, user_id, source_entry_id, target_date, reflection_text, generated_at
(cache AI reflections — don't regenerate on every page view)

## Design Direction
Apple-native: design every screen as if Echo were an Apple app, following the
iOS Human Interface Guidelines (reference: Apple's Journal app). Calm, warm,
content-first, minimal chrome.
- Type: system stack — SF Pro / New York / SF Pro Rounded on Apple devices,
  Inter / Lora elsewhere. Use the HIG type tokens in `globals.css`
  (`text-large-title` … `text-caption`), not ad-hoc sizes.
- Color: semantic tokens only (`canvas`, `card`, `label`, `label-2`,
  `separator`, `fill`, `tint`); every screen must work in light and dark mode.
- Patterns: large titles, grouped inset cards, tab bar (bottom on mobile,
  floating capsule on desktop), segmented controls, 44px touch targets.
- The prompted-entry form should feel like writing, not filling out a form.

## Current Phase
Phase 1-3 done: entry form (both modes), Neon write, `/past` resurfacing view
+ `/entries` chronological list, deployed to Vercel, AI reflections (Gemini
free tier, cached in `reflections`, generated nightly via Vercel Cron) shown
on `/past`. Telegram notifications were planned for Phase 3 but deprioritized
for now — not built. No auth yet, still single user (me).
Next: Phase 4 (Brevo email) whenever notifications become a priority again.

## Rules
- Don't build multi-user auth before Phase 6.
- Don't build WhatsApp before Telegram — Telegram is free and has no approval delay.
- The AI reflection must be grounded strictly in what was written — no invented detail.
- Store user timezone explicitly — don't assume UTC or local dev machine time.