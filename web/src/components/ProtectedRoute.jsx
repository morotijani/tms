import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Redirect to their appropriate dashboard if unauthorized
        if (user.role === 'student') return <Navigate to="/student" replace />;
        if (user.role === 'applicant') return <Navigate to="/applicant" replace />;
        if (user.role === 'registrar') return <Navigate to="/registrar" replace />;
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        if (user.role === 'staff') return <Navigate to="/staff" replace />;
        if (user.role === 'accountant') return <Navigate to="/accountant" replace />;
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
