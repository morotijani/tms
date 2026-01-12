import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, User, Mail, Lock, CreditCard, Key, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

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
        <div className="bg-slate-950 min-h-screen flex items-center justify-center p-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card w-full max-w-2xl p-8"
            >
                <div className="text-center mb-8">
                    <GraduationCap size={48} className="text-blue-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold font-heading">Application Portal</h1>
                    <p className="text-slate-400">Enter your voucher details to create your account</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-500">Personal Account</h3>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input name="username" required className="input-field pl-10" onChange={handleChange} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input name="email" type="email" required className="input-field pl-10" onChange={handleChange} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input name="password" type="password" required className="input-field pl-10" onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-500">Voucher Details</h3>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Serial Number</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input name="serialNumber" required className="input-field pl-10" placeholder="SN102938475" onChange={handleChange} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Voucher PIN</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <input name="pin" required className="input-field pl-10" placeholder="••••••" onChange={handleChange} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">First Name</label>
                                <input name="firstName" required className="input-field" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Last Name</label>
                                <input name="lastName" required className="input-field" onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full py-3"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Initialize Application'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default RegisterApplicant;
