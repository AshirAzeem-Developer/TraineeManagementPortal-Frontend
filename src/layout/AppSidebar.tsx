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

interface MenuItem {
  label: string;
  route: string;
  icon: React.ComponentType<any>;
  roles: string[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    route: '/',
    icon: GridIcon,
    roles: ['admin', 'trainer', 'trainee'],
  },
  {
    label: 'Profile',
    route: '/profile',
    icon: UserIcon,
    roles: ['admin', 'trainer', 'trainee'],
  },
  {
    label: 'Attendance',
    route: '/attendance',
    icon: TimeIcon,
    roles: ['trainee'],
  },
  {
    label: 'Batches',
    route: '/batches',
    icon: CalendarIcon,
    roles: ['admin', 'trainer'],
  },
  {
    label: 'Trainees',
    route: '/trainees',
    icon: GroupIcon,
    roles: ['admin', 'trainer'],
  },
  {
    label: 'Curriculum',
    route: '/curriculum',
    icon: TaskIcon,
    roles: ['admin', 'trainer'],
  },
  {
    label: 'My Progress',
    route: '/my-progress',
    icon: TaskIcon,
    roles: ['trainee'],
  },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter(item =>
    user?.role ? item.roles.includes(user.role) : false
  );

  return (
    <>
      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-[999] bg-dark/40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-[9999] flex h-screen w-72 flex-col overflow-y-hidden bg-dark duration-300 ease-linear lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">
              TraineePortal
            </span>
          </Link>

          <button
            onClick={toggleSidebar}
            className="block text-white lg:hidden"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Menu */}
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            <div>
              <h3 className="mb-4 ml-4 text-sm font-semibold text-white/70">
                MENU
              </h3>

              <ul className="mb-6 flex flex-col gap-1.5">
                {visibleMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.route;

                  return (
                    <li key={item.route}>
                      <Link
                        href={item.route}
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-white/80 duration-300 ease-in-out hover:bg-white/10 ${
                          isActive && 'bg-white/10 text-white'
                        }`}
                      >
                        <Icon className="fill-current" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}