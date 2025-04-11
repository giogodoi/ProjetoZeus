import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';
import { useAuth } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import MemberList from './pages/MemberList';
import MemberForm from './pages/MemberForm';
import BudgetList from './pages/BudgetList';
import BudgetForm from './pages/BudgetForm';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user?.role === 'admin' ? children : <Navigate to="/" />;
};

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Box sx={{ height: '100vh' }}>
        <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Protected routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/members" element={<AdminRoute><MemberList /></AdminRoute>} />
          <Route path="/members/new" element={<AdminRoute><MemberForm /></AdminRoute>} />
          <Route path="/members/:id" element={<AdminRoute><MemberForm /></AdminRoute>} />
          <Route path="/budgets" element={<AdminRoute><BudgetList /></AdminRoute>} />
          <Route path="/budgets/new" element={<AdminRoute><BudgetForm /></AdminRoute>} />
          <Route path="/budgets/:id" element={<AdminRoute><BudgetForm /></AdminRoute>} />
        </Route>
        </Routes>
      </Box>
    </LocalizationProvider>
  );
}

export default App;
