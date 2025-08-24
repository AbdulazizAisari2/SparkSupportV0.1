import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Users, 
  MessageSquare, 
  Award, 
  Target,
  Calendar,
  Filter,
  Download,
  Eye,
  Clock,
  ThumbsUp,
  HeartHandshake,
  Sparkles
} from 'lucide-react';
import { StarRating } from '../../components/ui/StarRating';

// Mock survey data - replace with real API calls
const mockSurveyData = [
  {
    id: '1',
    ticketId: 'TKT-001',
    customerId: 'customer1',
    customerName: 'John Doe',
    staffId: 'staff1',
    staffName: 'Mohammed',
    submittedAt: '2024-01-15T10:30:00Z',
    overallRating: 5,
    responseTime: 4,
    helpfulness: 5,
    professionalism: 5,
    resolutionQuality: 4,
    feedback: 'Excellent service! Very helpful and professional.',
    improvements: 'Maybe faster initial response time.'
  },
  {
    id: '2',
    ticketId: 'TKT-002',
    customerId: 'customer2',
    customerName: 'Jane Smith',
    staffId: 'staff2',
    staffName: 'Ahmed',
    submittedAt: '2024-01-14T14:15:00Z',
    overallRating: 4,
    responseTime: 4,
    helpfulness: 4,
    professionalism: 5,
    resolutionQuality: 4,
    feedback: 'Good support, solved my issue quickly.',
    improvements: ''
  },
  {
    id: '3',
    ticketId: 'TKT-003',
    customerId: 'customer3',
    customerName: 'Bob Johnson',
    staffId: 'staff3',
    staffName: 'Sarah',
    submittedAt: '2024-01-13T09:45:00Z',
    overallRating: 3,
    responseTime: 3,
    helpfulness: 3,
    professionalism: 4,
    resolutionQuality: 3,
    feedback: 'Average experience, could be better.',
    improvements: 'More detailed explanations needed.'
  },
  {
    id: '4',
    ticketId: 'TKT-004',
    customerId: 'customer4',
    customerName: 'Alice Wilson',
    staffId: 'staff1',
    staffName: 'Mohammed',
    submittedAt: '2024-01-12T16:20:00Z',
    overallRating: 5,
    responseTime: 5,
    helpfulness: 5,
    professionalism: 5,
    resolutionQuality: 5,
    feedback: 'Outstanding! Couldn\'t ask for better service.',
    improvements: ''
  },
  {
    id: '5',
    ticketId: 'TKT-005',
    customerId: 'customer5',
    customerName: 'Charlie Brown',
    staffId: 'staff2',
    staffName: 'Ahmed',
    submittedAt: '2024-01-11T11:10:00Z',
    overallRating: 4,
    responseTime: 3,
    helpfulness: 4,
    professionalism: 4,
    resolutionQuality: 4,
    feedback: 'Very satisfied with the resolution.',
    improvements: 'Faster response time would be great.'
  }
];

