import { formatCOP } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";

export function FreeShippingBar({ total }: { total: number }) {
  const remaining = FREE_SHIPPING_THRESHOLD - total;
  const unlocked = remaining <= 0;
  const progress = Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="px-6 py-4">
      <p className="text-center text-xs text-muted">
        {unlocked ? (
          <span className="font-medium text-gold-soft">
            ¡Desbloqueaste envío gratis! 🎉
          </span>
        ) : (
          <>
            Te faltan{" "}
            <span className="font-medium text-gold-soft">{formatCOP(remaining)}</span>{" "}
            para envío gratis
          </>
        )}
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gold transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
