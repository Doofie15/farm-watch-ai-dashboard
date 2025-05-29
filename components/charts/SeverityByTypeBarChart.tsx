
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Incident, IncidentType, Severity, ConfigurableListItem } from '../../types';

interface SeverityByTypeBarChartProps {
  incidents: Incident[];
  incidentTypesConfig: ConfigurableListItem[];
  severitiesConfig: ConfigurableListItem[];
}

const SEVERITY_COLORS_MAP: Record<Severity, string> = {
  [Severity.LOW]: '#10B981', 
  [Severity.MEDIUM]: '#F59E0B', 
  [Severity.HIGH]: '#EF4444', 
  [Severity.CRITICAL]: '#B91C1C', 
};

const SeverityByTypeBarChart: React.FC<SeverityByTypeBarChartProps> = ({ incidents, incidentTypesConfig, severitiesConfig }) => {

  const getLabel = (list: ConfigurableListItem[], id: string): string => {
    const item = list.find(i => i.id === id);
    return item ? item.label : id;
  };

  const data = incidentTypesConfig
    .filter(typeConfig => typeConfig.isActive)
    .map(typeConfig => {
      const typeIncidents = incidents.filter(inc => inc.aiCategory === typeConfig.id);
      const severityCounts: { name: string; [key: string]: number | string } = {
        name: typeConfig.label, // Incident Type Label
      };
      
      severitiesConfig.filter(sc => sc.isActive).forEach(sevConfig => {
        severityCounts[sevConfig.label] = typeIncidents.filter(inc => inc.aiSeverity === sevConfig.id).length;
      });
      
      // Only include if there's any data for this type
      if (severitiesConfig.filter(sc => sc.isActive).some(sevConfig => (severityCounts[sevConfig.label] as number) > 0)) {
          return severityCounts;
      }
      return null;
  }).filter(item => item !== null);


  if (data.length === 0) {
    return <div className="text-center py-10 text-slate-500 h-full flex items-center justify-center">No data for severity by type breakdown.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data as any[]} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" allowDecimals={false} stroke="#6b7280" />
        <YAxis type="category" dataKey="name" width={100} stroke="#6b7280" tick={{ fontSize: 10 }} interval={0} />
        <Tooltip 
            contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' }}
        />
        <Legend wrapperStyle={{paddingTop: "10px"}}/>
        {severitiesConfig.filter(sc => sc.isActive).map(sevConfig => (
          <Bar 
            key={sevConfig.id} 
            dataKey={sevConfig.label} // Data key is now the label
            stackId="a" 
            fill={SEVERITY_COLORS_MAP[sevConfig.id as Severity] || '#6B7280'} 
            name={sevConfig.label} // Legend name is the label
            barSize={15} 
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SeverityByTypeBarChart;
