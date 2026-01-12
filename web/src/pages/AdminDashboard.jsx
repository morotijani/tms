import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    Users, FileUser, Layers, Settings, LogOut,
    Check, X, Search, Plus, MapPin, Building2,
    BookOpen, ShieldCheck, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('admissions');
    const [applications, setApplications] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appRes, progRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/admin/applications'),
                    axios.get('http://localhost:5000/api/admission/programs')
                ]);
                setApplications(appRes.data);
                setPrograms(progRes.data);
            } catch (err) {
                console.error("Failed to fetch admin data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAdmit = async (id) => {
        try {
            await axios.post(`http://localhost:5000/api/admin/admission/admit/${id}`);
            setApplications(applications.map(app => app.id === id ? { ...app, status: 'Admitted' } : app));
        } catch (err) {
            alert("Error admitting student");
        }
    };

    const navItems = [
        { id: 'admissions', label: 'Admissions', icon: <FileUser size={20} /> },
        { id: 'curriculum', label: 'Curriculum', icon: <Layers size={20} /> },
        { id: 'users', label: 'User Management', icon: <Users size={20} /> },
        { id: 'gradings', label: 'Grading Schemes', icon: <ShieldCheck size={20} /> },
        { id: 'settings', label: 'System Settings', icon: <Settings size={20} /> },
    ];


    return (
        <div className="bg-slate-950 min-h-screen text-slate-50 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 p-6 flex flex-col gap-10 bg-slate-950/50 backdrop-blur-xl sticky top-0 h-screen">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-xl text-slate-950">A</div>
                    <span className="text-2xl font-bold font-heading tracking-tighter">GUMS<span className="text-blue-500">.</span></span>
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
                    <button onClick={logout} className="flex items-center gap-3 p-3 w-full text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-medium">
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold font-heading capitalize">{activeTab} Management</h1>
                        <p className="text-slate-400 mt-1 uppercase text-[10px] font-bold tracking-widest">Registrar Control Panel</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="glass-card flex items-center gap-3 px-4 py-2 border-slate-800">
                            <Search size={18} className="text-slate-500" />
                            <input className="bg-transparent outline-none text-sm w-48" placeholder="Search entries..." />
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'admissions' && (
                        <motion.div
                            key="admissions"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card overflow-hidden"
                        >
                            <table className="w-full text-left">
                                <thead className="bg-slate-900/50 border-b border-slate-800">
                                    <tr>
                                        <th className="p-4 font-bold text-xs uppercase text-slate-500">Applicant</th>
                                        <th className="p-4 font-bold text-xs uppercase text-slate-500">Program Choice</th>
                                        <th className="p-4 font-bold text-xs uppercase text-slate-500">Location (GPS)</th>
                                        <th className="p-4 font-bold text-xs uppercase text-slate-500">Status</th>
                                        <th className="p-4 font-bold text-xs uppercase text-slate-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {applications.map((app) => (
                                        <tr key={app.id} className="hover:bg-slate-900/30 transition-colors">
                                            <td className="p-4">
                                                <p className="text-sm font-bold uppercase">{app.User?.firstName} {app.User?.lastName}</p>
                                                <p className="text-[10px] text-slate-500 font-mono">{app.User?.email}</p>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="p-1 px-2 bg-blue-500/10 text-blue-500 rounded text-[10px] font-bold">{app.firstChoice?.code || 'N/A'}</span>
                                                    <span className="text-xs text-slate-400 truncate max-w-[150px]">{app.firstChoice?.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                                                    <MapPin size={12} /> {app.User?.ghanaPostGps || 'NOT-SET'}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${app.status === 'Admitted' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="p-4 flex gap-2">
                                                {app.status !== 'Admitted' && (
                                                    <button onClick={() => handleAdmit(app.id)} className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-all" title="Admit"><Check size={16} /></button>
                                                )}
                                                <button className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all"><X size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    )}

                    {activeTab === 'curriculum' && (
                        <motion.div
                            key="curriculum"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            <div className="glass-card p-6 border-dashed border-2 border-slate-800 flex flex-col items-center justify-center text-slate-600 hover:text-blue-500 hover:border-blue-500 transition-all cursor-pointer">
                                <Plus size={40} className="mb-2" />
                                <span className="font-bold uppercase tracking-widest text-xs">Add New Program</span>
                            </div>
                            {programs.map((prog) => (
                                <div key={prog.id} className="glass-card p-6 hover:border-blue-500/30 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <Building2 size={24} />
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-1 bg-slate-800 rounded uppercase">{prog.level}</span>
                                    </div>
                                    <h4 className="font-bold text-lg mb-1 uppercase tracking-tight">{prog.name}</h4>
                                    <p className="text-xs text-slate-500 font-bold mb-4">{prog.faculty} / {prog.department}</p>
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400"><BookOpen size={12} /> {prog.duration} Yrs</div>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400"><Plus size={12} /> {prog.code}</div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'users' && (
                        <motion.div
                            key="users"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-4"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold uppercase tracking-widest text-slate-500">System Users</h3>
                                <button className="btn btn-primary text-xs py-2 px-4 flex items-center gap-2 font-bold"><ShieldCheck size={14} /> Add Staff</button>
                            </div>
                            {/* Simplified list for now */}
                            <div className="glass-card p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold">JD</div>
                                    <div>
                                        <p className="font-bold">John Doe</p>
                                        <p className="text-xs text-slate-500">Staff | Registrar Dept</p>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-slate-800 rounded-lg"><ChevronRight size={18} /></button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'gradings' && (
                        <motion.div
                            key="gradings"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold uppercase tracking-widest text-slate-500">Grading Configurations</h3>
                                <button className="btn btn-primary text-xs py-2 px-6 flex items-center gap-2 font-bold"><Plus size={14} /> Define Grade</button>
                            </div>

                            <div className="glass-card p-8 bg-blue-600/5 border-blue-500/20 mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-600 rounded-xl"><ShieldCheck size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-lg">System-wide Grading Logic</h4>
                                        <p className="text-sm text-slate-400 max-w-2xl">Manage how student results are calculated across various faculties. You can set minimum scores for grades like A, B+, etc., which the staff portal will use automatically.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { grade: 'A', score: '80 - 100', point: '4.0', color: 'indigo' },
                                    { grade: 'B+', score: '75 - 79', point: '3.5', color: 'blue' },
                                    { grade: 'B', score: '70 - 74', point: '3.0', color: 'emerald' },
                                    { grade: 'C+', score: '65 - 69', point: '2.5', color: 'amber' }
                                ].map((g, i) => (
                                    <div key={i} className="glass-card p-6 border-slate-800 hover:border-slate-700 transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`w-10 h-10 rounded-xl bg-blue-600/20 text-blue-500 flex items-center justify-center font-bold text-xl`}>{g.grade}</span>
                                            <Settings size={14} className="text-slate-700 cursor-pointer" />
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">Min Score</p>
                                        <p className="font-bold text-slate-200 mb-2">{g.score}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">Grade Point</p>
                                        <p className="text-lg font-bold text-slate-200">{g.point}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center mt-12">
                                <button className="flex items-center gap-2 text-slate-500 hover:text-white text-xs font-bold uppercase transition-colors">
                                    <Plus size={12} /> Add more grade levels
                                </button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>
        </div>
    );
};

export default AdminDashboard;
