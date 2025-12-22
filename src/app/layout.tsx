import { Outfit } from 'next/font/google';
import type { Metadata } from "next";
import './globals.css';
import QueryProvider from "@/components/Providers/QueryProvider";
import { Providers as HeroUIProviders } from "@/components/Providers/HeroUIProvider";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from 'react-hot-toast';
const outfit = Outfit({
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Trainee Management Portal",
  description: "Manage trainees, batches, and curriculum",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} bg-gray-50 dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            <QueryProvider>
              <HeroUIProviders>
                {children}
                <Toaster position="top-right" />
              </HeroUIProviders>
            </QueryProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
