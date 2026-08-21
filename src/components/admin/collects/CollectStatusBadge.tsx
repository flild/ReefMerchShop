// src/components/admin/collects/CollectStatusBadge.tsx
interface Props {
  status: string;
}

export function CollectStatusBadge({ status }: Props) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    open: { label: 'Набор открыт', className: 'bg-theme-green-bg text-theme-green-text border-theme-green-text' },
    review: { label: 'На проверке', className: 'bg-theme-yellow-bg text-theme-yellow-text border-theme-yellow-text' },
    in_progress: { label: 'В работе', className: 'bg-theme-accent text-theme-text border-transparent' },
    completed: { label: 'Сдан', className: 'bg-theme-gray-bg text-theme-gray-text border-theme-gray-text' },
  };

  const config = statusConfig[status] || statusConfig.open;

  return (
    <div className={`px-3 py-1 rounded-[12px] font-extrabold text-xs border-2 uppercase tracking-wide inline-flex items-center justify-center whitespace-nowrap ${config.className}`}>
      {config.label}
    </div>
  );
}