'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useSidebar } from '@/context/SidebarContext';

import GridIcon from '@/icons/grid.svg';
import CalendarIcon from '@/icons/calendar.svg';
import GroupIcon from '@/icons/group.svg';
import TaskIcon from '@/icons/task.svg';
import CloseIcon from '@/icons/close.svg';
import UserIcon from '@/icons/user-line.svg';
import TimeIcon from '@/icons/time.svg';
import PieChartIcon from '@/icons/pie-chart.svg';

interface MenuItem {
  label: string;
  route: string;
  icon: React.ComponentType<any>;
  roles: string[];
}

const menuItems: MenuItem[] = [
  { label: 'Dashboard', route: '/', icon: GridIcon, roles: ['admin', 'trainer', 'trainee'] },
  { label: 'Profile', route: '/profile', icon: UserIcon, roles: ['trainee'] },
  { label: 'Attendance', route: '/attendance', icon: TimeIcon, roles: [ 'trainee'] },
  { label: 'Batches', route: '/batches', icon: CalendarIcon, roles: ['admin', 'trainer'] },
  { label: 'Trainees', route: '/trainees', icon: GroupIcon, roles: ['admin', 'trainer'] },
  { label: 'Curriculum', route: '/curriculum', icon: TaskIcon, roles: ['admin', 'trainer', 'trainee'] },
  { label: 'My Progress', route: '/my-progress', icon: TaskIcon, roles: ['trainee'] },
  { label: 'Assignments', route: '/assignments', icon: TaskIcon, roles: ['admin', 'trainer', 'trainee'] },
  { label: 'Reports', route: '/reports/weekly', icon: PieChartIcon, roles: ['admin', 'trainer'] },
];


export default function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { isExpanded, toggleSidebar } = useSidebar();

  const visibleMenuItems = menuItems.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false
  );

  return (
    <>
      {/* Backdrop for mobile */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden 
          bg-white dark:bg-gray-900 
          border-r border-gray-200 dark:border-gray-700
          duration-300 ease-linear lg:static lg:translate-x-0 
          ${isExpanded ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 dark:border-gray-700">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              TraineePortal
            </span>
          </Link>

          <button
            onClick={toggleSidebar}
            className="block text-gray-700 dark:text-gray-300 lg:hidden"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Menu */}
        <div className="no-scrollbar flex flex-col overflow-y-auto">
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            <h3 className="mb-4 ml-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
              MENU
            </h3>

            <ul className="flex flex-col gap-1.5">
              {visibleMenuItems.map((item) => {
                const isActive = pathname === item.route;
                const Icon = item.icon;

                return (
                  <li key={item.route}>
                    <Link
                      href={item.route}
                      className={`group flex items-center gap-3 rounded-md px-4 py-2.5 
                        text-sm font-medium 
                        transition duration-200 ease-in-out
                        
                        ${
                          isActive
                            ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <Icon
                        className={`w-5 h-5 transition 
                          ${
                            isActive
                              ? 'text-gray-900 dark:text-white'
                              : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                          }`}
                      />

                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
