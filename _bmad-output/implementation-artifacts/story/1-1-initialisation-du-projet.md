---
title: "Story 1.1 : Initialisation du projet"
epic: "Epic 1 : Fondations & Projet Setup"
status: "done"
assignee: "Jopad"
---

# Story 1.1 : Initialisation du projet

## Objective
As a développeur,
I want un projet Vite + React + shadcn/ui + Express initialisé avec la structure monorepo,
So that l'équipe peut commencer à développer immédiatement.

## Acceptance Criteria
- [x] **Given** le repo est cloné, **When** je lance `npm install && npm run dev`, **Then** le client React démarre sur :5173 et le serveur Express sur :3001.
- [x] **And** shadcn/ui et Tailwind sont configurés correctement.
- [x] **And** la structure monorepo est en place.

## Tasks and Subtasks
- [x] **Task 1: Setup Workspace Root**
  - [x] Initialize root `package.json` to manage workspaces (client, server).
  - [x] Add recursively concurrent running scripts (e.g. `npm run dev` starts both).
- [x] **Task 2: Initialize Vite Client**
  - [x] Create Vite React app in `client/` folder.
  - [x] Install Tailwind CSS and verify configuration.
  - [x] Initialize `shadcn/ui` with the correct components baseline.
  - [x] Clean up default Vite boilerplate (index.css, App.jsx, main.jsx).
- [x] **Task 3: Initialize Express Server**
  - [x] Create `server/` folder and `package.json`.
  - [x] Create minimal `index.js` Express server with basic `/api` stub.
  - [x] Configure `cors` to allow requests from the client.
- [x] **Task 4: Git Ignore**
  - [x] Create or update `.gitignore` at the root ignoring `node_modules` and `.env`.

## Key Files to Modify
- `package.json` (root)
- `client/package.json`
- `client/vite.config.js`
- `client/tailwind.config.js`
- `client/components.json`
- `client/index.html`
- `client/src/main.jsx`
- `client/src/App.jsx`
- `client/src/index.css`
- `server/package.json`
- `server/index.js`
- `.gitignore`

## Dev Notes
- Follow PRD / Tech Spec for architectural boundaries.
- The `client` runs on port 5173, `server` on 3001.
- We need to ensure `npm run dev` at root handles both.
