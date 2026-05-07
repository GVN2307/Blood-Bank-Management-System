import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import HospitalDashboard from './pages/HospitalDashboard';
import BloodBankDashboard from './pages/BloodBankDashboard';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Community from './pages/Community';
import TestSchedule from './pages/TestSchedule';
import UserReports from './pages/UserReports';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/hospital-dashboard" element={
                    <ProtectedRoute allowedTypes={['hospital']}>
                        <HospitalDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/bloodbank-dashboard" element={
                    <ProtectedRoute allowedTypes={['bloodbank']}>
                        <BloodBankDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/user-dashboard" element={
                    <ProtectedRoute allowedTypes={['user']}>
                        <UserDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/admin-dashboard" element={
                    <ProtectedRoute allowedTypes={['admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/community" element={
                    <ProtectedRoute>
                        <Community />
                    </ProtectedRoute>
                } />
                <Route path="/test-schedule" element={
                    <ProtectedRoute allowedTypes={['user']}>
                        <TestSchedule />
                    </ProtectedRoute>
                } />
                <Route path="/user-reports" element={
                    <ProtectedRoute allowedTypes={['user']}>
                        <UserReports />
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;
