/**
 * DateRangeFilter Component
 * مكوّن فلتر نطاق التاريخ للإحصائيات
 *
 * Features:
 * - Preset options: Today, Last 7 Days, Last 30 Days, Custom Range
 * - Custom date range via shadcn/ui Calendar + Popover
 * - Bilingual support (Arabic / English)
 * - Emits ISO strings on change, undefined to clear
 */

import { useState } from 'react';
import { CalendarIcon, X } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { useApp } from '../../context/AppContext';
import type { DateRange, DateRangePreset } from '../../../services/types';

interface DateRangeFilterProps {
  /** استدعاء عند تغيير نطاق التاريخ - يُرجع ISO strings أو undefined لمسح الفلتر */
  onChange: (dateFrom?: string, dateTo?: string) => void;
}

/** الترجمات الداخلية للمكوّن */
const labels = {
  ar: {
    title: 'نطاق التاريخ',
    today: 'اليوم',
    last7: 'آخر 7 أيام',
    last30: 'آخر 30 يوماً',
    custom: 'نطاق مخصص',
    apply: 'تطبيق',
    clear: 'مسح',
    active: 'فلتر التاريخ نشط',
  },
  en: {
    title: 'Date Range',
    today: 'Today',
    last7: 'Last 7 Days',
    last30: 'Last 30 Days',
    custom: 'Custom Range',
    apply: 'Apply',
    clear: 'Clear',
    active: 'Date filter active',
  },
} as const;

export function DateRangeFilter({ onChange }: DateRangeFilterProps) {
  const { language } = useApp();
  const t = labels[language];

  const [activePreset, setActivePreset] = useState<DateRangePreset | null>(null);
  const [customRange, setCustomRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  /** تطبيق preset محدد وإرسال نطاق التاريخ للـ parent */
  const applyPreset = (preset: Exclude<DateRangePreset, 'custom'>) => {
    const now = new Date();
    let from: Date;
    let to: Date;

    switch (preset) {
      case 'today':
        from = startOfDay(now);
        to = endOfDay(now);
        break;
      case 'last7days':
        from = startOfDay(subDays(now, 6));
        to = endOfDay(now);
        break;
      case 'last30days':
        from = startOfDay(subDays(now, 29));
        to = endOfDay(now);
        break;
    }

    setActivePreset(preset);
    setCustomRange({ from: undefined, to: undefined });
    onChange(from.toISOString(), to.toISOString());
  };

  /** تطبيق النطاق المخصص من الـ Calendar */
  const applyCustomRange = () => {
    if (!customRange.from || !customRange.to) return;

    setActivePreset('custom');
    setIsCalendarOpen(false);
    onChange(
      startOfDay(customRange.from).toISOString(),
      endOfDay(customRange.to).toISOString()
    );
  };

  /** مسح جميع الفلاتر */
  const clearFilter = () => {
    setActivePreset(null);
    setCustomRange({ from: undefined, to: undefined });
    onChange(undefined, undefined);
  };

  const presets: { key: Exclude<DateRangePreset, 'custom'>; label: string }[] = [
    { key: 'today', label: t.today },
    { key: 'last7days', label: t.last7 },
    { key: 'last30days', label: t.last30 },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* أزرار الـ Presets */}
      {presets.map(({ key, label }) => (
        <Button
          key={key}
          variant={activePreset === key ? 'default' : 'outline'}
          size="sm"
          onClick={() => applyPreset(key)}
        >
          {label}
        </Button>
      ))}

      {/* زر النطاق المخصص مع Popover للـ Calendar */}
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={activePreset === 'custom' ? 'default' : 'outline'}
            size="sm"
            className="gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            {activePreset === 'custom' && customRange.from && customRange.to
              ? `${format(customRange.from, 'dd/MM/yyyy')} – ${format(customRange.to, 'dd/MM/yyyy')}`
              : t.custom}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 space-y-3" align="start">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.title}
          </p>

          {/* تقويم اختيار النطاق */}
          <Calendar
            mode="range"
            selected={{ from: customRange.from, to: customRange.to }}
            onSelect={(range) =>
              setCustomRange({ from: range?.from, to: range?.to })
            }
            numberOfMonths={2}
            disabled={{ after: new Date() }}
          />

          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setCustomRange({ from: undefined, to: undefined });
                setIsCalendarOpen(false);
              }}
            >
              {t.clear}
            </Button>
            <Button
              size="sm"
              disabled={!customRange.from || !customRange.to}
              onClick={applyCustomRange}
            >
              {t.apply}
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* شارة الفلتر النشط مع زر المسح */}
      {activePreset && (
        <Badge variant="secondary" className="gap-1">
          {t.active}
          <button
            onClick={clearFilter}
            className="hover:text-destructive transition-colors"
            aria-label={t.clear}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}
    </div>
  );
}
