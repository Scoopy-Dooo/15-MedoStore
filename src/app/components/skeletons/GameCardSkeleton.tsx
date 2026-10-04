import { Skeleton } from '../ui/skeleton';
import { useApp } from '../../context/AppContext';

export function GameCardSkeleton() {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <div
      className={`bg-gradient-to-br backdrop-blur-xl border rounded-3xl overflow-hidden ${
        isDark
          ? 'from-white/5 to-white/[0.02] border-purple-500/20'
          : 'from-white/80 to-white/60 border-purple-200'
      }`}
    >
      {/* Image Skeleton */}
      <Skeleton className="h-64 w-full rounded-none" />

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
      </div>
    </div>
  );
}
