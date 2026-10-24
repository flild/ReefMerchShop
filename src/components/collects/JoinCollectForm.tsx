'use client';

import { useRef, useState, useTransition, type FormEvent } from 'react';
import { LoaderCircle } from 'lucide-react';
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
      <header className="mb-10">
        <h1 className="font-display text-3xl font-black text-theme-text sm:text-4xl">Запись в коллект</h1>
        <p className="mt-3 break-words text-lg font-bold text-theme-muted">{title}</p>
      </header>

      <form onSubmit={handleSubmit} aria-busy={isPending}>
        <input type="hidden" name="collectId" value={collectId} />
        <fieldset disabled={isPending} className="min-w-0 space-y-8 disabled:opacity-70">
          <legend className="sr-only">Контакты и данные макета</legend>
          <JoinCollectFields driveLink={driveLink} />
        </fieldset>

        <div className="mt-8 space-y-6 border-t-2 border-theme-border pt-8">
          <label className="flex cursor-pointer items-start gap-3 text-sm font-medium leading-relaxed text-theme-muted">
            <input name="consent" type="checkbox" required disabled={isPending} className="anime-border mt-1 h-5 w-5 shrink-0 accent-theme-accent" />
            <span>
              Соглашаюсь с <a href="/privacy" target="_blank" rel="noreferrer" className="font-bold text-theme-text underline underline-offset-2">политикой конфиденциальности</a> и <a href="/terms" target="_blank" rel="noreferrer" className="font-bold text-theme-text underline underline-offset-2">условиями оферты</a>, даю согласие на обработку персональных данных.
            </span>
          </label>

          {error && <p role="alert" className="rounded-2xl bg-theme-yellow-bg p-4 text-sm font-bold text-theme-yellow-text">{error}</p>}
          <button type="submit" disabled={isPending} className="anime-button flex w-full items-center justify-center gap-2 px-6 py-4 text-base disabled:pointer-events-none disabled:opacity-60 sm:w-auto">
            {isPending && <LoaderCircle size={20} className="animate-spin" aria-hidden="true" />}
            {isPending ? 'Отправляем заявку…' : 'Отправить заявку'}
          </button>
        </div>
      </form>
    </div>
  );
}
