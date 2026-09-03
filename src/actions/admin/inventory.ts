'use server';

import { db } from '@/db';
import { materials, materialTypes, blanks, accessories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

// Проверка прав для персонала
async function checkInventoryAccess() {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'manager')) {
    throw new Error('Недостаточно прав для выполнения операции');
  }
}

// === CRUD ТИПОВ МАТЕРИАЛОВ ===

export async function createMaterialType(formData: FormData) {
  await checkInventoryAccess();

  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;

  if (!name || !slug) {
    return { success: false, error: 'Название и Slug обязательны' };
  }

  try {
    await db.insert(materialTypes).values({
      id: crypto.randomUUID(),
      name,
      slug: slug.toLowerCase().trim(),
      description: description || null,
    });
  } catch (error) {
    console.error('Ошибка создания типа материала:', error);
    return { success: false, error: 'Не удалось создать тип. Возможно, Slug уже занят.' };
  }

  revalidatePath('/admin/inventory');
  revalidatePath('/materials');
  return { success: true };
}

export async function updateMaterialType(id: string, formData: FormData) {
  await checkInventoryAccess();

  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;

  if (!name || !slug) {
    return { success: false, error: 'Название и Slug обязательны' };
  }

  try {
    await db.update(materialTypes).set({
      name,
      slug: slug.toLowerCase().trim(),
      description: description || null,
    }).where(eq(materialTypes.id, id));
  } catch (error) {
    console.error('Ошибка обновления типа материала:', error);
    return { success: false, error: 'Не удалось обновить тип' };
  }

  revalidatePath('/admin/inventory');
  revalidatePath('/materials');
  return { success: true };
}

export async function deleteMaterialType(id: string) {
  await checkInventoryAccess();

  try {
    // Проверяем, есть ли материалы с этим типом
    const attachedMaterials = await db
      .select({ id: materials.id })
      .from(materials)
      .where(eq(materials.typeId, id))
      .limit(1);

    if (attachedMaterials.length > 0) {
      return { 
        success: false, 
        error: 'Нельзя удалить тип, к которому привязаны материалы. Сначала перенесите или удалите их.' 
      };
    }

    await db.delete(materialTypes).where(eq(materialTypes.id, id));
    revalidatePath('/admin/inventory');
    revalidatePath('/materials');
    return { success: true };
  } catch (error) {
    console.error('Ошибка удаления типа материала:', error);
    return { success: false, error: 'Не удалось удалить тип' };
  }
}

// === CRUD МАТЕРИАЛОВ ===

export async function createMaterial(formData: FormData) {
  await checkInventoryAccess();

  const name = formData.get('name') as string;
  const typeId = formData.get('typeId') as string;
  const categoryId = formData.get('categoryId') as string;
  const description = formData.get('description') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const pricePerCm2 = Number(formData.get('pricePerCm2'));
  const minStock = Number(formData.get('minStock'));
  const stock = Number(formData.get('stock'));

  if (!name || !typeId) {
    return { error: 'Название и тип обязательны' };
  }

  try {
    await db.insert(materials).values({
      id: crypto.randomUUID(),
      name,
      typeId,
      categoryId: categoryId || null,
      description: description || null,
      imageUrl: imageUrl || null,
      pricePerCm2: isNaN(pricePerCm2) ? 0 : pricePerCm2,
      minStock: isNaN(minStock) ? 1000 : minStock,
      stock: isNaN(stock) ? 0 : stock,
      inStock: stock > 0,
    });
  } catch (error) {
    console.error('Ошибка создания материала:', error);
    return { error: 'Не удалось сохранить материал в базу' };
  }

  revalidatePath('/admin/inventory');
  revalidatePath('/materials');
  redirect('/admin/inventory');
}

export async function updateMaterial(id: string, formData: FormData) {
  await checkInventoryAccess();

  const name = formData.get('name') as string;
  const typeId = formData.get('typeId') as string;
  const categoryId = formData.get('categoryId') as string;
  const description = formData.get('description') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const pricePerCm2 = Number(formData.get('pricePerCm2'));
  const minStock = Number(formData.get('minStock'));
  const stock = Number(formData.get('stock'));

  if (!name || !typeId) {
    return { error: 'Название и тип обязательны' };
  }

  try {
    await db.update(materials).set({
      name,
      typeId,
      categoryId: categoryId || null,
      description: description || null,
      imageUrl: imageUrl || null,
      pricePerCm2: isNaN(pricePerCm2) ? 0 : pricePerCm2,
      minStock: isNaN(minStock) ? 1000 : minStock,
      stock: isNaN(stock) ? 0 : stock,
      inStock: stock > 0,
    }).where(eq(materials.id, id));
  } catch (error) {
    console.error('Ошибка обновления материала:', error);
    return { error: 'Не удалось обновить материал' };
  }

  revalidatePath('/admin/inventory');
  revalidatePath('/materials');
  redirect('/admin/inventory');
}

// === БЫСТРЫЙ АПДЕЙТ И УДАЛЕНИЕ ===

