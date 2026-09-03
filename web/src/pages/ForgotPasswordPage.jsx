import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';

import ThemeToggle from '../components/ThemeToggle';
import SEO from '../components/SEO';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
            setSuccess(true);
            toast.success(response.data.message || 'Reset link sent!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden bg-background transition-colors duration-300">
            <SEO title="Forgot Password" description="Reset your password" />

            {/* Split Solid Background */}
            <div className="absolute top-0 left-0 w-full h-[45vh] bg-primary transition-colors duration-300">
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
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Key size={32} className="text-primary" />
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tight mb-2 text-text">Forgot Password</h1>
                    <p className="text-text-muted text-lg">Enter your email or ID to receive a reset link</p>
                </div>

                {success ? (
                    <div className="text-center space-y-6">
                        <div className="bg-green-500/10 border border-green-500 text-green-600 p-4 rounded-xl text-sm font-medium">
                            If that account exists, a password reset link has been sent to the associated email address.
                        </div>
                        <p className="text-text-muted text-sm">
                            Please check your inbox and spam folder.
                        </p>
                        <Link to="/login" className="block w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-2xl transition-all duration-300">
                            Return to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-2">Email Address or ID</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="text"
                                    required
                                    className="input-field !pl-12 !py-4 !rounded-xl !bg-background hover:!bg-surface-hover !border-transparent focus:!border-primary/30 focus:!ring-4 focus:!ring-primary/10 transition-all font-medium text-text outline-none"
                                    placeholder="Enter your email or ID"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-5 rounded-2xl text-xl shadow-[0_10px_20px_-10px_rgba(0,119,190,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(0,119,190,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
                            </button>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;
