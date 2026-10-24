'use client';

import { useRef, useState, useTransition, type FormEvent } from 'react';
import { ArrowUpRight, Check, LoaderCircle, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { createParticipantRequest } from '@/actions/client/collectActions';
import { collectRequestSchema, type CollectRequest } from '@/lib/validations/collect-request';
import { JoinCollectFields } from './JoinCollectFields';
import { JoinCollectSuccess } from './JoinCollectSuccess';

interface Props {
  collectId: string;
  title: string;
  driveLink: string | null;
}

export function JoinCollectForm({ collectId, title, driveLink }: Props) {
  const [receipt, setReceipt] = useState<CollectRequest | null>(null);
  const [summary, setSummary] = useState({ layoutName: '', quantity: '', email: '' });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const submitting = useRef(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const parsed = collectRequestSchema.safeParse(Object.fromEntries(formData));
    setError(null);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      setError(issue.message);
      toast.error(issue.message);
      const field = form.elements.namedItem(String(issue.path[0]));
      if (field instanceof HTMLElement) field.focus();
      return;
    }

    submitting.current = true;
    startTransition(async () => {
      try {
        const result = await createParticipantRequest(formData);
        if (!result.success) {
          setError(result.error);
          toast.error(result.error);
          return;
        }
        setReceipt(parsed.data);
        toast.success('Заявка в коллект отправлена!');
      } catch {
        const message = 'Не удалось отправить заявку. Проверь соединение и попробуй ещё раз.';
        setError(message);
        toast.error(message);
      } finally {
        submitting.current = false;
      }
    });
  }

  if (receipt) {
    return <JoinCollectSuccess title={title} request={receipt} />;
  }

  return (
    <div>
      <header className="mb-10 max-w-2xl">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-theme-accent/10 px-4 py-2 text-sm font-extrabold text-theme-text">
          <Sparkles size={16} aria-hidden="true" /> Твой мерч — в общей компании
        </span>
        <h1 className="mb-3 font-display text-4xl font-black text-theme-text sm:text-5xl">Присоединяйся к коллекту</h1>
        <p className="mb-3 break-words text-xl font-extrabold text-theme-text">{title}</p>
        <p className="text-lg font-medium leading-relaxed text-theme-muted">
          Оставь контакты и расскажи, что печатаем. Всё для заявки — на этой странице.
        </p>
      </header>

      <form onSubmit={handleSubmit} onChange={(event) => {
        const data = new FormData(event.currentTarget);
        setSummary({
          layoutName: String(data.get('layoutName') ?? '').trim(),
          quantity: String(data.get('quantity') ?? ''),
          email: String(data.get('email') ?? '').trim(),
        });
      }} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8" aria-busy={isPending}>
        <input type="hidden" name="collectId" value={collectId} />
        <fieldset disabled={isPending} className="min-w-0 space-y-6 disabled:opacity-70">
          <legend className="sr-only">Контакты и данные макета</legend>
          <JoinCollectFields driveLink={driveLink} />
        </fieldset>

        <aside className="anime-border anime-shadow min-w-0 bg-theme-surface p-6 sm:p-8 lg:sticky lg:top-8" aria-label="Сводка заявки">
          <div className="mb-6 border-b-2 border-dashed border-theme-border pb-6">
            <p className="mb-2 text-xs font-black uppercase tracking-widest text-theme-muted">Твоя заявка</p>
            <h2 className="break-words font-display text-2xl font-black text-theme-text">{title}</h2>
          </div>
          <dl className="space-y-5 text-sm">
            <div>
              <dt className="mb-1 font-bold text-theme-muted">Что печатаем</dt>
              <dd className="break-words font-extrabold text-theme-text">{summary.layoutName || 'Добавь название макета'}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="font-bold text-theme-muted">Тираж</dt>
              <dd className="font-black text-theme-text">{summary.quantity ? `${summary.quantity} шт.` : 'от 10 шт.'}</dd>
            </div>
            <div>
              <dt className="mb-1 font-bold text-theme-muted">Email для связи</dt>
              <dd className="break-words font-extrabold text-theme-text">{summary.email || 'Укажи в контактах'}</dd>
            </div>
          </dl>
          <p className="my-6 rounded-2xl bg-theme-accent/10 p-4 text-sm font-medium leading-relaxed text-theme-text">
            Точную стоимость рассчитаем после проверки макета. Сейчас оплачивать ничего не нужно.
          </p>

          <label className="mb-5 flex cursor-pointer items-start gap-3 text-xs font-medium leading-relaxed text-theme-muted">
            <input name="consent" type="checkbox" required disabled={isPending} className="anime-border mt-1 h-5 w-5 shrink-0 accent-theme-accent" />
            <span>
              Соглашаюсь с <a href="/privacy" target="_blank" rel="noreferrer" className="font-bold text-theme-text underline underline-offset-2">политикой конфиденциальности</a> и <a href="/terms" target="_blank" rel="noreferrer" className="font-bold text-theme-text underline underline-offset-2">условиями оферты</a>, даю согласие на обработку персональных данных.
            </span>
          </label>

          {error && <p role="alert" className="mb-4 rounded-2xl bg-theme-yellow-bg p-4 text-sm font-bold text-theme-yellow-text">{error}</p>}
          <button type="submit" disabled={isPending} className="anime-button flex w-full items-center justify-center gap-2 px-4 py-4 text-base disabled:pointer-events-none disabled:opacity-60">
            {isPending ? <LoaderCircle size={20} className="animate-spin" aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
            {isPending ? 'Отправляем заявку…' : 'Отправить заявку'}
          </button>
          
          <a href="/tools/checklist" target="_blank" rel="noreferrer" className="mt-6 flex items-center justify-center gap-1 text-sm font-bold text-theme-text underline underline-offset-4 hover:text-theme-highlight">
            Помощь с подготовкой <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </aside>
      </form>
    </div>
  );
}
