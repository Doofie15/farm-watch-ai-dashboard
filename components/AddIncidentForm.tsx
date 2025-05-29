
import React, { useState, useEffect } from 'react';
import { Incident, IncidentType, Severity, Status, Reporter, UserType, AppConfiguration } from '../types';
import Select from './ui/Select';
import IncidentMap from './IncidentMap'; 

interface AddIncidentFormProps {
  addIncident: (data: Omit<Incident, 'id' | 'timestampReported' | 'reporter' | 'isTrustedReport'> & { reporterDetails?: Partial<Reporter> & { phoneNumber: string } }) => Incident | undefined;
  reporters: Reporter[]; 
  reporterOptions: { value: string; label: string }[]; 
  // Options provided by useIncidents, derived from appConfig
  incidentTypeOptions: { value: string; label: string }[];
  severityOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
  userTypeOptions: { value: string; label: string }[];
  setPage: (page: string) => void; 
  appConfig: AppConfiguration;
}

const AddIncidentForm: React.FC<AddIncidentFormProps> = ({ 
    addIncident, 
    reporters, 
    reporterOptions, 
    incidentTypeOptions,
    severityOptions,
    statusOptions,
    userTypeOptions,
    setPage,
    appConfig 
}) => {
  
  // Filter out placeholder "All ..." or "Select..." options before finding default
  const getFirstActiveValue = (options: {value: string; label: string}[], fallback: string) => {
    const firstActualOption = options.find(opt => opt.value !== "");
    return firstActualOption ? firstActualOption.value : fallback;
  }

  const defaultIncidentType = getFirstActiveValue(incidentTypeOptions, IncidentType.OTHER);
  const defaultSeverity = getFirstActiveValue(severityOptions, Severity.MEDIUM);
  const defaultStatus = getFirstActiveValue(statusOptions, Status.NEW);
  const defaultUserType = getFirstActiveValue(userTypeOptions, UserType.CITIZEN);


  const initialFormData = {
    aiCategory: defaultIncidentType as IncidentType,
    aiSeverity: defaultSeverity as Severity,
    status: defaultStatus as Status,
    description: '',
    timestampOccurred: new Date().toISOString().slice(0, 16), 
    latitude: -33.9249, 
    longitude: 18.4241,
    address: '',
    originalMessageText: '',
    voiceNoteTranscription: '',
    aiExtractedKeywords: '', 
    adminNotes: '',
    reporterId: '', 
    newReporterPhoneNumber: '',
    newReporterFirstName: '',
    newReporterLastName: '',
    newReporterUserType: defaultUserType as UserType,
  };
  
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewReporterFields, setShowNewReporterFields] = useState(false);
  
  const [mapCenter, setMapCenter] = useState({ lat: formData.latitude, lng: formData.longitude });
  const [markerPosition, setMarkerPosition] = useState<{lat: number, lng: number} | null>(mapCenter);

  // Reset form if default options change (e.g. due to appConfig changes)
  useEffect(() => {
    setFormData(prev => ({
        ...prev, // Keep existing user input if possible for description etc.
        aiCategory: getFirstActiveValue(incidentTypeOptions, IncidentType.OTHER) as IncidentType,
        aiSeverity: getFirstActiveValue(severityOptions, Severity.MEDIUM) as Severity,
        status: getFirstActiveValue(statusOptions, Status.NEW) as Status,
        newReporterUserType: getFirstActiveValue(userTypeOptions, UserType.CITIZEN) as UserType,
    }));
  }, [incidentTypeOptions, severityOptions, statusOptions, userTypeOptions]);


  const handleMapClick = (clickedIncident: Incident) => {
    const lat = clickedIncident.latitude;
    const lng = clickedIncident.longitude;

    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
    setMarkerPosition({ lat, lng });
  };
  
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "latitude" || name === "longitude") {
        const lat = name === "latitude" ? parseFloat(value) : formData.latitude;
        const lng = name === "longitude" ? parseFloat(value) : formData.longitude;
        if (!isNaN(lat) && !isNaN(lng)) {
            setMarkerPosition({lat, lng});
            setMapCenter({lat, lng}); 
        }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.description || !formData.latitude || !formData.longitude) {
      setError("Description and valid coordinates are required.");
      setIsSubmitting(false);
      return;
    }
    if (showNewReporterFields && !formData.newReporterPhoneNumber) {
        setError("Phone number is required for a new reporter.");
        setIsSubmitting(false);
        return;
    }
    if(!showNewReporterFields && !formData.reporterId){
        setError("Please select an existing reporter or provide details for a new one.");
        setIsSubmitting(false);
        return;
    }

    const incidentData: Omit<Incident, 'id' | 'timestampReported' | 'reporter' | 'isTrustedReport'> & { reporterDetails?: Partial<Reporter> & { phoneNumber: string } } = {
      description: formData.description,
      aiCategory: formData.aiCategory,
      aiSeverity: formData.aiSeverity,
      status: formData.status,
      timestampOccurred: formData.timestampOccurred ? new Date(formData.timestampOccurred).toISOString() : undefined,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      address: formData.address,
      originalMessageText: formData.originalMessageText || undefined,
      voiceNoteTranscription: formData.voiceNoteTranscription || undefined,
      aiExtractedKeywords: formData.aiExtractedKeywords.split(',').map(k => k.trim()).filter(k => k),
      adminNotes: formData.adminNotes || undefined,
      reporterId: showNewReporterFields ? '' : formData.reporterId, 
    };

    if (showNewReporterFields && formData.newReporterPhoneNumber) {
      incidentData.reporterDetails = {
        phoneNumber: formData.newReporterPhoneNumber,
        firstName: formData.newReporterFirstName,
        lastName: formData.newReporterLastName,
        userType: formData.newReporterUserType,
      };
      incidentData.reporterId = formData.newReporterPhoneNumber; 
    } else if (!showNewReporterFields && formData.reporterId) {
        incidentData.reporterId = formData.reporterId;
    }

    try {
      const added = addIncident(incidentData);
      if (added) {
        alert(`Incident ${added.id} added successfully!`);
        setFormData({ // Reset to new initial state which respects current config
            aiCategory: getFirstActiveValue(incidentTypeOptions, IncidentType.OTHER) as IncidentType,
            aiSeverity: getFirstActiveValue(severityOptions, Severity.MEDIUM) as Severity,
            status: getFirstActiveValue(statusOptions, Status.NEW) as Status,
            description: '',
            timestampOccurred: new Date().toISOString().slice(0, 16), 
            latitude: -33.9249, 
            longitude: 18.4241,
            address: '',
            originalMessageText: '',
            voiceNoteTranscription: '',
            aiExtractedKeywords: '', 
            adminNotes: '',
            reporterId: '', 
            newReporterPhoneNumber: '',
            newReporterFirstName: '',
            newReporterLastName: '',
            newReporterUserType: getFirstActiveValue(userTypeOptions, UserType.CITIZEN) as UserType,
        }); 
        setShowNewReporterFields(false);
        setMarkerPosition({lat: initialFormData.latitude, lng: initialFormData.longitude});
        setPage('Dashboard'); 
      } else {
        setError("Failed to add incident. Please try again.");
      }
    } catch (err) {
      console.error("Error adding incident:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formFieldClass = "block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm disabled:bg-slate-100";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";
  
  // Filter out the "All X" or "Select..." placeholder options for form selects
  const formIncidentTypeOptions = incidentTypeOptions.filter(opt => opt.value !== "");
  const formSeverityOptions = severityOptions.filter(opt => opt.value !== "");
  const formStatusOptions = statusOptions.filter(opt => opt.value !== "");
  const formUserTypeOptions = userTypeOptions.filter(opt => opt.value !== "");
  // reporterOptions from useIncidents might already have a "Select Reporter"
  const formReporterOptions = reporterOptions;


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="description" className={labelClass}>Description *</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={4} className={formFieldClass} required />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="aiCategory" className={labelClass}>Incident Type *</label>
              <Select id="aiCategory" name="aiCategory" options={formIncidentTypeOptions} value={formData.aiCategory} onChange={handleInputChange} className={formFieldClass} required />
            </div>
            <div>
              <label htmlFor="aiSeverity" className={labelClass}>Severity *</label>
              <Select id="aiSeverity" name="aiSeverity" options={formSeverityOptions} value={formData.aiSeverity} onChange={handleInputChange} className={formFieldClass} required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div>
                <label htmlFor="status" className={labelClass}>Status *</label>
                <Select id="status" name="status" options={formStatusOptions} value={formData.status} onChange={handleInputChange} className={formFieldClass} required />
            </div>
            <div>
              <label htmlFor="timestampOccurred" className={labelClass}>Date/Time Occurred</label>
              <input type="datetime-local" id="timestampOccurred" name="timestampOccurred" value={formData.timestampOccurred} onChange={handleInputChange} className={formFieldClass} />
            </div>
          </div>

          <div>
            <label htmlFor="address" className={labelClass}>Address / Area Description</label>
            <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} className={formFieldClass} placeholder="e.g., Near N2 highway, Farm Gate 3" />
          </div>
          <div>
            <label htmlFor="aiExtractedKeywords" className={labelClass}>Keywords (comma-separated)</label>
            <input type="text" id="aiExtractedKeywords" name="aiExtractedKeywords" value={formData.aiExtractedKeywords} onChange={handleInputChange} className={formFieldClass} placeholder="e.g., blue bakkie, 3 individuals" />
          </div>
          <div>
            <label htmlFor="adminNotes" className={labelClass}>Admin Notes</label>
            <textarea id="adminNotes" name="adminNotes" value={formData.adminNotes} onChange={handleInputChange} rows={3} className={formFieldClass} />
          </div>
           <div>
            <label htmlFor="originalMessageText" className={labelClass}>Original Message (if any)</label>
            <textarea id="originalMessageText" name="originalMessageText" value={formData.originalMessageText} onChange={handleInputChange} rows={2} className={formFieldClass} />
          </div>
        </div>

        <div className="space-y-4">
            <div>
                <h3 className="text-md font-semibold text-slate-700 mb-2">Location *</h3>
                <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                        <label htmlFor="latitude" className={labelClass}>Latitude</label>
                        <input type="number" step="any" id="latitude" name="latitude" value={formData.latitude} onChange={handleInputChange} className={formFieldClass} required />
                    </div>
                    <div>
                        <label htmlFor="longitude" className={labelClass}>Longitude</label>
                        <input type="number" step="any" id="longitude" name="longitude" value={formData.longitude} onChange={handleInputChange} className={formFieldClass} required />
                    </div>
                </div>
                <div className="h-64 w-full rounded-lg shadow-md overflow-hidden border border-slate-200">
                    <IncidentMap
                        incidents={markerPosition ? [{
                            id: 'new-incident-marker', 
                            latitude: markerPosition.lat, 
                            longitude: markerPosition.lng,
                            description: formData.description, 
                            aiCategory: formData.aiCategory, 
                            aiSeverity: formData.aiSeverity,
                            status: formData.status,
                            timestampReported: new Date().toISOString(),
                            reporterId: 'temp',
                            aiExtractedKeywords: [], 
                        }] : []}
                        selectedIncident={null}
                        onMarkerClick={(incident) => handleMapClick(incident)} 
                        center={mapCenter}
                        zoom={10}
                        className="h-full w-full"
                        showControls={false}
                    />
                </div>
                 <p className="text-xs text-slate-500 mt-1">Click on the map to set coordinates, or enter manually.</p>
            </div>

            <div>
                <h3 className="text-md font-semibold text-slate-700 mb-2">Reporter Information *</h3>
                <div className="mb-3">
                    <label className="flex items-center">
                        <input 
                            type="checkbox" 
                            checked={showNewReporterFields} 
                            onChange={() => setShowNewReporterFields(!showNewReporterFields)}
                            className="form-checkbox h-4 w-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 mr-2"
                        />
                        Add New Reporter
                    </label>
                </div>

                {!showNewReporterFields && (
                    <div>
                        <label htmlFor="reporterId" className={labelClass}>Select Existing Reporter</label>
                        <Select id="reporterId" name="reporterId" options={formReporterOptions} value={formData.reporterId} onChange={handleInputChange} className={formFieldClass} />
                    </div>
                )}

                {showNewReporterFields && (
                    <div className="space-y-3 p-3 border border-slate-200 rounded-md bg-slate-50/50">
                         <div>
                            <label htmlFor="newReporterPhoneNumber" className={labelClass}>Phone Number *</label>
                            <input type="tel" id="newReporterPhoneNumber" name="newReporterPhoneNumber" value={formData.newReporterPhoneNumber} onChange={handleInputChange} className={formFieldClass} placeholder="+27821234567" required={showNewReporterFields}/>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="newReporterFirstName" className={labelClass}>First Name</label>
                                <input type="text" id="newReporterFirstName" name="newReporterFirstName" value={formData.newReporterFirstName} onChange={handleInputChange} className={formFieldClass} />
                            </div>
                            <div>
                                <label htmlFor="newReporterLastName" className={labelClass}>Last Name</label>
                                <input type="text" id="newReporterLastName" name="newReporterLastName" value={formData.newReporterLastName} onChange={handleInputChange} className={formFieldClass} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="newReporterUserType" className={labelClass}>User Type</label>
                            <Select id="newReporterUserType" name="newReporterUserType" options={formUserTypeOptions} value={formData.newReporterUserType} onChange={handleInputChange} className={formFieldClass} />
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      <div className="pt-5 border-t border-slate-200 flex justify-end space-x-3">
        <button 
          type="button" 
          onClick={() => {
             setFormData({ // Reset to new initial state which respects current config
                aiCategory: getFirstActiveValue(incidentTypeOptions, IncidentType.OTHER) as IncidentType,
                aiSeverity: getFirstActiveValue(severityOptions, Severity.MEDIUM) as Severity,
                status: getFirstActiveValue(statusOptions, Status.NEW) as Status,
                description: '',
                timestampOccurred: new Date().toISOString().slice(0, 16), 
                latitude: -33.9249, 
                longitude: 18.4241,
                address: '',
                originalMessageText: '',
                voiceNoteTranscription: '',
                aiExtractedKeywords: '', 
                adminNotes: '',
                reporterId: '', 
                newReporterPhoneNumber: '',
                newReporterFirstName: '',
                newReporterLastName: '',
                newReporterUserType: getFirstActiveValue(userTypeOptions, UserType.CITIZEN) as UserType,
            }); 
            setShowNewReporterFields(false);
            setMarkerPosition({lat: initialFormData.latitude, lng: initialFormData.longitude});
            setError(null);
          }}
          className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-300 text-sm font-medium rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
          disabled={isSubmitting}
        >
          Reset Form
        </button>
        <button 
          type="submit"
          className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Add Incident'}
        </button>
      </div>
    </form>
  );
};

export default AddIncidentForm;