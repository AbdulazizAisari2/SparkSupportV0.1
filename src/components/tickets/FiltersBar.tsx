import React from 'react';
import { Search } from 'lucide-react';
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

const statusOptions: { value: string; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const priorityOptions: { value: string; label: string }[] = [
  { value: '', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
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
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {priorityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Assignee Filter (Staff only) */}
        {staff && onAssigneeChange && (
          <select
            value={assignee || ''}
            onChange={(e) => onAssigneeChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Assignees</option>
            <option value="unassigned">Unassigned</option>
            {staff.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};