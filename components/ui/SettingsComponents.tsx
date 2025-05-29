
import React, { useState } from 'react';
import { ConfigurableListItem } from '../../types'; 

export const SettingsCategory: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
  <section className="mb-8 p-5 border border-slate-200 rounded-xl bg-white shadow-lg">
    <h3 className="text-lg font-semibold text-slate-700 mb-4 border-b border-slate-200 pb-3">{title}</h3>
    <div className="space-y-4 text-sm text-slate-600">{children}</div>
  </section>
);

export const SettingItem: React.FC<{ label: string; description?: string; children: React.ReactNode; }> = ({ label, description, children }) => (
  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
    <dt className="text-sm font-medium text-slate-600">
      {label}
      {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
    </dt>
    <dd className="mt-1 sm:mt-0 sm:col-span-2">{children}</dd>
  </div>
);

export const ToggleSwitch: React.FC<{ label: string; enabled: boolean; onChange: (enabled: boolean) => void; srLabel?: string }> =
({ label, enabled, onChange, srLabel }) => (
  <label htmlFor={label.replace(/\s+/g, '-').toLowerCase()} className="flex items-center cursor-pointer">
    <div className="relative">
      <input
        type="checkbox"
        id={label.replace(/\s+/g, '-').toLowerCase()}
        className="sr-only"
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className={`block w-10 h-6 rounded-full transition-colors ${enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${enabled ? 'translate-x-full' : ''}`}></div>
    </div>
    <div className="ml-3 text-sm text-slate-700">{srLabel ? <span className="sr-only">{srLabel}</span> : label}</div>
  </label>
);

interface ConfigurableListEditorProps {
  items: ConfigurableListItem[];
  onUpdateItem: (id: string, newLabel: string, newIsActive: boolean) => void;
  onAddItem?: (id: string, label: string) => void;
  onDeleteItem?: (itemId: string) => void; // New prop for deleting items
  listKeyFriendlyName?: string;
}

export const ConfigurableListEditor: React.FC<ConfigurableListEditorProps> = ({ items, onUpdateItem, onAddItem, onDeleteItem, listKeyFriendlyName = "Item" }) => {
  const [newItemId, setNewItemId] = useState('');
  const [newItemLabel, setNewItemLabel] = useState('');
  const [addItemError, setAddItemError] = useState<string | null>(null);

  const handleAddNewItem = () => {
    setAddItemError(null);
    if (!newItemId.trim() || !newItemLabel.trim()) {
      setAddItemError(`${listKeyFriendlyName} ID and Label cannot be empty.`);
      return;
    }
    if (items.some(item => item.id.toLowerCase() === newItemId.trim().toLowerCase())) {
      setAddItemError(`${listKeyFriendlyName} ID already exists.`);
      return;
    }
    if (onAddItem) {
      onAddItem(newItemId.trim(), newItemLabel.trim());
      setNewItemId('');
      setNewItemLabel('');
    }
  };

  const handleDeleteItem = (itemId: string) => {
    if (onDeleteItem) {
      if (window.confirm(`Are you sure you want to delete this ${listKeyFriendlyName.toLowerCase()}? This action cannot be undone.`)) {
        onDeleteItem(itemId);
      }
    }
  };

  return (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item.id} className="p-3 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-slate-50/50">
          <div className="sm:col-span-7">
            <label htmlFor={`${item.id}-label`} className="sr-only">Label for {item.id}</label>
            <input
              type="text"
              id={`${item.id}-label`}
              value={item.label}
              onChange={(e) => onUpdateItem(item.id, e.target.value, item.isActive)}
              className="w-full px-2 py-1.5 text-sm border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Display Label"
            />
            <p className="text-xs text-slate-400 mt-0.5">ID: {item.id} {item.isSystemItem && <span className="text-sky-600">(System)</span>}</p>
          </div>
          <div className="sm:col-span-2 flex items-center sm:justify-center">
             <ToggleSwitch
              label="Active"
              srLabel={`Set ${item.label} as active`}
              enabled={item.isActive}
              onChange={(isActive) => onUpdateItem(item.id, item.label, isActive)}
            />
          </div>
          <div className="sm:col-span-3 flex items-center sm:justify-end">
            {!item.isSystemItem && onDeleteItem && (
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded-md hover:bg-red-100 border border-red-300 transition-colors"
                title={`Delete ${item.label}`}
              >
                Delete
              </button>
            )}
            {item.isSystemItem && (
                 <span className="text-xs text-slate-400 italic px-2 py-1">(System item cannot be deleted)</span>
            )}
          </div>
        </div>
      ))}

      {onAddItem && (
        <div className="mt-6 pt-4 border-t border-slate-200">
          <h4 className="text-md font-semibold text-slate-700 mb-2">Add New {listKeyFriendlyName}</h4>
          {addItemError && <p className="text-xs text-red-500 mb-2">{addItemError}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label htmlFor="new-item-id" className="block text-xs font-medium text-slate-600 mb-1">New {listKeyFriendlyName} ID</label>
              <input
                type="text"
                id="new-item-id"
                value={newItemId}
                onChange={(e) => setNewItemId(e.target.value)}
                placeholder="e.g., custom_type (unique)"
                className="w-full px-2 py-1.5 text-sm border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="new-item-label" className="block text-xs font-medium text-slate-600 mb-1">New {listKeyFriendlyName} Label</label>
              <input
                type="text"
                id="new-item-label"
                value={newItemLabel}
                onChange={(e) => setNewItemLabel(e.target.value)}
                placeholder="Display Label"
                className="w-full px-2 py-1.5 text-sm border-slate-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <button
              onClick={handleAddNewItem}
              className="bg-emerald-500 text-white px-3 py-1.5 text-sm font-medium rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-400 h-fit"
            >
              Add {listKeyFriendlyName}
            </button>
          </div>
           <p className="text-xs text-slate-400 mt-1">The ID should be a unique, code-friendly string (e.g., using underscores instead of spaces).</p>
        </div>
      )}
    </div>
  );
};