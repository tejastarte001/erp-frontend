import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./MainLayout.css";
import { useAdminTheme } from '../admin-theme/AdminThemeContext';
import { useState } from 'react';

export default function MainLayout() {
  const { theme } = useAdminTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(() => {
    return localStorage.getItem('sidebarMinimized') === 'true';
  });

  const handleToggleMinimize = () => {
    setIsSidebarMinimized(prev => {
      const newState = !prev;
      localStorage.setItem('sidebarMinimized', String(newState));
      return newState;
    });
  };

  return (
    <div className={`layout admin-theme ${theme}`}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        isMinimized={isSidebarMinimized}
        onToggleMinimize={handleToggleMinimize}
      />
      <div className={`main-content ${isSidebarMinimized ? 'sidebar-minimized' : ''}`}>
        <Header />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}