import { mkdir, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { z } from 'zod';

const imageSchema = z.instanceof(File).refine(file => file.size > 0 && file.size <= 5 * 1024 * 1024,
  'Размер изображения должен быть от 1 байта до 5 МБ');

export async function saveImage(file: unknown, folder: 'portfolio' | 'articles' | 'materials' | 'proofs') {
  const parsed = imageSchema.safeParse(file);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  const image = sharp(Buffer.from(await parsed.data.arrayBuffer()), { limitInputPixels: 25_000_000 });
  const metadata = await image.metadata();
  if (!metadata.format || !['jpeg', 'png', 'webp'].includes(metadata.format)) {
    throw new Error('Допустимы изображения JPEG, PNG и WebP');
  }
  const buffer = await image.rotate().jpeg({ quality: 90 }).toBuffer();
  const filename = `${crypto.randomUUID()}.jpg`;
  const privateFile = folder === 'proofs';
  const directory = path.join(process.cwd(), privateFile ? 'uploads' : 'public/uploads', folder);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), buffer, { flag: 'wx' });
  return { path: privateFile ? `private:proofs/${filename}` : `/uploads/${folder}/${filename}`, size: buffer.length, mimeType: 'image/jpeg' };
}

export async function removeImage(url: string) {
  const parsed = /^\/uploads\/(portfolio|articles|materials)\/([a-f0-9-]{36}\.jpg)$/.exec(url);
  if (!parsed) return;
  await unlink(path.join(process.cwd(), 'public/uploads', parsed[1], parsed[2])).catch(() => {});
}
