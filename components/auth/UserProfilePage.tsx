import React, { useState } from 'react';
import { useAuth, User } from '../../hooks/useAuth';

interface UserProfilePageProps {
  onBack: () => void;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ onBack }) => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>(user || {});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // In a real app, this would call an API to update the user profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local storage for demo purposes
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('farmwatch_user', JSON.stringify(updatedUser));
      
      setSaveMessage({ type: 'success', text: 'Profile updated successfully' });
      setIsEditing(false);
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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
        <div className="p-6 bg-emerald-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
              <p className="text-emerald-100">{user.email}</p>
            </div>
            <div className="flex space-x-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-white text-emerald-600 rounded-md hover:bg-emerald-50 transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(user);
                    setSaveMessage(null);
                  }}
                  className="px-4 py-2 bg-white text-emerald-600 rounded-md hover:bg-emerald-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={logout}
                className="px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {saveMessage && (
          <div className={`px-6 py-3 ${saveMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {saveMessage.text}
          </div>
        )}

        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>

                {formData.isAgriculturalUnionMember === 'Yes' && (
                  <div>
                    <label htmlFor="farmName" className="block text-sm font-medium text-slate-700 mb-1">
                      Farm Name
                    </label>
                    <input
                      type="text"
                      id="farmName"
                      name="farmName"
                      value={formData.farmName || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="isAgriculturalUnionMember" className="block text-sm font-medium text-slate-700 mb-1">
                    Agricultural Union Member?
                  </label>
                  <select
                    id="isAgriculturalUnionMember"
                    name="isAgriculturalUnionMember"
                    value={formData.isAgriculturalUnionMember || 'No'}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
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
                  ) : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-500">First Name</h3>
                  <p className="mt-1 text-slate-900">{user.firstName}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500">Last Name</h3>
                  <p className="mt-1 text-slate-900">{user.lastName}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500">Email</h3>
                  <p className="mt-1 text-slate-900">{user.email}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500">Phone Number</h3>
                  <p className="mt-1 text-slate-900">{user.phoneNumber}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500">User Type</h3>
                  <p className="mt-1 text-slate-900">{user.userType}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500">Agricultural Union Member</h3>
                  <p className="mt-1 text-slate-900">{user.isAgriculturalUnionMember}</p>
                </div>

                {user.farmName && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Farm Name</h3>
                    <p className="mt-1 text-slate-900">{user.farmName}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-slate-500">Registered On</h3>
                  <p className="mt-1 text-slate-900">
                    {new Date(user.dateRegistered).toLocaleDateString('en-ZA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
