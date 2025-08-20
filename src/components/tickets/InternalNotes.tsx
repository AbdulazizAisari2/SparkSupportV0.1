import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, Plus } from 'lucide-react';
import { TicketMessage, User } from '../../types';
import { formatDistanceToNow } from 'date-fns';

const noteSchema = z.object({
  message: z.string().min(1, 'Note content is required'),
});

type NoteFormData = z.infer<typeof noteSchema>;

interface InternalNotesProps {
  messages: TicketMessage[];
  users: User[];
  onAddNote: (data: NoteFormData) => void;
  isSubmitting: boolean;
}

export const InternalNotes: React.FC<InternalNotesProps> = ({
  messages,
  users,
  onAddNote,
  isSubmitting,
}) => {
  const [showForm, setShowForm] = React.useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
  });

  const internalNotes = messages.filter(m => m.isInternal);

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };

  const handleFormSubmit = (data: NoteFormData) => {
    onAddNote(data);
    reset();
    setShowForm(false);
  };

  return (
    <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Eye className="w-5 h-5 text-yellow-600" />
          <h3 className="text-sm font-medium text-yellow-800">Internal Staff Notes</h3>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>Add Note</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="mb-4">
          <div className="mb-3">
            <textarea
              {...register('message')}
              placeholder="Add an internal note (visible only to staff)..."
              rows={3}
              className={`
                w-full px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none text-sm
                ${errors.message ? 'border-red-300' : 'border-yellow-300'}
              `}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                reset();
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Note'}
            </button>
          </div>
        </form>
      )}

      {internalNotes.length === 0 ? (
        <p className="text-sm text-yellow-700">No internal notes yet.</p>
      ) : (
        <div className="space-y-3">
          {internalNotes.map((note) => (
            <div key={note.id} className="bg-white rounded border border-yellow-200 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">
                  {getUserName(note.senderId)}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-gray-800">{note.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};