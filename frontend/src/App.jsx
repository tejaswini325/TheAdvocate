import React from 'react'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import { Toaster } from 'react-hot-toast'; 
import { AuthProvider } from './context/AuthContext'; 
import ProtectedRoute from './components/common/ProtectedRoute'; 
import Layout from './components/layout/Layout'; 
import Login from './pages/auth/Login'; 
import Register from './pages/auth/Register'; 
import Dashboard from './pages/dashboard/Dashboard'; 
import Clients from './pages/clients/Clients'; 
import Cases from './pages/cases/Cases'; 
import Tasks from './pages/tasks/Tasks'; 
import Documents from './pages/documents/Documents'; 
 
function App() { 
  return ( 
    <Router> 
      <AuthProvider> 
        <Toaster 
          position="top-right" 
          toastOptions={{ 
            duration: 4000, 
            style: { 
              background: '#363636', 
              color: '#fff', 
            }, 
          }} 
        /> 
        <Routes> 
          <Route path="/login" element={<Login />} /> 
          <Route path="/register" element={<Register />} /> 
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}> 
            <Route index element={<Navigate to="/dashboard" />} /> 
            <Route path="dashboard" element={<Dashboard />} /> 
            <Route path="clients" element={<Clients />} /> 
            <Route path="cases" element={<Cases />} /> 
            <Route path="tasks" element={<Tasks />} /> 
            <Route path="documents" element={<Documents />} /> 
          </Route> 
        </Routes> 
      </AuthProvider> 
    </Router> 
  ); 
} 
 
export default App; 
