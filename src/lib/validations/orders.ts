import { z } from 'zod';

// Схема для шапки заказа (создание/редактирование)
export const orderSchema = z.object({
  userId: z.string().optional().nullable(),
  customClientName: z.string().optional(),
  customClientContact: z.string().optional(),
  total: z.coerce.number().min(0, 'Сумма не может быть отрицательной'),
  status: z.enum(['new', 'layout', 'proofing', 'production', 'shipping', 'completed']).default('new'),
  details: z.string().optional(),
});

// Схема для добавления конкретной позиции (макета) в заказ
export const orderItemSchema = z.object({
  orderId: z.string().min(1, 'Системная ошибка: ID заказа обязателен'),
  name: z.string().min(1, 'Укажи название позиции (например, имя персонажа)'),
  productType: z.string().min(1, 'Выбери тип изделия'),
  quantity: z.coerce.number().min(1, 'Минимальный тираж — 1 шт.'),
  materialId: z.string().optional().nullable(),
  accessoryId: z.string().optional().nullable(),
  areaCm2: z.coerce.number().optional().nullable(),
  price: z.coerce.number().min(0, 'Цена не может быть отрицательной'),
  fileId: z.string().optional().nullable(), // Может быть пустым, если макет загрузят позже
});

// Схема для загрузки цветопробы
export const orderProofSchema = z.object({
  orderId: z.string().min(1, 'Системная ошибка: ID заказа обязателен'),
  orderItemId: z.string().min(1, 'Выбери позицию (макет), к которой относится цветопроба'),
  fileId: z.string().min(1, 'Загрузи фотографию цветопробы'),
  managerComment: z.string().optional(),
});