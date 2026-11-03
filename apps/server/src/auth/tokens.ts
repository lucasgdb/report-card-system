import { createHash, randomBytes } from 'node:crypto';

/** A random, URL-safe secret (sessions, password reset links). */
export const createToken = () => randomBytes(32).toString('base64url');

/** Tokens are stored hashed, so a database leak doesn't hand out working sessions or links. */
export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');
