export const ROLES = {
  client: 'Клиент',
  maker: 'Дизайнер макетов',
  manager: 'Менеджер',
  admin: 'Админ',
} as const;

// Хитрий тип: дает автокомплит для базовых ролей, но позволяет прокинуть любую строку, 
// если добавишь новую роль прямо в БД
export type AppRole = keyof typeof ROLES | (string & {});