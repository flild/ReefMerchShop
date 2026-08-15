export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Позже здесь будут серверные запросы статистики к БД
  
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-display font-extrabold mb-2">Обзорная сводка</h1>
        <p className="text-theme-muted font-bold text-lg">
          Добро пожаловать в панель управления. Пора навести здесь суету.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Пример карточек статистики */}
        {[
          { label: 'Новых заказов', value: '12' },
          { label: 'Требуют внимания', value: '3', alert: true },
          { label: 'Заканчивается акрил', value: '2', alert: true },
          { label: 'Выручка за месяц', value: '142 500 ₽' },
        ].map((stat, i) => (
          <div 
            key={i} 
            className="bg-theme-surface anime-border anime-shadow rounded-[32px] p-6 flex flex-col justify-between h-40"
          >
            <span className="text-theme-muted font-bold">{stat.label}</span>
            <span className={`text-5xl font-display font-extrabold ${stat.alert ? 'text-theme-highlight' : 'text-theme-text'}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        <div className="lg:col-span-2 bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 min-h-[400px]">
          <h2 className="text-2xl font-display font-extrabold mb-6">Последние заказы</h2>
          <div className="flex items-center justify-center h-full pb-12 text-theme-muted font-bold">
            Здесь будет таблица последних заказов
          </div>
        </div>
        <div className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 min-h-[400px]">
          <h2 className="text-2xl font-display font-extrabold mb-6">Складские алерты</h2>
          <div className="flex items-center justify-center h-full pb-12 text-theme-muted font-bold">
            Здесь будет список пустых позиций
          </div>
        </div>
      </div>
    </div>
  );
}