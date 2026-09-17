'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface OrderTimelineData {
  date: string;
  count: number;
  revenue: number;
}

interface OrderStatusData {
  status: string;
  label: string;
  count: number;
  color: string;
}

interface DashboardChartsProps {
  timelineData: OrderTimelineData[];
  statusData: OrderStatusData[];
}

const CustomTimelineTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-theme-surface border-2 border-theme-border p-3 rounded-xl shadow-lg">
        <p className="font-extrabold text-theme-text mb-2">{label}</p>
        <p className="font-bold text-sm text-[#3B82F6]">
          Заказов: {payload[0].payload.count}
        </p>
        <p className="font-bold text-sm text-theme-muted">
          Выручка: {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(payload[0].payload.revenue)}
        </p>
      </div>
    );
  }
  return null;
};

export function DashboardCharts({ timelineData, statusData }: DashboardChartsProps) {
  // Sort timeline data by date just in case
  const sortedTimeline = useMemo(() => {
    return [...timelineData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [timelineData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Timeline Chart */}
      <div className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8">
        <h3 className="text-xl font-display font-extrabold mb-6 text-theme-text">Динамика заказов (30 дней)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12, fontWeight: 'bold' }}
                tickFormatter={(val) => {
                  const date = new Date(val);
                  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                }}
              />
              <YAxis
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12, fontWeight: 'bold' }}
              />
              <Tooltip content={<CustomTimelineTooltip />} />
              <Bar yAxisId="left" dataKey="count" name="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Chart */}
      <div className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8">
        <h3 className="text-xl font-display font-extrabold mb-6 text-theme-text">Распределение по статусам</h3>
        <div className="h-[300px] w-full flex items-center justify-center">
          {statusData.reduce((acc, curr) => acc + curr.count, 0) > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '2px solid var(--theme-border)',
                    backgroundColor: 'var(--theme-surface)',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontWeight: 'bold',
                    color: 'var(--theme-text)'
                  }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ fontSize: '14px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-theme-muted font-bold">Нет активных заказов</p>
          )}
        </div>
      </div>
    </div>
  );
}
