/**
 * Games Management Page
 * صفحة إدارة الألعاب
 * 
 * Features:
 * - Games table with all CRUD operations
 * - Search and filtering (category, status)
 * - Sorting and pagination
 * - Create, Edit, Delete, Toggle active status
 * - Bilingual support
 */

import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, X, Edit, Trash2, AlertCircle, Loader2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { GameForm } from '../../components/admin/GameForm';
import { useApp } from '../../context/AppContext';
import { useGames } from '../../hooks/useGames';
import { useCreateGame } from '../../hooks/useCreateGame';
import { useUpdateGame } from '../../hooks/useUpdateGame';
import { useDeleteGame } from '../../hooks/useDeleteGame';
import type { Game } from '../../../services/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Switch } from '../../components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * SortableGameRow - صف لعبة قابل للسحب والإفلات
 * Wraps a game table row with @dnd-kit sortable functionality
 */
interface SortableGameRowProps {
  game: Game;
  language: 'ar' | 'en';
  isRTL: boolean;
  updateIsPending: boolean;
  onEdit: (game: Game) => void;
  onDelete: (game: Game) => void;
  onToggleActive: (game: Game) => void;
}

function SortableGameRow({
  game,
  language,
  isRTL,
  updateIsPending,
  onEdit,
  onDelete,
  onToggleActive,
}: SortableGameRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: game.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      {/* مقبض السحب */}
      <TableCell className="w-8">
        <button
          {...attributes}
          {...listeners}
          className="p-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 touch-none"
          aria-label={language === 'ar' ? 'اسحب لإعادة الترتيب' : 'Drag to reorder'}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>
      <TableCell>
        <img
          src={game.image}
          alt={game.name}
          className="h-12 w-12 rounded object-cover"
          loading="lazy"
          decoding="async"
        />
      </TableCell>
      <TableCell className="font-medium">{game.name}</TableCell>
      <TableCell>{game.nameAr}</TableCell>
      <TableCell>
        <Badge variant="outline">{game.category}</Badge>
      </TableCell>
      <TableCell>{game._count?.packages || 0}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Switch
            checked={game.isActive}
            onCheckedChange={() => onToggleActive(game)}
            disabled={updateIsPending}
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {game.isActive
              ? language === 'ar' ? 'نشط' : 'Active'
              : language === 'ar' ? 'غير نشط' : 'Inactive'}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(game)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(game)}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

/**
 * GamesManagement Component
 */
