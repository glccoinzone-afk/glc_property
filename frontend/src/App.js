import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';

import HomePage from './pages/HomePage';
import PropertyListing from './pages/PropertyListing';
import PropertyDetail from './pages/PropertyDetail';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ComparePage from './pages/ComparePage';
import EMICalculator from './pages/EMICalculator';
import BuildersPage from './pages/BuildersPage';
import MapSearchPage from './pages/MapSearchPage';
import UserDashboard from './pages/dashboards/UserDashboard';
import AgentDashboard from './pages/dashboards/AgentDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import PostProperty from './pages/PostProperty';

function App() {
  return (
    <AuthProvider>
      <CompareProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/properties" element={<PropertyListing />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/map-search" element={<MapSearchPage />} />
            <Route path="/builders" element={<BuildersPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/emi-calculator" element={<EMICalculator />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/post-property" element={<PostProperty />} />
            <Route path="/dashboard/user" element={<UserDashboard />} />
            <Route path="/dashboard/agent" element={<AgentDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Routes>
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </CompareProvider>
    </AuthProvider>
  );
}

export default App;
