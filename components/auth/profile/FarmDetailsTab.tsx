import React, { useState } from 'react';
import { User } from '../../../hooks/useAuth';

interface FarmDetailsTabProps {
  user: User;
  onSaveSuccess: (message?: string) => void;
  onSaveError: (message?: string) => void;
}

const FarmDetailsTab: React.FC<FarmDetailsTabProps> = ({ user, onSaveSuccess, onSaveError }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    farmName: user.farmName || '',
    farmSize: user.farmSize || '',
    farmType: user.farmType || 'Livestock',
    farmAddress: user.farmAddress || '',
    farmCity: user.farmCity || '',
    farmProvince: user.farmProvince || '',
    farmPostalCode: user.farmPostalCode || '',
    farmLatitude: user.farmLatitude || '',
    farmLongitude: user.farmLongitude || '',
    unionMembershipNumber: user.unionMembershipNumber || '',
    unionMemberSince: user.unionMemberSince || '',
    primaryCrops: user.primaryCrops || '',
    primaryLivestock: user.primaryLivestock || '',
    employeeCount: user.employeeCount || '',
    securityInfrastructure: user.securityInfrastructure || []
  });

  // Mock security infrastructure options
  const securityOptions = [
    { id: 'cameras', label: 'Security Cameras' },
    { id: 'alarms', label: 'Alarm Systems' },
    { id: 'fencing', label: 'Electric Fencing' },
    { id: 'guards', label: 'Security Guards' },
    { id: 'dogs', label: 'Guard Dogs' },
    { id: 'lights', label: 'Motion-Sensor Lights' },
    { id: 'panic', label: 'Panic Buttons' },
    { id: 'radio', label: 'Radio Communication System' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (id: string) => {
    setFormData(prev => {
      const currentInfrastructure = Array.isArray(prev.securityInfrastructure) 
        ? [...prev.securityInfrastructure] 
        : [];
      
      if (currentInfrastructure.includes(id)) {
        return {
          ...prev,
          securityInfrastructure: currentInfrastructure.filter(item => item !== id)
        };
      } else {
        return {
          ...prev,
          securityInfrastructure: [...currentInfrastructure, id]
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // In a real app, this would call an API to update the farm details
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local storage for demo purposes
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('farmwatch_user', JSON.stringify(updatedUser));
      
      onSaveSuccess('Farm details updated successfully');
      setIsEditing(false);
    } catch (error) {
      onSaveError('Failed to update farm details');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-slate-900">Farm Details</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-md hover:bg-emerald-100 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </button>
        ) : (
          <button
            onClick={() => {
              setIsEditing(false);
              // Reset form data to original values
              setFormData({
                farmName: user.farmName || '',
                farmSize: user.farmSize || '',
                farmType: user.farmType || 'Livestock',
                farmAddress: user.farmAddress || '',
                farmCity: user.farmCity || '',
                farmProvince: user.farmProvince || '',
                farmPostalCode: user.farmPostalCode || '',
                farmLatitude: user.farmLatitude || '',
                farmLongitude: user.farmLongitude || '',
                unionMembershipNumber: user.unionMembershipNumber || '',
                unionMemberSince: user.unionMemberSince || '',
                primaryCrops: user.primaryCrops || '',
                primaryLivestock: user.primaryLivestock || '',
                employeeCount: user.employeeCount || '',
                securityInfrastructure: user.securityInfrastructure || []
              });
            }}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="farmName" className="block text-sm font-medium text-slate-700 mb-1">
                Farm Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="farmName"
                name="farmName"
                value={formData.farmName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label htmlFor="farmType" className="block text-sm font-medium text-slate-700 mb-1">
                Farm Type <span className="text-red-500">*</span>
              </label>
              <select
                id="farmType"
                name="farmType"
                value={formData.farmType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                required
              >
                <option value="Livestock">Livestock</option>
                <option value="Crop">Crop</option>
                <option value="Mixed">Mixed</option>
                <option value="Dairy">Dairy</option>
                <option value="Poultry">Poultry</option>
                <option value="Vineyard">Vineyard</option>
                <option value="Orchard">Orchard</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="farmSize" className="block text-sm font-medium text-slate-700 mb-1">
                Farm Size (hectares)
              </label>
              <input
                type="text"
                id="farmSize"
                name="farmSize"
                value={formData.farmSize}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="employeeCount" className="block text-sm font-medium text-slate-700 mb-1">
                Number of Employees
              </label>
              <input
                type="text"
                id="employeeCount"
                name="employeeCount"
                value={formData.employeeCount}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="farmAddress" className="block text-sm font-medium text-slate-700 mb-1">
                Farm Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="farmAddress"
                name="farmAddress"
                value={formData.farmAddress}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label htmlFor="farmCity" className="block text-sm font-medium text-slate-700 mb-1">
                City/Town <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="farmCity"
                name="farmCity"
                value={formData.farmCity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label htmlFor="farmProvince" className="block text-sm font-medium text-slate-700 mb-1">
                Province <span className="text-red-500">*</span>
              </label>
              <select
                id="farmProvince"
                name="farmProvince"
                value={formData.farmProvince}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                required
              >
                <option value="">Select Province</option>
                <option value="Western Cape">Western Cape</option>
                <option value="Eastern Cape">Eastern Cape</option>
                <option value="Northern Cape">Northern Cape</option>
                <option value="Free State">Free State</option>
                <option value="Gauteng">Gauteng</option>
                <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                <option value="Limpopo">Limpopo</option>
                <option value="Mpumalanga">Mpumalanga</option>
                <option value="North West">North West</option>
              </select>
            </div>

            <div>
              <label htmlFor="farmPostalCode" className="block text-sm font-medium text-slate-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                id="farmPostalCode"
                name="farmPostalCode"
                value={formData.farmPostalCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="farmLatitude" className="block text-sm font-medium text-slate-700 mb-1">
                Latitude
              </label>
              <input
                type="text"
                id="farmLatitude"
                name="farmLatitude"
                value={formData.farmLatitude}
                onChange={handleChange}
                placeholder="e.g. -33.9249"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="farmLongitude" className="block text-sm font-medium text-slate-700 mb-1">
                Longitude
              </label>
              <input
                type="text"
                id="farmLongitude"
                name="farmLongitude"
                value={formData.farmLongitude}
                onChange={handleChange}
                placeholder="e.g. 18.4241"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="unionMembershipNumber" className="block text-sm font-medium text-slate-700 mb-1">
                Union Membership Number
              </label>
              <input
                type="text"
                id="unionMembershipNumber"
                name="unionMembershipNumber"
                value={formData.unionMembershipNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="unionMemberSince" className="block text-sm font-medium text-slate-700 mb-1">
                Union Member Since
              </label>
              <input
                type="date"
                id="unionMemberSince"
                name="unionMemberSince"
                value={formData.unionMemberSince}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="primaryCrops" className="block text-sm font-medium text-slate-700 mb-1">
              Primary Crops (if applicable)
            </label>
            <textarea
              id="primaryCrops"
              name="primaryCrops"
              rows={2}
              value={formData.primaryCrops}
              onChange={handleChange}
              placeholder="e.g. Wheat, Corn, Grapes, Apples"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            ></textarea>
          </div>

          <div className="mt-4">
            <label htmlFor="primaryLivestock" className="block text-sm font-medium text-slate-700 mb-1">
              Primary Livestock (if applicable)
            </label>
            <textarea
              id="primaryLivestock"
              name="primaryLivestock"
              rows={2}
              value={formData.primaryLivestock}
              onChange={handleChange}
              placeholder="e.g. Cattle, Sheep, Goats, Chickens"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            ></textarea>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Security Infrastructure
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {securityOptions.map(option => (
                <div key={option.id} className="flex items-center">
                  <input
                    id={option.id}
                    type="checkbox"
                    checked={Array.isArray(formData.securityInfrastructure) && formData.securityInfrastructure.includes(option.id)}
                    onChange={() => handleCheckboxChange(option.id)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                  />
                  <label htmlFor={option.id} className="ml-2 text-sm text-slate-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
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
              ) : 'Save Farm Details'}
            </button>
          </div>
        </form>
      ) : (
        <div>
          {!user.farmName ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-slate-900">No farm details added</h3>
              <p className="mt-1 text-sm text-slate-500">Get started by adding your farm information.</p>
              <div className="mt-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Farm Details
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-500">Farm Name</h4>
                  <p className="mt-1 text-slate-900">{user.farmName}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-500">Farm Type</h4>
                  <p className="mt-1 text-slate-900">{user.farmType || 'Not specified'}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-500">Farm Size</h4>
                  <p className="mt-1 text-slate-900">{user.farmSize ? `${user.farmSize} hectares` : 'Not specified'}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-500">Number of Employees</h4>
                  <p className="mt-1 text-slate-900">{user.employeeCount || 'Not specified'}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-500">Address</h4>
                  <p className="mt-1 text-slate-900">
                    {user.farmAddress}
                    {user.farmCity && `, ${user.farmCity}`}
                    {user.farmProvince && `, ${user.farmProvince}`}
                    {user.farmPostalCode && ` ${user.farmPostalCode}`}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-500">GPS Coordinates</h4>
                  <p className="mt-1 text-slate-900">
                    {user.farmLatitude && user.farmLongitude 
                      ? `${user.farmLatitude}, ${user.farmLongitude}` 
                      : 'Not specified'}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-500">Union Membership</h4>
                  <p className="mt-1 text-slate-900">
                    {user.unionMembershipNumber 
                      ? `Member #${user.unionMembershipNumber}` 
                      : 'Membership number not specified'}
                    {user.unionMemberSince && ` (since ${new Date(user.unionMemberSince).toLocaleDateString('en-ZA')})`}
                  </p>
                </div>
              </div>

              {(user.primaryCrops || user.primaryLivestock) && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user.primaryCrops && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">Primary Crops</h4>
                      <p className="mt-1 text-slate-900">{user.primaryCrops}</p>
                    </div>
                  )}

                  {user.primaryLivestock && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">Primary Livestock</h4>
                      <p className="mt-1 text-slate-900">{user.primaryLivestock}</p>
                    </div>
                  )}
                </div>
              )}

              {Array.isArray(user.securityInfrastructure) && user.securityInfrastructure.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-slate-500">Security Infrastructure</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {user.securityInfrastructure.map(item => {
                      const option = securityOptions.find(opt => opt.id === item);
                      return option ? (
                        <span key={item} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          {option.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FarmDetailsTab;
