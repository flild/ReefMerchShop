'use server';

import { db } from '@/db';
import { articles } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function incrementViewCount(slug: string) {
  try {
    // Используем SQL-инкремент на уровне БД, чтобы избежать состояний гонки (race conditions)
    await db.update(articles)
      .set({ viewsCount: sql`${articles.viewsCount} + 1` })
      .where(eq(articles.slug, slug));
  } catch (error) {
    console.error('Ошибка обновления просмотров:', error);
  }
}