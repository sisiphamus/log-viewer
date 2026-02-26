import express from 'express';
import { readdirSync, readFileSync, statSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOGS_DIR = join(__dirname, '..', '..', '..', '..', 'pepperv1', 'backend', 'bot', 'logs');
const PORT = 3999;

const app = express();
app.use(express.static(join(__dirname, 'public')));

// List all log files, newest first
app.get('/api/logs', (req, res) => {
  try {
    if (!existsSync(LOGS_DIR)) {
      return res.json([]);
    }
    const files = readdirSync(LOGS_DIR)
      .filter(f => f.endsWith('.json'))
      .sort((a, b) => {
        // Sort by mtime descending
        const sa = statSync(join(LOGS_DIR, a));
        const sb = statSync(join(LOGS_DIR, b));
        return sb.mtimeMs - sa.mtimeMs;
      });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific log file
app.get('/api/logs/:filename', (req, res) => {
  try {
    const filename = req.params.filename.replace(/[^a-zA-Z0-9._-]/g, '');
    const filepath = join(LOGS_DIR, filename);
    if (!filepath.startsWith(LOGS_DIR) || !existsSync(filepath)) {
      return res.status(404).json({ error: 'not found' });
    }
    const data = JSON.parse(readFileSync(filepath, 'utf-8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SSE endpoint for watching new log files
app.get('/api/watch', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  // Poll the directory every 2 seconds for new files
  let lastFiles = new Set();
  try {
    if (existsSync(LOGS_DIR)) {
      lastFiles = new Set(readdirSync(LOGS_DIR).filter(f => f.endsWith('.json')));
    }
  } catch {}

  const interval = setInterval(() => {
    try {
      if (!existsSync(LOGS_DIR)) return;
      const current = new Set(readdirSync(LOGS_DIR).filter(f => f.endsWith('.json')));
      for (const f of current) {
        if (!lastFiles.has(f)) {
          res.write(`data: ${JSON.stringify({ type: 'new_log', filename: f })}\n\n`);
        }
      }
      lastFiles = current;
    } catch {}
  }, 2000);

  req.on('close', () => clearInterval(interval));
});

app.listen(PORT, () => {
  console.log(`\n  Pepper Log Viewer running at http://localhost:${PORT}\n`);
  console.log(`  Reading logs from: ${LOGS_DIR}\n`);
});
