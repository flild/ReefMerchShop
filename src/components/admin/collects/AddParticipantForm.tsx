'use client';

import { useActionState } from 'react';
import { addParticipant } from '@/actions/admin/collects';
import Link from 'next/link';

interface Props {
  collectId: string;
}

export function AddParticipantForm({ collectId }: Props) {
  const [state, formAction, isPending] = useActionState(addParticipant, null);

  return (
    <form action={formAction} className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 max-w-3xl flex flex-col gap-8">
      {state?.error && (
        <div className="bg-theme-yellow-bg text-theme-yellow-text p-4 rounded-xl font-bold border-2 border-theme-yellow-text">
          {state.error}
        </div>
      )}

      <input type="hidden" name="collectId" value={collectId} />

      {/* БЛОК 1: КОНТАКТЫ */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xl font-display font-extrabold text-theme-text border-b-2 border-theme-border pb-2">
          Контакты заказчика
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-extrabold text-theme-text ml-2">Никнейм / Имя</label>
            <input 
              name="nickname" 
              required
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight transition-all"
              placeholder="Например: Арт-Самурай"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-extrabold text-theme-text ml-2">Email</label>
            <input 
              name="email" 
              type="email"
              required
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight transition-all"
              placeholder="pochta@mail.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-extrabold text-theme-text ml-2 text-sm">VK ID (опционально)</label>
            <input 
              name="vkId" 
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight transition-all"
              placeholder="vk.com/id"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-extrabold text-theme-text ml-2 text-sm">Telegram (опционально)</label>
            <input 
              name="telegram" 
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight transition-all"
              placeholder="@username"
            />
          </div>
        </div>
      </div>

      {/* БЛОК 2: МАКЕТ И ДЕНЬГИ */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xl font-display font-extrabold text-theme-text border-b-2 border-theme-border pb-2">
          Макет и Финансы
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-extrabold text-theme-text ml-2">Название макета</label>
            <input 
              name="layoutName" 
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight transition-all"
              placeholder="Брелок 5см акрил"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-extrabold text-theme-text ml-2">Ссылка на файлы (Я.Диск / Google)</label>
            <input 
              name="layoutLink" 
              type="url"
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight transition-all"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-extrabold text-theme-text ml-2">Тираж (шт)</label>
            <input 
              type="number" 
              name="quantity" 
              required
              min="10"
              defaultValue="10"
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-extrabold text-theme-text ml-2">Сумма заказа (₽)</label>
            <input 
              type="number" 
              name="totalPrice" 
              required
              min="0"
              placeholder="Например: 5000"
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <button 
          type="submit" 
          disabled={isPending}
          className="anime-button px-8 py-4 text-lg disabled:opacity-50"
        >
          {isPending ? 'Сохраняем...' : '+ Добавить участника'}
        </button>
        <Link 
          href={`/admin/collects/${collectId}`}
          className="px-8 py-4 rounded-full font-bold text-theme-muted hover:text-theme-text transition-colors"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}