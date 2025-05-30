import { Incident, Reporter, IncidentType, Severity, Status, UserType, AppConfiguration, WhatsAppMessage, WhatsAppMessageType } from '../types';

// Mock Reporters Data
export const mockReporters: Reporter[] = [
  {
    id: '1',
    phoneNumber: '+27821234567',
    firstName: 'Johan',
    lastName: 'van der Merwe',
    userType: UserType.SECURITY_OFFICER,
    isTrustedSource: true,
    incidentsReportedCount: 24,
    falseAlarmCount: 2,
    notes: 'Security officer for Paarl region',
    dateAdded: '2024-11-15T08:30:00Z',
    isAgriculturalUnionMember: 'Yes',
    farmName: 'Weltevreden Farm',
    city: 'Paarl',
    homeLatitude: -33.7274,
    homeLongitude: 18.9571
  },
  {
    id: '2',
    phoneNumber: '+27835551234',
    firstName: 'Sarah',
    lastName: 'Nkosi',
    userType: UserType.VERIFIED_VOLUNTEER,
    isTrustedSource: true,
    incidentsReportedCount: 15,
    falseAlarmCount: 1,
    notes: 'Community watch volunteer',
    dateAdded: '2024-12-01T10:15:00Z',
    isAgriculturalUnionMember: 'No',
    city: 'Stellenbosch',
    homeLatitude: -33.9321,
    homeLongitude: 18.8602
  },
  {
    id: '3',
    phoneNumber: '+27761112222',
    firstName: 'David',
    lastName: 'Botha',
    userType: UserType.CITIZEN,
    isTrustedSource: false,
    incidentsReportedCount: 5,
    falseAlarmCount: 0,
    dateAdded: '2025-01-10T14:20:00Z',
    isAgriculturalUnionMember: 'No',
    city: 'Mossel Bay',
    homeLatitude: -34.1831,
    homeLongitude: 22.1456
  },
  {
    id: '4',
    phoneNumber: '+27829876543',
    firstName: 'Thandi',
    lastName: 'Mkhize',
    userType: UserType.SAPS_MEMBER,
    isTrustedSource: true,
    incidentsReportedCount: 32,
    falseAlarmCount: 3,
    notes: 'SAPS officer in Cape Town rural division',
    dateAdded: '2024-10-05T09:45:00Z',
    isAgriculturalUnionMember: 'No',
    city: 'Cape Town',
    homeLatitude: -33.9249,
    homeLongitude: 18.4241
  },
  {
    id: '5',
    phoneNumber: '+27731234567',
    firstName: 'Pieter',
    lastName: 'Venter',
    userType: UserType.ADMIN,
    isTrustedSource: true,
    incidentsReportedCount: 18,
    falseAlarmCount: 1,
    notes: 'Farm owner and regional coordinator',
    dateAdded: '2024-09-20T11:30:00Z',
    isAgriculturalUnionMember: 'Yes',
    farmName: 'Goede Hoop Estate',
    city: 'Worcester',
    homeLatitude: -33.6474,
    homeLongitude: 19.4487
  },
  {
    id: '6',
    phoneNumber: '+27833334444',
    firstName: 'Lerato',
    lastName: 'Molefe',
    userType: UserType.VERIFIED_VOLUNTEER,
    isTrustedSource: true,
    incidentsReportedCount: 9,
    falseAlarmCount: 0,
    notes: 'Community patrol volunteer',
    dateAdded: '2025-01-05T16:20:00Z',
    isAgriculturalUnionMember: 'No',
    city: 'George',
    homeLatitude: -33.9833,
    homeLongitude: 22.4500
  },
  {
    id: '7',
    phoneNumber: '+27785556666',
    firstName: 'Willem',
    lastName: 'du Toit',
    userType: UserType.CITIZEN,
    isTrustedSource: false,
    incidentsReportedCount: 3,
    falseAlarmCount: 1,
    dateAdded: '2025-02-12T13:10:00Z',
    isAgriculturalUnionMember: 'Yes',
    farmName: 'Kleinplaas',
    city: 'Oudtshoorn',
    homeLatitude: -33.5884,
    homeLongitude: 22.2151
  },
  {
    id: '8',
    phoneNumber: '+27848889999',
    firstName: 'Nomsa',
    lastName: 'Dlamini',
    userType: UserType.SECURITY_OFFICER,
    isTrustedSource: true,
    incidentsReportedCount: 21,
    falseAlarmCount: 2,
    notes: 'Security coordinator for Swellendam area',
    dateAdded: '2024-11-30T08:45:00Z',
    isAgriculturalUnionMember: 'No',
    city: 'Swellendam',
    homeLatitude: -34.0218,
    homeLongitude: 20.4439
  },
  {
    id: '9',
    phoneNumber: '+27712223333',
    firstName: 'Jacques',
    lastName: 'Fourie',
    userType: UserType.CITIZEN,
    isTrustedSource: true,
    incidentsReportedCount: 7,
    falseAlarmCount: 0,
    dateAdded: '2024-12-15T10:30:00Z',
    isAgriculturalUnionMember: 'Yes',
    farmName: 'Bergrivier Farm',
    city: 'Ceres',
    homeLatitude: -33.3722,
    homeLongitude: 19.3099
  },
  {
    id: '10',
    phoneNumber: '+27765554444',
    firstName: 'Andile',
    lastName: 'Zulu',
    userType: UserType.SAPS_MEMBER,
    isTrustedSource: true,
    incidentsReportedCount: 28,
    falseAlarmCount: 3,
    notes: 'SAPS rural safety unit',
    dateAdded: '2024-10-10T14:15:00Z',
    isAgriculturalUnionMember: 'No',
    city: 'Beaufort West',
    homeLatitude: -32.3568,
    homeLongitude: 22.5834
  }
];

