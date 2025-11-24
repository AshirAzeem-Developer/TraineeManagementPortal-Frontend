import { Outfit } from 'next/font/google';
import type { Metadata } from "next";
import './globals.css';
import QueryProvider from "@/components/Providers/QueryProvider";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';

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
      <body className={`${outfit.className} dark:bg-gray-900`}>
        {/* <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider> */}
      <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
