import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  ProfileHeader,
  ProfileTabs,
  PersonalInfoTab,
  SecurityTab,
  NotificationsTab,
  ActivityTab,
  FarmDetailsTab
} from './profile';

interface EnhancedUserProfilePageProps {
  onBack: () => void;
}

const EnhancedUserProfilePage: React.FC<EnhancedUserProfilePageProps> = ({ onBack }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'notifications' | 'activity' | 'farm'>('personal');
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!user) return null;

  const handleSaveSuccess = (message: string = 'Profile updated successfully') => {
    setSaveMessage({ type: 'success', text: message });
    setTimeout(() => setSaveMessage(null), 5000);
  };

  const handleSaveError = (message: string = 'Failed to update profile') => {
    setSaveMessage({ type: 'error', text: message });
    setTimeout(() => setSaveMessage(null), 5000);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 p-2 rounded-full hover:bg-slate-100"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-slate-800">User Profile</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <ProfileHeader user={user} onLogout={logout} />

        {saveMessage && (
          <div 
            className={`px-6 py-3 ${saveMessage.type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' : 'bg-red-50 text-red-800 border-l-4 border-red-500'} flex items-center`}
          >
            {saveMessage.type === 'success' ? (
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {saveMessage.text}
          </div>
        )}

        <div className="p-6">
          <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
          
          <div className="mt-6">
            {activeTab === 'personal' && (
              <PersonalInfoTab 
                user={user} 
                onSaveSuccess={handleSaveSuccess} 
                onSaveError={handleSaveError} 
              />
            )}
            
            {activeTab === 'security' && (
              <SecurityTab 
                onSaveSuccess={handleSaveSuccess} 
                onSaveError={handleSaveError} 
              />
            )}
            
            {activeTab === 'notifications' && (
              <NotificationsTab 
                onSaveSuccess={handleSaveSuccess} 
                onSaveError={handleSaveError} 
              />
            )}
            
            {activeTab === 'activity' && (
              <ActivityTab user={user} />
            )}
            
            {activeTab === 'farm' && (
              <FarmDetailsTab 
                user={user} 
                onSaveSuccess={handleSaveSuccess} 
                onSaveError={handleSaveError} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedUserProfilePage;
