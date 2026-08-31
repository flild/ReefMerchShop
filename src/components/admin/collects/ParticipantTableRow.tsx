'use client';

import { useState, useTransition } from 'react';
import { updateParticipantData, deleteParticipant } from '@/actions/admin/collects';
import { ParticipantStatusSelect } from './ParticipantStatusSelect';

// Типизируем то, что приходит из БД
type Participant = {
  id: string;
  quantity: number;
  totalPrice: number;
  status: string;
  isLayoutsUploaded: boolean;
  nickname: string | null;
  vkId: string | null;
  clientName: string | null;
  clientEmail: string | null;
  clientTelegram: string | null;
  fileName: string | null;
  filePath: string | null;
};

interface Props {
  participant: Participant;
  collectId: string;
  canViewFinances: boolean;
}

export function ParticipantTableRow({ participant, collectId, canViewFinances }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Локальный стейт для инпутов
  const [form, setForm] = useState({
    nickname: participant.nickname || participant.clientName || '',
    vkId: participant.vkId || '',
    quantity: participant.quantity || 0,
    totalPrice: participant.totalPrice || 0,
  });

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateParticipantData(participant.id, collectId, form);
      if (res.error) {
        alert(res.error);
      } else {
        setIsEditing(false);
      }
    });
  };

  const handleDelete = () => {
    if (window.confirm('Точно удалить этого участника? Действие необратимо.')) {
      startTransition(async () => {
        const res = await deleteParticipant(participant.id, collectId);
        if (res.error) alert(res.error);
      });
    }
  };

  // === РЕЖИМ РЕДАКТИРОВАНИЯ ===
  if (isEditing) {
    return (
      <tr className="border-b border-theme-border/50 bg-theme-bg/80 transition-colors">
        <td className="p-4">
          <input
            type="text"
            value={form.nickname}
            onChange={(e) => setForm({ ...form, nickname: e.target.value })}
            placeholder="Никнейм"
            disabled={isPending}
            className="w-full bg-theme-surface border-2 border-theme-border rounded-[12px] px-3 py-2 text-sm font-bold outline-none focus:border-theme-highlight"
          />
        </td>
        <td className="p-4">
          <input
            type="text"
            value={form.vkId}
            onChange={(e) => setForm({ ...form, vkId: e.target.value })}
            placeholder="VK ID"
            disabled={isPending}
            className="w-full bg-theme-surface border-2 border-theme-border rounded-[12px] px-3 py-2 text-sm font-bold outline-none focus:border-theme-highlight"
          />
        </td>
        <td className="p-4 text-center">
          <span className="text-xs font-bold text-theme-muted">На Google Диске</span>
        </td>
        <td className="p-4 text-center">
          <input
            type="number"
            min="0"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
            disabled={isPending}
            className="w-20 bg-theme-surface border-2 border-theme-border rounded-[12px] px-3 py-2 text-sm font-bold outline-none focus:border-theme-highlight mx-auto block text-center"
          />
        </td>
        {canViewFinances && (
          <td className="p-4 text-right">
            <input
              type="number"
              min="0"
              value={form.totalPrice}
              onChange={(e) => setForm({ ...form, totalPrice: Number(e.target.value) })}
              disabled={isPending}
              className="w-24 bg-theme-surface border-2 border-theme-border rounded-[12px] px-3 py-2 text-sm font-bold outline-none focus:border-theme-highlight ml-auto block text-right"
            />
          </td>
        )}
        <td className="p-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isPending}
              className="bg-theme-highlight text-theme-bg px-3 py-2 rounded-[12px] font-bold text-sm hover:opacity-80 transition-opacity disabled:opacity-50"
              title="Сохранить"
            >
              {isPending ? '⏳' : '💾'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={isPending}
              className="bg-theme-surface border-2 border-theme-border px-3 py-2 rounded-[12px] font-bold text-sm hover:bg-theme-border transition-colors disabled:opacity-50"
              title="Отмена"
            >
              ❌
            </button>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="bg-theme-surface border-2 border-theme-yellow-text text-theme-yellow-text px-3 py-2 rounded-[12px] font-bold text-sm hover:bg-theme-yellow-text hover:text-theme-bg transition-colors disabled:opacity-50 ml-2"
              title="Удалить заявку"
            >
              🗑️
            </button>
          </div>
        </td>
      </tr>
    );
  }

  // === РЕЖИМ ЧТЕНИЯ (ОБЫЧНАЯ СТРОКА) ===
  return (
    <tr className="border-b border-theme-border/50 hover:bg-theme-bg/50 transition-colors group">
      <td className="p-5 font-extrabold text-theme-text text-lg relative">
        {participant.nickname || participant.clientName || 'Без имени'}
        {participant.isLayoutsUploaded && (
          <span className="ml-2 text-xs bg-theme-status-green-bg text-theme-status-green-text px-2 py-1 rounded-full whitespace-nowrap align-middle">
            Макеты ок
          </span>
        )}
      </td>
      <td className="p-5">
        <div className="text-theme-muted font-bold text-sm">{participant.clientEmail || 'Нет email'}</div>
        {participant.vkId && (
          <div className="text-theme-highlight font-bold text-sm mt-1">VK: {participant.vkId}</div>
        )}
        {participant.clientTelegram && (
          <div className="text-theme-highlight font-bold text-sm mt-1">TG: {participant.clientTelegram}</div>
        )}
      </td>
      <td className="p-5">
        {participant.filePath ? (
          <a
            href={participant.filePath}
            target="_blank"
            rel="noreferrer"
            className="text-theme-highlight hover:underline font-bold flex items-center gap-2"
          >
            ↓ {participant.fileName || 'Скачать макет'}
          </a>
        ) : (
          <span className="text-theme-muted font-bold text-sm">Файл на Диске</span>
        )}
      </td>
      <td className="p-5 font-extrabold text-theme-text text-xl text-center">
        {participant.quantity} шт.
      </td>
      {canViewFinances && (
        <td className="p-5 font-extrabold text-theme-text text-xl text-right">
          {participant.totalPrice.toLocaleString('ru-RU')} ₽
        </td>
      )}
      <td className="p-5 flex items-center gap-3">
        <ParticipantStatusSelect
          participantId={participant.id}
          currentStatus={participant.status}
          collectId={collectId}
        />
        {/* Кнопка редактирования появляется при наведении на строку (group-hover) */}
        <button
        onClick={() => setIsEditing(true)}
        className="p-2 text-theme-muted hover:text-theme-highlight transition-colors bg-theme-surface border-2 border-theme-border hover:border-theme-highlight rounded-[12px]"
        title="Редактировать данные (Тираж, Сумму, Контакты)"
        >
        ✏️
        </button>
      </td>
    </tr>
  );
}