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

export async function incrementReadCount(slug: string) {
  try {
    await db.update(articles)
      .set({ readsCount: sql`${articles.readsCount} + 1` })
      .where(eq(articles.slug, slug));
  } catch (error) {
    console.error('Ошибка обновления дочитываний:', error);
  }
}

export async function rateArticle(slug: string, isLike: boolean) {
  try {
    if (isLike) {
      await db.update(articles)
        .set({ likesCount: sql`${articles.likesCount} + 1` })
        .where(eq(articles.slug, slug));
    } else {
      await db.update(articles)
        .set({ dislikesCount: sql`${articles.dislikesCount} + 1` })
        .where(eq(articles.slug, slug));
    }
  } catch (error) {
    console.error('Ошибка оценки статьи:', error);
  }
}