import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, ShieldCheck, CreditCard, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
    return (
        <div className="bg-slate-950 min-h-screen text-slate-50 overflow-x-hidden">
            {/* Navigation */}
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <GraduationCap className="text-blue-500" size={32} />
                    <span className="text-2xl font-bold font-heading">GUMS</span>
                </div>
                <div className="flex gap-6 items-center">
                    <Link to="/login" className="hover:text-blue-400 transition-colors">Staff Login</Link>
                    <Link to="/login" className="btn btn-primary">Student Portal</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-6 max-w-7xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        The Future of <span className="text-blue-500">Learning</span> in Ghana.
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                        A comprehensive, digital-first University Management System designed for the modern Ghanaian student and staff. Experience seamless admissions, grading, and financials.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/purchase-voucher" className="btn btn-primary px-10 py-4 text-lg">
                            Apply Now <ArrowRight size={20} />
                        </Link>

                        <button className="btn bg-slate-800 hover:bg-slate-700 px-10 py-4 text-lg">
                            Explore Programs
                        </button>
                    </div>
                </motion.div>

                {/* Decorative background elements */}
                <div className="absolute top-0 -left-20 w-72 h-72 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 -right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            </section>

            {/* Features */}
            <section className="py-20 px-6 max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                {[
                    { icon: <BookOpen />, title: "Digital Admissions", desc: "Easy online application with document verification and automated admission letters." },
                    { icon: <CreditCard />, title: "Smart Payments", desc: "Integrated with Paystack for seamless fees and voucher payments via MoMo." },
                    { icon: <ShieldCheck />, title: "Academic Excellence", desc: "Real-time GPA tracking, automated grading, and GTEC-compliant reporting." }
                ].map((f, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="glass-card p-8"
                    >
                        <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center mb-6">
                            {f.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                        <p className="text-slate-400">{f.desc}</p>
                    </motion.div>
                ))}
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-slate-800 text-center text-slate-500">
                <p>© 2026 Ghana University Management System. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
