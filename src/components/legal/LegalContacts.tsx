export const legalOperator = {
  name: 'Индивидуальный предприниматель Крылов Герман Юрьевич',
  inn: '781154959127',
  ogrnip: '326784700271164',
  email: 'merchreef@mail.ru',
};

const contactLinkClassName = 'text-theme-accent underline decoration-theme-border underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-accent';

export function LegalEmail() {
  return <a href={`mailto:${legalOperator.email}`} className={contactLinkClassName}>{legalOperator.email}</a>;
}

export function LegalContacts() {
  return (
    <div className="space-y-4">
      <p className="font-bold">{legalOperator.name}</p>
      <dl className="grid gap-3 text-sm sm:grid-cols-2 sm:text-base">
        <div><dt className="text-theme-muted">ИНН</dt><dd className="font-bold">{legalOperator.inn}</dd></div>
        <div><dt className="text-theme-muted">ОГРНИП</dt><dd className="font-bold">{legalOperator.ogrnip}</dd></div>
        <div><dt className="text-theme-muted">Электронная почта</dt><dd><LegalEmail /></dd></div>
        <div><dt className="text-theme-muted">Город</dt><dd>Санкт-Петербург</dd></div>
      </dl>
      <p className="flex flex-wrap gap-x-5 gap-y-2">
        <a href="https://vk.ru/merchreef" target="_blank" rel="noopener noreferrer" className={contactLinkClassName}>ВКонтакте</a>
        <a href="https://t.me/merchreef" target="_blank" rel="noopener noreferrer" className={contactLinkClassName}>Telegram</a>
      </p>
    </div>
  );
}
