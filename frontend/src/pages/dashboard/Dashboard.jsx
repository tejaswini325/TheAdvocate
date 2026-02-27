import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../../api/dashboardApi';
import StatCard from '../../components/cards/StatCard';
import RecentCasesTable from '../../components/cards/RecentCasesTable';
import CaseStatusChart from '../../components/charts/CaseStatusChart';
import CasePriorityChart from '../../components/charts/CasePriorityChart';
import DocumentStatusChart from '../../components/charts/DocumentStatusChart';
import TaskProgressChart from '../../components/charts/TaskProgressChart';
import Loader from '../../components/common/Loader';
import { 
  FiUsers, 
  FiBriefcase, 
  FiCheckSquare, 
  FiClock, 
  FiCalendar, 
  FiFileText, 
  FiArrowRight
} from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllCases = () => {
    navigate('/cases');
  };

  if (loading) {
    return <Loader />;
  }

  const statCards = [
    {
      title: 'Total Cases',
      value: stats?.overview?.totalCases || 0,
      icon: FiBriefcase,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: 'Open Cases',
      value: stats?.overview?.openCases || 0,
      icon: FiClock,
      color: 'from-amber-500 to-amber-600',
      change: '+5%'
    },
    {
      title: 'Total Tasks',
      value: stats?.overview?.totalTasks || 0,
      icon: FiCheckSquare,
      color: 'from-emerald-500 to-emerald-600',
      change: '+23%'
    },
    {
      title: 'Completion Rate',
      value: `${stats?.overview?.tasksCompletion || 0}%`,
      icon: FiUsers,
      color: 'from-purple-500 to-purple-600',
      change: '+7%'
    }
  ];

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl p-6 text-white">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, Advocate</h1>
        <p className="text-blue-100 text-base mt-2">Here's what's happening with your practice today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Upcoming Deadlines Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 p-3 rounded-lg shadow-md">
            <FiCalendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Next Hearing</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {stats?.upcomingHearings?.[0]?.caseTitle || 'No upcoming hearings'}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <CaseStatusChart data={stats?.casesByStatus || []} />
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <CasePriorityChart data={stats?.casesByPriority || []} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <DocumentStatusChart data={stats?.documentsByStatus || []} />
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <TaskProgressChart percentage={stats?.overview?.tasksCompletion || 0} />
        </div>
      </div>

      {/* Recent Cases Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Recent Cases</h2>
            <p className="text-sm text-gray-500 mt-1">Latest updates from your active cases</p>
          </div>
          <button 
            onClick={handleViewAllCases}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center group bg-blue-50 px-4 py-2 rounded-lg transition-all hover:bg-blue-100"
          >
            View All
            <FiArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <RecentCasesTable cases={stats?.recentCases || []} />
      </div>
    </div>
  );
};

export default Dashboard;