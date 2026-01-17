import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, ShieldCheck, CreditCard, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import { useSettings } from '../context/SettingsContext';

const LandingPage = () => {
    const { settings } = useSettings();

    return (
        <div className="bg-background min-h-screen text-text overflow-x-hidden transition-colors duration-300">
            {/* Navigation */}
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-2 overflow-hidden">
                    {settings.schoolLogo ? (
                        <img src={`http://localhost:5000${settings.schoolLogo}`} alt="Logo" className="w-8 h-8 object-contain shrink-0" />
                    ) : (
                        <GraduationCap className="text-primary shrink-0" size={28} />
                    )}
                    <span className="text-xl sm:text-2xl font-bold font-heading truncate">{settings.schoolAbbreviation || 'GUMS'}</span>
                </div>


                <div className="flex gap-4 items-center">
                    <Link to="/login" className="hover:text-primary transition-colors hidden sm:block">Staff Login</Link>
                    <Link to="/login" className="btn btn-primary">Student Portal</Link>
                    <ThemeToggle />
                </div>
            </nav>


            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-6 max-w-7xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
                        The Future of <span className="text-primary">Learning</span> in Ghana.
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10 px-4 md:px-0">
                        A comprehensive, digital-first University Management System designed for the modern Ghanaian student and staff.
                    </p>


                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/purchase-voucher" className="btn btn-primary px-10 py-4 text-lg">
                            Apply Now <ArrowRight size={20} />
                        </Link>

                        <button className="btn bg-surface hover:bg-surface-hover text-text border border-border px-10 py-4 text-lg">
                            Explore Programs
                        </button>
                    </div>

                </motion.div>

                {/* Decorative background elements */}
                <div className="absolute top-0 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-[100px] pointer-events-none opacity-50"></div>
                <div className="absolute bottom-0 -right-20 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] pointer-events-none opacity-50"></div>
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
                        className="glass-card p-8 border border-border"
                    >
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6">
                            {f.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                        <p className="text-text-muted">{f.desc}</p>
                    </motion.div>

                ))}
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-border/10 text-center text-text-muted">
                <p>© 2026 {settings.schoolName || 'Ghana University Management System'}. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
