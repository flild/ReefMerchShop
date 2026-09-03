import { db } from '@/db';
import { users } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { RoleSelect } from '@/components/admin/users/RoleSelect';
import { DeleteUserButton } from '@/components/admin/users/DeleteUserButton';
import { UserForm } from '@/components/admin/users/UserForm';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function UsersAdminPage() {
  const session = await getSession();

  if (!session || session.role !== 'admin') {
    redirect('/admin/orders');
  }

  const usersList = await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt));

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-extrabold mb-2 text-theme-text">Пользователи</h1>
          <p className="text-theme-muted font-bold text-lg">
            Управление клиентами и правами доступа персонала
          </p>
        </div>
      </header>

      <UserForm />

      <div className="bg-theme-surface anime-border anime-shadow rounded-[40px] overflow-hidden">
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-theme-border text-theme-muted text-sm uppercase tracking-wider">
                <th className="p-5 font-extrabold">Имя / Email</th>
                <th className="p-5 font-extrabold">Привязки</th>
                <th className="p-5 font-extrabold">Роль</th>
                <th className="p-5 font-extrabold">Дата регистрации</th>
                <th className="p-5 font-extrabold text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((user) => {
                const isSelf = user.id === session.userId;

                return (
                  <tr 
                    key={user.id} 
                    className={`border-b border-theme-border/50 transition-colors ${
                      isSelf ? 'bg-theme-bg/60' : 'hover:bg-theme-bg/50'
                    }`}
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-theme-text text-lg">
                          {user.name}
                        </span>
                        {isSelf && (
                          <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-theme-highlight text-theme-bg">
                            Это вы
                          </span>
                        )}
                      </div>
                      <div className="text-theme-muted text-sm font-bold">
                        {user.email}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col gap-1">
                        {user.telegramId ? (
                          <span className="text-theme-highlight font-bold text-sm bg-theme-bg px-2 py-1 rounded-md border border-theme-border w-fit">
                            TG: {user.telegramId}
                          </span>
                        ) : (
                          <span className="text-theme-muted font-bold text-xs">Нет TG</span>
                        )}
                        {user.vkId ? (
                          <span className="text-[#0077FF] font-bold text-sm bg-theme-bg px-2 py-1 rounded-md border border-theme-border w-fit">
                            VK: {user.vkId}
                          </span>
                        ) : (
                          <span className="text-theme-muted font-bold text-xs">Нет VK</span>
                        )}
                      </div>
                    </td>
                    <td className="p-5">
                      <RoleSelect 
                        userId={user.id} 
                        currentRole={user.role} 
                        isSelf={isSelf} 
                      />
                    </td>
                    <td className="p-5 text-theme-muted font-bold text-sm">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : '—'}
                    </td>
                    <td className="p-5 text-right">
                      {!isSelf ? (
                        <DeleteUserButton userId={user.id} />
                      ) : (
                        <span className="text-xs font-bold text-theme-muted italic">
                          Нельзя удалить
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {usersList.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-theme-muted font-bold text-lg">
                    Пользователей пока нет.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}