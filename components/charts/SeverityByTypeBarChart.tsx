
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Incident, IncidentType, Severity, ConfigurableListItem } from '../../types';

interface SeverityByTypeBarChartProps {
  incidents: Incident[];
  incidentTypesConfig: ConfigurableListItem[];
  severitiesConfig: ConfigurableListItem[];
}

const SEVERITY_COLORS_MAP: Record<Severity, string> = {
  [Severity.LOW]: '#10B981', 
  [Severity.MEDIUM]: '#F59E0B', 
  [Severity.HIGH]: '#EF4444', 
  [Severity.CRITICAL]: '#B91C1C', 
};

const SeverityByTypeBarChart: React.FC<SeverityByTypeBarChartProps> = ({ incidents, incidentTypesConfig, severitiesConfig }) => {
  // Chart view options
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');
  const [chartType, setChartType] = useState<'vertical' | 'horizontal' | 'stacked'>('stacked');

  const getLabel = (list: ConfigurableListItem[], id: string): string => {
    const item = list.find(i => i.id === id);
    return item ? item.label : id;
  };

  // Filter incidents based on time range
  const filteredIncidents = useMemo(() => {
    // Determine date range
    let startDate = new Date();
    if (timeRange === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeRange === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else {
      return incidents; // Return all incidents for 'all' time range
    }
    
    // Filter incidents based on selected time range
    return incidents.filter(incident => 
      new Date(incident.timestampReported) >= startDate
    );
  }, [incidents, timeRange]);

  // Process data with time range filtering
  const data = useMemo(() => {
    return incidentTypesConfig
      .filter(typeConfig => typeConfig.isActive)
      .map(typeConfig => {
        const typeIncidents = filteredIncidents.filter(inc => inc.aiCategory === typeConfig.id);
        const severityCounts: { name: string; [key: string]: number | string } = {
          name: typeConfig.label, // Incident Type Label
        };
        
        severitiesConfig.filter(sc => sc.isActive).forEach(sevConfig => {
          severityCounts[sevConfig.label] = typeIncidents.filter(inc => inc.aiSeverity === sevConfig.id).length;
        });
        
        // Only include if there's any data for this type
        if (severitiesConfig.filter(sc => sc.isActive).some(sevConfig => (severityCounts[sevConfig.label] as number) > 0)) {
            return severityCounts;
        }
        return null;
    }).filter(item => item !== null);
  }, [filteredIncidents, incidentTypesConfig, severitiesConfig]);

  // Define the empty state component
  const EmptyStateComponent = () => (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl h-full flex flex-col">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Severity by Incident Type</h3>
      <div className="text-center py-10 text-slate-500 flex-grow flex items-center justify-center">
        <div>
          <svg className="w-12 h-12 mx-auto text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="mt-2">No incident data available for the selected time range.</p>
        </div>
      </div>
    </div>
  );
  
  // Return empty state if no data
  if (!data || data.length === 0) {
    return <EmptyStateComponent />;
  }

  // Custom tooltip to improve readability
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md">
          <p className="font-medium text-slate-800">{label}</p>
          <div className="mt-1">
            {payload.map((entry: any, index: number) => (
              <div key={`tooltip-${index}`} className="flex items-center">
                <div 
                  className="w-3 h-3 mr-2 rounded-sm" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm">
                  {entry.name}: <span className="font-medium">{entry.value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Severity by Incident Type</h3>
        <div className="flex space-x-2">
          {/* Time range selector */}
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1 text-xs font-medium rounded-l-lg ${timeRange === 'week' 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-white text-slate-700 hover:bg-slate-50'} border border-slate-300`}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 text-xs font-medium ${timeRange === 'month' 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-white text-slate-700 hover:bg-slate-50'} border-t border-b border-slate-300`}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1 text-xs font-medium rounded-r-lg ${timeRange === 'all' 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-white text-slate-700 hover:bg-slate-50'} border border-slate-300`}
            >
              All
            </button>
          </div>
          
          {/* Chart type selector */}
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setChartType('stacked')}
              className={`px-3 py-1 text-xs font-medium rounded-l-lg ${chartType === 'stacked' 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-white text-slate-700 hover:bg-slate-50'} border border-slate-300`}
            >
              Stacked
            </button>
            <button
              type="button"
              onClick={() => setChartType('vertical')}
              className={`px-3 py-1 text-xs font-medium ${chartType === 'vertical' 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-white text-slate-700 hover:bg-slate-50'} border-t border-b border-slate-300`}
            >
              Vertical
            </button>
            <button
              type="button"
              onClick={() => setChartType('horizontal')}
              className={`px-3 py-1 text-xs font-medium rounded-r-lg ${chartType === 'horizontal' 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-white text-slate-700 hover:bg-slate-50'} border border-slate-300`}
            >
              Horizontal
            </button>
          </div>
        </div>
      </div>
      <div className="flex-grow w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout={chartType === 'horizontal' ? 'horizontal' : 'vertical'}
        margin={{
          top: 20,
          right: 30,
          left: chartType === 'vertical' || chartType === 'stacked' ? 100 : 30,
          bottom: chartType === 'horizontal' ? 100 : 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" allowDecimals={false} stroke="#6b7280" />
        <YAxis type="category" dataKey="name" width={100} stroke="#6b7280" tick={{ fontSize: 10 }} interval={0} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{paddingTop: "10px"}}/>
        {severitiesConfig.filter(sc => sc.isActive).map(sevConfig => (
          <Bar 
            key={sevConfig.id} 
            dataKey={sevConfig.label} // Data key is now the label
            stackId="a" 
            fill={SEVERITY_COLORS_MAP[sevConfig.id as Severity] || '#6B7280'} 
            name={sevConfig.label} // Legend name is the label
            barSize={15} 
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
    </div>
  </div>
  );
};

export default SeverityByTypeBarChart;
