import React, { useState } from 'react';

interface SecurityTabProps {
  onSaveSuccess: (message?: string) => void;
  onSaveError: (message?: string) => void;
}

const SecurityTab: React.FC<SecurityTabProps> = ({ onSaveSuccess, onSaveError }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  // Recent login activity - would come from API in real app
  const recentActivity = [
    { id: 1, device: 'Chrome on Windows', location: 'Cape Town, South Africa', ip: '196.25.XX.XX', time: '2025-05-30T08:45:12Z', status: 'success' },
    { id: 2, device: 'Safari on iPhone', location: 'Paarl, South Africa', ip: '196.25.XX.XX', time: '2025-05-29T16:22:05Z', status: 'success' },
    { id: 3, device: 'Firefox on Windows', location: 'Unknown Location', ip: '85.132.XX.XX', time: '2025-05-27T11:15:30Z', status: 'failed' }
  ];

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when field is changed
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validatePasswordForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(passwordData.newPassword)) {
      errors.newPassword = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(passwordData.newPassword)) {
      errors.newPassword = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(passwordData.newPassword)) {
      errors.newPassword = "Password must contain at least one number";
    } else if (!/[^A-Za-z0-9]/.test(passwordData.newPassword)) {
      errors.newPassword = "Password must contain at least one special character";
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    return errors;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validatePasswordForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setIsSaving(true);
    
    try {
      // In a real app, this would call an API to update the password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSaveSuccess('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      onSaveError('Failed to update password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTwoFactorToggle = () => {
    if (!twoFactorEnabled) {
      setShowTwoFactorSetup(true);
    } else {
      // In a real app, this would call an API to disable 2FA
      setTwoFactorEnabled(false);
      onSaveSuccess('Two-factor authentication disabled');
    }
  };

  const handleTwoFactorSetup = async () => {
    // In a real app, this would verify the code and enable 2FA
    if (verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
      setIsSaving(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setTwoFactorEnabled(true);
        setShowTwoFactorSetup(false);
        setVerificationCode('');
        onSaveSuccess('Two-factor authentication enabled');
      } catch (error) {
        onSaveError('Failed to enable two-factor authentication');
      } finally {
        setIsSaving(false);
      }
    } else {
      onSaveError('Please enter a valid 6-digit verification code');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Password Section */}
      <div>
        <h3 className="text-lg font-medium text-slate-900 mb-4">Change Password</h3>
        <form onSubmit={handlePasswordSubmit} className="max-w-md">
          <div className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 mb-1">
                Current Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className={`w-full px-3 py-2 border ${validationErrors.currentPassword ? 'border-red-500' : 'border-slate-300'} rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500`}
              />
              {validationErrors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.currentPassword}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className={`w-full px-3 py-2 border ${validationErrors.newPassword ? 'border-red-500' : 'border-slate-300'} rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500`}
              />
              {validationErrors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.newPassword}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className={`w-full px-3 py-2 border ${validationErrors.confirmPassword ? 'border-red-500' : 'border-slate-300'} rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500`}
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
              )}
            </div>
            
            <div className="pt-2">
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
                    Updating...
                  </span>
                ) : 'Update Password'}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Two-Factor Authentication Section */}
      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-lg font-medium text-slate-900 mb-4">Two-Factor Authentication</h3>
        
        {!showTwoFactorSetup ? (
          <div className="flex items-center justify-between max-w-md">
            <div>
              <p className="text-slate-700">
                {twoFactorEnabled 
                  ? 'Two-factor authentication is enabled. This adds an extra layer of security to your account.' 
                  : 'Enable two-factor authentication for additional security.'}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {twoFactorEnabled 
                  ? 'You will need to enter a verification code from your authenticator app when signing in.' 
                  : 'You will be asked to enter a verification code from your authenticator app when signing in.'}
              </p>
            </div>
            <button
              onClick={handleTwoFactorToggle}
              className={`px-4 py-2 rounded-md transition-colors ${
                twoFactorEnabled 
                  ? 'bg-red-50 text-red-700 hover:bg-red-100' 
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {twoFactorEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        ) : (
          <div className="max-w-md bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="font-medium text-slate-800 mb-2">Setup Two-Factor Authentication</h4>
            <p className="text-sm text-slate-600 mb-4">
              1. Install an authenticator app like Google Authenticator or Authy.
              <br />
              2. Scan this QR code with your app.
              <br />
              3. Enter the 6-digit verification code from your app.
            </p>
            
            <div className="flex justify-center mb-4">
              <div className="bg-white p-2 rounded-lg border border-slate-300">
                {/* This would be a real QR code in a production app */}
                <div className="w-40 h-40 bg-slate-800 flex items-center justify-center text-white text-xs">
                  QR Code Placeholder
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="verificationCode" className="block text-sm font-medium text-slate-700 mb-1">
                Verification Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowTwoFactorSetup(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTwoFactorSetup}
                disabled={isSaving}
                className={`px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : 'Verify and Enable'}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Recent Login Activity Section */}
      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-lg font-medium text-slate-900 mb-4">Recent Login Activity</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Device
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {recentActivity.map((activity) => (
                <tr key={activity.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {activity.device}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {activity.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {activity.ip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {formatDate(activity.time)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activity.status === 'success' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {activity.status === 'success' ? 'Successful' : 'Failed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
