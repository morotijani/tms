import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';

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
    <ThemeProvider>
      <SettingsProvider>
        <Router>
          <div className="min-h-screen bg-background text-text transition-colors duration-300">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterApplicant />} />
              <Route path="/purchase-voucher" element={<PurchaseVoucher />} />
              <Route path="/verify-payment" element={<VerifyPayment />} />


              <Route path="/applicant/*" element={<ProtectedRoute allowedRoles={['applicant', 'student']}><ApplicantDashboard /></ProtectedRoute>} />
              <Route path="/registrar/*" element={<ProtectedRoute allowedRoles={['registrar', 'admin']}><RegistrarDashboard /></ProtectedRoute>} />
              <Route path="/student/*" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />

              <Route path="/staff/*" element={<ProtectedRoute allowedRoles={['staff', 'admin']}><StaffDashboard /></ProtectedRoute>} />
              <Route path="/accountant/*" element={<ProtectedRoute allowedRoles={['accountant', 'admin']}><AccountantDashboard /></ProtectedRoute>} />
              <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />






              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </SettingsProvider>
    </ThemeProvider>
  );

}

export default App;
