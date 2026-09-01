'use client';

import { useActionState } from 'react';
import { login } from '@/actions/auth';
import Link from 'next/link';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-theme-bg font-sans manga-dots p-4">
      <div className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 w-full max-w-md">
        <h1 className="text-3xl font-display font-black text-theme-text mb-6 text-center">
          Вход
        </h1>

        <form action={formAction} className="flex flex-col gap-5">
          {state?.error && (
            <div className="bg-theme-yellow-bg text-theme-yellow-text p-4 rounded-xl font-bold border-2 border-theme-yellow-text text-center">
              {state.error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="font-extrabold text-theme-text ml-2">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="user@example.com"
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-extrabold text-theme-text ml-2">Пароль</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="anime-button w-full py-4 text-lg mt-4 disabled:opacity-50"
          >
            {isPending ? 'Загрузка...' : 'Войти'}
          </button>
        </form>

        <div className="mt-6 text-center text-theme-muted font-bold text-sm">
          Нет аккаунта?{' '}
          <Link href="/register" className="text-theme-highlight hover:underline">
            Регистрация
          </Link>
        </div>
      </div>
    </div>
  );
}