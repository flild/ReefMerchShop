'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Mail } from 'lucide-react';
import type { CollectRequest } from '@/lib/validations/collect-request';

interface Props {
  title: string;
  request: CollectRequest;
}

export function JoinCollectSuccess({ title, request }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, []);

  return (
    <section className="anime-border anime-shadow mx-auto max-w-2xl overflow-hidden bg-theme-surface" aria-labelledby="join-success">
      <div className="border-b-2 border-dashed border-theme-border bg-theme-green-bg/40 p-6 text-center sm:p-10">
        <div className="anime-shadow mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-theme-green-bg text-theme-green-text rotate-[-6deg]" aria-hidden="true">
          <Check size={42} strokeWidth={3} />
        </div>
        <p className="mb-2 text-xs font-black uppercase tracking-widest text-theme-green-text">Заявка отправлена</p>
        <h1 ref={headingRef} tabIndex={-1} id="join-success" className="font-display text-3xl font-black text-theme-text outline-none sm:text-4xl">Твой мерч на борту!</h1>
        <p className="mt-3 break-words font-bold text-theme-muted">{title}</p>
      </div>
      <div className="p-6 sm:p-10">
        <dl className="mb-6 space-y-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-6">
            <dt className="shrink-0 text-sm font-bold text-theme-muted">Макет</dt>
            <dd className="min-w-0 break-words font-extrabold text-theme-text sm:text-right">{request.layoutName}</dd>
          </div>
          <div className="flex justify-between gap-6">
            <dt className="text-sm font-bold text-theme-muted">Тираж</dt>
            <dd className="font-extrabold text-theme-text">{request.quantity} шт.</dd>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-6">
            <dt className="flex shrink-0 items-center gap-2 text-sm font-bold text-theme-muted"><Mail size={16} aria-hidden="true" /> Email для связи</dt>
            <dd className="min-w-0 break-words font-extrabold text-theme-text sm:text-right">{request.email}</dd>
          </div>
        </dl>
        <div className="mb-8 rounded-2xl bg-theme-bg p-5">
          <h2 className="mb-2 font-extrabold text-theme-text">Что дальше?</h2>
          <p className="text-sm font-medium leading-relaxed text-theme-muted">Менеджер проверит макет, рассчитает стоимость и свяжется с тобой по указанным контактам. Если понадобятся правки — подскажем, что поправить.</p>
        </div>
        <Link href="/collects" className="anime-button flex items-center justify-center gap-2 px-5 py-4"><ArrowLeft size={18} aria-hidden="true" /> Вернуться к коллектам</Link>
      </div>
    </section>
  );
}
