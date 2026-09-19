import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Условия Оферты | РИФ',
  description: 'Условия Оферты типографии РИФ.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-theme-bg">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-theme-surface p-10 rounded-[40px] anime-border anime-shadow text-theme-text">
          <h1 className="text-4xl font-display font-black mb-8 text-theme-text">Условия Оферты</h1>

          <div className="prose prose-theme max-w-none space-y-6">
            <p><strong>1. Общие положения</strong><br/>
            Данный документ является официальным предложением (публичной офертой) ИП (ИНН 781154959127, ОГРНИП 326784700271164) и содержит все существенные условия предоставления услуг по изготовлению печатной продукции.</p>

            <p><strong>2. Предмет оферты</strong><br/>
            Исполнитель обязуется оказать услуги по изготовлению полиграфической/сувенирной продукции (далее – Продукция) согласно оформленным Заказам Пользователя, а Пользователь обязуется оплатить эти услуги.</p>

            <p><strong>3. Оформление заказа</strong><br/>
            Заказ Продукции осуществляется Заказчиком через сервисы сайта (калькулятор, форма заявки, коллекты). При оформлении заказа Заказчик обязуется предоставить достоверную информацию о себе.</p>

            <p><strong>4. Стоимость услуг и порядок расчетов</strong><br/>
            Стоимость услуг определяется на основе тарифов, указанных на сайте, и фиксируется в момент оформления заказа. Оплата производится в рублях.</p>

            <p><strong>5. Реквизиты исполнителя</strong><br/>
            ИП<br/>
            ИНН: 781154959127<br/>
            ОГРНИП: 326784700271164<br/>
            Email: <a href="mailto:merchreef@mail.ru" className="text-reef-cyan hover:underline">merchreef@mail.ru</a><br/>
            VK: <a href="https://vk.ru/merchreef" target="_blank" rel="noopener noreferrer" className="text-reef-cyan hover:underline">https://vk.ru/merchreef</a><br/>
            Telegram: <a href="https://t.me/merchreef" target="_blank" rel="noopener noreferrer" className="text-reef-cyan hover:underline">https://t.me/merchreef</a></p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
