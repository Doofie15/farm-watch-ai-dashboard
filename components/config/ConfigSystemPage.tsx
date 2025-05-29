
import React from 'react';
import { useAppConfig } from '../../hooks/useAppConfig';
import { SettingsCategory, SettingItem } from '../ui/SettingsComponents';

const ConfigSystemPage: React.FC = () => {
  const { config, updateDataRetentionDays, updateAdminAlertEmail, saveConfiguration, isLoading } = useAppConfig();

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <SettingsCategory title="Data Management">
         <SettingItem label="Incident Data Retention" description="How long to keep incident data (in days).">
          <input 
            type="number" 
            value={config.dataRetentionDays} 
            onChange={(e) => updateDataRetentionDays(Number(e.target.value))}
            className="mt-1 block w-full md:w-1/3 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            placeholder="e.g., 365"
          />
        </SettingItem>
      </SettingsCategory>

      <SettingsCategory title="System Alerts">
        <SettingItem label="Admin Email for Critical Alerts" description="Email address for receiving high-priority system notifications.">
          <input 
            type="email" 
            value={config.adminAlertEmail} 
            onChange={(e) => updateAdminAlertEmail(e.target.value)}
            className="mt-1 block w-full md:w-2/3 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            placeholder="admin@example.com"
          />
        </SettingItem>
      </SettingsCategory>
      <div className="flex justify-end mt-8">
        <button
          type="button"
          onClick={saveConfiguration}
          className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Save System Settings
        </button>
      </div>
    </div>
  );
};

export default ConfigSystemPage;
