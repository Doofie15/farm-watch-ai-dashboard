import React, { useState } from 'react';
import { User } from '../../../hooks/useAuth';

interface ActivityLogEntry {
  id: number;
  action: string;
  description: string;
  timestamp: string;
  ipAddress: string;
  location: string;
}

interface ActivityTabProps {
  user: User;
}

const ActivityTab: React.FC<ActivityTabProps> = ({ user }) => {
  // Use user data to personalize the activity log display
  const userFullName = `${user.firstName} ${user.lastName}`;
  const userJoinDate = new Date(user.dateRegistered).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  // In a real app, this would be fetched from an API
  const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>([
    {
      id: 1,
      action: 'Login',
      description: 'Successful login to account',
      timestamp: '2025-05-30T08:45:12Z',
      ipAddress: '196.25.XX.XX',
      location: 'Cape Town, South Africa'
    },
    {
      id: 2,
      action: 'Profile Update',
      description: 'Updated personal information',
      timestamp: '2025-05-29T16:22:05Z',
      ipAddress: '196.25.XX.XX',
      location: 'Paarl, South Africa'
    },
    {
      id: 3,
      action: 'Password Change',
      description: 'Changed account password',
      timestamp: '2025-05-27T11:15:30Z',
      ipAddress: '196.25.XX.XX',
      location: 'Cape Town, South Africa'
    },
    {
      id: 4,
      action: 'Incident Report',
      description: 'Created new incident report #FW-2025-0542',
      timestamp: '2025-05-26T14:33:22Z',
      ipAddress: '196.25.XX.XX',
      location: 'Cape Town, South Africa'
    },
    {
      id: 5,
      action: 'Login',
      description: 'Successful login to account',
      timestamp: '2025-05-25T09:12:45Z',
      ipAddress: '196.25.XX.XX',
      location: 'Cape Town, South Africa'
    },
    {
      id: 6,
      action: 'Notification Settings',
      description: 'Updated notification preferences',
      timestamp: '2025-05-24T17:05:11Z',
      ipAddress: '196.25.XX.XX',
      location: 'Cape Town, South Africa'
    },
    {
      id: 7,
      action: 'Comment',
      description: 'Added comment to incident #FW-2025-0539',
      timestamp: '2025-05-23T13:27:08Z',
      ipAddress: '196.25.XX.XX',
      location: 'Cape Town, South Africa'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const filteredLogs = activityLogs.filter(log => {
    if (filter === 'all') return true;
    return log.action.toLowerCase() === filter.toLowerCase();
  });

  const paginatedLogs = filteredLogs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const handleLoadMore = async () => {
    setIsLoading(true);
    
    // In a real app, this would fetch more logs from an API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate loading more data
    const newLogs: ActivityLogEntry[] = [
      {
        id: 8,
        action: 'Login',
        description: 'Successful login to account',
        timestamp: '2025-05-22T08:45:12Z',
        ipAddress: '196.25.XX.XX',
        location: 'Cape Town, South Africa'
      },
      {
        id: 9,
        action: 'Incident Update',
        description: 'Updated status of incident #FW-2025-0531',
        timestamp: '2025-05-21T14:22:05Z',
        ipAddress: '196.25.XX.XX',
        location: 'Cape Town, South Africa'
      },
      {
        id: 10,
        action: 'Login',
        description: 'Successful login to account',
        timestamp: '2025-05-20T09:15:30Z',
        ipAddress: '196.25.XX.XX',
        location: 'Cape Town, South Africa'
      }
    ];
    
    setActivityLogs(prev => [...prev, ...newLogs]);
    setIsLoading(false);
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

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return (
          <div className="p-2 rounded-full bg-blue-100 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
        );
      case 'logout':
        return (
          <div className="p-2 rounded-full bg-gray-100 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
        );
      case 'profile update':
        return (
          <div className="p-2 rounded-full bg-green-100 text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      case 'password change':
        return (
          <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
        );
      case 'incident report':
      case 'incident update':
        return (
          <div className="p-2 rounded-full bg-red-100 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'notification settings':
        return (
          <div className="p-2 rounded-full bg-purple-100 text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        );
      case 'comment':
        return (
          <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-full bg-gray-100 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-slate-900">Activity Log</h3>
          <p className="text-xs text-slate-500">Member since {userJoinDate}</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Activities</option>
            <option value="login">Logins</option>
            <option value="profile update">Profile Updates</option>
            <option value="password change">Password Changes</option>
            <option value="incident report">Incident Reports</option>
            <option value="incident update">Incident Updates</option>
            <option value="notification settings">Notification Settings</option>
            <option value="comment">Comments</option>
          </select>
          
          <button
            onClick={() => {
              setActivityLogs([]);
              setIsLoading(true);
              
              // In a real app, this would refresh data from an API
              setTimeout(() => {
                setActivityLogs([
                  {
                    id: 1,
                    action: 'Login',
                    description: 'Successful login to account',
                    timestamp: '2025-05-30T08:45:12Z',
                    ipAddress: '196.25.XX.XX',
                    location: 'Cape Town, South Africa'
                  },
                  {
                    id: 2,
                    action: 'Profile Update',
                    description: 'Updated personal information',
                    timestamp: '2025-05-29T16:22:05Z',
                    ipAddress: '196.25.XX.XX',
                    location: 'Paarl, South Africa'
                  },
                  {
                    id: 3,
                    action: 'Password Change',
                    description: 'Changed account password',
                    timestamp: '2025-05-27T11:15:30Z',
                    ipAddress: '196.25.XX.XX',
                    location: 'Cape Town, South Africa'
                  },
                  {
                    id: 4,
                    action: 'Incident Report',
                    description: 'Created new incident report #FW-2025-0542',
                    timestamp: '2025-05-26T14:33:22Z',
                    ipAddress: '196.25.XX.XX',
                    location: 'Cape Town, South Africa'
                  },
                  {
                    id: 5,
                    action: 'Login',
                    description: 'Successful login to account',
                    timestamp: '2025-05-25T09:12:45Z',
                    ipAddress: '196.25.XX.XX',
                    location: 'Cape Town, South Africa'
                  },
                  {
                    id: 6,
                    action: 'Notification Settings',
                    description: 'Updated notification preferences',
                    timestamp: '2025-05-24T17:05:11Z',
                    ipAddress: '196.25.XX.XX',
                    location: 'Cape Town, South Africa'
                  },
                  {
                    id: 7,
                    action: 'Comment',
                    description: 'Added comment to incident #FW-2025-0539',
                    timestamp: '2025-05-23T13:27:08Z',
                    ipAddress: '196.25.XX.XX',
                    location: 'Cape Town, South Africa'
                  }
                ]);
                setIsLoading(false);
              }, 1000);
            }}
            className="px-3 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin h-8 w-8 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : activityLogs.length === 0 ? (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-slate-900">No activity found for {userFullName}</h3>
          <p className="mt-1 text-sm text-slate-500">No activity logs match your current filter.</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {paginatedLogs.map((log) => (
              <div key={log.id} className="flex space-x-4">
                <div className="flex-shrink-0">
                  {getActionIcon(log.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">{log.action}</h4>
                      <p className="text-sm text-slate-600">{log.description}</p>
                    </div>
                    <span className="text-xs text-slate-500 whitespace-nowrap">{formatDate(log.timestamp)}</span>
                  </div>
                  <div className="mt-1 flex items-center text-xs text-slate-500">
                    <span>{log.ipAddress}</span>
                    <span className="mx-1">•</span>
                    <span>{log.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-slate-500">
              Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} activities
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`px-3 py-1 rounded-md text-sm ${
                  page === 1 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className={`px-3 py-1 rounded-md text-sm ${
                  page === totalPages 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Next
              </button>
            </div>
          </div>
          
          {activityLogs.length < 10 && (
            <div className="mt-6 text-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className={`px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : 'Load More Activity'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ActivityTab;
