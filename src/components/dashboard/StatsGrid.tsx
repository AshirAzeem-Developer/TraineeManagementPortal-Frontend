import React from 'react';
import {
  GridIcon,
  GroupIcon,
  CalenderIcon,
  TaskIcon
} from '@/icons';

interface StatsGridProps {
  stats: {
    total_batches: number;
    active_trainees: number;
    weeks_completed: number;
    projects_submitted: number;
  };
  loading?: boolean;
}

const StatCard = ({ title, value, icon: Icon, colorClass, trend }: any) => {
  // Parsing color to use correct background utilities
  // Assuming colorClass is 'bg-color-500'
  const bgColor = colorClass.split(' ')[0];
  
  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className={`flex h-11.5 w-11.5 items-center justify-center rounded-full ${bgColor} text-white`}>
          <Icon className="h-6 w-6 fill-current" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
          <span>{trend.isPositive ? '↑' : '↓'}</span>
          <span>{trend.value}%</span>
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-2xl font-bold text-black dark:text-white">
            {value}
          </h4>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
        </div>
      </div>
    </div>
  );
};

export default function StatsGrid({ stats, loading }: StatsGridProps) {
  const displayStats = [
    {
      title: 'Total Batches',
      value: loading ? '...' : stats.total_batches,
      icon: GridIcon,
      colorClass: 'bg-purple-500',
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Active Trainees',
      value: loading ? '...' : stats.active_trainees,
      icon: GroupIcon,
      colorClass: 'bg-blue-500', 
      trend: { value: 4, isPositive: true }
    },
    {
      title: 'Weeks Completed',
      value: loading ? '...' : stats.weeks_completed,
      icon: CalenderIcon,
      colorClass: 'bg-orange-500',
      trend: { value: 8, isPositive: true }
    },
    {
      title: 'Projects Submitted',
      value: loading ? '...' : stats.projects_submitted,
      icon: TaskIcon,
      colorClass: 'bg-[#24a556]',
      trend: { value: 2, isPositive: false }
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      {displayStats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
