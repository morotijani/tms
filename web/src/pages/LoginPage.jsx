import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

import ThemeToggle from '../components/ThemeToggle';
import { useSettings } from '../context/SettingsContext';
import { API_BASE_URL } from '../utils/api';
import SEO from '../components/SEO';



const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const { settings } = useSettings();
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const user = await login(email, password);

            if (user.role === 'student') {
                // If login input looks like an email (contains @), go to applicant portal
                // Otherwise (Student ID), go to student portal
                if (email.includes('@')) {
                    navigate('/applicant');
                } else {
                    navigate('/student');
                }
            }
            else if (user.role === 'applicant') navigate('/applicant');
            else if (user.role === 'registrar') navigate('/registrar');
            else if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'staff') navigate('/staff');
            else if (user.role === 'accountant') navigate('/accountant');
            else navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden bg-background transition-colors duration-300">
            <SEO title="Login" description="Login to your account" />

            {/* Split Solid Background */}
            <div className="absolute top-0 left-0 w-full h-[45vh] bg-primary transition-colors duration-300">
                {/* Subtle Dot Pattern overlay */}
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            </div>

            <div className="absolute top-4 left-4 md:top-6 md:left-6 z-50">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors flex items-center gap-2 text-sm font-medium backdrop-blur-none"
                    title="Go Back"
                >
                    <ArrowLeft size={20} />
                    <span className="hidden md:inline">Back</span>
                </button>
            </div>

            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 text-white">
                <ThemeToggle />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-surface w-full max-w-lg p-8 sm:p-10 md:p-12 mt-12 md:mt-0 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] border border-border relative z-10 transition-colors duration-300"
            >
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-6">
                        {settings.schoolLogo ? (
                            <div className="w-24 h-24 rounded-2xl overflow-hidden border border-border bg-surface shadow-sm flex items-center justify-center p-2">
                                <img src={`${API_BASE_URL}${settings.schoolLogo}`} alt="School Logo" className="w-full h-full object-contain" />
                            </div>
                        ) : (
                            <GraduationCap size={56} className="text-primary" />
                        )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tight mb-2 text-text">Welcome Back</h1>
                    <p className="text-text-muted text-lg">Login to your {settings.schoolAbbreviation || 'GUMS'} account</p>
                </div>


                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-xl mb-6 text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Email Address or ID</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="text"
                                required
                                className="input-field !pl-12 !py-4 !rounded-xl !bg-background hover:!bg-surface-hover !border-transparent focus:!border-primary/30 focus:!ring-4 focus:!ring-primary/10 transition-all font-medium text-text outline-none"
                                placeholder="Email or ID"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="password"
                                required
                                className="input-field !pl-12 !py-4 !rounded-xl !bg-background hover:!bg-surface-hover !border-transparent focus:!border-primary/30 focus:!ring-4 focus:!ring-primary/10 transition-all font-medium text-text outline-none"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end mt-2">
                            <Link to="/forgot-password" className="text-sm font-bold text-primary hover:text-primary-hover transition-colors">
                                Forgot Password?
                            </Link>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-5 rounded-2xl text-xl shadow-[0_10px_20px_-10px_rgba(0,119,190,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(0,119,190,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                        </button>
                    </div>
                </form>

                <p className="text-center mt-8 text-text-muted text-sm font-medium">
                    Don't have an account? <Link to="/purchase-voucher" className="text-primary hover:text-primary-hover hover:underline font-bold transition-colors">Apply Today</Link>
                </p>
            </motion.div>
        </div>
    );
};


export default LoginPage;
