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
      {children}
      {!isAuthPage && <ToastProvider />}
      {!isAuthPage && <BottomNavigation />}
    </>
  );
}
