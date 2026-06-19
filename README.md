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

## Self Hosting

All data is stored locally in your browser using client-side storage. No external database or backend is required.

Because of this, you can easily host the project yourself on any static hosting platform such as Cloudflare Pages, Vercel, Netlify, GitHub Pages, or your own server.

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

The application will be available at:

```text
http://localhost:3000
```

## Build for Production

```bash
bun run build
```

Preview the production build:

```bash
bun run preview
```

## Data Storage

All solves, sessions, settings, and statistics are stored locally on the user's device. Nothing is sent to external servers unless you modify the application yourself.

This means:

- Your data stays on your device
- No user accounts are required
- The project can be hosted without a database
- Anyone can self-host their own instance
