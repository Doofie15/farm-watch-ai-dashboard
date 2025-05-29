
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
  
  const getLabel = (id: string): string => {
    const item = incidentTypesConfig.find(i => i.id === id);
    return item ? item.label : id;
  };

  const data = incidentTypesConfig
    .filter(typeConfig => typeConfig.isActive) // Only include active types
    .map(typeConfig => ({
      name: typeConfig.label, // Use configured label
      value: incidents.filter(incident => incident.aiCategory === typeConfig.id).length,
      id: typeConfig.id, // Keep id for internal reference if needed
  })).filter(item => item.value > 0); 

  if (data.length === 0) {
    return <div className="text-center py-10 text-slate-500 bg-white p-4 rounded-lg shadow-lg h-full flex items-center justify-center">No incident data for type chart.</div>;
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl h-full flex flex-col">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Incidents by Type</h3>
      <div className="flex-grow w-full h-full">
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
              nameKey="name" // This will now be the configured label
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' }}
            />
            <Legend iconSize={10} wrapperStyle={{paddingTop: "10px"}}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncidentTypePieChart;
