
import React from 'react';
import { useAppConfig } from '../../hooks/useAppConfig';
import { SettingsCategory, SettingItem } from '../ui/SettingsComponents';

const ConfigIntegrationsPage: React.FC = () => {
  const { config, updateWebhookUrl, saveConfiguration, isLoading } = useAppConfig();

  if (isLoading) return <div className="p-6">Loading...</div>;
  
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <SettingsCategory title="WhatsApp Integration">
        <SettingItem label="API Status">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Connected (Simulated)</span>
        </SettingItem>
        <SettingItem label="Webhook URL" description="Endpoint for receiving WhatsApp messages.">
          <input 
            type="text" 
            value={config.webhookUrl} 
            onChange={(e) => updateWebhookUrl(e.target.value)}
            className="mt-1 block w-full md:w-2/3 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            placeholder="https://your-api.com/webhook"
          />
        </SettingItem>
      </SettingsCategory>
      <div className="flex justify-end mt-8">
        <button
          type="button"
          onClick={saveConfiguration}
          className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Save Integration Settings
        </button>
      </div>
    </div>
  );
};

export default ConfigIntegrationsPage;
