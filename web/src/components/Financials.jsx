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

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-blue-500" size={40} /></div>;

    const totalOwned = invoices.reduce((sum, inv) => inv.status !== 'Paid' ? sum + parseFloat(inv.amount) : sum, 0);

    return (
        <div className="animate-fade-in space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Balance Card */}
                <div className="glass-card p-8 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border-blue-500/30 overflow-hidden relative">
                    <div className="relative z-10">
                        <p className="text-slate-400 font-medium mb-1 uppercase tracking-wider text-xs">Available Balance</p>
                        <h2 className="text-4xl font-bold mb-8">GHS {totalOwned.toFixed(2)}</h2>
                        <div className="flex gap-4">
                            <button className="btn btn-primary px-6">Pay Fees Now</button>
                            <button className="p-3 glass-card hover:bg-slate-800 transition-colors"><Download size={20} /></button>
                        </div>
                    </div>
                    {/* Decorative Card Chip */}
                    <div className="absolute top-8 right-8 w-12 h-10 bg-yellow-500/20 rounded-md border border-yellow-500/30"></div>
                    <CreditCard size={120} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
                </div>

                <div className="glass-card p-8">
                    <h4 className="font-bold flex items-center gap-2 mb-6"><History size={20} className="text-blue-500" /> Recent Transactions</h4>
                    <div className="space-y-4">
                        {invoices.length === 0 ? (
                            <p className="text-slate-500 text-sm italic py-4">No transactions found.</p>
                        ) : (
                            invoices.map((inv, i) => (
                                <div key={i} className="flex justify-between items-center py-2">
                                    <div>
                                        <p className="text-sm font-bold">{inv.title}</p>
                                        <p className="text-xs text-slate-500">{new Date(inv.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-red-400">- GHS {inv.amount}</p>
                                        <p className={`text-[10px] font-bold uppercase ${inv.status === 'Paid' ? 'text-green-500' : 'text-yellow-500'}`}>{inv.status}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-900/50 border-b border-slate-800">
                        <tr>
                            <th className="p-4 font-bold text-xs uppercase text-slate-500">Invoice ID</th>
                            <th className="p-4 font-bold text-xs uppercase text-slate-500">Service</th>
                            <th className="p-4 font-bold text-xs uppercase text-slate-500">Amount</th>
                            <th className="p-4 font-bold text-xs uppercase text-slate-500">Status</th>
                            <th className="p-4 font-bold text-xs uppercase text-slate-500">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {invoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-slate-900/30 transition-colors">
                                <td className="p-4 text-xs font-mono text-slate-400">#{inv.id.substring(0, 8)}</td>
                                <td className="p-4 text-sm font-bold">{inv.title}</td>
                                <td className="p-4 text-sm font-bold">GHS {inv.amount}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${inv.status === 'Paid' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="p-4 text-xs">
                                    {inv.status !== 'Paid' && <button className="text-blue-500 hover:underline">Pay Now</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500 text-yellow-500 rounded-xl flex items-center gap-3">
                <AlertTriangle size={20} />
                <p className="text-xs font-medium">Please note that all fee payments must be completed at least 2 weeks before the examination period.</p>
            </div>
        </div>
    );
};

export default Financials;
