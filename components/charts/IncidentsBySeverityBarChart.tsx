
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Incident, Severity, ConfigurableListItem } from '../../types';

interface IncidentsBySeverityBarChartProps {
  incidents: Incident[];
  severitiesConfig: ConfigurableListItem[]; // Pass the config
}

const SEVERITY_COLORS: Record<Severity, string> = {
  [Severity.LOW]: '#10B981', 
  [Severity.MEDIUM]: '#F59E0B', 
  [Severity.HIGH]: '#EF4444', 
  [Severity.CRITICAL]: '#B91C1C', 
};

const IncidentsBySeverityBarChart: React.FC<IncidentsBySeverityBarChartProps> = ({ incidents, severitiesConfig }) => {
  // Chart view options
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'donut'>('pie');
  
  const getLabel = (id: string): string => {
    const item = severitiesConfig.find(i => i.id === id);
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
    return severitiesConfig
      .filter(sevConfig => sevConfig.isActive) // Only include active severities
      .map(sevConfig => ({
        name: sevConfig.label, // Use configured label
        value: filteredIncidents.filter(incident => incident.aiSeverity === sevConfig.id).length, // Use 'value' for pie charts
        count: filteredIncidents.filter(incident => incident.aiSeverity === sevConfig.id).length, // Keep 'count' for bar charts
        fill: SEVERITY_COLORS[sevConfig.id as Severity] || '#6B7280', // Fallback color
        color: SEVERITY_COLORS[sevConfig.id as Severity] || '#6B7280', // Duplicate for easier access
        id: sevConfig.id,
      }));
  }, [filteredIncidents, severitiesConfig]);
  
  // Define the empty state component
  const EmptyStateComponent = () => (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl h-full flex flex-col">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Incidents by Severity</h3>
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
  if (!filteredIncidents.length || data.filter(d => d.count > 0).length === 0) {
    return <EmptyStateComponent />;
  }

  // Custom tooltip to improve readability
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value || payload[0].payload?.count || 0;
      const name = payload[0].name || payload[0].payload?.name || '';
      const color = payload[0].color || payload[0].payload?.color || '#6B7280';
      
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md">
          <div className="flex items-center">
            <div className="w-3 h-3 mr-2 rounded-sm" style={{ backgroundColor: color }}></div>
            <p className="font-medium text-slate-800">{name}</p>
          </div>
          <p className="text-emerald-600 font-medium mt-1">
            {value} {value === 1 ? 'Incident' : 'Incidents'}
          </p>
          <p className="text-slate-500 text-sm">
            {Math.round((value / filteredIncidents.length) * 100)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Incidents by Severity</h3>
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
              onClick={() => setChartType('pie')}
              className={`px-3 py-1 text-xs font-medium rounded-l-lg ${chartType === 'pie' 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-white text-slate-700 hover:bg-slate-50'} border border-slate-300`}
            >
              Pie
            </button>
            <button
              type="button"
              onClick={() => setChartType('donut')}
              className={`px-3 py-1 text-xs font-medium ${chartType === 'donut' 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-white text-slate-700 hover:bg-slate-50'} border-t border-b border-slate-300`}
            >
              Donut
            </button>
            <button
              type="button"
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 text-xs font-medium rounded-r-lg ${chartType === 'bar' 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-white text-slate-700 hover:bg-slate-50'} border border-slate-300`}
            >
              Bar
            </button>
          </div>
        </div>
      </div>
      <div className="flex-grow w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart 
              data={data} 
              layout="vertical"
              margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" allowDecimals={false} stroke="#6b7280" />
              <YAxis type="category" dataKey="name" width={75} stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Incidents" barSize={25}>
                  {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
              </Bar>
              <Legend wrapperStyle={{paddingTop: "10px"}} />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={chartType === 'donut' ? 40 : 0}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconSize={10} wrapperStyle={{paddingTop: "10px"}} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncidentsBySeverityBarChart;
