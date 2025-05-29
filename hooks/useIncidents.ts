
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Incident, FilterCriteria, Status, IncidentType, Reporter, UserType, AppConfiguration, Severity } from '../types';
import { MOCK_INCIDENTS, MOCK_REPORTERS } from '../constants';
import { useAppConfig } from './useAppConfig'; // Import useAppConfig

type UseAppConfigReturnType = ReturnType<typeof useAppConfig>;

// Simulate API call for Incidents
const fetchIncidentsFromApi = (): Promise<Incident[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(JSON.parse(JSON.stringify(MOCK_INCIDENTS))); // Deep copy
    }, 500);
  });
};

// Simulate API call for Reporters
const fetchReportersFromApi = (): Promise<Reporter[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(JSON.parse(JSON.stringify(MOCK_REPORTERS))); // Deep copy
    }, 300);
  });
};

export const useIncidents = (appConfigHook: UseAppConfigReturnType) => {
  const { config: appConfig, getActiveItems, getLabel } = appConfigHook;

  const [allIncidents, setAllIncidents] = useState<Incident[]>([]);
  const [reporters, setReporters] = useState<Reporter[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [filters, setFilters] = useState<FilterCriteria>({
    status: "",
    type: "",
    searchTerm: "",
  });

  const calculateReporterStats = useCallback((reporterList: Reporter[], incidentList: Incident[]): Reporter[] => {
    return reporterList.map(reporter => {
      const incidentsByReporter = incidentList.filter(inc => inc.reporterId === reporter.id);
      return {
        ...reporter,
        incidentsReportedCount: incidentsByReporter.length,
        falseAlarmCount: incidentsByReporter.filter(inc => inc.status === Status.FALSE_ALARM).length,
        incidents: incidentsByReporter, 
      };
    });
  }, []);

  const resolveReporterForIncident = useCallback((incident: Incident, reporterList: Reporter[]): Incident => {
    const reporter = reporterList.find(r => r.id === incident.reporterId);
    return {
      ...incident,
      reporter: reporter, 
      isTrustedReport: reporter?.isTrustedSource || false,
    };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (appConfigHook.isLoading) return; // Wait for config to load

      setIsLoading(true);
      try {
        const [incidentData, rawReporterData] = await Promise.all([
          fetchIncidentsFromApi(),
          fetchReportersFromApi()
        ]);
        
        const processedReporters = calculateReporterStats(rawReporterData, incidentData);
        setReporters(processedReporters);

        const resolvedIncidents = incidentData.map(inc => resolveReporterForIncident(inc, processedReporters));
        setAllIncidents(resolvedIncidents);
        
        setError(null);
      } catch (e) {
        setError("Failed to fetch data.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [resolveReporterForIncident, calculateReporterStats, appConfigHook.isLoading]);


  const processedIncidents = useMemo(() => {
    return allIncidents.map(inc => resolveReporterForIncident(inc, reporters));
  }, [allIncidents, reporters, resolveReporterForIncident]);

  const filteredIncidents = useMemo(() => {
    return processedIncidents.filter(incident => {
      const statusMatch = !filters.status || incident.status === filters.status;
      const typeMatch = !filters.type || incident.aiCategory === filters.type;
      
      // Use configured labels for searching if searchTerm is present
      const typeLabel = filters.searchTerm ? getLabel(appConfig.incidentTypes, incident.aiCategory) : incident.aiCategory;
      const severityLabel = filters.searchTerm ? getLabel(appConfig.severities, incident.aiSeverity) : incident.aiSeverity;


      const searchTermMatch = !filters.searchTerm || 
        incident.id.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (incident.originalMessageText && incident.originalMessageText.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        (incident.voiceNoteTranscription && incident.voiceNoteTranscription.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        (incident.address && incident.address.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        typeLabel.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        severityLabel.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (incident.reporter?.firstName && incident.reporter.firstName.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        (incident.reporter?.lastName && incident.reporter.lastName.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        (incident.reporter?.phoneNumber && incident.reporter.phoneNumber.includes(filters.searchTerm));

      return statusMatch && typeMatch && searchTermMatch;
    });
  }, [processedIncidents, filters, appConfig, getLabel]);

  const handleSelectIncident = useCallback((incident: Incident | null) => {
    setSelectedIncident(incident);
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<FilterCriteria>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);
  
  const clearFilters = useCallback(() => {
    setFilters({ status: "", type: "", searchTerm: "" });
  }, []);

  const updateIncident = useCallback((updatedIncident: Incident) => {
    const resolvedUpdatedIncident = resolveReporterForIncident(updatedIncident, reporters);
    setAllIncidents(prevIncidents =>
      prevIncidents.map(inc =>
        inc.id === resolvedUpdatedIncident.id ? resolvedUpdatedIncident : inc
      )
    );
    if (selectedIncident && selectedIncident.id === resolvedUpdatedIncident.id) {
      setSelectedIncident(resolvedUpdatedIncident);
    }
    setReporters(prevReporters => calculateReporterStats(prevReporters, allIncidents.map(inc => inc.id === updatedIncident.id ? updatedIncident : inc)));
  }, [selectedIncident, reporters, resolveReporterForIncident, calculateReporterStats, allIncidents]);

  const addIncident = useCallback((newIncidentData: Omit<Incident, 'id' | 'timestampReported' | 'reporter' | 'isTrustedReport'> & { reporterDetails?: Partial<Reporter> & { phoneNumber: string } }) => {
    let reporterId = newIncidentData.reporterId;
    let finalReportersList = [...reporters]; 

    if (newIncidentData.reporterDetails && newIncidentData.reporterDetails.phoneNumber) {
        const existingReporter = finalReportersList.find(r => r.phoneNumber === newIncidentData.reporterDetails!.phoneNumber);
        if (existingReporter) {
            reporterId = existingReporter.id;
        } else {
            const newReporter: Reporter = {
                id: newIncidentData.reporterDetails.phoneNumber, 
                phoneNumber: newIncidentData.reporterDetails.phoneNumber,
                firstName: newIncidentData.reporterDetails.firstName || '',
                lastName: newIncidentData.reporterDetails.lastName || '',
                userType: newIncidentData.reporterDetails.userType || UserType.CITIZEN,
                isTrustedSource: newIncidentData.reporterDetails.isTrustedSource !== undefined ? newIncidentData.reporterDetails.isTrustedSource : (newIncidentData.reporterDetails.userType === UserType.SAPS_MEMBER || newIncidentData.reporterDetails.userType === UserType.SECURITY_OFFICER || newIncidentData.reporterDetails.userType === UserType.ADMIN),
                notes: newIncidentData.reporterDetails.notes || '',
                dateAdded: new Date().toISOString(),
                incidentsReportedCount: 0,
                falseAlarmCount: 0,
                // New fields
                isAgriculturalUnionMember: newIncidentData.reporterDetails.isAgriculturalUnionMember || '',
                farmName: newIncidentData.reporterDetails.farmName || '',
                city: newIncidentData.reporterDetails.city || '',
                homeLatitude: newIncidentData.reporterDetails.homeLatitude,
                homeLongitude: newIncidentData.reporterDetails.homeLongitude,
            };
            finalReportersList.push(newReporter);
            reporterId = newReporter.id;
        }
    }
    
    if (!reporterId) { 
        const unknownReporter = finalReportersList.find(r => r.userType === UserType.UNKNOWN && r.id === "UNKNOWN_REPORTER_1"); 
        if(unknownReporter) {
            reporterId = unknownReporter.id;
        } else { 
            const newUnknown: Reporter = {id: "NEW_UNKNOWN_" + Date.now(), phoneNumber: "N/A", userType: UserType.UNKNOWN, isTrustedSource: false, dateAdded: new Date().toISOString(), incidentsReportedCount: 0, falseAlarmCount: 0};
            finalReportersList.push(newUnknown);
            reporterId = newUnknown.id;
        }
    }

    const incidentWithDefaults: Incident = {
      ...newIncidentData,
      id: `INC${String(Date.now()).slice(-5)}${Math.floor(Math.random()*100)}`,
      timestampReported: new Date().toISOString(),
      reporterId: reporterId!,
      aiCategory: newIncidentData.aiCategory as IncidentType,
      aiSeverity: newIncidentData.aiSeverity as Severity,
      status: newIncidentData.status as Status,
    };
    
    const newIncidentList = [incidentWithDefaults, ...allIncidents];
    const updatedReporters = calculateReporterStats(finalReportersList, newIncidentList.map(inc => resolveReporterForIncident(inc, finalReportersList))); 
    
    setAllIncidents(newIncidentList.map(inc => resolveReporterForIncident(inc, updatedReporters)));
    setReporters(updatedReporters);

    return resolveReporterForIncident(incidentWithDefaults, updatedReporters);
  }, [reporters, allIncidents, resolveReporterForIncident, calculateReporterStats]);


  const addReporter = useCallback((reporterData: Omit<Reporter, 'id' | 'dateAdded' | 'incidentsReportedCount' | 'falseAlarmCount' | 'incidents'>): Reporter | undefined => {
    const existingReporter = reporters.find(r => r.phoneNumber === reporterData.phoneNumber);
    if (existingReporter) {
      alert("Reporter with this phone number already exists.");
      return existingReporter; 
    }

    const newReporter: Reporter = {
      ...reporterData,
      id: reporterData.phoneNumber, 
      dateAdded: new Date().toISOString(),
      incidentsReportedCount: 0,
      falseAlarmCount: 0,
      incidents: [],
      isAgriculturalUnionMember: reporterData.isAgriculturalUnionMember || '', // Ensure string
    };
    
    const updatedReporters = calculateReporterStats([...reporters, newReporter], allIncidents);
    setReporters(updatedReporters);
    return newReporter;
  }, [reporters, allIncidents, calculateReporterStats]);

  const updateReporter = useCallback((updatedReporterData: Reporter) => {
    let found = false;
    const updatedReportersList = reporters.map(r => {
      if (r.id === updatedReporterData.id) {
        found = true;
        // Ensure isAgriculturalUnionMember is handled as string
        return { ...r, ...updatedReporterData, isAgriculturalUnionMember: updatedReporterData.isAgriculturalUnionMember || '' }; 
      }
      return r;
    });

    if (!found) { 
        console.warn("Reporter to update not found, adding as new is not implemented here. Use addReporter.");
        // For simplicity, if not found, we just update the list as is (no addition)
        // To add if not found, you'd call addReporter or similar logic.
    }
    
    const finalReporters = calculateReporterStats(updatedReportersList, allIncidents);
    setReporters(finalReporters);

    setAllIncidents(prevIncidents => prevIncidents.map(inc => {
        if (inc.reporterId === updatedReporterData.id) {
            return resolveReporterForIncident(inc, finalReporters);
        }
        return inc;
    }));

  }, [reporters, allIncidents, calculateReporterStats, resolveReporterForIncident]);


  const statusOptions = useMemo(() => [
    { value: "", label: "All Statuses" },
    ...getActiveItems(appConfig.statuses).map(s => ({ value: s.id, label: s.label }))
  ], [appConfig.statuses, getActiveItems]);

  const typeOptions = useMemo(() => [
    { value: "", label: "All Types" },
    ...getActiveItems(appConfig.incidentTypes).map(t => ({ value: t.id, label: t.label }))
  ], [appConfig.incidentTypes, getActiveItems]);
  
  const severityOptions = useMemo(() => [ // Added severityOptions
    { value: "", label: "All Severities" },
    ...getActiveItems(appConfig.severities).map(s => ({ value: s.id, label: s.label }))
  ], [appConfig.severities, getActiveItems]);

  const userTypeOptions = useMemo(() => [ // Added userTypeOptions for forms
    { value: "", label: "Select User Type" },
    ...getActiveItems(appConfig.userTypes).map(u => ({ value: u.id, label: u.label }))
  ], [appConfig.userTypes, getActiveItems]);

  const reporterOptions = useMemo(() => [
    { value: "", label: "Select Reporter" },
    ...reporters.map(r => ({ 
        value: r.id, 
        label: `${r.firstName || 'N/A'} ${r.lastName || ''} (${r.phoneNumber || r.id}) - ${getLabel(appConfig.userTypes, r.userType)}`.trim()
    }))
  ], [reporters, appConfig.userTypes, getLabel]);


  return {
    allIncidents: processedIncidents, 
    filteredIncidents,
    isLoading,
    error,
    selectedIncident,
    filters,
    handleSelectIncident,
    handleFilterChange,
    clearFilters,
    statusOptions,
    typeOptions,
    severityOptions, // Expose severityOptions
    userTypeOptions, // Expose userTypeOptions
    updateIncident,
    addIncident,
    reporters, 
    reporterOptions,
    addReporter,
    updateReporter,
    getReporterById: (id: string) => reporters.find(r => r.id === id),
  };
};