export async function updateStock(
  id: string, 
  newStock: number, 
  type: 'material' | 'accessory' | 'blank'
) {
  await checkInventoryAccess();

  try {
    if (type === 'material') {
      await db.update(materials)
        .set({ stock: newStock, inStock: newStock > 0 })
        .where(eq(materials.id, id));
      revalidatePath('/materials');
    } else if (type === 'accessory') {
      await db.update(accessories)
        .set({ stock: newStock })
        .where(eq(accessories.id, id));
      revalidatePath('/materials');
    } else if (type === 'blank') {
      await db.update(blanks)
        .set({ stock: newStock })
        .where(eq(blanks.id, id));
    }
    
    revalidatePath('/admin/inventory');
    return { success: true };
  } catch (error) {
    console.error('Ошибка обновления остатков:', error);
    return { success: false, error: 'Не удалось обновить остатки' };
  }
}

export async function deleteItem(
  id: string, 
  type: 'material' | 'accessory' | 'blank' | 'type'
) {
  await checkInventoryAccess();

  try {
    if (type === 'material') {
      await db.delete(materials).where(eq(materials.id, id));
      revalidatePath('/materials');
    } else if (type === 'accessory') {
      await db.delete(accessories).where(eq(accessories.id, id));
      revalidatePath('/materials');
    } else if (type === 'blank') {
      await db.delete(blanks).where(eq(blanks.id, id));
    } else if (type === 'type') {
      // Проверяем, привязаны ли материалы к этому типу
      const attachedMaterials = await db
        .select({ id: materials.id })
        .from(materials)
        .where(eq(materials.typeId, id))
        .limit(1);

      if (attachedMaterials.length > 0) {
        return { 
          success: false, 
          error: 'Нельзя удалить тип, к которому привязаны материалы. Сначала удалите или перенесите их.' 
        };
      }

      await db.delete(materialTypes).where(eq(materialTypes.id, id));
      revalidatePath('/materials');
    }
    
    revalidatePath('/admin/inventory');
    return { success: true };
  } catch (error) {
    console.error(`Ошибка удаления ${type}:`, error);
    return { success: false, error: 'Позиция привязана к заказам или заготовкам' };
  }
}

// === ЭКШЕНЫ ДЛЯ ЗАГОТОВОК И ФУРНИТУРЫ ===

export async function createBlank(formData: FormData) {
  await checkInventoryAccess();
  const name = formData.get('name') as string;
  const materialId = formData.get('materialId') as string;
  const size = formData.get('size') as string;
  const stock = Number(formData.get('stock'));
  const minStock = Number(formData.get('minStock'));

  if (!name || !materialId) return { error: 'Название и материал обязательны' };

  try {
    await db.insert(blanks).values({
      id: crypto.randomUUID(),
      name,
      materialId,
      size: size || null,
      stock: isNaN(stock) ? 0 : stock,
      minStock: isNaN(minStock) ? 50 : minStock,
    });
  } catch (error) {
    return { error: 'Не удалось сохранить заготовку' };
  }

  revalidatePath('/admin/inventory');
  redirect('/admin/inventory?tab=blanks');
}

export async function updateBlank(id: string, formData: FormData) {
  await checkInventoryAccess();
  const name = formData.get('name') as string;
  const materialId = formData.get('materialId') as string;
  const size = formData.get('size') as string;
  const stock = Number(formData.get('stock'));
  const minStock = Number(formData.get('minStock'));

  if (!name || !materialId) return { error: 'Название и материал обязательны' };

  try {
    await db.update(blanks).set({
      name,
      materialId,
      size: size || null,
      stock: isNaN(stock) ? 0 : stock,
      minStock: isNaN(minStock) ? 50 : minStock,
    }).where(eq(blanks.id, id));
  } catch (error) {
    return { error: 'Не удалось обновить заготовку' };
  }

  revalidatePath('/admin/inventory');
  redirect('/admin/inventory?tab=blanks');
}

export async function createAccessory(formData: FormData) {
  await checkInventoryAccess();
  const name = formData.get('name') as string;
  const price = Number(formData.get('price'));
  const stock = Number(formData.get('stock'));
  const minStock = Number(formData.get('minStock'));

  if (!name) return { error: 'Название обязательно' };

  try {
    await db.insert(accessories).values({
      id: crypto.randomUUID(),
      name,
      price: isNaN(price) ? 0 : price,
      stock: isNaN(stock) ? 0 : stock,
      minStock: isNaN(minStock) ? 50 : minStock,
    });
  } catch (error) {
    return { error: 'Не удалось сохранить фурнитуру' };
  }

  revalidatePath('/admin/inventory');
  revalidatePath('/materials');
  redirect('/admin/inventory?tab=accessories');
}

export async function updateAccessory(id: string, formData: FormData) {
  await checkInventoryAccess();
  const name = formData.get('name') as string;
  const price = Number(formData.get('price'));
  const stock = Number(formData.get('stock'));
  const minStock = Number(formData.get('minStock'));

  if (!name) return { error: 'Название обязательно' };

  try {
    await db.update(accessories).set({
      name,
      price: isNaN(price) ? 0 : price,
      stock: isNaN(stock) ? 0 : stock,
      minStock: isNaN(minStock) ? 50 : minStock,
    }).where(eq(accessories.id, id));
  } catch (error) {
    return { error: 'Не удалось обновить фурнитуру' };
  }

  revalidatePath('/admin/inventory');
  revalidatePath('/materials');
  redirect('/admin/inventory?tab=accessories');
}