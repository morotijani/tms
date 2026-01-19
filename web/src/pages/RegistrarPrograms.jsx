import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Search, Loader2, BookOpen, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const RegistrarPrograms = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProgram, setEditingProgram] = useState(null);
    const [formData, setFormData] = useState({ name: '', code: '', duration: '', description: '', fee: '', faculty: '', department: '' });
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/registrar/programs');
            setPrograms(data);
        } catch (err) {
            console.error("Error fetching programs:", err.response || err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            if (editingProgram) {
                await api.put(`/admin/programs/${editingProgram.id}`, formData);
                alert("Program updated successfully");
            } else {
                await api.post('/admin/programs', formData);
                alert("Program created successfully");
            }
            setShowModal(false);
            setEditingProgram(null);
            setFormData({ name: '', code: '', duration: '', description: '', fee: '', faculty: '', department: '' });
            fetchPrograms();
        } catch (err) {
            alert("Action failed: " + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this program?")) return;
        try {
            await api.delete(`/admin/programs/${id}`);
            alert("Program deleted");
            fetchPrograms();
        } catch (err) {
            alert("Failed to delete: " + (err.response?.data?.message || err.message));
        }
    };

    const openEdit = (prog) => {
        setEditingProgram(prog);
        setFormData({
            name: prog.name,
            code: prog.code,
            duration: prog.duration,
            description: prog.description || '',
            fee: prog.fee || '',
            faculty: prog.faculty || '',
            department: prog.department || ''
        });
        setShowModal(true);
    };

    const filteredPrograms = programs.filter(prog =>
        prog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prog.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 pt-20 md:pt-8 w-full max-w-7xl mx-auto">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black font-heading text-text">Programs</h1>
                    <p className="text-text-muted font-medium">Manage academic programs.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="glass-card flex items-center gap-3 px-4 py-2 border-border bg-surface/50 w-full md:w-auto">
                        <Search className="text-text-muted" size={18} />
                        <input
                            className="bg-transparent outline-none text-sm w-full md:w-64"
                            placeholder="Search programs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => {
                            setEditingProgram(null);
                            setFormData({ name: '', code: '', duration: '', description: '', fee: '', faculty: '', department: '' });
                            setShowModal(true);
                        }}
                        className="btn bg-primary text-white hover:bg-primary-hover flex items-center justify-center gap-2 h-10 px-6 rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 transition-all"
                    >
                        + New Program
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-primary" size={48} />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPrograms.length > 0 ? filteredPrograms.map(prog => (
                        <motion.div
                            key={prog.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-6 border-border bg-surface/50 hover:border-primary/50 transition-all group relative flex flex-col h-full"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                    <BookOpen size={24} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-lg text-text group-hover:text-primary transition-colors truncate">
                                        {prog.name}
                                    </h3>
                                    <p className="text-xs font-mono text-text-muted">{prog.code}</p>
                                </div>
                            </div>

                            <p className="text-sm text-text-muted mb-6 flex-1 line-clamp-3">
                                {prog.description || "No description available."}
                            </p>

                            <div className="pt-4 border-t border-border flex justify-between items-center text-text-muted text-xs font-bold uppercase tracking-widest">
                                <span>{prog.duration} Years</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEdit(prog)}
                                        className="hover:text-primary transition-colors p-1"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(prog.id)}
                                        className="hover:text-red-500 transition-colors p-1"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full text-center py-20 bg-surface/20 rounded-2xl border border-dashed border-border">
                            <p className="text-text-muted font-bold uppercase tracking-widest text-sm">No programs found</p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="bg-surface border border-border w-full max-w-lg rounded-2xl p-6 z-10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-text">{editingProgram ? 'Edit Program' : 'New Program'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1 block">Program Name</label>
                                <input
                                    className="w-full bg-background border border-border rounded-xl p-3 text-text outline-none focus:border-primary transition-colors"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1 block">Faculty</label>
                                    <input
                                        className="w-full bg-background border border-border rounded-xl p-3 text-text outline-none focus:border-primary transition-colors"
                                        value={formData.faculty}
                                        onChange={e => setFormData({ ...formData, faculty: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1 block">Department</label>
                                    <input
                                        className="w-full bg-background border border-border rounded-xl p-3 text-text outline-none focus:border-primary transition-colors"
                                        value={formData.department}
                                        onChange={e => setFormData({ ...formData, department: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1 block">Code</label>
                                    <input
                                        className="w-full bg-background border border-border rounded-xl p-3 text-text outline-none focus:border-primary transition-colors"
                                        value={formData.code}
                                        onChange={e => setFormData({ ...formData, code: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1 block">Duration (Years)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-background border border-border rounded-xl p-3 text-text outline-none focus:border-primary transition-colors"
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1 block">Fee</label>
                                <input
                                    type="number"
                                    className="w-full bg-background border border-border rounded-xl p-3 text-text outline-none focus:border-primary transition-colors"
                                    value={formData.fee}
                                    onChange={e => setFormData({ ...formData, fee: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-text-muted mb-1 block">Description</label>
                                <textarea
                                    className="w-full bg-background border border-border rounded-xl p-3 text-text outline-none focus:border-primary transition-colors min-h-[100px]"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 px-6 rounded-xl bg-surface-hover text-text font-black uppercase text-xs tracking-widest hover:bg-border transition-colors border border-border"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="flex-1 py-3 px-6 rounded-xl bg-primary text-white font-black uppercase text-xs tracking-widest hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                >
                                    {actionLoading ? <Loader2 className="animate-spin" size={16} /> : (editingProgram ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegistrarPrograms;
