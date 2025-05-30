
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Incident, IncidentType, ConfigurableListItem } from '../../types';

interface IncidentTypePieChartProps {
  incidents: Incident[];
  incidentTypesConfig: ConfigurableListItem[]; // Pass the config
}

const COLORS = [
  '#2563EB', // blue-600
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#6366F1', // indigo-500
  '#D97706', // amber-600
  '#0EA5E9', // sky-500
];

const IncidentTypePieChart: React.FC<IncidentTypePieChartProps> = ({ incidents, incidentTypesConfig }) => {
  // Chart view options
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');
  const [chartType, setChartType] = useState<'pie' | 'donut' | 'bar'>('donut');
  
  const getLabel = (id: string): string => {
    const item = incidentTypesConfig.find(i => i.id === id);
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
      .filter(typeConfig => typeConfig.isActive) // Only include active types
      .map(typeConfig => {
        const count = filteredIncidents.filter(incident => incident.aiCategory === typeConfig.id).length;
        return {
          name: typeConfig.label, // Use configured label
          value: count, // For pie charts
          count: count, // For bar charts
          id: typeConfig.id, // Keep id for internal reference if needed
          color: COLORS[incidentTypesConfig.findIndex(t => t.id === typeConfig.id) % COLORS.length], // Assign color consistently
        };
      }).filter(item => item.value > 0);
  }, [filteredIncidents, incidentTypesConfig]);
  
  // Define the empty state component
  const EmptyStateComponent = () => (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl h-full flex flex-col">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Incidents by Type</h3>
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
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value || payload[0].payload?.count || 0;
      const name = payload[0].name || payload[0].payload?.name || '';
      const color = payload[0].color || payload[0].payload?.color || COLORS[0];
      
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
        <h3 className="text-lg font-semibold text-slate-800">Incidents by Type</h3>
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
              margin={{ top: 5, right: 20, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" allowDecimals={false} stroke="#6b7280" />
              <YAxis type="category" dataKey="name" width={110} stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Incidents" barSize={25}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
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
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                innerRadius={chartType === 'donut' ? 40 : 0}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconSize={10} wrapperStyle={{paddingTop: "10px"}}/>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncidentTypePieChart;
