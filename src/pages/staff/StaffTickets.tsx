import React, { useState } from 'react';
import { useTickets, useCategories, useUsers } from '../../hooks/useApi';
import { FiltersBar } from '../../components/tickets/FiltersBar';
import { TicketTable } from '../../components/tickets/TicketTable';
import { TicketSkeleton } from '../../components/ui/Loading';

export const StaffTickets: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [assignee, setAssignee] = useState('');

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
        <h1 className="text-2xl font-bold text-gray-900">All Tickets</h1>
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
        <h1 className="text-2xl font-bold text-gray-900">All Tickets</h1>
        <div className="text-sm text-gray-600">
          {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}
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

      <TicketTable
        tickets={filteredTickets}
        users={users}
        categories={categories}
        loading={ticketsLoading}
        linkPrefix="/staff/tickets"
      />
    </div>
  );
};