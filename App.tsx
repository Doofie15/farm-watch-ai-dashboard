

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar'; 
import DashboardView from './components/DashboardView'; 
import WhatsAppMessagesView from './components/WhatsAppMessagesView';
import LiveMapView from './components/LiveMapView';
import AddIncidentView from './components/AddIncidentView';
import ReporterDirectoryView from './components/ReporterDirectoryView'; 
import ReporterDetailView from './components/ReporterDetailView'; 
import IncidentDetailModal from './components/IncidentDetailModal'; 
import AnalyticsView from './components/AnalyticsView';
import { useIncidents } from './hooks/useIncidents';
import { useAppConfig } from './hooks/useAppConfig';
import { Incident, Reporter } from './types'; 

// Auth Components
import AuthProvider from './components/auth/AuthProvider';
import AuthLayout from './components/auth/AuthLayout';
import UserProfilePage from './components/auth/UserProfilePage';

// Import new config pages
import ConfigIncidentTypesPage from './components/config/ConfigIncidentTypesPage';
import ConfigSeveritiesPage from './components/config/ConfigSeveritiesPage';
import ConfigStatusesPage from './components/config/ConfigStatusesPage';
import ConfigUserTypesPage from './components/config/ConfigUserTypesPage';
import ConfigAiSettingsPage from './components/config/ConfigAiSettingsPage';
import ConfigIntegrationsPage from './components/config/ConfigIntegrationsPage';
import ConfigSystemPage from './components/config/ConfigSystemPage';

// Settings View (User Preferences, etc.) - Can be moved to its own file later
import { SettingsCategory, SettingItem, ToggleSwitch } from './components/ui/SettingsComponents';

const SettingsView: React.FC = () => {
  const [theme, setTheme] = useState('system');
  const [notifications, setNotifications] = useState({ email: true, sms: false, push: true });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="border-b border-slate-200 pb-4 mb-6 bg-white p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-semibold text-slate-800">Application Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Manage your preferences and application settings.</p>
      </div>

      <SettingsCategory title="User Preferences">
        <SettingItem label="Theme" description="Select your preferred interface theme.">
          <select 
            value={theme} 
            onChange={(e) => setTheme(e.target.value)}
            className="mt-1 block w-full md:w-1/2 pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md shadow-sm"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System Default</option>
          </select>
        </SettingItem>
        <SettingItem label="Language" description="Choose application language.">
           <select className="mt-1 block w-full md:w-1/2 pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md shadow-sm" disabled>
            <option>English (Default)</option>
            <option>Afrikaans (Coming Soon)</option>
          </select>
        </SettingItem>
      </SettingsCategory>

      <SettingsCategory title="Notification Channels">
        <SettingItem label="Email Notifications">
          <ToggleSwitch 
            label="Email" 
            srLabel="Enable Email Notifications"
            enabled={notifications.email} 
            onChange={(val) => setNotifications(p => ({...p, email: val}))} 
          />
        </SettingItem>
         <SettingItem label="SMS Alerts">
          <ToggleSwitch 
            label="SMS" 
            srLabel="Enable SMS Alerts"
            enabled={notifications.sms} 
            onChange={(val) => setNotifications(p => ({...p, sms: val}))} 
          />
        </SettingItem>
        <SettingItem label="Push Notifications" description="In-app or browser notifications.">
          <ToggleSwitch 
            label="Push" 
            srLabel="Enable Push Notifications"
            enabled={notifications.push} 
            onChange={(val) => setNotifications(p => ({...p, push: val}))} 
          />
        </SettingItem>
      </SettingsCategory>
      
      <SettingsCategory title="Account Management">
        <SettingItem label="Password">
          <button className="text-sm bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-200 transition-colors border border-slate-300">Change Password</button>
        </SettingItem>
        <SettingItem label="Data Export">
          <button className="text-sm bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-200 transition-colors border border-slate-300">Request Data Export</button>
        </SettingItem>
      </SettingsCategory>

      <SettingsCategory title="API Access (Placeholder)">
          <SettingItem label="Your API Keys" description="Manage API keys for external integrations.">
            <div className="text-xs text-slate-500 italic">API key management details here. Note: Gemini API key is set via environment variables.</div>
          </SettingItem>
      </SettingsCategory>
    </div>
  );
};


