// src/lib/validations/collects.ts
import { z } from 'zod';

export const collectSchema = z.object({
  title: z.string().trim().min(3, 'Название должно содержать минимум 3 символа'),
  description: z.string().trim().default(''),
  deadline: z.coerce.date({ message: 'Укажите корректную дату дедлайна' }),
  productionDate: z.string().trim().min(1, 'Укажите сроки производства'),
  minCount: z.coerce.number().int().min(1, 'Минимальный тираж должен быть не менее 1 шт.'),
  targetSumLimit: z.coerce.number().int().min(1000, 'Минимальная сумма сбора — 1 000 ₽').default(250000),
  driveLink: z
    .string()
    .trim()
    .url('Укажите корректную ссылку')
    .or(z.literal(''))
    .nullable()
    .transform((val) => val || null),
});

export const participantSchema = z.object({
  collectId: z.string().uuid('Некорректный ID коллекта'),
  nickname: z.string().trim().min(1, 'Укажите никнейм или имя заказчика'),
  email: z.string().trim().email('Некорректный формат email'),
  vkId: z
    .string()
    .trim()
    .or(z.literal(''))
    .nullable()
    .transform((val) => val || null),
  telegram: z
    .string()
    .trim()
    .or(z.literal(''))
    .nullable()
    .transform((val) => val || null),
  layoutName: z
    .string()
    .trim()
    .or(z.literal(''))
    .nullable()
    .transform((val) => val || null),
  layoutLink: z
    .string()
    .trim()
    .url('Укажите корректный URL ссылки на макет')
    .or(z.literal(''))
    .nullable()
    .transform((val) => val || null),
  quantity: z.coerce.number().int().min(10, 'Минимальный тираж — 10 шт.'),
  totalPrice: z.coerce.number().int().min(0, 'Сумма не может быть отрицательной'),
});

export const updateParticipantDataSchema = participantSchema.omit({ collectId: true }).partial({
  totalPrice: true,
});