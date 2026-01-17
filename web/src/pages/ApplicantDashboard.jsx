import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Layout, FileText, Upload, CheckCircle, Clock, AlertCircle, LogOut, Bell, Menu, X } from 'lucide-react';


import AdmissionForm from '../components/AdmissionForm';
import DocumentUpload from '../components/DocumentUpload';
import ThemeToggle from '../components/ThemeToggle';
import { useSettings } from '../context/SettingsContext';


const ApplicantDashboard = () => {
    const { user, logout } = useAuth();
    const { settings } = useSettings();

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('status');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const { data } = await api.get('/admission/my-application');
                setApplication(data);
            } catch (err) {
                console.error("No application found yet");
            } finally {
                setLoading(false);
            }
        };
        fetchApplication();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Admitted': return <CheckCircle className="text-success" />;
            case 'Submitted': return <Clock className="text-primary" />;
            default: return <AlertCircle className="text-yellow-500" />;
        }
    };

    const navItems = [
        { id: 'status', icon: Layout, label: 'Application Status' },
        { id: 'form', icon: FileText, label: 'Admission Form' },
        { id: 'upload', icon: Upload, label: 'Document Upload' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

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
                            {settings.schoolAbbreviation?.charAt(0) || 'A'}
                        </div>
                    )}
                    <span className="text-2xl font-bold font-heading text-text tracking-tighter">
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

                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto space-y-4">
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
                        <h1 className="text-3xl font-bold font-heading text-text capitalize">
                            {activeTab} Portal
                        </h1>
                        <p className="text-text-muted mt-1 px-3 py-1 bg-surface border border-border rounded-full inline-block text-[10px] font-bold uppercase tracking-widest">
                            Admissions {new Date().getFullYear()}/{new Date().getFullYear() + 1}
                        </p>

                    </div>
                    <div className="flex gap-4">
                        <button className="w-12 h-12 glass-card flex items-center justify-center text-text-muted hover:text-text transition-colors relative border-border hover:border-primary/50 shadow-none">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full ring-2 ring-background"></span>
                        </button>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'status' && (
                        <motion.div
                            key="status"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            <div className="glass-card p-8 border-border bg-surface/50 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-text">Application Status</h3>
                                    <p className="text-text-muted text-sm">Track the progress of your admission request.</p>
                                </div>
                                <div className="flex items-center gap-4 bg-background p-4 rounded-xl border border-border min-w-[200px] justify-center">
                                    {getStatusIcon(application?.status || 'Draft')}
                                    <span className="text-lg font-black uppercase tracking-widest text-text">{application?.status || 'Draft'}</span>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="glass-card p-8 border-border bg-surface/50">
                                    <h4 className="font-bold text-lg mb-6 uppercase tracking-tight text-text">Program Choices</h4>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'First Choice', name: application?.firstChoice?.name, color: 'text-primary' },
                                            { label: 'Second Choice', name: application?.secondChoice?.name, color: 'text-text-muted' },
                                            { label: 'Third Choice', name: application?.thirdChoice?.name, color: 'text-text-muted' }
                                        ].map((choice, i) => (
                                            <div key={i} className="p-4 bg-background/50 rounded-xl border border-border group hover:border-primary/30 transition-colors">
                                                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${choice.color}`}>{choice.label}</p>
                                                <p className="font-bold text-text">{choice.name || 'Not Selected'}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {application?.status === 'Submitted' && (
                                        <div className="mt-8 pt-8 border-t border-border">
                                            <button
                                                onClick={() => setActiveTab('form')}
                                                className="w-full flex items-center justify-center gap-2 p-4 bg-primary text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all"
                                            >
                                                <FileText size={20} /> View Submitted Form
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {application?.status === 'Admitted' && (
                                    <div className="glass-card p-8 border-success/30 bg-success/5 overflow-hidden relative">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <CheckCircle size={120} />
                                        </div>
                                        <h4 className="font-black text-2xl mb-4 text-success uppercase tracking-tighter">Congratulations!</h4>
                                        <p className="text-text-muted mb-8 leading-relaxed">You have been offered admission to {settings.schoolName || 'Ghana University Management System'}. Your journey towards academic excellence begins now. Download your official admission letter below.</p>

                                        <a
                                            href={`http://localhost:5000${application.admissionLetter}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/30"
                                        >
                                            <FileText size={20} /> Download Admission Letter
                                        </a>
                                    </div>
                                )}

                                {!application && (
                                    <div className="glass-card p-8 border-primary/30 bg-primary/5">
                                        <h4 className="font-bold text-xl mb-4 text-primary">Get Started</h4>
                                        <p className="text-text-muted mb-6">You haven't started your application yet. Click below to fill out the form.</p>
                                        <button
                                            onClick={() => setActiveTab('form')}
                                            className="btn btn-primary w-full py-4 font-black uppercase tracking-widest"
                                        >
                                            Start Application
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'form' && (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <AdmissionForm application={application} setApplication={setApplication} />
                        </motion.div>
                    )}

                    {activeTab === 'upload' && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <DocumentUpload application={application} setApplication={setApplication} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default ApplicantDashboard;
