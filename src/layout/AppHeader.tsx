'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useSidebar } from '@/context/SidebarContext';

import ListIcon from '@/icons/list.svg';
import { ThemeToggleButton } from '@/components/common/ThemeToggleButton';
import Link from 'next/link';
import { LayoutList, LucideToggleRight, Menu } from 'lucide-react';

export default function AppHeader() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useSidebar();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 flex w-full bg-white dark:bg-[#222E3C] border-b border-gray-100 dark:border-[#2f3d4d] transition-colors duration-300">
      <div className="flex flex-grow items-center justify-between px-4 py-4 md:px-6 2xl:px-11">
        
        {/* Mobile Toggle & Logo */}
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              toggleSidebar();
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <LayoutList className="h-6 w-6 text-gray-600 dark:text-white" />
          </button>
          
          <Link className="block flex-shrink-0 lg:hidden" href="/">
             <div className="w-8 h-8 rounded-lg bg-[#24a556] flex items-center justify-center text-white font-bold">
                TP
             </div>
          </Link>
        </div>

        {/* Desktop Toggle Button */}
        <div className="hidden lg:block mr-4">
             <button
            onClick={() => toggleSidebar()}
            className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          >
             {/* Hamburger Icon */}
             <LayoutList className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
          </button>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7 ml-auto">
          {/* Icons Group */}
           <div className="hidden sm:flex items-center gap-4 border-r border-gray-200 dark:border-gray-700 pr-6">
             <button className="text-gray-500 hover:text-[#24a556] dark:text-gray-400 dark:hover:text-white transition-colors">
                <span className="sr-only">Notifications</span>
                 {/* Replace with actual Bell Icon if available */}
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
             </button>
             <ThemeToggleButton />
           </div>

          <div className="relative">
             <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 focus:outline-none"
             >
                {/* User Profile */}
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name || "User Name"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user?.role || "Role"}
                  </span>
                </div>
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                   {/* User Avatar Placeholder */}
                   <LayoutList className="h-full w-full text-gray-400 p-2" fill="currentColor" viewBox="0 0 24 24" />
                </div>
             </button>

             {/* Dropdown Menu */}
             {dropdownOpen && (
               <div className="absolute right-0 mt-4 w-48 rounded-md border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-[#1e293b]">
                 <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 sm:hidden">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
                 </div>
                 
                 <Link 
                   href="/profile" 
                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
                   onClick={() => setDropdownOpen(false)}
                 >
                   My Profile
                 </Link>
                 <Link 
                   href="/settings" 
                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
                   onClick={() => setDropdownOpen(false)}
                 >
                   Account Settings
                 </Link>
                 <button
                   onClick={handleLogout}
                   className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700/50"
                 >
                   Logout
                 </button>
               </div>
             )}
          </div>
        </div>
      </div>
    </header>
  );
}
