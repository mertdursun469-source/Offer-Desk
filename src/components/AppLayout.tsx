import React from 'react';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  currentPath: string;
}

export default function AppLayout({ children, currentPath }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F5F0E8' }}>
      <Sidebar currentPath={currentPath} />
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        {children}
      </main>
    </div>
  );
}