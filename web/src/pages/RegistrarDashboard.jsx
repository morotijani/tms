import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
    Layout, Users, CheckCircle, XCircle, Eye,
    Search, Filter, LogOut, Loader2, Download,
    GraduationCap, BookOpen, FileText, ChevronRight,
    X, Maximize2, Menu
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import AdmissionForm from '../components/AdmissionForm';
import ThemeToggle from '../components/ThemeToggle';
import { useSettings } from '../context/SettingsContext';



import RegistrarStudents from './RegistrarStudents';
import RegistrarPrograms from './RegistrarPrograms';

const RegistrarDashboard = () => {
    const { user, logout } = useAuth();
    const { settings } = useSettings();

    // State management is now handled in sub-components
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);




    const location = useLocation();

    // Active link helper
    const isActive = (path) => {
        if (path === '/registrar' && location.pathname === '/registrar') return true;
        return location.pathname.startsWith(path) && path !== '/registrar';
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
                            {settings.schoolAbbreviation?.charAt(0) || 'R'}
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

                <div className="flex items-center gap-3 text-text">
                    {settings.schoolLogo ? (
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-border bg-white flex items-center justify-center p-1">
                            <img src={`http://localhost:5000${settings.schoolLogo}`} alt="School Logo" className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-primary/20">
                            {settings.schoolAbbreviation?.charAt(0) || 'R'}
                        </div>
                    )}
                    <span className="text-2xl font-bold font-heading tracking-tighter">
                        {settings.schoolAbbreviation || 'GUMS'}<span className="text-primary italic">.</span>
                    </span>
                </div>


                <nav className="flex flex-col gap-2">
                    <Link to="/registrar" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive('/registrar') ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text/60 hover:bg-surface hover:text-text'}`}>
                            <Users size={20} /> Applications
                        </div>
                    </Link>
                    <Link to="/registrar/students" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive('/registrar/students') ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text/60 hover:bg-surface hover:text-text'}`}>
                            <GraduationCap size={20} /> Students
                        </div>
                    </Link>
                    <Link to="/registrar/programs" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive('/registrar/programs') ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text/60 hover:bg-surface hover:text-text'}`}>
                            <BookOpen size={20} /> Programs
                        </div>
                    </Link>
                </nav>

                <div className="mt-auto space-y-4">
                    <ThemeToggle />
                    <button onClick={logout} className="flex items-center gap-3 p-3 w-full text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-medium">
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area with Routes */}
            <main className="flex-1 transition-all duration-300 overflow-hidden">
                <Routes>
                    <Route index element={<RegistrarApplicationsContent user={user} />} />
                    <Route path="students" element={<RegistrarStudents />} />
                    <Route path="programs" element={<RegistrarPrograms />} />
                </Routes>
            </main>
        </div>
    );
};

