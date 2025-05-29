
import React from 'react';
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
  if (!data || data.length === 0) {
    return <div className="text-center py-10 text-slate-500 h-full flex items-center justify-center">No data for reports by user type.</div>;
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius="80%"
          fill="#8884d8"
          dataKey="value"
          nameKey="name" // Uses the label passed in `data`
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={TYPE_COLORS_MAP[entry.id as UserType] || TYPE_COLORS_MAP[UserType.UNKNOWN]} />
          ))}
        </Pie>
        <Tooltip 
            contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' }}
        />
        <Legend iconSize={10} wrapperStyle={{paddingTop: "10px"}}/>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ReportsByReporterTypePieChart;
