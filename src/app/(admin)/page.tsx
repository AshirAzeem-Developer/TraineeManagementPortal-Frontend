'use client';

import { useAuthStore } from '@/store/authStore';

export default function DashboardPage() {
  const { user } = useAuthStore();

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
        {/* Stats cards will go here in future phases */}
        <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Total Batches
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary">0</p>
        </div>

        <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Active Trainees
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary">0</p>
        </div>

        <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Weeks Completed
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary">0</p>
        </div>

        <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
          <h3 className="text-lg font-semibold text-dark dark:text-white">
            Projects Submitted
          </h3>
          <p className="mt-2 text-3xl font-bold text-primary">0</p>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-gray-dark">
        <h2 className="text-xl font-semibold text-dark dark:text-white mb-4">
          🎉 Phase 1 Complete!
        </h2>
        <p className="text-dark-5 dark:text-dark-6">
          Authentication system is now fully functional. Ready to build Phase 2 features:
        </p>
        <ul className="mt-4 space-y-2 text-dark-5 dark:text-dark-6">
          <li>✅ User authentication working</li>
          <li>✅ Role-based access control</li>
          <li>✅ Protected routes</li>
          <li>⏳ Batch management (Next phase)</li>
          <li>⏳ Curriculum tracking (Next phase)</li>
          <li>⏳ Progress monitoring (Next phase)</li>
        </ul>
      </div>
    </div>
  );
}