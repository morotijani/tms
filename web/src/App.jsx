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





function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterApplicant />} />
          <Route path="/applicant/*" element={<ApplicantDashboard />} />
          <Route path="/student/*" element={<StudentDashboard />} />
          <Route path="/staff/*" element={<StaffDashboard />} />
          <Route path="/accountant/*" element={<AccountantDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />





          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
