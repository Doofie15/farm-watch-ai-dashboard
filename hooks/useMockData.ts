import { useState, useEffect } from 'react';
import mockData from '../data/mockData';
import { Incident, Reporter, WhatsAppMessage, AppConfiguration } from '../types';

interface UseMockDataReturn {
  incidents: Incident[];
  reporters: Reporter[];
  whatsAppMessages: WhatsAppMessage[];
  appConfiguration: AppConfiguration;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to load and provide mock data for the application
 * This simulates loading data from an API but uses the local mock data
 */
export const useMockData = (): UseMockDataReturn => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [reporters, setReporters] = useState<Reporter[]>([]);
  const [whatsAppMessages, setWhatsAppMessages] = useState<WhatsAppMessage[]>([]);
  const [appConfiguration, setAppConfiguration] = useState<AppConfiguration | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API loading delay
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Load mock data
        setIncidents(mockData.incidents);
        setReporters(mockData.reporters);
        setWhatsAppMessages(mockData.whatsAppMessages);
        setAppConfiguration(mockData.appConfiguration);
        
        // Connect reporters to incidents
        const incidentsWithReporters = mockData.incidents.map(incident => {
          const reporter = mockData.reporters.find(r => r.id === incident.reporterId);
          return {
            ...incident,
            reporter
          };
        });
        
        setIncidents(incidentsWithReporters);
        
        // Connect reporters to WhatsApp messages
        const messagesWithReporters = mockData.whatsAppMessages.map(message => {
          const reporter = mockData.reporters.find(r => r.id === message.reporterId);
          return {
            ...message,
            reporter
          };
        });
        
        setWhatsAppMessages(messagesWithReporters);
        
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load mock data'));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    incidents,
    reporters,
    whatsAppMessages,
    appConfiguration: appConfiguration as AppConfiguration,
    isLoading,
    error
  };
};

export default useMockData;
