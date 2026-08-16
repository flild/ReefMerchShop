'use client';

import { useActionState } from 'react';
import { addOrderProof } from '@/actions/admin/proofs';

export function ProofUploader({ orderId }: { orderId: string }) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await addOrderProof(orderId, formData);
    },
    null
  );

  const handleProofUploadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // В будущем здесь можно добавить предварительную валидацию размера файла
    if (isPending) e.preventDefault();
  };

  return (
    <form 
      action={formAction} 
      onSubmit={handleProofUploadSubmit} 
      className="flex flex-col gap-4 bg-theme-bg border-2 border-theme-border rounded-[24px] p-6 mt-6"
    >
      <h3 className="font-extrabold text-theme-text text-lg">Загрузить новую цветопробу</h3>
      
      {state?.error && (
        <div className="bg-theme-yellow-bg text-theme-yellow-text p-3 rounded-xl font-bold text-sm border-2 border-theme-yellow-text">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-theme-muted font-bold text-sm ml-2">URL фотографии изделия</label>
        <input 
          type="url" 
          name="fileUrl" 
          required
          placeholder="https://..."
          className="bg-theme-surface border-2 border-theme-border rounded-[16px] px-4 py-2 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-theme-muted font-bold text-sm ml-2">Комментарий для клиента</label>
        <textarea 
          name="managerComment" 
          rows={2}
          placeholder="Обратите внимание на оттенок синего..."
          className="bg-theme-surface border-2 border-theme-border rounded-[16px] px-4 py-2 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all resize-none"
        />
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="anime-button px-6 py-2 mt-2 self-start disabled:opacity-50"
      >
        {isPending ? 'Загрузка...' : 'Отправить клиенту'}
      </button>
    </form>
  );
}