
import { Incident, IncidentType, Severity, Status, WhatsAppMessage, WhatsAppMessageType, Reporter, UserType } from './types';

// Pre-calculate counts for mock reporters based on MOCK_INCIDENTS
const reporterIncidents = (reporterId: string, incidents: Incident[]) => {
  return incidents.filter(inc => inc.reporterId === reporterId);
};

const reporterFalseAlarms = (reporterId: string, incidents: Incident[]) => {
  return incidents.filter(inc => inc.reporterId === reporterId && inc.status === Status.FALSE_ALARM).length;
};


export const MOCK_REPORTERS: Reporter[] = [
  { 
    id: "+27820001111", 
    phoneNumber: "+27820001111", 
    firstName: "Pieter", 
    lastName: "Roux", 
    userType: UserType.CITIZEN, 
    isTrustedSource: false, 
    notes: "Regular reporter from Farm A. Often reports suspicious vehicles. Needs verification if reports become frequent or critical.",
    dateAdded: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    // incidentsReportedCount: Will be calculated dynamically by the hook
    // falseAlarmCount: Will be calculated dynamically by the hook
  },
  { 
    id: "+27830002222", 
    phoneNumber: "+27830002222", 
    firstName: "Anna", 
    lastName: "Van Zyl", 
    userType: UserType.VERIFIED_VOLUNTEER, 
    isTrustedSource: true,
    notes: "Active volunteer, lives near the western border of the watch area. Very reliable.",
    dateAdded: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(),
  },
  { 
    id: "+27840003333", 
    phoneNumber: "+27840003333", 
    firstName: "Sgt.", 
    lastName: "Molefe", 
    userType: UserType.SAPS_MEMBER, 
    isTrustedSource: true,
    notes: "Local SAPS contact. Very responsive and provides official updates.",
    dateAdded: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString(),
  },
  { 
    id: "SECURITY_CO_001", 
    phoneNumber: "SECURITY_CO_001", 
    firstName: "Alpha Security", 
    userType: UserType.SECURITY_OFFICER, 
    isTrustedSource: true,
    notes: "Contracted security company for several farms in the area. Patrol logs available on request.",
    dateAdded: new Date(Date.now() - 120 * 24 * 3600 * 1000).toISOString(),
  },
  { 
    id: "ADMIN_USER", 
    phoneNumber: "ADMIN_USER", 
    firstName: "Admin",
    lastName: "User",
    userType: UserType.ADMIN, 
    isTrustedSource: true,
    notes: "System administrator account.",
    dateAdded: new Date(Date.now() - 150 * 24 * 3600 * 1000).toISOString()
  },
  { 
    id: "UNKNOWN_REPORTER_1", 
    phoneNumber: "UNKNOWN_REPORTER_1", 
    userType: UserType.UNKNOWN, 
    isTrustedSource: false,
    notes: "First time reporter. Details need to be gathered if they report again.",
    dateAdded: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
  },
];


