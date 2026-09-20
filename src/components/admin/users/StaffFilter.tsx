'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function StaffFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const staffOnly = searchParams.get('staffOnly') === 'true';

  const toggleFilter = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (staffOnly) {
      params.delete('staffOnly');
    } else {
      params.set('staffOnly', 'true');
    }
    router.push(`?${params.toString()}`);
  }, [staffOnly, searchParams, router]);

  return (
    <button
      onClick={toggleFilter}
      className={`px-4 py-2 rounded-full font-bold text-sm transition-colors border-2 ${
        staffOnly
          ? 'bg-theme-text text-theme-bg border-theme-text'
          : 'bg-transparent text-theme-muted border-theme-border hover:border-theme-text hover:text-theme-text'
      }`}
    >
      Персонал
    </button>
  );
}
