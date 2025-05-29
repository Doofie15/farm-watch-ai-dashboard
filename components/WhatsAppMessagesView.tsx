
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { MOCK_WHATSAPP_MESSAGES } from '../constants'; 
import { WhatsAppMessage, WhatsAppMessageType, Incident, Reporter, UserType, AppConfiguration, ConfigurableListItem } from '../types';
import { WhatsAppMessageIcon, ShieldCheckIcon } from './ui/Icons';
import { formatRelativeTime } from '../utils/time';
import Modal from './ui/Modal';
import Select from './ui/Select';
import { useIncidents } from '../hooks/useIncidents';

type UseIncidentsReturnType = ReturnType<typeof useIncidents>;

interface WhatsAppMessagesViewProps {
  incidentsHook: UseIncidentsReturnType;
  onNavigateToReporterDetail?: (reporterId: string) => void; 
  appConfig: AppConfiguration; // Pass AppConfiguration
}

const MessageDetailModal: React.FC<{ 
    message: WhatsAppMessage | null; 
    isOpen: boolean; 
    onClose: () => void;
    onAddOrUpdateReporter: (phoneNumber: string) => void; 
    onNavigateToReporterDetail?: (reporterId: string) => void;
    appConfig: AppConfiguration;
}> = ({ message, isOpen, onClose, onAddOrUpdateReporter, onNavigateToReporterDetail, appConfig }) => {
  if (!message) return null;

  const getLabel = (list: ConfigurableListItem[], id: string): string => {
    const item = list.find(i => i.id === id);
    return item ? item.label : id;
  };
  const reporterUserTypeLabel = message.reporter ? getLabel(appConfig.userTypes, message.reporter.userType) : 'Unknown';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Message from: ${message.reporter?.firstName || message.sender}`} size="xl">
      <div className="space-y-4">
        {message.reporter && (
          <div>
            <h3 className="text-sm font-medium text-slate-500">Known Reporter</h3>
             {onNavigateToReporterDetail ? (
                <button 
                    onClick={() => {
                        if(message.reporter?.id) {
                            onClose(); 
                            onNavigateToReporterDetail(message.reporter.id);
                        }
                    }}
                    className="text-emerald-700 hover:text-emerald-800 hover:underline text-left"
                >
                    <div className="flex items-center">
                        {message.reporter.isTrustedSource && <span className="mr-1.5 text-emerald-500">{ShieldCheckIcon}</span>}
                        <p className="font-semibold">{`${message.reporter.firstName || ''} ${message.reporter.lastName || ''}`.trim()} ({reporterUserTypeLabel})</p>
                    </div>
                </button>
            ) : (
                <div className="flex items-center">
                    {message.reporter.isTrustedSource && <span className="mr-1.5 text-emerald-500">{ShieldCheckIcon}</span>}
                    <p className="text-slate-800 font-semibold">{`${message.reporter.firstName || ''} ${message.reporter.lastName || ''}`.trim()} ({reporterUserTypeLabel})</p>
                </div>
            )}
            <p className="text-xs text-slate-500">{message.reporter.phoneNumber}</p>
          </div>
        )}
        {!message.reporter && (
             <button 
                onClick={() => onAddOrUpdateReporter(message.sender)}
                className="text-xs text-emerald-600 hover:underline"
            >
                Add/Update Reporter Info for {message.sender}
            </button>
        )}
        <div>
          <h3 className="text-sm font-medium text-slate-500">Timestamp</h3>
          <p className="text-slate-800">{new Date(message.timestamp).toLocaleString([], { dateStyle: 'full', timeStyle: 'long' })}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-slate-500">Type</h3>
          <div className="flex items-center">
            <WhatsAppMessageIcon type={message.type} className="w-5 h-5 mr-2 text-slate-600" />
            <p className="text-slate-800">{message.type}</p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-slate-500">Full Content</h3>
          <p className="text-slate-800 whitespace-pre-wrap bg-slate-50 p-3 rounded-md border border-slate-200">{message.messageSnippet}</p>
        </div>
        {message.incidentId && (
          <div>
            <h3 className="text-sm font-medium text-slate-500">Linked Incident ID</h3>
            <p className="text-emerald-600 font-semibold">{message.incidentId}</p>
          </div>
        )}
      </div>
       <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
        <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-300 text-sm font-medium rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
        >
            Close
        </button>
      </div>
    </Modal>
  );
};

const LinkIncidentModal: React.FC<{
  message: WhatsAppMessage | null;
  isOpen: boolean;
  onClose: () => void;
  onLinkIncident: (messageId: string, incidentId: string) => void;
  incidents: Incident[];
  appConfig: AppConfiguration;
}> = ({ message, isOpen, onClose, onLinkIncident, incidents, appConfig }) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('');

  useEffect(() => {
    if (isOpen && message) {
      setSelectedIncidentId(message.incidentId || '');
    }
  }, [isOpen, message]);

  if (!message) return null;

  const getLabel = (list: ConfigurableListItem[], id: string): string => {
    const item = list.find(i => i.id === id);
    return item ? item.label : id;
  };
  const reporterUserTypeLabel = message.reporter ? getLabel(appConfig.userTypes, message.reporter.userType) : 'Unknown';


  const incidentOptions = [
    { value: '', label: 'Select an Incident ID to link' },
    ...incidents
        .sort((a,b) => new Date(b.timestampReported).getTime() - new Date(a.timestampReported).getTime())
        .map(inc => ({ 
            value: inc.id, 
            label: `${inc.id} - ${getLabel(appConfig.incidentTypes, inc.aiCategory)} (${new Date(inc.timestampReported).toLocaleDateString()})` 
        }))
  ];

  const handleSubmit = () => {
    if (selectedIncidentId) {
      onLinkIncident(message.id, selectedIncidentId);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Link Message to Incident`} size="md">
      <p className="text-sm text-slate-600 mb-1">Linking message from: <span className="font-semibold">{message.reporter?.firstName || message.sender}</span></p>
      {message.reporter && <p className="text-xs text-slate-500 mb-1">{reporterUserTypeLabel}</p>}
      <p className="text-xs text-slate-500 mb-4 italic">"{message.messageSnippet.substring(0,100)}{message.messageSnippet.length > 100 ? '...' : ''}"</p>
      
      <Select
        label="Available Incidents (Recent First):"
        options={incidentOptions}
        value={selectedIncidentId}
        onChange={(e) => setSelectedIncidentId(e.target.value)}
      />
      <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end space-x-2">
         <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-300 text-sm font-medium rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
        >
            Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedIncidentId || selectedIncidentId === message.incidentId}
          className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
        >
          {message.incidentId && message.incidentId === selectedIncidentId ? 'Already Linked' : (message.incidentId ? 'Update Link' : 'Link Incident')}
        </button>
      </div>
    </Modal>
  );
};


