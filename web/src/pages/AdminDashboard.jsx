import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
    Users, FileUser, Layers, Settings, LogOut,
    Check, X, Search, Plus, MapPin, Building2,
    BookOpen, ShieldCheck, ChevronRight, Menu
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import SettingsPortal from '../components/Settings';
import { useSettings } from '../context/SettingsContext';



const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const { settings } = useSettings();

    const [activeTab, setActiveTab] = useState('admissions');
    const [applications, setApplications] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [gradingSchemes, setGradingSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Modal state
    const [showGradingModal, setShowGradingModal] = useState(false);
    const [currentGrade, setCurrentGrade] = useState({ name: '', grade: '', minScore: '', maxScore: '', point: '', description: '' });
    const [isEditingGrade, setIsEditingGrade] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appRes, progRes, gradRes] = await Promise.all([
                    api.get('/admin/applications'),
                    api.get('/admin/programs'),
                    api.get('/admin/gradings')
                ]);
                setApplications(appRes.data);
                setPrograms(progRes.data);
                setGradingSchemes(gradRes.data);
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
            await api.post(`/admin/admission/admit/${id}`);
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

    const handleSaveGrade = async (e) => {
        e.preventDefault();
        try {
            if (isEditingGrade) {
                const { data } = await api.put(`/admin/gradings/${currentGrade.id}`, currentGrade);
                setGradingSchemes(gradingSchemes.map(g => g.id === currentGrade.id ? data : g));
            } else {
                const { data } = await api.post('/admin/gradings', currentGrade);
                setGradingSchemes([...gradingSchemes, data]);
            }
            setShowGradingModal(false);
            setCurrentGrade({ name: '', grade: '', minScore: '', maxScore: '', point: '', description: '' });
        } catch (err) {
            alert("Error saving grade");
        }
    };

    const handleDeleteGrade = async (id) => {
        if (!window.confirm("Are you sure you want to delete this grading configuration?")) return;
        try {
            await api.delete(`/admin/gradings/${id}`);
            setGradingSchemes(gradingSchemes.filter(g => g.id !== id));
        } catch (err) {
            alert("Error deleting grade");
        }
    };


    return (
        <div className="bg-background min-h-screen text-text flex font-sans transition-colors duration-300">


            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 bg-surface/80 backdrop-blur-lg border-b border-border z-40 p-4 flex justify-between items-center transition-colors duration-300">
                <div className="flex items-center gap-2">
                    {settings.schoolLogo ? (
                        <img src={`http://localhost:5000${settings.schoolLogo}`} alt="Logo" className="w-8 h-8 object-contain" />
                    ) : (
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white">
                            {settings.schoolAbbreviation?.charAt(0) || 'A'}
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
                transition-transform duration-300 transform md:translate-x-0
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>

                <div className="flex items-center gap-3">
                    {settings.schoolLogo ? (
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-border bg-white flex items-center justify-center p-1">
                            <img src={`http://localhost:5000${settings.schoolLogo}`} alt="School Logo" className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-primary/20">
                            {settings.schoolAbbreviation?.charAt(0) || 'A'}
                        </div>
                    )}
                    <span className="text-2xl font-bold font-heading tracking-tighter text-text">
                        {settings.schoolAbbreviation || 'GUMS'}<span className="text-primary">.</span>
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
                    <ThemeToggle />
                    <button onClick={logout} className="flex items-center gap-3 p-3 w-full text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-medium">
                        <LogOut size={20} /> Logout
                    </button>
                </div>

            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-10 pt-20 md:pt-10 md:ml-64 transition-all duration-300">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold font-heading capitalize text-text">{activeTab} Management</h1>
                        <p className="text-text-muted mt-1 uppercase text-[10px] font-bold tracking-widest px-2 py-0.5 bg-surface border border-border rounded-full inline-block">System Management</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="glass-card flex items-center gap-3 px-4 py-2 border-border bg-surface/50">
                            <Search size={18} className="text-text-muted" />
                            <input className="bg-transparent outline-none text-sm w-48 text-text" placeholder="Search entries..." />
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
                            <div className="overflow-x-auto">
                                <table className="w-full text-left min-w-[600px] md:min-w-full">

                                    <thead className="bg-surface border-b border-border">
                                        <tr>
                                            <th className="p-4 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Applicant</th>
                                            <th className="p-4 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Voucher</th>
                                            <th className="p-4 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Status</th>
                                            <th className="p-4 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {applications.map((app) => (
                                            <tr key={app.id} className="border-b border-border hover:bg-surface/50 transition-colors">
                                                <td className="p-4">
                                                    <p className="font-bold text-text">{app.User?.firstName} {app.User?.lastName}</p>
                                                    <p className="text-xs text-text-muted">{app.User?.email}</p>
                                                </td>
                                                <td className="p-4 font-mono text-xs text-text-muted">{app.voucherId || 'N/A'}</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${app.status === 'Admitted' ? 'bg-success/10 text-success border border-success/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                        }`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    {app.status !== 'Admitted' && (
                                                        <button
                                                            onClick={() => handleAdmit(app.id)}
                                                            className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-all"
                                                            title="Admit Student"
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>

                    )}

                    {activeTab === 'curriculum' && (
                        <motion.div
                            key="curriculum"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            <div className="glass-card p-6 border-dashed border-2 border-border flex flex-col items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-all cursor-pointer">
                                <Plus size={40} className="mb-2" />
                                <span className="font-bold uppercase tracking-widest text-xs">Add New Program</span>
                            </div>
                            {programs.map((prog) => (
                                <div key={prog.id} className="glass-card p-6 hover:border-primary/30 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            <Building2 size={24} />
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-1 bg-surface rounded uppercase">{prog.level}</span>
                                    </div>
                                    <h4 className="font-bold text-lg mb-1 uppercase tracking-tight">{prog.name}</h4>
                                    <p className="text-xs text-text-muted font-bold mb-4">{prog.faculty} / {prog.department}</p>
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-text-muted"><BookOpen size={12} /> {prog.duration} Yrs</div>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-text-muted"><Plus size={12} /> {prog.code}</div>
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
                                <h3 className="font-bold uppercase tracking-widest text-text-muted">System Users</h3>
                                <button className="btn btn-primary text-xs py-2 px-4 flex items-center gap-2 font-bold"><ShieldCheck size={14} /> Add Staff</button>
                            </div>
                            {/* Simplified list for now */}
                            <div className="glass-card p-20 text-center">
                                <Loader2 className="animate-spin text-primary mx-auto mb-4" />
                                <p className="text-text-muted uppercase font-bold text-xs tracking-widest">Fetching Admissions...</p>
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
                                <h3 className="font-bold uppercase tracking-widest text-text-muted">Grading Configurations</h3>
                                <button
                                    onClick={() => {
                                        setIsEditingGrade(false);
                                        setCurrentGrade({ name: '', grade: '', minScore: '', maxScore: '', point: '', description: '' });
                                        setShowGradingModal(true);
                                    }}
                                    className="btn btn-primary text-xs py-2 px-6 flex items-center gap-2 font-bold"
                                >
                                    <Plus size={14} /> Define Grade
                                </button>
                            </div>

                            <div className="glass-card p-8 bg-primary/5 border-primary/20 mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary rounded-xl text-white"><ShieldCheck size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-lg text-text">System-wide Grading Logic</h4>
                                        <p className="text-sm text-text-muted max-w-2xl">Manage how student results are calculated across various faculties. You can set minimum scores for grades like A, B+, etc., which the staff portal will use automatically.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Grouped Grading Schemes */}
                            {Object.entries(gradingSchemes.reduce((acc, g) => {
                                if (!acc[g.name]) acc[g.name] = [];
                                acc[g.name].push(g);
                                return acc;
                            }, {})).map(([schemeName, schemes]) => (
                                <div key={schemeName} className="space-y-4 mb-12 last:mb-0">
                                    <div className="flex items-center gap-4">
                                        <h4 className="font-bold uppercase tracking-tighter text-sm text-primary border-b-2 border-primary/20 pb-1">{schemeName} Grading Scale</h4>
                                        <div className="h-px flex-1 bg-border/50"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {schemes.map((g, i) => (
                                            <div key={g.id || i} className="glass-card p-6 border-border hover:border-primary/30 transition-all group relative">
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className={`w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl`}>{g.grade}</span>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setIsEditingGrade(true);
                                                                setCurrentGrade(g);
                                                                setShowGradingModal(true);
                                                            }}
                                                            className="p-1 hover:text-primary transition-colors text-text-muted"
                                                        >
                                                            <Settings size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteGrade(g.id)}
                                                            className="p-1 hover:text-red-500 transition-colors text-text-muted"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-text-muted uppercase">Score Range</p>
                                                        <p className="font-bold text-text">{parseFloat(g.minScore)}% – {parseFloat(g.maxScore)}%</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-text-muted uppercase">Grade Point (Aggregate)</p>
                                                        <p className="text-lg font-bold text-primary">{parseFloat(g.point)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-text-muted uppercase">Remark</p>
                                                        <p className="text-xs font-medium text-text-muted italic">{g.description || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'settings' && (
                        <motion.div
                            key="settings"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <SettingsPortal />
                        </motion.div>
                    )}

                </AnimatePresence>

                {/* Grading Modal */}
                <AnimatePresence>
                    {showGradingModal && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-card w-full max-w-lg p-8 border-border bg-surface"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold font-heading">{isEditingGrade ? 'Edit' : 'Add'} Grading Scheme</h3>
                                    <button onClick={() => setShowGradingModal(false)} className="text-text-muted hover:text-text"><X size={24} /></button>
                                </div>

                                <form onSubmit={handleSaveGrade} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="label">Scheme Name</label>
                                            <select
                                                required
                                                className="input-field"
                                                value={['WASSCE', 'Tertiary', 'NABPTEX', 'GTEC'].includes(currentGrade.name) ? currentGrade.name : (currentGrade.name ? 'Other' : '')}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === 'Other') {
                                                        setCurrentGrade({ ...currentGrade, name: '' });
                                                    } else {
                                                        setCurrentGrade({ ...currentGrade, name: val });
                                                    }
                                                }}
                                            >
                                                <option value="">Select Scheme</option>
                                                <option value="WASSCE">WASSCE</option>
                                                <option value="Tertiary">Tertiary</option>
                                                <option value="NABPTEX">NABPTEX</option>
                                                <option value="GTEC">GTEC</option>
                                                <option value="Other">Other (Custom)</option>
                                            </select>

                                            {(!['WASSCE', 'Tertiary', 'NABPTEX', 'GTEC'].includes(currentGrade.name) && currentGrade.name !== undefined) && (
                                                <input
                                                    className="input-field mt-2"
                                                    placeholder="Enter custom scheme name..."
                                                    value={currentGrade.name}
                                                    onChange={(e) => setCurrentGrade({ ...currentGrade, name: e.target.value })}
                                                    required
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <label className="label">Grade Symbol</label>
                                            <input
                                                required
                                                className="input-field"
                                                placeholder="e.g. A1, B2, A, B+"
                                                value={currentGrade.grade}
                                                onChange={(e) => setCurrentGrade({ ...currentGrade, grade: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="label">Min Score (%)</label>
                                            <input
                                                required
                                                type="number"
                                                className="input-field"
                                                value={currentGrade.minScore}
                                                onChange={(e) => setCurrentGrade({ ...currentGrade, minScore: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Max Score (%)</label>
                                            <input
                                                required
                                                type="number"
                                                className="input-field"
                                                value={currentGrade.maxScore}
                                                onChange={(e) => setCurrentGrade({ ...currentGrade, maxScore: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="label">Grade Point / Aggregate</label>
                                            <input
                                                required
                                                type="number"
                                                step="0.01"
                                                className="input-field"
                                                value={currentGrade.point}
                                                onChange={(e) => setCurrentGrade({ ...currentGrade, point: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Remark / Description</label>
                                            <input
                                                className="input-field"
                                                placeholder="e.g. Excellent"
                                                value={currentGrade.description}
                                                onChange={(e) => setCurrentGrade({ ...currentGrade, description: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-4">
                                        <button type="button" onClick={() => setShowGradingModal(false)} className="btn bg-surface border border-border flex-1">Cancel</button>
                                        <button type="submit" className="btn btn-primary flex-1">Save Configuration</button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </main>
        </div>
    );
};

export default AdminDashboard;
