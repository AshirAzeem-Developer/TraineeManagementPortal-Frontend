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
    <header className="sticky top-0 z-50 flex w-full bg-white/80 backdrop-blur-md drop-shadow-sm dark:bg-gray-900/80 dark:backdrop-blur-md dark:drop-shadow-none border-b border-transparent dark:border-gray-800 transition-colors duration-300">
      <div className="flex flex-grow items-center justify-between px-4 py-3">
        {/* Right side - User info & actions */}
        <div className="flex items-center gap-3 2xsm:gap-7 ml-auto">
          <div className="hidden sm:flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user?.role}
              </p>
            </div>
          </div>
          <ThemeToggleButton />

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-center text-sm font-medium text-white transition duration-300 hover:bg-red-700 dark:bg-red-900/50 dark:hover:bg-red-900/80 dark:text-red-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
