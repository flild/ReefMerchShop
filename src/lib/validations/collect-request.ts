import { z } from 'zod';

export const collectRequestSchema = z.object({
  collectId: z.string().uuid('Некорректный ID коллекта'),
  nickname: z.string().trim().min(1, 'Укажи свой никнейм').max(100),
  email: z.string().trim().email('Проверь адрес электронной почты').max(254),
  vkId: z.string().trim().max(100).default(''),
  telegram: z.string().trim().max(100).default(''),
  layoutName: z.string().trim().min(1, 'Укажи название макета').max(200),
  layoutLink: z.string().trim().max(2048).url('Укажи полную ссылку на файлы, начиная с https://')
    .refine((value) => /^https?:\/\//i.test(value), 'Используй ссылку на файлы с http:// или https://'),
  quantity: z.coerce.number().int('Тираж должен быть целым числом').min(10, 'Минимальный тираж — 10 штук'),
  consent: z.literal('on', { error: 'Нужно согласие на обработку персональных данных и условия оферты' }),
  layoutsChecked: z.literal('on', { error: 'Подтверди проверку макетов по чек-листу' }),
});

export type CollectRequest = z.infer<typeof collectRequestSchema>;
