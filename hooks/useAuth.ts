import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { UserType } from '../types';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userType: string;
  farmName?: string;
  isAgriculturalUnionMember: string;
  dateRegistered: string;
  
  // Farm details
  farmSize?: string;
  farmType?: string;
  farmAddress?: string;
  farmCity?: string;
  farmProvince?: string;
  farmPostalCode?: string;
  farmLatitude?: string;
  farmLongitude?: string;
  unionMembershipNumber?: string;
  unionMemberSince?: string;
  primaryCrops?: string;
  primaryLivestock?: string;
  employeeCount?: string;
  securityInfrastructure?: string[];
  
  // Additional user details
  bio?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id' | 'dateRegistered'>) => Promise<void>;
  logout: () => void;
}

// Create a mock user database for demo purposes
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@farmwatch.co.za',
    firstName: 'Admin',
    lastName: 'User',
    phoneNumber: '+27821234567',
    userType: UserType.ADMIN,
    isAgriculturalUnionMember: 'Yes',
    farmName: 'AGRI Western Cape',
    dateRegistered: '2024-12-01T08:00:00Z'
  },
  {
    id: '2',
    email: 'security@farmwatch.co.za',
    firstName: 'Security',
    lastName: 'Officer',
    phoneNumber: '+27835551234',
    userType: UserType.SECURITY_OFFICER,
    isAgriculturalUnionMember: 'Yes',
    dateRegistered: '2025-01-15T10:30:00Z'
  }
];

// Create the auth context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Authentication provider component
export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would verify the token with your backend
        const storedUser = localStorage.getItem('farmwatch_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Failed to restore authentication', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Login function
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock database (in a real app, this would be an API call)
      const foundUser = MOCK_USERS.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        // In a real app, you would hash passwords and not store them in plain text
        // This is just for demo purposes
        password === 'password'
      );
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // Store user in local storage (in a real app, you'd store a JWT token)
      localStorage.setItem('farmwatch_user', JSON.stringify(foundUser));
      setUser(foundUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Register function
  const register = useCallback(async (userData: Omit<User, 'id' | 'dateRegistered'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if user already exists (in a real app, this would be an API call)
      const existingUser = MOCK_USERS.find(u => 
        u.email.toLowerCase() === userData.email.toLowerCase()
      );
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // Create new user (in a real app, this would be an API call)
      const newUser: User = {
        ...userData,
        id: `user_${Date.now()}`,
        dateRegistered: new Date().toISOString()
      };
      
      // Store user in local storage (in a real app, you'd store a JWT token)
      localStorage.setItem('farmwatch_user', JSON.stringify(newUser));
      setUser(newUser);
      
      // In a real app, you would add the user to your database here
      // MOCK_USERS.push(newUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('farmwatch_user');
    setUser(null);
  }, []);
  
  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout
  };
};

export default useAuth;
