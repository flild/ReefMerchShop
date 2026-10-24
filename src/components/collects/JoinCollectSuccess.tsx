'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import type { CollectRequest } from '@/lib/validations/collect-request';

interface Props {
  title: string;
  request: CollectRequest;
}

export function JoinCollectSuccess({ title, request }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView({ block: 'start' });
  }, []);

  return (
    <section aria-labelledby="join-success">
      <header className="mb-8">
        <h1 ref={headingRef} tabIndex={-1} id="join-success" className="font-display text-3xl font-black text-theme-text outline-none sm:text-4xl">Заявка отправлена</h1>
        <p className="mt-3 break-words text-lg font-bold text-theme-muted">{title}</p>
      </header>
      <div>
        <dl className="space-y-5 border-y-2 border-theme-border py-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-6">
            <dt className="shrink-0 text-sm font-bold text-theme-muted">Макет</dt>
            <dd className="min-w-0 break-words font-extrabold text-theme-text sm:text-right">{request.layoutName}</dd>
          </div>
          <div className="flex justify-between gap-6">
            <dt className="text-sm font-bold text-theme-muted">Тираж</dt>
            <dd className="font-extrabold text-theme-text">{request.quantity} шт.</dd>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-6">
            <dt className="shrink-0 text-sm font-bold text-theme-muted">Email для связи</dt>
            <dd className="min-w-0 break-words font-extrabold text-theme-text sm:text-right">{request.email}</dd>
          </div>
        </dl>
        <p className="my-6 text-sm leading-relaxed text-theme-muted">Менеджер проверит макет и свяжется с тобой по указанным контактам.</p>
        <Link href="/collects" className="anime-button inline-flex w-full items-center justify-center px-6 py-4 sm:w-auto">Вернуться к коллектам</Link>
      </div>
    </section>
  );
}
