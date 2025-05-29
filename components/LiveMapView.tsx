
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import IncidentMap from './IncidentMap';
import { useIncidents } from '../hooks/useIncidents'; 
import { Incident, IncidentType, Severity, Status, AppConfiguration, ConfigurableListItem } from '../types';
import Select from './ui/Select';
import { GoogleGenAI } from "@google/genai";

type UseIncidentsReturnType = ReturnType<typeof useIncidents>;

interface LiveMapViewProps {
  incidentsHook: UseIncidentsReturnType;
  appConfig: AppConfiguration; // Pass AppConfiguration
}

interface ManualFilters {
  type: IncidentType | "";
  status: Status | "";
  severity: Severity | "";
  dateStart: string;
  dateEnd: string;
}

interface AiDerivedFilters {
  incident_types?: IncidentType[]; 
  statuses?: Status[];
  severities?: Severity[];
  locations?: string[];
  date_range?: { start_date?: string; end_date?: string; relative?: string };
  keywords?: string[];
}

const getDateFromRelative = (relative: string): { start_date?: string; end_date?: string } => {
    const now = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = new Date(now); 

    switch (relative) {
        case "today":
            startDate = new Date(now);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            break;
        case "yesterday":
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 1);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(now);
            endDate.setDate(now.getDate() - 1);
            endDate.setHours(23, 59, 59, 999);
            break;
        case "last 7 days":
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 6); 
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23,59,59,999); 
            break;
        case "last 30 days":
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 29);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23,59,59,999);
            break;
        default: 
            return {};
    }
    
    const toYYYYMMDD = (d: Date) => d.toISOString().split('T')[0];

    return { 
        start_date: startDate ? toYYYYMMDD(startDate) : undefined, 
        end_date: endDate ? toYYYYMMDD(endDate) : undefined
    };
};


