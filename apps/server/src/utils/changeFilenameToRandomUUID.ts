import { randomUUID } from 'crypto';
import path from 'path';

export default function changeFilenameToRandomUUID(filename: string) {
  const fileExtension = path.extname(filename);
  const newFilename = randomUUID() + fileExtension;
  return newFilename;
}
