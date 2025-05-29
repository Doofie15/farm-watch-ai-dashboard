
import React, { useState } from 'react';
import { Incident, Status, Severity, IncidentType, AppConfiguration, UserType } from '../types';
import Badge from './ui/Badge';
import { ShieldCheckIcon } from './ui/Icons';

interface IncidentTableProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onNavigateToReporterDetail?: (reporterId: string) => void; 
  appConfig: AppConfiguration; // Pass AppConfiguration
}

type SortKey = keyof Incident | 'reporterName' | '';
type SortOrder = 'asc' | 'desc';

const IncidentTable: React.FC<IncidentTableProps> = ({ incidents, onSelectIncident, onNavigateToReporterDetail, appConfig }) => {
  const [sortKey, setSortKey] = useState<SortKey>('timestampReported');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const getLabel = (list: { id: string; label: string; isActive: boolean }[], id: string): string => {
    const item = list.find(i => i.id === id); // Consider isActive if needed for display
    return item ? item.label : id;
  };

  const sortedIncidents = [...incidents].sort((a, b) => {
    if (!sortKey) return 0;

    let valA: any;
    let valB: any;

    if (sortKey === 'reporterName') {
      valA = `${a.reporter?.firstName || ''} ${a.reporter?.lastName || ''}`.trim() || a.reporterId;
      valB = `${b.reporter?.firstName || ''} ${b.reporter?.lastName || ''}`.trim() || b.reporterId;
    } else if (sortKey === 'aiCategory') {
      valA = getLabel(appConfig.incidentTypes, a.aiCategory);
      valB = getLabel(appConfig.incidentTypes, b.aiCategory);
    } else if (sortKey === 'status') {
      valA = getLabel(appConfig.statuses, a.status);
      valB = getLabel(appConfig.statuses, b.status);
    } else if (sortKey === 'aiSeverity') {
      valA = getLabel(appConfig.severities, a.aiSeverity);
      valB = getLabel(appConfig.severities, b.aiSeverity);
    }
    else {
      valA = a[sortKey as keyof Incident];
      valB = b[sortKey as keyof Incident];
    }
    

    if (valA === undefined || valA === null) return 1;
    if (valB === undefined || valB === null) return -1;
    
    let comparison = 0;
    if (sortKey === 'timestampReported' || sortKey === 'timestampOccurred') {
      comparison = new Date(valA as string).getTime() - new Date(valB as string).getTime();
    } else if (typeof valA === 'string' && typeof valB === 'string') {
      comparison = valA.localeCompare(valB);
    } else if (typeof valA === 'number' && typeof valB === 'number') {
      comparison = valA - valB;
    } else { 
        const strA = String(valA);
        const strB = String(valB);
        comparison = strA.localeCompare(strB);
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString([], {dateStyle: 'medium', timeStyle: 'short'});
  };

  const SortIcon: React.FC<{ columnKey: SortKey }> = ({ columnKey }) => {
    if (sortKey !== columnKey) return <span className="opacity-40">↕</span>;
    return sortOrder === 'asc' ? <span className="text-emerald-600">↑</span> : <span className="text-emerald-600">↓</span>;
  };
  
  const thClass = "px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200 transition-colors duration-150";
  const tdClass = "px-4 py-3 whitespace-nowrap text-sm text-slate-700";

  return (
    <div className="shadow-xl rounded-lg overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-100">
            <tr>
              <th scope="col" className={thClass} onClick={() => handleSort('id')}>
                ID <SortIcon columnKey="id" />
              </th>
              <th scope="col" className={thClass} onClick={() => handleSort('timestampReported')}>
                Reported <SortIcon columnKey="timestampReported" />
              </th>
              <th scope="col" className={thClass} onClick={() => handleSort('aiCategory')}>
                Type <SortIcon columnKey="aiCategory" />
              </th>
               <th scope="col" className={thClass} onClick={() => handleSort('reporterName')}>
                Reporter <SortIcon columnKey="reporterName" />
              </th>
              <th scope="col" className={thClass} onClick={() => handleSort('aiSeverity')}>
                Severity <SortIcon columnKey="aiSeverity" />
              </th>
              <th scope="col" className={thClass} onClick={() => handleSort('status')}>
                Status <SortIcon columnKey="status" />
              </th>
              <th scope="col" className={`${thClass} hidden md:table-cell`}>
                Location
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {sortedIncidents.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                  No incidents found matching your criteria.
                </td>
              </tr>
            )}
            {sortedIncidents.map((incident) => (
              <tr key={incident.id} className="hover:bg-slate-50 transition-colors duration-150 even:bg-white odd:bg-slate-50/50">
                <td className={tdClass}>{incident.id}</td>
                <td className={tdClass}>{formatDate(incident.timestampReported)}</td>
                <td className={tdClass}>
                  <Badge 
                    text={getLabel(appConfig.incidentTypes, incident.aiCategory)} 
                    type="type" 
                    value={incident.aiCategory} 
                  />
                </td>
                <td className={tdClass}>
                  <div className="flex items-center">
                    {incident.isTrustedReport && (
                      <span className="mr-1.5 text-emerald-600" title="Trusted Source Report">
                        {ShieldCheckIcon}
                      </span>
                    )}
                    <div>
                      {onNavigateToReporterDetail && incident.reporter ? (
                        <button
                          onClick={() => onNavigateToReporterDetail(incident.reporterId)}
                          className="font-medium text-emerald-700 hover:text-emerald-800 hover:underline text-left"
                        >
                          {`${incident.reporter.firstName || ''} ${incident.reporter.lastName || ''}`.trim() || incident.reporterId}
                        </button>
                      ) : (
                        <div className="font-medium text-slate-800">
                          {incident.reporter ? `${incident.reporter.firstName || ''} ${incident.reporter.lastName || ''}`.trim() || incident.reporterId : incident.reporterId}
                        </div>
                      )}
                      <div className="text-xs text-slate-500">{incident.reporter ? getLabel(appConfig.userTypes, incident.reporter.userType) : 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td className={tdClass}>
                  <Badge 
                    text={getLabel(appConfig.severities, incident.aiSeverity)} 
                    type="severity" 
                    value={incident.aiSeverity} 
                  />
                </td>
                <td className={tdClass}>
                  <Badge 
                    text={getLabel(appConfig.statuses, incident.status)} 
                    type="status" 
                    value={incident.status} 
                  />
                </td>
                <td className={`${tdClass} hidden md:table-cell truncate max-w-xs`}>
                  {incident.address || `${incident.latitude.toFixed(4)}, ${incident.longitude.toFixed(4)}`}
                </td>
                <td className={tdClass}>
                  <button
                    onClick={() => onSelectIncident(incident)}
                    className="text-emerald-600 hover:text-emerald-800 font-medium transition-colors duration-150 py-1 px-2 rounded-md hover:bg-emerald-50"
                    aria-label={`View details for incident ${incident.id}`}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncidentTable;
