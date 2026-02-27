# log-viewer

When you have an AI bot running autonomously in the background -- doing research, writing code, executing tasks -- you develop a very specific anxiety about what it's up to. This is the cure.

A terminal-style web interface that tails Pepper's JSON log files in real time. Express serves it on port 3999. You get a dark screen, Courier New monospace, and a stream of the bot's internal state pushed to your browser via Server-Sent Events (polling the filesystem every 2 seconds, because SSE keeps the connection alive and the updates flowing without you refreshing anything).

The file list lets you pick which log to watch. Filenames get sanitized against path traversal because even a personal tool shouldn't let `../../etc/passwd` through the door.

It looks like a terminal because that's what it is -- a window into something thinking.

```
npm install
node server.js
# open localhost:3999
```
