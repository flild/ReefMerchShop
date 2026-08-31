'use client';

import { useState, useTransition } from 'react';
import { createParticipantRequest, confirmLayoutsUploaded } from '@/actions/client/collectActions';
import { Check, UploadCloud, User } from 'lucide-react';
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

    startTransition(async () => {
      const res = await confirmLayoutsUploaded(participantId, collectId);
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
          
          <div className="flex flex-col gap-2">
            <label className="font-extrabold text-theme-text ml-2 flex items-center gap-2">
              <User size={18} /> Твой никнейм
            </label>
            <input 
              name="nickname" 
              required 
              autoFocus
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-4 text-theme-text font-bold outline-none focus:border-theme-highlight transition-all" 
              placeholder="Например: Арт-Самурай"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-extrabold text-theme-text ml-2">ID ВКонтакте (для быстрой связи)</label>
            <input 
              name="vkId" 
              required 
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-4 text-theme-text font-bold outline-none focus:border-theme-highlight transition-all" 
              placeholder="vk.com/твой_айди"
            />
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

      {/* ШАГ 2: МАКЕТЫ */}
      {step === 2 && (
        <form onSubmit={handleStep2Submit} className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4">
          <div className="text-center">
            <h2 className="text-3xl font-display font-black text-theme-text mb-2">Загрузка макетов</h2>
            <p className="text-theme-muted font-bold">Обязательный шаг перед проверкой</p>
          </div>
          
          <div className="bg-theme-bg p-6 rounded-[24px] border-2 border-theme-border">
            <h3 className="font-black text-theme-highlight text-lg mb-3 flex items-center gap-2">
              <Check size={20} /> Чек-лист перед загрузкой:
            </h3>
            <ul className="text-theme-text font-medium flex flex-col gap-3 ml-2">
              <li className="flex items-start gap-2">
                <span className="text-theme-highlight">•</span> Файлы в формате CMYK / 300 dpi.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-theme-highlight">•</span> Названия файлов соответствуют шаблону (Ник_Размер_Материал_Тираж).
              </li>
              <li className="flex items-start gap-2">
                <span className="text-theme-highlight">•</span> Все шрифты переведены в кривые.
              </li>
            </ul>
          </div>

          {driveLink ? (
            <a 
              href={driveLink} 
              target="_blank" 
              rel="noreferrer"
              className="px-6 py-5 bg-theme-surface border-2 border-theme-highlight rounded-[20px] text-theme-text font-extrabold text-center hover:bg-theme-highlight hover:text-theme-bg transition-colors flex items-center justify-center gap-3 anime-shadow"
            >
              <UploadCloud size={24} />
              Открыть папку Google Диск
            </a>
          ) : (
             <div className="bg-theme-yellow-bg text-theme-yellow-text border-2 border-theme-yellow-text rounded-[24px] p-4 font-bold text-center">
                Организатор еще не прикрепил ссылку на диск.
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
              Да, я загрузил(а) макеты на Диск и проверил(а) их по чек-листу.
            </span>
          </label>

          <button 
            type="submit"
            disabled={isPending}
            className="anime-button px-6 py-4 text-lg w-full"
          >
            {isPending ? 'Сохраняем...' : 'Завершить регистрацию'}
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
              Менеджер проверит твои макеты, посчитает сумму и обновит статус заявки.
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