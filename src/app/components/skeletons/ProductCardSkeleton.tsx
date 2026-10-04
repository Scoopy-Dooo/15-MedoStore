import { Skeleton } from '../ui/skeleton';
import { useApp } from '../../context/AppContext';

export function ProductCardSkeleton() {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <div
      className={`bg-gradient-to-br backdrop-blur-xl border rounded-2xl p-6 h-full ${
        isDark
          ? 'from-white/5 to-white/[0.02] border-purple-500/20'
          : 'from-white/80 to-white/60 border-purple-200'
      }`}
    >
      <div className="space-y-4">
        {/* Game Name Skeleton */}
        <Skeleton className="h-4 w-24" />

        {/* Amount Skeleton */}
        <Skeleton className="h-8 w-32" />

        {/* Price Skeleton */}
        <Skeleton className="h-10 w-40" />

        {/* Button Skeleton */}
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  );
}
