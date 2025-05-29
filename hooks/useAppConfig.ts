
import { useState, useEffect, useCallback } from 'react';
import {
  IncidentType,
  Severity,
  Status,
  UserType,
  AppConfiguration,
  IncidentTypesConfig,
  SeveritiesConfig,
  StatusesConfig,
  UserTypesConfig,
  ConfigurableListItem,
  NeighbourhoodGroup
} from '../types';

const APP_CONFIG_STORAGE_KEY = 'farmWatchAppConfiguration';

// Helper to generate default config from enums
const getDefaultConfigList = (enumObject: Record<string, string>): ConfigurableListItem[] => {
  return Object.entries(enumObject).map(([key, value]) => ({
    id: value, 
    label: value, 
    isActive: true,
    isSystemItem: true, // Mark items from enums as system items
  }));
};

const defaultAppConfiguration: AppConfiguration = {
  incidentTypes: getDefaultConfigList(IncidentType),
  severities: getDefaultConfigList(Severity),
  statuses: getDefaultConfigList(Status),
  userTypes: getDefaultConfigList(UserType),
  neighbourhoodGroups: [] as NeighbourhoodGroup[],
  aiModel: 'gemini-2.5-flash-preview-04-17',
  confidenceThreshold: 75,
  webhookUrl: 'https://api.example.com/farmwatch/whatsapp',
  dataRetentionDays: 365,
  adminAlertEmail: 'admin@farmwatch.co.za',
};

