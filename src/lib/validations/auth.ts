import { z } from 'zod';

export const roleSchema = z.enum(['client', 'maker', 'manager', 'admin']);
export const sessionSchema = z.object({ userId: z.string().uuid(), role: roleSchema });
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(72),
});
const userFieldsSchema = loginSchema.extend({
  name: z.string().trim().min(1).max(100),
  password: z.string().min(8, 'Минимум 8 символов в пароле').max(72, 'Пароль слишком длинный')
    .refine(value => new TextEncoder().encode(value).length <= 72, 'Пароль должен занимать не более 72 байт'),
});
export const registerSchema = userFieldsSchema.extend({
  confirmPassword: z.string().max(72),
}).refine(value => value.password === value.confirmPassword, {
  message: 'Пароли не совпадают', path: ['confirmPassword'],
});
export const createUserSchema = userFieldsSchema.extend({ role: roleSchema });
export const updateRoleSchema = z.object({ userId: z.string().uuid(), newRole: roleSchema });
