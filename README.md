# Bailout Club

Next.js (App Router) + Tailwind + Supabase + Lucide + Framer Motion. Runs on local demo data with no credentials.

```bash
npm install
npm run dev
```

Supabase (optional): copy `.env.example` to `.env.local`, fill both vars, run `supabase/schema.sql`, then use the Demo/Supabase toggle in the nav.

Routes: `/` landing, `/submit` requester flow, `/vault` patron markets, `/hall` leaderboard.

Game layer (patron profile is local to the browser): XP, levels, daily streak, daily missions, badges, bill rarity (Common to Legendary from the Grit Index), partial pledges (25% / 50% / Wipe), level-up celebration, live ticker.
