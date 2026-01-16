import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterApplicant from './pages/RegisterApplicant';
import ApplicantDashboard from './pages/ApplicantDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AccountantDashboard from './pages/AccountantDashboard';
import RegistrarDashboard from './pages/RegistrarDashboard';
import PurchaseVoucher from './pages/PurchaseVoucher';
import VerifyPayment from './pages/VerifyPayment';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterApplicant />} />
          <Route path="/purchase-voucher" element={<PurchaseVoucher />} />
          <Route path="/verify-payment" element={<VerifyPayment />} />


          <Route path="/applicant/*" element={<ProtectedRoute><ApplicantDashboard /></ProtectedRoute>} />
          <Route path="/registrar/*" element={<ProtectedRoute><RegistrarDashboard /></ProtectedRoute>} />
          <Route path="/student/*" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />

          <Route path="/staff/*" element={<ProtectedRoute><StaffDashboard /></ProtectedRoute>} />
          <Route path="/accountant/*" element={<ProtectedRoute><AccountantDashboard /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />






          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