export const MOCK_INCIDENTS: Incident[] = [
  {
    id: "INC001",
    reporterId: "+27820001111", // Pieter Roux
    timestampReported: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    timestampOccurred: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    latitude: -33.9249,
    longitude: 18.4241,
    description: "Suspicious vehicle spotted near the main gate. Blue Toyota bakkie, 3 occupants.",
    originalMessageText: "Suspicious vehicle spotted near the main gate. Blue Toyota bakkie, 3 occupants.",
    aiCategory: IncidentType.SUSPICIOUS_ACTIVITY,
    aiSeverity: Severity.MEDIUM,
    aiExtractedKeywords: ["blue bakkie", "suspicious vehicle", "main gate"],
    status: Status.NEW,
    address: "Main Gate, Farm A, Stellenbosch",
    isTrustedReport: MOCK_REPORTERS.find(r => r.id === "+27820001111")?.isTrustedSource || false,
    town: "Stellenbosch",
    municipality: "Stellenbosch Local Municipality",
    district: "Cape Winelands District Municipality",
    province: "Western Cape",
  },
  {
    id: "INC002",
    reporterId: "+27830002222", // Anna Van Zyl
    timestampReported: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    latitude: -33.9849,
    longitude: 18.6241,
    description: "The fence on the western border is broken, looks like someone cut it. Some sheep might be missing.",
    voiceNoteTranscription: "The fence on the western border is broken, looks like someone cut it. Some sheep might be missing.",
    voiceNoteUrl: "https://example.com/audio/voicenote002.mp3",
    aiCategory: IncidentType.STOCK_THEFT,
    aiSeverity: Severity.HIGH,
    aiExtractedKeywords: ["broken fence", "western border", "sheep missing"],
    status: Status.UNDER_INVESTIGATION,
    address: "Western Border, Farm B, Paarl",
    isTrustedReport: MOCK_REPORTERS.find(r => r.id === "+27830002222")?.isTrustedSource || false,
    town: "Paarl",
    municipality: "Drakenstein Local Municipality",
    district: "Cape Winelands District Municipality",
    province: "Western Cape",
  },
  {
    id: "INC003",
    reporterId: "+27840003333", // Sgt. Molefe
    timestampReported: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    latitude: -34.0249,
    longitude: 18.8241,
    description: "Trespassers seen walking towards the dam. Looked like they had hunting dogs. SAPS unit dispatched.",
    originalMessageText: "Trespassers seen walking towards the dam. Looked like they had hunting dogs. SAPS unit dispatched.",
    aiCategory: IncidentType.TRESPASSING,
    aiSeverity: Severity.MEDIUM,
    aiExtractedKeywords: ["trespassers", "dam", "hunting dogs", "SAPS"],
    status: Status.RESOLVED,
    adminNotes: "SAPS unit responded, individuals were local farm workers taking a shortcut. Advised to use main paths.",
    address: "Near Dam, Farm C, Franschhoek",
    isTrustedReport: MOCK_REPORTERS.find(r => r.id === "+27840003333")?.isTrustedSource || false,
    town: "Franschhoek",
    municipality: "Stellenbosch Local Municipality", // Franschhoek falls under Stellenbosch Muni
    district: "Cape Winelands District Municipality",
    province: "Western Cape",
  },
  {
    id: "INC004",
    reporterId: "SECURITY_CO_001", // Alpha Security
    timestampReported: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    latitude: -33.8549,
    longitude: 18.5041,
    description: "Routine patrol found graffiti on the water tank at sector 4. Clean-up scheduled.",
    originalMessageText: "Routine patrol found graffiti on the water tank at sector 4. Clean-up scheduled.",
    aiCategory: IncidentType.VANDALISM,
    aiSeverity: Severity.LOW,
    aiExtractedKeywords: ["graffiti", "water tank"],
    status: Status.RESOLVED,
    address: "Sector 4 Water Tank, Farm D, Durbanville",
    isTrustedReport: MOCK_REPORTERS.find(r => r.id === "SECURITY_CO_001")?.isTrustedSource || false,
    town: "Durbanville",
    municipality: "City of Cape Town Metropolitan Municipality",
    district: "City of Cape Town", // For Metros, district is often the city itself
    province: "Western Cape",
  },
  {
    id: "INC005",
    reporterId: "+27820001111", // Pieter Roux
    timestampReported: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    latitude: -33.9100,
    longitude: 18.4100,
    description: "Heard strange noises near the equipment shed last night around 2 AM. Possibly attempted theft.",
    originalMessageText: "Heard strange noises near the equipment shed last night around 2 AM. Possibly attempted theft.",
    aiCategory: IncidentType.EQUIPMENT_THEFT,
    aiSeverity: Severity.HIGH,
    aiExtractedKeywords: ["equipment shed", "noises", "2 AM"],
    status: Status.NEW,
    address: "Equipment Shed, Farm A, Stellenbosch",
    isTrustedReport: MOCK_REPORTERS.find(r => r.id === "+27820001111")?.isTrustedSource || false,
    town: "Stellenbosch",
    municipality: "Stellenbosch Local Municipality",
    district: "Cape Winelands District Municipality",
    province: "Western Cape",
  },
   {
    id: "INC006",
    reporterId: "+27820001111", // Pieter Roux - false alarm example
    timestampReported: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    latitude: -33.9200,
    longitude: 18.4200,
    description: "Saw a light in the vineyard, thought it was someone with a torch.",
    originalMessageText: "Light in vineyard, maybe poachers?",
    aiCategory: IncidentType.SUSPICIOUS_ACTIVITY,
    aiSeverity: Severity.LOW,
    aiExtractedKeywords: ["light", "vineyard", "torch"],
    status: Status.FALSE_ALARM,
    adminNotes: "Confirmed it was a reflection from a neighboring property's security light.",
    address: "Vineyard Section 7, Farm A, Stellenbosch",
    isTrustedReport: MOCK_REPORTERS.find(r => r.id === "+27820001111")?.isTrustedSource || false,
    town: "Stellenbosch",
    municipality: "Stellenbosch Local Municipality",
    district: "Cape Winelands District Municipality",
    province: "Western Cape",
  }
];

