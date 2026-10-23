import { z } from 'zod';

export const collectRequestSchema = z.object({
  collectId: z.string().uuid('Некорректный ID коллекта'),
  nickname: z.string().trim().min(1, 'Укажи свой никнейм'),
  email: z.string().trim().email('Проверь адрес электронной почты'),
  vkId: z.string().trim().default(''),
  telegram: z.string().trim().default(''),
  layoutName: z.string().trim().min(1, 'Укажи название макета'),
  layoutLink: z.string().trim().url('Укажи полную ссылку на файлы, начиная с https://')
    .refine((value) => /^https?:\/\//i.test(value), 'Используй ссылку на файлы с http:// или https://'),
  quantity: z.coerce.number().int('Тираж должен быть целым числом').min(10, 'Минимальный тираж — 10 штук'),
  consent: z.literal('on', { error: 'Нужно согласие на обработку персональных данных и условия оферты' }),
  layoutsChecked: z.literal('on', { error: 'Подтверди проверку макетов по чек-листу' }),
});

export type CollectRequest = z.infer<typeof collectRequestSchema>;
