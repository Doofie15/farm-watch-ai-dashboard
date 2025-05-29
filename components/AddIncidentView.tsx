
import React from 'react';
import AddIncidentForm from './AddIncidentForm';
import { useIncidents } from '../hooks/useIncidents'; // For type
import { AppConfiguration } from '../types';

type UseIncidentsReturnType = ReturnType<typeof useIncidents>;

interface AddIncidentViewProps {
  incidentsHook: UseIncidentsReturnType;
  setPage: (page: string) => void; // For navigation after successful submission
  appConfig: AppConfiguration;
}

const AddIncidentView: React.FC<AddIncidentViewProps> = ({ incidentsHook, setPage, appConfig }) => {
  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-xl space-y-6">
      <div className="border-b border-slate-200 pb-4 mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">Manually Add New Incident</h2>
        <p className="text-sm text-slate-500 mt-1">
          Use this form to log incidents that were not reported through automated channels or require admin input.
        </p>
      </div>
      <AddIncidentForm 
        addIncident={incidentsHook.addIncident} 
        reporters={incidentsHook.reporters}
        reporterOptions={incidentsHook.reporterOptions}
        incidentTypeOptions={incidentsHook.typeOptions}
        severityOptions={incidentsHook.severityOptions}
        statusOptions={incidentsHook.statusOptions}
        userTypeOptions={incidentsHook.userTypeOptions}
        setPage={setPage}
        appConfig={appConfig} 
      />
    </div>
  );
};

export default AddIncidentView;