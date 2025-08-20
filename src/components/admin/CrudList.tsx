import React, { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';

interface CrudListProps<T> {
  title: string;
  items: T[];
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  renderItem: (item: T) => React.ReactNode;
  getItemId: (item: T) => string;
  loading?: boolean;
  emptyMessage?: string;
}

export function CrudList<T>({
  title,
  items,
  onEdit,
  onDelete,
  onCreate,
  renderItem,
  getItemId,
  loading = false,
  emptyMessage = 'No items found.',
}: CrudListProps<T>) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (item: T) => {
    const id = getItemId(item);
    if (confirm('Are you sure you want to delete this item?')) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <button
          onClick={onCreate}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {items.map((item) => {
            const id = getItemId(item);
            const isDeleting = deletingId === id;

            return (
              <div key={id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {renderItem(item)}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={isDeleting}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className={`w-4 h-4 ${isDeleting ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}