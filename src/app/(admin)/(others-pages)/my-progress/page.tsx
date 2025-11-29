'use client';

import { useQuery } from '@tanstack/react-query';
import evaluationService from '@/lib/api/evaluation.service';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MyProgressPage() {
  // Fetch progress data
  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ['my-progress'],
    queryFn: () => evaluationService.getMyProgress(),
  });

  // Fetch weekly scores
  const { data: weeklyScores, isLoading: weeklyLoading } = useQuery({
    queryKey: ['weekly-scores'],
    queryFn: () => evaluationService.getWeeklyScores(),
  });

  // Fetch category scores
  const { data: categoryScores, isLoading: categoryLoading } = useQuery({
    queryKey: ['category-scores'],
    queryFn: () => evaluationService.getCategoryScores(),
  });

  if (progressLoading || weeklyLoading || categoryLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Chart data
  const weeklyChartData = {
    labels: weeklyScores?.map((w: any) => `Week ${w.week}`) || [],
    datasets: [
      {
        label: 'Average Score',
        data: weeklyScores?.map((w: any) => w.score) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const categoryChartData = {
    labels: categoryScores?.map((c: any) => c.category) || [],
    datasets: [
      {
        label: 'Category Scores',
        data: categoryScores?.map((c: any) => c.average_score) || [],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <div>
      <PageBreadCrumb pageTitle="My Progress" />

      {/* Overall Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <p className="text-sm text-dark-5 dark:text-dark-6">Assignments Completed</p>
          <p className="text-3xl font-bold text-primary">
            {progressData?.overall?.assignments_completed || 0}
          </p>
        </div>

        <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <p className="text-sm text-dark-5 dark:text-dark-6">Total Points</p>
<p className="text-3xl font-bold text-green-500">
{progressData?.overall?.total_points || 0}
</p>
</div><div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
      <p className="text-sm text-dark-5 dark:text-dark-6">Average Score</p>
      <p className="text-3xl font-bold text-blue-500">
        {progressData?.overall?.average_score || 0}%
      </p>
    </div>

    <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
      <p className="text-sm text-dark-5 dark:text-dark-6">Max Possible</p>
      <p className="text-3xl font-bold text-dark dark:text-white">
        {progressData?.overall?.total_possible || 0}
      </p>
    </div>
  </div>

  {/* Weekly Performance Chart */}
  <div className="mb-6 rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
    <h3 className="mb-4 text-xl font-semibold text-dark dark:text-white">
      Weekly Performance
    </h3>
    <Line data={weeklyChartData} options={{ responsive: true }} />
  </div>

  {/* Category Scores Chart */}
  <div className="mb-6 rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
    <h3 className="mb-4 text-xl font-semibold text-dark dark:text-white">
      Category Breakdown
    </h3>
    <Bar data={categoryChartData} options={{ responsive: true, scales: { y: { beginAtZero: true, max: 100 } } }} />
  </div>

  {/* Detailed Progress Table */}
  <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark">
    <div className="p-6">
      <h3 className="text-xl font-semibold text-dark dark:text-white">
        Detailed Progress
      </h3>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-dark-2">
            <th className="px-4 py-4 font-medium text-dark dark:text-white">Week</th>
            <th className="px-4 py-4 font-medium text-dark dark:text-white">Completed</th>
            <th className="px-4 py-4 font-medium text-dark dark:text-white">Average</th>
            <th className="px-4 py-4 font-medium text-dark dark:text-white">Points</th>
          </tr>
        </thead>
        <tbody>
          {progressData?.progress?.map((prog: any) => (
            <tr key={prog.id} className="border-b border-stroke dark:border-dark-3">
              <td className="px-4 py-4">
                {prog.week ? `Week ${prog.week.week_number} - ${prog.week.title}` : 'N/A'}
              </td>
              <td className="px-4 py-4">{prog.assignments_completed}</td>
              <td className="px-4 py-4">{prog.average_score}%</td>
              <td className="px-4 py-4">
                {prog.total_points_earned}/{prog.total_points_possible}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
);
}