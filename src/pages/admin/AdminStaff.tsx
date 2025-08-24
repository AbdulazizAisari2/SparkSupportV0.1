import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  useUsers, 
  useCreateUser, 
  useUpdateUser, 
  useDeleteUser 
} from '../../hooks/useApi';
import { useToast } from '../../context/ToastContext';
import { CrudList } from '../../components/admin/CrudList';
import { CrudDialog } from '../../components/admin/CrudDialog';
import { RoleBadge } from '../../components/ui/Badge';
import { User } from '../../types';
const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  role: z.enum(['staff', 'admin'] as const),
  department: z.string().optional(),
});
const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  role: z.enum(['staff', 'admin'] as const),
  department: z.string().optional(),
});
type CreateUserFormData = z.infer<typeof createUserSchema>;
type UpdateUserFormData = z.infer<typeof updateUserSchema>;
type UserFormData = CreateUserFormData | UpdateUserFormData;
export const AdminStaff: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { addToast } = useToast();
  const { data: allUsers = [], isLoading } = useUsers();
  const staffUsers = allUsers.filter(u => u.role === 'staff' || u.role === 'admin');
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const createForm = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });
  const updateForm = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
  });
  const currentForm = editingUser ? updateForm : createForm;
  const { register, handleSubmit, reset, formState: { errors } } = currentForm;
  const handleCreate = () => {
    setEditingUser(null);
    createForm.reset({ 
      name: '', 
      email: '', 
      password: '',
      phone: '', 
      role: 'staff', 
      department: '' 
    });
    setIsDialogOpen(true);
  };
  const handleEdit = (user: User) => {
    setEditingUser(user);
    updateForm.reset({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role as 'staff' | 'admin',
      department: user.department || '',
    });
    setIsDialogOpen(true);
  };
  const handleDelete = async (id: string) => {
    try {
      await deleteUserMutation.mutateAsync(id);
      addToast('User deleted successfully!', 'success');
    } catch {
      addToast('Failed to delete user. Please try again.', 'error');
    }
  };
  const onSubmit = async (data: UserFormData) => {
    try {
      if (editingUser) {
        await updateUserMutation.mutateAsync({
          id: editingUser.id,
          data: data as UpdateUserFormData,
        });
        addToast('User updated successfully!', 'success');
      } else {
        await createUserMutation.mutateAsync(data as CreateUserFormData);
        addToast('User created successfully!', 'success');
      }
      setIsDialogOpen(false);
      currentForm.reset();
    } catch {
      addToast('Operation failed. Please try again.', 'error');
    }
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
    currentForm.reset();
  };
  const renderUser = (user: User) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-blue-600">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          {user.department && (
            <p className="text-xs text-gray-500">{user.department}</p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <RoleBadge role={user.role} />
      </div>
    </div>
  );
  const isSubmitting = createUserMutation.isPending || updateUserMutation.isPending;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Staff Management</h1>
        <p className="text-sm text-gray-600">
          {staffUsers.length} staff member{staffUsers.length !== 1 ? 's' : ''}
        </p>
      </div>
      <CrudList
        title="Staff & Administrators"
        items={staffUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        renderItem={renderUser}
        getItemId={(user) => user.id}
        loading={isLoading}
        emptyMessage="No staff members found. Add your first team member to get started."
      />
      <CrudDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        title={editingUser ? 'Edit Staff Member' : 'Add Staff Member'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name *
            </label>
            <input
              {...register('name')}
              id="name"
              type="text"
              className={`
                w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.name ? 'border-red-300' : 'border-gray-300'}
              `}
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address *
            </label>
            <input
              {...register('email')}
              id="email"
              type="email"
              className={`
                w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.email ? 'border-red-300' : 'border-gray-300'}
              `}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          {!editingUser && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password *
              </label>
              <input
                {...register('password')}
                id="password"
                type="password"
                className={`
                  w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${errors.password ? 'border-red-300' : 'border-gray-300'}
                `}
                placeholder="Enter password (min. 8 characters)"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          )}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              {...register('phone')}
              id="phone"
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role *
            </label>
            <select
              {...register('role')}
              id="role"
              className={`
                w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.role ? 'border-red-300' : 'border-gray-300'}
              `}
            >
              <option value="staff">Staff</option>
              <option value="admin">Administrator</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Department
            </label>
            <input
              {...register('department')}
              id="department"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter department"
            />
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
              {isSubmitting ? 'Saving...' : editingUser ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </CrudDialog>
    </div>
  );
};