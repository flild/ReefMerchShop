'use client';

import { useTransition, useState, useRef } from 'react';
import { uploadOrderProof } from '@/actions/admin/orders';

interface OrderItemInfo {
  id: string;
  name: string | null;
  productType: string;
}

interface UploadProofModalProps {
  orderId: string;
  items: OrderItemInfo[];
}

export function UploadProofModal({ orderId, items }: UploadProofModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  if (items.length === 0) {
    return (
      <button disabled className="anime-button px-5 py-2 text-sm opacity-50 cursor-not-allowed" title="Сначала добавьте позиции в заказ">
        Загрузить фото
      </button>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.append('orderId', orderId);

    startTransition(async () => {
      const res = await uploadOrderProof(formData);
      if (res.success) {
        setIsOpen(false);
        formRef.current?.reset();
      } else {
        setError(res.error || 'Произошла ошибка при загрузке');
      }
    });
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="anime-button px-5 py-2 text-sm"
      >
        Загрузить фото
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-theme-bg/80 backdrop-blur-sm">
      <div className="bg-theme-surface border-2 border-theme-border rounded-[32px] p-6 w-full max-w-md anime-shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-display font-extrabold text-theme-text">Загрузка цветопробы</h3>
          <button onClick={() => setIsOpen(false)} className="text-theme-muted font-bold hover:text-theme-text transition-colors">
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-theme-yellow-bg text-theme-yellow-text p-3 rounded-xl font-bold text-sm border-2 border-theme-yellow-text mb-4">
            {error}
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-extrabold text-theme-text ml-1">К какому макету относится?</label>
            <select 
              name="orderItemId" 
              required
              className="bg-theme-bg border-2 border-theme-border rounded-[16px] px-4 py-3 font-bold outline-none focus:border-theme-highlight appearance-none"
            >
              <option value="">Выберите позицию...</option>
              {items.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name || 'Без названия'} ({item.productType})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-extrabold text-theme-text ml-1">Фотография образца</label>
            <input 
              type="file" 
              name="file" 
              accept="image/*"
              required 
              className="bg-theme-bg border-2 border-theme-border rounded-[16px] px-4 py-2 font-bold outline-none focus:border-theme-highlight text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-extrabold file:bg-theme-highlight file:text-theme-bg hover:file:bg-theme-highlight/80 file:cursor-pointer file:transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-extrabold text-theme-text ml-1">Комментарий для клиента (необязательно)</label>
            <textarea 
              name="managerComment" 
              rows={3}
              placeholder="Например: Цвета получились чуть темнее из-за профиля."
              className="bg-theme-bg border-2 border-theme-border rounded-[16px] px-4 py-3 font-bold outline-none focus:border-theme-highlight resize-none"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button 
              type="submit" 
              disabled={isPending}
              className="anime-button flex-1 py-3 text-center disabled:opacity-50"
            >
              {isPending ? 'Загрузка...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}