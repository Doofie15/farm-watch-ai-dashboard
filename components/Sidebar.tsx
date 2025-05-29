
import React, { useState } from 'react';
import { MOCK_WHATSAPP_MESSAGES } from '../constants';
import { 
    DashboardIcon, 
    AnalyticsIcon, 
    ReportsIcon, 
    MapIcon, 
    SettingsIcon, 
    ConfigIcon, 
    MessagesIcon, 
    UserIcon,
    AddIcon,
    UserGroupIcon,
    ChevronDownIcon,
    ChevronRightIcon
} from './ui/Icons'; // Assuming Chevron icons are added to Icons.tsx

interface SidebarProps {
  isOpen: boolean;
  currentPage: string;
  setPage: (page: string) => void;
  onToggle: () => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  pageName: string;
  currentPage: string;
  setPage: (page: string) => void;
  isSidebarOpen: boolean;
  badgeCount?: number;
  isSubItem?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, pageName, currentPage, setPage, isSidebarOpen, badgeCount, isSubItem = false }) => {
  const isActive = currentPage === pageName;
  return (
    <li>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setPage(pageName);
        }}
        className={`relative flex items-center p-3 my-1 rounded-lg text-slate-200 hover:bg-slate-700 hover:text-white transition-colors duration-150 group ${
          isActive ? 'bg-emerald-600 text-white shadow-lg' : ''
        } ${isSubItem && isSidebarOpen ? 'pl-10' : ''}`}
        title={!isSidebarOpen ? label : ''}
      >
        <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>{icon}</span>
        {isSidebarOpen && (
          <span className={`ml-3 text-sm font-medium whitespace-nowrap overflow-hidden transition-opacity duration-200 ease-in-out`}>
            {label}
          </span>
        )}
        {badgeCount && badgeCount > 0 && (
           <span className={`absolute top-1.5 ${isSidebarOpen ? 'right-2.5' : 'right-1.5'}  inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full`}>
            {badgeCount}
          </span>
        )}
      </a>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentPage, setPage, onToggle }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(currentPage.startsWith('Config:'));

  React.useEffect(() => {
    if (currentPage.startsWith('Config:')) {
      setIsConfigOpen(true);
    }
  }, [currentPage]);

  const mainNavItems = [
    { icon: DashboardIcon, label: 'Dashboard', pageName: 'Dashboard' },
    { icon: AnalyticsIcon, label: 'Analytics Hub', pageName: 'Analytics Hub' },
  ];

  const incidentManagementNavItems = [
    { icon: AddIcon, label: 'Add Incident', pageName: 'Add Incident' },
    { icon: UserGroupIcon, label: 'Reporter Directory', pageName: 'Reporter Directory'},
  ];

  const communicationNavItems = [
    { icon: MessagesIcon, label: 'WhatsApp Messages', pageName: 'WhatsApp Messages', badgeCount: MOCK_WHATSAPP_MESSAGES.filter(msg => !msg.isRead).length },
  ];

  const operationsNavItems = [
    { icon: ReportsIcon, label: 'Reports', pageName: 'Reports' },
    { icon: MapIcon, label: 'Live Map', pageName: 'Live Map' },
  ];

  const systemSettingsItem = { icon: SettingsIcon, label: 'Settings', pageName: 'Settings' };

  const configSubItems = [
    { icon: <span className="w-5 h-5 inline-block text-center opacity-70">-</span>, label: 'Incident Types', pageName: 'Config: Incident Types' },
    { icon: <span className="w-5 h-5 inline-block text-center opacity-70">-</span>, label: 'Severities', pageName: 'Config: Severities' },
    { icon: <span className="w-5 h-5 inline-block text-center opacity-70">-</span>, label: 'Statuses', pageName: 'Config: Statuses' },
    { icon: <span className="w-5 h-5 inline-block text-center opacity-70">-</span>, label: 'User Types', pageName: 'Config: User Types' },
    { icon: <span className="w-5 h-5 inline-block text-center opacity-70">-</span>, label: 'AI Settings', pageName: 'Config: AI Settings' },
    { icon: <span className="w-5 h-5 inline-block text-center opacity-70">-</span>, label: 'Integrations', pageName: 'Config: Integrations' },
    { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 opacity-70"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 11.25c0-1.034-.84-1.875-1.875-1.875H4.875c-1.035 0-1.875.841-1.875 1.875m18 0v5.25c0 1.034-.84 1.875-1.875 1.875H4.875c-1.035 0-1.875-.841-1.875-1.875v-5.25m18 0A2.625 2.625 0 0 0 18.375 9H5.625A2.625 2.625 0 0 0 3 11.25m18 0V6.75A2.625 2.625 0 0 0 18.375 4.5H5.625A2.625 2.625 0 0 0 3 6.75v4.5m14.25-3.875C17.25 6.962 16.306 6 15.187 6H8.813c-1.125 0-2.063.962-2.063 2.125m10.5 0H7.125" /></svg>, label: 'System Settings', pageName: 'Config: System Settings' },
  ];

  const navSections = [
    { title: 'Main Menu', items: mainNavItems },
    { title: 'Incident Management', items: incidentManagementNavItems },
    { title: 'Communications', items: communicationNavItems },
    { title: 'Operations', items: operationsNavItems },
  ];

  return (
    <div
      className={`
        fixed top-0 left-0 z-40 h-full 
        bg-slate-800 text-white 
        flex flex-col 
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full w-64 md:w-20 md:translate-x-0'}
        md:relative md:translate-x-0 
      `}
    >
      {/* Header / Logo */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-slate-700">
        {isOpen && (
          <div className="flex items-center">
            <svg viewBox="0 0 200 200" className="w-8 h-8 mr-2 text-emerald-500" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M100,20 C140,20 170,50 170,90 C170,130 140,160 100,180 C60,160 30,130 30,90 C30,50 60,20 100,20 Z" transform="rotate(45 100 100)" fill="#6cb33f"/>
              <path d="M100,90 Q110,70 120,50 C130,70 110,110 100,130 Q90,110 70,50 C80,70 90,90 100,90 Z" fill="#8fcc5f" transform="rotate(45 100 100) translate(0, -5)"/>
            </svg>
            <span className="text-xl font-semibold text-white">
              <span style={{ color: '#006838' }}>AWK</span> FW
            </span>
          </div>
        )}
        <button onClick={onToggle} className="p-2 text-slate-300 hover:text-white md:hidden" aria-label="Toggle sidebar">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        {navSections.map(section => (
          section.items.length > 0 && (
            <div key={section.title} className="mb-2">
              {isOpen && <h3 className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">{section.title}</h3>}
              <ul>
                {section.items.map(item => (
                  <NavItem key={item.pageName} {...item} currentPage={currentPage} setPage={setPage} isSidebarOpen={isOpen} />
                ))}
              </ul>
              {!isOpen && section.title !== 'Main Menu' && <hr className="my-2 border-slate-700" />}
            </div>
          )
        ))}

        {/* Configuration Section with Submenu */}
        <div className="mb-2">
            {isOpen && <h3 className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">System Configuration</h3>}
            <li>
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        setIsConfigOpen(!isConfigOpen);
                        // Optionally navigate to a default config page or do nothing
                        // if (!isConfigOpen) setPage('Config: Incident Types'); 
                    }}
                    className={`relative flex items-center justify-between p-3 my-1 rounded-lg text-slate-200 hover:bg-slate-700 hover:text-white transition-colors duration-150 group ${
                        currentPage.startsWith('Config:') ? 'bg-slate-700 text-white' : ''
                    }`}
                    title={!isOpen ? "Configuration" : ''}
                >
                    <div className="flex items-center">
                        <span className={`transition-transform duration-200 ${currentPage.startsWith('Config:') ? 'scale-110' : 'group-hover:scale-105'}`}>{ConfigIcon}</span>
                        {isOpen && (
                        <span className={`ml-3 text-sm font-medium whitespace-nowrap overflow-hidden transition-opacity duration-200 ease-in-out`}>
                            Configuration
                        </span>
                        )}
                    </div>
                    {isOpen && (isConfigOpen ? ChevronDownIcon : ChevronRightIcon)}
                </a>
            </li>
            {isOpen && isConfigOpen && (
                <ul className="pl-1 mt-0.5">
                    {configSubItems.map(item => (
                        <NavItem key={item.pageName} {...item} currentPage={currentPage} setPage={setPage} isSidebarOpen={isOpen} isSubItem />
                    ))}
                </ul>
            )}
        </div>
        
        {!isOpen && <hr className="my-2 border-slate-700" />}


        {/* Settings always last non-expandable */}
        <div className="mb-2">
          {!isOpen && <hr className="my-2 border-slate-700" />}
           {isOpen && <h3 className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">User & App</h3>}
          <ul>
            <NavItem {...systemSettingsItem} currentPage={currentPage} setPage={setPage} isSidebarOpen={isOpen} />
          </ul>
        </div>
      </nav>

      {/* Footer / User Profile Link */}
      <div className="p-4 mt-auto border-t border-slate-700">
        {isOpen ? (
          <a href="#" onClick={(e) => {e.preventDefault(); setPage('Settings')}} className={`flex items-center p-2 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white group ${currentPage === 'Settings' ? 'bg-slate-700': ''}`}>
            {UserIcon}
            <span className="ml-3 text-sm">User Name</span>
          </a>
        ) : (
          <a href="#" onClick={(e) => {e.preventDefault(); setPage('Settings')}} title="User Settings" className={`flex items-center justify-center p-2 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white group ${currentPage === 'Settings' ? 'bg-slate-700': ''}`}>
           {UserIcon}
          </a>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
