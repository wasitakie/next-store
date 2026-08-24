# Agents Guide

This file gives AI coding agents the project-specific context needed to work safely in this repo.

## Project Snapshot

`next-store` is a localized e-commerce app for IT/gadget products.

- Framework: Next.js App Router with React and TypeScript.
- Styling: Tailwind CSS, shadcn-style UI primitives in `components/ui`, and `lucide-react` icons.
- Data: Prisma with MySQL/MariaDB adapter.
- Auth: NextAuth v5 beta with Google and Credentials providers.
- Cart state: Zustand store in `lib/store/useCartStore.ts` backed by server actions.
- i18n: `next-intl` with `th` as the default locale and `en` as the secondary locale.
- Deployment: standalone Next.js output, Docker support, and local MySQL via `docker-compose.yml`.

## Important Paths

- `app/[locale]`: locale-aware app routes. In Next.js 16 style, route `params` may be promises and should be awaited where typed that way.
- `app/[locale]/(store)`: public storefront routes such as home, products, cart, checkout, and order success.
- `app/[locale]/admin`: admin routes for products and orders.
- `components`: shared UI and storefront components.
- `components/ui`: reusable shadcn/Radix primitives. Prefer extending these before creating one-off UI.
- `lib/actions`: server actions for cart, order, and product workflows.
- `lib/prisma.ts`: singleton Prisma client with MariaDB adapter. Import this instead of creating new clients.
- `lib/auth.ts` and `auth.config.ts`: NextAuth setup and shared auth callbacks.
- `i18n/routing.ts` and `i18n/request.ts`: locale routing and message loading.
- `messages/th.json` and `messages/en.json`: translation catalogs. Keep keys aligned across both files.
- `prisma/schema.prisma`: database schema.
- `prisma/seed.ts`: seed data.
- `scripts/promote-admin.ts`: utility for promoting a user to admin.

## Commands

Use `pnpm`.

- Install: `pnpm install`
- Dev server: `pnpm dev`
- Lint: `pnpm lint`
- Production build: `pnpm build`
- Generate Prisma client: `pnpm prisma generate`
- Push schema to local DB: `pnpm prisma db push`
- Seed database: `pnpm seed`
- Promote admin user: `pnpm promote-admin`
- Docker build script: `pnpm docker-build`

The app expects a database connection through `DATABASE_URL`. Local Docker MySQL exposes host port `3308` and creates database `nextstore`.

## Development Rules

- Prefer Server Components for data fetching. Add `"use client"` only when a component needs hooks, browser APIs, local state, Zustand, or event handlers.
- For pages/layouts under `app/[locale]`, preserve locale-aware routing and use navigation helpers from `@/i18n/routing` where appropriate.
- When adding user-facing copy, update both `messages/th.json` and `messages/en.json`. Thai is the primary/default UX language.
- Keep product data localized through the existing `name_th`, `name_en`, `description_th`, `description_en`, `category_th`, and `category_en` fields.
- Keep cart behavior consistent with optimistic Zustand updates plus server-action sync. If a server action fails, refresh from server state.
- Use the existing `prisma` export from `@/lib/prisma`; do not instantiate `PrismaClient` elsewhere.
- Keep auth role semantics aligned with the `Role` enum: `user` and `admin`.
- Validate forms and server-action inputs with existing patterns before writing to the database.
- Use `next/image` for product images. Remote images currently allow `images.unsplash.com` in `next.config.ts`.
- Use `lucide-react` icons in buttons and controls when an icon exists.
- Quote shell paths that include route groups or dynamic segments, for example: `sed -n '1,120p' 'app/[locale]/(store)/products/page.tsx'`.

## UI Guidelines

- Match the store's current "modern tech and trust" direction from `README.md`: clean slate background, deep blue/dark content, and orange CTA emphasis.
- Keep store screens product-first and conversion-focused. Avoid landing-page filler when implementing shop workflows.
- Reuse `components/ui` primitives for buttons, cards, forms, labels, sheets, sliders, badges, avatars, separators, dropdowns, and carousel UI.
- Keep layouts responsive for mobile and desktop. Product grids and checkout/cart flows should remain scannable and avoid text overlap.
- Do not nest cards inside cards unless the existing component pattern already requires it.

## Database And Prisma

- The schema provider is MySQL. The runtime client uses `@prisma/adapter-mariadb`.
- After changing `prisma/schema.prisma`, run `pnpm prisma generate` and, for local schema sync, `pnpm prisma db push`.
- Do not casually edit committed migrations. Add a new migration when migration history matters.
- Preserve order price snapshots in `OrderItem.price`; do not recompute historical order totals from current product prices.

## Verification

Before finishing a code change, run the smallest useful verification:

- Type/UI changes: `pnpm lint`
- Database/schema changes: `pnpm prisma generate` plus relevant Prisma command
- Production-sensitive changes: `pnpm build`

If a command cannot run because dependencies, env vars, or database services are missing, say exactly what blocked it.

## Git And Safety

- The worktree may already contain user edits. Do not revert or overwrite unrelated changes.
- Keep changes scoped to the request.
- Do not run destructive commands such as `git reset --hard`, `git checkout --`, or volume-deleting Docker commands unless explicitly requested.
- Be especially careful with Docker volumes. The MySQL volume contains database state.
- Avoid committing generated artifacts unless the project already tracks them or the user asks for them.
