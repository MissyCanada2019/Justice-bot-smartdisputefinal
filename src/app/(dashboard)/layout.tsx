'use client';

import { DashboardHeader } from '@/components/dashboard/header';
import { SidebarProvider, Sidebar, SidebarInset, SidebarRail } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/dashboard/sidebar-nav';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // This can show briefly before the redirect happens
    return null;
  }

  return (
      <SidebarProvider>
        <Sidebar>
            <SidebarRail />
            <SidebarNav />
        </Sidebar>
        <SidebarInset>
             <DashboardHeader />
            <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
    </SidebarProvider>
  );
}
