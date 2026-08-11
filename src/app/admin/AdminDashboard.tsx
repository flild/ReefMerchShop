'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Layers, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { updateOrderStatus, updateMaterialStock, updateAccessoryStock } from './actions';

type Order = {
  id: string;
  orderNumber: string;
  customer: string;
  date: string;
  status: string;
  total: number;
};

type StockItem = {
  id: string;
  type: 'material' | 'accessory';
  name: string;
  current: number;
  minimum: number;
};

export default function AdminDashboard({ 
  orders, 
  lowStockItems 
}: { 
  orders: Order[];
  lowStockItems: StockItem[];
}) {
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'individual' | 'collects'>('individual');

  const mockCollects = [
    { id: 'COL-001', name: 'Октябрьский акрил', deadline: '2023-10-15', authorsCount: 45, status: 'Сбор заявок' },
    { id: 'COL-002', name: 'Жемчуг (Спец)', deadline: '2023-10-18', authorsCount: 12, status: 'Ожидает макеты' },
    { id: 'COL-003', name: 'Ноябрьский сбор', deadline: '2023-11-20', authorsCount: 52, status: 'Сбор заявок' }
  ];

  const isDeadlineNear = (dateString: string) => {
    // Using a static date for demonstration of the burning deadline feature
    const mockCurrentDate = new Date('2023-10-14').getTime();
    const diff = new Date(dateString).getTime() - mockCurrentDate;
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days <= 4 && days >= 0;
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    await updateOrderStatus(orderId, newStatus);
    setUpdatingOrderId(null);
  };

  const handleStockUpdate = async (item: StockItem) => {
    const newStock = prompt(`Введите новый остаток для ${item.name}:`, item.current.toString());
    if (newStock !== null) {
      const parsedStock = parseInt(newStock, 10);
      if (!isNaN(parsedStock)) {
        if (item.type === 'material') {
          await updateMaterialStock(item.id, parsedStock);
        } else {
          await updateAccessoryStock(item.id, parsedStock);
        }
      }
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-24">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Управление</div>
            <nav className="space-y-1">
              <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-reef-blue text-white font-bold rounded-xl shadow-md shadow-reef-blue/20">
                <LayoutDashboard size={18} />
                Дашборд
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors">
                <ShoppingBag size={18} />
                Заказы
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors">
                <Layers size={18} />
                Материалы
              </Link>
              <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors">
                <Users size={18} />
                Пользователи
              </Link>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-display font-black text-slate-800">Обзор</h1>
            <div className="text-sm font-medium text-slate-500">Последнее обновление: только что</div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={24} />
                </div>
                <div className="flex items-center gap-1 text-green-500 text-sm font-bold bg-green-50 px-2 py-1 rounded-lg">
                  <TrendingUp size={14} /> +12%
                </div>
              </div>
              <div className="text-slate-500 text-sm font-medium mb-1">Новых заказов</div>
              <div className="text-3xl font-black text-slate-800">{orders.filter(o => o.status === 'new').length}</div>
            </div>
            
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                  <span className="font-black text-xl">₽</span>
                </div>
                <div className="flex items-center gap-1 text-green-500 text-sm font-bold bg-green-50 px-2 py-1 rounded-lg">
                  <TrendingUp size={14} /> +8%
                </div>
              </div>
              <div className="text-slate-500 text-sm font-medium mb-1">Выручка (Сумма)</div>
              <div className="text-3xl font-black text-slate-800">{orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()} ₽</div>
            </div>
            
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-5 transition-opacity" />
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                  <AlertCircle size={24} />
                </div>
              </div>
              <div className="text-slate-500 text-sm font-medium mb-1">Заканчивается на складе</div>
              <div className="text-3xl font-black text-slate-800">{lowStockItems.length} <span className="text-lg font-medium text-slate-500">поз.</span></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Orders/Collects List */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                  <button 
                    onClick={() => setActiveTab('individual')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${activeTab === 'individual' ? 'bg-white text-reef-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Индивидуальные заказы
                  </button>
                  <button 
                    onClick={() => setActiveTab('collects')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${activeTab === 'collects' ? 'bg-white text-reef-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Коллекты
                  </button>
                </div>
                <Link href="#" className="text-sm font-bold text-reef-blue hover:text-reef-dark">Все записи</Link>
              </div>
              
              <div className="overflow-x-auto">
                {activeTab === 'individual' ? (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                        <th className="p-4 font-bold">Номер</th>
                        <th className="p-4 font-bold">Клиент</th>
                        <th className="p-4 font-bold">Статус</th>
                        <th className="p-4 font-bold text-right">Сумма</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-bold text-slate-800">{order.orderNumber}</td>
                          <td className="p-4">
                            <div className="text-sm text-slate-600">{order.customer}</div>
                            <div className="text-xs text-slate-400">{order.date}</div>
                          </td>
                          <td className="p-4">
                            <select
                              value={order.status}
                              disabled={updatingOrderId === order.id}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 cursor-pointer transition-colors outline-none focus:border-reef-blue ${
                                order.status === 'new' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                order.status === 'proofing' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                order.status === 'production' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                order.status === 'shipping' ? 'bg-green-50 text-green-700 border-green-100' :
                                order.status === 'completed' ? 'bg-slate-100 text-slate-700 border-slate-200' : ''
                              } disabled:opacity-50`}
                            >
                              <option value="new">Новый</option>
                              <option value="proofing">Ожидает макет</option>
                              <option value="production">В производстве</option>
                              <option value="shipping">Доставка</option>
                              <option value="completed">Завершен</option>
                            </select>
                          </td>
                          <td className="p-4 font-bold text-slate-800 text-right">{order.total} ₽</td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-400 font-medium">Нет активных заказов</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                        <th className="p-4 font-bold">Коллект</th>
                        <th className="p-4 font-bold">Дедлайн</th>
                        <th className="p-4 font-bold">Участников</th>
                        <th className="p-4 font-bold">Статус</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {mockCollects.map(collect => (
                        <tr key={collect.id} className={`transition-colors ${isDeadlineNear(collect.deadline) ? 'bg-red-50/50 hover:bg-red-50' : 'hover:bg-slate-50/50'}`}>
                          <td className="p-4 font-bold text-slate-800">
                            {collect.name}
                            {isDeadlineNear(collect.deadline) && (
                              <span className="ml-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-black text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                                <AlertCircle size={10} /> Горит
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className={`text-sm font-bold ${isDeadlineNear(collect.deadline) ? 'text-red-600' : 'text-slate-600'}`}>
                              {collect.deadline}
                            </div>
                          </td>
                          <td className="p-4 font-medium text-slate-600">{collect.authorsCount} авт.</td>
                          <td className="p-4">
                            <span className="px-3 py-1.5 rounded-xl text-xs font-bold border-2 bg-slate-50 text-slate-700 border-slate-200">
                              {collect.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            
            {/* Low Stock Alerts */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <AlertCircle size={20} className="text-red-500" />
                  Заканчивается
                </h2>
              </div>
              
              <div className="p-2 flex-1 overflow-y-auto max-h-96">
                {lowStockItems.map(item => (
                  <div key={item.id} className="p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer" onClick={() => handleStockUpdate(item)}>
                    <div className="font-bold text-slate-800 mb-2">{item.name}</div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-red-500 font-bold">Остаток: {item.current}</span>
                      <span className="text-slate-400">Мин: {item.minimum}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="bg-red-500 h-full rounded-full"
                        style={{ width: `${Math.min((item.current / item.minimum) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
                {lowStockItems.length === 0 && (
                  <div className="p-8 text-center text-slate-400 font-medium">Все материалы в достатке</div>
                )}
              </div>
              
              <div className="p-4 border-t border-slate-100 text-xs text-center text-slate-400">
                Нажмите на карточку, чтобы обновить остаток
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