// Manually calculate counts for MOCK_REPORTERS based on MOCK_INCIDENTS
MOCK_REPORTERS.forEach(reporter => {
  const incidentsByReporter = reporterIncidents(reporter.id, MOCK_INCIDENTS);
  reporter.incidentsReportedCount = incidentsByReporter.length;
  reporter.falseAlarmCount = reporterFalseAlarms(reporter.id, MOCK_INCIDENTS);
});


export const MOCK_WHATSAPP_MESSAGES: WhatsAppMessage[] = [
  {
    id: "MSG001",
    sender: "+27820001111", // Pieter Roux
    reporterId: "+27820001111",
    messageSnippet: "Spotted a suspicious red car driving slowly past my northern fence line. Didn't recognize it.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    type: WhatsAppMessageType.TEXT,
    isRead: false,
    incidentId: "INC001"
  },
  {
    id: "MSG002",
    sender: "+27830002222", // Anna Van Zyl
    reporterId: "+27830002222",
    messageSnippet: "Voice note: Fence cut on West Ridge path. Possible stock theft in progress.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    type: WhatsAppMessageType.VOICE,
    isRead: false,
    incidentId: "INC002"
  },
  {
    id: "MSG003",
    sender: "+27840003333", // Sgt. Molefe
    reporterId: "+27840003333",
    messageSnippet: "Location Pin: Responding to report near the old mill.",
    timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    type: WhatsAppMessageType.LOCATION,
    isRead: true,
    incidentId: "INC003" 
  },
  {
    id: "MSG004",
    sender: "SECURITY_CO_001", // Alpha Security
    reporterId: "SECURITY_CO_001",
    messageSnippet: "Image: Graffiti found on water pump. Ref_INC004",
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    type: WhatsAppMessageType.IMAGE,
    isRead: true,
    incidentId: "INC004"
  },
  {
    id: "MSG005",
    sender: "+27820001111", // Pieter Roux
    reporterId: "+27820001111",
    messageSnippet: "Just heard from my neighbor that they also saw the blue bakkie I reported earlier (INC001). They said it turned off towards the N2.",
    timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    type: WhatsAppMessageType.TEXT,
    isRead: false,
    incidentId: "INC001"
  },
   {
    id: "MSG006",
    sender: "UNKNOWN_REPORTER_1", 
    reporterId: "UNKNOWN_REPORTER_1",
    messageSnippet: "Hi, I think I saw some people cutting a fence near the river crossing. I'm new in the area.",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    type: WhatsAppMessageType.TEXT,
    isRead: false,
  }
];