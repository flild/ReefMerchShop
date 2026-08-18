'use client';

import { useEffect, useRef } from 'react';
import { incrementViewCount } from '@/actions/client/articles';

export function ViewTracker({ slug }: { slug: string }) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!hasTracked.current) {
      const sessionKey = `viewed_${slug}`;

      if (!sessionStorage.getItem(sessionKey)) {
        incrementViewCount(slug);
        sessionStorage.setItem(sessionKey, 'true');
      }

      hasTracked.current = true;
    }
  }, [slug]);

  return null;
}