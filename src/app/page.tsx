import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArrowRight, Calculator, Image as ImageIcon, Package, Sparkles, UploadCloud, Paintbrush, Scissors, Truck, Star, Quote, ChevronDown } from 'lucide-react';
import { db } from '@/db';
import { materials, portfolioItems } from '@/db/schema';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let recentWorks: any[] = [];
  let popMaterials: any[] = [];

  try {
    recentWorks = await db.select().from(portfolioItems).orderBy(desc(portfolioItems.createdAt)).limit(4);
    popMaterials = await db.select().from(materials).limit(4);
  } catch (error) {
    console.error('Failed to load DB on home page:', error);
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full min-h-[650px] flex items-center overflow-hidden bg-reef-light manga-dots">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-white rounded-full blur-3xl opacity-60" />
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-reef-cyan/30 rounded-full blur-2xl" />
            
            {/* Animated floating bubbles */}
            <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full border-4 border-white/40 animate-bounce" />
            <div className="absolute top-1/3 right-1/3 w-4 h-4 rounded-full bg-white/60 animate-pulse" />
            <div className="absolute bottom-1/4 left-1/3 w-12 h-12 rounded-full border-4 border-reef-blue/20 animate-bounce" style={{ animationDelay: '1s' }} />
          </div>

          <div className="container mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
            <div className="space-y-8 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full anime-border shadow-sm text-reef-blue font-bold text-sm tracking-wide">
                <Sparkles size={16} className="text-reef-cyan" />
                Типография для мерчеделов
              </div>
              
              <h1 className="text-5xl md:text-7xl font-display font-black text-slate-800 leading-[1.1] drop-shadow-sm">
                <span className="text-reef-blue drop-shadow-md">РИФ</span> — твоя гавань мерча
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-lg leading-relaxed">
                Акрил, стенды, брелоки и нестандартные формы — мы воплощаем самые яркие идеи в жизнь! 
              </p>
              
              <div className="flex flex-wrap gap-5 pt-4">
                <Link href="/portfolio" className="anime-button px-8 py-4 flex items-center gap-3 text-lg">
                  Посмотреть работы
                  <ArrowRight size={24} strokeWidth={3} />
                </Link>
                <Link href="/calculator" className="anime-button-alt px-8 py-4 flex items-center gap-3 text-lg">
                  Рассчитать заказ
                  <Calculator size={24} strokeWidth={3} />
                </Link>
              </div>
            </div>
            
            <div className="flex justify-center relative mt-12 lg:mt-0">
              <div className="relative w-full max-w-[500px] aspect-square">
                <div className="absolute inset-0 bg-reef-cyan bubble-shape shadow-[0_12px_0_0_#2a8bf2] opacity-20 transform rotate-12 scale-105" />
                <div className="absolute inset-0 bg-white bubble-shape anime-border anime-shadow z-10 overflow-hidden border-8">
                  <Image
                    src="https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800"
                    alt="Anime blue ocean illustration"
                    fill
                    className="object-cover"
                    priority
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Tools Section */}
        <section className="py-24 bg-white relative">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-800 mb-6 drop-shadow-sm">Инструменты для художников</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">Мы сделали всё, чтобы подготовка и расчет заказа были максимально простыми и приятными.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Link href="/calculator" className="bg-reef-light rounded-[40px] p-10 anime-border anime-shadow hover:anime-shadow-hover hover:-translate-y-2 transition-all group block">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-reef-blue mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform anime-border">
                  <Calculator size={36} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-display font-black text-slate-800 mb-4">Калькулятор 2.0</h3>
                <p className="text-lg text-slate-600 mb-8 font-medium">Точный расчет стоимости с учетом материалов, фурнитуры и тиража.</p>
                <div className="text-reef-blue font-bold flex items-center gap-2 group-hover:gap-4 transition-all text-lg">
                  Посчитать <ArrowRight size={24} strokeWidth={3} />
                </div>
              </Link>
              
              <Link href="/tools/mockup" className="bg-white rounded-[40px] p-10 anime-border anime-shadow hover:anime-shadow-hover hover:-translate-y-2 transition-all group block">
                <div className="w-20 h-20 bg-reef-light rounded-3xl flex items-center justify-center text-reef-blue mb-8 shadow-sm group-hover:scale-110 group-hover:-rotate-6 transition-transform anime-border">
                  <ImageIcon size={36} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-display font-black text-slate-800 mb-4">Мокап-генератор</h3>
                <p className="text-lg text-slate-600 mb-8 font-medium">Примерьте свой арт на прозрачный, жемчужный или цветной акрил онлайн.</p>
                <div className="text-reef-blue font-bold flex items-center gap-2 group-hover:gap-4 transition-all text-lg">
                  Попробовать <ArrowRight size={24} strokeWidth={3} />
                </div>
              </Link>
              
              <Link href="/collects" className="bg-reef-light rounded-[40px] p-10 anime-border anime-shadow hover:anime-shadow-hover hover:-translate-y-2 transition-all group block">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-reef-blue mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform anime-border">
                  <Package size={36} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-display font-black text-slate-800 mb-4">Коллекты</h3>
                <p className="text-lg text-slate-600 mb-8 font-medium">Совместные заказы для снижения стоимости производства мерча.</p>
                <div className="text-reef-blue font-bold flex items-center gap-2 group-hover:gap-4 transition-all text-lg">
                  Участвовать <ArrowRight size={24} strokeWidth={3} />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* How we work */}
        <section className="py-24 bg-slate-50 relative border-t-4 border-slate-900 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-800 mb-6 drop-shadow-sm">Как мы работаем</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">Простой путь от вашего макета до готового мерча</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-2 bg-slate-200 -z-10 rounded-full" />
              
              {[
                { icon: <UploadCloud size={32} />, title: 'Загрузка', desc: 'Скидываете нам свои макеты через личный кабинет' },
                { icon: <Paintbrush size={32} />, title: 'Проверка', desc: 'Наш дизайнер проверяет файлы на ошибки печати' },
                { icon: <Scissors size={32} />, title: 'Печать и резка', desc: 'Воплощаем идеи в акриле с яркой УФ-печатью' },
                { icon: <Truck size={32} />, title: 'Доставка', desc: 'Бережно упаковываем и отправляем вам!' },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center relative group">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-reef-blue mb-6 shadow-md border-4 border-slate-900 group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <div className="absolute top-0 -right-4 w-8 h-8 bg-reef-cyan text-white rounded-full flex items-center justify-center font-black border-2 border-slate-900 shadow-sm">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-3">{step.title}</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Showcase */}
        {recentWorks.length > 0 && (
          <section className="py-24 bg-white border-t-4 border-slate-900">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 max-w-6xl mx-auto gap-6">
                <div>
                  <h2 className="text-4xl md:text-5xl font-display font-black text-slate-800 mb-4 drop-shadow-sm">Свежие работы</h2>
                  <p className="text-xl text-slate-600 font-medium">То, что мы напечатали совсем недавно</p>
                </div>
                <Link href="/portfolio" className="anime-button px-6 py-3 flex items-center gap-2 whitespace-nowrap">
                  Смотреть всё
                  <ArrowRight size={20} strokeWidth={3} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {recentWorks.map((item) => (
                  <div key={item.id} className="group relative rounded-3xl overflow-hidden bg-white anime-border anime-shadow hover:-translate-y-2 transition-all duration-300 flex flex-col">
                    <div className="relative aspect-square overflow-hidden bg-slate-50">
                      <Image
                        src={item.imageUrl || `https://picsum.photos/seed/${item.id}/600/600`}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-5 border-t-4 border-slate-900 bg-white flex-1 flex flex-col">
                      <h3 className="font-black text-lg text-slate-800 mb-1">{item.title}</h3>
                      {item.authorName && <p className="text-reef-blue font-bold text-sm mt-auto">Арт: {item.authorName}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Materials Overview */}
        {popMaterials.length > 0 && (
          <section className="py-24 bg-reef-light manga-dots border-t-4 border-slate-900">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-display font-black text-slate-800 mb-6 drop-shadow-sm">Море материалов</h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">От классического прозрачного акрила до переливающегося жемчуга</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {popMaterials.map((mat) => (
                  <div key={mat.id} className="bg-white rounded-[32px] p-6 anime-border anime-shadow hover:anime-shadow-hover transition-all flex flex-col">
                    <div className="aspect-square rounded-2xl overflow-hidden mb-6 border-2 border-slate-200 relative bg-slate-100">
                      <Image
                        src={mat.imageUrl || `https://picsum.photos/seed/${mat.id}/400/400`}
                        alt={mat.name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-2">{mat.name}</h3>
                    {mat.description && <p className="text-slate-600 text-sm line-clamp-2 mt-auto">{mat.description}</p>}
                  </div>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <Link href="/materials" className="anime-button-alt px-8 py-4 inline-flex items-center gap-3 text-lg bg-white">
                  Весь каталог материалов
                  <ArrowRight size={24} strokeWidth={3} />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Testimonials */}
        <section className="py-24 bg-white relative border-t-4 border-slate-900">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-800 mb-6 drop-shadow-sm">Что говорят художники</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { name: 'Kitsu_Art', text: 'Заказывала партию стендов на маркет, всё пришло идеально упаковано. Качество печати — огонь, цвета яркие и сочные!' },
                { name: 'MikaDraws', text: 'Очень удобный калькулятор на сайте. Сразу видно, сколько выйдет заказ. Сделали всё в срок, спасибо огромное!' },
                { name: 'PixelGhost', text: 'Голографический акрил просто волшебный. Брелоки разлетелись в первый же день маркета. Буду заказывать еще 100%.' },
              ].map((review, i) => (
                <div key={i} className="bg-slate-50 rounded-[40px] p-8 anime-border anime-shadow relative flex flex-col justify-between">
                  <div>
                    <Quote size={48} className="text-reef-cyan/20 absolute top-6 right-6" />
                    <div className="flex text-yellow-400 mb-6 gap-1">
                      {[1,2,3,4,5].map(s => <Star key={s} size={20} className="fill-current" />)}
                    </div>
                    <p className="text-lg text-slate-700 font-medium italic mb-6 leading-relaxed">«{review.text}»</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-reef-cyan text-white flex items-center justify-center font-black border-2 border-slate-900 text-xl">
                      {review.name.charAt(0)}
                    </div>
                    <div className="font-bold text-slate-800 text-lg">{review.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-slate-50 relative border-t-4 border-slate-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-800 mb-6 drop-shadow-sm">Вопросы и ответы</h2>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                { q: 'Какой минимальный тираж?', a: 'Минимальный тираж зависит от изделия. Для брелоков это обычно от 10 штук одного макета, для стендов — от 5 штук.' },
                { q: 'Сколько времени занимает производство?', a: 'Стандартный срок производства от 7 до 14 рабочих дней после согласования макетов и оплаты. Перед крупными маркетами сроки могут быть увеличены.' },
                { q: 'Какие требования к макетам?', a: 'Мы принимаем макеты в форматах PSD, AI, PDF. Цветовая модель CMYK. Разрешение не менее 300 dpi. Обязательно наличие слоя с контуром реза и белой подложкой.' },
                { q: 'Доставляете ли вы в другие города?', a: 'Да, мы отправляем готовые заказы по всей России через СДЭК или Почту России. Возможна отправка в другие страны (обсуждается индивидуально).' },
              ].map((faq, i) => (
                <details key={i} className="group bg-white rounded-2xl anime-border shadow-sm overflow-hidden open:anime-shadow transition-all">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none text-xl font-bold text-slate-800 hover:text-reef-blue transition-colors outline-none">
                    {faq.q}
                    <span className="transition-transform group-open:rotate-180 bg-reef-light rounded-full p-2 text-reef-blue">
                      <ChevronDown size={24} />
                    </span>
                  </summary>
                  <div className="p-6 pt-0 text-slate-600 font-medium text-lg leading-relaxed border-t-2 border-slate-100">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-24 bg-reef-blue relative overflow-hidden border-t-4 border-slate-900">
          <div className="absolute inset-0 manga-dots opacity-20" />
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-display font-black text-white mb-8 drop-shadow-md leading-tight">
              Готовы напечатать <br/>свой первый тираж?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium mb-12">
              Напишите нам, и мы с радостью поможем подготовить макеты, подобрать лучшие материалы и запустим заказ в работу!
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/calculator" className="bg-white text-reef-blue px-10 py-5 rounded-full font-black text-xl hover:scale-105 transition-transform shadow-[0_8px_0_0_#94a3b8] hover:shadow-[0_4px_0_0_#94a3b8] hover:translate-y-1">
                Сделать расчет заказа
              </Link>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}
