import React, { useState, useMemo } from 'react';
import { Incident, AppConfiguration } from '../types';
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
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const getLabel = (list: { id: string; label: string; isActive: boolean }[], id: string): string => {
    const item = list.find(i => i.id === id); // Consider isActive if needed for display
    return item ? item.label : id;
  };

  const sortedIncidents = useMemo(() => [...incidents].sort((a: Incident, b: Incident) => {
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
  }), [incidents, sortKey, sortOrder, appConfig]);
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedIncidents.length / rowsPerPage);
  const paginatedIncidents = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedIncidents.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedIncidents, currentPage, rowsPerPage]);

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
            {paginatedIncidents.map((incident) => (
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
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="px-4 py-3 bg-white border-t border-slate-200 sm:px-6 flex items-center justify-between">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700">
                Showing <span className="font-medium">{((currentPage - 1) * rowsPerPage) + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * rowsPerPage, sortedIncidents.length)}
                </span>{' '}
                of <span className="font-medium">{sortedIncidents.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  // Show pages around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  // Only show valid page numbers
                  if (pageNum > 0 && pageNum <= totalPages) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
          
          {/* Mobile Pagination */}
          <div className="flex items-center justify-between w-full sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-white text-slate-300 cursor-not-allowed' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
            >
              Previous
            </button>
            <p className="text-sm text-slate-700">
              Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </p>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md ${currentPage === totalPages ? 'bg-white text-slate-300 cursor-not-allowed' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentTable;
