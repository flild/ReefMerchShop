import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('client'), // client, manager, admin
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  coverImage: text('cover_image'),
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

export const materials = sqliteTable('materials', {
  id: text('id').primaryKey(),
  type: text('type').notNull(), // e.g., 'acrylic', 'holography'
  name: text('name').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  stock: integer('stock').notNull().default(0),
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
  status: text('status').notNull().default('new'), // new, proofing, production, shipping, completed
  total: integer('total').notNull().default(0),
  detailsJson: text('details_json').notNull(), // stores JSON of the order params
  proofImageUrl: text('proof_image_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const collects = sqliteTable('collects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  deadline: integer('deadline', { mode: 'timestamp' }).notNull(),
  productionDate: text('production_date').notNull(), // text representation like '20-25 sept'
  minCount: integer('min_count').notNull(),
  currentCount: integer('current_count').notNull().default(0),
  status: text('status').notNull().default('open'), // open, closed, producing
});

export const templates = sqliteTable('templates', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  size: text('size'),
  productType: text('product_type'),
  formatsJson: text('formats_json').notNull(), // array of objects { format: 'PSD', url: '...' }
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});
