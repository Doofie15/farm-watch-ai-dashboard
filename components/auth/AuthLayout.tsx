import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

interface AuthLayoutProps {
  children: React.ReactNode;
  userTypeOptions: { value: string; label: string }[];
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, userTypeOptions }) => {
  const { isAuthenticated, isLoading, login, register } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoginError(null);
      await login(email, password);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Failed to login');
    }
  };

  const handleRegister = async (userData: any) => {
    try {
      setRegisterError(null);
      await register(userData);
    } catch (err) {
      setRegisterError(err instanceof Error ? err.message : 'Failed to register');
    }
  };

  const navigateToRegister = () => {
    setAuthMode('register');
    setLoginError(null);
  };

  const navigateToLogin = () => {
    setAuthMode('login');
    setRegisterError(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-100">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-emerald-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authMode === 'login' ? (
      <LoginPage 
        onLogin={handleLogin} 
        onNavigateToRegister={navigateToRegister} 
        loginError={loginError} 
      />
    ) : (
      <RegisterPage 
        onRegister={handleRegister} 
        onNavigateToLogin={navigateToLogin} 
        registerError={registerError}
        userTypeOptions={userTypeOptions}
      />
    );
  }

  return <>{children}</>;
};

export default AuthLayout;
