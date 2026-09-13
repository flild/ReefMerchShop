'use client';

import { useRef, useState, useTransition } from 'react';
import { updateParticipantData, updateParticipantPrice, deleteParticipant } from '@/actions/admin/collects';
import { ParticipantStatusSelect } from './ParticipantStatusSelect';
import { Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

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
  clientName?: string | null;
  clientEmail?: string | null;
};

interface RowProps {
  participant: Participant;
  collectId: string;
  canViewFinances: boolean;
}

function QuickPriceCell({
  participant,
  collectId,
}: {
  participant: Participant;
  collectId: string;
}) {
  const [price, setPrice] = useState<number | string>(participant.totalPrice ?? 0);
  const [isPending, startTransition] = useTransition();
  const isCancellingRef = useRef(false);

  const isDirty = Number(price) !== (participant.totalPrice ?? 0);

  const handleSave = () => {
    if (isCancellingRef.current) {
      isCancellingRef.current = false;
      return;
    }

    const finalPrice = Math.max(0, Number(price) || 0);
    if (finalPrice === participant.totalPrice) return;

    startTransition(async () => {
      const res = await updateParticipantPrice(participant.id, collectId, finalPrice);

      if (res?.error) {
        toast.error(res.error);
        setPrice(participant.totalPrice ?? 0);
      } else {
        toast.success('Стоимость обновлена');
      }
    });
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      <input
        type="number"
        min="0"
        value={price}
        onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.currentTarget.blur(); // Само вызовет onBlur один раз
          } else if (e.key === 'Escape') {
            isCancellingRef.current = true;
            setPrice(participant.totalPrice ?? 0);
            e.currentTarget.blur();
          }
        }}
        onBlur={handleSave}
        disabled={isPending}
        className={`w-28 bg-theme-bg border-2 rounded-[12px] px-2.5 py-1.5 text-right font-extrabold text-base text-theme-text outline-none transition-all ${
          isDirty
            ? 'border-theme-highlight ring-2 ring-theme-highlight/20'
            : 'border-theme-border hover:border-theme-border/80 focus:border-theme-highlight'
        } disabled:opacity-50`}
      />
      <span className="font-extrabold text-theme-text text-base select-none">₽</span>
      {isDirty && (
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="p-1.5 bg-theme-highlight text-theme-bg rounded-[10px] text-xs font-bold hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50 ml-1"
          title="Сохранить"
        >
          {isPending ? '⏳' : '💾'}
        </button>
      )}
    </div>
  );
}

