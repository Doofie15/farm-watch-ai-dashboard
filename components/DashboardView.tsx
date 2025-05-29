
import React from 'react';
import IncidentTable from './IncidentTable';
import IncidentMap from './IncidentMap';
import IncidentTypePieChart from './charts/IncidentTypePieChart';
import IncidentsBySeverityBarChart from './charts/IncidentsBySeverityBarChart';
import IncidentsOverTimeLineChart from './charts/IncidentsOverTimeLineChart';
import Select from './ui/Select';
import { useIncidents } from '../hooks/useIncidents'; 
import { Status, IncidentType, Severity, Incident, AppConfiguration } from '../types';

type UseIncidentsReturnType = ReturnType<typeof useIncidents>;

interface DashboardViewProps {
  incidentsHook: UseIncidentsReturnType;
  onNavigateToReporterDetail?: (reporterId: string) => void;
  appConfig: AppConfiguration; // Pass AppConfiguration
}

const StatCard: React.FC<{ title: string; value: string | number; bgColor?: string; textColor?: string; isLoading?: boolean }> = 
({ title, value, bgColor = 'bg-white', textColor = 'text-emerald-600', isLoading }) => {
  return (
    <div className={`${bgColor} p-4 sm:p-5 rounded-xl shadow-lg border border-slate-200/80`}>
      <h3 className="text-sm font-medium text-slate-500 truncate">{title}</h3>
      {isLoading ? (
        <div className="mt-1 h-8 bg-slate-200 rounded animate-pulse w-1/2"></div>
      ) : (
        <p className={`mt-1 text-3xl font-semibold ${textColor}`}>{value}</p>
      )}
    </div>
  );
};

const DashboardView: React.FC<DashboardViewProps> = ({ incidentsHook, onNavigateToReporterDetail, appConfig }) => {
  const {
    filteredIncidents,
    allIncidents,
    isLoading,
    error,
    filters,
    handleFilterChange,
    clearFilters,
    statusOptions, // These are now from useIncidents, derived from appConfig
    typeOptions,   // These are now from useIncidents, derived from appConfig
    handleSelectIncident, 
  } = incidentsHook;

  const getLabel = (list: { id: string; label: string; isActive: boolean }[], id: string): string => {
    const item = list.find(i => i.id === id);
    return item ? item.label : id;
  };
  
  const summaryStats = React.useMemo(() => {
    const total = allIncidents.length;
    // Assuming Status.NEW, etc., are stable enum values. Labels are for display.
    const newIncidents = allIncidents.filter(inc => inc.status === Status.NEW).length;
    const underInvestigation = allIncidents.filter(inc => inc.status === Status.UNDER_INVESTIGATION).length;
    const falseAlarms = allIncidents.filter(inc => inc.status === Status.FALSE_ALARM).length;
    return { total, newIncidents, underInvestigation, falseAlarms };
  }, [allIncidents]);


  return (
    <div className="p-0 sm:p-0 md:p-4 lg:p-6 space-y-6">
      <div className="mb-6 p-5 bg-white rounded-xl shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Welcome to FarmWatch AI</h1>
        <p className="text-sm text-slate-500 mt-1">
          Overview of current incidents and farm security status.
        </p>
      </div>
      
      {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg shadow-md border border-red-300" role="alert">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Total Incidents" value={summaryStats.total} isLoading={isLoading} />
        <StatCard title={`New Incidents (${getLabel(appConfig.statuses, Status.NEW)})`} value={summaryStats.newIncidents} isLoading={isLoading} textColor="text-sky-600" />
        <StatCard title={`Under Investigation (${getLabel(appConfig.statuses, Status.UNDER_INVESTIGATION)})`} value={summaryStats.underInvestigation} isLoading={isLoading} textColor="text-amber-600" />
        <StatCard title={`False Alarms (${getLabel(appConfig.statuses, Status.FALSE_ALARM)})`} value={summaryStats.falseAlarms} isLoading={isLoading} textColor="text-slate-600" />
      </div>

      <div className="p-4 sm:p-6 bg-white rounded-xl shadow-xl">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Incident Overview</h2>
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label htmlFor="dashboardSearchTerm" className="block text-sm font-medium text-slate-700 mb-1">Search Incidents</label>
            <input
              type="search"
              id="dashboardSearchTerm"
              placeholder="ID, keyword, location, reporter..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
              className="block w-full px-4 py-2.5 text-base border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md shadow-sm"
            />
          </div>
          <Select
            label="Filter by Type"
            id="dashboardTypeFilter"
            options={typeOptions} // Already using configured labels from useIncidents
            value={filters.type}
            onChange={(e) => handleFilterChange({ type: e.target.value as IncidentType | "" })}
          />
          <Select
            label="Filter by Status"
            id="dashboardStatusFilter"
            options={statusOptions} // Already using configured labels from useIncidents
            value={filters.status}
            onChange={(e) => handleFilterChange({ status: e.target.value as Status | "" })}
          />
           { (filters.searchTerm || filters.status || filters.type) && (
            <button 
                onClick={clearFilters}
                className="md:col-start-4 text-sm text-slate-600 hover:text-emerald-700 py-2.5 px-3 rounded-md hover:bg-slate-100 transition-colors border border-slate-300"
            >
                Clear Filters
            </button>
           )}
        </div>
        
        <IncidentTable
          incidents={filteredIncidents}
          onSelectIncident={handleSelectIncident}
          onNavigateToReporterDetail={onNavigateToReporterDetail}
          appConfig={appConfig} // Pass appConfig down
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        <div className="lg:col-span-3 bg-white p-4 sm:p-6 rounded-xl shadow-xl min-h-[350px] sm:min-h-[400px]">
          <IncidentsOverTimeLineChart incidents={allIncidents} />
        </div>
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl shadow-xl min-h-[350px] sm:min-h-[400px]">
          <IncidentTypePieChart incidents={allIncidents} incidentTypesConfig={appConfig.incidentTypes} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        <div className="lg:col-span-3 bg-white p-4 sm:p-6 rounded-xl shadow-xl min-h-[400px] sm:min-h-[500px]">
           <h3 className="text-lg font-semibold text-slate-800 mb-4">Incident Locations</h3>
           <IncidentMap
            incidents={filteredIncidents.length > 0 ? filteredIncidents : allIncidents.slice(0, 20)} 
            selectedIncident={null} 
            onMarkerClick={handleSelectIncident} 
            className="h-[350px] sm:h-[420px] w-full rounded-lg border border-slate-200"
            showControls={true}
          />
        </div>
         <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl shadow-xl min-h-[400px] sm:min-h-[500px]">
           <IncidentsBySeverityBarChart incidents={allIncidents} severitiesConfig={appConfig.severities} />
        </div>
      </div>

    </div>
  );
};

export default DashboardView;
