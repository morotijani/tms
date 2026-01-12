import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    Layout, BookOpen, Users, ClipboardCheck,
    LogOut, User as UserIcon, Bell, ChevronRight,
    PlusCircle, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GradeEntry from '../components/GradeEntry';

const StaffDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('courses');
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(true);


    const refreshData = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/staff/my-courses');
            setCourses(data);
            if (selectedCourse) {
                setSelectedCourse(data.find(c => c.id === selectedCourse.id));
            }
        } catch (err) {
            console.error("Error fetching staff data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);


    const navItems = [
        { id: 'courses', label: 'My Courses', icon: <BookOpen size={20} /> },
        { id: 'students', label: 'Student Management', icon: <Users size={20} /> },
        { id: 'attendance', label: 'Attendance', icon: <ClipboardCheck size={20} /> },
        { id: 'resources', label: 'Upload Materials', icon: <PlusCircle size={20} /> },
    ];

    return (
        <div className="bg-slate-950 min-h-screen text-slate-50 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 p-6 flex flex-col gap-10 bg-slate-950/50 backdrop-blur-xl sticky top-0 h-screen">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl uppercase italic">S</div>
                    <span className="text-2xl font-bold font-heading">GUMS</span>
                </div>

                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
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
                            <p className="text-xs text-slate-500 truncate">Staff ID: 00{user?.id}</p>
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
                        <h1 className="text-3xl font-bold font-heading capitalize">
                            {activeTab.replace('-', ' ')}
                        </h1>
                        <p className="text-slate-400 mt-1">Lecurer Dashboard | {new Date().toDateString()}</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="w-12 h-12 glass-card flex items-center justify-center text-slate-400 hover:text-white transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-indigo-500 rounded-full"></span>
                        </button>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'courses' && !selectedCourse && (
                        <motion.div
                            key="courses"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {courses.length > 0 ? courses.map((course) => (
                                <div key={course.id} className="glass-card hover:border-indigo-500/50 transition-all duration-300 group overflow-hidden">
                                    <div className="h-2 bg-indigo-600/50"></div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] font-bold text-indigo-400">{course.code}</span>
                                        </div>
                                        <h3 className="font-bold text-lg mb-2 group-hover:text-indigo-400 transition-colors uppercase">{course.name}</h3>
                                        <p className="text-xs text-slate-500 mb-6 flex items-center gap-2 font-bold"><Users size={12} /> {course.Enrollments?.length || 0} Students Enrolled</p>

                                        <button
                                            onClick={() => setSelectedCourse(course)}
                                            className="w-full btn bg-indigo-600 hover:bg-indigo-500 text-xs py-3 rounded-xl flex items-center justify-center gap-2 font-bold"
                                        >
                                            Manage Course <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full py-20 text-center">
                                    <BookOpen size={64} className="mx-auto text-slate-800 mb-4" />
                                    <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest font-heading">No courses assigned yet</h3>
                                    <p className="text-slate-500">Contact the Registrar if this is an error.</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'courses' && selectedCourse && (
                        <motion.div
                            key="grading"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <button
                                onClick={() => setSelectedCourse(null)}
                                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase mb-6"
                            >
                                ← Back to Courses
                            </button>

                            <div className="glass-card p-8 bg-indigo-600/10 border-indigo-500/30">
                                <h2 className="text-2xl font-bold mb-2 uppercase tracking-tight">{selectedCourse.name}</h2>
                                <p className="text-slate-400 text-sm font-medium">Batch: 2025/2026 | Enrolled Students: {selectedCourse.Enrollments.length}</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-heading font-bold text-xl uppercase tracking-widest text-slate-500 mb-6">Student Grade List</h3>
                                {selectedCourse.Enrollments.map((en) => (
                                    <div key={en.id} className="glass-card p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-slate-800 hover:border-slate-700">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center font-bold text-indigo-500 font-heading">
                                                {en.User.firstName[0]}{en.User.lastName[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-200 uppercase">{en.User.firstName} {en.User.lastName}</p>
                                                <p className="text-xs text-slate-500 font-bold">STU-00{en.userId}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8">
                                            <div className="text-center">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Total</p>
                                                <p className="text-xl font-bold text-indigo-400">{en.totalScore || '--'}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Grade</p>
                                                <p className={`text-xl font-bold ${en.grade === 'F' ? 'text-red-500' : 'text-green-500'}`}>{en.grade || '--'}</p>
                                            </div>
                                            <div className="w-px h-8 bg-slate-800"></div>
                                            <GradeEntry enrollment={en} onUpdate={refreshData} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Add more tabs components here if needed */}
                    {activeTab !== 'courses' && (
                        <div className="flex flex-col items-center justify-center py-40 opacity-20">
                            <Layout size={80} />
                            <p className="text-xl font-bold mt-4">Feature under development</p>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default StaffDashboard;
