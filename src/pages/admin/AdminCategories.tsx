import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  useCategories, 
  useCreateCategory, 
  useUpdateCategory, 
  useDeleteCategory 
} from '../../hooks/useApi';
import { useToast } from '../../context/ToastContext';
import { CrudList } from '../../components/admin/CrudList';
import { CrudDialog } from '../../components/admin/CrudDialog';
import { Category } from '../../types';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export const AdminCategories: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { addToast } = useToast();

  const { data: categories = [], isLoading } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const handleCreate = () => {
    setEditingCategory(null);
    reset({ name: '', description: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    reset({
      name: category.name,
      description: category.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategoryMutation.mutateAsync(id);
      addToast('Category deleted successfully!', 'success');
    } catch (error) {
      addToast('Failed to delete category. Please try again.', 'error');
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (editingCategory) {
        await updateCategoryMutation.mutateAsync({
          id: editingCategory.id,
          data,
        });
        addToast('Category updated successfully!', 'success');
      } else {
        await createCategoryMutation.mutateAsync(data);
        addToast('Category created successfully!', 'success');
      }
      setIsDialogOpen(false);
      reset();
    } catch (error) {
      addToast('Operation failed. Please try again.', 'error');
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    reset();
  };

  const renderCategory = (category: Category) => (
    <div>
      <h3 className="font-medium text-gray-900">{category.name}</h3>
      {category.description && (
        <p className="text-sm text-gray-600 mt-1">{category.description}</p>
      )}
    </div>
  );

  const isSubmitting = createCategoryMutation.isPending || updateCategoryMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
        <p className="text-sm text-gray-600">
          {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}
        </p>
      </div>

      <CrudList
        title="Support Categories"
        items={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        renderItem={renderCategory}
        getItemId={(category) => category.id}
        loading={isLoading}
        emptyMessage="No categories found. Create your first category to get started."
      />

      <CrudDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              {...register('name')}
              id="name"
              type="text"
              className={`
                w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.name ? 'border-red-300' : 'border-gray-300'}
              `}
              placeholder="Enter category name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Optional description"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCloseDialog}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </CrudDialog>
    </div>
  );
};