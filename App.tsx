
import React, { useState, createContext, useContext, ReactNode } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import CustomerProfileScreen from './screens/CustomerProfileScreen';
import { mockCustomers, Customer } from './data/mockData';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  const value = { isAuthenticated, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Fix: Changed `JSX.Element` to `ReactNode` to resolve JSX namespace error.
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return children;
};


const App: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);

  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
                <DashboardScreen customers={customers} setCustomers={setCustomers} />
            </ProtectedRoute>
          } />
          <Route path="/customer/:customerId" element={
             <ProtectedRoute>
                <CustomerProfileScreen customers={customers} setCustomers={setCustomers} />
            </ProtectedRoute>
          } />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;