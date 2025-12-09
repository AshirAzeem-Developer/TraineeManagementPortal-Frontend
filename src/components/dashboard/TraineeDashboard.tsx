'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import assignmentService from '@/lib/api/assignment.service';
import dynamic from 'next/dynamic';

// Dynamically import charts to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function TraineeDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentAssignments, setRecentAssignments] = useState<any[]>([]);
  const [weeklyScores, setWeeklyScores] = useState<any[]>([]);

  useEffect(() => {
    const fetchTraineeData = async () => {
      try {
        const [progressData, assignmentsData, scoresData] = await Promise.all([
          assignmentService.getMyProgress(),
          assignmentService.getMyAssignments(),
          assignmentService.getWeeklyScores()
        ]);

        setStats(progressData);
        // Filter for pending or recently graded
        setRecentAssignments(assignmentsData.slice(0, 5));
        setWeeklyScores(scoresData); // Assuming simple array of objects { week: string, score: number }
      } catch (error) {
        console.error('Failed to fetch trainee data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTraineeData();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading dashboard...</div>;
  }

  // Chart Config
  const chartOptions: any = {
    chart: {
      type: 'area',
      height: 350,
      zoom: { enabled: false },
      toolbar: { show: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    xaxis: {
      categories: weeklyScores.map((s: any) => s.week || s.title || 'Week'),
    },
    colors: ['#3C50E0'],
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 90, 100]
        }
    }
  };

  const chartSeries = [{
    name: 'Score',
    data: weeklyScores.map((s: any) => s.score || s.average_score || 0)
  }];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Track your learning progress and upcoming tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardStats 
            title="Total Assignments" 
            value={stats?.total_assignments || 0} 
            icon={<svg className="fill-primary dark:fill-white" width="22" height="22" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/><path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z"/></svg>}
        />
        <CardStats 
            title="Completed" 
            value={stats?.completed_assignments || 0} 
            color="text-green-500"
             icon={<svg className="fill-success dark:fill-white" width="22" height="22" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
        />
        <CardStats 
            title="Pending" 
            value={stats?.pending_assignments || 0} 
            color="text-yellow-500"
            icon={<svg className="fill-warning dark:fill-white" width="22" height="22" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>}
        />
        <CardStats 
            title="Average Score" 
            value={`${stats?.average_score || 0}%`} 
             icon={<svg className="fill-secondary dark:fill-white" width="22" height="22" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 12l-5-5 1.41-1.41L12 12.17l3.59-3.59L17 10l-5 5z"/></svg>}
        />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/* Chart */}
        <div className="col-span-12 xl:col-span-8 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
            <h3 className="text-xl font-bold text-black dark:text-white mb-4">Weekly Performance</h3>
             <div>
                <div id="chartOne" className="-ml-5">
                <ReactApexChart
                    options={chartOptions}
                    series={chartSeries}
                    type="area"
                    height={350}
                />
                </div>
            </div>
        </div>

        {/* Recent Assignments */}
        <div className="col-span-12 xl:col-span-4 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
            <h3 className="text-xl font-bold text-black dark:text-white mb-4">Recent Assignments</h3>
            <div className="flex flex-col gap-4">
                {recentAssignments.length > 0 ? recentAssignments.map((assignment: any) => (
                    <div key={assignment.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-meta-4 transition">
                        <div className={`p-2 rounded-full ${getStatusColor(assignment)} bg-opacity-20`}>
                           {getStatusIcon(assignment)}
                        </div>
                        <div>
                            <h4 className="font-medium text-black dark:text-white text-sm">{assignment.title}</h4>
                            <p className="text-xs text-gray-500">{new Date(assignment.created_at).toLocaleDateString()}</p>
                        </div>
                         <div className="ml-auto">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(assignment)}`}>
                                {getStatusText(assignment)}
                            </span>
                        </div>
                    </div>
                )) : (
                    <p className="text-gray-500 text-sm">No assignments found.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

const CardStats = ({ title, value, icon, color }: any) => (
  <div className="rounded-sm border border-stroke bg-white hover:shadow-lg transition-shadow py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
    <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
      {icon}
    </div>
    <div className="mt-4 flex items-end justify-between">
      <div>
        <h4 className={`text-title-md font-bold text-black dark:text-white ${color}`}>
          {value}
        </h4>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
      </div>
    </div>
  </div>
);

// Helpers
const getStatusColor = (assignment: any) => {
    if (assignment.my_submission?.status === 'graded') return 'text-green-500 bg-green-500';
    if (assignment.my_submission?.status === 'submitted') return 'text-blue-500 bg-blue-500';
    return 'text-yellow-500 bg-yellow-500';
};

const getStatusIcon = (assignment: any) => {
    // Return simple SVG or icon based on status
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>;
};

const getStatusBadgeColor = (assignment: any) => {
    const status = assignment.my_submission?.status || 'pending';
    switch(status) {
        case 'graded': return 'bg-green-100 text-green-700';
        case 'submitted': return 'bg-blue-100 text-blue-700';
         case 'resubmit': return 'bg-red-100 text-red-700';
        default: return 'bg-yellow-100 text-yellow-700';
    }
}

const getStatusText = (assignment: any) => {
    return (assignment.my_submission?.status || 'Pending').replace('_', ' ');
}
