# Rubik Cube Timer

A modern speedcubing timer built with Nuxt and TypeScript.

## Features

- Fast and responsive timer
- Multiple puzzle support
- Session management
- Statistics and personal best tracking
- Scramble generation
- Fully client-side data storage
- No account required

## Preview

<p align="center">
  <img src="app/assets/readme/timer.png" width="320">
  <img src="app/assets/readme/stats.png" width="320">
</p>

<p align="center">
  <img src="app/assets/readme/sessions.png" width="320">
  <img src="app/assets/readme/settings.png" width="320">
</p>

## Self Hosting

All data is stored locally in your browser using client-side storage. No external database or backend is required.

Because of this, you can easily host the project yourself on any static hosting platform such as Cloudflare Pages, Vercel, Netlify, GitHub Pages, or your own server.

## Data Storage

All solves, sessions, settings, and statistics are stored locally on the user's device. Nothing is sent to external servers unless you modify the application yourself.

This means:

- Your data stays on your device
- No user accounts are required
- The project can be hosted without a database
- Anyone can self-host their own instance

## Development

### Requirements

- Bun

### Install dependencies

```bash
bun install
```

### Start development server

```bash
bun run dev
```
