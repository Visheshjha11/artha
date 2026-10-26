import type { Config } from './config.js';

export interface Mailer {
  sendPasswordReset(email: string, link: string, expiresInMinutes: number): void | Promise<void>;
}

/**
 * Local stand-in for a real email provider: prints the reset link to the
 * server console. Swap this for SMTP/SES/etc. when deploying.
 */
export const consoleMailer = (config: Config): Mailer => ({
  sendPasswordReset(email, link, expiresInMinutes) {
    if (config.env === 'production') {
      console.warn('[auth] Password reset requested but no mailer is configured.');
      return;
    }
    console.log(`[auth] Password reset for ${email} (valid ${expiresInMinutes} min):\n       ${link}`);
  },
});
