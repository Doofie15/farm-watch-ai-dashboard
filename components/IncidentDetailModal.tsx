
import React, { useState, useEffect } from 'react';
import { Incident, Status, Severity, Reporter, AppConfiguration, UserType } from '../types';
import Modal from './ui/Modal';
import Badge from './ui/Badge';
import IncidentMap from './IncidentMap'; 
import Select from './ui/Select';
import { ShieldCheckIcon } from './ui/Icons';

interface IncidentDetailModalProps {
  incident: Incident | null;
  onClose: () => void;
  updateIncident: (incident: Incident) => void; 
  onNavigateToReporterDetail?: (reporterId: string) => void;
  appConfig: AppConfiguration; // Pass AppConfiguration
}

const DetailItem: React.FC<{ label: string; value?: string | string[] | number | React.ReactNode; fullWidth?: boolean; className?: string; }> = ({ label, value, fullWidth, className }) => {
  if (value === undefined || value === null || (Array.isArray(value) && value.length === 0 && typeof value !== 'boolean' && typeof value !== 'number')) {
    return null;
  }
  return (
    <div className={`py-3 ${fullWidth ? 'sm:col-span-2' : ''} ${className}`}>
      <dt className="text-sm font-medium text-slate-500 mb-0.5">{label}</dt>
      {Array.isArray(value) ? (
        <dd className="mt-1 text-sm text-slate-800 space-x-1 space-y-1">
          {value.map((item, index) => (
            <span key={index} className="inline-block bg-slate-100 rounded-md px-2.5 py-1 text-xs font-medium text-slate-700 mr-1 mb-1">
              {item}
            </span>
          ))}
        </dd>
      ) : (
        <dd className="text-sm text-slate-800 break-words">{value}</dd>
      )}
    </div>
  );
};


