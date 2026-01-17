import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    Layout, BookOpen, CreditCard, GraduationCap,
    LogOut, User as UserIcon, Bell, ChevronRight, Menu, X
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import { useSettings } from '../context/SettingsContext';


import CourseRegistration from '../components/CourseRegistration';
import Financials from '../components/Financials';
import AcademicResults from '../components/AcademicResults';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const { settings } = useSettings();

    const [activeTab, setActiveTab] = useState('overview');
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


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
        <div className="bg-background min-h-screen text-text flex font-sans transition-colors duration-300">
            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 bg-surface/80 backdrop-blur-lg border-b border-border z-40 p-4 flex justify-between items-center transition-colors duration-300">
                <div className="flex items-center gap-2">
                    {settings.schoolLogo ? (
                        <img src={`http://localhost:5000${settings.schoolLogo}`} alt="Logo" className="w-8 h-8 object-contain" />
                    ) : (
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white">
                            {settings.schoolAbbreviation?.charAt(0) || 'S'}
                        </div>
                    )}
                    <span className="font-bold font-heading">{settings.schoolAbbreviation || 'GUMS'}</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 hover:bg-surface rounded-lg transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 border-r border-border p-6 flex flex-col gap-10 bg-surface/90 backdrop-blur-xl 
                transition-transform duration-300 transform md:relative md:translate-x-0 md:h-screen md:sticky md:top-0
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}

            `}>

                <div className="flex items-center gap-3">
                    {settings.schoolLogo ? (
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-border bg-white flex items-center justify-center p-1">
                            <img src={`http://localhost:5000${settings.schoolLogo}`} alt="School Logo" className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-primary/20">
                            {settings.schoolAbbreviation?.charAt(0) || 'S'}
                        </div>
                    )}
                    <span className="text-2xl font-bold font-heading text-text">
                        {settings.schoolAbbreviation || 'GUMS'}
                    </span>
                </div>



                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setIsMobileMenuOpen(false);
                            }}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-text/60 hover:bg-surface hover:text-text'

                                }`}
                        >


                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto space-y-4">
                    <div className="flex items-center gap-3 mb-2 p-2 bg-surface/50 border border-border rounded-xl">
                        <div className="w-10 h-10 bg-surface-hover rounded-full flex items-center justify-center border border-border">
                            <UserIcon size={20} className="text-text-muted" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate text-text">{user?.firstName} {user?.lastName}</p>
                            <p className="text-[10px] text-text-muted truncate uppercase tracking-widest font-bold">Student Account</p>
                        </div>
                    </div>

                    <ThemeToggle />

                    <button
                        onClick={logout}
                        className="flex items-center gap-3 p-3 w-full text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-medium border border-transparent hover:border-red-500/20"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>

            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 transition-all duration-300">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">

                    <div>
                        <h1 className="text-3xl font-bold font-heading text-text">
                            {activeTab === 'overview' && 'Student Overview'}
                            {activeTab === 'registration' && 'Course Registration'}
                            {activeTab === 'financials' && 'Financial Statement'}
                            {activeTab === 'results' && 'My Grades'}
                        </h1>
                        <p className="text-text-muted mt-1 px-3 py-1 bg-surface border border-border rounded-full inline-block text-[10px] font-bold uppercase tracking-widest">Academic Year: 2025/2026 | Semester 1</p>
                    </div>

                    <div className="flex gap-4">
                        <button className="w-12 h-12 glass-card flex items-center justify-center text-text-muted hover:text-text transition-colors relative border-border hover:border-primary/50">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full ring-2 ring-background"></span>
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
                                        <button onClick={() => setActiveTab('registration')} className="text-xs text-primary hover:underline">Manage All</button>
                                    </h4>
                                    <div className="space-y-4">
                                        {studentData?.Enrollments?.length > 0 ? (
                                            studentData.Enrollments.map((en, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 bg-surface/50 rounded-xl border border-border">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-surface-hover flex items-center justify-center rounded-lg text-xs font-bold font-heading">{en.Course.code}</div>
                                                        <div>
                                                            <p className="text-sm font-bold">{en.Course.name}</p>
                                                            <p className="text-xs text-text-muted">Credits: {en.Course.creditHours}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-bold uppercase">Active</div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-10">
                                                <p className="text-text-muted italic">No courses registered yet.</p>
                                                <button onClick={() => setActiveTab('registration')} className="btn btn-primary mt-4 py-2 px-6 text-sm">Register Now</button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="glass-card p-6">
                                    <h4 className="font-bold mb-6">Upcoming Deadlines</h4>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-surface/50 rounded-xl border border-border flex gap-4">
                                            <div className="w-12 h-12 bg-accent/10 text-accent flex flex-col items-center justify-center rounded-xl">
                                                <span className="text-xs font-bold">JAN</span>
                                                <span className="text-lg font-bold">20</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-text">Registration Ends</p>
                                                <p className="text-xs text-text-muted">Late registration attracts a penalty fee.</p>
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
