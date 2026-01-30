import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

import ThemeToggle from '../components/ThemeToggle';
import { useSettings } from '../context/SettingsContext';


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
        <div className="bg-background min-h-screen flex items-center justify-center p-6 transition-colors duration-300">
            <div className="absolute top-6 right-6">
                <ThemeToggle />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card w-full max-w-md p-8 border border-border"
            >
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        {settings.schoolLogo ? (
                            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border bg-white flex items-center justify-center p-2">
                                <img src={`http://localhost:5000${settings.schoolLogo}`} alt="School Logo" className="w-full h-full object-contain" />
                            </div>
                        ) : (
                            <GraduationCap size={48} className="text-primary" />
                        )}
                    </div>
                    <h1 className="text-3xl font-bold font-heading mb-2">Welcome Back</h1>
                    <p className="text-text-muted">Login to your {settings.schoolAbbreviation || 'GUMS'} account</p>
                </div>


                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Email Address or Student ID</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                            <input
                                type="text"
                                required
                                className="input-field !pl-12"
                                placeholder="Email or Student ID"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-text">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                            <input
                                type="password"
                                required
                                className="input-field !pl-12"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full py-3"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                    </button>
                </form>

                <p className="text-center mt-8 text-text-muted text-sm">
                    Don't have an account? <Link to="/purchase-voucher" className="text-primary hover:underline font-bold">Apply Today</Link>
                </p>
            </motion.div>
        </div>
    );
};


export default LoginPage;
