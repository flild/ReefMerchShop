'use client';

import { useActionState } from 'react';
import { createOrder, updateOrder } from '@/actions/admin/orders';
import Link from 'next/link';

interface User {
  id: string;
  name: string | null;
  email: string | null;
}

interface OrderData {
  id: string;
  userId: string | null;
  total: number;
  detailsJson: string;
}

interface OrderFormProps {
  users: User[];
  initialData?: OrderData;
}

export function OrderForm({ users, initialData }: OrderFormProps) {
  const isEditing = !!initialData?.id;

  // Распаковываем JSON, если он есть
  let parsedDetails = { managerNote: '', customClientName: '', customClientContact: '' };
  if (initialData?.detailsJson) {
    try {
      parsedDetails = JSON.parse(initialData.detailsJson);
    } catch (e) {
      console.error('Ошибка парсинга detailsJson');
    }
  }

  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      if (isEditing) {
        return await updateOrder(initialData.id, formData);
      }
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
        <label className="font-extrabold text-theme-text ml-2">Привязка к аккаунту (Опционально)</label>
        <select 
          name="userId"
          defaultValue={initialData?.userId || ''}
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
          <label className="font-extrabold text-theme-text ml-2">Имя (Переопределение)</label>
          <input 
            type="text" 
            name="customClientName" 
            defaultValue={parsedDetails.customClientName}
            placeholder="Ручной ввод имени"
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Контакты (Email / TG)</label>
          <input 
            type="text" 
            name="customClientContact" 
            defaultValue={parsedDetails.customClientContact}
            placeholder="Куда писать?"
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Итоговая сумма (₽)</label>
          <input 
            type="number" 
            name="total" 
            required
            min="0"
            defaultValue={initialData?.total ?? 0}
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>

        {!isEditing && (
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
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-extrabold text-theme-text ml-2">Детали (Заметка для админа)</label>
        <textarea 
          name="details" 
          rows={4}
          defaultValue={parsedDetails.managerNote}
          placeholder="Например: Заказ из ВК, просил сделать поярче."
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all resize-none"
        />
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button 
          type="submit" 
          disabled={isPending}
          className="anime-button px-8 py-3 text-lg disabled:opacity-50"
        >
          {isPending ? 'Сохраняем...' : (isEditing ? 'Обновить заказ' : 'Создать заказ')}
        </button>
        <Link 
          href={isEditing ? `/admin/orders/${initialData.id}` : "/admin/orders"}
          className="px-8 py-3 rounded-full font-bold text-theme-muted hover:text-theme-text transition-colors"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}