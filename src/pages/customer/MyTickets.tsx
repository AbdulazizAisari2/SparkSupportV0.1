import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useTickets, useCategories } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { FiltersBar } from '../../components/tickets/FiltersBar';
import { TicketTable } from '../../components/tickets/TicketTable';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';

export const MyTickets: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');

  const { 
    data: tickets = [], 
    isLoading: ticketsLoading 
  } = useTickets({
    status: status || undefined,
    priority: priority || undefined,
  });

  const { data: categories = [] } = useCategories();

  if (ticketsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Tickets</h1>
        </div>
        <div className="grid gap-4">
          <LoadingSkeleton variant="card" count={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Tickets</h1>
        <Link
          to="/my/tickets/new"
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Ticket</span>
        </Link>
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
        categories={categories}
      />

      <TicketTable
        tickets={tickets}
        users={user ? [user] : []}
        categories={categories}
        loading={ticketsLoading}
        linkPrefix="/my/tickets"
      />
    </div>
  );
};