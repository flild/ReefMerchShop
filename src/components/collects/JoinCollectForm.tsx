'use client';

import { useState, useTransition } from 'react';
import { createParticipantRequest, submitParticipantLayouts } from '@/actions/client/collectActions';
import { Check, UploadCloud, User, Mail, MessageCircle, FileImage, Link as LinkIcon, Hash } from 'lucide-react';
import Link from 'next/link';

interface Props {
  collectId: string;
  title: string;
  driveLink: string | null;
}

export function JoinCollectForm({ collectId, title, driveLink }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [isPending, startTransition] = useTransition();

  const handleStep1Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.append('collectId', collectId);

    startTransition(async () => {
      const res = await createParticipantRequest(formData);
      if (res.error) {
        setError(res.error);
        return;
      }
      if (res.success && res.participantId) {
        setParticipantId(res.participantId);
        setStep(2);
      }
    });
  };

  const handleStep2Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!participantId) return;
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await submitParticipantLayouts(participantId, collectId, formData);
      if (res.error) {
        setError(res.error);
        return;
      }
      if (res.success) {
        setStep(3);
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 md:p-12 overflow-hidden relative">
      {/* Прогресс шагов */}
      <div className="flex items-center justify-between mb-10 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-theme-bg -z-10" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-theme-highlight -z-10 transition-all duration-500"
          style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
        />
        {[1, 2, 3].map((num) => (
          <div 
            key={num}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-black border-2 transition-colors ${
              step >= num 
                ? 'bg-theme-highlight border-theme-highlight text-theme-bg' 
                : 'bg-theme-surface border-theme-border text-theme-muted'
            }`}
          >
            {step > num ? <Check size={20} strokeWidth={3} /> : num}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-theme-yellow-bg text-theme-yellow-text border-2 border-theme-yellow-text rounded-[20px] font-bold">
          {error}
        </div>
      )}

      {/* ШАГ 1: КОНТАКТЫ */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-display font-black text-theme-text mb-2">Запись в коллект</h2>
            <p className="text-theme-muted font-bold">{title}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-extrabold text-theme-text ml-2 flex items-center gap-2">
                <User size={18} /> Твой никнейм
              </label>
              <input 
                name="nickname" 
                required 
                autoFocus
                className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-4 text-theme-text font-bold outline-none focus:border-theme-highlight transition-all" 
                placeholder="Арт-Самурай"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="font-extrabold text-theme-text ml-2 flex items-center gap-2">
                <Mail size={18} /> Email
              </label>
              <input 
                name="email" 
                type="email"
                required 
                className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-4 text-theme-text font-bold outline-none focus:border-theme-highlight transition-all" 
                placeholder="pochta@mail.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-extrabold text-theme-text ml-2 text-sm">ID ВКонтакте</label>
              <input 
                name="vkId" 
                className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-4 text-theme-text font-bold outline-none focus:border-theme-highlight transition-all" 
                placeholder="vk.com/id"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-extrabold text-theme-text ml-2 flex items-center gap-2 text-sm">
                <MessageCircle size={16} /> Telegram
              </label>
              <input 
                name="telegram" 
                className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-4 text-theme-text font-bold outline-none focus:border-theme-highlight transition-all" 
                placeholder="@username"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="anime-button px-6 py-4 text-lg mt-4 flex items-center justify-center gap-2"
          >
            {isPending ? 'Загрузка...' : 'Продолжить →'}
          </button>
        </form>
      )}

      {/* ШАГ 2: ДАННЫЕ МАКЕТА */}
      {step === 2 && (
        <form onSubmit={handleStep2Submit} className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4">
          <div className="text-center">
            <h2 className="text-3xl font-display font-black text-theme-text mb-2">Данные макета</h2>
            <p className="text-theme-muted font-bold">Опиши, что печатаем и прикрепи ссылку</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-extrabold text-theme-text ml-2 flex items-center gap-2">
              <FileImage size={18} /> Название макета
            </label>
            <input 
              name="layoutName" 
              required 
              autoFocus
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-4 text-theme-text font-bold outline-none focus:border-theme-highlight transition-all" 
              placeholder="Например: Брелок Аянами Рэй 5см голография"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-extrabold text-theme-text ml-2 flex items-center gap-2">
              <Hash size={18} /> Тираж (шт.)
            </label>
            <input 
              name="quantity" 
              type="number"
              min="10"
              required 
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-4 text-theme-text font-bold outline-none focus:border-theme-highlight transition-all" 
              placeholder="10"
            />
            <span className="text-theme-muted text-xs font-bold ml-2">Минимальный заказ на 1 макет — 10 штук.</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-extrabold text-theme-text ml-2 flex items-center gap-2">
              <LinkIcon size={18} /> Ссылка на файлы
            </label>
            <input 
              name="layoutLink" 
              type="url"
              required 
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-4 text-theme-text font-bold outline-none focus:border-theme-highlight transition-all" 
              placeholder="Google Диск / Яндекс Диск"
            />
          </div>

          {driveLink && (
            <div className="bg-theme-bg p-4 rounded-[20px] border-2 border-theme-border text-sm font-bold flex flex-col gap-2">
              <span className="text-theme-muted">💡 Или загрузи файлы в общую папку коллекта:</span>
              <a 
                href={driveLink} 
                target="_blank" 
                rel="noreferrer"
                className="text-theme-highlight hover:underline flex items-center gap-2"
              >
                <UploadCloud size={16} /> Открыть общую папку Google Диск
              </a>
            </div>
          )}

          <label className="flex items-start gap-4 cursor-pointer p-5 border-2 border-theme-border rounded-[20px] hover:border-theme-highlight transition-colors bg-theme-bg/50 group">
            <div className="relative flex items-center justify-center mt-0.5">
              <input 
                type="checkbox" 
                required 
                className="peer appearance-none w-6 h-6 border-2 border-theme-muted rounded-md checked:border-theme-highlight checked:bg-theme-highlight transition-colors cursor-pointer"
              />
              <Check size={16} strokeWidth={4} className="absolute text-theme-bg opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
            </div>
            <span className="font-bold text-theme-text select-none group-hover:text-theme-highlight transition-colors leading-tight">
              Макеты проверены по чек-листу (CMYK, 300 dpi, шрифты в кривых).
            </span>
          </label>

          <button 
            type="submit"
            disabled={isPending}
            className="anime-button px-6 py-4 text-lg w-full"
          >
            {isPending ? 'Сохраняем...' : 'Отправить заявку'}
          </button>
        </form>
      )}

      {/* ШАГ 3: УСПЕХ */}
      {step === 3 && (
        <div className="text-center py-10 flex flex-col items-center gap-6 animate-in zoom-in-95">
          <div className="w-24 h-24 bg-theme-highlight rounded-full flex items-center justify-center text-theme-bg anime-shadow">
            <Check size={48} strokeWidth={4} />
          </div>
          <div>
            <h2 className="text-3xl font-display font-black text-theme-text mb-3">Заявка отправлена!</h2>
            <p className="text-theme-muted font-bold text-lg max-w-sm mx-auto">
              Менеджер проверит макеты, посчитает точную сумму и обновит статус твоей заявки.
            </p>
          </div>
          <Link href="/collects" className="anime-button px-8 py-3 mt-4">
            Вернуться к коллектам
          </Link>
        </div>
      )}
    </div>
  );
}