const LiveMapView: React.FC<LiveMapViewProps> = ({ incidentsHook, appConfig }) => {
  const {
    allIncidents,
    isLoading,
    error,
    selectedIncident,
    handleSelectIncident,
    statusOptions: configuredStatusOptions, 
    typeOptions: configuredTypeOptions,   
    severityOptions: configuredSeverityOptions,
  } = incidentsHook;

  const initialManualFilters: ManualFilters = {
    type: "",
    status: "",
    severity: "",
    dateStart: "",
    dateEnd: "",
  };

  const [manualFilters, setManualFilters] = useState<ManualFilters>(initialManualFilters);
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiAppliedFiltersDescription, setAiAppliedFiltersDescription] = useState<string>('');
  const [aiDerivedFilters, setAiDerivedFilters] = useState<AiDerivedFilters | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  
  const getLabel = (list: ConfigurableListItem[], id: string): string => {
    const item = list.find(i => i.id === id);
    return item ? item.label : id;
  };

  const handleManualFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setManualFilters(prev => ({
        ...prev,
        [name]: name === 'type' ? value as IncidentType | "" :
                name === 'status' ? value as Status | "" :
                name === 'severity' ? value as Severity | "" :
                value
    }));
    setAiDerivedFilters(null); 
    setAiAppliedFiltersDescription('');
  };
  
  const clearManualFilters = () => {
    setManualFilters(initialManualFilters);
  }

  const incidentsToDisplay = useMemo(() => {
    let result = allIncidents;

    if (aiDerivedFilters) {
        if (aiDerivedFilters.incident_types && aiDerivedFilters.incident_types.length > 0) {
            result = result.filter(inc => aiDerivedFilters.incident_types!.includes(inc.aiCategory as IncidentType));
        }
        if (aiDerivedFilters.statuses && aiDerivedFilters.statuses.length > 0) {
            result = result.filter(inc => aiDerivedFilters.statuses!.includes(inc.status as Status));
        }
        if (aiDerivedFilters.severities && aiDerivedFilters.severities.length > 0) {
            result = result.filter(inc => aiDerivedFilters.severities!.includes(inc.aiSeverity as Severity));
        }
        if (aiDerivedFilters.locations && aiDerivedFilters.locations.length > 0) {
            result = result.filter(inc => 
                aiDerivedFilters.locations!.some(loc => 
                    (inc.address && inc.address.toLowerCase().includes(loc.toLowerCase())) ||
                    (inc.description && inc.description.toLowerCase().includes(loc.toLowerCase()))
                )
            );
        }
        if (aiDerivedFilters.keywords && aiDerivedFilters.keywords.length > 0) {
             result = result.filter(inc => 
                aiDerivedFilters.keywords!.some(keyword => 
                    Object.values(inc).some(val => String(val).toLowerCase().includes(keyword.toLowerCase()))
                )
            );
        }

        let effectiveStartDate: string | undefined = aiDerivedFilters.date_range?.start_date;
        let effectiveEndDate: string | undefined = aiDerivedFilters.date_range?.end_date;

        if (aiDerivedFilters.date_range?.relative) {
            const relativeDates = getDateFromRelative(aiDerivedFilters.date_range.relative);
            effectiveStartDate = relativeDates.start_date || effectiveStartDate;
            effectiveEndDate = relativeDates.end_date || effectiveEndDate;
        }
        
        if (effectiveStartDate) {
            result = result.filter(inc => new Date(inc.timestampReported) >= new Date(effectiveStartDate!));
        }
        if (effectiveEndDate) {
            const endDateObj = new Date(effectiveEndDate!);
            endDateObj.setHours(23, 59, 59, 999);
            result = result.filter(inc => new Date(inc.timestampReported) <= endDateObj);
        }

    } else {
        if (manualFilters.type) {
            result = result.filter(inc => inc.aiCategory === manualFilters.type);
        }
        if (manualFilters.status) {
            result = result.filter(inc => inc.status === manualFilters.status);
        }
        if (manualFilters.severity) {
            result = result.filter(inc => inc.aiSeverity === manualFilters.severity);
        }
        if (manualFilters.dateStart) {
            result = result.filter(inc => new Date(inc.timestampReported) >= new Date(manualFilters.dateStart));
        }
        if (manualFilters.dateEnd) {
            const endDateObj = new Date(manualFilters.dateEnd);
            endDateObj.setHours(23, 59, 59, 999);
            result = result.filter(inc => new Date(inc.timestampReported) <= endDateObj);
        }
    }
    return result;
  }, [allIncidents, manualFilters, aiDerivedFilters]);

  const handleAiSearch = async () => {
    if (!aiSearchQuery.trim()) {
        setAiError("Please enter a search query.");
        return;
    }
    setIsAiSearching(true);
    setAiError(null);
    setAiAppliedFiltersDescription('');
    setAiDerivedFilters(null); 
    setManualFilters(initialManualFilters); 

    try {
      // Initialize GoogleGenAI client here, only when needed
      if (!process.env.API_KEY) {
        setAiError("API Key is not configured. Please ensure process.env.API_KEY is available.");
        setIsAiSearching(false);
        return;
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const activeIncidentTypeLabels = appConfig.incidentTypes.filter(t => t.isActive).map(t => t.label).join('", "');
      const activeStatusLabels = appConfig.statuses.filter(s => s.isActive).map(s => s.label).join('", "');
      const activeSeverityLabels = appConfig.severities.filter(sev => sev.isActive).map(sev => sev.label).join('", "');

      const modelPrompt = `You are an AI assistant for a farm watch application. Your task is to parse a user's natural language query about incidents and extract structured filter criteria.
The user's query is: "${aiSearchQuery}"

Extract the following information if present in the query. Map the user's terms to the *exact* ID values based on the provided valid labels.
- incident_types: array of ID strings (Valid labels and their IDs: ${appConfig.incidentTypes.filter(i=>i.isActive).map(i=>`"${i.label}" (ID: "${i.id}")`).join(', ')})
- statuses: array of ID strings (Valid labels and their IDs: ${appConfig.statuses.filter(i=>i.isActive).map(i=>`"${i.label}" (ID: "${i.id}")`).join(', ')})
- severities: array of ID strings (Valid labels and their IDs: ${appConfig.severities.filter(i=>i.isActive).map(i=>`"${i.label}" (ID: "${i.id}")`).join(', ')})
- locations: array of strings (e.g., town names, farm names, specific areas like "near the N2 highway")
- date_range: object with "start_date" and "end_date" (YYYY-MM-DD format) OR a "relative" date string (valid relative: "today", "yesterday", "last 7 days", "last 30 days").
- keywords: array of strings for general search terms not covered by other fields.

Return the extracted criteria as a JSON object. If a category is not mentioned, omit it from the JSON.
The values in "incident_types", "statuses", and "severities" arrays MUST be the ID strings, not the labels.
For example, if the query is "Show me all 'Theft of Livestock' incidents in Stellenbosch from last week that are still 'Fresh'", and 'Theft of Livestock' has ID 'Stock Theft', and 'Fresh' has ID 'New', your output should be:
{
  "incident_types": ["Stock Theft"],
  "locations": ["Stellenbosch"],
  "date_range": { "relative": "last 7 days" },
  "statuses": ["New"]
}
Only return the JSON object.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: modelPrompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      
      let jsonStr = response.text.trim();
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }

      const parsedFilters: AiDerivedFilters = JSON.parse(jsonStr);
      setAiDerivedFilters(parsedFilters);

      let description = "AI applied filters: ";
      const filterParts: string[] = [];
      if (parsedFilters.incident_types?.length) filterParts.push(`Types: ${parsedFilters.incident_types.map(id => getLabel(appConfig.incidentTypes, id)).join(', ')}`);
      if (parsedFilters.statuses?.length) filterParts.push(`Statuses: ${parsedFilters.statuses.map(id => getLabel(appConfig.statuses, id)).join(', ')}`);
      if (parsedFilters.severities?.length) filterParts.push(`Severities: ${parsedFilters.severities.map(id => getLabel(appConfig.severities, id)).join(', ')}`);
      if (parsedFilters.locations?.length) filterParts.push(`Locations contain: ${parsedFilters.locations.join(', ')}`);
      if (parsedFilters.keywords?.length) filterParts.push(`Keywords: ${parsedFilters.keywords.join(', ')}`);
      if (parsedFilters.date_range) {
        if (parsedFilters.date_range.relative) filterParts.push(`Date: ${parsedFilters.date_range.relative}`);
        else if (parsedFilters.date_range.start_date || parsedFilters.date_range.end_date) {
            let dateDesc = "Date: ";
            if(parsedFilters.date_range.start_date) dateDesc += `from ${parsedFilters.date_range.start_date} `;
            if(parsedFilters.date_range.end_date) dateDesc += `to ${parsedFilters.date_range.end_date}`;
            filterParts.push(dateDesc.trim());
        }
      }
      setAiAppliedFiltersDescription(filterParts.length > 0 ? description + filterParts.join('; ') : "AI found no specific filters for your query, showing all incidents.");

    } catch (e: any) {
      console.error("AI Search Error:", e);
      // Check if 'process' is undefined, which would be a more fundamental issue
      if (typeof process === 'undefined') {
        setAiError("AI search failed: 'process' is not defined. Ensure API key environment is set up.");
      } else {
        setAiError(`AI search failed: ${e.message || 'Could not parse query or API error.'}`);
      }
      setAiDerivedFilters(null);
    } finally {
      setIsAiSearching(false);
    }
  };
  
  const clearAiSearch = () => {
    setAiSearchQuery('');
    setAiDerivedFilters(null);
    setAiAppliedFiltersDescription('');
    setAiError(null);
  };

  if (isLoading && !allIncidents.length) { 
    return <div className="flex justify-center items-center h-full text-lg text-slate-600 p-6">Loading map data...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-lg text-red-600 bg-red-100 p-6 rounded-lg shadow-md border border-red-300 m-6">{error}</div>;
  }
  
  const labelClass = "block text-xs font-medium text-slate-600 mb-0.5";
  const inputClass = "block w-full pl-3 pr-2 py-1.5 text-xs border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 rounded-md shadow-sm bg-white";


  return (
    <div className="h-full w-full flex flex-col bg-slate-50">
      <div className="p-3 bg-slate-100 border-b border-slate-300 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2">
          <div className="flex-grow w-full sm:w-auto">
            <label htmlFor="aiSearch" className={labelClass}>AI Powered Search:</label>
            <input
              type="text"
              id="aiSearch"
              value={aiSearchQuery}
              onChange={(e) => setAiSearchQuery(e.target.value)}
              placeholder="e.g., 'new stock thefts in Paarl last week'"
              className={`${inputClass} text-sm py-2`}
              onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
            />
          </div>
          <button
            onClick={handleAiSearch}
            disabled={isAiSearching}
            className="w-full sm:w-auto bg-emerald-600 text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center"
          >
            {isAiSearching ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1.5"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" /></svg>
            )}
            Search
          </button>
           {aiDerivedFilters && (
            <button onClick={clearAiSearch} className="w-full sm:w-auto bg-slate-200 text-slate-700 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-300">
                Clear AI
            </button>
           )}
        </div>
        {aiError && <p className="text-xs text-red-600 mt-1">{aiError}</p>}
        {aiAppliedFiltersDescription && <p className="text-xs text-emerald-700 mt-1 bg-emerald-50 p-1.5 rounded-md border border-emerald-200">{aiAppliedFiltersDescription}</p>}

        {!aiDerivedFilters && (
            <div className="mt-2 pt-2 border-t border-slate-200">
                <h4 className="text-sm font-medium text-slate-700 mb-1.5">Manual Filters:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    <div>
                        <label htmlFor="filterType" className={labelClass}>Type:</label>
                        <Select id="filterType" name="type" options={configuredTypeOptions} value={manualFilters.type} onChange={handleManualFilterChange} className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="filterStatus" className={labelClass}>Status:</label>
                        <Select id="filterStatus" name="status" options={configuredStatusOptions} value={manualFilters.status} onChange={handleManualFilterChange} className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="filterSeverity" className={labelClass}>Severity:</label>
                        <Select id="filterSeverity" name="severity" options={configuredSeverityOptions} value={manualFilters.severity} onChange={handleManualFilterChange} className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="filterDateStart" className={labelClass}>Date From:</label>
                        <input type="date" id="filterDateStart" name="dateStart" value={manualFilters.dateStart} onChange={handleManualFilterChange} className={inputClass} />
                    </div>
                    <div>
                        <label htmlFor="filterDateEnd" className={labelClass}>Date To:</label>
                        <input type="date" id="filterDateEnd" name="dateEnd" value={manualFilters.dateEnd} onChange={handleManualFilterChange} className={inputClass} />
                    </div>
                    <div className="flex items-end">
                        <button onClick={clearManualFilters} className="w-full bg-slate-200 text-slate-700 px-3 py-1.5 text-xs font-medium rounded-md hover:bg-slate-300">
                            Clear Manual
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
      
      <div className="flex-grow relative">
        <IncidentMap
            incidents={incidentsToDisplay}
            selectedIncident={selectedIncident}
            onMarkerClick={handleSelectIncident}
            className="h-full w-full" 
            center={{ lat: -33.9249, lng: 18.4241 }} 
            zoom={9}
            highlightSelected={true} 
            showControls={true} 
        />
         {incidentsToDisplay.length === 0 && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100/70 backdrop-blur-sm z-10">
                <p className="text-slate-600 p-4 bg-white rounded-lg shadow-md">
                    No incidents match your current filters.
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default LiveMapView;
