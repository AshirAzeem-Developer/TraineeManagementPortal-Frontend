'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import AppSidebar from '@/layout/AppSidebar';
import AppHeader from '@/layout/AppHeader';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { checkAuth, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="flex h-screen overflow-hidden">
          <AppSidebar />
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <AppHeader />
            <main className="grow">
              <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}