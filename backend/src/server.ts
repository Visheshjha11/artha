import { createApp } from './app.js';
import { loadConfig } from './config.js';
import { JsonStore } from './store.js';

const config = loadConfig();
const store = new JsonStore(config.dataFile);
await store.load();
await store.purgeExpired();

const app = createApp({ config, store });

const server = app.listen(config.port, config.host, () => {
  console.log(`Artha auth API listening on http://${config.host}:${config.port}`);
  console.log(`Allowed browser origins: ${config.clientOrigins.join(', ')}`);
  console.log(`Data file: ${config.dataFile}`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${config.port} is already in use. Set PORT in backend/.env to use another.`);
  } else {
    console.error(err);
  }
  process.exit(1);
});

// Drop expired sessions and reset tokens once an hour.
setInterval(() => {
  store.purgeExpired().catch((err) => console.error('[purge]', err));
}, 60 * 60 * 1000).unref();

const shutdown = (signal: string) => {
  console.log(`\n${signal} received, shutting down…`);
  server.close(() => {
    store.flush().finally(() => process.exit(0));
  });
  setTimeout(() => process.exit(1), 5000).unref();
};
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
