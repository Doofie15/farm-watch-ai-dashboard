import React, { useState } from 'react';

interface NotificationsTabProps {
  onSaveSuccess: (message?: string) => void;
  onSaveError: (message?: string) => void;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({ onSaveSuccess, onSaveError }) => {
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      securityAlerts: true,
      newIncidents: true,
      statusUpdates: true,
      weeklyReports: true,
      farmwatchNews: false
    },
    sms: {
      securityAlerts: true,
      newIncidents: true,
      statusUpdates: false,
      weeklyReports: false,
      farmwatchNews: false
    },
    push: {
      securityAlerts: true,
      newIncidents: true,
      statusUpdates: true,
      weeklyReports: false,
      farmwatchNews: false
    },
    whatsapp: {
      securityAlerts: true,
      newIncidents: true,
      statusUpdates: false,
      weeklyReports: false,
      farmwatchNews: false
    }
  });
  
  const [isSaving, setIsSaving] = useState(false);
  
  const handleToggle = (channel: 'email' | 'sms' | 'push' | 'whatsapp', setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [setting]: !prev[channel][setting as keyof typeof prev[typeof channel]]
      }
    }));
  };
  
  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      // In a real app, this would call an API to update notification settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSaveSuccess('Notification preferences updated successfully');
    } catch (error) {
      onSaveError('Failed to update notification preferences');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-slate-900">Notification Preferences</h3>
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className={`px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSaving ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : 'Save Preferences'}
        </button>
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg mb-6">
        <p className="text-slate-700">
          Configure how you want to receive notifications from FarmWatch AI. You can choose different notification methods for different types of alerts.
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Notification Type
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                SMS
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Push
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                WhatsApp
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-slate-900">Security Alerts</div>
                <div className="text-xs text-slate-500">Critical security notifications about your account</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <Toggle 
                  enabled={notificationSettings.email.securityAlerts} 
                  onChange={() => handleToggle('email', 'securityAlerts')} 
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <Toggle 
                  enabled={notificationSettings.sms.securityAlerts} 
                  onChange={() => handleToggle('sms', 'securityAlerts')} 
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <Toggle 
                  enabled={notificationSettings.push.securityAlerts} 
                  onChange={() => handleToggle('push', 'securityAlerts')} 
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <Toggle 
                  enabled={notificationSettings.whatsapp.securityAlerts} 
                  onChange={() => handleToggle('whatsapp', 'securityAlerts')} 
                />
              </td>
            </tr>
            
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-slate-900">New Incidents</div>
                <div className="text-xs text-slate-500">Notifications when new incidents are reported in your area</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <Toggle 
                  enabled={notificationSettings.email.newIncidents} 
                  onChange={() => handleToggle('email', 'newIncidents')} 
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <Toggle 
                  enabled={notificationSettings.sms.newIncidents} 
                  onChange={() => handleToggle('sms', 'newIncidents')} 
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <Toggle 
                  enabled={notificationSettings.push.newIncidents} 
                  onChange={() => handleToggle('push', 'newIncidents')} 
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <Toggle 
                  enabled={notificationSettings.whatsapp.newIncidents} 
                  onChange={() => handleToggle('whatsapp', 'newIncidents')} 
                />
              </td>
            </tr>
            
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-slate-900">Status Updates</div>
                <div className="text-xs text-slate-500">Updates on incident status changes</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <Toggle 
                  enabled={notificationSettings.email.statusUpdates} 
                  onChange={() => handleToggle('email', 'statusUpdates')} 
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <Toggle 
                  enabled={notificationSettings.sms.statusUpdates} 
                  onChange={() => handleToggle('sms', 'statusUpdates')} 
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <Toggle 
                  enabled={notificationSettings.push.statusUpdates} 
                  onChange={() => handleToggle('push', 'statusUpdates')} 
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <Toggle 
                  enabled={notificationSettings.whatsapp.statusUpdates} 
                  onChange={() => handleToggle('whatsapp', 'statusUpdates')} 
                />
              </td>
            </tr>
            
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-slate-900">Weekly Reports</div>
                <div className="text-xs text-slate-500">Weekly summary of incidents and activity</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <Toggle 
                  enabled={notificationSettings.email.weeklyReports} 
                  onChange={() => handleToggle('email', 'weeklyReports')} 
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <Toggle 
                  enabled={notificationSettings.sms.weeklyReports} 
                  onChange={() => handleToggle('sms', 'weeklyReports')} 
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <Toggle 
                  enabled={notificationSettings.push.weeklyReports} 
                  onChange={() => handleToggle('push', 'weeklyReports')} 
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <Toggle 
                  enabled={notificationSettings.whatsapp.weeklyReports} 
                  onChange={() => handleToggle('whatsapp', 'weeklyReports')} 
                />
              </td>
            </tr>
            
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-slate-900">FarmWatch News</div>
                <div className="text-xs text-slate-500">Updates about new features and system improvements</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <Toggle 
                  enabled={notificationSettings.email.farmwatchNews} 
                  onChange={() => handleToggle('email', 'farmwatchNews')} 
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <Toggle 
                  enabled={notificationSettings.sms.farmwatchNews} 
                  onChange={() => handleToggle('sms', 'farmwatchNews')} 
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <Toggle 
                  enabled={notificationSettings.push.farmwatchNews} 
                  onChange={() => handleToggle('push', 'farmwatchNews')} 
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <Toggle 
                  enabled={notificationSettings.whatsapp.farmwatchNews} 
                  onChange={() => handleToggle('whatsapp', 'farmwatchNews')} 
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 border-t border-slate-200 pt-6">
        <h4 className="text-md font-medium text-slate-900 mb-4">Notification Delivery Schedule</h4>
        <p className="text-sm text-slate-700 mb-4">
          You can choose to receive non-critical notifications only during specific hours to avoid disruptions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <div>
            <label htmlFor="quietHoursStart" className="block text-sm font-medium text-slate-700 mb-1">
              Quiet Hours Start
            </label>
            <select
              id="quietHoursStart"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">No quiet hours</option>
              {Array.from({ length: 24 }).map((_, i) => (
                <option key={i} value={i}>
                  {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i - 12}:00 PM`}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="quietHoursEnd" className="block text-sm font-medium text-slate-700 mb-1">
              Quiet Hours End
            </label>
            <select
              id="quietHoursEnd"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">No quiet hours</option>
              {Array.from({ length: 24 }).map((_, i) => (
                <option key={i} value={i}>
                  {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i - 12}:00 PM`}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-slate-500">
          <p>Note: Critical security alerts will always be delivered immediately, regardless of quiet hours settings.</p>
        </div>
      </div>
    </div>
  );
};

// Toggle component for notification settings
const Toggle: React.FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => {
  return (
    <button
      type="button"
      className={`${
        enabled ? 'bg-emerald-600' : 'bg-slate-200'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2`}
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
    >
      <span className="sr-only">Toggle notification</span>
      <span
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      >
        <span
          className={`${
            enabled ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200'
          } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
          aria-hidden="true"
        >
          <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 12 12">
            <path
              d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span
          className={`${
            enabled ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100'
          } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
          aria-hidden="true"
        >
          <svg className="h-3 w-3 text-emerald-600" fill="currentColor" viewBox="0 0 12 12">
            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
          </svg>
        </span>
      </span>
    </button>
  );
};

export default NotificationsTab;
