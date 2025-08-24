import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Paperclip } from 'lucide-react';

const replySchema = z.object({
  message: z.string().min(1, 'Message is required'),
  attachments: z.array(z.string()).optional(),
});

type ReplyFormData = z.infer<typeof replySchema>;

interface ReplyBoxProps {
  onSubmit: (data: ReplyFormData) => void;
  isSubmitting: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export const ReplyBox: React.FC<ReplyBoxProps> = ({
  onSubmit,
  isSubmitting,
  disabled = false,
  placeholder = 'Type your message...',
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
  });

  const handleFormSubmit = (data: ReplyFormData) => {
    onSubmit(data);
    reset();
  };

  if (disabled) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-500">
          This ticket is closed. Replies are disabled.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <textarea
          {...register('message')}
          placeholder={placeholder}
          rows={4}
          className={`
            w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none
            ${errors.message ? 'border-red-300' : 'border-gray-300'}
          `}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
        >
          <Paperclip className="w-4 h-4" />
          <span>Attach files</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Sending...' : 'Send Reply'}</span>
        </button>
      </div>
    </form>
  );
};