import React from 'react';
import { 
  Grid, 
  Users, 
  Calendar, 
  CheckSquare,
  TrendingUp,
  TrendingDown 
} from 'lucide-react';

interface Trend {
  value: number;
  isPositive: boolean;
}

interface Stat {
  title: string;
  value: number | string;
  icon: React.ElementType;
  colorClass: string;
  trend: Trend;
}

interface StatsGridProps {
  stats: {
    total_batches: number;
    active_trainees: number;
    weeks_completed: number;
    projects_submitted: number;
  };
  loading?: boolean;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  colorClass: string;
  trend: Trend;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  colorClass, 
  trend 
}) => {
  const TrendIcon = trend.isPositive ? TrendingUp : TrendingDown;
  
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:to-gray-800/50" />
      
      <div className="relative z-10">
        {/* Header with icon and trend */}
        <div className="flex items-start justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${colorClass} bg-opacity-10 transition-transform duration-300 group-hover:scale-110 dark:bg-opacity-20`}>
            <Icon className={`h-6 w-6 ${colorClass.replace('bg-', 'text-')} transition-colors`} />
          </div>
          
          <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
            trend.isPositive 
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
              : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
          }`}>
            <TrendIcon className="h-3 w-3" />
            <span>{trend.value}%</span>
          </div>
        </div>

        {/* Value and title */}
        <div className="mt-5">
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              {value}
            </h3>
          </div>
          <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
        </div>

        {/* Progress indicator line */}
        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
          <div 
            className={`h-full ${colorClass} transition-all duration-500`}
            style={{ width: trend.isPositive ? '70%' : '45%' }}
          />
        </div>
      </div>
    </div>
  );
};

const StatsGrid: React.FC<StatsGridProps> = ({ stats, loading = false }) => {
  const displayStats: Stat[] = [
    {
      title: 'Total Batches',
      value: loading ? '...' : stats.total_batches,
      icon: Grid,
      colorClass: 'bg-purple-500',
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Active Trainees',
      value: loading ? '...' : stats.active_trainees,
      icon: Users,
      colorClass: 'bg-sky-500', 
      trend: { value: 4, isPositive: true }
    },
    {
      title: 'Weeks Completed',
      value: loading ? '...' : stats.weeks_completed,
      icon: Calendar,
      colorClass: 'bg-orange-500',
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Projects Submitted',
      value: loading ? '...' : stats.projects_submitted,
      icon: CheckSquare,
      colorClass: 'bg-emerald-500',
      trend: { value: 2, isPositive: false }
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {displayStats.map((stat, index) => (
        <StatCard key={`${stat.title}-${index}`} {...stat} />
      ))}
    </div>
  );
};

export default StatsGrid;