// Полное редактирование строки заказа (монтируется только в режиме isEditing)
function ParticipantEditRow({
  participant,
  collectId,
  canViewFinances,
  onClose,
}: {
  participant: Participant;
  collectId: string;
  canViewFinances: boolean;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
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
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success('Заявка участника обновлена');
        onClose();
      }
    });
  };

  const handleDelete = () => {
    if (window.confirm('Точно удалить этого участника? Действие необратимо.')) {
      startTransition(async () => {
        const res = await deleteParticipant(participant.id, collectId);
        if (res?.error) {
          toast.error(res.error);
        } else {
          toast.success('Участник удален');
        }
      });
    }
  };

  return (
    <tr className="border-b-2 border-theme-border bg-theme-bg/80 transition-colors">
      <td className="p-4 align-top">
        <input
          type="text"
          value={form.nickname}
          onChange={(e) => setForm({ ...form, nickname: e.target.value })}
          placeholder="Никнейм"
          disabled={isPending}
          className="w-full bg-theme-surface border-2 border-theme-border rounded-[12px] px-3 py-2 text-sm font-bold text-theme-text outline-none focus:border-theme-highlight"
        />
      </td>
      <td className="p-4 align-top">
        <div className="flex flex-col gap-2">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            disabled={isPending}
            className="w-full bg-theme-surface border-2 border-theme-border rounded-[12px] px-3 py-2 text-sm font-bold text-theme-text outline-none focus:border-theme-highlight"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={form.vkId}
              onChange={(e) => setForm({ ...form, vkId: e.target.value })}
              placeholder="VK ID"
              disabled={isPending}
              className="w-full bg-theme-surface border-2 border-theme-border rounded-[12px] px-3 py-2 text-xs font-bold text-theme-text outline-none focus:border-theme-highlight"
            />
            <input
              type="text"
              value={form.telegram}
              onChange={(e) => setForm({ ...form, telegram: e.target.value })}
              placeholder="Telegram"
              disabled={isPending}
              className="w-full bg-theme-surface border-2 border-theme-border rounded-[12px] px-3 py-2 text-xs font-bold text-theme-text outline-none focus:border-theme-highlight"
            />
          </div>
        </div>
      </td>
      <td className="p-4 align-top">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={form.layoutName}
            onChange={(e) => setForm({ ...form, layoutName: e.target.value })}
            placeholder="Название макета"
            disabled={isPending}
            className="w-full bg-theme-surface border-2 border-theme-border rounded-[12px] px-3 py-2 text-sm font-bold text-theme-text outline-none focus:border-theme-highlight"
          />
          <input
            type="url"
            value={form.layoutLink}
            onChange={(e) => setForm({ ...form, layoutLink: e.target.value })}
            placeholder="Ссылка на макет"
            disabled={isPending}
            className="w-full bg-theme-surface border-2 border-theme-border rounded-[12px] px-3 py-2 text-xs font-bold text-theme-text outline-none focus:border-theme-highlight"
          />
        </div>
      </td>
      <td className="p-4 text-center align-top">
        <input
          type="number"
          min="10"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
          disabled={isPending}
          className="w-20 bg-theme-surface border-2 border-theme-border rounded-[12px] px-3 py-2 text-sm font-bold text-theme-text outline-none focus:border-theme-highlight mx-auto block text-center"
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
            className="w-28 bg-theme-surface border-2 border-theme-border rounded-[12px] px-3 py-2 text-sm font-bold text-theme-text outline-none focus:border-theme-highlight ml-auto block text-right"
          />
        </td>
      )}
      <td className="p-4 align-top">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="bg-theme-highlight text-theme-bg px-3 py-2 rounded-[12px] font-bold text-sm hover:opacity-80 transition-opacity disabled:opacity-50 cursor-pointer"
            title="Сохранить всё"
          >
            {isPending ? '⏳' : '💾'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="bg-theme-surface border-2 border-theme-border px-3 py-2 rounded-[12px] font-bold text-sm hover:bg-theme-border transition-colors disabled:opacity-50 cursor-pointer"
            title="Отмена"
          >
            ❌
          </button>
          {canViewFinances && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="bg-theme-surface border-2 border-theme-yellow-text text-theme-yellow-text px-3 py-2 rounded-[12px] font-bold text-sm hover:bg-theme-yellow-text hover:text-theme-bg transition-colors disabled:opacity-50 ml-1 cursor-pointer"
              title="Удалить заявку"
            >
              🗑️
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export function ParticipantTableRow({ participant, collectId, canViewFinances }: RowProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <ParticipantEditRow
        participant={participant}
        collectId={collectId}
        canViewFinances={canViewFinances}
        onClose={() => setIsEditing(false)}
      />
    );
  }

  return (
    <tr className="border-b-2 border-theme-border hover:bg-theme-bg/50 transition-colors">
      <td className="p-5 font-extrabold text-theme-text text-lg align-top">
        <div className="flex items-center gap-2">
          <span>{participant.nickname || participant.clientName || 'Без имени'}</span>
          {participant.isLayoutsUploaded && (
            <span className="text-xs bg-theme-green-bg text-theme-green-text px-2 py-0.5 rounded-full whitespace-nowrap">
              Макеты ок
            </span>
          )}
        </div>
      </td>
      <td className="p-5 align-top">
        <div className="text-theme-text font-bold text-sm mb-1">
          {participant.email || participant.clientEmail || 'Нет email'}
        </div>
        <div className="flex flex-col gap-0.5">
          {participant.vkId && (
            <a
              href={`https://vk.com/${participant.vkId.replace('vk.com/', '')}`}
              target="_blank"
              rel="noreferrer"
              className="text-theme-highlight hover:underline font-bold text-xs"
            >
              VK: {participant.vkId}
            </a>
          )}
          {participant.telegram && (
            <a
              href={`https://t.me/${participant.telegram.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="text-theme-highlight hover:underline font-bold text-xs"
            >
              TG: {participant.telegram}
            </a>
          )}
        </div>
      </td>
      <td className="p-5 max-w-[220px] align-top">
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
            className="inline-flex items-center gap-1 text-theme-highlight hover:underline font-extrabold text-xs bg-theme-surface border-2 border-theme-border px-2.5 py-1 rounded-[10px]"
          >
            <LinkIcon size={12} /> Скачать файлы
          </a>
        ) : (
          <span className="text-theme-muted font-bold text-xs">Нет ссылки</span>
        )}
      </td>
      <td className="p-5 font-extrabold text-theme-text text-xl text-center align-top">
        {participant.quantity} шт.
      </td>

      {canViewFinances && (
        <td className="p-5 align-top text-right">
          <QuickPriceCell
            key={`${participant.id}-${participant.totalPrice}`}
            participant={participant}
            collectId={collectId}
          />
        </td>
      )}

      <td className="p-5 align-top">
        <div className="flex items-center gap-3">
          <ParticipantStatusSelect
            participantId={participant.id}
            currentStatus={participant.status}
            collectId={collectId}
          />
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="p-2 text-theme-muted hover:text-theme-highlight transition-colors bg-theme-surface border-2 border-theme-border hover:border-theme-highlight rounded-[12px] cursor-pointer"
            title="Редактировать заказ полностью"
          >
            ✏️
          </button>
        </div>
      </td>
    </tr>
  );
}