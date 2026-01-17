import React, { useState } from 'react';
import axios from 'axios';
import { CreditCard, Mail, ArrowRight, Loader2, ShieldCheck, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

import ThemeToggle from '../components/ThemeToggle';
import { useSettings } from '../context/SettingsContext';


const PurchaseVoucher = () => {
    const { settings } = useSettings();
    const [email, setEmail] = useState('');

    const [voucherType, setVoucherType] = useState('Undergraduate');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const voucherOptions = [
        { type: 'Undergraduate', price: 100, desc: 'For WASSCE/SSCE applicants' },
        { type: 'Postgraduate', price: 250, desc: 'For Masters/PhD applicants' },
        { type: 'Mature/Diploma', price: 150, desc: 'For non-traditional applicants' },
    ];

    const handlePurchase = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const selectedVoucher = voucherOptions.find(v => v.type === voucherType);

        try {
            const { data } = await axios.post('http://localhost:5000/api/payments/initialize-voucher', {
                email,
                voucherType,
                amount: selectedVoucher.price * 100, // Amount in pesewas
                callback_url: `${window.location.origin}/verify-payment`
            });

            // Redirect to Paystack
            window.location.href = data.authorization_url;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to initialize payment');
            setLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen text-text flex items-center justify-center p-6 py-12 transition-colors duration-300">
            <div className="absolute top-6 right-6">
                <ThemeToggle />
            </div>

            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left Side: Info */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                        <Smartphone size={14} /> Mobile Money Supported
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading leading-tight">
                        Start Your <span className="text-primary">Journey</span> at {settings.schoolAbbreviation || 'GUMS'}.
                    </h1>

                    <p className="text-text-muted text-lg">
                        Purchase your admission voucher instantly via Paystack. Join {settings.schoolName || 'Ghana University Management System'} today.
                    </p>


                    <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="p-2 bg-surface border border-border rounded-lg text-primary shadow-sm"><ShieldCheck size={20} /></div>
                            <div>
                                <p className="font-bold">Instant Delivery</p>
                                <p className="text-sm text-text-muted">Receive your Serial and PIN immediately after payment.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="p-2 bg-surface border border-border rounded-lg text-primary shadow-sm"><CreditCard size={20} /></div>
                            <div>
                                <p className="font-bold">Secure Payment</p>
                                <p className="text-sm text-text-muted">All transactions are secured by Paystack PCI DSS encryption.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-10 border border-border bg-surface/50"
                >
                    <h3 className="text-2xl font-bold mb-8">Voucher Order Form</h3>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handlePurchase} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="input-field pl-10"
                                    placeholder="janesmith@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <p className="text-[10px] text-text-muted mt-2 italic">A copy of your voucher will be sent to this email.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-6">Select Voucher Category</label>
                            <div className="space-y-3">
                                {voucherOptions.map((opt) => (
                                    <label
                                        key={opt.type}
                                        className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${voucherType === opt.type
                                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                            : 'border-border bg-surface/50 hover:border-text-muted'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="voucherType"
                                            className="hidden"
                                            onChange={() => setVoucherType(opt.type)}
                                            checked={voucherType === opt.type}
                                        />
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className={`font-bold transition-colors ${voucherType === opt.type ? 'text-primary' : 'text-text'}`}>{opt.type}</p>
                                                <p className="text-xs text-text-muted">{opt.desc}</p>
                                            </div>
                                            <p className={`text-lg font-black transition-colors ${voucherType === opt.type ? 'text-primary' : 'text-text-muted'}`}>GHS {opt.price}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full py-4 text-lg mt-4 shadow-xl shadow-primary/20"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Complete Selection <ArrowRight size={20} /></>}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};


export default PurchaseVoucher;
