
import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import { Reporter, UserType, AppConfiguration } from '../types';
import Select from './ui/Select';

interface AddReporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReporter: (reporterData: Omit<Reporter, 'id' | 'dateAdded' | 'incidentsReportedCount' | 'falseAlarmCount' | 'incidents'>) => Reporter | undefined;
  existingReporter?: Reporter | null; 
  appConfig: AppConfiguration; // Pass AppConfiguration
}


const AddReporterModal: React.FC<AddReporterModalProps> = ({ isOpen, onClose, onAddReporter, existingReporter, appConfig }) => {
  
  const activeUserTypeOptions = appConfig.userTypes
    .filter(ut => ut.isActive)
    .map(ut => ({ value: ut.id, label: ut.label }));
  
  const defaultUserType = activeUserTypeOptions.length > 0 ? activeUserTypeOptions[0].value : UserType.CITIZEN;


  const initialFormData = {
    phoneNumber: '',
    firstName: '',
    lastName: '',
    userType: defaultUserType as UserType,
    isTrustedSource: false,
    notes: '',
    isAgriculturalUnionMember: '', // Changed to string
    farmName: '',
    city: '',
    homeLatitude: '',
    homeLongitude: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingReporter) {
      setFormData({
        phoneNumber: existingReporter.phoneNumber,
        firstName: existingReporter.firstName || '',
        lastName: existingReporter.lastName || '',
        userType: existingReporter.userType as UserType,
        isTrustedSource: existingReporter.isTrustedSource,
        notes: existingReporter.notes || '',
        isAgriculturalUnionMember: existingReporter.isAgriculturalUnionMember || '',
        farmName: existingReporter.farmName || '',
        city: existingReporter.city || '',
        homeLatitude: existingReporter.homeLatitude?.toString() || '',
        homeLongitude: existingReporter.homeLongitude?.toString() || '',
      });
    } else {
      // When opening for new, ensure defaultUserType considers the latest config
      setFormData({
        ...initialFormData,
        userType: (activeUserTypeOptions.length > 0 ? activeUserTypeOptions[0].value : UserType.CITIZEN) as UserType,
      });
    }
  }, [existingReporter, isOpen, appConfig.userTypes]); // Re-run if appConfig.userTypes changes


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'userType' ? value as UserType : value 
        }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.phoneNumber) {
      setError("Phone number is required.");
      return;
    }
    if (!/^\+?[0-9\s-()]{7,}$/.test(formData.phoneNumber) && formData.phoneNumber !== 'SECURITY_CO_001' && formData.phoneNumber !== 'ADMIN_USER') {
        setError("Please enter a valid phone number.");
        return;
    }
    
    const reporterData = { 
      ...formData,
      homeLatitude: formData.homeLatitude ? parseFloat(formData.homeLatitude) : undefined,
      homeLongitude: formData.homeLongitude ? parseFloat(formData.homeLongitude) : undefined,
    };

    const addedReporter = onAddReporter(reporterData);
    if (addedReporter) {
      onClose();
      // Reset form with potentially updated defaults
      setFormData({
        ...initialFormData,
        userType: (activeUserTypeOptions.length > 0 ? activeUserTypeOptions[0].value : UserType.CITIZEN) as UserType,
      }); 
    } else {
      if(!error) setError("Failed to add reporter. Phone number might already exist or another error occurred.");
    }
  };
  
  const formFieldClass = "block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={existingReporter ? "Edit Reporter" : "Add New Reporter"} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">{error}</div>}
        
        <div>
          <label htmlFor="phoneNumber" className={labelClass}>Phone Number *</label>
          <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={formFieldClass} required disabled={!!existingReporter} />
           {existingReporter && <p className="text-xs text-slate-500 mt-1">Phone number cannot be changed for existing reporters.</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className={labelClass}>First Name</label>
            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className={formFieldClass} />
          </div>
          <div>
            <label htmlFor="lastName" className={labelClass}>Last Name</label>
            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className={formFieldClass} />
          </div>
        </div>

        <div>
          <label htmlFor="userType" className={labelClass}>User Type</label>
          <Select id="userType" name="userType" options={activeUserTypeOptions} value={formData.userType} onChange={handleChange} className={formFieldClass} />
        </div>

        <div>
          <label htmlFor="isAgriculturalUnionMember" className={labelClass}>Agricultural Union (Name, if any)</label>
          <input type="text" id="isAgriculturalUnionMember" name="isAgriculturalUnionMember" value={formData.isAgriculturalUnionMember} onChange={handleChange} className={formFieldClass} placeholder="e.g., Agri Western Cape"/>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="farmName" className={labelClass}>Farm Name</label>
                <input type="text" id="farmName" name="farmName" value={formData.farmName} onChange={handleChange} className={formFieldClass} />
            </div>
            <div>
                <label htmlFor="city" className={labelClass}>City / Town</label>
                <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className={formFieldClass} />
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="homeLatitude" className={labelClass}>Home Latitude (Optional)</label>
                <input type="number" step="any" id="homeLatitude" name="homeLatitude" value={formData.homeLatitude} onChange={handleChange} className={formFieldClass} placeholder="-33.9123"/>
            </div>
            <div>
                <label htmlFor="homeLongitude" className={labelClass}>Home Longitude (Optional)</label>
                <input type="number" step="any" id="homeLongitude" name="homeLongitude" value={formData.homeLongitude} onChange={handleChange} className={formFieldClass} placeholder="18.4234"/>
            </div>
        </div>


        <div>
          <label htmlFor="notes" className={labelClass}>Notes</label>
          <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} className={formFieldClass} placeholder="Any relevant details about the reporter..." />
        </div>

        <div className="flex items-center">
          <input type="checkbox" id="isTrustedSource" name="isTrustedSource" checked={formData.isTrustedSource} onChange={handleChange} className="h-4 w-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" />
          <label htmlFor="isTrustedSource" className="ml-2 block text-sm text-slate-800">Mark as Trusted Source</label>
        </div>

        <div className="pt-5 border-t border-slate-200 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-300 text-sm font-medium rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
            {existingReporter ? "Save Changes" : "Add Reporter"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddReporterModal;