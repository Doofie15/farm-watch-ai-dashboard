import React, { useState } from 'react';
import { User } from '../../../hooks/useAuth';

interface ProfileHeaderProps {
  user: User;
  onLogout: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onLogout }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Calculate user initials for avatar
  const getInitials = () => {
    return user.firstName.charAt(0) + (user.lastName ? user.lastName.charAt(0) : '');
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="relative">
      {/* Background banner */}
      <div className="h-40 bg-gradient-to-r from-emerald-600 to-emerald-800"></div>
      
      <div className="px-6 pb-6">
        <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-4">
          {/* Profile picture */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-emerald-600 flex items-center justify-center text-white text-3xl font-bold">
                {getInitials()}
              </div>
            </div>
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all duration-200 cursor-pointer">
              <div className="opacity-0 group-hover:opacity-100 text-white font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm block mt-1">Change</span>
              </div>
            </div>
          </div>
          
          {/* User info */}
          <div className="mt-4 md:mt-0 md:ml-6 flex-grow">
            <h2 className="text-2xl font-bold text-slate-800">{user.firstName} {user.lastName}</h2>
            <div className="flex flex-wrap items-center text-slate-600 text-sm mt-1">
              <span className="mr-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                {user.email}
              </span>
              <span className="mr-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {user.phoneNumber}
              </span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Joined {formatDate(user.dateRegistered)}
              </span>
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                {user.userType}
              </span>
              {user.isAgriculturalUnionMember === 'Yes' && (
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 ml-2">
                  Agricultural Union Member
                </span>
              )}
            </div>
          </div>
          
          {/* Logout button */}
          <div className="mt-4 md:mt-0 relative">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
            
            {/* Logout confirmation popup */}
            {showLogoutConfirm && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-10 p-4 border border-slate-200">
                <p className="text-slate-700 mb-3">Are you sure you want to sign out?</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onLogout}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
