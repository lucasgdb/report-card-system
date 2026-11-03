import { argon2, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const argon2Async = promisify(argon2);

// OWASP's argon2id baseline: 19 MiB of memory, 2 passes, 1 lane.
const PARAMS = { memory: 19_456, passes: 2, parallelism: 1, tagLength: 32 };

const derive = (password: string, nonce: Buffer, { memory, passes, parallelism, tagLength } = PARAMS) =>
  argon2Async('argon2id', { message: password, nonce, memory, passes, parallelism, tagLength });

/** Hashes a password with argon2id, in the standard PHC format (`$argon2id$v=19$m=…,t=…,p=…$salt$hash`). */
export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await derive(password, salt);
  const { memory, passes, parallelism } = PARAMS;
  return `$argon2id$v=19$m=${memory},t=${passes},p=${parallelism}$${salt.toString('base64url')}$${hash.toString('base64url')}`;
}

const PHC = /^\$argon2id\$v=19\$m=(\d+),t=(\d+),p=(\d+)\$([\w-]+)\$([\w-]+)$/;

/** Checks a password against its stored argon2id hash (in constant time). */
export async function verifyPassword(password: string, storedHash: string) {
  const match = PHC.exec(storedHash);
  if (!match) {
    return false;
  }

  const [, memory, passes, parallelism, salt, hash] = match;
  const expected = Buffer.from(hash, 'base64url');
  const actual = await derive(password, Buffer.from(salt, 'base64url'), {
    memory: Number(memory),
    passes: Number(passes),
    parallelism: Number(parallelism),
    tagLength: expected.length,
  });
  return timingSafeEqual(actual, expected);
}

/** Hashes made with older settings are replaced at the next successful sign-in. */
export const needsRehash = (storedHash: string) =>
  !storedHash.startsWith(`$argon2id$v=19$m=${PARAMS.memory},t=${PARAMS.passes},p=${PARAMS.parallelism}$`);

let dummyHash: Promise<string> | undefined;

/**
 * Spends the time of a password check when the account doesn't exist, so response times don't reveal
 * which RMs or e-mails have accounts.
 */
export async function verifyAgainstNothing(password: string) {
  dummyHash ??= hashPassword('not-a-real-password');
  await verifyPassword(password, await dummyHash);
  return false;
}
