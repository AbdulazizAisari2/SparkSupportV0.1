import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Search, 
  Filter, 
  Users, 
  MessageCircle, 
  Phone, 
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  X
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { Employee } from '../../context/ChatContext';
import { RoleBadge } from '../ui/Badge';

interface EmployeeDirectoryProps {
  onStartChat: (employee: Employee) => void;
}

export const EmployeeDirectory: React.FC<EmployeeDirectoryProps> = ({ onStartChat }) => {
  const { 
    state, 
    getFilteredEmployees, 
    setSearchQuery, 
    setSelectedDepartment, 
    setShowOnlineOnly,
    fetchEmployees 
  } = useChat();
  
  const [showFilters, setShowFilters] = useState(false);
  const [departments, setDepartments] = useState<string[]>([]);

  // Fetch departments for filter
  useEffect(() => {
    const uniqueDepartments = Array.from(
      new Set(state.employees.map(emp => emp.department).filter(Boolean))
    ) as string[];
    setDepartments(uniqueDepartments);
  }, [state.employees]);

  // Refresh employees data
  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = getFilteredEmployees();

  const getStatusColor = (employee: Employee) => {
    if (employee.isOnline) return 'text-green-500';
    return 'text-gray-400';
  };

  const getLastSeenText = (employee: Employee) => {
    if (employee.isOnline) return 'Online now';
    if (!employee.lastSeen) return 'Last seen recently';
    
    const lastSeen = new Date(employee.lastSeen);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `Last seen ${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `Last seen ${hours}h ago`;
    } else {
      return `Last seen ${format(lastSeen, 'MMM dd')}`;
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDepartment(null);
    setShowOnlineOnly(false);
  };

  const activeFiltersCount = [
    state.searchQuery,
    state.selectedDepartment,
    state.showOnlineOnly
  ].filter(Boolean).length;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-dark-800">
      {/* Header */}
      <div className="p-4 border-b dark:border-dark-600 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-dark-700 dark:to-dark-600">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Team Directory
            </h2>
            <span className="px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full">
              {filteredEmployees.length}
            </span>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative p-2 rounded-lg transition-colors ${
              showFilters 
                ? 'bg-primary-200 dark:bg-primary-800' 
                : 'hover:bg-white/20 dark:hover:bg-dark-600'
            }`}
          >
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            {activeFiltersCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </div>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            value={state.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-dark-700 border dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          {state.searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 space-y-3 p-4 bg-white/50 dark:bg-dark-800/50 rounded-lg border dark:border-dark-600">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  Clear all
                </button>
              )}
            </div>
            
            {/* Department Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Department
              </label>
              <select
                value={state.selectedDepartment || ''}
                onChange={(e) => setSelectedDepartment(e.target.value || null)}
                className="w-full p-2 text-sm bg-white dark:bg-dark-700 border dark:border-dark-600 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white"
              >
                <option value="">All departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Online Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Status Filter
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="statusFilter"
                    checked={!state.showOnlineOnly}
                    onChange={() => setShowOnlineOnly(false)}
                    className="w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-600 focus:ring-primary-500 dark:bg-dark-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Show all employees</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="statusFilter"
                    checked={state.showOnlineOnly}
                    onChange={() => setShowOnlineOnly(true)}
                    className="w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-600 focus:ring-primary-500 dark:bg-dark-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Show online only</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Employee List */}
      <div className="flex-1 overflow-y-auto">
        {state.isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400">
            <Users className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">No employees found</p>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-2 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y dark:divide-dark-600">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className={`p-4 transition-colors border-l-4 ${
                  employee.isOnline
                    ? 'hover:bg-gray-50 dark:hover:bg-dark-700 border-l-green-400'
                    : 'hover:bg-gray-50 dark:hover:bg-dark-700 border-l-gray-300 dark:border-l-gray-600 opacity-75'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {employee.name.charAt(0).toUpperCase()}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-dark-800 ${
                      employee.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-medium truncate ${
                        employee.isOnline
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {employee.name}
                        {!employee.isOnline && (
                          <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">(offline)</span>
                        )}
                      </h3>
                      <RoleBadge role={employee.role} />
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {employee.email}
                        </span>
                      </div>
                      
                      {employee.department && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {employee.department}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className={`text-xs ${getStatusColor(employee)}`}>
                        {getLastSeenText(employee)}
                      </span>
                    </div>

                    {employee.status && (
                      <div className="mt-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400 italic">
                          "{employee.status}"
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onStartChat(employee)}
                      className={`p-2 rounded-lg transition-colors group ${
                        employee.isOnline
                          ? 'bg-primary-100 dark:bg-primary-900/20 hover:bg-primary-200 dark:hover:bg-primary-800/40 text-primary-600 dark:text-primary-400'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400'
                      }`}
                      title={employee.isOnline ? "Start chat" : "Start chat (user offline)"}
                    >
                      <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>
                    
                    <button
                      className={`p-2 rounded-lg transition-colors ${
                        employee.isOnline
                          ? 'hover:bg-gray-100 dark:hover:bg-dark-600 text-gray-500 dark:text-gray-400'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      }`}
                      title={employee.isOnline ? "Call" : "Call (user offline)"}
                      disabled={!employee.isOnline}
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t dark:border-dark-600 bg-gray-50 dark:bg-dark-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{filteredEmployees.length} of {state.employees.length} employees</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{state.employees.filter(e => e.isOnline).length} online</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span>{state.employees.filter(e => !e.isOnline).length} offline</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};