'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import BottomNavigation from '@/components/BottomNavigation';
import ToastProvider from './providers/toast-provider';
import Header from '@/components/Header';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  return (
    <>
      {!isAuthPage && <Header />}
      <div className="bg-[#f5f3ff] min-h-screen w-full">
        <div className="px-4">
          {children}
        </div>
      </div>
      {!isAuthPage && <ToastProvider />}
      {!isAuthPage && <BottomNavigation />}
    </>
  );
}
