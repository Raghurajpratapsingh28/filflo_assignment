import { useState, ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useSidebar } from '../../context/SidebarContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { sidebarWidth } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main 
        className="pt-16 transition-all duration-300 ease-in-out"
        style={{ 
          '--sidebar-width': `${sidebarWidth}px`,
          marginLeft: 'var(--sidebar-width)'
        } as React.CSSProperties & { '--sidebar-width': string }}
      >
        <div className="p-6">
          {children}
        </div>

        <footer className="border-t border-gray-200 bg-white py-4 px-6 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-600">
            <p>&copy; 2025 Inventory Management Dashboard. All rights reserved.</p>
            <p>Version 1.0.0</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
