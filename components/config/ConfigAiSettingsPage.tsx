
import React from 'react';
import { useAppConfig } from '../../hooks/useAppConfig';
import { SettingsCategory, SettingItem } from '../ui/SettingsComponents';

const ConfigAiSettingsPage: React.FC = () => {
  const { config, updateAiModel, updateConfidenceThreshold, saveConfiguration, isLoading } = useAppConfig();

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <SettingsCategory title="AI Model Settings">
        <SettingItem label="Active AI Model" description="Select the AI model for incident analysis.">
           <select 
            value={config.aiModel} 
            onChange={(e) => updateAiModel(e.target.value)}
            className="mt-1 block w-full md:w-2/3 pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md shadow-sm"
          >
            <option value="gemini-2.5-flash-preview-04-17">Gemini 2.5 Flash (Recommended)</option>
            {/* Add other models here if available */}
          </select>
        </SettingItem>
        <SettingItem label="Confidence Threshold" description="Minimum confidence for AI categorization.">
          <div className="flex items-center space-x-3 md:w-2/3">
            <input 
              type="range" 
              min="50" 
              max="95" 
              value={config.confidenceThreshold} 
              onChange={(e) => updateConfidenceThreshold(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <span className="text-sm text-emerald-600 font-medium w-10 text-right">{config.confidenceThreshold}%</span>
          </div>
        </SettingItem>
      </SettingsCategory>
      <div className="flex justify-end mt-8">
        <button
          type="button"
          onClick={saveConfiguration}
          className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Save AI Settings
        </button>
      </div>
    </div>
  );
};

export default ConfigAiSettingsPage;