const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({ incident, onClose, updateIncident, onNavigateToReporterDetail, appConfig }) => {
  const [editableStatus, setEditableStatus] = useState<Status | ''>('');
  const [editableAdminNotes, setEditableAdminNotes] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (incident) {
      setEditableStatus(incident.status as Status);
      setEditableAdminNotes(incident.adminNotes || '');
      setIsEditing(false); 
    }
  }, [incident]);

  if (!incident) return null;

  const getLabel = (list: { id: string; label: string; isActive: boolean }[], id: string): string => {
    const item = list.find(i => i.id === id);
    return item ? item.label : id;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' });
  };

  const handleSaveChanges = () => {
    if (editableStatus) {
      const updatedIncidentData: Incident = {
        ...incident,
        status: editableStatus as Status, 
        adminNotes: editableAdminNotes.trim() === '' ? undefined : editableAdminNotes.trim(),
      };
      updateIncident(updatedIncidentData);
      setIsEditing(false); 
    }
  };
  
  const handleCancelEdit = () => {
    if (incident) {
        setEditableStatus(incident.status as Status);
        setEditableAdminNotes(incident.adminNotes || '');
    }
    setIsEditing(false);
  }

  // Use active statuses from appConfig for editing options
  const statusOptionsForEditing = appConfig.statuses
    .filter(s => s.isActive)
    .map(s => ({ value: s.id, label: s.label }));
    
  const reporter = incident.reporter;

  return (
    <Modal isOpen={!!incident} onClose={() => { setIsEditing(false); onClose();}} title={`Incident: ${incident.id}`} size="4xl">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-6 gap-y-4">
        <div className="lg:col-span-3">
          <dl className="divide-y divide-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              {isEditing ? (
                <div className="py-3">
                  <label htmlFor="incidentStatus" className="text-sm font-medium text-slate-500 mb-0.5 block">Status</label>
                  <Select
                    id="incidentStatus"
                    options={statusOptionsForEditing}
                    value={editableStatus}
                    onChange={(e) => setEditableStatus(e.target.value as Status)}
                    className="mt-1 block w-full text-sm"
                  />
                </div>
              ) : (
                <DetailItem label="Status" value={<Badge text={getLabel(appConfig.statuses, incident.status)} type="status" value={incident.status} size="md"/>} />
              )}
                <DetailItem label="Severity" value={<Badge text={getLabel(appConfig.severities, incident.aiSeverity)} type="severity" value={incident.aiSeverity} size="md"/>} />
                <DetailItem label="Category" value={<Badge text={getLabel(appConfig.incidentTypes, incident.aiCategory)} type="type" value={incident.aiCategory} size="md"/>} />
                
                <div className="py-3">
                  <dt className="text-sm font-medium text-slate-500 mb-0.5">Reporter</dt>
                  <dd className="text-sm text-slate-800 flex items-center">
                    {incident.isTrustedReport && (
                      <span className="mr-1.5 text-emerald-600" title="Trusted Source Report">
                        {ShieldCheckIcon}
                      </span>
                    )}
                    <div>
                      {onNavigateToReporterDetail && reporter ? (
                        <button
                          onClick={() => {
                            onClose(); 
                            onNavigateToReporterDetail(incident.reporterId);
                          }}
                          className="font-medium text-emerald-700 hover:text-emerald-800 hover:underline text-left"
                        >
                          {`${reporter.firstName || ''} ${reporter.lastName || ''}`.trim() || incident.reporterId}
                        </button>
                      ) : (
                        <div>{reporter ? `${reporter.firstName || ''} ${reporter.lastName || ''}`.trim() || incident.reporterId : incident.reporterId}</div>
                      )}
                      {reporter && <div className="text-xs text-slate-500">{getLabel(appConfig.userTypes, reporter.userType)} ({reporter.phoneNumber})</div>}
                    </div>
                  </dd>
                </div>

                <DetailItem label="Reported Time" value={formatDate(incident.timestampReported)} />
                <DetailItem label="Occurred Time" value={formatDate(incident.timestampOccurred)} />
            </div>
             <DetailItem label="Address / Location" value={incident.address || `${incident.latitude.toFixed(5)}, ${incident.longitude.toFixed(5)}`} fullWidth />
             <DetailItem label="AI Extracted Keywords" value={incident.aiExtractedKeywords} fullWidth/>

            {incident.originalMessageText && (
              <DetailItem label="Original Message" value={<p className="whitespace-pre-wrap">{incident.originalMessageText}</p>} fullWidth/>
            )}
            {incident.voiceNoteTranscription && (
              <DetailItem label="Voice Note Transcription" value={<p className="whitespace-pre-wrap">{incident.voiceNoteTranscription}</p>} fullWidth/>
            )}
            {incident.voiceNoteUrl && (
              <DetailItem 
                label="Voice Note Audio" 
                value={<a href={incident.voiceNoteUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800 underline font-medium">Listen to audio</a>} 
                fullWidth
              />
            )}
             <div className="py-3 sm:col-span-2">
                <dt className="text-sm font-medium text-slate-500 mb-0.5">Admin Notes</dt>
                {isEditing ? (
                    <textarea
                        id="adminNotes"
                        rows={3}
                        className="mt-1 block w-full text-sm text-slate-800 border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                        value={editableAdminNotes}
                        onChange={(e) => setEditableAdminNotes(e.target.value)}
                        placeholder="Add internal notes..."
                    />
                ) : (
                    incident.adminNotes ? 
                    <dd className="text-sm text-slate-800 break-words whitespace-pre-wrap bg-slate-50 p-2 rounded-md">{incident.adminNotes}</dd>
                    : <dd className="text-sm text-slate-500 italic">No admin notes yet.</dd>
                )}
            </div>
          </dl>
        </div>

        <div className="lg:col-span-2 h-72 md:h-auto mt-4 md:mt-0 flex flex-col">
          <h3 className="text-base font-semibold text-slate-700 mb-2">Incident Location</h3>
          <div className="flex-grow rounded-lg shadow-md overflow-hidden border border-slate-200">
            <IncidentMap
              key={incident.id} 
              incidents={[incident]}
              selectedIncident={incident}
              onMarkerClick={() => {}} 
              center={{ lat: incident.latitude, lng: incident.longitude }}
              zoom={15}
              className="h-full w-full"
              highlightSelected={true}
              showControls={false}
            />
          </div>
        </div>
      </div>
      <div className="mt-8 pt-5 border-t border-slate-200 flex justify-end space-x-3">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-300 text-sm font-medium rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={!editableStatus}
              className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-60"
            >
              Save Changes
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => { setIsEditing(false); onClose();}}
              className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-300 text-sm font-medium rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Edit Incident
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default IncidentDetailModal;
