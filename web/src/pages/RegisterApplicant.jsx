import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, User, Mail, Lock, CreditCard, Key, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

import ThemeToggle from '../components/ThemeToggle';
import { useSettings } from '../context/SettingsContext';


const RegisterApplicant = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        serialNumber: '',
        pin: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { registerApplicant } = useAuth();
    const { settings } = useSettings();
    const navigate = useNavigate();


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await registerApplicant(formData);
            navigate('/applicant/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Check your voucher details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen flex items-center justify-center p-6 py-12 transition-colors duration-300">
            <div className="absolute top-6 right-6">
                <ThemeToggle />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card w-full max-w-2xl p-8 border border-border"
            >
                <div className="text-center mb-8">
                    {settings.schoolLogo ? (
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border bg-white flex items-center justify-center p-2 mx-auto mb-4">
                            <img src={`http://localhost:5000${settings.schoolLogo}`} alt="School Logo" className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        <GraduationCap size={48} className="text-primary mx-auto mb-4" />
                    )}
                    <h1 className="text-3xl font-bold font-heading">{settings.schoolName || 'Ghana University Management System'}</h1>
                    <p className="text-text-muted">Enter your voucher details to initialize your application</p>
                </div>


                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-primary border-b border-border pb-2 mb-4">Personal Account</h3>
                        <div>
                            <label className="block text-xs text-text-muted mb-2 font-bold uppercase tracking-wider">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                                <input name="username" required className="input-field !pl-12" onChange={handleChange} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-text-muted mb-2 font-bold uppercase tracking-wider">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                                <input name="email" type="email" required className="input-field !pl-12" onChange={handleChange} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-text-muted mb-2 font-bold uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                                <input name="password" type="password" required className="input-field !pl-12" onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-primary border-b border-border pb-2 mb-4">Voucher Details</h3>
                        <div>
                            <label className="block text-xs text-text-muted mb-2 font-bold uppercase tracking-wider">Voucher Serial</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                                <input name="serialNumber" required className="input-field !pl-12 font-mono" placeholder="GUMS-XXXX-XXXX" onChange={handleChange} />
                            </div>
                        </div>

                        {/* WASSCE Grading Scale Reference */}
                        <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl mb-4">
                            <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-3 flex items-center gap-2">
                                WASSCE Grading Scale
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { g: 'A1', r: '1' }, { g: 'B2', r: '2' }, { g: 'B3', r: '3' },
                                    { g: 'C4', r: '4' }, { g: 'C5', r: '5' }, { g: 'C6', r: '6' },
                                    { g: 'D7', r: '7' }, { g: 'E8', r: '8' }, { g: 'F9', r: '9' },
                                ].map(item => (
                                    <div key={item.g} className="px-2 py-1 bg-surface border border-border rounded flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-primary">{item.g}</span>
                                        <span className="text-[10px] text-text-muted font-bold">{item.r}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-text-muted mb-2 font-bold uppercase tracking-wider">Voucher PIN</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                                <input name="pin" required className="input-field !pl-12 font-mono" placeholder="••••••" onChange={handleChange} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-text-muted mb-2 font-bold uppercase tracking-wider">First Name</label>
                                <input name="firstName" required className="input-field" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-xs text-text-muted mb-2 font-bold uppercase tracking-wider">Last Name</label>
                                <input name="lastName" required className="input-field" onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 pt-6 border-t border-border mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full py-4 text-lg shadow-xl shadow-primary/20"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Initialize Application'}
                        </button>
                    </div>
                </form>
            </motion.div>

            {/* WASSCE Grading Scale Reference */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-12 w-full max-w-4xl"
            >
                <div className="glass-card p-8 border border-border bg-surface/30">
                    <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <ShieldCheck size={20} />
                        </div>
                        <h2 className="text-xl font-bold font-heading">WASSCE Grading Scale Reference</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-2">
                        {[
                            { g: 'A1', d: 'Excellent', r: '75-100%' },
                            { g: 'B2', d: 'Very Good', r: '70-74%' },
                            { g: 'B3', d: 'Good', r: '65-69%' },
                            { g: 'C4', d: 'Credit', r: '60-64%' },
                            { g: 'C5', d: 'Credit', r: '55-59%' },
                            { g: 'C6', d: 'Credit', r: '50-54%' },
                            { g: 'D7', d: 'Pass', r: '45-49%' },
                            { g: 'E8', d: 'Pass', r: '40-44%' },
                            { g: 'F9', d: 'Fail', r: '0-39%' },
                        ].map((item) => (
                            <div key={item.g} className="p-3 bg-surface border border-border rounded-xl text-center group hover:border-primary transition-all">
                                <p className="text-lg font-black text-primary mb-0.5">{item.g}</p>
                                <p className="text-[10px] font-bold text-text mb-1 uppercase tracking-tighter truncate">{item.d}</p>
                                <p className="text-[9px] text-text-muted font-mono">{item.r}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};


export default RegisterApplicant;
