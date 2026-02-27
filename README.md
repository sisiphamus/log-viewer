# Log Viewer

A web-based log viewer for the Pepper AI bot system.

When you have an AI assistant processing tasks in the background, you need a way to see what it's doing. This is that tool. It serves a local web UI that displays Pepper's JSON log files with real-time updates.

## What It Does

- **Express server** on port 3999 serving a terminal-style web UI
- **Log listing API** (`GET /api/logs`) returns all JSON log files from `pepperv1/backend/bot/logs/`, newest first
- **Log reading API** (`GET /api/logs/:filename`) returns the contents of a specific log
- **Real-time updates** via Server-Sent Events (`GET /api/watch`) that polls for new log files every 2 seconds and pushes notifications to the browser
- **Security**: Filename sanitization via regex to prevent path traversal

## Design

Monospace "Courier New" terminal aesthetic. Sidebar lists available logs, main pane shows content. Designed to look like a terminal because that's what it is: a window into what the bot is thinking.

## Tech

Node.js, Express (ES modules), Server-Sent Events, vanilla HTML/CSS

## Usage

```bash
npm install
node server.js
# Open http://localhost:3999
```

## Context

This is a developer tool for the [Pepper](https://github.com/sisiphamus/Pepper) AI assistant ecosystem. It monitors the logs produced by Pepper's Claude CLI subprocess as it processes tasks.
