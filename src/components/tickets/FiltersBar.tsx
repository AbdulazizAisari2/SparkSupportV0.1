import React from 'react';
import { Search, Filter, X, Users, Tag, AlertTriangle, Clock } from 'lucide-react';
interface FiltersBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  priority: string;
  onPriorityChange: (priority: string) => void;
  assignee?: string;
  onAssigneeChange?: (assignee: string) => void;
  categories: Array<{ id: string; name: string }>;
  staff?: Array<{ id: string; name: string }>;
}
const statusOptions: { value: string; label: string; color: string }[] = [
  { value: '', label: 'All Statuses', color: 'from-gray-400 to-gray-500' },
  { value: 'open', label: 'Open', color: 'from-red-400 to-red-500' },
  { value: 'in_progress', label: 'In Progress', color: 'from-yellow-400 to-yellow-500' },
  { value: 'resolved', label: 'Resolved', color: 'from-green-400 to-green-500' },
  { value: 'closed', label: 'Closed', color: 'from-gray-400 to-gray-500' },
];
const priorityOptions: { value: string; label: string; color: string }[] = [
  { value: '', label: 'All Priorities', color: 'from-gray-400 to-gray-500' },
  { value: 'low', label: 'Low', color: 'from-green-400 to-green-500' },
  { value: 'medium', label: 'Medium', color: 'from-yellow-400 to-yellow-500' },
  { value: 'high', label: 'High', color: 'from-orange-400 to-orange-500' },
  { value: 'urgent', label: 'Urgent', color: 'from-red-400 to-red-500' },
];
export const FiltersBar: React.FC<FiltersBarProps> = ({
  searchQuery,
  onSearchChange,
  status,
  onStatusChange,
  category,
  onCategoryChange,
  priority,
  onPriorityChange,
  assignee,
  onAssigneeChange,
  categories,
  staff,
}) => {
  const hasActiveFilters = status || category || priority || assignee || searchQuery;
  const clearAllFilters = () => {
    onSearchChange('');
    onStatusChange('');
    onCategoryChange('');
    onPriorityChange('');
    onAssigneeChange?.('');
  };
  return (
    <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-dark-700/50 shadow-lg mb-6 overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span>Priority</span>
            </label>
            <select
              value={priority}
              onChange={(e) => onPriorityChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-dark-600 rounded-xl bg-white/50 dark:bg-dark-700/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:bg-white/70 dark:hover:bg-dark-700/70"
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {priority && (
              <div className={`inline-flex items-center px-2 py-1 rounded-lg bg-gradient-to-r ${priorityOptions.find(o => o.value === priority)?.color} text-white text-xs font-medium`}>
                {priorityOptions.find(o => o.value === priority)?.label}
              </div>
            )}
          </div>
          {staff && onAssigneeChange && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Assignee</span>
              </label>
              <select
                value={assignee || ''}
                onChange={(e) => onAssigneeChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-dark-600 rounded-xl bg-white/50 dark:bg-dark-700/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:bg-white/70 dark:hover:bg-dark-700/70"
              >
                <option value="">All Staff</option>
                <option value="unassigned">Unassigned</option>
                {staff.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
              {assignee && (
                <div className="inline-flex items-center px-2 py-1 rounded-lg bg-gradient-to-r from-blue-400 to-blue-500 text-white text-xs font-medium">
                  {assignee === 'unassigned' ? 'Unassigned' : staff.find(s => s.id === assignee)?.name}
                </div>
              )}
            </div>
          )}
        </div>
