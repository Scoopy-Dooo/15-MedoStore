/**
 * Package Form Component
 * نموذج الباقة
 * 
 * Features:
 * - Create and edit packages
 * - Form validation with zod
 * - Game selection dropdown
 * - Price, amount, stock inputs
 * - isPopular checkbox
 * - Bilingual support
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '../../context/AppContext';
import { useGames } from '../../hooks/useGames';
import type { Package } from '../../../services/types';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Loader2 } from 'lucide-react';

// Validation schema
const packageSchema = z.object({
  gameId: z.string().min(1, 'Game is required'),
  amount: z.string().min(1, 'Amount is required'),
  price: z.number().positive('Price must be greater than 0'),
  oldPrice: z.number().optional().nullable(),
  isPopular: z.boolean().default(false),
  stock: z.number().int().min(0, 'Stock cannot be negative').optional().nullable(),
}).refine((data) => {
  // If oldPrice is provided, it must be greater than price
  if (data.oldPrice && data.oldPrice <= data.price) {
    return false;
  }
  return true;
}, {
  message: 'Old price must be greater than current price',
  path: ['oldPrice'],
});

type PackageFormData = z.infer<typeof packageSchema>;

interface PackageFormProps {
  package?: Package;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function PackageForm({ package: pkg, onSubmit, isLoading }: PackageFormProps) {
  const { language } = useApp();
  const isRTL = language === 'ar';

  // Fetch games for dropdown
  const { data: gamesResponse } = useGames({ limit: 100 });
  const games = gamesResponse?.games || [];

  // Form setup
  const form = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      gameId: pkg?.gameId || '',
      amount: pkg?.amount || '',
      price: pkg?.price || 0,
      oldPrice: pkg?.oldPrice || null,
      isPopular: pkg?.isPopular || false,
      stock: pkg?.stock ?? null,
    },
  });

  const handleSubmit = (data: PackageFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Game Selection */}
        <FormField
          control={form.control}
          name="gameId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {language === 'ar' ? 'اللعبة' : 'Game'} <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={language === 'ar' ? 'اختر اللعبة' : 'Select game'}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {games.map((game) => (
                    <SelectItem key={game.id} value={game.id}>
                      {language === 'ar' ? game.nameAr : game.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                {language === 'ar'
                  ? 'اختر اللعبة التي تنتمي إليها هذه الباقة'
                  : 'Select the game this package belongs to'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {language === 'ar' ? 'الكمية' : 'Amount'} <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={language === 'ar' ? 'مثال: 60 UC' : 'e.g., 60 UC'}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {language === 'ar'
                  ? 'الكمية أو المحتوى الذي يحصل عليه المشتري'
                  : 'The amount or content the buyer receives'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {language === 'ar' ? 'السعر (جنيه)' : 'Price (SDG)'}{' '}
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>
                {language === 'ar' ? 'السعر الحالي بالجنيه السوداني' : 'Current price in SDG'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Old Price (Optional) */}
        <FormField
          control={form.control}
          name="oldPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{language === 'ar' ? 'السعر القديم (اختياري)' : 'Old Price (Optional)'}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) =>
                    field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                  }
                />
              </FormControl>
              <FormDescription>
                {language === 'ar'
                  ? 'السعر القديم لعرض الخصم (يجب أن يكون أعلى من السعر الحالي)'
                  : 'Old price to show discount (must be higher than current price)'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Stock (Optional) */}
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{language === 'ar' ? 'المخزون (اختياري)' : 'Stock (Optional)'}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  placeholder={language === 'ar' ? 'اترك فارغاً لمخزون غير محدود' : 'Leave empty for unlimited'}
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) =>
                    field.onChange(e.target.value ? parseInt(e.target.value, 10) : null)
                  }
                />
              </FormControl>
              <FormDescription>
                {language === 'ar'
                  ? 'عدد الوحدات المتاحة (اترك فارغاً للمخزون غير المحدود)'
                  : 'Number of units available (leave empty for unlimited stock)'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Is Popular */}
        <FormField
          control={form.control}
          name="isPopular"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{language === 'ar' ? 'باقة مميزة' : 'Popular Package'}</FormLabel>
                <FormDescription>
                  {language === 'ar'
                    ? 'ضع علامة على هذه الباقة كمميزة لإظهارها في الصفحة الرئيسية'
                    : 'Mark this package as popular to feature it on the homepage'}
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className={`h-4 w-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />}
            {pkg
              ? language === 'ar'
                ? 'تحديث'
                : 'Update'
              : language === 'ar'
              ? 'إنشاء'
              : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
