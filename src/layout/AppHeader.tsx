'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useSidebar } from '@/context/SidebarContext';

import ListIcon from '@/icons/list.svg';
import { ThemeToggleButton } from '@/components/common/ThemeToggleButton';

export default function AppHeader() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useSidebar();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 flex w-full bg-white drop-shadow-1 dark:bg-black dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4">
        {/* Right side - User info & actions */}
    <div className="flex items-center gap-3 2xsm:gap-7 ml-auto">
      <div className="hidden sm:flex items-center gap-2">
        <div className="text-right">
          <p className="text-sm font-medium text-dark dark:text-white">
            {user?.name}
          </p>
          <p className="text-xs text-dark-5 dark:text-slate-300 capitalize">
            {user?.role}
          </p>
        </div>
      </div>
      <ThemeToggleButton />

      <button
        onClick={handleLogout}
        className="bg-red-700 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-white  hover:bg-opacity-90 lg:px-6 xl:px-8"
      >
        Logout
      </button>
    </div>
  </div>
</header>
);
}