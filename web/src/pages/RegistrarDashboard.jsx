import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
    Layout, Users, CheckCircle, XCircle, Eye,
    Search, Filter, LogOut, Loader2, Download,
    GraduationCap, BookOpen, FileText, ChevronRight,
    X, Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdmissionForm from '../components/AdmissionForm';
import ThemeToggle from '../components/ThemeToggle';
import { useSettings } from '../context/SettingsContext';



const RegistrarDashboard = () => {
    const { user, logout } = useAuth();
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
        <div className="bg-background min-h-screen text-text flex font-sans transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border p-6 flex flex-col gap-10 bg-surface/30 backdrop-blur-xl sticky top-0 h-screen">
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
                    <button className="flex items-center gap-3 p-3 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 transition-all">
                        <Users size={20} /> Applications
                    </button>
                    <button className="flex items-center gap-3 p-3 rounded-xl text-text-muted hover:bg-surface transition-colors">
                        <GraduationCap size={20} /> Students
                    </button>
                    <button className="flex items-center gap-3 p-3 rounded-xl text-text-muted hover:bg-surface transition-colors">
                        <BookOpen size={20} /> Programs
                    </button>
                </nav>

                <div className="mt-auto space-y-4">
                    <ThemeToggle />
                    <button onClick={logout} className="flex items-center gap-3 p-3 w-full text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-medium">
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <header className="mb-10 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black font-heading">Admissions</h1>
                        <p className="text-text-muted font-medium">Review and process submitted student applications.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="glass-card flex items-center gap-3 px-4 py-2 border-border">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                            <input
                                className="bg-transparent outline-none text-sm w-64 pl-8"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="btn bg-surface border-border text-text-muted flex items-center gap-2 h-12 px-6 hover:bg-surface-hover">
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
                                className="glass-card p-4 flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-all border-border bg-surface/50"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-black text-xl shadow-inner">
                                        {app.User?.firstName?.[0]}{app.User?.lastName?.[0]}
                                    </div>
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

                                <div className="flex items-center gap-8">
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
            </main>

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
                            <header className="p-6 border-b border-border flex justify-between items-center bg-surface/50 backdrop-blur-md">
                                <button onClick={() => setShowDetail(false)} className="text-text-muted hover:text-text flex items-center gap-2 font-black uppercase text-[10px] tracking-widest transition-colors">
                                    <X size={20} /> Close Profile
                                </button>


                                {selectedApp.status === 'Submitted' && (
                                    <div className="flex gap-3">
                                        <button
                                            disabled={actionLoading}
                                            onClick={() => setShowAdmitModal(true)}
                                            className="btn bg-success hover:bg-success/90 text-white py-2 px-8 flex items-center gap-2 font-black uppercase text-xs tracking-widest transition-all hover:scale-105 shadow-lg shadow-success/20"
                                        >
                                            <CheckCircle size={18} /> Approve & Admit
                                        </button>
                                        <button
                                            disabled={actionLoading}
                                            onClick={handleReject}
                                            className="btn bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white py-2 px-8 flex items-center gap-2 font-black uppercase text-xs tracking-widest transition-all"
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

                            <div className="flex-1 overflow-y-auto p-4 md:p-12 relative bg-background">

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
