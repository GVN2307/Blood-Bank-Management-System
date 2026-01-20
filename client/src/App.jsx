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

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
                <Route path="/bloodbank-dashboard" element={<BloodBankDashboard />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/community" element={<Community />} />
                <Route path="/test-schedule" element={<TestSchedule />} />
                <Route path="/user-reports" element={<UserReports />} />
            </Routes>
        </Router>
    );
}

export default App;
