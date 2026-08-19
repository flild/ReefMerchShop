'use client';

import { useActionState } from 'react';
import { createOrder } from '@/actions/admin/orders';
import Link from 'next/link';

interface User {
  id: string;
  name: string | null;
  email: string | null;
}

interface OrderFormProps {
  users: User[];
}

export function OrderForm({ users }: OrderFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await createOrder(formData);
    },
    null
  );

  return (
    <form action={formAction} className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 max-w-2xl flex flex-col gap-6">
      {state?.error && (
        <div className="bg-theme-yellow-bg text-theme-yellow-text p-4 rounded-xl font-bold border-2 border-theme-yellow-text">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="font-extrabold text-theme-text ml-2">Клиент (Пользователь)</label>
        <select 
          name="userId"
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow appearance-none cursor-pointer"
        >
          <option value="">Гость (Без привязки к аккаунту)</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>
              {u.name || 'Без имени'} {u.email ? `(${u.email})` : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Итоговая сумма (₽)</label>
          <input 
            type="number" 
            name="total" 
            required
            min="0"
            defaultValue="0"
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Начальный статус</label>
          <select 
            name="status"
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow appearance-none cursor-pointer"
          >
            <option value="new">Новый</option>
            <option value="layout">Верстка</option>
            <option value="proofing">Цветопроба</option>
            <option value="production">В производстве</option>
            <option value="shipping">Отправка</option>
            <option value="completed">Завершен</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-extrabold text-theme-text ml-2">Детали (Заметка для админа)</label>
        <textarea 
          name="details" 
          rows={4}
          placeholder="Например: Заказ из ВК, просил сделать поярче. Оплата наличными при встрече."
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all resize-none"
        />
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button 
          type="submit" 
          disabled={isPending}
          className="anime-button px-8 py-3 text-lg disabled:opacity-50"
        >
          {isPending ? 'Создаем...' : 'Создать заказ'}
        </button>
        <Link 
          href="/admin/orders"
          className="px-8 py-3 rounded-full font-bold text-theme-muted hover:text-theme-text transition-colors"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}