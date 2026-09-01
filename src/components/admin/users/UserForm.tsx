'use client';

import { useActionState } from 'react';
import { createUser } from '@/actions/admin/users';
import { ROLES } from '@/config/roles';

export function UserForm() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const res = await createUser(formData);
      if (res.success) {
        // Очищаем форму топорно, но надежно
        document.getElementById('create-user-form')?.closest('form')?.reset();
      }
      return res;
    },
    null
  );

  return (
    <form id="create-user-form" action={formAction} className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 mb-8 flex flex-col gap-6">
      <h2 className="text-2xl font-display font-extrabold text-theme-text mb-2">Создать пользователя</h2>
      
      {state?.error && (
        <div className="bg-theme-yellow-bg text-theme-yellow-text p-4 rounded-xl font-bold border-2 border-theme-yellow-text">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="bg-theme-green-bg text-theme-green-text p-4 rounded-xl font-bold border-2 border-theme-green-text">
          Пользователь успешно создан!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Имя</label>
          <input 
            type="text" 
            name="name" 
            required
            placeholder="Иван Иванов"
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Email</label>
          <input 
            type="email" 
            name="email" 
            required
            placeholder="ivan@example.com"
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Роль</label>
          <select 
            name="role"
            defaultValue="client"
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow appearance-none"
          >
            {Object.entries(ROLES).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <button 
          type="submit" 
          disabled={isPending}
          className="anime-button px-8 py-3 text-lg disabled:opacity-50"
        >
          {isPending ? 'Создаем...' : 'Создать'}
        </button>
      </div>
    </form>
  );
}