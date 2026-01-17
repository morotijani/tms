import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, History, Loader2, Download, AlertTriangle } from 'lucide-react';

const Financials = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFinancials = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/student/financials');
                setInvoices(data);
            } catch (err) {
                console.error("Failed to fetch financials");
            } finally {
                setLoading(false);
            }
        };
        fetchFinancials();
    }, []);

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;


    const totalOwned = invoices.reduce((sum, inv) => inv.status !== 'Paid' ? sum + parseFloat(inv.amount) : sum, 0);

    return (
        <div className="animate-fade-in space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Balance Card */}
                <div className="glass-card p-8 bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30 overflow-hidden relative shadow-lg shadow-primary/5">
                    <div className="relative z-10">
                        <p className="text-text-muted font-bold mb-1 uppercase tracking-widest text-[10px]">Total Outstanding</p>
                        <h2 className="text-4xl font-black mb-8 text-text">GHS {totalOwned.toFixed(2)}</h2>
                        <div className="flex gap-4">
                            <button className="btn btn-primary px-8 py-3 font-bold uppercase tracking-widest text-sm">Pay Fees Now</button>
                            <button className="p-3 glass-card bg-surface hover:bg-surface-hover transition-colors border-border"><Download size={20} className="text-text-muted" /></button>
                        </div>
                    </div>
                    {/* Decorative Card Chip */}
                    <div className="absolute top-8 right-8 w-12 h-10 bg-yellow-500/10 rounded-lg border border-yellow-500/20"></div>
                    <CreditCard size={120} className="absolute -bottom-10 -right-10 text-primary/5 rotate-12" />
                </div>

                <div className="glass-card p-8 border-border bg-surface/50">
                    <h4 className="font-bold flex items-center gap-2 mb-6 text-text uppercase tracking-tight"><History size={20} className="text-primary" /> Transaction History</h4>

                    <div className="space-y-4">
                        {invoices.length === 0 ? (
                            <p className="text-slate-500 text-sm italic py-4">No transactions found.</p>
                        ) : (
                            invoices.map((inv, i) => (
                                <div key={i} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-text-muted">
                                            <Download size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-text">{inv.title}</p>
                                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{new Date(inv.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-red-500">- GHS {inv.amount}</p>
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${inv.status === 'Paid' ? 'text-success' : 'text-yellow-500'}`}>{inv.status}</p>
                                    </div>
                                </div>

                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="glass-card overflow-hidden border-border bg-surface/50">
                <table className="w-full text-left">
                    <thead className="bg-surface border-b border-border">
                        <tr>
                            <th className="p-4 font-black text-[10px] uppercase text-text-muted tracking-widest">Invoice ID</th>
                            <th className="p-4 font-black text-[10px] uppercase text-text-muted tracking-widest">Service</th>
                            <th className="p-4 font-black text-[10px] uppercase text-text-muted tracking-widest">Amount</th>
                            <th className="p-4 font-black text-[10px] uppercase text-text-muted tracking-widest">Status</th>
                            <th className="p-4 font-black text-[10px] uppercase text-text-muted tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">

                        {invoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-surface/50 transition-colors">
                                <td className="p-4 text-xs font-mono text-text-muted">#{inv.id.substring(0, 8)}</td>
                                <td className="p-4 text-sm font-bold text-text">{inv.title}</td>
                                <td className="p-4 text-sm font-black text-text">GHS {inv.amount}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${inv.status === 'Paid' ? 'bg-success/10 text-success border-success/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    {inv.status !== 'Paid' && <button className="text-primary font-bold text-xs hover:underline uppercase tracking-widest">Pay Now</button>}
                                </td>
                            </tr>

                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 text-yellow-500 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                    <AlertTriangle size={20} />
                </div>
                <p className="text-xs font-bold uppercase tracking-wide">Please note that all fee payments must be completed at least 2 weeks before the examination period.</p>
            </div>

        </div>
    );
};

export default Financials;
