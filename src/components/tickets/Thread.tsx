import React from 'react';
import { TicketMessage, User } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Eye, Paperclip } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
interface ThreadProps {
  messages: TicketMessage[];
  users: User[];
}
export const Thread: React.FC<ThreadProps> = ({ messages, users }) => {
  const { user: currentUser } = useAuth();
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };
  const getUserRole = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.role || 'customer';
  };
  const canViewInternalNotes = currentUser?.role === 'staff' || currentUser?.role === 'admin';
  const filteredMessages = messages.filter(message => 
    !message.isInternal || canViewInternalNotes
  );
  if (filteredMessages.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No messages yet</h3>
        <p className="mt-1 text-sm text-gray-500">Start the conversation by adding a message.</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {filteredMessages.map((message) => {
        const senderName = getUserName(message.senderId);
        const senderRole = getUserRole(message.senderId);
        const isCurrentUser = message.senderId === currentUser?.id;
        const isInternal = message.isInternal;
        return (
          <div
            key={message.id}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                max-w-xs lg:max-w-md px-4 py-3 rounded-lg
                ${isCurrentUser
                  ? 'bg-blue-500 text-white'
                  : isInternal
                    ? 'bg-yellow-50 border-2 border-yellow-200'
                    : 'bg-gray-100'
                }
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-medium ${
                    isCurrentUser ? 'text-blue-100' : 'text-gray-600'
                  }`}>
                    {senderName}
                  </span>
                  <span className={`
                    text-xs px-1.5 py-0.5 rounded
                    ${senderRole === 'staff' 
                      ? 'bg-blue-100 text-blue-600' 
                      : senderRole === 'admin'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-green-100 text-green-600'
                    }
                    ${isCurrentUser ? 'opacity-80' : ''}
                  `}>
                    {senderRole}
                  </span>
                  {isInternal && (
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3 text-yellow-600" />
                      <span className="text-xs text-yellow-600 font-medium">Internal</span>
                    </div>
                  )}
                </div>
                <span className={`text-xs ${
                  isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                </span>
              </div>
              <div className={`text-sm ${
                isCurrentUser ? 'text-white' : isInternal ? 'text-gray-800' : 'text-gray-900'
              }`}>
                {message.message}
              </div>
{(() => {
                let attachments = [];
                try {
                  attachments = typeof message.attachmentUrls === 'string' 
                    ? JSON.parse(message.attachmentUrls) 
                    : (message.attachmentUrls || []);
                } catch {
                  attachments = [];
                }
                return attachments && attachments.length > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-1 text-xs">
                      <Paperclip className="w-3 h-3" />
                      <span>{attachments.length} attachment(s)</span>
                    </div>
                    <div className="mt-1 space-y-1">
                      {attachments.map((url, urlIndex) => (
                        <a
                          key={urlIndex}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`block text-xs underline ${
                            isCurrentUser ? 'text-blue-100' : 'text-blue-600'
                          }`}
                        >
                          Attachment {urlIndex + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        );
      })}
    </div>
  );
};