export default function GamesManagement() {
  const { language } = useApp();
  const isRTL = language === 'ar';

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [deletingGame, setDeletingGame] = useState<Game | null>(null);

  // Debounce search
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch games
  const { data: response, isLoading, isError, refetch } = useGames({
    page,
    limit: pageSize,
    search: debouncedSearch || undefined,
    category: categoryFilter && categoryFilter !== '__all__' ? categoryFilter : undefined,
    isActive: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
  });

  const games = response?.games || [];
  const pagination = response?.pagination;

  // Local ordered list for optimistic DnD reordering
  const [orderedGames, setOrderedGames] = useState<Game[]>([]);

  // Sync orderedGames whenever API data changes
  useEffect(() => {
    setOrderedGames(games);
  }, [games]);

  // DnD sensors: pointer (mouse/touch) + keyboard accessibility
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  /**
   * Handle drag end: update local order optimistically then persist to backend
   * معالجة نهاية السحب: تحديث الترتيب محلياً ثم حفظه في الـ backend
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setOrderedGames((prev) => {
      const oldIndex = prev.findIndex((g) => g.id === active.id);
      const newIndex = prev.findIndex((g) => g.id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);

      // Persist new sortOrder for the moved game only
      updateGameMutation.mutate(
        { gameId: String(active.id), data: { sortOrder: newIndex } },
        {
          onError: () => {
            // Revert to original order on error
            setOrderedGames(games);
            toast.error(
              language === 'ar' ? 'فشل تحديث الترتيب' : 'Failed to update order'
            );
          },
        }
      );

      return reordered;
    });
  };

  // Mutations
  const createGameMutation = useCreateGame({
    onSuccess: () => {
      toast.success(language === 'ar' ? 'تم إنشاء اللعبة بنجاح' : 'Game created successfully');
      setIsCreateDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || (language === 'ar' ? 'فشل إنشاء اللعبة' : 'Failed to create game'));
    },
  });

  const updateGameMutation = useUpdateGame({
    onSuccess: () => {
      toast.success(language === 'ar' ? 'تم تحديث اللعبة بنجاح' : 'Game updated successfully');
      setEditingGame(null);
    },
    onError: (error) => {
      toast.error(error.message || (language === 'ar' ? 'فشل تحديث اللعبة' : 'Failed to update game'));
    },
  });

  const deleteGameMutation = useDeleteGame({
    onSuccess: () => {
      toast.success(language === 'ar' ? 'تم حذف اللعبة بنجاح' : 'Game deleted successfully');
      setDeletingGame(null);
    },
    onError: (error) => {
      toast.error(error.message || (language === 'ar' ? 'فشل حذف اللعبة' : 'Failed to delete game'));
    },
  });

  // Categories for filter
  const categories = useMemo(() => {
    const cats = games.map((g) => g.category);
    return Array.from(new Set(cats));
  }, [games]);

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setStatusFilter('');
    setPage(1);
  };

  const hasActiveFilters = searchQuery || categoryFilter || statusFilter;

  // Handlers
  const handleCreateGame = (data: any) => {
    createGameMutation.mutate(data);
  };

  const handleEditGame = (data: any) => {
    if (!editingGame) return;
    updateGameMutation.mutate({
      gameId: editingGame.id,
      data,
    });
  };

  const handleDeleteGame = () => {
    if (!deletingGame) return;
    deleteGameMutation.mutate(deletingGame.id);
  };

  const handleToggleActive = (game: Game) => {
    updateGameMutation.mutate({
      gameId: game.id,
      data: { isActive: !game.isActive },
    });
  };

  return (
    <AdminLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {language === 'ar' ? 'إدارة الألعاب' : 'Games Management'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {language === 'ar'
                ? 'إدارة الألعاب المتاحة في المتجر'
                : 'Manage available games in the store'}
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {language === 'ar' ? 'إضافة لعبة' : 'Add Game'}
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500`} />
              <Input
                placeholder={language === 'ar' ? 'البحث بالاسم...' : 'Search by name...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={isRTL ? 'pr-10' : 'pl-10'}
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue
                  placeholder={language === 'ar' ? 'جميع الفئات' : 'All Categories'}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">
                  {language === 'ar' ? 'جميع الفئات' : 'All Categories'}
                </SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'جميع الحالات' : 'All Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">
                  {language === 'ar' ? 'جميع الحالات' : 'All Status'}
                </SelectItem>
                <SelectItem value="active">
                  {language === 'ar' ? 'نشط' : 'Active'}
                </SelectItem>
                <SelectItem value="inactive">
                  {language === 'ar' ? 'غير نشط' : 'Inactive'}
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Page Size */}
            <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 {language === 'ar' ? 'عناصر' : 'items'}</SelectItem>
                <SelectItem value="20">20 {language === 'ar' ? 'عناصر' : 'items'}</SelectItem>
                <SelectItem value="50">50 {language === 'ar' ? 'عناصر' : 'items'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'الفلاتر النشطة:' : 'Active Filters:'}
              </span>
              {searchQuery && (
                <Badge variant="secondary">
                  {language === 'ar' ? 'بحث:' : 'Search:'} {searchQuery}
                </Badge>
              )}
              {categoryFilter && (
                <Badge variant="secondary">
                  {language === 'ar' ? 'الفئة:' : 'Category:'} {categoryFilter}
                </Badge>
              )}
              {statusFilter && (
                <Badge variant="secondary">
                  {language === 'ar' ? 'الحالة:' : 'Status:'}{' '}
                  {statusFilter === 'active'
                    ? language === 'ar'
                      ? 'نشط'
                      : 'Active'
                    : language === 'ar'
                    ? 'غير نشط'
                    : 'Inactive'}
                </Badge>
              )}
              <Button onClick={clearFilters} variant="ghost" size="sm">
                <X className={`h-3 w-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                {language === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
              </Button>
            </div>
          )}
        </div>

        {/* Error State */}
        {isError && !isLoading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                {language === 'ar'
                  ? 'فشل تحميل الألعاب'
                  : 'Failed to load games'}
              </span>
              <Button onClick={() => refetch()} variant="outline" size="sm">
                {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  {/* عمود مقبض السحب */}
                  <TableHead className="w-8" />
                  <TableHead className="w-20">
                    {language === 'ar' ? 'الصورة' : 'Image'}
                  </TableHead>
                  <TableHead>{language === 'ar' ? 'الاسم (EN)' : 'Name (EN)'}</TableHead>
                  <TableHead>{language === 'ar' ? 'الاسم (AR)' : 'Name (AR)'}</TableHead>
                  <TableHead>{language === 'ar' ? 'الفئة' : 'Category'}</TableHead>
                  <TableHead>{language === 'ar' ? 'الباقات' : 'Packages'}</TableHead>
                  <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                  <TableHead className="text-right">
                    {language === 'ar' ? 'الإجراءات' : 'Actions'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading Skeletons
                  [...Array(pageSize)].map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                      <TableCell><Skeleton className="h-12 w-12 rounded" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : orderedGames.length === 0 ? (
                  // Empty State
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">
                        {language === 'ar' ? 'لا توجد ألعاب' : 'No games found'}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  // Sortable Games Rows with DnD
                  <SortableContext
                    items={orderedGames.map((g) => g.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {orderedGames.map((game) => (
                      <SortableGameRow
                        key={game.id}
                        game={game}
                        language={language}
                        isRTL={isRTL}
                        updateIsPending={updateGameMutation.isPending}
                        onEdit={setEditingGame}
                        onDelete={setDeletingGame}
                        onToggleActive={handleToggleActive}
                      />
                    ))}
                  </SortableContext>
                )}
              </TableBody>
            </Table>
          </DndContext>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ar'
                  ? `عرض ${orderedGames.length} من ${pagination.total} نتيجة`
                  : `Showing ${orderedGames.length} of ${pagination.total} results`}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="outline"
                  size="sm"
                >
                  {language === 'ar' ? 'السابق' : 'Previous'}
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'ar'
                    ? `صفحة ${page} من ${pagination.totalPages}`
                    : `Page ${page} of ${pagination.totalPages}`}
                </span>
                <Button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= pagination.totalPages}
                  variant="outline"
                  size="sm">
                  {language === 'ar' ? 'التالي' : 'Next'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Create Game Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => !createGameMutation.isPending && setIsCreateDialogOpen(open)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {language === 'ar' ? 'إضافة لعبة جديدة' : 'Add New Game'}
              </DialogTitle>
              <DialogDescription>
                {language === 'ar'
                  ? 'أدخل تفاصيل اللعبة الجديدة'
                  : 'Enter the details for the new game'}
              </DialogDescription>
            </DialogHeader>
            <GameForm
              onSubmit={handleCreateGame}
              isLoading={createGameMutation.isPending}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Game Dialog */}
        <Dialog open={!!editingGame} onOpenChange={(open) => !updateGameMutation.isPending && !open && setEditingGame(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {language === 'ar' ? 'تعديل اللعبة' : 'Edit Game'}
              </DialogTitle>
              <DialogDescription>
                {language === 'ar'
                  ? 'قم بتعديل تفاصيل اللعبة'
                  : 'Update the game details'}
              </DialogDescription>
            </DialogHeader>
            {editingGame && (
              <GameForm
                game={editingGame}
                onSubmit={handleEditGame}
                isLoading={updateGameMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Game Confirmation */}
        <AlertDialog open={!!deletingGame} onOpenChange={(open) => !open && setDeletingGame(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {language === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {language === 'ar' ? (
                  <>
                    هل أنت متأكد من حذف اللعبة <strong>{deletingGame?.nameAr}</strong>؟
                    <br />
                    لا يمكن التراجع عن هذا الإجراء.
                  </>
                ) : (
                  <>
                    Are you sure you want to delete <strong>{deletingGame?.name}</strong>?
                    <br />
                    This action cannot be undone.
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteGameMutation.isPending}>
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteGame}
                disabled={deleteGameMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteGameMutation.isPending && (
                  <Loader2 className={`h-4 w-4 animate-spin ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                )}
                {deleteGameMutation.isPending
                  ? language === 'ar'
                    ? 'جاري الحذف...'
                    : 'Deleting...'
                  : language === 'ar'
                  ? 'حذف'
                  : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
