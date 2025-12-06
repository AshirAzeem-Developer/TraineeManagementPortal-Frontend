'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { dashboardService, DashboardStats } from '@/lib/api/dashboard.service';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    total_batches: 0,
    active_trainees: 0,
    weeks_completed: 0,
    projects_submitted: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-dark dark:text-white">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-dark-5 dark:text-dark-6 mt-2">
          You are logged in as <span className="capitalize font-medium">{user?.role}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Total Batches
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary">
            {loading ? '...' : stats.total_batches}
          </p>
        </div>

        <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Active Trainees
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary">
            {loading ? '...' : stats.active_trainees}
          </p>
        </div>

        <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Weeks Completed
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary">
            {loading ? '...' : stats.weeks_completed}
          </p>
        </div>

        <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Projects Submitted
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary">
            {loading ? '...' : stats.projects_submitted}
          </p>
        </div>
      </div>
    </div>
  );
}