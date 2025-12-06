import React from 'react';
import {
  PlusIcon,
  PieChartIcon,
  UserIcon
} from '@/icons';
import Link from 'next/link';

export default function QuickActions() {
  return (
    <div className="col-span-12 rounded-lg border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 className="mb-5 text-xl font-semibold text-black dark:text-white">
        Quick Actions
      </h3>
      <div className="flex flex-wrap gap-4">
        <Link 
          href="/batches"
          className="inline-flex items-center justify-center rounded-lg bg-[#24a556] py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 transition-all gap-2 shadow-lg shadow-green-500/30"
        >
          <PlusIcon className="w-5 h-5 fill-current" />
          Create New Batch
        </Link>
        
        <Link 
          href="/trainees"
          className="inline-flex items-center justify-center rounded-lg bg-blue-500 py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 transition-all gap-2 shadow-lg shadow-blue-500/30"
        >
          <UserIcon className="w-5 h-5 fill-current" />
          Add Trainee
        </Link>

        <Link 
          href="/reports/weekly"
          className="inline-flex items-center justify-center rounded-lg bg-purple-500 py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 transition-all gap-2 shadow-lg shadow-purple-500/30"
        >
          <PieChartIcon className="w-5 h-5 fill-current" />
          View Reports
        </Link>
      </div>
    </div>
  );
}