export const AdminSurveyAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [showDetails, setShowDetails] = useState(false);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalSurveys = mockSurveyData.length;
    const avgOverall = mockSurveyData.reduce((sum, s) => sum + s.overallRating, 0) / totalSurveys;
    const avgResponseTime = mockSurveyData.reduce((sum, s) => sum + s.responseTime, 0) / totalSurveys;
    const avgHelpfulness = mockSurveyData.reduce((sum, s) => sum + s.helpfulness, 0) / totalSurveys;
    const avgProfessionalism = mockSurveyData.reduce((sum, s) => sum + s.professionalism, 0) / totalSurveys;
    const avgResolution = mockSurveyData.reduce((sum, s) => sum + s.resolutionQuality, 0) / totalSurveys;
    
    const excellent = mockSurveyData.filter(s => s.overallRating >= 4.5).length;
    const good = mockSurveyData.filter(s => s.overallRating >= 3.5 && s.overallRating < 4.5).length;
    const fair = mockSurveyData.filter(s => s.overallRating >= 2.5 && s.overallRating < 3.5).length;
    const poor = mockSurveyData.filter(s => s.overallRating < 2.5).length;

    return {
      totalSurveys,
      avgOverall: Number(avgOverall.toFixed(1)),
      avgResponseTime: Number(avgResponseTime.toFixed(1)),
      avgHelpfulness: Number(avgHelpfulness.toFixed(1)),
      avgProfessionalism: Number(avgProfessionalism.toFixed(1)),
      avgResolution: Number(avgResolution.toFixed(1)),
      distribution: { excellent, good, fair, poor }
    };
  }, []);

  // Staff performance
  const staffPerformance = useMemo(() => {
    const staffMap = new Map();
    
    mockSurveyData.forEach(survey => {
      const staff = survey.staffName;
      if (!staffMap.has(staff)) {
        staffMap.set(staff, { name: staff, surveys: [], total: 0, avg: 0 });
      }
      staffMap.get(staff).surveys.push(survey);
    });

    return Array.from(staffMap.values()).map(staff => {
      const avg = staff.surveys.reduce((sum: number, s: any) => sum + s.overallRating, 0) / staff.surveys.length;
      return {
        ...staff,
        total: staff.surveys.length,
        avg: Number(avg.toFixed(1))
      };
    }).sort((a, b) => b.avg - a.avg);
  }, []);

  const MetricCard = ({ title, value, subtitle, icon: Icon, color, trend }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300`}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-white/20 rounded-xl backdrop-blur-sm`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className="flex items-center space-x-1">
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-300" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-300" />
            )}
            <span className="text-sm font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-bold">{value}</h3>
        <p className="text-white/80 text-sm">{title}</p>
        {subtitle && <p className="text-white/60 text-xs">{subtitle}</p>}
      </div>
    </motion.div>
  );

  const RatingDistributionChart = () => (
    <div className="space-y-4">
      {[
        { label: 'Excellent (4.5-5)', count: metrics.distribution.excellent, color: 'bg-green-500' },
        { label: 'Good (3.5-4.4)', count: metrics.distribution.good, color: 'bg-blue-500' },
        { label: 'Fair (2.5-3.4)', count: metrics.distribution.fair, color: 'bg-yellow-500' },
        { label: 'Poor (0-2.4)', count: metrics.distribution.poor, color: 'bg-red-500' },
      ].map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-2"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{item.count}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${item.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${(item.count / metrics.totalSurveys) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <BarChart className="w-6 h-6 text-white" />
              </div>
              <span>Customer Satisfaction Analytics</span>
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Track and analyze customer feedback to improve service quality
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-gray-100"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Overall Rating"
            value={`${metrics.avgOverall}/5`}
            subtitle={`Based on ${metrics.totalSurveys} surveys`}
            icon={Star}
            color="from-yellow-500 to-orange-500"
            trend={5.2}
          />
          <MetricCard
            title="Response Time"
            value={`${metrics.avgResponseTime}/5`}
            subtitle="Average satisfaction"
            icon={Clock}
            color="from-blue-500 to-cyan-500"
            trend={-2.1}
          />
          <MetricCard
            title="Helpfulness"
            value={`${metrics.avgHelpfulness}/5`}
            subtitle="Staff assistance rating"
            icon={HeartHandshake}
            color="from-green-500 to-emerald-500"
            trend={3.8}
          />
          <MetricCard
            title="Resolution Quality"
            value={`${metrics.avgResolution}/5`}
            subtitle="Problem solving effectiveness"
            icon={Target}
            color="from-purple-500 to-pink-500"
            trend={1.5}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rating Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                <BarChart className="w-5 h-5 text-blue-500" />
                <span>Rating Distribution</span>
              </h3>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <RatingDistributionChart />
          </motion.div>

          {/* Staff Performance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-500" />
              <span>Staff Performance</span>
            </h3>
            
            <div className="space-y-4">
              {staffPerformance.map((staff, index) => (
                <motion.div
                  key={staff.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${
                      index === 0 ? 'from-yellow-400 to-orange-500' :
                      index === 1 ? 'from-gray-400 to-gray-500' :
                      'from-orange-400 to-red-500'
                    } flex items-center justify-center`}>
                      {index === 0 ? (
                        <Award className="w-5 h-5 text-white" />
                      ) : (
                        <span className="text-white font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{staff.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{staff.total} surveys</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <StarRating
                      rating={staff.avg}
                      onRatingChange={() => {}}
                      size="sm"
                      readonly
                    />
                    <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                      {staff.avg}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-xl"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-purple-500" />
            <span>Recent Customer Feedback</span>
          </h3>
          
          <div className="space-y-4">
            {mockSurveyData.slice(0, 3).map((survey, index) => (
              <motion.div
                key={survey.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{survey.customerName}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ticket {survey.ticketId} • Handled by {survey.staffName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StarRating
                      rating={survey.overallRating}
                      onRatingChange={() => {}}
                      size="sm"
                      readonly
                    />
                  </div>
                </div>
                
                {survey.feedback && (
                  <blockquote className="text-gray-700 dark:text-gray-300 italic border-l-4 border-blue-500 pl-4">
                    "{survey.feedback}"
                  </blockquote>
                )}
                
                {survey.improvements && (
                  <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Improvement suggestion:</strong> {survey.improvements}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};