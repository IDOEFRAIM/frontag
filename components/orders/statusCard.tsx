// @/components/orders/StatusBadge.tsx
import { OrderStatus } from '@/types/order';

export const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const configs = {
    pending: "bg-amber-100 text-amber-600 border-amber-200",
    confirmed: "bg-green-100 text-green-600 border-green-200",
    delivering: "bg-blue-100 text-blue-600 border-blue-200",
    delivered: "bg-slate-100 text-slate-600 border-slate-200",
    cancelled: "bg-red-100 text-red-600 border-red-200",
  };

  const labels = {
    pending: "Attente", confirmed: "Validé", delivering: "En Route",
    delivered: "Livré", cancelled: "Annulé"
  };

  return (
    <span className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-tighter ${configs[status]}`}>
      {labels[status]}
    </span>
  );
};