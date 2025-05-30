import React, { useState, useMemo } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ReferenceArea } from 'recharts';
import { Incident } from '../../types';

interface IncidentsOverTimeLineChartProps {
  incidents: Incident[];
}

const IncidentsOverTimeLineChart: React.FC<IncidentsOverTimeLineChartProps> = ({ incidents }) => {
  // Chart view options
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('area');
  
  // Process data with appropriate time grouping
  // Always define all hooks at the top level, never conditionally
  const processData = useMemo(() => {
    // Sort incidents by date first
    const sortedIncidents = [...incidents].sort(
      (a, b) => new Date(a.timestampReported).getTime() - new Date(b.timestampReported).getTime()
    );
    
    // Determine date range
    let startDate = new Date();
    if (timeRange === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeRange === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (sortedIncidents.length > 0) {
      // For 'all', use the earliest incident date
      startDate = new Date(sortedIncidents[0].timestampReported);
    }
    
    // Filter incidents based on selected time range
    const filteredIncidents = timeRange === 'all' 
      ? sortedIncidents 
      : sortedIncidents.filter(incident => 
          new Date(incident.timestampReported) >= startDate
        );
    
    // Group by appropriate time unit
    const countsByDate: { [key: string]: { count: number, date: Date } } = {};
    
    filteredIncidents.forEach(incident => {
      const date = new Date(incident.timestampReported);
      let dateKey: string;
      
      if (timeRange === 'week') {
        // For week view, group by day with full date
        dateKey = date.toLocaleDateString('en-ZA', {month: 'short', day: 'numeric'});
      } else if (timeRange === 'month' || filteredIncidents.length <= 30) {
        // For month view or small datasets, group by day
        dateKey = date.toLocaleDateString('en-ZA', {month: 'short', day: 'numeric'});
      } else {
        // For longer periods, group by week
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)
        dateKey = `${weekStart.toLocaleDateString('en-ZA', {month: 'short', day: 'numeric'})} - ${weekEnd.toLocaleDateString('en-ZA', {month: 'short', day: 'numeric'})}`;
      }
      
      if (!countsByDate[dateKey]) {
        countsByDate[dateKey] = { count: 0, date: new Date(date) };
      }
      countsByDate[dateKey].count += 1;
    });
    
    // Convert to array and sort by date
    return Object.entries(countsByDate)
      .map(([dateLabel, { count, date }]) => ({ 
        dateLabel, 
        count,
        timestamp: date.getTime() 
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [incidents, timeRange]);

  const data = processData;

  // Calculate the average incidents per day for the reference line
  const averageIncidents = useMemo(() => {
    if (!data || data.length === 0) return 0;
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return Math.round((total / data.length) * 10) / 10; // Round to 1 decimal place
  }, [data]);
  
  // Define the empty state component outside of the conditional rendering
  const EmptyStateComponent = () => (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl h-full flex flex-col">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Incidents Over Time</h3>
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

  // Custom tooltip to improve readability
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md">
          <p className="font-medium text-slate-800">{label}</p>
          <p className="text-emerald-600 font-medium">
            {payload[0].value} {payload[0].value === 1 ? 'Incident' : 'Incidents'}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data: data,
      margin: { top: 10, right: 30, left: 0, bottom: 5 }
    };

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="dateLabel" 
              stroke="#6b7280" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                // Shorten label if it's too long
                if (value.includes('-')) {
                  return value.split('-')[0].trim(); // Show just the start date for ranges
                }
                return value;
              }}
            />
            <YAxis 
              allowDecimals={false} 
              stroke="#6b7280" 
              domain={[0, 'auto']}
              tickFormatter={(value) => Math.round(value).toString()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{paddingTop: "10px"}}/>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <ReferenceArea y1={0} y2={averageIncidents} stroke="#f3f4f6" strokeOpacity={0.3} fill="#f3f4f6" fillOpacity={0.3} />
            <Area 
              type="monotone" 
              dataKey="count" 
              name="Incidents Reported" 
              stroke="#10B981" 
              fill="url(#colorCount)" 
              strokeWidth={2} 
              activeDot={{ r: 6, stroke: '#047857', strokeWidth: 1, fill: '#10B981' }} 
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="dateLabel" 
              stroke="#6b7280" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                if (value.includes('-')) {
                  return value.split('-')[0].trim();
                }
                return value;
              }}
            />
            <YAxis 
              allowDecimals={false} 
              stroke="#6b7280" 
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{paddingTop: "10px"}}/>
            <Bar 
              dataKey="count" 
              name="Incidents Reported" 
              fill="#10B981" 
              radius={[4, 4, 0, 0]}
              barSize={timeRange === 'week' ? 30 : 20}
            />
          </BarChart>
        );

      default: // line chart
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="dateLabel" 
              stroke="#6b7280" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                if (value.includes('-')) {
                  return value.split('-')[0].trim();
                }
                return value;
              }}
            />
            <YAxis 
              allowDecimals={false} 
              stroke="#6b7280" 
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{paddingTop: "10px"}}/>
            <Line 
              type="monotone" 
              dataKey="count" 
              name="Incidents Reported" 
              stroke="#10B981" 
              strokeWidth={2} 
              dot={{ stroke: '#047857', strokeWidth: 1, r: 4, fill: '#10B981' }}
              activeDot={{ r: 6, stroke: '#047857', strokeWidth: 1, fill: '#10B981' }} 
            />
          </LineChart>
        );
    }
  };

  // Return the empty state component if there's no data
  if (!data || data.length === 0) {
    return <EmptyStateComponent />;
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Incidents Over Time</h3>
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
              onClick={() => setChartType('line')}
              className={`px-3 py-1 text-xs font-medium rounded-l-lg ${chartType === 'line' 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-white text-slate-700 hover:bg-slate-50'} border border-slate-300`}
            >
              Line
            </button>
            <button
              type="button"
              onClick={() => setChartType('area')}
              className={`px-3 py-1 text-xs font-medium ${chartType === 'area' 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-white text-slate-700 hover:bg-slate-50'} border-t border-b border-slate-300`}
            >
              Area
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
      
      {data.length > 0 && (
        <div className="flex items-center text-xs text-slate-500 mb-2">
          <span className="inline-block w-3 h-3 bg-slate-100 mr-1"></span>
          <span>Average: {averageIncidents} incidents per day</span>
        </div>
      )}
      
      <div className="flex-grow w-full h-full"> {/* Ensure chart area can grow */}
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncidentsOverTimeLineChart;