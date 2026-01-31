import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Search, Loader2, Users, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const RegistrarStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            // Assuming we can search/filter users by role='student'
            // If explicit endpoint doesn't exist, we might need to add one or filter client side if list is small
            // For now, let's assume an endpoint or use /users?role=student
            const { data } = await api.get('/registrar/students');
            setStudents(data);
        } catch (err) {
            console.error("Error fetching students:", err.response || err);
            alert("Failed to fetch students. " + (err.response?.data?.message || "Verify your connection."));
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.systemId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 pt-20 md:pt-8">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black font-heading text-text">Students</h1>
                    <p className="text-text-muted font-medium">Directory of admitted students.</p>
                </div>

                <div className="glass-card flex items-center gap-3 px-4 py-2 border-border bg-surface/50 w-full md:w-auto">
                    <Search className="text-text-muted" size={18} />
                    <input
                        className="bg-transparent outline-none text-sm w-full md:w-64"
                        placeholder="Search by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-primary" size={48} />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudents.length > 0 ? filteredStudents.map(student => (
                        <motion.div
                            key={student.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-6 border-border bg-surface/50 hover:border-primary/50 transition-all group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {student.firstName[0]}{student.lastName[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-text group-hover:text-primary transition-colors">
                                        {student.firstName} {student.lastName}
                                    </h3>
                                    <p className="text-xs font-mono text-text-muted">{student.systemId}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border flex justify-between items-center text-text-muted text-xs font-bold uppercase tracking-widest">
                                <span>{student.admittedProgram?.name || 'Program N/A'}</span>
                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full text-center py-20 bg-surface/20 rounded-2xl border border-dashed border-border">
                            <p className="text-text-muted font-bold uppercase tracking-widest text-sm">No students found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RegistrarStudents;
