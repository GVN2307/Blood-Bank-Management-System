import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedTypes = [] }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(user.type)) {
        // Redirect to their own dashboard if they are logged in but trying to access another node
        const dashboardMap = {
            'admin': '/admin-dashboard',
            'hospital': '/hospital-dashboard',
            'bloodbank': '/bloodbank-dashboard',
            'user': '/user-dashboard'
        };
        return <Navigate to={dashboardMap[user.type] || '/'} replace />;
    }

    return children;
};

export default ProtectedRoute;
