import { fetchWithRetries, __DEV__ } from '@usefaz/shared';
import url from 'node:url';

import UserError from './UserError';

const validateRecaptchaToken = async (token: string) => {
  if (__DEV__) {
    return;
  }

  const params = new url.URLSearchParams({
    secret: process.env.RECAPTCHA_V3_SECRET_TOKEN!,
    response: token,
  });

  const response = await fetchWithRetries('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    body: params.toString(),
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
  });
  const result = (await response.json()) as { success: boolean; 'error-codes'?: string[] };

  if (!result.success) {
    console.error(result['error-codes']);
    throw new UserError('Não foi possível confirmar seu acesso. Recarregue a página e tente novamente.');
  }
};

export default validateRecaptchaToken;
