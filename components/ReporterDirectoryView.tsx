
import React, { useState, useMemo } from 'react';
import { Reporter, UserType, AppConfiguration } from '../types';
import { ShieldCheckIcon, AddIcon, UserIcon as UserDetailIcon } from './ui/Icons'; 
import AddReporterModal from './AddReporterModal'; 

interface ReporterDirectoryViewProps {
  reporters: Reporter[];
  onSelectReporter: (reporterId: string) => void; 
  onAddReporter: (reporterData: Omit<Reporter, 'id' | 'dateAdded' | 'incidentsReportedCount' | 'falseAlarmCount' | 'incidents'>) => Reporter | undefined;
  appConfig: AppConfiguration; // Pass AppConfiguration
}

type SortKey = keyof Reporter | 'name' | '';
type SortOrder = 'asc' | 'desc';

const ReporterDirectoryView: React.FC<ReporterDirectoryViewProps> = ({ reporters, onSelectReporter, onAddReporter, appConfig }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('dateAdded');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getLabel = (list: { id: string; label: string; isActive: boolean }[], id: string): string => {
    const item = list.find(i => i.id === id);
    return item ? item.label : id;
  };

  const filteredAndSortedReporters = useMemo(() => {
    let items = [...reporters].filter(reporter => {
      const fullName = `${reporter.firstName || ''} ${reporter.lastName || ''}`.toLowerCase();
      const search = searchTerm.toLowerCase();
      const userTypeLabel = getLabel(appConfig.userTypes, reporter.userType).toLowerCase();
      return (
        fullName.includes(search) ||
        reporter.phoneNumber.toLowerCase().includes(search) ||
        userTypeLabel.includes(search) ||
        (reporter.notes && reporter.notes.toLowerCase().includes(search))
      );
    });

    if (sortKey) {
      items.sort((a, b) => {
        let valA: any;
        let valB: any;

        if (sortKey === 'name') {
          valA = `${a.firstName || ''} ${a.lastName || ''}`.trim();
          valB = `${b.firstName || ''} ${b.lastName || ''}`.trim();
        } else if (sortKey === 'userType') {
            valA = getLabel(appConfig.userTypes, a.userType);
            valB = getLabel(appConfig.userTypes, b.userType);
        }
        else {
          valA = a[sortKey as keyof Reporter];
          valB = b[sortKey as keyof Reporter];
        }

        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        let comparison = 0;
        if (typeof valA === 'string' && typeof valB === 'string') {
          comparison = valA.localeCompare(valB);
        } else if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valA - valB;
        } else if (sortKey === 'dateAdded') {
           comparison = new Date(valA as string).getTime() - new Date(valB as string).getTime();
        } else {
            const strA = String(valA);
            const strB = String(valB);
            comparison = strA.localeCompare(strB);
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }
    return items;
  }, [reporters, searchTerm, sortKey, sortOrder, appConfig.userTypes]);

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
    return new Date(dateString).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const SortIcon: React.FC<{ columnKey: SortKey }> = ({ columnKey }) => {
    if (sortKey !== columnKey) return <span className="opacity-40">↕</span>;
    return sortOrder === 'asc' ? <span className="text-emerald-600">↑</span> : <span className="text-emerald-600">↓</span>;
  };
  
  const thClass = "px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200 transition-colors duration-150";
  const tdClass = "px-4 py-3 whitespace-nowrap text-sm text-slate-700";

  return (
    <>
      <div className="p-4 sm:p-6 bg-white rounded-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">Reporter Directory</h2>
            <p className="text-sm text-slate-500 mt-1">Manage and view details of all registered reporters.</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-3 sm:mt-0 flex items-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors"
          >
            {AddIcon}
            <span className="ml-2">Add New Reporter</span>
          </button>
        </div>

        <div className="mb-4">
          <input
            type="search"
            placeholder="Search reporters (name, phone, type, notes...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full md:w-1/2 lg:w-1/3 px-4 py-2.5 text-base border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md shadow-sm"
            aria-label="Search reporters"
          />
        </div>
        
        <div className="shadow-xl rounded-lg overflow-hidden border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th scope="col" className={thClass} onClick={() => handleSort('name')}>
                    Name <SortIcon columnKey="name" />
                  </th>
                  <th scope="col" className={thClass} onClick={() => handleSort('phoneNumber')}>
                    Phone Number <SortIcon columnKey="phoneNumber" />
                  </th>
                  <th scope="col" className={thClass} onClick={() => handleSort('userType')}>
                    Type <SortIcon columnKey="userType" />
                  </th>
                  <th scope="col" className={`${thClass} text-center`} onClick={() => handleSort('isTrustedSource')}>
                    Trusted <SortIcon columnKey="isTrustedSource" />
                  </th>
                  <th scope="col" className={`${thClass} text-center`} onClick={() => handleSort('incidentsReportedCount')}>
                    Reports <SortIcon columnKey="incidentsReportedCount" />
                  </th>
                  <th scope="col" className={thClass} onClick={() => handleSort('dateAdded')}>
                    Date Added <SortIcon columnKey="dateAdded" />
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredAndSortedReporters.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                      No reporters found{searchTerm ? " matching your search." : "."}
                    </td>
                  </tr>
                )}
                {filteredAndSortedReporters.map((reporter) => (
                  <tr key={reporter.id} className="hover:bg-slate-50 transition-colors duration-150 even:bg-white odd:bg-slate-50/50">
                    <td className={tdClass}>
                      <button 
                        onClick={() => onSelectReporter(reporter.id)} 
                        className="font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
                      >
                        {`${reporter.firstName || ''} ${reporter.lastName || ''}`.trim() || reporter.id}
                      </button>
                    </td>
                    <td className={tdClass}>{reporter.phoneNumber}</td>
                    <td className={tdClass}>{getLabel(appConfig.userTypes, reporter.userType)}</td>
                    <td className={`${tdClass} text-center`}>
                      {reporter.isTrustedSource ? (
                        <span className="inline-flex text-emerald-600" title="Trusted Source">
                          {ShieldCheckIcon}
                          <span className="sr-only">Yes</span>
                        </span>
                      ) : (
                        <span className="text-slate-400" title="Not Trusted">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mx-auto"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                           <span className="sr-only">No</span>
                        </span>
                      )}
                    </td>
                    <td className={`${tdClass} text-center`}>{reporter.incidentsReportedCount ?? 0}</td>
                    <td className={tdClass}>{formatDate(reporter.dateAdded)}</td>
                    <td className={tdClass}>
                      <button
                        onClick={() => onSelectReporter(reporter.id)}
                        className="text-emerald-600 hover:text-emerald-800 font-medium transition-colors duration-150 py-1 px-2 rounded-md hover:bg-emerald-50 flex items-center text-sm"
                        aria-label={`View details for ${reporter.firstName || reporter.id}`}
                      >
                        {UserDetailIcon}
                        <span className="ml-1.5">Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AddReporterModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddReporter={onAddReporter}
        appConfig={appConfig} // Pass appConfig to modal
      />
    </>
  );
};

export default ReporterDirectoryView;
