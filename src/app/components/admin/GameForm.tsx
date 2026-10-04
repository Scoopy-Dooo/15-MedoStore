/**
 * Game Form Component
 * نموذج إنشاء/تعديل لعبة
 * 
 * Features:
 * - Create and edit games
 * - Form validation with zod
 * - Bilingual labels and validation messages
 * - Image upload integration
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { ImageUpload } from './ImageUpload';
import { useUploadImage } from '../../hooks/useUploadImage';
import { toast } from 'sonner';
import type { Game } from '../../../services/types';

// Validation schema
const gameSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  nameAr: z.string().min(2, 'Arabic name must be at least 2 characters'),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  image: z.string().url('Must be a valid URL').min(1, 'Image is required'),
  category: z.string().min(1, 'Category is required'),
});

type GameFormValues = z.infer<typeof gameSchema>;

interface GameFormProps {
  game?: Game;
  onSubmit: (data: GameFormValues) => void;
  isLoading?: boolean;
}

const categories = [
  'Battle Royale',
  'MOBA',
  'Social',
  'Streaming',
  'Subscription',
  'Other',
];

/**
 * GameForm Component
 */
export function GameForm({ game, onSubmit, isLoading }: GameFormProps) {
  const { language } = useApp();
  const { mutateAsync: uploadImage, uploadProgress } = useUploadImage();

  const form = useForm<GameFormValues>({
    resolver: zodResolver(gameSchema),
    defaultValues: {
      name: game?.name || '',
      nameAr: game?.nameAr || '',
      description: game?.description || '',
      descriptionAr: game?.descriptionAr || '',
      image: game?.image || '',
      category: game?.category || '',
    },
  });

  /**
   * Handle image upload
   */
  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const result = await uploadImage({ file });
      return result.url;
    } catch (error) {
      toast.error(
        language === 'ar'
          ? 'فشل رفع الصورة'
          : 'Failed to upload image'
      );
      throw error;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name (EN) */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {language === 'ar' ? 'الاسم (بالإنجليزية)' : 'Name (English)'}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    language === 'ar' ? 'أدخل اسم اللعبة' : 'Enter game name'
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Name (AR) */}
        <FormField
          control={form.control}
          name="nameAr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {language === 'ar' ? 'الاسم (بالعربية)' : 'Name (Arabic)'}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    language === 'ar' ? 'أدخل اسم اللعبة بالعربية' : 'Enter game name in Arabic'
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description (EN) */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {language === 'ar' ? 'الوصف (بالإنجليزية)' : 'Description (English)'}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    language === 'ar' ? 'أدخل الوصف (اختياري)' : 'Enter description (optional)'
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description (AR) */}
        <FormField
          control={form.control}
          name="descriptionAr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {language === 'ar' ? 'الوصف (بالعربية)' : 'Description (Arabic)'}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={
                    language === 'ar' ? 'أدخل الوصف بالعربية (اختياري)' : 'Enter description in Arabic (optional)'
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {language === 'ar' ? 'صورة اللعبة' : 'Game Image'}
              </FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  onRemove={() => field.onChange('')}
                  onUpload={handleImageUpload}
                  uploadProgress={uploadProgress}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {language === 'ar' ? 'الفئة' : 'Category'}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={language === 'ar' ? 'اختر الفئة' : 'Select category'}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Loader2 className={`h-4 w-4 animate-spin ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
            )}
            {isLoading
              ? language === 'ar'
                ? 'جاري الحفظ...'
                : 'Saving...'
              : language === 'ar'
              ? 'حفظ'
              : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
