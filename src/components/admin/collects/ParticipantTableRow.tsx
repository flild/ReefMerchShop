'use client';

import { useState, useTransition } from 'react';
import { updateParticipantData, deleteParticipant } from '@/actions/admin/collects';
import { ParticipantStatusSelect } from './ParticipantStatusSelect';
import { Link as LinkIcon } from 'lucide-react';

type Participant = {
  id: string;
  quantity: number;
  totalPrice: number;
  status: string;
  isLayoutsUploaded: boolean;
  nickname: string | null;
  email: string | null;
  vkId: string | null;
  telegram: string | null;
  layoutName: string | null;
  layoutLink: string | null;
  clientName: string | null;
  clientEmail: string | null;
};

interface Props {
  participant: Participant;
  collectId: string;
  canViewFinances: boolean;
}

export function ParticipantTableRow({ participant, collectId, canViewFinances }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Инициализируем форму новыми данными, приоритет отдаем полям из заявки
  const [form, setForm] = useState({
    nickname: participant.nickname || participant.clientName || '',
    email: participant.email || participant.clientEmail || '',
    vkId: participant.vkId || '',
    telegram: participant.telegram || '',
    layoutName: participant.layoutName || '',
    layoutLink: participant.layoutLink || '',
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
        <td className="p-4 flex flex-col gap-2">
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
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className="w-full bg-theme-surface border-2 border-theme-border rounded-[12px] px-3 py-2 text-sm font-bold outline-none focus:border-theme-highlight"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={form.vkId}
                onChange={(e) => setForm({ ...form, vkId: e.target.value })}
                placeholder="VK ID"
                className="w-full bg-theme-surface border-2 border-theme-border rounded-[12px] px-3 py-2 text-sm font-bold outline-none focus:border-theme-highlight"
              />
              <input
                type="text"
                value={form.telegram}
                onChange={(e) => setForm({ ...form, telegram: e.target.value })}
                placeholder="Telegram"
                className="w-full bg-theme-surface border-2 border-theme-border rounded-[12px] px-3 py-2 text-sm font-bold outline-none focus:border-theme-highlight"
              />
            </div>
          </div>
        </td>
        <td className="p-4">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={form.layoutName}
              onChange={(e) => setForm({ ...form, layoutName: e.target.value })}
              placeholder="Название макета"
              className="w-full bg-theme-surface border-2 border-theme-border rounded-[12px] px-3 py-2 text-sm font-bold outline-none focus:border-theme-highlight"
            />
            <input
              type="url"
              value={form.layoutLink}
              onChange={(e) => setForm({ ...form, layoutLink: e.target.value })}
              placeholder="Ссылка на макет"
              className="w-full bg-theme-surface border-2 border-theme-border rounded-[12px] px-3 py-2 text-sm font-bold outline-none focus:border-theme-highlight"
            />
          </div>
        </td>
        <td className="p-4 text-center align-top">
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
          <td className="p-4 text-right align-top">
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
        <td className="p-4 align-top">
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
        <div className="text-theme-text font-bold text-sm mb-1">{participant.email || participant.clientEmail || 'Нет email'}</div>
        <div className="flex flex-col gap-0.5">
          {participant.vkId && (
            <a href={`https://vk.com/${participant.vkId.replace('vk.com/', '')}`} target="_blank" rel="noreferrer" className="text-theme-highlight hover:underline font-bold text-xs">
              VK: {participant.vkId}
            </a>
          )}
          {participant.telegram && (
            <a href={`https://t.me/${participant.telegram.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-theme-highlight hover:underline font-bold text-xs">
              TG: {participant.telegram}
            </a>
          )}
        </div>
      </td>
      <td className="p-5 max-w-[200px]">
        {participant.layoutName && (
          <div className="text-theme-text font-bold text-sm mb-1 line-clamp-2" title={participant.layoutName}>
            {participant.layoutName}
          </div>
        )}
        {participant.layoutLink ? (
          <a
            href={participant.layoutLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-theme-highlight hover:underline font-extrabold text-xs bg-theme-surface border-2 border-theme-border px-2 py-1 rounded-[8px]"
          >
            <LinkIcon size={12} /> Скачать файлы
          </a>
        ) : (
          <span className="text-theme-muted font-bold text-xs">Нет ссылки</span>
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
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 text-theme-muted hover:text-theme-highlight transition-colors bg-theme-surface border-2 border-theme-border hover:border-theme-highlight rounded-[12px]"
          title="Редактировать данные заявки"
        >
          ✏️
        </button>
      </td>
    </tr>
  );
}