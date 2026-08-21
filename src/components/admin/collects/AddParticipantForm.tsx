'use client';

import { useActionState } from 'react';
import { addParticipant } from '@/actions/admin/collects';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
}

interface File {
  id: string;
  name: string;
}

interface Props {
  collectId: string;
  users: User[];
  files: File[];
}

export function AddParticipantForm({ collectId, users, files }: Props) {
  const [state, formAction, isPending] = useActionState(addParticipant, null);

  return (
    <form action={formAction} className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 max-w-2xl flex flex-col gap-6">
      {state?.error && (
        <div className="bg-theme-yellow-bg text-theme-yellow-text p-4 rounded-xl font-bold border-2 border-theme-yellow-text">
          {state.error}
        </div>
      )}

      {/* Скрытое поле для ID коллекта */}
      <input type="hidden" name="collectId" value={collectId} />

      <div className="flex flex-col gap-2">
        <label className="font-extrabold text-theme-text ml-2">Художник (Пользователь)</label>
        <select 
          name="userId" 
          required
          defaultValue=""
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all cursor-pointer appearance-none"
        >
          <option value="" disabled>-- Выбери художника --</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-extrabold text-theme-text ml-2">Макет (Файл)</label>
        <select 
          name="fileId" 
          required
          defaultValue=""
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all cursor-pointer appearance-none"
        >
          <option value="" disabled>-- Выбери загруженный макет --</option>
          {files.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
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
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
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
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button 
          type="submit" 
          disabled={isPending}
          className="anime-button px-8 py-3 text-lg disabled:opacity-50"
        >
          {isPending ? 'Загрузка...' : 'Добавить участника'}
        </button>
        <Link 
          href={`/admin/collects/${collectId}`}
          className="px-8 py-3 rounded-full font-bold text-theme-muted hover:text-theme-text transition-colors"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}