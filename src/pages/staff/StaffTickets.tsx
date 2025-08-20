import React, { useState } from 'react';
import { Grid, List } from 'lucide-react';
import { useTickets, useCategories, useUsers, useUpdateTicket } from '../../hooks/useApi';
import { useToast } from '../../context/ToastContext';
import { FiltersBar } from '../../components/tickets/FiltersBar';
import { TicketTable } from '../../components/tickets/TicketTable';
import { KanbanBoardBasic } from '../../components/tickets/KanbanBoardBasic';
import { TicketSkeleton } from '../../components/ui/Loading';

export const StaffTickets: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [assignee, setAssignee] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  
  const updateTicketMutation = useUpdateTicket();
  const { addToast } = useToast();

  const { 
    data: tickets = [], 
    isLoading: ticketsLoading 
  } = useTickets({
    status: status || undefined,
    category: category || undefined,
    priority: priority || undefined,
    assignee: assignee === 'unassigned' ? undefined : assignee || undefined,
    q: searchQuery || undefined,
  });

  const { data: categories = [] } = useCategories();
  const { data: users = [] } = useUsers();
  const { data: staff = [] } = useUsers('staff');

  const filteredTickets = assignee === 'unassigned' 
    ? tickets.filter(t => !t.assignedStaffId)
    : tickets;

  if (ticketsLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">All Tickets</h1>
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <TicketSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">All Tickets</h1>
        <div className="flex items-center space-x-6">
          {/* Enhanced View Toggle */}
          <div className="relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-dark-700/50 p-1 shadow-lg">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setViewMode('table')}
                className={`
                  relative flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group overflow-hidden
                  ${viewMode === 'table'
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-dark-700/50 hover:text-gray-900 dark:hover:text-gray-100 hover:scale-105'
                  }
                `}
              >
                <List className={`w-4 h-4 ${viewMode === 'table' ? 'animate-bounce-gentle' : 'group-hover:scale-110'} transition-transform`} />
                <span>List View</span>
                {viewMode === 'table' && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-xl"></div>
                )}
              </button>
              
              <button
                onClick={() => setViewMode('kanban')}
                className={`
                  relative flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group overflow-hidden
                  ${viewMode === 'kanban'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-dark-700/50 hover:text-gray-900 dark:hover:text-gray-100 hover:scale-105'
                  }
                `}
              >
                <Grid className={`w-4 h-4 ${viewMode === 'kanban' ? 'animate-bounce-gentle' : 'group-hover:scale-110'} transition-transform`} />
                <span>Board View</span>
                {viewMode === 'kanban' && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-xl"></div>
                )}
              </button>
            </div>
          </div>

          {/* Ticket Count with Better Design */}
          <div className="flex items-center space-x-3">
            <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-dark-700/50 px-4 py-2 shadow-md">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {filteredTickets.length}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ticket{filteredTickets.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FiltersBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        status={status}
        onStatusChange={setStatus}
        category={category}
        onCategoryChange={setCategory}
        priority={priority}
        onPriorityChange={setPriority}
        assignee={assignee}
        onAssigneeChange={setAssignee}
        categories={categories}
        staff={staff}
      />

      {viewMode === 'table' ? (
        <TicketTable
          tickets={filteredTickets}
          users={users}
          categories={categories}
          loading={ticketsLoading}
          linkPrefix="/staff/tickets"
        />
      ) : (
        <KanbanBoardBasic
          tickets={filteredTickets}
          users={users}
          categories={categories}
          onTicketUpdate={async (ticketId, updates) => {
            try {
              await updateTicketMutation.mutateAsync({
                id: ticketId,
                data: updates
              });
              addToast('Ticket updated successfully!', 'success');
            } catch (error) {
              addToast('Failed to update ticket', 'error');
            }
          }}
          linkPrefix="/staff/tickets"
        />
      )}
    </div>
  );
};