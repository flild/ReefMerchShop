'use client';
import { useState } from 'react';
import { createParticipantRequest, confirmLayoutsUploaded } from '@/actions/client/collectActions';

export default function JoinCollectForm({ collectId, driveLink }: { collectId: string, driveLink: string }) {
  const [step, setStep] = useState(1);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleStep1(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append('collectId', collectId);
    
    const res = await createParticipantRequest(formData);
    if (res.success) {
      setParticipantId(res.participantId);
      setStep(2);
    }
    setIsLoading(false);
  }

  async function handleStep2() {
    if (!participantId) return;
    setIsLoading(true);
    await confirmLayoutsUploaded(participantId, collectId);
    setStep(3);
    setIsLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto bg-theme-surface anime-border anime-shadow p-8 mt-12 rounded-[40px]">
      {step === 1 && (
        <form onSubmit={handleStep1} className="flex flex-col gap-6">
          <h2 className="text-3xl font-display font-extrabold text-theme-text mb-2">Записаться в коллект</h2>
          
          <label className="flex flex-col gap-2 font-bold text-theme-muted">
            Твой никнейм
            <input 
              name="nickname" 
              required 
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] p-4 text-theme-text font-medium outline-none focus:border-theme-highlight transition-colors" 
              placeholder="Художник #1"
            />
          </label>
          
          <label className="flex flex-col gap-2 font-bold text-theme-muted">
            ID ВКонтакте (для связи)
            <input 
              name="vkId" 
              required 
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] p-4 text-theme-text font-medium outline-none focus:border-theme-highlight transition-colors" 
              placeholder="vk.com/твой_айди"
            />
          </label>

          <button 
            type="submit" 
            disabled={isLoading}
            className="anime-button px-6 py-4 text-lg mt-4 w-full"
          >
            {isLoading ? 'Загрузка...' : 'Далее →'}
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl font-display font-extrabold text-theme-text mb-2">Загрузка макетов</h2>
          
          <div className="bg-theme-bg p-6 rounded-[24px] border-2 border-theme-border text-theme-text font-medium text-sm">
            <h3 className="font-bold text-theme-highlight text-lg mb-2">Чек-лист:</h3>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>Файлы в формате CMYK / 300 dpi.</li>
              <li>Названия файлов соответствуют шаблону.</li>
              <li>Все шрифты переведены в кривые.</li>
            </ul>
          </div>

          <a 
            href={driveLink} 
            target="_blank" 
            rel="noreferrer"
            className="p-4 bg-theme-bg border-2 border-theme-border rounded-[20px] text-theme-highlight font-extrabold text-center hover:bg-theme-highlight hover:text-theme-btn-text transition-colors"
          >
            📁 Открыть папку Google Диск
          </a>

          <label className="flex items-center gap-4 cursor-pointer mt-4 p-4 border-2 border-theme-border rounded-[20px] bg-theme-bg/50">
            <input 
              type="checkbox" 
              required 
              id="confirmUpload"
              className="w-6 h-6 accent-theme-highlight"
            />
            <span className="font-bold text-theme-text">Да, я загрузил(а) макеты по чек-листу</span>
          </label>

          <button 
            onClick={() => {
              if ((document.getElementById('confirmUpload') as HTMLInputElement).checked) {
                handleStep2();
              } else {
                alert('Сначала поставь галочку!');
              }
            }}
            disabled={isLoading}
            className="anime-button px-6 py-4 text-lg w-full"
          >
            {isLoading ? 'Сохраняем...' : 'Завершить регистрацию'}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-display font-extrabold text-theme-text mb-2">Заявка отправлена!</h2>
          <p className="text-theme-muted font-bold">Менеджер проверит макеты и обновит статус.</p>
        </div>
      )}
    </div>
  );
}