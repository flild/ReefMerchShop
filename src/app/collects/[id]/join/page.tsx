import { db } from '@/db';
import { collects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { JoinCollectForm } from '@/components/collects/JoinCollectForm';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';
import { cache } from 'react';


export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

const getCollect = cache(async (id: string) => {
  const [collect] = await db
    .select({
      id: collects.id,
      title: collects.title,
      driveLink: collects.driveLink,
      status: collects.status,
    })
    .from(collects)
    .where(eq(collects.id, id))
    .limit(1);

  return collect;
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const collect = await getCollect(id);
  if (!collect) notFound();

  const canonical = new URL(`/collects/${id}/join`, process.env.NEXT_PUBLIC_SITE_URL || 'https://reef.com').toString();
  const title = `Запись в коллект «${collect.title}»`;
  const description = `Присоединяйся к коллекту «${collect.title}»: оставь контакты, укажи тираж и отправь макет на проверку.`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [{ url: '/og-image.jpg', alt: title }],
    },
  };
}

export default async function JoinCollectPage({ params }: PageProps) {
  const { id } = await params;
  const collect = await getCollect(id);
  if (!collect) notFound();

  return (
    <main className="min-h-screen bg-theme-bg manga-dots py-10 sm:py-16">
      <BreadcrumbJsonLd items={[
        { name: 'Главная', item: '/' },
        { name: 'Коллекты', item: '/collects' },
        { name: collect.title, item: `/collects/${collect.id}/join` },
      ]} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm font-bold text-theme-muted" aria-label="Хлебные крошки">
          <Link href="/collects" className="hover:text-theme-text">Коллекты</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page" className="text-theme-text">Запись в коллект</span>
        </nav>
        {collect.status === 'open' ? <JoinCollectForm
          collectId={collect.id} 
          title={collect.title} 
          driveLink={collect.driveLink} 
        /> : (
          <section className="anime-border anime-shadow mx-auto max-w-2xl bg-theme-surface p-8 text-center sm:p-12">
            <h1 className="mb-4 font-display text-3xl font-black text-theme-text">Набор закрыт</h1>
            <p className="font-bold text-theme-muted">В этот коллект больше нельзя записаться. Посмотри другие открытые сборы.</p>
            <Link href="/collects" className="anime-button mt-8 inline-flex px-6 py-4">Вернуться к коллектам</Link>
          </section>
        )}
      </div>
    </main>
  );
}
