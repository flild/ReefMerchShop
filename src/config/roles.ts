export const ROLES = {
  client: 'Клиент',
  maker: 'Дизайнер макетов',
  manager: 'Менеджер',
  admin: 'Админ',
} as const;

// Неизвестные роли не дают доступ к закрытым разделам.
export type AppRole = keyof typeof ROLES;
