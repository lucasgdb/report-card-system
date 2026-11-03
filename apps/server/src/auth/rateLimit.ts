import { UserError } from '#/graphql/errors.ts';

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

// Expired windows are dropped now and then, so the map doesn't grow forever.
setInterval(() => {
  const now = Date.now();
  for (const [key, window] of windows) {
    if (window.resetAt <= now) {
      windows.delete(key);
    }
  }
}, 60_000).unref();

/** True while `key` has made fewer than `limit` attempts in the current window. In memory, per process. */
function consume(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const window = windows.get(key);
  if (!window || window.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  window.count += 1;
  return window.count <= limit;
}

const MINUTE = 60_000;

const RULES = {
  /** Sign-in: per account and per IP, so guessing one password or spraying many accounts is slow. */
  login: [
    { scope: 'account', limit: 10, windowMs: 15 * MINUTE },
    { scope: 'ip', limit: 50, windowMs: 15 * MINUTE },
  ],
  /** Recovery requests send e-mails or notify admins. */
  recovery: [{ scope: 'ip', limit: 5, windowMs: 60 * MINUTE }],
  /** Setting a new password from a link. */
  reset: [{ scope: 'ip', limit: 10, windowMs: 60 * MINUTE }],
} as const;

/** Throws a `UserError` when the attempt goes over the limits of `rule`. */
export function limitAttempts(rule: keyof typeof RULES, { ip, account }: { ip: string; account?: string }) {
  for (const { scope, limit, windowMs } of RULES[rule]) {
    const subject = scope === 'ip' ? ip : `${ip}|${account?.toLowerCase() ?? ''}`;
    if (!consume(`${rule}:${scope}:${subject}`, limit, windowMs)) {
      throw new UserError('Muitas tentativas seguidas. Aguarde alguns minutos e tente novamente.');
    }
  }
}