// Placeholder for Reports View
const ReportsViewPlaceholder: React.FC = () => (
  <div className="p-4 sm:p-6 bg-white rounded-lg shadow-xl space-y-6">
    <div className="border-b border-slate-200 pb-4">
      <h2 className="text-2xl font-semibold text-slate-800">Report Generation</h2>
      <p className="text-sm text-slate-500 mt-1">Generate, view, and download standardized and custom reports.</p>
    </div>

    <section>
      <h3 className="text-lg font-semibold text-slate-700 mb-3">Standard Reports</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {["Daily Incident Summary", "Weekly Activity Log", "Monthly Severity Breakdown"].map(reportName => (
          <div className={`p-4 border border-dashed border-slate-300 rounded-lg bg-slate-50/70`} key={reportName}>
            <h3 className="text-sm font-semibold text-slate-600 mb-2 border-b border-slate-200 pb-1">{reportName}</h3>
            <button className="mt-2 text-xs bg-emerald-500 text-white px-3 py-1.5 rounded-md hover:bg-emerald-600 transition-colors">Download PDF</button>
          </div>
        ))}
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold text-slate-700 mb-3">Create Custom Report</h3>
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="reportName" className="block text-sm font-medium text-slate-700">Report Name</label>
            <input type="text" id="reportName" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" placeholder="E.g., Q3 Stock Theft Analysis"/>
          </div>
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-slate-700">Date Range</label>
            <input type="date" id="dateRange" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"/>
          </div>
          <div>
            <label htmlFor="incidentType" className="block text-sm font-medium text-slate-700">Incident Type</label>
            <select id="incidentType" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
              <option>All Types</option>
              <option>Stock Theft</option>
              <option>Suspicious Activity</option>
            </select>
          </div>
           <div>
            <label htmlFor="outputFormat" className="block text-sm font-medium text-slate-700">Output Format</label>
            <select id="outputFormat" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md">
              <option>PDF</option>
              <option>CSV</option>
              <option>Excel</option>
            </select>
          </div>
        </div>
        <button className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors">Generate Report</button>
      </div>
    </section>
  </div>
);


