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
| Database + Auth | Supabase (Postgres) |
| Hosting | Vercel |
| Scheduler | Vercel Cron |
| Notifications | Telegram Bot API (first) → Resend email (second) → Twilio WhatsApp (last) |
| AI | Claude API — for reflection generation and later digest generation |

## Data Model
entries: id, user_id, date, mode ('freeform'|'prompted'), freeform_text,
gratitude, todo, affirmations, did_right, did_wrong, mood_score (1-10), created_at

users: id, email, timezone, telegram_chat_id, whatsapp_number,
notify_email, notify_telegram, notify_whatsapp

reflections: id, user_id, source_entry_id, target_date, reflection_text, generated_at
(cache AI reflections — don't regenerate on every page view)

## Design Direction
Ergonomic, luxury, calm. Warm palette, generous whitespace, serif/warm-sans
typography, minimal chrome. The prompted-entry form should feel like writing,
not filling out a form.

## Current Phase
Phase 1: Proof of concept. No auth, single user (me), local dev.
Building: entry form (both modes) + Supabase write + simple past-entries list.
No notifications, no AI yet — that's Phase 3.

## Rules
- Don't build multi-user auth before Phase 6.
- Don't build WhatsApp before Telegram — Telegram is free and has no approval delay.
- The AI reflection must be grounded strictly in what was written — no invented detail.
- Store user timezone explicitly — don't assume UTC or local dev machine time.