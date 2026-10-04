/**
 * Packages Management Page - COMPLETE
 * صفحة إدارة الباقات - نسخة كاملة
 * 
 * Features:
 * - Full CRUD operations
 * - Filtering by game, price range, status
 * - Sorting by price, amount, created date
 * - Toggle active status and update stock
 * - Bilingual support
 */

import { useState } from 'react';
import { Plus, X, Edit, Trash2, AlertCircle, Package as PackageIcon, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { PackageForm } from '../../components/admin/PackageForm';
import { useApp } from '../../context/AppContext';
import { usePackages } from '../../hooks/usePackages';
import { useGames } from '../../hooks/useGames';
import { useCreatePackage } from '../../hooks/useCreatePackage';
import { useUpdatePackage } from '../../hooks/useUpdatePackage';
import { useDeletePackage } from '../../hooks/useDeletePackage';
import type { Package } from '../../../services/types';
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

const MotionTableRow = motion(TableRow);

export default function PackagesManagement() {
  const { language } = useApp();
  const isRTL = language === 'ar';

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [gameFilter, setGameFilter] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [deletingPackage, setDeletingPackage] = useState<Package | null>(null);
  const [editingStock, setEditingStock] = useState<{ [key: string]: string }>({});

  // Fetch packages
  const { data: packagesResponse, isLoading, isError, refetch } = usePackages({
    page,
    limit: pageSize,
    gameId: gameFilter && gameFilter !== '__all__' ? gameFilter : undefined,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    isActive: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
    sortBy: sortBy as 'price' | 'amount' | 'createdAt' | 'sortOrder',
    sortOrder: 'asc',
  });

  // Fetch games
  const { data: gamesResponse } = useGames({ limit: 100 });
  const games = gamesResponse?.games || [];
  const packages = packagesResponse?.packages || [];
  const pagination = packagesResponse?.pagination;

  // Mutations
  const createMutation = useCreatePackage({
    onSuccess: () => {
      toast.success(language === 'ar' ? 'تم إنشاء الباقة بنجاح' : 'Package created successfully');
      setIsCreateDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || (language === 'ar' ? 'فشل إنشاء الباقة' : 'Failed to create package'));
    },
  });

  const updateMutation = useUpdatePackage({
    onSuccess: () => {
      toast.success(language === 'ar' ? 'تم تحديث الباقة بنجاح' : 'Package updated successfully');
      setEditingPackage(null);
    },
    onError: (error) => {
      toast.error(error.message || (language === 'ar' ? 'فشل تحديث الباقة' : 'Failed to update package'));
    },
  });

  const deleteMutation = useDeletePackage({
    onSuccess: () => {
      toast.success(language === 'ar' ? 'تم حذف الباقة بنجاح' : 'Package deleted successfully');
      setDeletingPackage(null);
    },
    onError: (error) => {
      toast.error(error.message || (language === 'ar' ? 'فشل حذف الباقة' : 'Failed to delete package'));
    },
  });

  // Handlers
  const handleCreate = (data: any) => {
    createMutation.mutate(data);
  };

  const handleEdit = (data: any) => {
    if (!editingPackage) return;
    updateMutation.mutate({
      packageId: editingPackage.id,
      ...data,
    });
  };

  const handleDelete = () => {
    if (!deletingPackage) return;
    deleteMutation.mutate(deletingPackage.id);
  };

  const handleToggleActive = (pkg: Package) => {
    updateMutation.mutate({
      packageId: pkg.id,
      isActive: !pkg.isActive,
    });
  };

  const handleTogglePopular = (pkg: Package) => {
    updateMutation.mutate({
      packageId: pkg.id,
      isPopular: !pkg.isPopular,
    });
  };

  const handleStockUpdate = (pkg: Package) => {
    const newStock = editingStock[pkg.id];
    if (!newStock || newStock.trim() === '') {
      toast.error(language === 'ar' ? 'يرجى إدخال قيمة المخزون' : 'Please enter stock value');
      return;
    }

    const stockValue = parseInt(newStock, 10);
    if (isNaN(stockValue) || stockValue < 0) {
      toast.error(language === 'ar' ? 'قيمة المخزون يجب أن تكون رقماً موجباً' : 'Stock must be a positive number');
      return;
    }

    updateMutation.mutate(
      {
        packageId: pkg.id,
        stock: stockValue,
      },
      {
        onSuccess: () => {
          // إزالة القيمة من state بعد التحديث الناجح
          setEditingStock((prev) => {
            const newState = { ...prev };
            delete newState[pkg.id];
            return newState;
          });
        },
      }
    );
  };

  const clearFilters = () => {
    setGameFilter('');
    setMinPrice('');
    setMaxPrice('');
    setStatusFilter('');
    setPage(1);
  };

  const hasActiveFilters = gameFilter || minPrice || maxPrice || statusFilter;

  return (
    <AdminLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {language === 'ar' ? 'إدارة الباقات' : 'Packages Management'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {language === 'ar' ? 'إدارة باقات الألعاب المتاحة في المتجر' : 'Manage game packages'}
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {language === 'ar' ? 'إضافة باقة' : 'Add Package'}
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select value={gameFilter} onValueChange={setGameFilter}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'جميع الألعاب' : 'All Games'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{language === 'ar' ? 'جميع الألعاب' : 'All Games'}</SelectItem>
                {games.map((game) => (
                  <SelectItem key={game.id} value={game.id}>
                    {language === 'ar' ? game.nameAr : game.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder={language === 'ar' ? 'السعر الأدنى' : 'Min Price'}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min="0"
            />

            <Input
              type="number"
              placeholder={language === 'ar' ? 'السعر الأقصى' : 'Max Price'}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
            />

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'جميع الحالات' : 'All Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{language === 'ar' ? 'جميع الحالات' : 'All Status'}</SelectItem>
                <SelectItem value="active">{language === 'ar' ? 'نشط' : 'Active'}</SelectItem>
                <SelectItem value="inactive">{language === 'ar' ? 'غير نشط' : 'Inactive'}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">{language === 'ar' ? 'التاريخ' : 'Date'}</SelectItem>
                <SelectItem value="price">{language === 'ar' ? 'السعر' : 'Price'}</SelectItem>
                <SelectItem value="amount">{language === 'ar' ? 'الكمية' : 'Amount'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'الفلاتر النشطة:' : 'Active Filters:'}
              </span>
              {gameFilter && (
                <Badge variant="secondary">
                  {language === 'ar' ? 'اللعبة:' : 'Game:'} {games.find((g) => g.id === gameFilter)?.[language === 'ar' ? 'nameAr' : 'name']}
                </Badge>
              )}
              {minPrice && <Badge variant="secondary">{language === 'ar' ? 'من:' : 'Min:'} {minPrice} SDG</Badge>}
              {maxPrice && <Badge variant="secondary">{language === 'ar' ? 'إلى:' : 'Max:'} {maxPrice} SDG</Badge>}
              {statusFilter && (
                <Badge variant="secondary">
                  {language === 'ar' ? 'الحالة:' : 'Status:'} {statusFilter === 'active' ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'غير نشط' : 'Inactive')}
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
        {isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{language === 'ar' ? 'فشل تحميل الباقات' : 'Failed to load packages'}</span>
              <Button onClick={() => refetch()} variant="outline" size="sm">
                {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'ar' ? 'اللعبة' : 'Game'}</TableHead>
                <TableHead>{language === 'ar' ? 'الكمية' : 'Amount'}</TableHead>
                <TableHead>{language === 'ar' ? 'السعر' : 'Price'}</TableHead>
                <TableHead>{language === 'ar' ? 'السعر القديم' : 'Old Price'}</TableHead>
                <TableHead>{language === 'ar' ? 'مميز' : 'Popular'}</TableHead>
                <TableHead>{language === 'ar' ? 'المخزون' : 'Stock'}</TableHead>
                <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                <TableHead className="text-right">{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(pageSize)].map((_, idx) => (
                  <MotionTableRow
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03, duration: 0.3 }}
                  >
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                  </MotionTableRow>
                ))
              ) : packages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <PackageIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {language === 'ar' ? 'لا توجد باقات' : 'No packages found'}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                packages.map((pkg, idx) => (
                  <MotionTableRow
                    key={pkg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03, duration: 0.3 }}
                  >
                    <TableCell className="font-medium">
                      {pkg.game ? (language === 'ar' ? pkg.game.nameAr : pkg.game.name) : 'N/A'}
                    </TableCell>
                    <TableCell>{pkg.amount}</TableCell>
                    <TableCell className="font-semibold">{pkg.price.toLocaleString()} SDG</TableCell>
                    <TableCell>
                      {pkg.oldPrice ? <span className="line-through text-gray-500">{pkg.oldPrice.toLocaleString()} SDG</span> : '-'}
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={pkg.isPopular} 
                        onCheckedChange={() => handleTogglePopular(pkg)}
                        disabled={updateMutation.isPending}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          value={editingStock[pkg.id] ?? pkg.stock?.toString() ?? ''}
                          onChange={(e) =>
                            setEditingStock((prev) => ({
                              ...prev,
                              [pkg.id]: e.target.value,
                            }))
                          }
                          className="w-20 h-8"
                          disabled={updateMutation.isPending}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStockUpdate(pkg)}
                          disabled={
                            updateMutation.isPending ||
                            !editingStock[pkg.id] ||
                            editingStock[pkg.id] === pkg.stock?.toString()
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        {pkg.stock !== undefined && pkg.stock !== null && pkg.stock < 10 && (
                          <Badge variant="destructive" className="animate-pulse ml-1">
                            {language === 'ar' ? 'قليل' : 'Low'}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={pkg.isActive} 
                          onCheckedChange={() => handleToggleActive(pkg)}
                          disabled={updateMutation.isPending}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {pkg.isActive ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'غير نشط' : 'Inactive')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingPackage(pkg)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeletingPackage(pkg)}>
                          <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </Button>
                      </div>
                    </TableCell>
                  </MotionTableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ar' ? `عرض ${packages.length} من ${pagination.total} نتيجة` : `Showing ${packages.length} of ${pagination.total} results`}
              </p>
              <div className="flex items-center gap-2">
                <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} variant="outline" size="sm">
                  {language === 'ar' ? 'السابق' : 'Previous'}
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'ar' ? `صفحة ${page} من ${pagination.totalPages}` : `Page ${page} of ${pagination.totalPages}`}
                </span>
                <Button onClick={() => setPage((p) => p + 1)} disabled={page >= pagination.totalPages} variant="outline" size="sm">
                  {language === 'ar' ? 'التالي' : 'Next'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => !createMutation.isPending && setIsCreateDialogOpen(open)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{language === 'ar' ? 'إضافة باقة جديدة' : 'Add New Package'}</DialogTitle>
              <DialogDescription>
                {language === 'ar' ? 'أدخل تفاصيل الباقة الجديدة' : 'Enter the details for the new package'}
              </DialogDescription>
            </DialogHeader>
            <PackageForm onSubmit={handleCreate} isLoading={createMutation.isPending} />
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={!!editingPackage} onOpenChange={(open) => !updateMutation.isPending && !open && setEditingPackage(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{language === 'ar' ? 'تعديل الباقة' : 'Edit Package'}</DialogTitle>
              <DialogDescription>
                {language === 'ar' ? 'قم بتعديل تفاصيل الباقة' : 'Update the package details'}
              </DialogDescription>
            </DialogHeader>
            {editingPackage && <PackageForm package={editingPackage} onSubmit={handleEdit} isLoading={updateMutation.isPending} />}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingPackage} onOpenChange={(open) => !open && setDeletingPackage(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{language === 'ar' ? 'تأكيد الحذف' : 'Confirm Deletion'}</AlertDialogTitle>
              <AlertDialogDescription>
                {language === 'ar' ? (
                  <>هل أنت متأكد من حذف باقة <strong>{deletingPackage?.amount}</strong>؟<br />لا يمكن التراجع عن هذا الإجراء.</>
                ) : (
                  <>Are you sure you want to delete package <strong>{deletingPackage?.amount}</strong>?<br />This action cannot be undone.</>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteMutation.isPending}>
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending} className="bg-red-600 hover:bg-red-700">
                {deleteMutation.isPending && (
                  <Loader2 className={`h-4 w-4 animate-spin ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                )}
                {deleteMutation.isPending ? (language === 'ar' ? 'جاري الحذف...' : 'Deleting...') : (language === 'ar' ? 'حذف' : 'Delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