export const useAppConfig = () => {
  const [config, setConfig] = useState<AppConfiguration>(() => {
    const storedConfig = localStorage.getItem(APP_CONFIG_STORAGE_KEY);
    if (storedConfig) {
      try {
        const parsedConfig = JSON.parse(storedConfig) as Partial<AppConfiguration>;
        
        const mergeList = (defaultList: ConfigurableListItem[], storedList?: ConfigurableListItem[]): ConfigurableListItem[] => {
            if (!storedList) return defaultList;
            const defaultSystemIds = new Set(defaultList.filter(item => item.isSystemItem).map(item => item.id));
            return storedList.map(item => ({
                ...item,
                isSystemItem: defaultSystemIds.has(item.id) ? true : (item.isSystemItem === undefined ? false : item.isSystemItem)
            }));
        };
        
        return {
          ...defaultAppConfiguration,
          ...parsedConfig,
          incidentTypes: mergeList(defaultAppConfiguration.incidentTypes, parsedConfig.incidentTypes),
          severities: mergeList(defaultAppConfiguration.severities, parsedConfig.severities),
          statuses: mergeList(defaultAppConfiguration.statuses, parsedConfig.statuses),
          userTypes: mergeList(defaultAppConfiguration.userTypes, parsedConfig.userTypes),
          neighbourhoodGroups: parsedConfig.neighbourhoodGroups || defaultAppConfiguration.neighbourhoodGroups,
        };
      } catch (error) {
        console.error("Failed to parse stored app configuration:", error);
        return defaultAppConfiguration;
      }
    }
    return defaultAppConfiguration;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const saveConfiguration = useCallback(() => {
    try {
      localStorage.setItem(APP_CONFIG_STORAGE_KEY, JSON.stringify(config));
      alert("Configuration saved successfully!");
    } catch (error) {
      console.error("Failed to save app configuration:", error);
      alert("Error saving configuration.");
    }
  }, [config]);

  const updateConfigList = useCallback((listKey: 'incidentTypes' | 'severities' | 'statuses' | 'userTypes', updatedList: ConfigurableListItem[]) => {
    setConfig(prevConfig => ({ ...prevConfig, [listKey]: updatedList }));
  }, []);

  const addConfigListItem = useCallback((listKey: 'incidentTypes' | 'severities' | 'statuses' | 'userTypes', id: string, label: string) => {
    setConfig(prevConfig => {
      const list = prevConfig[listKey];
      if (list.some(item => item.id.toLowerCase() === id.toLowerCase())) {
        console.warn(`Attempted to add duplicate ID '${id}' to ${listKey}.`);
        alert(`Error: An item with ID '${id}' already exists in ${listKey}. IDs must be unique.`);
        return prevConfig;
      }
      const newItem: ConfigurableListItem = { id, label, isActive: true, isSystemItem: false };
      return { ...prevConfig, [listKey]: [...list, newItem] };
    });
  }, []);

  const deleteConfigListItem = useCallback((listKey: keyof Pick<AppConfiguration, 'incidentTypes' | 'severities' | 'statuses' | 'userTypes'>, itemId: string) => {
    setConfig(prevConfig => {
        const list = prevConfig[listKey];
        const itemToDelete = list.find(item => item.id === itemId);
        if (itemToDelete && itemToDelete.isSystemItem) {
            alert(`Cannot delete system item '${itemToDelete.label}'. You can only disable it.`);
            return prevConfig;
        }
        const updatedList = list.filter(item => item.id !== itemId);
        return { ...prevConfig, [listKey]: updatedList };
    });
  }, []);

  const updateAiModel = useCallback((value: string) => {
    setConfig(prev => ({ ...prev, aiModel: value }));
  }, []);
  const updateConfidenceThreshold = useCallback((value: number) => {
    setConfig(prev => ({ ...prev, confidenceThreshold: value }));
  }, []);
  const updateWebhookUrl = useCallback((value: string) => {
    setConfig(prev => ({ ...prev, webhookUrl: value }));
  }, []);
  const updateDataRetentionDays = useCallback((value: number) => {
    setConfig(prev => ({ ...prev, dataRetentionDays: value }));
  }, []);
  const updateAdminAlertEmail = useCallback((value: string) => {
    setConfig(prev => ({ ...prev, adminAlertEmail: value }));
  }, []);

  const getLabel = useCallback((list: ConfigurableListItem[], id: string): string => {
    const item = list.find(i => i.id === id);
    return item ? item.label : id;
  }, []);

  const getActiveItems = useCallback((list: ConfigurableListItem[]): ConfigurableListItem[] => {
    return list.filter(item => item.isActive);
  }, []);

  // Neighbourhood Group Functions
  const addNeighbourhoodGroup = useCallback((name: string, description?: string): NeighbourhoodGroup | undefined => {
    if (!name.trim()) {
      alert("Group name cannot be empty.");
      return undefined;
    }
    const newGroup: NeighbourhoodGroup = {
      id: `GROUP_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      description: description?.trim() || undefined,
      memberIds: [],
    };
    setConfig(prevConfig => ({
      ...prevConfig,
      neighbourhoodGroups: [...prevConfig.neighbourhoodGroups, newGroup],
    }));
    return newGroup;
  }, []);

  const updateGroupDetails = useCallback((groupId: string, name: string, description?: string): void => {
    if (!name.trim()) {
      alert("Group name cannot be empty.");
      return;
    }
    setConfig(prevConfig => ({
      ...prevConfig,
      neighbourhoodGroups: prevConfig.neighbourhoodGroups.map(group =>
        group.id === groupId ? { ...group, name: name.trim(), description: description?.trim() || undefined } : group
      ),
    }));
  }, []);

  const deleteNeighbourhoodGroup = useCallback((groupId: string): void => {
    setConfig(prevConfig => ({
      ...prevConfig,
      neighbourhoodGroups: prevConfig.neighbourhoodGroups.filter(group => group.id !== groupId),
    }));
  }, []);

  const addReporterToGroup = useCallback((groupId: string, reporterId: string): void => {
    setConfig(prevConfig => ({
      ...prevConfig,
      neighbourhoodGroups: prevConfig.neighbourhoodGroups.map(group => {
        if (group.id === groupId && !group.memberIds.includes(reporterId)) {
          return { ...group, memberIds: [...group.memberIds, reporterId] };
        }
        return group;
      }),
    }));
  }, []);

  const removeReporterFromGroup = useCallback((groupId: string, reporterId: string): void => {
    setConfig(prevConfig => ({
      ...prevConfig,
      neighbourhoodGroups: prevConfig.neighbourhoodGroups.map(group =>
        group.id === groupId
          ? { ...group, memberIds: group.memberIds.filter(id => id !== reporterId) }
          : group
      ),
    }));
  }, []);
  
  const getGroupById = useCallback((groupId: string): NeighbourhoodGroup | undefined => {
    return config.neighbourhoodGroups.find(g => g.id === groupId);
  }, [config.neighbourhoodGroups]);

  const getGroupsByReporterId = useCallback((reporterId: string): NeighbourhoodGroup[] => {
    return config.neighbourhoodGroups.filter(g => g.memberIds.includes(reporterId));
  }, [config.neighbourhoodGroups]);


  return {
    config,
    isLoading,
    updateConfigList,
    addConfigListItem,
    deleteConfigListItem,
    updateAiModel,
    updateConfidenceThreshold,
    updateWebhookUrl,
    updateDataRetentionDays,
    updateAdminAlertEmail,
    addNeighbourhoodGroup,
    updateGroupDetails,
    deleteNeighbourhoodGroup,
    addReporterToGroup,
    removeReporterFromGroup,
    getGroupById,
    getGroupsByReporterId,
    saveConfiguration,
    getLabel,
    getActiveItems,
    incidentTypesConfig: config.incidentTypes,
    severitiesConfig: config.severities,
    statusesConfig: config.statuses,
    userTypesConfig: config.userTypes,
    neighbourhoodGroups: config.neighbourhoodGroups,
  };
};
