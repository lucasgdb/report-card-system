import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

import env from '#/env.ts';
import logger from '#/logger.ts';
import { PUBLIC_DIR } from '#/paths.ts';

/** Where uploaded files live: this server's `public/` folder or an S3-compatible bucket. */
type Storage = {
  /** Saves a file and returns its public URL. */
  put(key: string, body: Uint8Array, contentType: string): Promise<string>;
  /** Deletes a file by the URL `put` returned; files it doesn't know are left alone. */
  remove(url: string): Promise<void>;
};

const localStorage = (): Storage => {
  const baseUrl = `${env.BASE_URL}/public/`;
  return {
    async put(key, body) {
      const file = path.join(PUBLIC_DIR, key);
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, body);
      return baseUrl + key;
    },
    async remove(url) {
      if (url.startsWith(baseUrl)) {
        await unlink(path.join(PUBLIC_DIR, url.slice(baseUrl.length))).catch(() => undefined);
      }
    },
  };
};

const s3Storage = (): Storage => {
  const baseUrl = `${env.S3_PUBLIC_URL!.replace(/\/$/, '')}/`;
  // Loaded only when used: the SDK is large and local development doesn't need it.
  const client = import('@aws-sdk/client-s3').then(({ S3Client }) => ({
    S3Client,
    instance: new S3Client({
      region: env.S3_REGION ?? 'us-east-1',
      endpoint: env.S3_ENDPOINT,
      forcePathStyle: Boolean(env.S3_ENDPOINT),
      credentials:
        env.S3_ACCESS_KEY_ID && env.S3_SECRET_ACCESS_KEY
          ? { accessKeyId: env.S3_ACCESS_KEY_ID, secretAccessKey: env.S3_SECRET_ACCESS_KEY }
          : undefined,
    }),
  }));

  return {
    async put(key, body, contentType) {
      const { PutObjectCommand } = await import('@aws-sdk/client-s3');
      const { instance } = await client;
      await instance.send(
        new PutObjectCommand({
          Bucket: env.S3_BUCKET,
          Key: key,
          Body: body,
          ContentType: contentType,
          CacheControl: 'public, max-age=31536000, immutable',
        })
      );
      return baseUrl + key;
    },
    async remove(url) {
      if (!url.startsWith(baseUrl)) {
        return;
      }
      const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
      const { instance } = await client;
      await instance.send(new DeleteObjectCommand({ Bucket: env.S3_BUCKET, Key: url.slice(baseUrl.length) }));
    },
  };
};

const storage = env.STORAGE_DRIVER === 's3' ? s3Storage() : localStorage();

/** Best-effort cleanup: a file left behind is not worth failing the request for. */
export const removeQuietly = (url: string | null | undefined) =>
  url ? storage.remove(url).catch((error) => logger.warn({ error, url }, 'could not remove file')) : undefined;

export default storage;
