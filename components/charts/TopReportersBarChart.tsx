
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface TopReporterData {
  name: string;
  count: number;
}

interface TopReportersBarChartProps {
  data: TopReporterData[]; // Expects pre-processed data
}

const BAR_COLOR = '#2563EB'; // blue-600

const TopReportersBarChart: React.FC<TopReportersBarChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-10 text-slate-500 h-full flex items-center justify-center">No reporter data available.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" allowDecimals={false} stroke="#6b7280" />
        <YAxis 
            type="category" 
            dataKey="name" 
            width={120} 
            stroke="#6b7280" 
            tick={{ fontSize: 10 }} 
            interval={0} // Show all labels if possible
        />
        <Tooltip 
            contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' }}
        />
        <Bar dataKey="count" name="Incidents Reported" fill={BAR_COLOR} barSize={20}>
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={BAR_COLOR} />
            ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TopReportersBarChart;