const WhatsAppMessagesView: React.FC<WhatsAppMessagesViewProps> = ({ incidentsHook, onNavigateToReporterDetail, appConfig }) => {
  const { reporters, allIncidents: incidents } = incidentsHook; 
  
  const [messagesData, setMessagesData] = useState<WhatsAppMessage[]>([]);

   useEffect(() => {
    const initialMessages = MOCK_WHATSAPP_MESSAGES.map(m => {
      const reporter = reporters.find(r => r.phoneNumber === m.sender || r.id === m.sender); 
      return {
        ...m, 
        isRead: m.isRead === undefined ? true : m.isRead,
        reporterId: reporter?.id,
        reporter: reporter
      };
    });
    setMessagesData(initialMessages);
  }, [reporters]); 


  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessageDetail, setSelectedMessageDetail] = useState<WhatsAppMessage | null>(null);
  const [isMessageDetailModalOpen, setIsMessageDetailModalOpen] = useState(false);
  const [selectedMessageForLink, setSelectedMessageForLink] = useState<WhatsAppMessage | null>(null);
  const [isLinkIncidentModalOpen, setIsLinkIncidentModalOpen] = useState(false);

  const getLabel = (list: ConfigurableListItem[], id: string): string => {
    const item = list.find(i => i.id === id);
    return item ? item.label : id;
  };

  const filteredMessages = useMemo(() => {
    return messagesData.filter(msg => {
      const reporterUserTypeLabel = msg.reporter ? getLabel(appConfig.userTypes, msg.reporter.userType).toLowerCase() : '';
      return (
        msg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (msg.reporter?.firstName && msg.reporter.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (msg.reporter?.lastName && msg.reporter.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        reporterUserTypeLabel.includes(searchTerm.toLowerCase()) ||
        msg.messageSnippet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (msg.incidentId && msg.incidentId.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [messagesData, searchTerm, appConfig.userTypes]);

  const handleToggleReadStatus = useCallback((messageId: string) => {
    setMessagesData(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId ? { ...msg, isRead: !msg.isRead } : msg
      )
    );
  }, []);

  const handleLinkToIncident = useCallback((messageId: string, incidentId: string) => {
    setMessagesData(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId ? { ...msg, incidentId: incidentId, isRead: true } : msg 
      )
    );
  }, []);

  const openMessageDetailModal = (message: WhatsAppMessage) => {
    setSelectedMessageDetail(message);
    setIsMessageDetailModalOpen(true);
    if(!message.isRead) {
        handleToggleReadStatus(message.id);
    }
  };

  const openLinkIncidentModal = (message: WhatsAppMessage) => {
    setSelectedMessageForLink(message);
    setIsLinkIncidentModalOpen(true);
  };
  
  const handleAddOrUpdateReporterMock = (phoneNumber: string) => {
      alert(`Placeholder: Open UI to add/update reporter for ${phoneNumber}.`);
      const existing = reporters.find(r => r.phoneNumber === phoneNumber);
      if(existing && onNavigateToReporterDetail){
        onNavigateToReporterDetail(existing.id);
      } 
  };

  const thClass = "px-3 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider";
  const tdClass = "px-3 py-3 whitespace-nowrap text-sm";
  const actionButtonClass = "p-1.5 text-slate-500 hover:text-emerald-600 rounded-md hover:bg-slate-100 transition-colors text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500";

  return (
    <>
      <div className="p-4 sm:p-6 bg-white rounded-xl shadow-xl space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-semibold text-slate-800">All WhatsApp Messages</h2>
          <p className="text-sm text-slate-500 mt-1">
            Review all incoming communications. Unread messages are highlighted.
          </p>
        </div>

        <div className="mb-4">
          <input
            type="search"
            placeholder="Search messages (sender, content, Incident ID...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full md:w-1/2 lg:w-1/3 px-4 py-2.5 text-base border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md shadow-sm"
            aria-label="Search messages"
          />
        </div>
        
        <div className="shadow-lg rounded-lg overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th scope="col" className={`${thClass} w-10 text-center`}>
                    <span className="sr-only">Status</span>
                  </th>
                  <th scope="col" className={thClass}>Sender</th>
                  <th scope="col" className={thClass}>Message</th>
                  <th scope="col" className={thClass}>Timestamp</th>
                  <th scope="col" className={`${thClass} text-center`}>Incident Link</th>
                  <th scope="col" className={`${thClass} text-center w-40`}>Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredMessages.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                      No messages found{searchTerm ? " matching your search." : "."}
                    </td>
                  </tr>
                )}
                {filteredMessages.map((msg) => (
                  <tr 
                    key={msg.id} 
                    className={`hover:bg-slate-50 transition-colors duration-150 ${!msg.isRead ? 'bg-emerald-50/50' : ''}`}
                  >
                    <td className={`${tdClass} text-center text-slate-700`}>
                      {!msg.isRead && (
                        <div className="inline-flex items-center justify-center w-full">
                          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" title="Unread"></span>
                        </div>
                      )}
                    </td>
                    <td className={`${tdClass} ${!msg.isRead ? 'text-slate-800 font-semibold' : 'text-slate-700'}`}>
                      <div className="flex items-center">
                        {msg.reporter?.isTrustedSource && (
                          <span className="mr-1.5 text-emerald-600" title="Trusted Source">
                            {ShieldCheckIcon}
                          </span>
                        )}
                        <div>
                          {onNavigateToReporterDetail && msg.reporter ? (
                            <button
                              onClick={() => msg.reporter?.id && onNavigateToReporterDetail(msg.reporter.id)}
                              className="font-medium text-emerald-700 hover:text-emerald-800 hover:underline text-left"
                              disabled={!msg.reporter?.id}
                            >
                              {`${msg.reporter.firstName || ''} ${msg.reporter.lastName || ''}`.trim() || msg.sender}
                            </button>
                          ) : (
                            <div className="font-medium text-slate-800">
                              {msg.reporter ? `${msg.reporter.firstName || ''} ${msg.reporter.lastName || ''}`.trim() || msg.sender : msg.sender}
                            </div>
                          )}
                          <div className="text-xs text-slate-500">{msg.reporter ? getLabel(appConfig.userTypes, msg.reporter.userType) : 'Unknown User'}</div>
                        </div>
                      </div>
                    </td>
                    <td className={`${tdClass} ${!msg.isRead ? 'text-slate-800 font-semibold' : 'text-slate-700'}`}>
                      <div className="flex items-center">
                        <WhatsAppMessageIcon type={msg.type} className={`w-4 h-4 mr-2 shrink-0 ${!msg.isRead ? 'text-emerald-600' : 'text-slate-500'}`} />
                        <span className="truncate max-w-xs sm:max-w-sm md:max-w-md" title={msg.messageSnippet}>{msg.messageSnippet}</span>
                      </div>
                    </td>
                    <td className={`${tdClass} ${!msg.isRead ? 'text-slate-700 font-medium' : 'text-slate-600'}`}>
                      <span title={new Date(msg.timestamp).toLocaleString()}>{formatRelativeTime(msg.timestamp)}</span>
                    </td>
                    <td className={`${tdClass} text-center`}>
                      {msg.incidentId ? (
                        <button onClick={() => openLinkIncidentModal(msg)} className="text-emerald-600 hover:text-emerald-700 hover:underline text-xs font-semibold py-1 px-1.5 rounded-md" title={`Edit link for incident ${msg.incidentId}`}>
                          {msg.incidentId}
                        </button>
                      ) : (
                        <button onClick={() => openLinkIncidentModal(msg)} className="text-slate-400 hover:text-emerald-600 hover:underline text-xs py-1 px-1.5 rounded-md" title="Link to incident">
                          Link...
                        </button>
                      )}
                    </td>
                    <td className={`${tdClass} text-center`}>
                      <div className="flex items-center justify-center space-x-1.5">
                        <button onClick={() => handleToggleReadStatus(msg.id)} className={actionButtonClass} title={msg.isRead ? "Mark as Unread" : "Mark as Read"}>
                          {msg.isRead ? 
                            (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M15.28 5.22a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 1.06-1.06L7.5 12.19l6.97-6.97a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" /></svg>) : 
                            (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-500"><path d="M3 10a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 10Z" /></svg>)
                          }
                        </button>
                         <button onClick={() => openLinkIncidentModal(msg)} className={actionButtonClass} title="Link/Unlink Incident">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
                        </button>
                        <button onClick={() => openMessageDetailModal(msg)} className={actionButtonClass} title="View Full Details">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {isMessageDetailModalOpen && selectedMessageDetail && (
        <MessageDetailModal 
            message={selectedMessageDetail} 
            isOpen={isMessageDetailModalOpen} 
            onClose={() => setIsMessageDetailModalOpen(false)}
            onAddOrUpdateReporter={handleAddOrUpdateReporterMock}
            onNavigateToReporterDetail={onNavigateToReporterDetail}
            appConfig={appConfig}
        />
      )}
      {isLinkIncidentModalOpen && selectedMessageForLink && (
        <LinkIncidentModal 
            message={selectedMessageForLink}
            isOpen={isLinkIncidentModalOpen}
            onClose={() => setIsLinkIncidentModalOpen(false)}
            onLinkIncident={handleLinkToIncident}
            incidents={incidents}
            appConfig={appConfig}
        />
      )}
    </>
  );
};

export default WhatsAppMessagesView;
