
export enum IncidentType {
  STOCK_THEFT = "Stock Theft",
  CROP_THEFT = "Crop Theft",
  EQUIPMENT_THEFT = "Equipment Theft",
  TRESPASSING = "Trespassing",
  SUSPICIOUS_ACTIVITY = "Suspicious Activity",
  VANDALISM = "Vandalism",
  POACHING = "Poaching",
  FARM_ATTACK = "Farm Attack",
  OTHER = "Other",
}

export enum Severity {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  CRITICAL = "Critical",
}

export enum Status {
  NEW = "New",
  UNDER_INVESTIGATION = "Under Investigation",
  RESOLVED = "Resolved",
  FALSE_ALARM = "False Alarm",
}

export enum UserType {
  CITIZEN = "Citizen",
  SECURITY_OFFICER = "Security Officer",
  SAPS_MEMBER = "SAPS Member",
  ADMIN = "Admin",
  VERIFIED_VOLUNTEER = "Verified Volunteer",
  UNKNOWN = "Unknown",
}

// New Configuration Types
export interface ConfigurableListItem {
  id: string; 
  label: string; 
  isActive: boolean; 
  isSystemItem?: boolean; // True if this item originated from a hardcoded enum
}

export type IncidentTypesConfig = ConfigurableListItem[];
export type SeveritiesConfig = ConfigurableListItem[];
export type StatusesConfig = ConfigurableListItem[];
export type UserTypesConfig = ConfigurableListItem[];

export interface NeighbourhoodGroup {
  id: string;
  name: string;
  description?: string;
  memberIds: string[]; // Array of reporter IDs
}

export interface AppConfiguration {
  incidentTypes: IncidentTypesConfig;
  severities: SeveritiesConfig;
  statuses: StatusesConfig;
  userTypes: UserTypesConfig;
  neighbourhoodGroups: NeighbourhoodGroup[];
  aiModel: string;
  confidenceThreshold: number;
  webhookUrl: string;
  dataRetentionDays: number;
  adminAlertEmail: string;
}


export interface Reporter {
  id: string; 
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  userType: string; // Changed from UserType enum to string
  isTrustedSource: boolean;
  incidentsReportedCount?: number; 
  falseAlarmCount?: number; 
  notes?: string;
  dateAdded?: string; 
  incidents?: Incident[]; 
  // New fields for enhanced user data
  isAgriculturalUnionMember?: string; // Changed to string
  farmName?: string;
  city?: string;
  homeLatitude?: number;
  homeLongitude?: number;
}

export interface Incident {
  id: string;
  reporterId: string; 
  reporter?: Reporter; 
  timestampReported: string;
  timestampOccurred?: string;
  latitude: number;
  longitude: number;
  description: string; 
  originalMessageText?: string;
  voiceNoteTranscription?: string;
  voiceNoteUrl?: string;
  aiCategory: string; // Changed from IncidentType enum to string
  aiSeverity: string; // Changed from Severity enum to string
  aiExtractedKeywords: string[];
  status: string; // Changed from Status enum to string
  adminNotes?: string;
  address?: string;
  isTrustedReport?: boolean; 
  town?: string;
  municipality?: string;
  district?: string;
  province?: string;
}

export interface FilterCriteria {
  status?: string | ""; 
  type?: string | ""; 
  searchTerm?: string;
}

export enum WhatsAppMessageType {
  TEXT = "Text",
  VOICE = "Voice Note",
  LOCATION = "Location Pin",
  IMAGE = "Image"
}

export interface WhatsAppMessage {
  id: string;
  sender: string; 
  reporterId?: string; 
  reporter?: Reporter; 
  messageSnippet: string;
  timestamp: string;
  type: WhatsAppMessageType;
  isRead?: boolean;
  incidentId?: string;
}

// Augment the Window interface to include googleMapsApiLoaded
declare global {
  interface Window {
    googleMapsApiLoaded?: boolean;
  }
}
