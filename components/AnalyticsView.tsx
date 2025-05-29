
import React, { useState } from 'react'; 
import { useIncidents } from '../hooks/useIncidents';
import { Incident, Reporter, Status, IncidentType, Severity, UserType, AppConfiguration, ConfigurableListItem } from '../types'; 
import IncidentMap from './IncidentMap';
import IncidentTypePieChart from './charts/IncidentTypePieChart';
import IncidentsBySeverityBarChart from './charts/IncidentsBySeverityBarChart';
import IncidentsOverTimeLineChart from './charts/IncidentsOverTimeLineChart';
import SeverityByTypeBarChart from './charts/SeverityByTypeBarChart';
import TopReportersBarChart from './charts/TopReportersBarChart';
import ReportsByReporterTypePieChart from './charts/ReportsByReporterTypePieChart';
import GeographicDistributionChart from './charts/GeographicDistributionChart'; 
import Select from './ui/Select'; 

type UseIncidentsReturnType = ReturnType<typeof useIncidents>;

interface AnalyticsViewProps {
  incidentsHook: UseIncidentsReturnType;
  onNavigateToReporterDetail?: (reporterId: string) => void;
  appConfig: AppConfiguration; // Pass AppConfiguration
}

const AnalyticsCard: React.FC<{ title: string; children: React.ReactNode; className?: string; chartHeightClass?: string }> = ({ title, children, className = '', chartHeightClass = 'h-[350px] sm:h-[400px]' }) => (
  <div className={`bg-white p-4 sm:p-6 rounded-xl shadow-xl flex flex-col ${className}`}>
    <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-3">{title}</h3>
    <div className={`flex-grow ${chartHeightClass}`}>
      {children}
    </div>
  </div>
);

const PlaceholderAnalyticsCard: React.FC<{ title: string; description: string; icon?: React.ReactNode; chartHeightClass?: string; className?: string; }> = ({ title, description, icon, chartHeightClass = 'h-[350px] sm:h-[400px]', className }) => (
  <AnalyticsCard title={title} chartHeightClass={chartHeightClass} className={className}>
    <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
      {icon && <div className="mb-3 text-slate-400">{icon}</div>}
      <p className="text-sm">{description}</p>
      <p className="text-xs text-slate-400 mt-1">(Coming Soon)</p>
    </div>
  </AnalyticsCard>
);


const AnalyticsView: React.FC<AnalyticsViewProps> = ({ incidentsHook, appConfig }) => {
  const { allIncidents, reporters, isLoading, error, handleSelectIncident } = incidentsHook;
  const [geographicLevel, setGeographicLevel] = useState<keyof Pick<Incident, 'province' | 'district' | 'municipality' | 'town'>>('province');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full text-lg text-slate-600 p-6">
        <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading analytics data...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-lg text-red-700 bg-red-100 p-6 rounded-lg shadow-md border border-red-300 m-6">{error}</div>;
  }
  
  const getLabel = (list: ConfigurableListItem[], id: string): string => {
    const item = list.find(i => i.id === id);
    return item ? item.label : id;
  };
  
  const topReportersData = [...reporters]
    .sort((a, b) => (b.incidentsReportedCount || 0) - (a.incidentsReportedCount || 0))
    .slice(0, 10) 
    .map(r => ({
        name: `${r.firstName || ''} ${r.lastName || ''}`.trim() || r.id,
        count: r.incidentsReportedCount || 0,
    }));

  // Use appConfig labels for chart data
  const reportsByReporterTypeData = appConfig.userTypes
    .filter(ut => ut.isActive)
    .map(typeConfig => ({
        name: typeConfig.label, // Use configured label
        id: typeConfig.id, // Include the ID for the chart component
        value: allIncidents.filter(incident => incident.reporter?.userType === typeConfig.id).length,
    })).filter(item => item.value > 0);


  const geographicLevelOptions = [
    { value: 'province', label: 'By Province' },
    { value: 'district', label: 'By District' },
    { value: 'municipality', label: 'By Municipality' },
    { value: 'town', label: 'By Town' },
  ];


  return (
    <div className="p-4 sm:p-6 bg-slate-100 min-h-full">
      <div className="mb-6 p-6 bg-white rounded-xl shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Analytics Hub</h2>
        <p className="text-sm text-slate-500 mt-1">
          Explore trends, patterns, and insights from your incident data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <AnalyticsCard title="Incident Hotspot Map" className="lg:col-span-2 xl:col-span-2" chartHeightClass="h-[400px] sm:h-[500px]">
          <IncidentMap
            incidents={allIncidents}
            selectedIncident={null} 
            onMarkerClick={handleSelectIncident} 
            className="h-full w-full rounded-lg border border-slate-200"
            showControls={true} 
          />
        </AnalyticsCard>

        <AnalyticsCard title="Incidents Over Time" className="xl:col-span-1">
          <IncidentsOverTimeLineChart incidents={allIncidents} />
        </AnalyticsCard>

        <AnalyticsCard title="Incidents by Type">
          <IncidentTypePieChart incidents={allIncidents} incidentTypesConfig={appConfig.incidentTypes} />
        </AnalyticsCard>

        <AnalyticsCard title="Incidents by Severity">
          <IncidentsBySeverityBarChart incidents={allIncidents} severitiesConfig={appConfig.severities} />
        </AnalyticsCard>
        
        <AnalyticsCard title="Severity Breakdown by Incident Type">
          <SeverityByTypeBarChart incidents={allIncidents} incidentTypesConfig={appConfig.incidentTypes} severitiesConfig={appConfig.severities} />
        </AnalyticsCard>
        
        <AnalyticsCard title="Geographic Incident Distribution">
          <div className="mb-3">
            <Select
              labelSrOnly
              label="Select Geographic Level"
              options={geographicLevelOptions}
              value={geographicLevel}
              onChange={(e) => setGeographicLevel(e.target.value as keyof Pick<Incident, 'province' | 'district' | 'municipality' | 'town'>)}
              className="text-sm"
            />
          </div>
          <GeographicDistributionChart incidents={allIncidents} groupBy={geographicLevel} />
        </AnalyticsCard>

        <AnalyticsCard title="Top Reporters (by number of reports)">
            <TopReportersBarChart data={topReportersData} />
        </AnalyticsCard>

        <AnalyticsCard title="Reports by Reporter Type">
            <ReportsByReporterTypePieChart data={reportsByReporterTypeData} userTypesConfig={appConfig.userTypes} />
        </AnalyticsCard>
        
        <PlaceholderAnalyticsCard
          title="Response Time Analysis"
          description="Analyze time from report to resolution, and identify bottlenecks in response."
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
        />
        
         <PlaceholderAnalyticsCard
          title="Trend Forecaster"
          description="Predictive insights into future incident trends based on historical data."
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>}
        />

        <PlaceholderAnalyticsCard
          title="Custom Query Builder"
          description="Build and run custom queries on your incident data for specific analytical needs."
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
          className="lg:col-span-2 xl:col-span-1" 
        />

      </div>
    </div>
  );
};

export default AnalyticsView;