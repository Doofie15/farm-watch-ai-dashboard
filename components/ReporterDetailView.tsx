
import React, { useState, useEffect, useMemo } from 'react';
import { Reporter, Incident, UserType, Status, IncidentType, Severity, AppConfiguration, ConfigurableListItem } from '../types';
import { ShieldCheckIcon, EditIcon, SaveIcon, CancelIcon } from './ui/Icons'; 
import Select from './ui/Select';
import IncidentTable from './IncidentTable'; 
import Badge from './ui/Badge';
import IncidentMap from './IncidentMap'; // For setting home location


interface ReporterDetailViewProps {
  reporter: Reporter | null;
  allIncidents: Incident[]; 
  onUpdateReporter: (reporterData: Reporter) => void;
  onBack: () => void; 
  onSelectIncident: (incident: Incident) => void; 
  appConfig: AppConfiguration; // Pass AppConfiguration
}


const DetailItem: React.FC<{ label: string; value?: string | React.ReactNode; className?: string }> = ({ label, value, className }) => {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className={`py-2 ${className}`}>
      <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</dt>
      <dd className="mt-1 text-sm text-slate-800">{value}</dd>
    </div>
  );
};

const ReporterDetailView: React.FC<ReporterDetailViewProps> = ({ reporter, allIncidents, onUpdateReporter, onBack, onSelectIncident, appConfig }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableReporter, setEditableReporter] = useState<Partial<Reporter>>({});
  const [tempHomeLocation, setTempHomeLocation] = useState<{lat: number, lng: number} | null>(null);


  // Get active user types for editing dropdown
  const activeUserTypeOptions = appConfig.userTypes
    .filter(ut => ut.isActive)
    .map(ut => ({ value: ut.id, label: ut.label }));

  useEffect(() => {
    if (reporter) {
      setEditableReporter({
        firstName: reporter.firstName || '',
        lastName: reporter.lastName || '',
        userType: reporter.userType,
        isTrustedSource: reporter.isTrustedSource,
        notes: reporter.notes || '',
        isAgriculturalUnionMember: reporter.isAgriculturalUnionMember || '',
        farmName: reporter.farmName || '',
        city: reporter.city || '',
        homeLatitude: reporter.homeLatitude,
        homeLongitude: reporter.homeLongitude,
      });
      setTempHomeLocation(reporter.homeLatitude && reporter.homeLongitude ? {lat: reporter.homeLatitude, lng: reporter.homeLongitude} : null);
      setIsEditing(false); 
    }
  }, [reporter]);

  const getLabel = (list: ConfigurableListItem[], id: string): string => {
    const item = list.find(i => i.id === id);
    return item ? item.label : id;
  };

  const reporterIncidents = useMemo(() => {
    if (!reporter) return [];
    return allIncidents.filter(inc => inc.reporterId === reporter.id);
  }, [reporter, allIncidents]);

  const reporterStats = useMemo(() => {
    if (!reporter) return { total: 0, falseAlarms: 0, byType: {}, bySeverity: {} };
    const incidents = reporterIncidents;
    const byType = incidents.reduce((acc, inc) => {
      const typeLabel = getLabel(appConfig.incidentTypes, inc.aiCategory);
      acc[typeLabel] = (acc[typeLabel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>); // Key is now label

    const bySeverity = incidents.reduce((acc, inc) => {
      const severityLabel = getLabel(appConfig.severities, inc.aiSeverity);
      acc[severityLabel] = (acc[severityLabel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>); // Key is now label

    return {
      total: incidents.length,
      falseAlarms: incidents.filter(inc => inc.status === Status.FALSE_ALARM).length,
      byType,
      bySeverity,
    };
  }, [reporter, reporterIncidents, appConfig]);

  if (!reporter) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-xl text-center text-slate-500">
        <p>No reporter selected or reporter not found.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">
          Back to Directory
        </button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
     if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setEditableReporter(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'homeLatitude' || name === 'homeLongitude') {
        setEditableReporter(prev => ({ ...prev, [name]: value ? parseFloat(value) : undefined }));
    }
    else {
        setEditableReporter(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMapClickForHomeLocation = (clickedIncident: Incident) => { // The IncidentMap calls onMarkerClick with an Incident object
    const lat = clickedIncident.latitude;
    const lng = clickedIncident.longitude;
    setEditableReporter(prev => ({...prev, homeLatitude: lat, homeLongitude: lng }));
    setTempHomeLocation({lat, lng});
  };

  const handleSaveChanges = () => {
    const updatedReporterData = {
      ...reporter,
      ...editableReporter,
      userType: editableReporter.userType as UserType, 
      homeLatitude: editableReporter.homeLatitude,
      homeLongitude: editableReporter.homeLongitude,
    } as Reporter; 
    onUpdateReporter(updatedReporterData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    if (reporter) {
      setEditableReporter({
        firstName: reporter.firstName || '',
        lastName: reporter.lastName || '',
        userType: reporter.userType,
        isTrustedSource: reporter.isTrustedSource,
        notes: reporter.notes || '',
        isAgriculturalUnionMember: reporter.isAgriculturalUnionMember || '',
        farmName: reporter.farmName || '',
        city: reporter.city || '',
        homeLatitude: reporter.homeLatitude,
        homeLongitude: reporter.homeLongitude,
      });
      setTempHomeLocation(reporter.homeLatitude && reporter.homeLongitude ? {lat: reporter.homeLatitude, lng: reporter.homeLongitude} : null);
    }
    setIsEditing(false);
  };
  
  const inputClass = "block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:bg-slate-100";
  const labelClass = "block text-sm font-medium text-slate-600 mb-1";
  const reporterUserTypeLabel = getLabel(appConfig.userTypes, reporter.userType);


  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-xl shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
              {reporter.isTrustedSource && <span className="mr-2 text-emerald-500" title="Trusted Source">{ShieldCheckIcon}</span>}
              {reporter.firstName || 'Unknown'} {reporter.lastName || ''}
            </h2>
            <p className="text-slate-500 text-sm">{reporter.phoneNumber} - {reporterUserTypeLabel}</p>
             <p className="text-xs text-slate-400 mt-0.5">Member since: {new Date(reporter.dateAdded || Date.now()).toLocaleDateString()}</p>
          </div>
          <div className="mt-3 sm:mt-0 flex space-x-2">
            <button onClick={onBack} className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-300 text-sm font-medium rounded-md hover:bg-slate-200">
              Back
            </button>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-md hover:bg-emerald-600"
              >
                {EditIcon} <span className="ml-1.5">Edit Reporter</span>
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="border-t border-slate-200 pt-4 space-y-4">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Edit Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="firstName" className={labelClass}>First Name</label>
                    <input type="text" name="firstName" id="firstName" value={editableReporter.firstName} onChange={handleInputChange} className={inputClass} />
                </div>
                <div>
                    <label htmlFor="lastName" className={labelClass}>Last Name</label>
                    <input type="text" name="lastName" id="lastName" value={editableReporter.lastName} onChange={handleInputChange} className={inputClass} />
                </div>
                 <div>
                    <label htmlFor="userType" className={labelClass}>User Type</label>
                    <Select name="userType" id="userType" options={activeUserTypeOptions} value={editableReporter.userType} onChange={handleInputChange} className={inputClass} />
                </div>
                <div>
                    <label htmlFor="farmName" className={labelClass}>Farm Name</label>
                    <input type="text" name="farmName" id="farmName" value={editableReporter.farmName} onChange={handleInputChange} className={inputClass} />
                </div>
                 <div>
                    <label htmlFor="city" className={labelClass}>City / Town</label>
                    <input type="text" name="city" id="city" value={editableReporter.city} onChange={handleInputChange} className={inputClass} />
                </div>
                <div>
                    <label htmlFor="isAgriculturalUnionMember" className={labelClass}>Agricultural Union Member (Name)</label>
                    <input type="text" name="isAgriculturalUnionMember" id="isAgriculturalUnionMember" value={editableReporter.isAgriculturalUnionMember} onChange={handleInputChange} className={inputClass} placeholder="e.g., Agri Western Cape"/>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="homeLatitude" className={labelClass}>Home Latitude</label>
                    <input type="number" step="any" name="homeLatitude" id="homeLatitude" value={editableReporter.homeLatitude || ''} onChange={handleInputChange} className={inputClass} />
                </div>
                <div>
                    <label htmlFor="homeLongitude" className={labelClass}>Home Longitude</label>
                    <input type="number" step="any" name="homeLongitude" id="homeLongitude" value={editableReporter.homeLongitude || ''} onChange={handleInputChange} className={inputClass} />
                </div>
            </div>
            <div className="h-48 w-full rounded-lg shadow-sm overflow-hidden border border-slate-200">
                <IncidentMap
                    incidents={tempHomeLocation ? [{
                        id: 'reporter-home-marker', 
                        latitude: tempHomeLocation.lat, 
                        longitude: tempHomeLocation.lng,
                        description: "Reporter's Home Location", 
                        aiCategory: IncidentType.OTHER, 
                        aiSeverity: Severity.LOW,
                        status: Status.NEW, // Dummy status
                        timestampReported: new Date().toISOString(),
                        reporterId: reporter.id,
                        aiExtractedKeywords: [], 
                    }] : []}
                    selectedIncident={null}
                    onMarkerClick={handleMapClickForHomeLocation} 
                    center={tempHomeLocation || {lat: -33.9249, lng: 18.4241}} // Default if no location
                    zoom={tempHomeLocation ? 15 : 9}
                    className="h-full w-full"
                    showControls={false}
                />
            </div>
             <p className="text-xs text-slate-500 mt-0.5">Click on map to set home location, or enter coordinates manually.</p>


             <div>
                <label htmlFor="notes" className={labelClass}>Notes</label>
                <textarea name="notes" id="notes" value={editableReporter.notes} onChange={handleInputChange} rows={4} className={inputClass} />
            </div>
            <div className="flex items-center">
                <input type="checkbox" name="isTrustedSource" id="isTrustedSourceEdit" checked={!!editableReporter.isTrustedSource} onChange={handleInputChange} className="h-4 w-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" />
                <label htmlFor="isTrustedSourceEdit" className="ml-2 block text-sm text-slate-800">Mark as Trusted Source</label>
            </div>
            <div className="flex justify-end space-x-3 pt-3">
                <button onClick={handleCancelEdit} className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 border border-slate-300 text-sm font-medium rounded-md hover:bg-slate-200">
                    {CancelIcon} <span className="ml-1.5">Cancel</span>
                </button>
                <button onClick={handleSaveChanges} className="flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700">
                    {SaveIcon} <span className="ml-1.5">Save Changes</span>
                </button>
            </div>
          </div>
        ) : (
          <dl className="border-t border-slate-200 pt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
            <DetailItem label="Full Name" value={`${reporter.firstName || ''} ${reporter.lastName || ''}`.trim() || 'Not Provided'} />
            <DetailItem label="Phone Number" value={reporter.phoneNumber} />
            <DetailItem label="User Type" value={reporterUserTypeLabel} />
            <DetailItem label="Trusted Source" value={reporter.isTrustedSource ? 'Yes' : 'No'} />
            <DetailItem label="Date Added" value={new Date(reporter.dateAdded || Date.now()).toLocaleDateString()} />
            <DetailItem label="Agricultural Union" value={reporter.isAgriculturalUnionMember || <span className="italic text-slate-400">N/A</span>} />
            <DetailItem label="Farm Name" value={reporter.farmName || <span className="italic text-slate-400">N/A</span>} />
            <DetailItem label="City / Town" value={reporter.city || <span className="italic text-slate-400">N/A</span>} />
            <DetailItem 
                label="Home Location" 
                value={reporter.homeLatitude && reporter.homeLongitude ? `${reporter.homeLatitude.toFixed(5)}, ${reporter.homeLongitude.toFixed(5)}` : <span className="italic text-slate-400">Not Set</span>} 
            />
            <DetailItem label="Notes" value={reporter.notes || <span className="italic text-slate-400">No notes added.</span>} className="md:col-span-2 whitespace-pre-wrap"/>
          </dl>
        )}
      </div>

      <div className="p-6 bg-white rounded-xl shadow-xl">
        <h3 className="text-xl font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-3">Reporter Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Reports" value={reporterStats.total} />
          <StatCard title="False Alarms" value={reporterStats.falseAlarms} color={reporterStats.falseAlarms > 0 ? "text-amber-600" : undefined} />
          <div className="sm:col-span-1 lg:col-span-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-600 mb-2">Reports by Type:</h4>
              {Object.entries(reporterStats.byType).length > 0 ? (
                <ul className="text-xs space-y-1">
                    {Object.entries(reporterStats.byType).map(([typeLabel, count])=>(
                        <li key={typeLabel} className="flex justify-between">
                            <span>{typeLabel}:</span> <span className="font-medium">{count}</span>
                        </li>
                    ))}
                </ul>
              ) : <p className="text-xs text-slate-400 italic">No reports by type.</p>}
          </div>
           <div className="sm:col-span-1 lg:col-span-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-600 mb-2">Reports by Severity:</h4>
              {Object.entries(reporterStats.bySeverity).length > 0 ? (
                 <ul className="text-xs space-y-1">
                    {Object.entries(reporterStats.bySeverity).map(([severityLabel, count])=>(
                        <li key={severityLabel} className="flex justify-between items-center">
                           {/* Find original severity ID for Badge value prop */}
                           <Badge text={severityLabel} type="severity" value={appConfig.severities.find(s => s.label === severityLabel)?.id || severityLabel} size="sm"/>
                           <span className="font-medium ml-2">{count}</span>
                        </li>
                    ))}
                </ul>
              ): <p className="text-xs text-slate-400 italic">No reports by severity.</p>}
          </div>
        </div>
      </div>

      <div className="p-6 bg-white rounded-xl shadow-xl">
        <h3 className="text-xl font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-3">Incidents Reported ({reporterIncidents.length})</h3>
        {reporterIncidents.length > 0 ? (
          <IncidentTable incidents={reporterIncidents} onSelectIncident={onSelectIncident} appConfig={appConfig} />
        ) : (
          <p className="text-slate-500 italic">This reporter has not reported any incidents yet.</p>
        )}
      </div>
      
      <div className="p-6 bg-white rounded-xl shadow-xl">
        <h3 className="text-xl font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-3">Communication History</h3>
        <p className="text-slate-500 italic">Feature coming soon: Display WhatsApp messages from this reporter.</p>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number, color?: string }> = ({ title, value, color = "text-emerald-600" }) => (
  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center shadow-sm">
    <p className="text-xs text-slate-500 uppercase tracking-wider">{title}</p>
    <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
  </div>
);

export default ReporterDetailView;