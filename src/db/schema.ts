import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('client'), // client, manager, admin
  telegramId: text('telegram_id'),
  vkId: text('vk_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});
export const articles = sqliteTable('articles', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(), // Для красивых URL типа /guides/kak-sdelat-brelok
  title: text('title').notNull(),
  coverImage: text('cover_image'), // Заглавное фото
  contentMd: text('content_md').notNull().default(''), // Текст в Markdown
  viewsCount: integer('views_count').notNull().default(0),
  readsCount: integer('reads_count').notNull().default(0), // Срабатывает, когда доскроллили до конца
  likesCount: integer('likes_count').notNull().default(0),
  dislikesCount: integer('dislikes_count').notNull().default(0),
  isPublished: integer('is_published', { mode: 'boolean' }).notNull().default(false), // Черновик или опубликовано
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});
export const blanks = sqliteTable('blanks', {
  id: text('id').primaryKey(),
  materialId: text('material_id').references(() => materials.id), // Из какого форматника нарезано
  name: text('name').notNull(), // Например: "Основа 50х50"
  size: text('size'), // Например: "50x50 мм"
  stock: integer('stock').notNull().default(0), // шт
  minStock: integer('min_stock').notNull().default(50),
});

export const files = sqliteTable('files', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  path: text('path').notNull(), // Путь в S3 или локальном хранилище
  mimeType: text('mime_type'),
  size: integer('size'),
  ownerId: text('owner_id').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
});
export const portfolioItems = sqliteTable('portfolio_items', {
  id: text('id').primaryKey(),
  categoryId: text('category_id').references(() => categories.id),
  title: text('title').notNull(),
  description: text('description'),
  imageUrl: text('image_url').notNull(),
  authorName: text('author_name'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const materialCategories = sqliteTable('material_categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
});

export const materials = sqliteTable('materials', {
  id: text('id').primaryKey(),
  categoryId: text('category_id').references(() => materialCategories.id),
  type: text('type').notNull(), // 'acrylic', 'holography'
  name: text('name').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  stock: integer('stock').notNull().default(0), // Остаток в см2 или листах
  minStock: integer('min_stock').notNull().default(1000), // Порог уведомления
  inStock: integer('in_stock', { mode: 'boolean' }).notNull().default(false),
  pricePerCm2: real('price_per_cm2').notNull().default(0),
});

export const accessories = sqliteTable('accessories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  imageUrl: text('image_url'),
  stock: integer('stock').notNull().default(0),
  minStock: integer('min_stock').notNull().default(50),
  price: integer('price').notNull().default(0),
});

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  userId: text('user_id').references(() => users.id),
  status: text('status').notNull().default('new'), // new, layout, proofing, production, shipping, completed
  total: integer('total').notNull().default(0),
  detailsJson: text('details_json').notNull(), // Слепок конфигурации для UI
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  productType: text('product_type').notNull(), // например, 'keychain'
  quantity: integer('quantity').notNull().default(1),
  materialId: text('material_id').references(() => materials.id),
  accessoryId: text('accessory_id').references(() => accessories.id),
  areaCm2: real('area_cm2'), // Площадь для списания акрила
  price: integer('price').notNull(),
  fileId: text('file_id').references(() => files.id), // Ссылка на макет
});

export const orderStatusHistory = sqliteTable('order_status_history', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  status: text('status').notNull(),
  comment: text('comment'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const orderProofs = sqliteTable('order_proofs', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  fileId: text('file_id').notNull().references(() => files.id),
  status: text('status').notNull().default('pending'), // pending, approved, rejected
  managerComment: text('manager_comment'),
  clientComment: text('client_comment'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const collects = sqliteTable('collects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  deadline: integer('deadline', { mode: 'timestamp' }).notNull(),
  productionDate: text('production_date').notNull(),
  minCount: integer('min_count').notNull(),
  currentCount: integer('current_count').notNull().default(0),
  // Новые поля
  currentSum: integer('current_sum').notNull().default(0), // Для расчета скидок
  driveLink: text('drive_link'), // Ссылка на папку
  status: text('status').notNull().default('open'), // open, review, in_progress, completed
});

export const collectParticipants = sqliteTable('collect_participants', {
  id: text('id').primaryKey(),
  collectId: text('collect_id').notNull().references(() => collects.id),
  userId: text('user_id').notNull().references(() => users.id),
  quantity: integer('quantity').notNull().default(1),
  totalPrice: integer('total_price').notNull().default(0),
  fileId: text('file_id').notNull().references(() => files.id),
  status: text('status').notNull().default('pending_payment'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const templates = sqliteTable('templates', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  size: text('size'),
  productType: text('product_type'),
  formatsJson: text('formats_json').notNull(), 
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const checklistRules = sqliteTable('checklist_rules', {
  id: text('id').primaryKey(),
  productType: text('product_type').notNull(), // К какому типу изделия относится
  parameter: text('parameter').notNull(), // Например, 'color_profile'
  expectedValue: text('expected_value').notNull(), // 'CMYK'
  warningMessage: text('warning_message').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
});