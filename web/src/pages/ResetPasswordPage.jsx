import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Lock, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';

import ThemeToggle from '../components/ThemeToggle';
import SEO from '../components/SEO';

const ResetPasswordPage = () => {
    const { id, token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error("Passwords don't match!");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/reset-password`, { 
                id, 
                token, 
                newPassword: password 
            });
            setSuccess(true);
            toast.success(response.data.message || 'Password reset successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to reset password. The link might be expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden bg-background transition-colors duration-300">
            <SEO title="Reset Password" description="Set a new password" />

            {/* Split Solid Background */}
            <div className="absolute top-0 left-0 w-full h-[45vh] bg-primary transition-colors duration-300">
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            </div>

            <div className="absolute top-4 left-4 md:top-6 md:left-6 z-50">
                <button
                    onClick={() => navigate('/login')}
                    className="p-2 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors flex items-center gap-2 text-sm font-medium backdrop-blur-none"
                    title="Go Back to Login"
                >
                    <ArrowLeft size={20} />
                    <span className="hidden md:inline">Login</span>
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
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            {success ? <CheckCircle size={32} className="text-green-500" /> : <Lock size={32} className="text-primary" />}
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tight mb-2 text-text">
                        {success ? 'Password Reset' : 'Create New Password'}
                    </h1>
                    <p className="text-text-muted text-lg">
                        {success ? 'Your password has been changed successfully.' : 'Please enter your new password below.'}
                    </p>
                </div>

                {success ? (
                    <div className="text-center space-y-6">
                        <Link to="/login" className="block w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-2xl transition-all duration-300">
                            Log In Now
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">New Password</label>
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
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Confirm New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="password"
                                    required
                                    className="input-field !pl-12 !py-4 !rounded-xl !bg-background hover:!bg-surface-hover !border-transparent focus:!border-primary/30 focus:!ring-4 focus:!ring-primary/10 transition-all font-medium text-text outline-none"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-5 rounded-2xl text-xl shadow-[0_10px_20px_-10px_rgba(0,119,190,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(0,119,190,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default ResetPasswordPage;
