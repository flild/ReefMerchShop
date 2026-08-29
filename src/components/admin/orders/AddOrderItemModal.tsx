'use client';

import { useTransition, useState } from 'react';
import { createOrderItem } from '@/actions/admin/orders';

interface Material {
  id: string;
  name: string;
}

interface Accessory {
  id: string;
  name: string;
}

interface AddOrderItemModalProps {
  orderId: string;
  materials: Material[];
  accessories: Accessory[];
}

export function AddOrderItemModal({ orderId, materials, accessories }: AddOrderItemModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.append('orderId', orderId);

    startTransition(async () => {
      const res = await createOrderItem(formData);
      if (res.success) {
        setIsOpen(false);
        (e.target as HTMLFormElement).reset();
      } else {
        setError(res.error || 'Произошла ошибка');
      }
    });
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="anime-button px-6 py-3 text-sm inline-block"
      >
        + Добавить позицию
      </button>
    );
  }

  return (
    <div className="bg-theme-bg border-2 border-theme-border rounded-[32px] p-6 flex flex-col gap-4 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-display font-extrabold text-theme-text">Новая позиция в заказе</h3>
        <button onClick={() => setIsOpen(false)} className="text-theme-muted font-bold hover:text-theme-text">
          ✕ Закрыть
        </button>
      </div>

      {error && (
        <div className="bg-theme-yellow-bg text-theme-yellow-text p-3 rounded-xl font-bold text-sm border-2 border-theme-yellow-text">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-extrabold text-theme-text ml-1">Название макета / персонажа</label>
            <input 
              type="text" 
              name="name" 
              required 
              placeholder="Напр. Брелок Аянами"
              className="bg-theme-surface border-2 border-theme-border rounded-[16px] px-4 py-2 font-bold outline-none focus:border-theme-highlight"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-extrabold text-theme-text ml-1">Тип изделия</label>
            <input 
              type="text" 
              name="productType" 
              required 
              defaultValue="keychain" 
              className="bg-theme-surface border-2 border-theme-border rounded-[16px] px-4 py-2 font-bold outline-none focus:border-theme-highlight"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-extrabold text-theme-text ml-1">Тираж (шт.)</label>
            <input 
              type="number" 
              name="quantity" 
              required 
              defaultValue={1} 
              min={1} 
              className="bg-theme-surface border-2 border-theme-border rounded-[16px] px-4 py-2 font-bold outline-none focus:border-theme-highlight"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-extrabold text-theme-text ml-1">Цена (₽)</label>
            <input 
              type="number" 
              name="price" 
              required 
              defaultValue={0} 
              min={0} 
              className="bg-theme-surface border-2 border-theme-border rounded-[16px] px-4 py-2 font-bold outline-none focus:border-theme-highlight"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-extrabold text-theme-text ml-1">Площадь (см²)</label>
            <input 
              type="number" 
              name="areaCm2" 
              step="0.1" 
              placeholder="Для акрила" 
              className="bg-theme-surface border-2 border-theme-border rounded-[16px] px-4 py-2 font-bold outline-none focus:border-theme-highlight"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-extrabold text-theme-text ml-1">Материал</label>
            <select 
              name="materialId" 
              className="bg-theme-surface border-2 border-theme-border rounded-[16px] px-4 py-2 font-bold outline-none focus:border-theme-highlight"
            >
              <option value="">Без материала</option>
              {materials.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-extrabold text-theme-text ml-1">Фурнитура</label>
            <select 
              name="accessoryId" 
              className="bg-theme-surface border-2 border-theme-border rounded-[16px] px-4 py-2 font-bold outline-none focus:border-theme-highlight"
            >
              <option value="">Без фурнитуры</option>
              {accessories.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="anime-button py-3 mt-2 text-center disabled:opacity-50"
        >
          {isPending ? 'Сохранение...' : 'Сохранить позицию'}
        </button>
      </form>
    </div>
  );
}