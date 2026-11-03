import { z } from 'zod';

const booleanString = z
  .enum(['true', 'false'])
  .default('false')
  .transform((value) => value === 'true');

/** Server settings, read from the environment once and validated, so a missing one fails at boot. */
const EnvSchema = z.object({
  NODE_ENV: z.enum(['DEVELOPMENT', 'HOMOLOG', 'PRODUCTION']).default('DEVELOPMENT'),
  PORT: z.coerce.number().int().positive().default(3000),
  /** Public URL of this API (avatar links in local storage). */
  BASE_URL: z.url(),
  /** The web apps, for CORS and the links sent by e-mail. */
  BOLETIM_WEB_URL: z.url(),
  ADMIN_WEB_URL: z.url(),

  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_DATABASE: z.string().min(1),

  /** Session cookies: `Secure` (HTTPS only) and `SameSite`; `none` needs `COOKIE_SECURE=true`. */
  COOKIE_SECURE: booleanString,
  COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  /** Behind a proxy (load balancer), the client IP comes from `X-Forwarded-For`. */
  TRUST_PROXY: booleanString,

  RECAPTCHA_V3_SECRET_TOKEN: z.string().min(1),
  /** `smtp` sends e-mails through Gmail; `log` only writes them to the log (local testing). */
  MAIL_DRIVER: z.enum(['smtp', 'log']).default('smtp'),
  USEFAZ_EMAIL: z.string().min(1),
  USEFAZ_EMAIL_PASSWORD: z.string().min(1),

  /** Where uploaded avatars go: this server's `public/` folder, or an S3-compatible bucket. */
  STORAGE_DRIVER: z.enum(['local', 's3']).default('local'),
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_ENDPOINT: z.url().optional(),
  /** Base URL the bucket's files are served from (a CDN or the bucket's public URL). */
  S3_PUBLIC_URL: z.url().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),

  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment variables:', z.prettifyError(parsed.error));
  process.exit(1);
}

const env = parsed.data;

if (env.STORAGE_DRIVER === 's3' && (!env.S3_BUCKET || !env.S3_PUBLIC_URL)) {
  console.error('STORAGE_DRIVER=s3 needs S3_BUCKET and S3_PUBLIC_URL.');
  process.exit(1);
}

export const isDev = env.NODE_ENV === 'DEVELOPMENT';

export default env;