// Extracted internal component for the Applications View (original content)
const RegistrarApplicationsContent = ({ user }) => {
    const { settings } = useSettings();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);

    // New states for modals
    const [showAdmitModal, setShowAdmitModal] = useState(false);
    const [selectedAdmittedProgramId, setSelectedAdmittedProgramId] = useState('');
    const [docViewer, setDocViewer] = useState({ show: false, label: '', path: '' });

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get('/registrar/applications');
            setApplications(data);
        } catch (err) {
            console.error("Error fetching applications:", err);
            setError(err.response?.data?.message || "Failed to load applications. Check your permissions.");
        } finally {
            setLoading(false);
        }
    };

    const handleAdmit = async () => {
        if (!selectedAdmittedProgramId) {
            alert("Please select a program for admission.");
            return;
        }

        setActionLoading(true);
        try {
            const payload = {
                status: 'Admitted',
                admittedProgramId: selectedAdmittedProgramId,
                admissionLetter: `/uploads/admission_letters/dummy_letter.pdf`
            };

            await api.patch(`/registrar/applications/${selectedApp.id}/status`, payload);
            fetchApplications();
            setShowAdmitModal(false);
            setShowDetail(false);
            alert("Application approved and student admitted!");
        } catch (err) {
            alert("Action failed: " + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!window.confirm("Are you sure you want to reject this application?")) return;

        setActionLoading(true);
        try {
            await api.patch(`/registrar/applications/${selectedApp.id}/status`, { status: 'Rejected' });
            fetchApplications();
            setShowDetail(false);
            alert("Application rejected.");
        } catch (err) {
            alert("Action failed: " + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(false);
        }
    };

    const filteredApps = applications.filter(app =>
        `${app.User?.firstName} ${app.User?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.User?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Helpers for document links
    const getDocUrl = (path) => {
        if (!path) return '';
        return path.startsWith('http') ? path : `http://localhost:5000${path.startsWith('/') ? '' : '/'}${path}`;
    };

    return (
        <div className="p-4 md:p-8 pt-20 md:pt-8 w-full">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black font-heading text-text">Admissions</h1>
                    <p className="text-text-muted font-medium">Review and process student applications.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="glass-card flex items-center gap-3 px-4 py-2 border-border bg-surface/50 w-full md:w-auto relative">
                        <Search className="text-text-muted" size={18} />
                        <input
                            className="bg-transparent outline-none text-sm w-full md:w-64"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn bg-surface border-border text-text-muted flex items-center justify-center gap-2 h-12 px-6 hover:bg-surface-hover w-full md:w-auto">
                        <Filter size={18} /> Filter
                    </button>
                </div>

            </header>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-8 flex items-center gap-2">
                    <XCircle size={20} /> {error}
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-primary" size={48} />
                    <p className="text-text-muted font-bold uppercase text-xs tracking-widest mt-4">Loading Applications...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredApps.length > 0 ? filteredApps.map(app => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={app.id}
                            layoutId={app.id}
                            onClick={() => { setSelectedApp(app); setShowDetail(true); }}
                            className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between group cursor-pointer hover:border-primary/50 transition-all border-border bg-surface/50 gap-4"
                        >
                            <div className="flex items-center gap-4 sm:gap-6">

                                {app.passportPhoto ? (
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-primary/20 shadow-inner">
                                        <img src={`http://localhost:5000${app.passportPhoto}`} alt="Passport" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-black text-xl shadow-inner">
                                        {app.User?.firstName?.[0]}{app.User?.lastName?.[0]}
                                    </div>
                                )}

                                <div>
                                    <h3 className="font-black text-lg uppercase tracking-tight group-hover:text-primary transition-colors text-text">
                                        {app.User?.firstName} {app.User?.lastName}
                                    </h3>
                                    <div className="flex flex-wrap gap-4 mt-1">
                                        <span className="flex items-center gap-1 text-text-muted font-bold uppercase tracking-widest text-[10px]">
                                            <Users size={12} /> STU-00{app.User?.id}
                                        </span>
                                        <span className="flex items-center gap-1 font-mono uppercase text-text-muted/70 text-[10px]">
                                            Ref: {app.voucherId || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${app.status === 'Submitted' ? 'bg-primary/10 text-primary border-primary/20' :
                                    app.status === 'Admitted' ? 'bg-success/10 text-success border-success/20' :
                                        'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                    }`}>
                                    {app.status}
                                </span>
                                <ChevronRight className="text-text-muted/30 group-hover:text-primary transition-transform group-hover:translate-x-1" />
                            </div>

                        </motion.div>
                    )) : (
                        <div className="text-center py-20 bg-surface/20 rounded-2xl border border-dashed border-border">
                            <p className="text-text-muted font-bold uppercase tracking-widest text-sm">No applications found</p>
                        </div>
                    )}
                </div>
            )}

            {/* Detail Overlay / Modal */}
            <AnimatePresence>
                {showDetail && selectedApp && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-end"
                    >
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowDetail(false)}></div>
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="w-full max-w-5xl h-full bg-background border-l border-border z-10 flex flex-col shadow-2xl"
                        >
                            <header className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row justify-between items-center bg-surface/50 backdrop-blur-md gap-4">
                                <button onClick={() => setShowDetail(false)} className="text-text-muted hover:text-text flex items-center gap-2 font-black uppercase text-[10px] tracking-widest transition-colors w-full sm:w-auto">
                                    <X size={20} /> Close Profile
                                </button>



                                {selectedApp.status === 'Submitted' && (
                                    <div className="flex gap-3 w-full sm:w-auto justify-center">
                                        <button
                                            disabled={actionLoading}
                                            onClick={() => setShowAdmitModal(true)}
                                            className="btn bg-success hover:bg-success/90 text-white py-2 px-6 sm:px-8 flex-1 sm:flex-none items-center gap-2 font-black uppercase text-[10px] sm:text-xs tracking-widest transition-all hover:scale-105 shadow-lg shadow-success/20"
                                        >
                                            <CheckCircle size={18} /> Approve
                                        </button>
                                        <button
                                            disabled={actionLoading}
                                            onClick={handleReject}
                                            className="btn bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white py-2 px-6 sm:px-8 flex-1 sm:flex-none items-center gap-2 font-black uppercase text-[10px] sm:text-xs tracking-widest transition-all"
                                        >
                                            <XCircle size={18} /> Reject
                                        </button>
                                    </div>


                                )}

                                {selectedApp.status === 'Admitted' && (
                                    <div className="flex items-center gap-2 text-success font-black uppercase text-xs tracking-widest">
                                        <CheckCircle size={20} /> Successfully Admitted
                                    </div>
                                )}

                            </header>

                            <div className="flex-1 overflow-y-auto p-2 sm:p-6 md:p-12 relative bg-background">


                                <AdmissionForm
                                    application={selectedApp}
                                    setApplication={() => { }}
                                    readonly={true}
                                    onDocClick={(label, path) => setDocViewer({ show: true, label, path })}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Admit Confirmation Modal */}
            <AnimatePresence>
                {showAdmitModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                            onClick={() => setShowAdmitModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-surface border border-border w-full max-w-md rounded-2xl p-8 z-10 shadow-2xl"
                        >
                            <h2 className="text-2xl font-black uppercase tracking-tight mb-2 text-text">Finalize Admission</h2>
                            <p className="text-text-muted text-sm mb-6 font-medium">Please select the program this applicant is being officially admitted into:</p>


                            <div className="space-y-3 mb-8">
                                {[
                                    { id: selectedApp.firstChoiceId, name: selectedApp.firstChoice?.name, label: '1st Choice' },
                                    { id: selectedApp.secondChoiceId, name: selectedApp.secondChoice?.name, label: '2nd Choice' },
                                    { id: selectedApp.thirdChoiceId, name: selectedApp.thirdChoice?.name, label: '3rd Choice' },
                                ].map((choice, i) => choice.id && (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedAdmittedProgramId(choice.id)}
                                        className={`w-full p-4 rounded-xl border flex flex-col items-start gap-1 transition-all ${selectedAdmittedProgramId === choice.id
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border bg-background/50 hover:border-text-muted/50'
                                            }`}
                                    >
                                        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">{choice.label}</span>
                                        <span className={`text-sm font-bold text-left ${selectedAdmittedProgramId === choice.id ? 'text-primary' : 'text-text'}`}>
                                            {choice.name}
                                        </span>
                                    </button>

                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowAdmitModal(false)}
                                    className="flex-1 py-3 px-6 rounded-xl bg-surface-hover text-text font-black uppercase text-xs tracking-widest hover:bg-border transition-colors border border-border"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={actionLoading}
                                    onClick={handleAdmit}
                                    className="flex-1 py-3 px-6 rounded-xl bg-primary text-white font-black uppercase text-xs tracking-widest hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                >
                                    {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                                    Confirm Admission
                                </button>

                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Document Viewer Modal */}
            <AnimatePresence>
                {docViewer.show && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/95 backdrop-blur-md"
                            onClick={() => setDocViewer({ ...docViewer, show: false })}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-surface border border-border w-full max-w-6xl h-full max-h-[90vh] rounded-3xl overflow-hidden z-10 flex flex-col shadow-2xl"
                        >
                            <header className="p-4 md:p-6 border-b border-border flex justify-between items-center bg-background/50 backdrop-blur-md">
                                <div>
                                    <h3 className="font-black uppercase tracking-tighter text-xl text-text">{docViewer.label}</h3>
                                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Applicant Credential Verification</p>
                                </div>

                                <div className="flex gap-4">
                                    <a
                                        href={getDocUrl(docViewer.path)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn bg-surface border border-border hover:bg-surface-hover text-text p-2 md:px-4 flex items-center gap-2"
                                    >
                                        <Maximize2 size={18} /> <span className="hidden md:inline text-[10px] font-black uppercase">Open Original</span>
                                    </a>

                                    <button
                                        onClick={() => setDocViewer({ ...docViewer, show: false })}
                                        className="w-10 h-10 rounded-full bg-red-600/10 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </header>
                            <div className="flex-1 bg-background flex items-center justify-center p-4 relative overflow-auto">
                                {docViewer.path.toLowerCase().endsWith('.pdf') ? (
                                    <iframe
                                        src={`${getDocUrl(docViewer.path)}#toolbar=0`}
                                        className="w-full h-full rounded-xl border border-border"
                                        title="PDF Viewer"
                                    />
                                ) : (
                                    <img
                                        src={getDocUrl(docViewer.path)}
                                        className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                                        alt="Document Preview"
                                    />
                                )}
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};


export default RegistrarDashboard;
