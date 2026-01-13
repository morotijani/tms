import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Layout, FileText, Upload, CheckCircle, Clock, AlertCircle, LogOut } from 'lucide-react';

import AdmissionForm from '../components/AdmissionForm';
import DocumentUpload from '../components/DocumentUpload';

const ApplicantDashboard = () => {
    const { user, logout } = useAuth();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('status');

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
            case 'Admitted': return <CheckCircle className="text-green-500" />;
            case 'Submitted': return <Clock className="text-blue-500" />;
            default: return <AlertCircle className="text-yellow-500" />;
        }
    };

    return (
        <div className="bg-slate-950 min-h-screen text-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 p-6 flex flex-col gap-8">
                <div className="text-2xl font-bold font-heading flex items-center gap-2">
                    <span className="text-blue-500">GUMS</span> Portal
                </div>

                <nav className="flex flex-col gap-2">
                    <button
                        onClick={() => setActiveTab('status')}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'status' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
                    >
                        <Layout size={20} /> Application Status
                    </button>
                    <button
                        onClick={() => setActiveTab('form')}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'form' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
                    >
                        <FileText size={20} /> Admission Form
                    </button>
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'upload' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
                    >
                        <Upload size={20} /> Document Upload
                    </button>
                </nav>

                <button onClick={logout} className="mt-auto flex items-center gap-3 p-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                    <LogOut size={20} /> Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-10 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Welcome, {user?.firstName}</h1>
                        <p className="text-slate-400">Manage your university application here.</p>
                    </div>
                    <div className="glass-card px-4 py-2 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm font-medium">Applicant Role</span>
                    </div>
                </header>

                {activeTab === 'status' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="glass-card p-8 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold mb-2">Application Status</h3>
                                <p className="text-slate-400">Current state of your application at GUMS.</p>
                            </div>
                            <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                {getStatusIcon(application?.status || 'Draft')}
                                <span className="text-xl font-bold uppercase tracking-wider">{application?.status || 'Draft'}</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="glass-card p-6">
                                <h4 className="font-bold mb-4">Program Choices</h4>
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                                        <p className="text-xs text-blue-500 font-bold uppercase mb-1">First Choice</p>
                                        <p className="font-medium">{application?.firstChoice?.name || 'Not Selected'}</p>
                                    </div>
                                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Second Choice</p>
                                        <p className="font-medium">{application?.secondChoice?.name || 'Not Selected'}</p>
                                    </div>
                                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Third Choice</p>
                                        <p className="font-medium">{application?.thirdChoice?.name || 'Not Selected'}</p>
                                    </div>

                                </div>

                                {application?.status === 'Submitted' && (
                                    <div className="mt-8">
                                        <button
                                            onClick={() => setActiveTab('form')}
                                            className="w-full flex items-center justify-center gap-2 p-4 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all shadow-lg"
                                        >
                                            <FileText size={20} /> View / Print Submitted Application
                                        </button>
                                    </div>
                                )}
                            </div>


                            {application?.status === 'Admitted' && (
                                <div className="glass-card p-6 border-green-500/50 bg-green-500/5">
                                    <h4 className="font-bold mb-4">Congratulations!</h4>
                                    <p className="text-slate-400 mb-6">You have been offered admission. Please download your admission letter below.</p>
                                    <a
                                        href={`http://localhost:5000${application.admissionLetter}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-primary w-full"
                                    >
                                        Download Admission Letter
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'form' && <AdmissionForm application={application} setApplication={setApplication} />}
                {activeTab === 'upload' && <DocumentUpload application={application} setApplication={setApplication} />}
            </main>
        </div>
    );
};

export default ApplicantDashboard;
