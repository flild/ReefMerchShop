'use client';

import { useEffect, useRef } from 'react';
import { incrementReadCount } from '@/actions/client/articles';

export function ReadTracker({ slug }: { slug: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const tracked = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !tracked.current) {
          incrementReadCount(slug);
          tracked.current = true;
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) { 
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [slug]);

  // Невидимый элемент-триггер
  return <div ref={ref} className="h-1 w-full" aria-hidden="true" />;
}