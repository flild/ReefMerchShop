'use client';

import { useActionState, useState } from 'react';
import { createUser } from '@/actions/admin/users';
import { ROLES } from '@/config/roles';

function generateRandomPassword() {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%';
  let pass = '';
  for (let i = 0; i < 10; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

export function UserForm() {
  const [state, formAction, isPending] = useActionState(createUser, null);
  const [password, setPassword] = useState('');

  const handleGenerate = () => {
    setPassword(generateRandomPassword());
  };

  return (
    <form 
      action={formAction} 
      className="bg-theme-surface anime-border anime-shadow rounded-[32px] p-6 flex flex-col gap-6"
    >
      <h2 className="text-xl font-display font-extrabold text-theme-text border-b-2 border-theme-border pb-3">
        + Создать сотрудника / пользователя
      </h2>

      {state?.error && (
        <div className="bg-theme-yellow-bg text-theme-yellow-text p-4 rounded-xl font-bold border-2 border-theme-yellow-text text-sm">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="bg-theme-green-bg text-theme-green-text p-4 rounded-xl font-bold border-2 border-theme-green-text text-sm">
          Пользователь успешно создан!
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text text-sm ml-2">Имя</label>
          <input
            type="text"
            name="name"
            required
            placeholder="Иван Иванов"
            disabled={isPending}
            className="bg-theme-bg border-2 border-theme-border rounded-[16px] px-4 py-2.5 font-bold text-theme-text text-sm outline-none focus:border-theme-highlight transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text text-sm ml-2">Email</label>
          <input
            type="email"
            name="email"
            required
            placeholder="user@reef.local"
            disabled={isPending}
            className="bg-theme-bg border-2 border-theme-border rounded-[16px] px-4 py-2.5 font-bold text-theme-text text-sm outline-none focus:border-theme-highlight transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text text-sm ml-2">Роль</label>
          <select
            name="role"
            defaultValue="maker"
            disabled={isPending}
            className="bg-theme-bg border-2 border-theme-border rounded-[16px] px-4 py-2.5 font-bold text-theme-text text-sm outline-none focus:border-theme-highlight transition-all cursor-pointer"
          >
            {Object.entries(ROLES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center ml-2">
            <label className="font-extrabold text-theme-text text-sm">Пароль</label>
            <button
              type="button"
              onClick={handleGenerate}
              className="text-xs font-bold text-theme-highlight hover:underline cursor-pointer"
            >
              Сгенерировать
            </button>
          </div>
          <input
            type="text"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Минимум 6 знаков"
            disabled={isPending}
            className="bg-theme-bg border-2 border-theme-border rounded-[16px] px-4 py-2.5 font-bold text-theme-text text-sm outline-none focus:border-theme-highlight transition-all font-mono"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="anime-button px-6 py-2.5 text-sm disabled:opacity-50 cursor-pointer"
        >
          {isPending ? 'Создаем...' : '+ Сохранить пользователя'}
        </button>
      </div>
    </form>
  );
}