import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Утилита для правильных таймстемпов (миллисекунды для JS)
const timestampMs = (name: string) => 
  integer(name, { mode: 'timestamp' }).$defaultFn(() => new Date());

// --- ТАБЛИЦЫ ---

export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // UUID
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('client'), // 'client', 'manager', 'admin'
  telegramId: text('telegram_id'),
  vkId: text('vk_id'),
  createdAt: timestampMs('created_at'),
});

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
});

export const portfolioItems = sqliteTable('portfolio_items', {
  id: text('id').primaryKey(),
  categoryId: text('category_id').references(() => categories.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  description: text('description'),
  imageUrl: text('image_url').notNull(),
  authorName: text('author_name'),
  createdAt: timestampMs('created_at'),
});

export const materialCategories = sqliteTable('material_categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
});

export const materials = sqliteTable('materials', {
  id: text('id').primaryKey(),
  categoryId: text('category_id').references(() => materialCategories.id, { onDelete: 'set null' }),
  type: text('type').notNull(), // 'acrylic', 'holography'
  name: text('name').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  stock: integer('stock').notNull().default(0), 
  minStock: integer('min_stock').notNull().default(1000), 
  inStock: integer('in_stock', { mode: 'boolean' }).notNull().default(false),
  pricePerCm2: real('price_per_cm2').notNull().default(0),
});

export const blanks = sqliteTable('blanks', {
  id: text('id').primaryKey(),
  materialId: text('material_id').references(() => materials.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  size: text('size'), 
  stock: integer('stock').notNull().default(0),
  minStock: integer('min_stock').notNull().default(50),
});

export const accessories = sqliteTable('accessories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  imageUrl: text('image_url'),
  stock: integer('stock').notNull().default(0),
  minStock: integer('min_stock').notNull().default(50),
  price: integer('price').notNull().default(0),
});

export const files = sqliteTable('files', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  path: text('path').notNull(), 
  mimeType: text('mime_type'),
  size: integer('size'),
  ownerId: text('owner_id').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestampMs('created_at'),
});

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  status: text('status').notNull().default('new'),
  total: integer('total').notNull().default(0),
  detailsJson: text('details_json').notNull().default('{}'), 
  createdAt: timestampMs('created_at'),
});

export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  name: text('name'),
  productType: text('product_type').notNull(), 
  quantity: integer('quantity').notNull().default(1),
  materialId: text('material_id').references(() => materials.id, { onDelete: 'set null' }),
  accessoryId: text('accessory_id').references(() => accessories.id, { onDelete: 'set null' }),
  areaCm2: real('area_cm2'), 
  price: integer('price').notNull(),
  fileId: text('file_id').references(() => files.id, { onDelete: 'set null' }), 
});

export const orderStatusHistory = sqliteTable('order_status_history', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  status: text('status').notNull(),
  comment: text('comment'),
  createdAt: timestampMs('created_at'),
});

export const orderProofs = sqliteTable('order_proofs', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  orderItemId: text('order_item_id').references(() => orderItems.id, { onDelete: 'cascade' }), 
  fileId: text('file_id').notNull().references(() => files.id, { onDelete: 'cascade' }), 
  status: text('status').notNull().default('pending'),
  managerComment: text('manager_comment'),
  clientComment: text('client_comment'),
  createdAt: timestampMs('created_at'),
});

export const collects = sqliteTable('collects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  deadline: timestampMs('deadline').notNull(),
  productionDate: text('production_date').notNull(),
  minCount: integer('min_count').notNull(),
  currentCount: integer('current_count').notNull().default(0),
  currentSum: integer('current_sum').notNull().default(0), 
  targetSumLimit: integer('target_sum_limit').notNull().default(250000),
  maxDiscount: integer('max_discount').notNull().default(20),
  driveLink: text('drive_link'), 
  status: text('status').notNull().default('open'), 
});

export const collectParticipants = sqliteTable('collect_participants', {
  id: text('id').primaryKey(),
  collectId: text('collect_id').notNull().references(() => collects.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }), 
  
  // --- НОВЫЕ ПОЛЯ ---
  email: text('email').notNull(), // Обязательная почта
  telegram: text('telegram'), // Опциональный TG
  layoutName: text('layout_name'), // Название макета (например: "Брелок Аянами Рэй 5см")
  layoutLink: text('layout_link'), // Ссылка на личный Гугл/Яндекс Диск участника
  // ------------------

  nickname: text('nickname').notNull(), // Сделаем обязательным
  vkId: text('vk_id'),
  quantity: integer('quantity').notNull().default(0), 
  totalPrice: integer('total_price').notNull().default(0),
  fileId: text('file_id').references(() => files.id, { onDelete: 'cascade' }), 
  isLayoutsUploaded: integer('is_layouts_uploaded', { mode: 'boolean' }).notNull().default(false), 
  status: text('status').notNull().default('new'),
  createdAt: timestampMs('created_at'),
});

export const articles = sqliteTable('articles', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(), 
  title: text('title').notNull(),
  coverImage: text('cover_image'), 
  contentMd: text('content_md').notNull().default(''), 
  viewsCount: integer('views_count').notNull().default(0),
  readsCount: integer('reads_count').notNull().default(0), 
  likesCount: integer('likes_count').notNull().default(0),
  dislikesCount: integer('dislikes_count').notNull().default(0),
  isPublished: integer('is_published', { mode: 'boolean' }).notNull().default(false), 
  createdAt: timestampMs('created_at'),
  updatedAt: timestampMs('updated_at'),
});

export const templates = sqliteTable('templates', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  size: text('size'),
  productType: text('product_type'),
  formatsJson: text('formats_json').notNull(), 
  updatedAt: timestampMs('updated_at'),
});

export const checklistRules = sqliteTable('checklist_rules', {
  id: text('id').primaryKey(),
  productType: text('product_type').notNull(), 
  parameter: text('parameter').notNull(), 
  expectedValue: text('expected_value').notNull(), 
  warningMessage: text('warning_message').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
});

// --- СВЯЗИ ДЛЯ ORM (RELATIONS) ---
// Это нужно для автоматического сидинга и глубоких запросов типа db.query.orders.findMany({ with: { items: true } })

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
  statusHistory: many(orderStatusHistory),
  proofs: many(orderProofs),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  material: one(materials, {
    fields: [orderItems.materialId],
    references: [materials.id],
  }),
  accessory: one(accessories, {
    fields: [orderItems.accessoryId],
    references: [accessories.id],
  }),
  file: one(files, {
    fields: [orderItems.fileId],
    references: [files.id],
  }),
}));

export const orderProofsRelations = relations(orderProofs, ({ one }) => ({
  order: one(orders, {
    fields: [orderProofs.orderId],
    references: [orders.id],
  }),
  orderItem: one(orderItems, {
    fields: [orderProofs.orderItemId],
    references: [orderItems.id],
  }),
  file: one(files, {
    fields: [orderProofs.fileId],
    references: [files.id],
  }),
}));