// --- Main App Component ---
const AppContent: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [selectedReporterIdForDetail, setSelectedReporterIdForDetail] = useState<string | null>(null);
  
  const appConfigHook = useAppConfig(); 
  const incidentsHook = useIncidents(appConfigHook); 

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSelectReporterForDetail = (reporterId: string) => {
    setSelectedReporterIdForDetail(reporterId);
    setCurrentPage('ReporterDetail');
  };
  
  const handleBackToReporterDirectory = () => {
    setSelectedReporterIdForDetail(null);
    setCurrentPage('Reporter Directory');
  }

  const renderPage = () => {
    if (currentPage === 'ReporterDetail' && selectedReporterIdForDetail) {
      const reporter = incidentsHook.getReporterById(selectedReporterIdForDetail);
      return (
        <ReporterDetailView
          reporter={reporter || null}
          allIncidents={incidentsHook.allIncidents}
          onUpdateReporter={incidentsHook.updateReporter}
          onBack={handleBackToReporterDirectory}
          onSelectIncident={incidentsHook.handleSelectIncident} 
          appConfig={appConfigHook.config} 
        />
      );
    }

    switch (currentPage) {
      case 'Dashboard':
        return <DashboardView incidentsHook={incidentsHook} onNavigateToReporterDetail={handleSelectReporterForDetail} appConfig={appConfigHook.config} />;
      case 'Analytics Hub':
        return <AnalyticsView incidentsHook={incidentsHook} onNavigateToReporterDetail={handleSelectReporterForDetail} appConfig={appConfigHook.config} />;
      case 'Add Incident':
        return <AddIncidentView incidentsHook={incidentsHook} setPage={setCurrentPage} appConfig={appConfigHook.config} />;
      case 'Reporter Directory':
        return (
          <ReporterDirectoryView
            reporters={incidentsHook.reporters}
            onSelectReporter={handleSelectReporterForDetail}
            onAddReporter={incidentsHook.addReporter}
            appConfig={appConfigHook.config} 
          />
        );
      case 'WhatsApp Messages':
        return <WhatsAppMessagesView incidentsHook={incidentsHook} onNavigateToReporterDetail={handleSelectReporterForDetail} appConfig={appConfigHook.config} />;
      case 'Reports':
        return <ReportsViewPlaceholder />;
      case 'Live Map':
        return <LiveMapView incidentsHook={incidentsHook} appConfig={appConfigHook.config} />;
      case 'Settings':
        return <SettingsView />;
      case 'User Profile':
        return <UserProfilePage onBack={() => setCurrentPage('Dashboard')} />;
      // New Configuration Sub-Pages
      case 'Config: Incident Types':
        return <ConfigIncidentTypesPage />;
      case 'Config: Severities':
        return <ConfigSeveritiesPage />;
      case 'Config: Statuses':
        return <ConfigStatusesPage />;
      case 'Config: User Types':
        return <ConfigUserTypesPage />;
      case 'Config: AI Settings':
        return <ConfigAiSettingsPage />;
      case 'Config: Integrations':
        return <ConfigIntegrationsPage />;
      case 'Config: System Settings':
        return <ConfigSystemPage />;
      default:
        // Fallback to dashboard if page is unknown or if 'Configuration' (parent) is clicked.
        // Or, redirect to a default config page like 'Config: Incident Types'.
        if (currentPage.startsWith('Config:')) {
           return <ConfigIncidentTypesPage />; // Default config page
        }
        return <DashboardView incidentsHook={incidentsHook} onNavigateToReporterDetail={handleSelectReporterForDetail} appConfig={appConfigHook.config} />;
    }
  };
  
  const navigateToPage = (page: string) => {
    setCurrentPage(page);
    setSelectedReporterIdForDetail(null); 
    if(sidebarOpen && window.innerWidth < 768) setSidebarOpen(false); 
  }

  useEffect(() => {
    const scriptId = 'google-maps-script';
    const htmlElement = document.getElementById(scriptId); 
    const apiKey = process.env.GOOGLE_MAPS_API_KEY; 

    if (htmlElement instanceof HTMLScriptElement) { 
        const existingScript = htmlElement; 
        if (apiKey && existingScript.src.includes('YOUR_GOOGLE_MAPS_API_KEY')) { 
            const newSrc = existingScript.src.replace('YOUR_GOOGLE_MAPS_API_KEY', apiKey);
            if (existingScript.src !== newSrc) { 
                existingScript.src = newSrc; 
            }
        } else if (!apiKey && existingScript.src.includes('YOUR_GOOGLE_MAPS_API_KEY')) {
            console.warn("GOOGLE_MAPS_API_KEY is not set in environment variables. Maps API key placeholder detected. Maps may not load correctly.");
            if (!window.googleMapsApiLoaded) { 
              window.googleMapsApiLoaded = false; 
              const event = new Event('googleMapsApiLoaded');
              window.dispatchEvent(event);
            }
        }
    } else if (htmlElement) {
        console.warn(`Element with ID '${scriptId}' found, but it is not an HTMLScriptElement.`);
         if (!window.googleMapsApiLoaded) { 
            window.googleMapsApiLoaded = false;
            const event = new Event('googleMapsApiLoaded');
            window.dispatchEvent(event);
        }
    } 
  }, []);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} currentPage={currentPage} setPage={navigateToPage} onToggle={handleToggleSidebar} />
      
      {sidebarOpen && window.innerWidth < 768 && ( 
         <div 
            onClick={handleToggleSidebar} 
            className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
            aria-hidden="true"
        ></div>
      )}
       <div className={`
            fixed top-0 left-0 z-30 h-full 
            bg-slate-800 text-white 
            flex flex-col 
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            w-64 shadow-2xl
            md:hidden 
        `}
        >
           <Sidebar isOpen={true} currentPage={currentPage} setPage={navigateToPage} onToggle={handleToggleSidebar} />
       </div>


      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={handleToggleSidebar} sidebarOpen={sidebarOpen} onNavigateToPage={navigateToPage} />
        <main className={`flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 bg-slate-100 ${currentPage === 'Live Map' || currentPage === 'Analytics Hub' || currentPage.startsWith('Config:') ? 'p-0 sm:p-0' : ''}`}>
          {appConfigHook.isLoading ? 
            <div className="flex justify-center items-center h-full text-lg text-slate-600 p-6">
              <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading application...
            </div> 
          : renderPage()}
        </main>
      </div>
      
      <IncidentDetailModal 
        incident={incidentsHook.selectedIncident}
        onClose={() => incidentsHook.handleSelectIncident(null)}
        updateIncident={incidentsHook.updateIncident}
        onNavigateToReporterDetail={handleSelectReporterForDetail}
        appConfig={appConfigHook.config} 
      />
    </div>
  );
};

// Wrap the app with authentication provider
const App: React.FC = () => {
  const appConfigHook = useAppConfig();
  
  return (
    <AuthProvider>
      <AuthLayout userTypeOptions={appConfigHook.config.userTypes.map(type => ({ value: type.id, label: type.label }))}>  
        <AppContent />
      </AuthLayout>
    </AuthProvider>
  );
};

export default App;