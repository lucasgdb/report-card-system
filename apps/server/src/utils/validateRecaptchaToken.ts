import { fetchWithRetries, __DEV__ } from '@usefaz/shared';
import url from 'url';

const validateRecaptchaToken = async (token: string) => {
  if (__DEV__) {
    return;
  }

  const params = new url.URLSearchParams({
    secret: process.env.RECAPTCHA_V3_SECRET_TOKEN!,
    response: token,
  });

  const response = await fetchWithRetries({
    method: 'POST',
    url: 'https://www.google.com/recaptcha/api/siteverify',
    data: params.toString(),
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
  });

  if (!response?.data.success) {
    console.error(response?.data['error-codes']);
    throw new Error('CAPTCHA.ERROR');
  }
};

export default validateRecaptchaToken;
