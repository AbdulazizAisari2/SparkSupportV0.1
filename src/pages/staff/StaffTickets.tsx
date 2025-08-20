import React, { useState } from 'react';
import { Grid, List } from 'lucide-react';
import { useTickets, useCategories, useUsers } from '../../hooks/useApi';
import { FiltersBar } from '../../components/tickets/FiltersBar';
import { TicketTable } from '../../components/tickets/TicketTable';
import { KanbanBoard } from '../../components/tickets/KanbanBoard';
import { TicketSkeleton } from '../../components/ui/Loading';

export const StaffTickets: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [assignee, setAssignee] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

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
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-600 p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${viewMode === 'table'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
                }
              `}
            >
              <List className="w-4 h-4" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${viewMode === 'kanban'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
                }
              `}
            >
              <Grid className="w-4 h-4" />
              <span>Kanban</span>
            </button>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}
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
        <KanbanBoard
          tickets={filteredTickets}
          users={users}
          categories={categories}
          onTicketUpdate={(ticketId, updates) => {
            // In real app, this would call an API to update the ticket
            console.log('Updating ticket:', ticketId, updates);
          }}
          linkPrefix="/staff/tickets"
        />
      )}
    </div>
  );
};