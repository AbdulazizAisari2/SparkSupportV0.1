import React from 'react';
import { Search, Filter, X, Users, Tag, AlertTriangle, Clock } from 'lucide-react';
import { Status, Priority } from '../../types';

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
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50/50 to-purple-50/50 dark:from-primary-900/20 dark:to-purple-900/20 p-4 border-b border-gray-200/50 dark:border-dark-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white dark:bg-dark-800 rounded-lg shadow-md">
              <Filter className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Smart Filters</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Find exactly what you're looking for</p>
            </div>
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center space-x-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200 text-sm font-medium"
            >
              <X className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 space-y-6">
        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by ticket ID, subject, or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-dark-600 rounded-xl bg-white/50 dark:bg-dark-700/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:bg-white/70 dark:hover:bg-dark-700/70"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span>Status</span>
            </label>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-dark-600 rounded-xl bg-white/50 dark:bg-dark-700/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:bg-white/70 dark:hover:bg-dark-700/70"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {status && (
              <div className={`inline-flex items-center px-2 py-1 rounded-lg bg-gradient-to-r ${statusOptions.find(o => o.value === status)?.color} text-white text-xs font-medium`}>
                {statusOptions.find(o => o.value === status)?.label}
              </div>
            )}
          </div>

          {/* Priority Filter */}
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

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-2">
              <Tag className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span>Category</span>
            </label>
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-dark-600 rounded-xl bg-white/50 dark:bg-dark-700/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:bg-white/70 dark:hover:bg-dark-700/70"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {category && (
              <div className="inline-flex items-center px-2 py-1 rounded-lg bg-gradient-to-r from-green-400 to-green-500 text-white text-xs font-medium">
                {categories.find(c => c.id === category)?.name}
              </div>
            )}
          </div>

          {/* Assignee Filter (if staff provided) */}
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

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="border-t border-gray-200/50 dark:border-dark-700/50 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active filters:</span>
                <div className="flex items-center space-x-2">
                  {[status, priority, category, assignee, searchQuery].filter(Boolean).length} applied
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Tip: Use multiple filters to narrow down results
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};