// Generate 6 months of mock incident data
const generateMockIncidents = (): Incident[] => {
  const incidents: Incident[] = [];
  const startDate = new Date('2024-12-01T00:00:00Z');
  const endDate = new Date('2025-05-29T00:00:00Z'); // Current date
  
  // Location clusters with slight variations
  const locationClusters = {
    'Cape Town': { lat: -33.9249, lng: 18.4241, radius: 0.3 },
    'Stellenbosch': { lat: -33.9321, lng: 18.8602, radius: 0.2 },
    'Paarl': { lat: -33.7274, lng: 18.9571, radius: 0.25 },
    'Worcester': { lat: -33.6474, lng: 19.4487, radius: 0.2 },
    'Ceres': { lat: -33.3722, lng: 19.3099, radius: 0.15 },
    'Mossel Bay': { lat: -34.1831, lng: 22.1456, radius: 0.2 },
    'George': { lat: -33.9833, lng: 22.4500, radius: 0.2 },
    'Oudtshoorn': { lat: -33.5884, lng: 22.2151, radius: 0.15 },
    'Swellendam': { lat: -34.0218, lng: 20.4439, radius: 0.15 },
    'Beaufort West': { lat: -32.3568, lng: 22.5834, radius: 0.1 }
  };
  
  // Incident descriptions by type
  const descriptions = {
    [IncidentType.STOCK_THEFT]: [
      "Approximately 20 sheep stolen overnight. Fence cut on the eastern perimeter.",
      "Cattle rustling incident. 5 cows missing from the north pasture.",
      "Goats stolen from paddock. Tire tracks found leading to dirt road.",
      "Sheep theft in progress spotted by security camera. Suspects fled in white bakkie.",
      "Livestock theft discovered this morning. Footprints indicate multiple perpetrators."
    ],
    [IncidentType.CROP_THEFT]: [
      "Large quantity of citrus fruits stolen from eastern orchard.",
      "Grape theft from vineyard. Approximately 200kg missing.",
      "Avocado theft from farm. Evidence of organized harvesting overnight.",
      "Maize stolen from field near road access point.",
      "Theft of vegetables from market garden. Fence damaged."
    ],
    [IncidentType.EQUIPMENT_THEFT]: [
      "Farm equipment stolen from unlocked shed. Generator and tools missing.",
      "Tractor parts removed overnight. Security camera disabled.",
      "Irrigation equipment theft. Pipes and pumps taken from western field.",
      "Solar panels stolen from remote water pump installation.",
      "Theft of diesel from farm vehicles. Storage tanks also breached."
    ],
    [IncidentType.TRESPASSING]: [
      "Unknown individuals spotted on property perimeter. Left when challenged.",
      "Trespassers with dogs potentially hunting illegally on farm boundary.",
      "Vehicle trespassing on private road. Occupants claimed to be lost.",
      "Multiple trespassers cutting through property. Refused to leave when asked.",
      "Suspicious individuals photographing farm infrastructure and security measures."
    ],
    [IncidentType.SUSPICIOUS_ACTIVITY]: [
      "Unknown vehicle driving slowly around farm perimeter for third day.",
      "Suspicious individuals asking farm workers about security arrangements and owner's schedule.",
      "Drone spotted flying over livestock areas. Not farm-operated.",
      "Unknown persons observed watching farm from neighboring property.",
      "Suspicious vehicle parked near farm entrance overnight. Left before security arrived."
    ],
    [IncidentType.VANDALISM]: [
      "Fence cut in multiple places along northern boundary.",
      "Graffiti on farm buildings and equipment. Appears gang-related.",
      "Water infrastructure vandalized. Pipes damaged and water wasted.",
      "Farm gate locks broken and warning signs removed.",
      "Crops deliberately damaged in field nearest to public road."
    ],
    [IncidentType.POACHING]: [
      "Evidence of poaching found. Snares discovered in western bushland.",
      "Shots heard at night. Found remains of illegally hunted game.",
      "Poachers spotted with spotlight at night. Fled when approached.",
      "Dogs and hunters trespassing, suspected of poaching small game.",
      "Poaching incident in progress. Armed individuals on private reserve."
    ],
    [IncidentType.FARM_ATTACK]: [
      "Armed individuals attempted to enter farmhouse. Security system triggered.",
      "Farmer confronted by armed intruders while checking livestock at night.",
      "Family threatened by armed individuals who gained access to property.",
      "Farm workers assaulted by intruders. Police responding.",
      "Armed robbery at farm stall. Suspects fled with cash and valuables."
    ],
    [IncidentType.OTHER]: [
      "Illegal dumping of waste on farm boundary.",
      "Unauthorized access to water source. Possible contamination risk.",
      "Stray livestock from neighboring farm causing damage to crops.",
      "Veldt fire approaching farm boundary from east.",
      "Illegal structures being erected on farm property line."
    ]
  };
  
  // Generate random incidents
  let id = 1;
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    // Generate 0-3 incidents per day
    const incidentsPerDay = Math.floor(Math.random() * 4);
    
    for (let i = 0; i < incidentsPerDay; i++) {
      // Random reporter
      const reporterId = String(Math.floor(Math.random() * 10) + 1);
      
      // Random incident type
      const incidentTypes = Object.values(IncidentType);
      const incidentType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
      
      // Random severity with weighted distribution
      const severityWeights = [0.4, 0.3, 0.2, 0.1]; // LOW, MEDIUM, HIGH, CRITICAL
      const severityRand = Math.random();
      let severity: Severity;
      if (severityRand < severityWeights[0]) {
        severity = Severity.LOW;
      } else if (severityRand < severityWeights[0] + severityWeights[1]) {
        severity = Severity.MEDIUM;
      } else if (severityRand < severityWeights[0] + severityWeights[1] + severityWeights[2]) {
        severity = Severity.HIGH;
      } else {
        severity = Severity.CRITICAL;
      }
      
      // Random status with time-based weighting (newer incidents more likely to be NEW)
      const daysSinceIncident = (endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
      const statusWeights = {
        [Status.NEW]: Math.max(0.1, Math.min(0.9, daysSinceIncident / 180)),
        [Status.UNDER_INVESTIGATION]: 0.4,
        [Status.RESOLVED]: Math.max(0.1, Math.min(0.7, 1 - (daysSinceIncident / 180))),
        [Status.FALSE_ALARM]: 0.1
      };
      
      const statusRand = Math.random();
      let status: Status = Status.NEW; // Initialize with default value
      let cumulativeWeight = 0;
      
      for (const [statusKey, weight] of Object.entries(statusWeights)) {
        cumulativeWeight += weight;
        if (statusRand <= cumulativeWeight) {
          status = statusKey as Status;
          break;
        }
      }
      
      // Random location - select a cluster and add some randomness
      const locationKeys = Object.keys(locationClusters);
      const locationKey = locationKeys[Math.floor(Math.random() * locationKeys.length)];
      const location = locationClusters[locationKey as keyof typeof locationClusters];
      
      const latOffset = (Math.random() * 2 - 1) * location.radius;
      const lngOffset = (Math.random() * 2 - 1) * location.radius;
      
      const latitude = location.lat + latOffset;
      const longitude = location.lng + lngOffset;
      
      // Random time on the current day
      const hours = Math.floor(Math.random() * 24);
      const minutes = Math.floor(Math.random() * 60);
      const seconds = Math.floor(Math.random() * 60);
      
      const timestampReported = new Date(currentDate);
      timestampReported.setHours(hours, minutes, seconds);
      
      // Incident occurred time (usually before reported time)
      const minutesBefore = Math.floor(Math.random() * 180); // 0-3 hours before
      const timestampOccurred = new Date(timestampReported.getTime() - minutesBefore * 60 * 1000);
      
      // Random description based on incident type
      const typeDescriptions = descriptions[incidentType];
      const description = typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
      
      // Create the incident
      incidents.push({
        id: String(id++),
        reporterId,
        timestampReported: timestampReported.toISOString(),
        timestampOccurred: timestampOccurred.toISOString(),
        latitude,
        longitude,
        description,
        aiCategory: incidentType,
        aiSeverity: severity,
        status: status,
        aiExtractedKeywords: [incidentType.toLowerCase(), severity.toLowerCase(), locationKey.toLowerCase()],
        town: locationKey,
        // Images would be stored elsewhere in a real application
        adminNotes: Math.random() > 0.5 ? "AI analysis indicates this incident matches patterns of similar events in the area. Recommend increased patrols." : undefined
      });
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return incidents;
};

export const mockIncidents: Incident[] = generateMockIncidents();

// Mock WhatsApp messages
export const mockWhatsAppMessages: WhatsAppMessage[] = [
  {
    id: '1',
    sender: '+27821234567',
    reporterId: '1',
    messageSnippet: 'Suspicious activity near the eastern fence line. Checking it out now.',
    timestamp: '2025-05-28T18:30:00Z',
    type: WhatsAppMessageType.TEXT,
    isRead: true,
    incidentId: '120'
  },
  {
    id: '2',
    sender: '+27835551234',
    reporterId: '2',
    messageSnippet: 'Sending location of broken fence and footprints',
    timestamp: '2025-05-29T09:15:00Z',
    type: WhatsAppMessageType.LOCATION,
    isRead: false
  },
  {
    id: '3',
    sender: '+27761112222',
    reporterId: '3',
    messageSnippet: 'Voice note describing suspicious vehicle near farm entrance',
    timestamp: '2025-05-27T14:20:00Z',
    type: WhatsAppMessageType.VOICE,
    isRead: true,
    incidentId: '118'
  },
  {
    id: '4',
    sender: '+27829876543',
    reporterId: '4',
    messageSnippet: 'SAPS patrol scheduled for tonight in response to recent incidents',
    timestamp: '2025-05-29T11:45:00Z',
    type: WhatsAppMessageType.TEXT,
    isRead: false
  },
  {
    id: '5',
    sender: '+27731234567',
    reporterId: '5',
    messageSnippet: 'Equipment theft in progress at Kleinvlei Farm. Sending coordinates.',
    timestamp: '2025-05-28T22:10:00Z',
    type: WhatsAppMessageType.LOCATION,
    isRead: true,
    incidentId: '122'
  }
];

// Mock App Configuration
export const mockAppConfiguration: AppConfiguration = {
  incidentTypes: Object.values(IncidentType).map(type => ({
    id: type.toLowerCase().replace(/ /g, '_'),
    label: type,
    isActive: true,
    isSystemItem: true
  })),
  severities: Object.values(Severity).map(severity => ({
    id: severity.toLowerCase(),
    label: severity,
    isActive: true,
    isSystemItem: true
  })),
  statuses: Object.values(Status).map(status => ({
    id: status.toLowerCase().replace(/ /g, '_'),
    label: status,
    isActive: true,
    isSystemItem: true
  })),
  userTypes: Object.values(UserType).map(type => ({
    id: type.toLowerCase().replace(/ /g, '_'),
    label: type,
    isActive: true,
    isSystemItem: true
  })),
  neighbourhoodGroups: [
    {
      id: '1',
      name: 'Paarl Agricultural Union',
      description: 'Farmers and security personnel in the Paarl region',
      memberIds: ['1', '2', '9']
    },
    {
      id: '2',
      name: 'Cape Winelands Safety Initiative',
      description: 'Coordinated security for farms in the Cape Winelands district',
      memberIds: ['2', '4', '5', '9']
    },
    {
      id: '3',
      name: 'Garden Route Farm Watch',
      description: 'Security network for farms along the Garden Route',
      memberIds: ['3', '6', '8']
    }
  ],
  aiModel: 'gemini-pro',
  confidenceThreshold: 0.75,
  webhookUrl: 'https://api.farmwatch.agri.co.za/webhooks/incidents',
  dataRetentionDays: 365,
  adminAlertEmail: 'alerts@farmwatch.agri.co.za'
};

export default {
  reporters: mockReporters,
  incidents: mockIncidents,
  whatsAppMessages: mockWhatsAppMessages,
  appConfiguration: mockAppConfiguration
};
