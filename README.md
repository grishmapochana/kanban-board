# Kanban Board

A real-time, drag-and-drop Kanban application built with Next.js, React, GraphQL (Hasura + Nhost), and Shadcn UI. Supports authenticated users, boards, columns, and cards with full CRUD and live sync across clients.

---

## Features

- **Boards / Columns / Cards**: Create, read, update, delete; nested structure.
- **Drag & Drop**: Reorder columns & cards using `@dnd-kit` with float-based positions.
- **Realtime Sync**: GraphQL subscriptions keep multiple clients in sync instantly.
- **Styling**: Tailwind CSS + [Shadcn/ui](https://github.com/shadcn/ui) primitives.
- **Deployment**: Vercel (Hobby) with environment-based configuration.

---

## Tech Stack

- **Framework:** Next.js (App Router, Server Components)
- **UI:** React, Tailwind CSS, Shadcn/ui
- **Drag & Drop:** `@dnd-kit/core`, `@dnd-kit/sortable`
- **Auth & Backend:** Nhost (Hasura, GraphQL API + subscriptions)
- **Deployment:** Vercel
- **CI:** GitHub Actions (lint, codegen, build)

## Install dependencies

- npm install

## Code generation

- npx graphql-codegen

## Run locally

- npm run dev
