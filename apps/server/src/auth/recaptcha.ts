import { fetchWithRetries } from '@usefaz/shared';

import env, { isDev } from '#/env.ts';
import { UserError } from '#/graphql/errors.ts';
import logger from '#/logger.ts';

/** Confirms a reCAPTCHA v3 token from the sign-in forms (skipped in development). */
export async function validateRecaptchaToken(token: string) {
  if (isDev) {
    return;
  }

  const response = await fetchWithRetries('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret: env.RECAPTCHA_V3_SECRET_TOKEN, response: token }).toString(),
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
  });
  const result = (await response.json()) as { success: boolean; 'error-codes'?: string[] };

  if (!result.success) {
    logger.warn({ errorCodes: result['error-codes'] }, 'reCAPTCHA rejected');
    throw new UserError('Não foi possível confirmar seu acesso. Recarregue a página e tente novamente.');
  }
}
