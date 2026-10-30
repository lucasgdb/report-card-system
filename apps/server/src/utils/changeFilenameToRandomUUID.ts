import { randomUUID } from 'node:crypto';
import path from 'node:path';

export default function changeFilenameToRandomUUID(filename: string) {
  const fileExtension = path.extname(filename);
  const newFilename = randomUUID() + fileExtension;
  return newFilename;
}
