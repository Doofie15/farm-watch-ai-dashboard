import React from 'react';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const LeafIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M100,20 C140,20 170,50 170,90 C170,130 140,160 100,180 C60,160 30,130 30,90 C30,50 60,20 100,20 Z" 
      transform="rotate(45 100 100)" 
      fill="#6cb33f" // Main leaf color (AWK Green)
    />
    <path 
      d="M100,90 Q110,70 120,50 C130,70 110,110 100,130 Q90,110 70,50 C80,70 90,90 100,90 Z" 
      fill="#8fcc5f" // Lighter green for highlight/vein
      transform="rotate(45 100 100) translate(0, -5)"
    />
  </svg>
);


const Header: React.FC<HeaderProps> = ({ onToggleSidebar, sidebarOpen }) => {
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
            <LeafIcon className="w-8 h-8 mr-1 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 flex items-baseline">
              <span style={{ color: '#006838' /* AGRI Dark Green */ }} className="font-bold">AGRI</span>
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
           <button className="p-2 rounded-full text-slate-500 hover:text-emerald-600 hover:bg-slate-100 focus:outline-none" title="User Profile">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
           </button>
        </div>
      </div>
    </header>
  );
};

export default Header;