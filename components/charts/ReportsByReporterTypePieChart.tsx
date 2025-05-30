
import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UserType, ConfigurableListItem } from '../../types'; 

interface ReportByReporterTypeData {
  name: string; // This will be the label from config
  value: number;
  id: string; // Original UserType enum value / ID
}

interface ReportsByReporterTypePieChartProps {
  data: ReportByReporterTypeData[]; 
  userTypesConfig: ConfigurableListItem[]; // Pass the full config for color mapping if needed
}


const TYPE_COLORS_MAP: Record<UserType, string> = {
  [UserType.CITIZEN]: '#3B82F6', 
  [UserType.SAPS_MEMBER]: '#10B981', 
  [UserType.SECURITY_OFFICER]: '#F59E0B', 
  [UserType.ADMIN]: '#6366F1', 
  [UserType.VERIFIED_VOLUNTEER]: '#EC4899', 
  [UserType.UNKNOWN]: '#6B7280', 
};

const ReportsByReporterTypePieChart: React.FC<ReportsByReporterTypePieChartProps> = ({ data, userTypesConfig }) => {
  // Chart view options
  const [chartType, setChartType] = useState<'pie' | 'donut'>('pie');

  // Define the empty state component
  const EmptyStateComponent = () => (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl h-full flex flex-col">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Reports by Reporter Type</h3>
      <div className="text-center py-10 text-slate-500 flex-grow flex items-center justify-center">
        <div>
          <svg className="w-12 h-12 mx-auto text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="mt-2">No data available for reporter types.</p>
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
      const totalReports = data.reduce((sum, item) => sum + item.value, 0);
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md">
          <p className="font-medium text-slate-800">{payload[0].name}</p>
          <p className="text-emerald-600 font-medium">
            {payload[0].value} {payload[0].value === 1 ? 'Report' : 'Reports'}
          </p>
          <p className="text-slate-500 text-sm">
            {Math.round((payload[0].value / totalReports) * 100)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Reports by Reporter Type</h3>
        <div className="flex space-x-2">          
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
              className={`px-3 py-1 text-xs font-medium rounded-r-lg ${chartType === 'donut' 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-white text-slate-700 hover:bg-slate-50'} border border-slate-300`}
            >
              Donut
            </button>
          </div>
        </div>
      </div>
      <div className="flex-grow w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
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
          nameKey="name" // Uses the label passed in `data`
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={TYPE_COLORS_MAP[entry.id as UserType] || TYPE_COLORS_MAP[UserType.UNKNOWN]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend iconSize={10} wrapperStyle={{paddingTop: "10px"}}/>
      </PieChart>
    </ResponsiveContainer>
    </div>
  </div>
  );
};

export default ReportsByReporterTypePieChart;
