# Copilot Instructions
Purpose: Short, actionable guidance for AI coding agents working in this repository.
Migration note:
- Phase 2 (Option B) moved stylist features to the root; backup branch: `backup/stylist-template` (commit f45ee8f).

Big picture
- Frontend: React + Vite + TypeScript + Tailwind. Entry points: `index.tsx`, `App.tsx`.
- Backend / integrations: lightweight local proxy server in `server/proxy-server.mjs` and several serverless-style HTTP helpers under `api/`.
- Data layer: Convex (see `convex/schema.ts` and functions in `convex/*.ts`). Convex is the canonical source of truth for outfits, users, trends, loyalty, etc.
- AI integrations: Gemini-related code lives in `services/geminiService.ts` and `api/gemini-proxy.ts` (server proxy used for local development).

Key locations (quick reference)
- UI components: `components/` (e.g., `ImageUploader.tsx`, `OutfitCard.tsx`, `StyleSelector.tsx`).
- Convex code: `convex/` (schema + server-side functions). Generated client: `convex/_generated/`.
- Lib + hooks: `lib/convexConfig.ts`, `hooks/useConvex.ts` — prefer these when instantiating or calling Convex from UI code.
- Services: `services/geminiService.ts`, `insightsClient.ts` for external API interactions.
- Server proxy: `server/proxy-server.mjs` — used by `npm run start:api` and `dev:all` to run backend-like endpoints locally.

Dataflows & patterns
- Image upload -> `components/ImageUploader.tsx` -> stored/served from frontend/public and referenced in Convex `outfits` table.
- User-facing recommendations and analytics flow through `services/` and are persisted/cached in Convex (`fashionInsights`, `trends` tables in `convex/schema.ts`).
- Prefer implementing business logic that needs persistence or cross-user consistency as Convex server functions (see `convex/outfits.ts`, `convex/insights.ts`).

Developer workflows (commands)
- Install & run dev: `npm install` then `npm run dev` (frontend only).
- Run frontend + local API proxy: `npm run dev:all` (runs `verify:setup`, starts `server/proxy-server.mjs`, and `vite`).
- Start only proxy API: `npm run start:api`.
- Build: `npm run build` (or `npm run build:web`).
- Run tests: `npm run test:loyalty` (example uses `ts-node/esm`).
- Verify environment: `npm run verify:setup` (checks critical env + Convex config scripts).
- Mobile (Capacitor): `npm run cap:add:android`, `npm run cap:sync:android`, Android AAB: `npm run android:build:aab`.

Project-specific conventions
- Convex is the source of truth. Keep stateful/multiplayer logic in `convex/*` functions instead of local browser state.
- Use `hooks/useConvex.ts` and `lib/convexConfig.ts` to access Convex client; do not re-instantiate clients in components.
- Generated Convex types are consumed from `convex/_generated/` — regenerate when schema changes.
- Server-like endpoints for dev live under `api/` and are typically proxied by `server/proxy-server.mjs` in development.
- Small single-purpose components follow the presentational-first pattern (see `components/*Card.tsx`, `*Skeleton.tsx`).

Integration notes & gotchas
- Node engine pinned: 20.19.0 (see `package.json` engines). Some dev tools expect Node >=20.
- Tests may run using `ts-node/esm`; keep ESM interop in mind when editing test files.
- External AI/GenAI uses `@google/genai` and a custom proxy; secrets should be handled via environment and verified by `scripts/verify-setup.mjs`.

When editing or adding features
- Check whether the change belongs in `convex/` (persistent logic), `services/` (external APIs), or `components/` (UI). Prefer moving shared logic into `services/` or Convex functions.
- Update `convex/schema.ts` when adding persisted entities and regenerate clients.
- Keep UI patterns consistent with existing components; mirror props and skeletons for loading states.

If something is unclear, ask for repository-specific context or request permission before making large structural changes.

Feedback: please tell me which sections need more detail or if you'd like runnable examples added.
# Copilot Instructions

Purpose: Short, actionable guidance for AI coding agents working in this repository.

Migration note:
- Phase 2 (Option B) moved stylist features to the root; backup branch: `backup/stylist-template` (commit f45ee8f).

Big picture
- Frontend: React + Vite + TypeScript + Tailwind. Entry points: `index.tsx`, `App.tsx`.
- Backend / integrations: lightweight local proxy server in `server/proxy-server.mjs` and several serverless-style HTTP helpers under `api/`.
- Data layer: Convex (see `convex/schema.ts` and functions in `convex/*.ts`). Convex is the canonical source of truth for outfits, users, trends, loyalty, etc.
- AI integrations: Gemini-related code lives in `services/geminiService.ts` and `api/gemini-proxy.ts` (server proxy used for local development).

Key locations (quick reference)
- UI components: `components/` (e.g., `ImageUploader.tsx`, `OutfitCard.tsx`, `StyleSelector.tsx`).
- Convex code: `convex/` (schema + server-side functions). Generated client: `convex/_generated/`.
- Lib + hooks: `lib/convexConfig.ts`, `hooks/useConvex.ts` — prefer these when instantiating or calling Convex from UI code.
- Services: `services/geminiService.ts`, `insightsClient.ts` for external API interactions.
- Server proxy: `server/proxy-server.mjs` — used by `npm run start:api` and `dev:all` to run backend-like endpoints locally.

Dataflows & patterns
- Image upload -> `components/ImageUploader.tsx` -> stored/served from frontend/public and referenced in Convex `outfits` table.
- User-facing recommendations and analytics flow through `services/` and are persisted/cached in Convex (`fashionInsights`, `trends` tables in `convex/schema.ts`).
- Prefer implementing business logic that needs persistence or cross-user consistency as Convex server functions (see `convex/outfits.ts`, `convex/insights.ts`).

Developer workflows (commands)
- Install & run dev: `npm install` then `npm run dev` (frontend only).
- Run frontend + local API proxy: `npm run dev:all` (runs `verify:setup`, starts `server/proxy-server.mjs`, and `vite`).
- Start only proxy API: `npm run start:api`.
- Build: `npm run build` (or `npm run build:web`).
- Run tests: `npm run test:loyalty` (example uses `ts-node/esm`).
- Verify environment: `npm run verify:setup` (checks critical env + Convex config scripts).
- Mobile (Capacitor): `npm run cap:add:android`, `npm run cap:sync:android`, Android AAB: `npm run android:build:aab`.

Project-specific conventions
- Convex is the source of truth. Keep stateful/multiplayer logic in `convex/*` functions instead of local browser state.
- Use `hooks/useConvex.ts` and `lib/convexConfig.ts` to access Convex client; do not re-instantiate clients in components.
- Generated Convex types are consumed from `convex/_generated/` — regenerate when schema changes.
- Server-like endpoints for dev live under `api/` and are typically proxied by `server/proxy-server.mjs` in development.
- Small single-purpose components follow the presentational-first pattern (see `components/*Card.tsx`, `*Skeleton.tsx`).

Integration notes & gotchas
- Node engine pinned: 20.19.0 (see `package.json` engines). Some dev tools expect Node >=20.
- Tests may run using `ts-node/esm`; keep ESM interop in mind when editing test files.
- External AI/GenAI uses `@google/genai` and a custom proxy; secrets should be handled via environment and verified by `scripts/verify-setup.mjs`.

When editing or adding features
- Check whether the change belongs in `convex/` (persistent logic), `services/` (external APIs), or `components/` (UI). Prefer moving shared logic into `services/` or Convex functions.
- Update `convex/schema.ts` when adding persisted entities and regenerate clients.
- Keep UI patterns consistent with existing components; mirror props and skeletons for loading states.

If something is unclear, ask for repository-specific context or request permission before making large structural changes.

Feedback: please tell me which sections need more detail or if you'd like runnable examples added.