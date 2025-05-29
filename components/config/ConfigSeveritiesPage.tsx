
import React from 'react';
import { useAppConfig } from '../../hooks/useAppConfig';
import { ConfigurableListEditor, SettingsCategory } from '../ui/SettingsComponents';
import { ConfigurableListItem } from '../../types';

const ConfigSeveritiesPage: React.FC = () => {
  const { config, updateConfigList, saveConfiguration, isLoading, addConfigListItem, deleteConfigListItem } = useAppConfig();

  const handleUpdate = (id: string, newLabel: string, newIsActive: boolean) => {
    const updatedItems = config.severities.map(item =>
      item.id === id ? { ...item, label: newLabel, isActive: newIsActive } : item
    );
    updateConfigList('severities', updatedItems);
  };

  const handleAddItem = (id: string, label: string) => {
    addConfigListItem('severities', id, label);
  };

  const handleDeleteItem = (itemId: string) => {
    deleteConfigListItem('severities', itemId);
  };

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <SettingsCategory title="Severities Configuration">
        <p className="text-xs text-slate-500 mb-3">Manage incident severity levels. Edit display labels, toggle active status, or add new severity levels. System-defined severities cannot be deleted.</p>
        <ConfigurableListEditor
          items={config.severities}
          onUpdateItem={handleUpdate}
          onAddItem={handleAddItem}
          onDeleteItem={handleDeleteItem}
          listKeyFriendlyName="Severity"
        />
      </SettingsCategory>
      <div className="flex justify-end mt-8">
        <button
          type="button"
          onClick={saveConfiguration}
          className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Save Severity Settings
        </button>
      </div>
    </div>
  );
};

export default ConfigSeveritiesPage;