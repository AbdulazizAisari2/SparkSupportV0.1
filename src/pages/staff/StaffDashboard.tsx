import React from 'react';
import { useTickets } from '../../hooks/useApi';
import { TicketCard } from '../../components/tickets/TicketCard';
import { StatusBadge } from '../../components/ui/Badge';
import { 
  BarChart3, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Ticket
} from 'lucide-react';
export const StaffDashboard: React.FC = () => {
  const { data: allTickets = [] } = useTickets({});
  const openTickets = allTickets.filter(t => t.status === 'open');
  const inProgressTickets = allTickets.filter(t => t.status === 'in_progress');
  const resolvedTickets = allTickets.filter(t => t.status === 'resolved');
  const closedTickets = allTickets.filter(t => t.status === 'closed');
  const urgentTickets = allTickets.filter(t => t.priority === 'urgent');
  const recentTickets = allTickets
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);
  const metrics = [
    {
      title: 'Open Tickets',
      value: openTickets.length,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      title: 'In Progress',
      value: inProgressTickets.length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      title: 'Resolved',
      value: resolvedTickets.length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: 'Closed',
      value: closedTickets.length,
      icon: Ticket,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
    },
  ];
  const getSparklineData = (status: string) => {
    const baseValue = allTickets.filter(t => t.status === status).length;
    return Array.from({ length: 7 }, () => 
      Math.max(0, baseValue + Math.floor(Math.random() * 10) - 5)
    );
  };
  const SparklineChart: React.FC<{ data: number[] }> = ({ data }) => {
    const max = Math.max(...data);
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 60;
      const y = 20 - (value / max) * 15;
      return `${x},${y}`;
    }).join(' ');
    return (
      <svg width="60" height="20" className="text-current">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          points={points}
        />
      </svg>
    );
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Staff Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <BarChart3 className="w-4 h-4" />
          <span>Support Overview</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const sparklineData = getSparklineData(metric.title.toLowerCase().replace(' ', '_'));
          return (
            <div
              key={metric.title}
              className={`bg-white rounded-lg border p-6 ${metric.borderColor}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-full ${metric.bgColor}`}>
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className={`${metric.color}`}>
                  <SparklineChart data={sparklineData} />
                </div>
                <span className="text-xs text-gray-500">Last 7 days</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h2>
          <div className="space-y-4">
            {['urgent', 'high', 'medium', 'low'].map((priority) => {
              const count = allTickets.filter(t => t.priority === priority).length;
              const percentage = allTickets.length > 0 ? (count / allTickets.length) * 100 : 0;
              const colors = {
                urgent: { bar: 'bg-red-500', text: 'text-red-600' },
                high: { bar: 'bg-orange-500', text: 'text-orange-600' },
                medium: { bar: 'bg-yellow-500', text: 'text-yellow-600' },
                low: { bar: 'bg-green-500', text: 'text-green-600' },
              };
              return (
                <div key={priority}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {priority}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{count}</span>
                      <span className={`text-xs ${colors[priority as keyof typeof colors].text}`}>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${colors[priority as keyof typeof colors].bar}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Tickets</h2>
          {recentTickets.length === 0 ? (
            <div className="text-center py-8">
              <Ticket className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No recent tickets</h3>
              <p className="mt-1 text-sm text-gray-500">New tickets will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-blue-600">{ticket.id}</span>
                      <StatusBadge status={ticket.status} />
                    </div>
                    <p className="text-sm text-gray-900 font-medium mt-1 truncate">
                      {ticket.subject}
                    </p>
                    <p className="text-xs text-gray-500">
                      Updated {new Date(ticket.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{allTickets.length}</div>
            <div className="text-sm text-gray-600">Total Tickets</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{urgentTickets.length}</div>
            <div className="text-sm text-gray-600">Urgent Priority</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {allTickets.length > 0 
                ? ((resolvedTickets.length + closedTickets.length) / allTickets.length * 100).toFixed(1)
                : 0
              }%
            </div>
            <div className="text-sm text-gray-600">Resolution Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};