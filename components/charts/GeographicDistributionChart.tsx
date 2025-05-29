
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Incident } from '../../types';

interface GeographicDistributionChartProps {
  incidents: Incident[];
  groupBy: keyof Pick<Incident, 'town' | 'municipality' | 'district' | 'province'>;
  // title: string; // Title will be handled by AnalyticsCard
}

const BAR_COLOR = '#1D4ED8'; // A strong blue color (e.g., blue-700)

const GeographicDistributionChart: React.FC<GeographicDistributionChartProps> = ({ incidents, groupBy }) => {
  const aggregatedData = incidents.reduce((acc, incident) => {
    const groupKey = incident[groupBy];
    if (groupKey) {
      acc[groupKey] = (acc[groupKey] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(aggregatedData)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count); // Sort by count descending

  if (chartData.length === 0) {
    return (
        <div className="text-center py-10 text-slate-500 h-full flex items-center justify-center">
            No data available for this geographic level.
            {incidents.length > 0 && <span className="text-xs block mt-1">(Ensure incidents have '{groupBy}' field populated)</span>}
        </div>
    );
  }
  
  const yAxisWidth = Math.max(100, ...chartData.map(d => d.name.length * 6)); // Dynamic width for Y-axis labels

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{
          top: 5,
          right: 30,
          left: Math.min(yAxisWidth, 200), // Cap max width for y-axis
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" allowDecimals={false} stroke="#6b7280" />
        <YAxis 
            dataKey="name" 
            type="category" 
            stroke="#6b7280" 
            width={yAxisWidth > 200 ? 200 : yAxisWidth} // Cap label width on display
            tick={{ fontSize: 10 }} 
            interval={0} 
        />
        <Tooltip
          contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' }}
        />
        <Legend wrapperStyle={{paddingTop: "10px"}}/>
        <Bar dataKey="count" name="Incidents" fill={BAR_COLOR} barSize={15}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={BAR_COLOR} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default GeographicDistributionChart;