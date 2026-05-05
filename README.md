# Developer Guide

This document explains all available `pnpm` scripts and how to use them day-to-day.

---

## Prerequisites

Before running any commands, make sure you have the following installed and configured:

- [Node.js](https://nodejs.org/) + [pnpm](https://pnpm.io/)
- [Infisical CLI](https://infisical.com/docs/cli/overview) — used to inject secrets at runtime
- [Prisma CLI](https://www.prisma.io/docs/getting-started) — bundled via `npm`/`pnpm`

You also need to be **logged into Infisical** via the CLI:

```bash
infisical login
```

---

### Setting up Infisical (one-time per machine)

**1. Install the Infisical CLI:**
```bash
npm install -g @infisical/cli
```

**2. Log in to Infisical** (from root of the repo):
```bash
infisical login
```

**3. Link the project** — run this once from the root of the repo:
```bash
infisical init
```
> When prompted, select the correct Infisical project for this codebase. This creates a local `.infisical.json` config file that tells the CLI which project to pull secrets from.

## Development

### `pnpm run dev`

Starts the local development server.

**What it does:**
1. Pulls all secrets from Infisical (`dev` environment)
2. Writes them to `.env.local` (creates the file if it doesn't exist, overwrites if it does)
3. Starts the Next.js dev server at `http://localhost:3000`

```bash
pnpm run dev
```

> ⚠️ `.env.local` is auto-generated — **do not commit it**. Make sure it's in your `.gitignore`.

---

## Database Commands

---

### `pnpm run db:studio`

Opens **Prisma Studio** — a visual browser-based GUI to inspect and edit your database records.

```bash
pnpm run db:studio
```

> Useful for quickly browsing tables and debugging data during development.

---

### `pnpm prisma generate`
Runs to generate the prisma client

```bash
pnpm prisma generate
```

---

### `pnpm run db:migrate_dev`

Runs pending migrations against the **development database** and generates the Prisma client.

```bash
pnpm run db:migrate_dev
```

> Use this when you've made changes to `schema.prisma` and want to apply them locally. Prisma will prompt you to name the new migration.

---

### `pnpm run db:migrate_deploy`

Applies all pending migrations to the **target database** (e.g. staging or production). Unlike `migrate_dev`, this does **not** generate new migrations — it only runs existing ones.

```bash
pnpm run db:migrate_deploy
```

> Use this in CI/CD pipelines or when deploying to a shared environment.

---

### `pnpm run db:reset`

**⚠️ Destructive.** Drops the database, re-applies all migrations from scratch, and re-seeds if a seed script is configured.

```bash
pnpm run db:reset
```

> Only use this locally when you want a completely clean slate. **Never run this against a shared or production database.**

---

### `pnpm run db:migrate_schema_check`

Checks whether your `schema.prisma` is in sync with the existing migrations. Exits with a non-zero code if there is a drift — useful for CI checks.

```bash
pnpm run db:migrate_schema_check
```

> This is already included in the CI pipeline to catch uncommitted schema changes before they reach production.

---
