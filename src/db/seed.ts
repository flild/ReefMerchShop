import { db } from './index';
import { categories, portfolioItems, materials, accessories, collects, templates, users, orders } from './schema';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  console.log('Seeding database...');
  
  // Users
  const user1 = uuidv4();
  const user2 = uuidv4();
  
  await db.insert(users).values([
    { id: user1, name: 'Author One', email: 'author@example.com', passwordHash: 'hash', role: 'client' },
    { id: user2, name: 'Artist Two', email: 'artist@mail.ru', passwordHash: 'hash', role: 'client' },
  ]).onConflictDoNothing();
  
  // Categories
  const cat1 = 'c0000000-0000-0000-0000-000000000001';
  const cat2 = 'c0000000-0000-0000-0000-000000000002';
  const cat3 = 'c0000000-0000-0000-0000-000000000003';
  const cat4 = 'c0000000-0000-0000-0000-000000000004';
  
  await db.insert(categories).values([
    { id: cat1, name: 'Брелоки (Прозрачный)', slug: 'keychain-transparent', description: 'Классические брелоки из прозрачного акрила.' },
    { id: cat2, name: 'Брелоки (Жемчуг)', slug: 'keychain-pearl', description: 'Красивый акрил с жемчужным переливом.' },
    { id: cat3, name: 'Стенды (Прозрачный)', slug: 'stand-transparent', description: 'Стенды из прозрачного акрила.' },
    { id: cat4, name: 'Стенды (Жемчуг)', slug: 'stand-pearl', description: 'Стенды из жемчужного акрила.' },
  ]).onConflictDoNothing();

  // Portfolio items
  await db.insert(portfolioItems).values([
    { id: uuidv4(), categoryId: cat1, title: 'Брелок с аниме-персонажем', imageUrl: 'https://picsum.photos/seed/reef1/800/800', authorName: 'MewArt' },
    { id: uuidv4(), categoryId: cat3, title: 'Акриловый стенд', imageUrl: 'https://picsum.photos/seed/reef2/800/1000', authorName: 'Sakura' },
    { id: uuidv4(), categoryId: cat2, title: 'Переливающийся брелок', imageUrl: 'https://picsum.photos/seed/reef3/800/800', authorName: 'StarBoy' },
    { id: uuidv4(), categoryId: cat1, title: 'Брелок с блестками', imageUrl: 'https://picsum.photos/seed/reef4/800/800', authorName: 'MewArt' },
    { id: uuidv4(), categoryId: cat4, title: 'Жемчужный стенд', imageUrl: 'https://picsum.photos/seed/reef5/800/1000', authorName: 'FoxKit' },
    { id: uuidv4(), categoryId: cat1, title: 'Парные брелоки', imageUrl: 'https://picsum.photos/seed/reef6/800/800', authorName: 'Sakura' },
  ]).onConflictDoNothing();

  // Materials
  await db.insert(materials).values([
    { id: uuidv4(), type: 'acrylic', name: 'Прозрачный 3мм', stock: 1500, pricePerCm2: 2.5, inStock: true, description: 'Универсальный материал для брелоков и стендов.' },
    { id: uuidv4(), type: 'acrylic', name: 'Жемчужный 3мм', stock: 500, pricePerCm2: 3.5, inStock: true, description: 'Перламутровый блеск, отлично подходит для мерча.' },
    { id: uuidv4(), type: 'holography', name: 'Битое стекло', stock: 200, pricePerCm2: 1.0, inStock: true, description: 'Голографическая пленка с эффектом осколков.' }
  ]).onConflictDoNothing();

  // Accessories
  await db.insert(accessories).values([
    { id: uuidv4(), name: 'Кольцо серебряное', stock: 3450, price: 5, imageUrl: 'https://picsum.photos/seed/acc1/200/200' },
    { id: uuidv4(), name: 'Карабин-звездочка', stock: 120, price: 15, imageUrl: 'https://picsum.photos/seed/acc2/200/200' },
    { id: uuidv4(), name: 'Карабин-сердечко', stock: 5, price: 15, imageUrl: 'https://picsum.photos/seed/acc3/200/200' }, // low stock
  ]).onConflictDoNothing();

  // Collects
  await db.insert(collects).values([
    { id: uuidv4(), title: 'СЕНТЯБРЬСКИЙ КОЛЛЕКТ', description: 'Сборный заказ на прозрачный акрил.', deadline: new Date(Date.now() + 864000000), productionDate: '20-25 сентября', minCount: 50, currentCount: 17, status: 'open' }
  ]).onConflictDoNothing();

  // Templates
  await db.insert(templates).values([
    { id: uuidv4(), title: 'Брелок 50x50 мм', description: 'Стандартный шаблон с контуром резки и отверстием.', size: '50x50 мм', productType: 'Брелок', formatsJson: JSON.stringify([{ format: 'PSD', url: '#' }, { format: 'AI', url: '#' }]) }
  ]).onConflictDoNothing();

  // Orders
  await db.insert(orders).values([
    { id: uuidv4(), orderNumber: 'ORD-2023-090', userId: user1, status: 'new', total: 4500, detailsJson: '{}' },
    { id: uuidv4(), orderNumber: 'ORD-2023-089', userId: user2, status: 'production', total: 12800, detailsJson: '{}' },
    { id: uuidv4(), orderNumber: 'ORD-2023-088', userId: user1, status: 'proofing', total: 3200, detailsJson: '{}' },
    { id: uuidv4(), orderNumber: 'ORD-2023-087', userId: user2, status: 'completed', total: 8900, detailsJson: '{}' },
  ]).onConflictDoNothing();

  console.log('Seeding complete.');
}

seed().catch(console.error);
