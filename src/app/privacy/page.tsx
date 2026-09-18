import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Политика конфиденциальности | РИФ',
  description: 'Политика конфиденциальности типографии РИФ.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-theme-bg">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-theme-surface p-10 rounded-[40px] anime-border anime-shadow text-theme-text">
          <h1 className="text-4xl font-display font-black mb-8 text-theme-text">Политика конфиденциальности</h1>

          <div className="prose prose-theme max-w-none space-y-6">
            <p><strong>1. Общие положения</strong><br/>
            Настоящая политика конфиденциальности определяет порядок обработки персональных данных и меры по обеспечению безопасности персональных данных ИП (ИНН 781154959127, ОГРНИП 326784700271164) (далее – Оператор).</p>

            <p><strong>2. Основные понятия, используемые в Политике</strong><br/>
            Автоматизированная обработка персональных данных – обработка персональных данных с помощью средств вычислительной техники;<br/>
            Блокирование персональных данных – временное прекращение обработки персональных данных (за исключением случаев, если обработка необходима для уточнения персональных данных);</p>

            <p><strong>3. Оператор может обрабатывать следующие персональные данные Пользователя</strong><br/>
            - Фамилия, имя, отчество;<br/>
            - Электронный адрес;<br/>
            - Номера телефонов;<br/>
            Также на сайте происходит сбор и обработка обезличенных данных о посетителях (в т.ч. файлов «cookie») с помощью сервисов интернет-статистики.</p>

            <p><strong>4. Цели обработки персональных данных</strong><br/>
            Цель обработки персональных данных Пользователя — информирование Пользователя посредством отправки электронных писем; заключение, исполнение и прекращение гражданско-правовых договоров; предоставление доступа Пользователю к сервисам, информации и/или материалам, содержащимся на веб-сайте.</p>

            <p><strong>5. Реквизиты оператора</strong><br/>
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
