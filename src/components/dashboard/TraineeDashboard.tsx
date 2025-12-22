'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import assignmentService from '@/lib/api/assignment.service';
import dynamic from 'next/dynamic';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  AlertCircle,
  Calendar
} from 'lucide-react';
import type { Assignment } from '@/types';

// Dynamically import charts to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface TraineeStats {
  total_assignments: number;
  completed_assignments: number;
  pending_assignments: number;
  average_score: number;
}

interface WeeklyScore {
  week?: string;
  title?: string;
  score?: number;
  average_score?: number;
}

export default function TraineeDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<TraineeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentAssignments, setRecentAssignments] = useState<Assignment[]>([]);
  const [weeklyScores, setWeeklyScores] = useState<WeeklyScore[]>([]);

  useEffect(() => {
    const fetchTraineeData = async () => {
      try {
        setError(null);
        const [progressData, assignmentsData, scoresData] = await Promise.all([
          assignmentService.getMyProgress(),
          assignmentService.getMyAssignments(),
          assignmentService.getWeeklyScores()
        ]);

        setStats(progressData);
        setRecentAssignments(assignmentsData.slice(0, 5));
        setWeeklyScores(scoresData);
      } catch (err) {
        console.error('Failed to fetch trainee data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTraineeData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-500 dark:border-gray-700 dark:border-t-emerald-400" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-900/20">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 dark:text-red-400" />
          <h3 className="mt-4 text-lg font-semibold text-red-900 dark:text-red-200">
            Error Loading Dashboard
          </h3>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Chart Config with dark mode support
  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
      zoom: { enabled: false },
      toolbar: { show: false },
      background: 'transparent',
      foreColor: '#9CA3AF'
    },
    dataLabels: { enabled: false },
    stroke: { 
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: weeklyScores.map((s) => s.week || s.title || 'Week'),
      labels: {
        style: {
          colors: '#9CA3AF'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#9CA3AF'
        },
        formatter: (value) => `${value}%`
      }
    },
    colors: ['#10b981'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false
        }
      }
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (value) => `${value}%`
      }
    }
  };

  const chartSeries = [{
    name: 'Score',
    data: weeklyScores.map((s) => s.score || s.average_score || 0)
  }];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track your learning progress and upcoming tasks.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <CardStats 
          title="Total Assignments" 
          value={stats?.total_assignments || 0} 
          icon={<FileText className="h-5 w-5" />}
          colorClass="bg-sky-500"
        />
        <CardStats 
          title="Completed" 
          value={stats?.completed_assignments || 0} 
          icon={<CheckCircle className="h-5 w-5" />}
          colorClass="bg-emerald-500"
        />
        <CardStats 
          title="Pending" 
          value={stats?.pending_assignments || 0} 
          icon={<Clock className="h-5 w-5" />}
          colorClass="bg-yellow-400"
        />
        <CardStats 
          title="Average Score" 
          value={`${stats?.average_score || 0}%`} 
          icon={<TrendingUp className="h-5 w-5" />}
          colorClass="bg-purple-500"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        {/* Performance Chart */}
        <div className="col-span-12 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 xl:col-span-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Weekly Performance
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Your scores over time
              </p>
            </div>
          </div>
          
          {weeklyScores.length > 0 ? (
            <div className="-mx-2">
              <ReactApexChart
                options={chartOptions}
                series={chartSeries}
                type="area"
                height={350}
              />
            </div>
          ) : (
            <div className="flex h-[350px] items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="text-center">
                <TrendingUp className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                  No performance data available yet
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Recent Assignments */}
        <div className="col-span-12 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 xl:col-span-4">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Assignments
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Your latest tasks
            </p>
          </div>
          
          <div className="space-y-3">
            {recentAssignments.length > 0 ? (
              recentAssignments.map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))
            ) : (
              <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="text-center">
                  <FileText className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-600" />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    No assignments found
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
interface CardStatsProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  colorClass: string;
}

const CardStats: React.FC<CardStatsProps> = ({ title, value, icon, colorClass }) => (
  <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:to-gray-900/50" />
    
    <div className="relative z-10">
      <div className="flex items-start justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${colorClass} bg-opacity-10 transition-transform duration-300 group-hover:scale-110 dark:bg-opacity-20`}>
          <div className={`${colorClass.replace('bg-', 'text-')}`}>
            {icon}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {value}
        </h3>
        <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
      </div>
    </div>
  </div>
);

// Assignment Card Component
interface AssignmentCardProps {
  assignment: Assignment;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ assignment }) => {
  const status = assignment.my_submission?.status || 'pending';
  
  const statusConfig = {
    graded: {
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
      icon: <CheckCircle className="h-4 w-4" />,
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      text: 'Graded'
    },
    submitted: {
      color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
      icon: <FileText className="h-4 w-4" />,
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      text: 'Submitted'
    },
    resubmit: {
      color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
      icon: <AlertCircle className="h-4 w-4" />,
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
      text: 'Resubmit'
    },
    pending: {
      color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
      icon: <Clock className="h-4 w-4" />,
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      text: 'Pending'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className="group rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600">
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.iconBg}`}>
          <div className={config.iconColor}>
            {config.icon}
          </div>
        </div>
        
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-semibold text-gray-900 dark:text-white">
            {assignment.title}
          </h4>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>{new Date(assignment.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${config.color}`}>
          {config.text}
        </span>
      </div>
      
      {assignment.my_submission?.score !== undefined && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Score:</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {assignment.my_submission.score}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};