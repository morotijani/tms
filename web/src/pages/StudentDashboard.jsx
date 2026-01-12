import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    Layout, BookOpen, CreditCard, GraduationCap,
    LogOut, User as UserIcon, Bell, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CourseRegistration from '../components/CourseRegistration';
import Financials from '../components/Financials';
import AcademicResults from '../components/AcademicResults';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/student/dashboard');
                setStudentData(data);
            } catch (err) {
                console.error("Error fetching student data");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const navItems = [
        { id: 'overview', label: 'Overview', icon: <Layout size={20} /> },
        { id: 'registration', label: 'Course Registration', icon: <BookOpen size={20} /> },
        { id: 'financials', label: 'Fees & Payments', icon: <CreditCard size={20} /> },
        { id: 'results', label: 'Academic Results', icon: <GraduationCap size={20} /> },
    ];

    return (
        <div className="bg-slate-950 min-h-screen text-slate-50 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 p-6 flex flex-col gap-10 bg-slate-950/50 backdrop-blur-xl sticky top-0 h-screen">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl">U</div>
                    <span className="text-2xl font-bold font-heading">GUMS</span>
                </div>

                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                                }`}
                        >
                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-6 p-2">
                        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                            <UserIcon size={20} className="text-slate-400" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 p-3 w-full text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold font-heading">
                            {activeTab === 'overview' && 'Student Overview'}
                            {activeTab === 'registration' && 'Course Registration'}
                            {activeTab === 'financials' && 'Financial Statement'}
                            {activeTab === 'results' && 'My Grades'}
                        </h1>
                        <p className="text-slate-400 mt-1">Academic Year: 2025/2026 | Semester 1</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="w-12 h-12 glass-card flex items-center justify-center text-slate-400 hover:text-white transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full"></span>
                        </button>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="glass-card p-6 border-l-4 border-blue-500">
                                    <p className="text-slate-400 text-sm font-medium mb-1">Current GPA</p>
                                    <h3 className="text-3xl font-bold">3.85</h3>
                                    <div className="mt-4 flex items-center text-xs text-green-500">
                                        <ChevronRight size={12} /> View transcript
                                    </div>
                                </div>
                                <div className="glass-card p-6 border-l-4 border-indigo-500">
                                    <p className="text-slate-400 text-sm font-medium mb-1">Registered Credits</p>
                                    <h3 className="text-3xl font-bold">18</h3>
                                    <div className="mt-4 flex items-center text-xs text-slate-500">
                                        Max: 21 credits
                                    </div>
                                </div>
                                <div className="glass-card p-6 border-l-4 border-emerald-500">
                                    <p className="text-slate-400 text-sm font-medium mb-1">Fee Balance</p>
                                    <h3 className="text-3xl font-bold">GHS 0.00</h3>
                                    <div className="mt-4 flex items-center text-xs text-emerald-500 font-bold">
                                        ✓ All clear
                                    </div>
                                </div>
                            </div>

                            {/* Recent Courses */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="glass-card p-6">
                                    <h4 className="font-bold mb-6 flex items-center justify-between">
                                        Current Semester Courses
                                        <button onClick={() => setActiveTab('registration')} className="text-xs text-blue-500 hover:underline">Manage All</button>
                                    </h4>
                                    <div className="space-y-4">
                                        {studentData?.Enrollments?.length > 0 ? (
                                            studentData.Enrollments.map((en, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded-lg text-xs font-bold font-heading">{en.Course.code}</div>
                                                        <div>
                                                            <p className="text-sm font-bold">{en.Course.name}</p>
                                                            <p className="text-xs text-slate-500">Credits: {en.Course.creditHours}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs px-2 py-1 bg-blue-500/10 text-blue-500 rounded-full font-bold uppercase">Active</div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-10">
                                                <p className="text-slate-500 italic">No courses registered yet.</p>
                                                <button onClick={() => setActiveTab('registration')} className="btn btn-primary mt-4 py-2 px-6 text-sm">Register Now</button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="glass-card p-6">
                                    <h4 className="font-bold mb-6">Upcoming Deadlines</h4>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 flex gap-4">
                                            <div className="w-12 h-12 bg-accent/10 text-accent flex flex-col items-center justify-center rounded-xl">
                                                <span className="text-xs font-bold">JAN</span>
                                                <span className="text-lg font-bold">20</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-200">Registration Ends</p>
                                                <p className="text-xs text-slate-500">Late registration attracts a penalty fee.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'registration' && <CourseRegistration studentData={studentData} setStudentData={setStudentData} />}
                    {activeTab === 'financials' && <Financials />}
                    {activeTab === 'results' && <AcademicResults />}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default StudentDashboard;
