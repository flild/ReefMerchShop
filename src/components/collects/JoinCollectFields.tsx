import { ArrowUpRight, FileImage, Link as LinkIcon, Mail, MessageCircle, Package, UploadCloud, User } from 'lucide-react';

const inputClass = 'anime-border w-full min-w-0 !rounded-2xl bg-theme-bg px-4 py-3.5 font-bold text-theme-text outline-none transition-colors placeholder:font-medium placeholder:text-theme-muted/70 focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20';
const labelClass = 'mb-2 flex items-center gap-2 text-sm font-extrabold text-theme-text';

export function JoinCollectFields({ driveLink }: { driveLink: string | null }) {
  return (
    <>
      <section className="anime-border anime-shadow bg-theme-surface p-6 sm:p-8" aria-labelledby="contact-heading">
        <div className="mb-6 flex items-start gap-4">
          <div className="rounded-2xl bg-theme-accent/10 p-3 text-theme-text"><User size={24} aria-hidden="true" /></div>
          <div>
            <h2 id="contact-heading" className="font-display text-2xl font-black text-theme-text">Давай знакомиться</h2>
            <p className="mt-1 text-sm font-medium text-theme-muted">Никнейм и почта обязательны. Соцсети — по желанию.</p>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="join-nickname" className={labelClass}><User size={16} aria-hidden="true" /> Твой никнейм</label>
            <input id="join-nickname" name="nickname" autoComplete="nickname" required className={inputClass} placeholder="Арт-Самурай" />
          </div>
          <div>
            <label htmlFor="join-email" className={labelClass}><Mail size={16} aria-hidden="true" /> Email</label>
            <input id="join-email" name="email" type="email" autoComplete="email" required className={inputClass} placeholder="pochta@mail.com" />
          </div>
        </div>
        <details className="mt-5">
          <summary className="cursor-pointer text-sm font-extrabold text-theme-muted hover:text-theme-text">Добавить соцсети для связи</summary>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="join-vk" className={labelClass}>ВКонтакте</label>
              <input id="join-vk" name="vkId" className={inputClass} placeholder="vk.com/твой_профиль" />
            </div>
            <div>
              <label htmlFor="join-telegram" className={labelClass}><MessageCircle size={16} aria-hidden="true" /> Telegram</label>
              <input id="join-telegram" name="telegram" className={inputClass} placeholder="@username" />
            </div>
          </div>
        </details>
      </section>

      <section className="anime-border anime-shadow bg-theme-surface p-6 sm:p-8" aria-labelledby="layout-heading">
        <div className="mb-6 flex items-start gap-4">
          <div className="rounded-2xl bg-theme-accent/10 p-3 text-theme-text"><FileImage size={24} aria-hidden="true" /></div>
          <div>
            <h2 id="layout-heading" className="font-display text-2xl font-black text-theme-text">Что будем печатать?</h2>
            <p className="mt-1 text-sm font-medium text-theme-muted">Один макет — от 10 штук. Все поля обязательны.</p>
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <label htmlFor="join-layout" className={labelClass}><FileImage size={16} aria-hidden="true" /> Название макета</label>
            <input id="join-layout" name="layoutName" required className={inputClass} placeholder="Например: брелок с котиком, 5 см" />
          </div>
          <div className="max-w-xs">
            <label htmlFor="join-quantity" className={labelClass}><Package size={16} aria-hidden="true" /> Тираж, шт.</label>
            <input id="join-quantity" name="quantity" type="number" min={10} step={1} inputMode="numeric" required className={inputClass} placeholder="10" aria-describedby="quantity-hint" />
            <p id="quantity-hint" className="ml-1 mt-2 text-xs font-medium text-theme-muted">Минимум 10 одинаковых изделий.</p>
          </div>
          <div>
            <label htmlFor="join-link" className={labelClass}><LinkIcon size={16} aria-hidden="true" /> Ссылка на файлы</label>
            <input id="join-link" name="layoutLink" type="url" required className={inputClass} placeholder="https://disk.yandex.ru/…" aria-describedby="link-hint" />
            <p id="link-hint" className="ml-1 mt-2 text-xs font-medium leading-relaxed text-theme-muted">Подойдёт Google Диск, Яндекс Диск или другое облако. Открой доступ к файлам по ссылке.</p>
          </div>

          {driveLink && (
            <div className="rounded-2xl border-2 border-dashed border-theme-border bg-theme-accent/5 p-4">
              <p className="mb-2 text-sm font-medium text-theme-muted">Можно загрузить файлы в папку коллекта.</p>
              <a href={driveLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-extrabold text-theme-text underline underline-offset-4 hover:text-theme-highlight">
                <UploadCloud size={18} aria-hidden="true" /> Открыть общую папку <ArrowUpRight size={16} aria-hidden="true" />
              </a>
              <p className="mt-2 text-xs leading-relaxed text-theme-muted">Затем вставь ссылку на свой файл в поле выше, чтобы мы его нашли.</p>
            </div>
          )}

          <div className="anime-border !rounded-2xl bg-theme-bg p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input name="layoutsChecked" type="checkbox" required className="anime-border mt-0.5 h-5 w-5 shrink-0 accent-theme-accent" />
              <span className="text-sm font-extrabold text-theme-text">Макет проверен и готов к отправке</span>
            </label>
            <a href="/tools/checklist" target="_blank" rel="noreferrer" className="ml-8 mt-2 inline-flex items-center gap-1 text-xs font-bold text-theme-muted underline underline-offset-4 hover:text-theme-text">
              Свериться с чек-листом <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
