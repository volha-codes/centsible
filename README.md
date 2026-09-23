# Centsible

Budget tracker and planner with AI-powered analytics. Work in progress.

**[Live demo](https://centsible-budget.vercel.app/)**

## Status

The Accounts tab is fully built: add, edit, delete, duplicate-name
validation, currency formatting, responsive layout. Everything else -
Transactions, Categories, Budgets, Reports, AI insights - is not built yet.

The demo is frontend-only for now: state lives in memory and resets on
refresh. A backend (NestJS + Prisma + PostgreSQL) is planned next.

## Stack

React · TypeScript · Redux Toolkit · Tailwind CSS v4 · Vite

Tested with Vitest + React Testing Library.

## Getting started

```bash
npm install
npm run dev
```

## Testing

```bash
npm run test        # watch mode
npm run test:run    # single run
```

## Roadmap

- [ ] Backend + persistence (NestJS, Prisma, PostgreSQL)
- [ ] Transactions & Categories
- [ ] Budgets & Reports
- [ ] AI-powered insights
- [ ] React Native mobile app, sharing types and Redux slices with the web app
