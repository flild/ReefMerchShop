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
    <label className="flex items-center gap-2 cursor-pointer font-bold text-theme-text mt-4 select-none">
      <input
        type="checkbox"
        checked={staffOnly}
        onChange={toggleFilter}
        className="w-5 h-5 accent-theme-accent cursor-pointer"
      />
      Только сотрудники
    </label>
  );
}
