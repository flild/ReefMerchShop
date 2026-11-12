'use server';
import { assertAdmin } from '@/lib/auth';


import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { hash } from 'bcryptjs';
import { createUserSchema, updateRoleSchema } from '@/lib/validations/auth';

type ActionResponse = {
  success?: boolean;
  error?: string;
};

export async function updateUserRole(userId: string, newRole: string): Promise<ActionResponse> {
  try {
    const session = await assertAdmin();

    const parsed = updateRoleSchema.safeParse({ userId, newRole });
    if (!parsed.success) return { success: false, error: 'Некорректная роль или ID пользователя' };

    if (session.userId === userId && newRole !== 'admin') {
      return { 
        success: false, 
        error: 'Самострел запрещен: нельзя снять права администратора с самого себя. Попроси другого админа.' 
      };
    }

    await db.update(users)
      .set({ role: newRole })
      .where(eq(users.id, userId));
      
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Ошибка обновления роли пользователя:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Не удалось обновить роль' 
    };
  }
}

export async function deleteUser(userId: string): Promise<ActionResponse> {
  try {
    const session = await assertAdmin();

    if (session.userId === userId) {
      return { 
        success: false, 
        error: 'Нельзя удалить собственный аккаунт.' 
      };
    }

    await db.delete(users).where(eq(users.id, userId));
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Ошибка удаления пользователя:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Не удалось удалить пользователя' 
    };
  }
}

export async function createUser(
  _prevState: ActionResponse | null, 
  formData: FormData
): Promise<ActionResponse> {
  try {
    await assertAdmin();

    const parsed = createUserSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };
    const { name, email, role, password } = parsed.data;

    if (!name || !email || !password) {
      return { success: false, error: 'Имя, Email и пароль обязательны' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Пароль должен содержать не менее 6 символов' };
    }

    // Проверяем занятость email
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      return { success: false, error: 'Пользователь с таким email уже существует' };
    }

    // Хэшируем пароль с солью
    const passwordHash = await hash(password, 10);
    const newId = crypto.randomUUID();

    await db.insert(users).values({
      id: newId,
      name,
      email,
      role,
      passwordHash,
    });

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Ошибка создания пользователя:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Не удалось создать пользователя' 
    };
  }
}
