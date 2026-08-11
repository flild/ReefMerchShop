import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { db } from '@/db';
import { materials, accessories } from '@/db/schema';
import { Sparkles, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { eq } from 'drizzle-orm';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Материалы и наличие | Reef',
  description: 'Каталог акрила и фурнитуры для производства мерча',
};

export default async function MaterialsPage() {
  let allMaterials: any[] = [];
  let allAccessories: any[] = [];

  try {
    allMaterials = await db.select().from(materials).orderBy(materials.name);
    allAccessories = await db.select().from(accessories).orderBy(accessories.name);
  } catch (error) {
    console.error('Failed to load materials:', error);
  }

  // Group materials by type
  const acrylics = allMaterials.filter(m => m.type === 'acrylic');
  const holography = allMaterials.filter(m => m.type === 'holography');

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 py-24 bg-reef-light manga-dots">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-20 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full anime-border mb-6 text-reef-blue font-bold text-sm tracking-wide shadow-sm">
              <Sparkles size={16} />
              Каталог материалов
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-black text-slate-800 mb-8 drop-shadow-sm">Материалы и фурнитура</h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
              Всё необходимое для вашего мерча. Мы регулярно пополняем запасы, актуальное наличие обновляется автоматически.
            </p>
          </div>

          {/* Акрил */}
          <div className="mb-20">
            <h2 className="text-4xl font-display font-black text-slate-800 mb-10 flex items-center gap-4">
              <span className="w-12 h-12 bg-reef-cyan text-white rounded-2xl flex items-center justify-center shadow-[0_4px_0_0_#0097a7]">
                <div className="w-6 h-6 border-4 border-white rounded-sm" />
              </span>
              Акрил
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {acrylics.map(material => (
                <MaterialCard key={material.id} item={material} />
              ))}
            </div>
          </div>

          {/* Голография */}
          {holography.length > 0 && (
            <div className="mb-20">
              <h2 className="text-4xl font-display font-black text-slate-800 mb-10 flex items-center gap-4">
                <span className="w-12 h-12 bg-purple-500 text-white rounded-2xl flex items-center justify-center shadow-[0_4px_0_0_#7b1fa2]">
                  <Sparkles size={24} strokeWidth={3} />
                </span>
                Голография (пленка)
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {holography.map(material => (
                  <MaterialCard key={material.id} item={material} />
                ))}
              </div>
            </div>
          )}

          {/* Фурнитура */}
          <div>
            <h2 className="text-4xl font-display font-black text-slate-800 mb-10 flex items-center gap-4">
              <span className="w-12 h-12 bg-reef-blue text-white rounded-2xl flex items-center justify-center shadow-[0_4px_0_0_#093f8e]">
                <div className="w-6 h-6 border-4 border-white rounded-full" />
              </span>
              Фурнитура
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 gap-8">
              {allAccessories.map(acc => (
                <AccessoryCard key={acc.id} item={acc} />
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}

function MaterialCard({ item }: { item: any }) {
  const isAvailable = item.inStock;
  
  return (
    <div className="bg-white rounded-[32px] p-6 anime-border anime-shadow group hover:anime-shadow-hover hover:-translate-y-2 transition-all flex flex-col">
      <div className="w-full h-48 rounded-2xl mb-6 bg-slate-100 flex items-center justify-center relative overflow-hidden border-2 border-slate-100">
        {/* Placeholder for image */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent z-10" />
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className={`w-3/4 h-3/4 rounded-xl shadow-lg border border-white/50 ${getColorClass(item.name)}`} />
        )}
      </div>
      
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">{item.name}</h3>
        {item.description && (
          <p className="text-slate-600 mb-4">{item.description}</p>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="font-black text-xl text-reef-blue">{item.pricePerCm2}₽ <span className="text-sm font-medium text-slate-500">/ см²</span></div>
        <StatusBadge available={isAvailable} />
      </div>
    </div>
  );
}

function AccessoryCard({ item }: { item: any }) {
  const stockLevel = item.stock;
  let status = 'available';
  if (stockLevel === 0) status = 'out_of_stock';
  else if (stockLevel < 50) status = 'low_stock';

  return (
    <div className="bg-white rounded-[24px] p-5 anime-border border-slate-200 hover:border-reef-cyan transition-colors flex flex-col group hover:-translate-y-1 shadow-sm hover:shadow-md">
      <div className="w-full h-32 rounded-xl mb-4 bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden relative">
         {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} fill className="object-cover mix-blend-multiply" referrerPolicy="no-referrer" />
        ) : (
          <div className="text-4xl grayscale group-hover:grayscale-0 transition-all">🔗</div>
        )}
      </div>
      
      <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight">{item.name}</h3>
      
      <div className="mt-auto pt-4 flex items-center justify-between">
        <div className="font-bold text-reef-dark">{item.price}₽ <span className="text-sm font-normal text-slate-500">/ шт</span></div>
        <StockBadge status={status} stock={stockLevel} />
      </div>
    </div>
  );
}

function StatusBadge({ available }: { available: boolean }) {
  if (available) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 bg-[#e8f5e9] text-[#2e7d32] rounded-full text-xs font-bold uppercase tracking-wider border border-[#4caf50]/30">
        <CheckCircle2 size={14} /> В наличии
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold uppercase tracking-wider border border-red-200">
      <XCircle size={14} /> Под заказ
    </div>
  );
}

function StockBadge({ status, stock }: { status: string, stock: number }) {
  if (status === 'out_of_stock') {
    return (
      <div className="flex items-center gap-1 text-red-500 text-xs font-bold">
        <XCircle size={14} /> Нет в наличии
      </div>
    );
  }
  if (status === 'low_stock') {
    return (
      <div className="flex items-center gap-1 text-orange-500 text-xs font-bold" title={`Осталось: ${stock} шт.`}>
        <AlertCircle size={14} /> Мало ({stock})
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 text-[#2e7d32] text-xs font-bold" title={`В наличии: ${stock} шт.`}>
      <CheckCircle2 size={14} /> {stock > 100 ? 'Много' : stock}
    </div>
  );
}

// Утилита для подкраски плейсхолдеров
function getColorClass(name: string) {
  const l = name.toLowerCase();
  if (l.includes('прозрачный')) return 'bg-white/80 backdrop-blur-md';
  if (l.includes('белый')) return 'bg-white';
  if (l.includes('черный')) return 'bg-slate-900';
  if (l.includes('жемчужный')) return 'bg-gradient-to-tr from-pink-50 to-blue-50 opacity-90';
  if (l.includes('битое стекло')) return 'bg-[url("https://www.transparenttextures.com/patterns/cubes.png")] bg-cyan-100';
  if (l.includes('звездочки')) return 'bg-[url("https://www.transparenttextures.com/patterns/stardust.png")] bg-purple-100';
  return 'bg-reef-light';
}
