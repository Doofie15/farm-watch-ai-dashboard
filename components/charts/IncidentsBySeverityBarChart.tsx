
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
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
  
  const getLabel = (id: string): string => {
    const item = severitiesConfig.find(i => i.id === id);
    return item ? item.label : id;
  };
  
  const data = severitiesConfig
    .filter(sevConfig => sevConfig.isActive) // Only include active severities
    .map(sevConfig => ({
    name: sevConfig.label, // Use configured label
    count: incidents.filter(incident => incident.aiSeverity === sevConfig.id).length,
    fill: SEVERITY_COLORS[sevConfig.id as Severity] || '#6B7280', // Fallback color
    id: sevConfig.id,
  }));

  if (incidents.length === 0 || data.filter(d => d.count > 0).length === 0) {
     return <div className="text-center py-10 text-slate-500 bg-white p-4 rounded-lg shadow-lg h-full flex items-center justify-center">No incident data for severity chart.</div>;
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl h-full flex flex-col">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Incidents by Severity</h3>
      <div className="flex-grow w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" allowDecimals={false} stroke="#6b7280" />
            <YAxis type="category" dataKey="name" width={80} stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' }}
            />
            <Bar dataKey="count" name="Incidents" barSize={25}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncidentsBySeverityBarChart;
