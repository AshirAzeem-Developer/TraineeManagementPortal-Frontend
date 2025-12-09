'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { dashboardService, DashboardStats, ChartData } from '@/lib/api/dashboard.service';
import StatsGrid from '@/components/dashboard/StatsGrid';
import WeeklyProgressChart from '@/components/dashboard/WeeklyProgressChart';
import SubmissionChart from '@/components/dashboard/SubmissionChart';
import TraineeStatusChart from '@/components/dashboard/TraineeStatusChart';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import QuickActions from '@/components/dashboard/QuickActions';
import TraineeDashboard from '@/components/dashboard/TraineeDashboard';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    total_batches: 0,
    active_trainees: 0,
    weeks_completed: 0,
    projects_submitted: 0,
  });
  const [chartData, setChartData] = useState<ChartData>({
    weeklyProgress: [],
    submissionStats: [],
    traineeStatus: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'trainee') {
        setLoading(false);
        return;
    }

    const fetchDashboardData = async () => {
      try {
        const [statsData, chartsData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getChartData()
        ]);
        setStats(statsData);
        setChartData(chartsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (user?.role === 'trainee') {
    return <TraineeDashboard />;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Here's an overview of your training program performance.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Stats Grid */}
        <StatsGrid stats={stats} loading={loading} />

        {/* Charts Row 1 */}
        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
          <WeeklyProgressChart data={chartData.weeklyProgress} />
          <TraineeStatusChart data={chartData.traineeStatus} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
          <SubmissionChart data={chartData.submissionStats} />
          <ActivityFeed activities={chartData.recentActivity} />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
           <QuickActions />
        </div>
      </div>
    </div>
  );
}