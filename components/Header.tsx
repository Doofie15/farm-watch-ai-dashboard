import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  onNavigateToPage: (page: string) => void;
}

// Removed unused LeafIcon component


const Header: React.FC<HeaderProps> = ({ onToggleSidebar, sidebarOpen, onNavigateToPage }) => {
  const { user } = useAuth();
  return (
    <header className="bg-white text-slate-700 shadow-md sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full">
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="text-slate-600 hover:text-emerald-600 focus:outline-none mr-3 p-2 rounded-md hover:bg-slate-100"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
          
          <div className="flex items-center">
            <img 
              src="/images/agri-logo.svg" 
              alt="AGRI Western Cape Logo" 
              className="h-10 mr-3" 
            />
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 flex items-baseline">
              <span className="text-emerald-600 ml-1.5">FarmWatch</span>
              <span className="text-slate-500 ml-1">AI</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
           <button className="p-2 rounded-full text-slate-500 hover:text-emerald-600 hover:bg-slate-100 focus:outline-none" title="Notifications">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
            </svg>
           </button>
           <button 
             onClick={() => onNavigateToPage('User Profile')}
             className="p-2 rounded-full text-slate-500 hover:text-emerald-600 hover:bg-slate-100 focus:outline-none flex items-center" 
             title="User Profile"
           >
             <div className="hidden md:flex items-center mr-2">
               <span className="text-sm font-medium">{user?.firstName || 'User'}</span>
             </div>
             <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
               {user?.firstName ? user.firstName.charAt(0) + (user.lastName ? user.lastName.charAt(0) : '') : 'U'}
             </div>
           </button>
        </div>
      </div>
    </header>
  );
};

export default Header;