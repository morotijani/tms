import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { CheckCircle, XCircle, Loader2, Copy, FileText, Home, AlertCircle, ArrowRight } from 'lucide-react';

import { motion } from 'framer-motion';

import ThemeToggle from '../components/ThemeToggle';
import { useSettings } from '../context/SettingsContext';


const VerifyPayment = () => {
    const { settings } = useSettings();
    const [searchParams] = useSearchParams();

    const reference = searchParams.get('reference');
    const [status, setStatus] = useState('loading');
    const [voucher, setVoucher] = useState(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!reference) {
            setStatus('error');
            setError('No transaction reference found.');
            return;
        }

        const verify = async () => {
            try {
                const { data } = await api.get(`/payments/verify-voucher/${reference}`);
                if (data.status === 'success') {
                    setVoucher(data.voucher);
                    setStatus('success');
                } else {
                    setStatus('error');
                    setError('Payment verification failed.');
                }
            } catch (err) {
                setStatus('error');
                setError(err.response?.data?.message || 'Verification failed.');
            }
        };

        verify();
    }, [reference]);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-background min-h-screen text-text flex items-center justify-center p-6 transition-colors duration-300">
            <div className="absolute top-6 right-6">
                <ThemeToggle />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full glass-card p-8 border border-border text-center shadow-xl shadow-primary/5"
            >
                {status === 'loading' && (
                    <div className="space-y-6 py-10">
                        <Loader2 className="animate-spin mx-auto text-primary" size={48} />
                        <h2 className="text-2xl font-bold font-heading">Verifying Payment...</h2>
                        <p className="text-text-muted">Please wait while we confirm your transaction with Paystack.</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6 py-10">
                        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={32} />
                        </div>
                        <h2 className="text-2xl font-bold font-heading text-red-500">Oops! Something went wrong</h2>
                        <p className="text-text-muted">{error}</p>
                        <div className="pt-6">
                            <Link to="/purchase-voucher" className="btn btn-primary w-full">Try Again</Link>
                        </div>
                    </div>
                )}

                {status === 'success' && voucher && (
                    <div className="space-y-8">
                        <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h2 className="text-2xl font-bold font-heading">Payment Successful!</h2>
                        <p className="text-text-muted">Your {settings.schoolAbbreviation || 'GUMS'} admission voucher has been generated successfully. Please save these details to start your application.</p>


                        <div className="space-y-4 pt-4">
                            <div className="p-6 bg-surface rounded-2xl border border-border text-left relative overflow-hidden group shadow-sm">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-10 -mt-10 blur-xl"></div>

                                <div className="mb-4 relative z-10">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-text-muted mb-1">Voucher Serial</p>
                                    <div className="flex justify-between items-center bg-background/50 p-3 rounded-lg border border-border">
                                        <span className="font-mono text-lg font-bold text-primary">{voucher.serialNumber}</span>
                                        <button onClick={() => handleCopy(voucher.serialNumber)} className="text-text-muted hover:text-primary transition-colors">
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-text-muted mb-1">Voucher PIN</p>
                                    <div className="flex justify-between items-center bg-background/50 p-3 rounded-lg border border-border">
                                        <span className="font-mono text-lg font-bold text-primary">{voucher.pin}</span>
                                        <button onClick={() => handleCopy(voucher.pin)} className="text-text-muted hover:text-primary transition-colors">
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                </div>

                                {copied && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute bottom-2 right-4 text-[10px] text-success font-bold"
                                    >
                                        Copied to clipboard!
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 pt-6">
                            <Link to="/register" className="btn btn-primary w-full py-4 shadow-lg shadow-primary/20">
                                Start Application Form <ArrowRight size={18} />
                            </Link>
                            <Link to="/" className="flex items-center justify-center gap-2 text-text-muted hover:text-primary text-sm font-medium transition-colors">
                                <Home size={14} /> Back to Home
                            </Link>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};


export default VerifyPayment;
