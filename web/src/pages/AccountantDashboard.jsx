import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    Layout, Receipt, CreditCard, PieChart,
    LogOut, User as UserIcon, Bell, Search,
    TrendingUp, ArrowUpRight, ArrowDownRight,
    Plus, Download, DollarSign, Menu, X
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import { useSettings } from '../context/SettingsContext';



const AccountantDashboard = () => {
    const { user, logout } = useAuth();
    const { settings } = useSettings();

    const [activeTab, setActiveTab] = useState('overview');
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


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
        <div className="bg-background min-h-screen text-text flex font-sans transition-colors duration-300">
            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 bg-surface/80 backdrop-blur-lg border-b border-border z-40 p-4 flex justify-between items-center transition-colors duration-300">
                <div className="flex items-center gap-2">
                    {settings.schoolLogo ? (
                        <img src={`http://localhost:5000${settings.schoolLogo}`} alt="Logo" className="w-8 h-8 object-contain" />
                    ) : (
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white">
                            {settings.schoolAbbreviation?.charAt(0) || 'A'}
                        </div>
                    )}
                    <span className="font-bold font-heading">{settings.schoolAbbreviation || 'GUMS'}</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 hover:bg-surface rounded-lg transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 border-r border-border p-6 flex flex-col gap-10 bg-surface/90 backdrop-blur-xl 
                transition-transform duration-300 transform md:relative md:translate-x-0 md:h-screen sticky top-0
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>

                <div className="flex items-center gap-3">
                    {settings.schoolLogo ? (
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-border bg-white flex items-center justify-center p-1">
                            <img src={`http://localhost:5000${settings.schoolLogo}`} alt="School Logo" className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-primary/20">
                            {settings.schoolAbbreviation?.charAt(0) || 'A'}
                        </div>
                    )}
                    <span className="text-2xl font-bold font-heading text-text">
                        {settings.schoolAbbreviation || 'GUMS'}
                    </span>
                </div>


                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setIsMobileMenuOpen(false);
                            }}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-text-muted hover:bg-surface hover:text-text'
                                }`}
                        >

                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="mt-auto space-y-4">
                    <div className="flex items-center gap-3 mb-2 p-2 bg-surface/50 border border-border rounded-xl">
                        <div className="w-10 h-10 bg-surface-hover rounded-full flex items-center justify-center border border-border text-text-muted">
                            <UserIcon size={20} />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate text-text">{user?.firstName} {user?.lastName}</p>
                            <p className="text-[10px] text-text-muted truncate uppercase tracking-widest font-bold">Accountant Portal</p>
                        </div>
                    </div>

                    <ThemeToggle />

                    <button
                        onClick={logout}
                        className="flex items-center gap-3 p-3 w-full text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-medium border border-transparent hover:border-red-500/20"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-10 pt-20 md:pt-10 transition-all duration-300">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">

                    <div>
                        <h1 className="text-3xl font-bold font-heading capitalize text-text">
                            Financial Management
                        </h1>
                        <p className="text-text-muted mt-1 px-3 py-1 bg-surface border border-border rounded-full inline-block text-[10px] font-bold uppercase tracking-widest">GUMS Centralized Finance Portal</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="glass-card flex items-center gap-3 px-4 py-2 border-border bg-surface/50 shadow-none">
                            <Search size={18} className="text-text-muted" />
                            <input className="bg-transparent outline-none text-sm w-48 text-text" placeholder="Search records..." />
                        </div>
                        <button className="w-12 h-12 glass-card flex items-center justify-center text-text-muted hover:text-text transition-colors relative border-border hover:border-primary/50 shadow-none">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full ring-2 ring-background"></span>
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Total Revenue', value: 'GH¢ 1.2M', icon: <TrendingUp size={24} />, trend: '+12%', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                        { label: 'Pending Fees', value: 'GH¢ 450K', icon: <ArrowUpRight size={24} />, trend: 'Active Term', color: 'text-primary', bg: 'bg-primary/10' },
                        { label: 'Voucher Sales', value: 'GH¢ 85K', icon: <Plus size={24} />, trend: '120 Units', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                        { label: 'Payroll Due', value: 'GH¢ 320K', icon: <DollarSign size={24} />, trend: '25th Jan', color: 'text-purple-500', bg: 'bg-purple-500/10' },
                    ].map((stat, i) => (
                        <div key={i} className="glass-card p-6 border-border bg-surface/50 group hover:border-primary/30 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                                    {stat.icon}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-wider ${stat.color}`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-black text-text mt-1">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-card p-8 border-border bg-surface/50">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-bold text-lg uppercase tracking-wider font-heading text-text">Recent Payments</h3>
                            <button className="text-xs text-primary font-bold hover:underline">View All</button>
                        </div>
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="flex justify-between items-center p-3 hover:bg-surface rounded-xl transition-colors border border-transparent hover:border-border">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                            <ArrowUpRight size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-text">Kwame Mensah - Tuition Fee</p>
                                            <p className="text-[10px] text-text-muted font-medium uppercase tracking-widest">PAY-REF-00X{i} | MoMo Payment</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-emerald-500">+ GHS 2,500.00</p>
                                        <p className="text-[10px] text-text-muted font-medium">10 Min ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-8 border-border bg-surface/50">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-bold text-lg uppercase tracking-wider font-heading text-text">Expense Overview</h3>
                            <Download size={18} className="text-text-muted cursor-pointer hover:text-primary transition-colors" />
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: 'Campus Utilities', spent: '45,000', total: '60,000', color: 'bg-primary' },
                                { label: 'Staff Salaries', spent: '280,000', total: '300,000', color: 'bg-emerald-500' },
                                { label: 'Lab Equipment', spent: '12,000', total: '50,000', color: 'bg-yellow-500' }
                            ].map((expense, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-text-muted uppercase tracking-widest">
                                        <span>{expense.label}</span>
                                        <span className="text-text">GHS {expense.spent} / {expense.total}</span>
                                    </div>
                                    <div className="h-2 bg-surface rounded-full overflow-hidden border border-border">
                                        <div
                                            className={`h-full ${expense.color} transition-all duration-1000`}
                                            style={{ width: `${(parseInt(expense.spent.replace(',', '')) / parseInt(expense.total.replace(',', ''))) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AccountantDashboard;
