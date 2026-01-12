import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    Layout, Receipt, CreditCard, PieChart,
    LogOut, User as UserIcon, Bell, Search,
    TrendingUp, ArrowUpRight, ArrowDownRight,
    Plus, Download, DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AccountantDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFinanceData = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/admin/applications'); // Reusing for now, will create specific finance endpoints
                // setInvoices(data);
            } catch (err) {
                console.error("Error fetching finance data");
            } finally {
                setLoading(false);
            }
        };
        fetchFinanceData();
    }, []);

    const navItems = [
        { id: 'overview', label: 'Overview', icon: <Layout size={20} /> },
        { id: 'invoices', label: 'Invoices', icon: <Receipt size={20} /> },
        { id: 'payments', label: 'Payments', icon: <CreditCard size={20} /> },
        { id: 'payroll', label: 'Payroll', icon: <DollarSign size={20} /> },
        { id: 'reports', label: 'Reports', icon: <PieChart size={20} /> },
    ];

    return (
        <div className="bg-slate-950 min-h-screen text-slate-50 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 p-6 flex flex-col gap-10 bg-slate-950/50 backdrop-blur-xl sticky top-0 h-screen">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl">A</div>
                    <span className="text-2xl font-bold font-heading">GUMS</span>
                </div>

                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                                }`}
                        >
                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-6 p-2">
                        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                            <UserIcon size={20} className="text-slate-400" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs text-slate-500 truncate uppercase">Accountant</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 p-3 w-full text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold font-heading capitalize">
                            Financial Management
                        </h1>
                        <p className="text-slate-400 mt-1">GUMS Centralized Finance Portal</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="glass-card flex items-center gap-3 px-4 py-2 border-slate-800">
                            <Search size={18} className="text-slate-500" />
                            <input className="bg-transparent outline-none text-sm w-48" placeholder="Search records..." />
                        </div>
                        <button className="w-12 h-12 glass-card flex items-center justify-center text-slate-400 hover:text-white transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full"></span>
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="glass-card p-6 border-l-4 border-emerald-500">
                        <p className="text-slate-500 text-xs font-bold uppercase mb-2">Total Revenue</p>
                        <div className="flex items-end gap-2">
                            <h2 className="text-2xl font-bold">GHS 1.2M</h2>
                            <span className="text-emerald-500 text-xs flex items-center font-bold mb-1"><TrendingUp size={12} /> +12%</span>
                        </div>
                    </div>
                    <div className="glass-card p-6 border-l-4 border-blue-500">
                        <p className="text-slate-500 text-xs font-bold uppercase mb-2">Pending Fees</p>
                        <div className="flex items-end gap-2">
                            <h2 className="text-2xl font-bold">GHS 450K</h2>
                            <span className="text-blue-500 text-xs flex items-center font-bold mb-1">Active Term</span>
                        </div>
                    </div>
                    <div className="glass-card p-6 border-l-4 border-amber-500">
                        <p className="text-slate-500 text-xs font-bold uppercase mb-2">Voucher Sales</p>
                        <div className="flex items-end gap-2">
                            <h2 className="text-2xl font-bold">GHS 85K</h2>
                            <span className="text-amber-500 text-xs flex items-center font-bold mb-1"><Plus size={12} /> 120 Units</span>
                        </div>
                    </div>
                    <div className="glass-card p-6 border-l-4 border-purple-500">
                        <p className="text-slate-500 text-xs font-bold uppercase mb-2">Payroll Due</p>
                        <div className="flex items-end gap-2">
                            <h2 className="text-2xl font-bold">GHS 320K</h2>
                            <span className="text-slate-500 text-xs flex items-center font-bold mb-1">25th Jan</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-card p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-bold text-lg uppercase tracking-wider font-heading">Recent Payments</h3>
                            <button className="text-xs text-emerald-500 font-bold hover:underline">View All</button>
                        </div>
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-emerald-500">
                                            <ArrowUpRight size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Kwame Mensah - Tuition Fee</p>
                                            <p className="text-[10px] text-slate-500 font-medium">PAY-REF-00X{i} | MoMo Payment</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-emerald-400">+ GHS 2,500.00</p>
                                        <p className="text-[10px] text-slate-500 font-medium">10 Min ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-bold text-lg uppercase tracking-wider font-heading">Expense Overview</h3>
                            <Download size={18} className="text-slate-500 cursor-pointer hover:text-white" />
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-400">
                                    <span>Campus Utilities</span>
                                    <span>GHS 45,000 / 60,000</span>
                                </div>
                                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[75%]"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-400">
                                    <span>Staff Salaries</span>
                                    <span>GHS 280,000 / 300,000</span>
                                </div>
                                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[93%]"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-400">
                                    <span>Lab Equipment</span>
                                    <span>GHS 12,000 / 50,000</span>
                                </div>
                                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 w-[24%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AccountantDashboard;
