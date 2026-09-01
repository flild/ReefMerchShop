import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Package, Heart, Settings, ChevronRight, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { users, collects, collectParticipants } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { LogoutButton } from '@/components/auth/LogoutButton';

export const metadata = {
  title: 'Личный кабинет | Reef',
};

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  // 1. Достаем сессию
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  // 2. Достаем реального юзера
  const [user] = await db.select().from(users).where(eq(users.id, session.userId));
  if (!user) {
    redirect('/login');
  }

  // 3. Достаем заказы с их позициями (через relations)
  const userOrders = await db.query.orders.findMany({
    where: eq((orders) => orders.userId, user.id),
    orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    with: {
      items: true,
    }
  });

  // 4. Достаем коллекты (через join, т.к. relations для них не прописаны)
  const userCollects = await db
    .select({
      collect: collects,
      participant: collectParticipants,
    })
    .from(collectParticipants)
    .innerJoin(collects, eq(collectParticipants.collectId, collects.id))
    .where(eq(collectParticipants.userId, user.id))
    .orderBy(desc(collectParticipants.createdAt));

  // Берем первую букву имени для аватарки
  const initial = user.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <div className="min-h-screen flex flex-col font-sans bg-theme-bg manga-dots">
      <Header />

      <main className="flex-1 py-12 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

            {/* САЙДБАР С ПРОФИЛЕМ */}
            <div className="w-full md:w-80 flex-shrink-0">
              <div className="bg-theme-surface rounded-[40px] p-8 anime-border anime-shadow sticky top-24">
                <div className="flex items-center gap-4 mb-8 pb-8 border-b-2 border-theme-border">
                  <div className="w-16 h-16 bg-theme-bg rounded-2xl anime-border shadow-sm flex items-center justify-center text-theme-highlight text-3xl font-black rotate-[-3deg]">
                    {initial}
                  </div>
                  <div className="overflow-hidden">
                    <h2 className="font-display font-black text-theme-text text-xl leading-tight truncate">
                      {user.name}
                    </h2>
                    <p className="text-theme-muted text-sm font-medium truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <nav className="space-y-3">
                  <Link href="/profile" className="flex items-center gap-3 p-4 bg-theme-highlight/10 text-theme-highlight font-bold rounded-2xl border-2 border-theme-highlight/30 shadow-sm hover:-translate-y-1 transition-all">
                    <Package size={20} strokeWidth={2.5} />
                    История заказов
                  </Link>
                  <Link href="#" className="flex items-center gap-3 p-4 text-theme-muted font-bold rounded-2xl border-2 border-transparent hover:border-theme-border hover:bg-theme-bg hover:text-theme-text hover:-translate-y-1 transition-all">
                    <Heart size={20} strokeWidth={2.5} />
                    Избранное
                  </Link>
                  <Link href="#" className="flex items-center gap-3 p-4 text-theme-muted font-bold rounded-2xl border-2 border-transparent hover:border-theme-border hover:bg-theme-bg hover:text-theme-text hover:-translate-y-1 transition-all">
                    <Settings size={20} strokeWidth={2.5} />
                    Настройки
                  </Link>
                </nav>

                <div className="mt-8 pt-8 border-t-2 border-theme-border">
                  {/* Подключаем нашу рабочую кнопку выхода */}
                  <LogoutButton />
                </div>
              </div>
            </div>

            {/* КОНТЕНТ */}
            <div className="flex-1 space-y-12">

              {/* ИСТОРИЯ ЗАКАЗОВ */}
              <section>
                <h1 className="text-4xl font-display font-black text-theme-text mb-8">История заказов</h1>
                <div className="bg-theme-surface rounded-[40px] p-4 sm:p-6 anime-border anime-shadow">
                  <div className="space-y-4">
                    {userOrders.length === 0 ? (
                      <div className="p-8 text-center text-theme-muted font-bold text-lg">
                        У вас пока нет заказов.
                      </div>
                    ) : (
                      userOrders.map((order) => (
                        <div key={order.id} className="p-4 sm:p-6 rounded-[24px] bg-theme-bg border-2 border-theme-border hover:border-theme-highlight/50 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 group cursor-pointer">
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-theme-surface rounded-2xl flex items-center justify-center text-theme-muted border-2 border-theme-border group-hover:bg-theme-highlight group-hover:text-[var(--theme-btn-text)] group-hover:border-transparent group-hover:-translate-y-1 transition-all shadow-sm">
                              <Package size={26} strokeWidth={2.5} />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-3 mb-2">
                                <span className="font-black text-theme-text text-xl">{order.orderNumber}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-theme-border shadow-[2px_2px_0_0_var(--theme-border)] ${
                                  order.status === 'done' || order.status === 'delivered'
                                    ? 'bg-theme-green-bg text-theme-green-text rotate-[-2deg]' 
                                    : 'bg-theme-yellow-bg text-theme-yellow-text rotate-[2deg]'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                              <div className="text-theme-muted font-medium text-sm flex items-center gap-2">
                                <Clock size={14} className="text-theme-highlight" /> 
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('ru-RU') : '—'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-8 sm:w-1/3">
                            <div className="text-left sm:text-right">
                              <div className="text-sm font-bold text-theme-muted mb-1">
                                {order.items.length} позиций
                              </div>
                              <div className="font-black text-xl text-theme-text">{order.total} ₽</div>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-theme-surface border-2 border-theme-border flex items-center justify-center text-theme-muted group-hover:bg-theme-accent group-hover:text-[var(--theme-btn-text)] group-hover:border-transparent group-hover:shadow-[0_4px_0_0_var(--theme-btn-shadow)] group-hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all">
                              <ChevronRight size={24} strokeWidth={3} />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>

              {/* МОИ КОЛЛЕКТЫ */}
              <section>
                <h2 className="text-3xl font-display font-black text-theme-text mb-8">Мои коллекты</h2>
                {userCollects.length === 0 ? (
                  <div className="bg-theme-surface rounded-[40px] p-8 text-center text-theme-muted font-bold text-lg anime-border anime-shadow">
                    Вы пока не участвуете ни в одном сборе.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userCollects.map(({ collect, participant }) => {
                      const progress = Math.min((collect.currentSum / collect.targetSumLimit) * 100, 100);
                      const isExpired = collect.deadline < new Date();

                      return (
                        <div key={participant.id} className="bg-theme-accent rounded-[40px] p-8 md:p-10 text-[var(--theme-btn-text)] relative overflow-hidden anime-border anime-shadow">
                          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(var(--theme-btn-text)_2px,transparent_2px)] [background-size:20px_20px]" />

                          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div>
                              <div className="inline-flex px-4 py-1.5 bg-theme-bg/20 rounded-full text-xs font-black uppercase tracking-wider mb-4 border-2 border-theme-bg/30 backdrop-blur-sm shadow-[2px_2px_0_0_rgba(255,255,255,0.2)] rotate-[-1deg]">
                                {collect.status === 'open' && !isExpired ? 'Сбор открыт' : 'Сбор закрыт'}
                              </div>
                              <h3 className="text-3xl font-display font-black mb-4 drop-shadow-sm">{collect.title}</h3>
                              <div className="flex flex-wrap items-center gap-4 text-theme-bg/90 font-bold text-sm">
                                <span className="flex items-center gap-1.5 bg-theme-bg/10 px-3 py-1.5 rounded-lg border border-theme-bg/20">
                                  <CheckCircle2 size={18} /> Статус макета: {participant.status}
                                </span>
                                <span className="bg-theme-bg/10 px-3 py-1.5 rounded-lg border border-theme-bg/20">
                                  Сбор до {new Date(collect.deadline).toLocaleDateString('ru-RU')}
                                </span>
                              </div>
                            </div>

                            <div className="text-center bg-theme-bg/10 p-6 rounded-[24px] backdrop-blur-sm border-2 border-theme-bg/20 shadow-inner min-w-[160px]">
                              <div className="text-sm font-bold text-theme-bg/80 mb-2 uppercase tracking-wider">Ваш взнос</div>
                              <div className="text-4xl font-black drop-shadow-md">
                                {participant.totalPrice} <span className="text-xl text-theme-bg/70">₽</span>
                              </div>
                            </div>
                          </div>

                          <div className="relative z-10 mt-10">
                            <div className="w-full bg-theme-bg/30 h-4 rounded-full overflow-hidden shadow-inner border border-theme-bg/20">
                              <div className="bg-[var(--theme-btn-text)] h-full rounded-full transition-all relative" style={{ width: `${progress}%` }}>
                                <div className="absolute inset-0 bg-white/20" />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* ПОРТФОЛИО */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-display font-black text-theme-text">Сохраненные идеи</h2>
                  <Link href="/portfolio" className="text-sm font-bold text-theme-highlight hover:text-theme-text transition-colors">
                    В портфолио &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="group relative rounded-[32px] overflow-hidden bg-theme-surface anime-border anime-shadow hover:anime-shadow-hover hover:-translate-y-2 transition-all duration-300">
                      <div className="relative aspect-square overflow-hidden bg-theme-bg">
                        <Image
                          src={`https://picsum.photos/seed/reef${i}/400/400`}
                          alt={`Idea ${i}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 p-3 bg-theme-surface/80 backdrop-blur-md rounded-full border-2 border-theme-border shadow-sm text-rose-500 hover:scale-110 transition-transform cursor-pointer">
                          <Heart size={20} className="fill-current" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}