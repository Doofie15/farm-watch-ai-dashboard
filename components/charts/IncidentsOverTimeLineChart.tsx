import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Incident } from '../../types';

interface IncidentsOverTimeLineChartProps {
  incidents: Incident[];
}

const IncidentsOverTimeLineChart: React.FC<IncidentsOverTimeLineChartProps> = ({ incidents }) => {
  const processData = () => {
    const countsByDate: { [key: string]: number } = {};
    incidents.forEach(incident => {
      // Group by day for clarity. For longer timeframes, might group by week/month.
      const date = new Date(incident.timestampReported).toLocaleDateString([], {year: '2-digit', month: 'short', day: 'numeric'});
      countsByDate[date] = (countsByDate[date] || 0) + 1;
    });

    return Object.entries(countsByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()); 
  };

  const data = processData();

  if (data.length === 0) {
    return <div className="text-center py-10 text-slate-500 bg-white p-4 rounded-lg shadow-lg h-full flex items-center justify-center">No incident data for time trend.</div>;
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl h-full flex flex-col">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Incidents Over Time</h3>
      <div className="flex-grow w-full h-full"> {/* Ensure chart area can grow */}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis allowDecimals={false} stroke="#6b7280"/>
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' }}
            />
            <Legend wrapperStyle={{paddingTop: "10px"}}/>
            <Line type="monotone" dataKey="count" name="Incidents Reported" stroke="#10B981" strokeWidth={2} activeDot={{ r: 6 }} dot={{r: 3}} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncidentsOverTimeLineChart;