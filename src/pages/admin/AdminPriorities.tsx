import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  usePriorities, 
  useCreatePriority, 
  useUpdatePriority, 
  useDeletePriority 
} from '../../hooks/useApi';
import { useToast } from '../../context/ToastContext';
import { CrudList } from '../../components/admin/CrudList';
import { CrudDialog } from '../../components/admin/CrudDialog';
import { PriorityDef } from '../../types';
const prioritySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  level: z.coerce.number().min(1, 'Level must be at least 1').max(10, 'Level cannot exceed 10'),
});
type PriorityFormData = z.infer<typeof prioritySchema>;
export const AdminPriorities: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPriority, setEditingPriority] = useState<PriorityDef | null>(null);
  const { addToast } = useToast();
  const { data: priorities = [], isLoading } = usePriorities();
  const createPriorityMutation = useCreatePriority();
  const updatePriorityMutation = useUpdatePriority();
  const deletePriorityMutation = useDeletePriority();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PriorityFormData>({
    resolver: zodResolver(prioritySchema),
  });
  const handleCreate = () => {
    setEditingPriority(null);
    reset({ name: '', level: 1 });
    setIsDialogOpen(true);
  };
  const handleEdit = (priority: PriorityDef) => {
    setEditingPriority(priority);
    reset({
      name: priority.name,
      level: priority.level,
    });
    setIsDialogOpen(true);
  };
  const handleDelete = async (id: string) => {
    try {
      await deletePriorityMutation.mutateAsync(id);
      addToast('Priority deleted successfully!', 'success');
    } catch {
      addToast('Failed to delete priority. Please try again.', 'error');
    }
  };
  const onSubmit = async (data: PriorityFormData) => {
    try {
      if (editingPriority) {
        await updatePriorityMutation.mutateAsync({
          id: editingPriority.id,
          data: data as PriorityFormData,
        });
        addToast('Priority updated successfully!', 'success');
      } else {
        await createPriorityMutation.mutateAsync(data as PriorityFormData);
        addToast('Priority created successfully!', 'success');
      }
      setIsDialogOpen(false);
      reset();
    } catch {
      addToast('Operation failed. Please try again.', 'error');
    }
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPriority(null);
    reset();
  };
  const renderPriority = (priority: PriorityDef) => (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-medium text-gray-900">{priority.name}</h3>
        <p className="text-sm text-gray-600">Level {priority.level}</p>
      </div>
      <div className={`
        px-2 py-1 text-xs rounded-full
        ${priority.level >= 4 ? 'bg-red-100 text-red-800' : ''}
        ${priority.level === 3 ? 'bg-orange-100 text-orange-800' : ''}
        ${priority.level === 2 ? 'bg-yellow-100 text-yellow-800' : ''}
        ${priority.level === 1 ? 'bg-green-100 text-green-800' : ''}
      `}>
        Priority {priority.level}
      </div>
    </div>
  );
  const isSubmitting = createPriorityMutation.isPending || updatePriorityMutation.isPending;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Priorities Management</h1>
        <p className="text-sm text-gray-600">
          {priorities.length} priorit{priorities.length !== 1 ? 'ies' : 'y'}
        </p>
      </div>
      <CrudList
        title="Priority Levels"
        items={priorities.sort((a, b) => b.level - a.level)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        renderItem={renderPriority}
        getItemId={(priority) => priority.id}
        loading={isLoading}
        emptyMessage="No priorities found. Create your first priority level to get started."
      />
      <CrudDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        title={editingPriority ? 'Edit Priority' : 'Create Priority'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
              placeholder="Enter priority name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Level * (1-10, higher = more urgent)
            </label>
            <input
              {...register('level')}
              id="level"
              type="number"
              min="1"
              max="10"
              className={`
                w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.level ? 'border-red-300' : 'border-gray-300'}
              `}
              placeholder="1"
            />
            {errors.level && (
              <p className="mt-1 text-sm text-red-600">{errors.level.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Level 1 = Lowest priority, Level 10 = Highest priority
            </p>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCloseDialog}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Saving...' : editingPriority ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </CrudDialog>
    </div>
  );
};