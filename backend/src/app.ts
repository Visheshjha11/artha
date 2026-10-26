import cors from 'cors';
import express, { type Express } from 'express';
import type { Config } from './config.js';
import { consoleMailer, type Mailer } from './mailer.js';
import { apiHeaders, errorHandler, loadSession, notFound, originGuard } from './middleware.js';
import { createAuthRouter } from './routes/auth.js';
import type { JsonStore } from './store.js';

export interface AppDeps {
  config: Config;
  store: JsonStore;
  mailer?: Mailer;
}

export const createApp = ({ config, store, mailer = consoleMailer(config) }: AppDeps): Express => {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', config.trustProxy);

  app.use(cors({ origin: config.clientOrigins, credentials: true }));
  app.use('/api', apiHeaders, originGuard(config), express.json({ limit: '10kb' }), loadSession(store));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });
  app.use('/api/auth', createAuthRouter({ config, store, mailer }));

  app.use(notFound);
  app.use(errorHandler);
  return app;
};
