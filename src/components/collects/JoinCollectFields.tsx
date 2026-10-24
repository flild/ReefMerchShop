const inputClass = 'anime-border w-full min-w-0 !rounded-2xl bg-theme-surface px-4 py-3 font-medium text-theme-text outline-none transition-colors placeholder:text-theme-muted/70 focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/20';
const labelClass = 'mb-2 block text-sm font-bold text-theme-text';
const linkClass = 'font-bold text-theme-text underline underline-offset-4 hover:text-theme-accent';

export function JoinCollectFields({ driveLink }: { driveLink: string | null }) {
  return (
    <>
      <section aria-labelledby="contact-heading">
        <h2 id="contact-heading" className="mb-6 font-display text-2xl font-extrabold text-theme-text">Контакты</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="join-nickname" className={labelClass}>Никнейм</label>
            <input id="join-nickname" name="nickname" autoComplete="nickname" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="join-email" className={labelClass}>Email</label>
            <input id="join-email" name="email" type="email" autoComplete="email" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="join-vk" className={labelClass}>ВКонтакте <span className="font-medium text-theme-muted">(необязательно)</span></label>
            <input id="join-vk" name="vkId" className={inputClass} placeholder="vk.com/username" />
          </div>
          <div>
            <label htmlFor="join-telegram" className={labelClass}>Telegram <span className="font-medium text-theme-muted">(необязательно)</span></label>
            <input id="join-telegram" name="telegram" className={inputClass} placeholder="@username" />
          </div>
        </div>
      </section>

      <section className="border-t-2 border-theme-border pt-8" aria-labelledby="layout-heading">
        <h2 id="layout-heading" className="mb-6 font-display text-2xl font-extrabold text-theme-text">Макет</h2>
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_160px]">
            <div>
              <label htmlFor="join-layout" className={labelClass}>Название макета</label>
              <input id="join-layout" name="layoutName" required className={inputClass} placeholder="Брелок с котиком, 5 см" />
            </div>
            <div>
              <label htmlFor="join-quantity" className={labelClass}>Тираж, шт.</label>
              <input id="join-quantity" name="quantity" type="number" min={10} step={1} inputMode="numeric" required className={inputClass} aria-describedby="quantity-hint" />
              <p id="quantity-hint" className="mt-2 text-xs text-theme-muted">От 10 шт. на макет.</p>
            </div>
          </div>
          <div>
            <label htmlFor="join-link" className={labelClass}>Ссылка на файлы</label>
            <input id="join-link" name="layoutLink" type="url" required className={inputClass} placeholder="https://disk.yandex.ru/…" aria-describedby="link-hint" />
            <p id="link-hint" className="mt-2 text-sm leading-relaxed text-theme-muted">Открой доступ к файлам в облаке по ссылке.</p>
          </div>

          {driveLink && (
            <p className="text-sm leading-relaxed text-theme-muted">
              Можно загрузить макет в <a href={driveLink} target="_blank" rel="noreferrer" className={linkClass}>папку коллекта</a> и указать ссылку на свой файл выше.
            </p>
          )}

          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-theme-text">
            <input name="layoutsChecked" type="checkbox" required className="anime-border mt-0.5 h-5 w-5 shrink-0 accent-theme-accent" />
            <span>Макет проверен по <a href="/tools/checklist" target="_blank" rel="noreferrer" className={linkClass}>чек-листу</a> и готов к печати</span>
          </label>
        </div>
      </section>
    </>
  );
}
