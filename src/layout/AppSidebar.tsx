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
  { label: 'Attendance', route: '/attendance', icon: TimeIcon, roles: ['trainee'] },
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
  const { isExpanded, toggleSidebar, isHovered, setIsHovered } = useSidebar();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const isSidebarFull = isExpanded || isHovered;

  useEffect(() => {
    // Open the menu if the current path is within a submenu
    menuItems.forEach((item) => {
      if (item.children) {
        if (item.children.some((child) => pathname === child.route)) {
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

      {/* Sidebar Spacer (Invisible, holds layout space on desktop) */}
      {/* Visual Logic: 
          - If Expanded: Sidebar is STATIC (relative), so it takes its own space (w-72). Spacer is NOT needed.
          - If Collapsed: Sidebar is FIXED (w-88px base). Spacer is REQUIRED (w-88px) to hold the gap.
      */}
      {!isExpanded && (
        <div className="hidden lg:block w-[88px] shrink-0 transition-[width] duration-300 ease-in-out" />
      )}

      {/* Actual Sidebar */}
      <aside
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => !isExpanded && setIsHovered(false)}
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col 
          bg-white dark:bg-[#222E3C] 
          border-r border-transparent dark:border-[#2f3d4d] shadow-sm dark:shadow-none
          transition-all duration-300 ease-in-out
          ${
            isExpanded 
              ? 'translate-x-0 w-72 lg:static lg:translate-x-0' 
              : `-translate-x-full lg:translate-x-0 ${
                  isHovered ? 'lg:w-72 lg:shadow-xl lg:z-[999]' : 'lg:w-[88px]'
                }`
          }`}
      >
        {/* Header */}
        <div 
          className={`flex items-center border-b border-transparent dark:border-[#2f3d4d] py-6 transition-all duration-300 ${
            isSidebarFull ? 'px-6 justify-between' : 'px-4 justify-center'
          }`}
        >
          <Link href="/" className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            {/* Logo Icon */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#24a556]">
              <GridIcon className="h-5 w-5 text-white" />
            </div>
            <span 
              className={`text-2xl font-bold text-gray-900 dark:text-white tracking-tight transition-all duration-300 origin-left ${
                isSidebarFull ? 'opacity-100 w-auto ml-2' : 'opacity-0 w-0 ml-0'
              }`}
            >
              TraineePortal
            </span>
          </Link>

          <button
            onClick={toggleSidebar}
            className="block text-gray-700 dark:text-gray-300 lg:hidden"
            aria-label="Close sidebar"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Menu */}
        <div className="no-scrollbar flex flex-col overflow-y-auto">
          <nav className={`mt-5 py-4 lg:mt-9 transition-all duration-300 ${
            isSidebarFull ? 'px-4 lg:px-6' : 'px-2'
          }`}>
            <h3 
              className={`mb-4 text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider transition-all duration-300 overflow-hidden whitespace-nowrap ${
                isSidebarFull ? 'opacity-100 ml-2' : 'opacity-0 w-0 ml-0'
              }`}
            >
              MENU
            </h3>

            <ul className="flex flex-col gap-1.5">
              {visibleMenuItems.map((item) => {
                const isActive = pathname === item.route || 
                  (item.children && item.children.some((child) => pathname === child.route));
                const Icon = item.icon;
                const isOpen = openMenu === item.label;

                return (
                  <li key={item.label}>
                    <Link
                      href={item.children ? '#' : item.route}
                      onClick={(e) => handleMenuClick(item, e)}
                      className={`group flex items-center rounded-xl py-3 text-sm font-medium transition-all duration-200 ease-in-out ${
                        isActive && !item.children
                          ? 'bg-[#24a556]/10 text-[#24a556] dark:bg-[#24a556] dark:text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                      } ${
                        isSidebarFull ? 'px-4 gap-3 justify-between' : 'px-0 justify-center'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Icon
                          className={`w-5 h-5 shrink-0 transition-colors duration-200 ${
                            isActive && !item.children
                              ? 'text-[#24a556] dark:text-white'
                              : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'
                          }`}
                        />
                        <span 
                          className={`whitespace-nowrap transition-all duration-300 origin-left ${
                            isSidebarFull ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                      
                      {item.children && (
                        <div 
                          className={`shrink-0 transition-all duration-300 ${
                            isSidebarFull ? 'opacity-100 w-4' : 'opacity-0 w-0 overflow-hidden'
                          }`}
                        >
                          <ChevronDownIcon 
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      )}
                    </Link>

                    {/* Submenu */}
                    {item.children && isOpen && isSidebarFull && (
                      <ul className="mt-2 flex flex-col gap-1 px-4 animate-in slide-in-from-top-2 duration-200">
                        {item.children.map((child) => {
                          const isChildActive = pathname === child.route;
                          return (
                            <li key={child.route}>
                              <Link
                                href={child.route}
                                className={`group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition duration-200 ease-in-out ${
                                  isChildActive
                                    ? 'text-[#24a556] dark:text-[#24a556]'
                                    : 'text-gray-500 hover:text-[#24a556] dark:text-gray-400 dark:hover:text-white'
                                }`}
                              >
                                <span 
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    isChildActive 
                                      ? 'bg-[#24a556]' 
                                      : 'bg-gray-400 group-hover:bg-[#24a556]'
                                  }`}
                                />
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