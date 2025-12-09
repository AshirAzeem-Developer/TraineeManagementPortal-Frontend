'use client';

import React, { useState, useEffect } from 'react';
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
import ChevronDownIcon from '@/icons/chevron-down.svg';

interface MenuItem {
  label: string;
  route: string;
  icon: React.ComponentType<any>;
  roles: string[];
  children?: MenuItem[];
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
  { 
    label: 'Reports', 
    route: '/reports', 
    icon: PieChartIcon, 
    roles: ['admin', 'trainer'],
    children: [
      { label: 'Weekly Report', route: '/reports/weekly', icon: PieChartIcon, roles: ['admin', 'trainer'] },
      { label: 'Monthly Report', route: '/reports/monthly', icon: PieChartIcon, roles: ['admin', 'trainer'] },
    ]
  },
  { label: 'Capstone', route: '/capstone', icon: TaskIcon, roles: ['admin', 'trainer', 'trainee'] },
  { label: 'Certificate', route: '/certificate', icon: TaskIcon, roles: ['trainee'] },
];


export default function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { isExpanded, toggleSidebar } = useSidebar();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    // Open the menu if the current path is within a submenu
    menuItems.forEach(item => {
      if (item.children) {
        if (item.children.some(child => pathname === child.route)) {
          setOpenMenu(item.label);
        }
      }
    });
  }, [pathname]);

  const handleMenuClick = (item: MenuItem, e: React.MouseEvent) => {
    if (item.children) {
      e.preventDefault();
      setOpenMenu(openMenu === item.label ? null : item.label);
    }
  };

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
                // Check active status differently for parent vs simple link
                const isActive = pathname === item.route || (item.children && item.children.some(child => pathname === child.route));
                const Icon = item.icon;
                const isOpen = openMenu === item.label;

                return (
                  <li key={item.label}>
                    <Link
                      href={item.children ? '#' : item.route}
                      onClick={(e) => handleMenuClick(item, e)}
                      className={`group flex items-center justify-between gap-3 rounded-md px-4 py-2.5 
                        text-sm font-medium 
                        transition duration-200 ease-in-out
                        ${
                          isActive && !item.children
                            ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-5 h-5 transition 
                            ${
                              isActive && !item.children
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                            }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      
                      {item.children && (
                        <ChevronDownIcon 
                          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      )}
                    </Link>

                    {/* Submenu */}
                    {item.children && isOpen && (
                      <ul className="mt-2 flex flex-col gap-1.5 pl-9">
                        {item.children.map((child) => {
                          const isChildActive = pathname === child.route;
                          return (
                            <li key={child.route}>
                              <Link
                                href={child.route}
                                className={`group flex items-center gap-2 rounded-md px-4 py-2 
                                  text-sm font-medium 
                                  transition duration-200 ease-in-out
                                  ${
                                    isChildActive
                                      ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
                                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                                  }
                                `}
                              >
                                {child.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
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
