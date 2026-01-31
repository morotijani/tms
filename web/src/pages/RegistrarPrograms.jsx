import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Search, Loader2, BookOpen, ChevronRight, Trash2, X, Edit2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RegistrarPrograms = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProgram, setEditingProgram] = useState(null);
    const [formData, setFormData] = useState({ name: '', code: '', duration: '', description: '', fee: '', faculty: '', department: '' });
    const [actionLoading, setActionLoading] = useState(false);

    // Course management state
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [courses, setCourses] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [editingCourse, setEditingCourse] = useState(null);
    const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);
    const [courseFormData, setCourseFormData] = useState({
        name: '', code: '', creditHours: '', semester: '1', level: '100', description: '', instructorId: ''
    });
    const [courseLoading, setCourseLoading] = useState(false);
    const [staff, setStaff] = useState([]);

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

    const fetchStaff = async () => {
        try {
            const { data } = await api.get('/admin/staff');
            setStaff(data);
        } catch (err) {
            console.error("Error fetching staff:", err);
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

    const fetchCourses = async (programId) => {
        setCourseLoading(true);
        try {
            const { data } = await api.get(`/admin/courses/program/${programId}`);
            setCourses(data);
        } catch (err) {
            console.error("Error fetching courses:", err);
        } finally {
            setCourseLoading(false);
        }
    };

    const handleCourseSubmit = async (e) => {
        e.preventDefault();

        // Simple validation
        if (!courseFormData.code || !courseFormData.name || !courseFormData.creditHours || !courseFormData.instructorId) {
            alert("Please fill in code, name, credits, and select an instructor");
            return;
        }

        setActionLoading(true);
        try {
            if (editingCourse) {
                await api.put(`/ admin / courses / ${editingCourse.id} `, courseFormData);
                alert("Course updated successfully");
            } else {
                await api.post('/admin/courses', { ...courseFormData, programId: selectedProgram.id });
                alert("Course added successfully");
            }
            setCourseFormData({ name: '', code: '', creditHours: '', semester: '1', level: '100', description: '', instructorId: '' });
            setEditingCourse(null);
            fetchCourses(selectedProgram.id);
        } catch (err) {
            alert("Action failed: " + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteCourse = async (id) => {
        if (!window.confirm("Delete this course?")) return;
        try {
            await api.delete(`/ admin / courses / ${id} `);
            fetchCourses(selectedProgram.id);
        } catch (err) {
            alert("Failed to delete course");
        }
    };

    const openCourseManager = (prog) => {
        setSelectedProgram(prog);
        setShowCourseModal(true);
        fetchCourses(prog.id);
        fetchStaff();
    };

    const startEditingCourse = (course) => {
        setEditingCourse(course);
        setCourseFormData({
            name: course.name,
            code: course.code,
            creditHours: course.creditHours,
            semester: course.semester.toString(),
            level: course.level.toString(),
            description: course.description || '',
            instructorId: course.instructorId || ''
        });
    };

    const cancelEditingCourse = () => {
        setEditingCourse(null);
        setCourseFormData({ name: '', code: '', creditHours: '', semester: '1', level: '100', description: '', instructorId: '' });
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
                                        onClick={() => openCourseManager(prog)}
                                        className="hover:text-primary transition-colors p-1"
                                    >
                                        Courses
                                    </button>
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

            {/* Course Manager Modal */}
            {showCourseModal && selectedProgram && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowCourseModal(false)}></div>
                    <div className="bg-surface border border-border w-full max-w-4xl rounded-3xl p-8 z-10 shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col">
                        <header className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-3xl font-black uppercase tracking-tight text-text">
                                    Manage Courses
                                </h2>
                                <p className="text-primary font-bold uppercase text-[10px] tracking-widest mt-1">
                                    {selectedProgram.name} ({selectedProgram.code})
                                </p>
                            </div>
                            <button onClick={() => {
                                setShowCourseModal(false);
                                setEditingCourse(null);
                                setSelectedCourseDetails(null);
                                setCourseFormData({ name: '', code: '', creditHours: '', semester: '1', level: '100', description: '', instructorId: '' });
                            }} className="p-2 hover:bg-surface-hover rounded-xl text-text-muted transition-colors">
                                <X size={24} />
                            </button>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
                            {/* Add/Edit Course Form */}
                            <div className="lg:col-span-1 border-r border-border pr-0 lg:pr-8 overflow-y-auto">
                                <h3 className="text-xs font-black uppercase tracking-widest text-text-muted mb-6">
                                    {editingCourse ? 'Update Course' : 'Add New Course'}
                                </h3>
                                <form onSubmit={handleCourseSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text/40 mb-1 block">Course Code</label>
                                        <input
                                            className="w-full bg-background border border-border rounded-xl p-3 text-sm text-text outline-none focus:border-primary transition-colors font-mono"
                                            placeholder="e.g. CS101"
                                            value={courseFormData.code}
                                            onChange={e => setCourseFormData({ ...courseFormData, code: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text/40 mb-1 block">Course Title</label>
                                        <input
                                            className="w-full bg-background border border-border rounded-xl p-3 text-sm text-text outline-none focus:border-primary transition-colors"
                                            placeholder="e.g. Intro to Programming"
                                            value={courseFormData.name}
                                            onChange={e => setCourseFormData({ ...courseFormData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-text/40 mb-1 block">Credits</label>
                                            <input
                                                type="number"
                                                className="w-full bg-background border border-border rounded-xl p-3 text-sm text-text outline-none focus:border-primary transition-colors"
                                                placeholder="3"
                                                value={courseFormData.creditHours}
                                                onChange={e => setCourseFormData({ ...courseFormData, creditHours: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-text/40 mb-1 block">Level</label>
                                            <select
                                                className="w-full bg-background border border-border rounded-xl p-3 text-sm text-text outline-none focus:border-primary transition-colors"
                                                value={courseFormData.level}
                                                onChange={e => setCourseFormData({ ...courseFormData, level: e.target.value })}
                                                required
                                            >
                                                <option value="100">100</option>
                                                <option value="200">200</option>
                                                <option value="300">300</option>
                                                <option value="400">400</option>
                                                <option value="500">500</option>
                                                <option value="600">600</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-text/40 mb-1 block">Semester</label>
                                            <select
                                                className="w-full bg-background border border-border rounded-xl p-3 text-sm text-text outline-none focus:border-primary transition-colors"
                                                value={courseFormData.semester}
                                                onChange={e => setCourseFormData({ ...courseFormData, semester: e.target.value })}
                                            >
                                                <option value="1">1st Sem</option>
                                                <option value="2">2nd Sem</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-text/40 mb-1 block">Instructor</label>
                                            <select
                                                className="w-full bg-background border border-border rounded-xl p-3 text-sm text-text outline-none focus:border-primary transition-colors"
                                                value={courseFormData.instructorId}
                                                onChange={e => setCourseFormData({ ...courseFormData, instructorId: e.target.value })}
                                            >
                                                <option value="">Select Instructor</option>
                                                {staff.map(s => (
                                                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-text/40 mb-1 block">Description</label>
                                        <textarea
                                            className="w-full bg-background border border-border rounded-xl p-3 text-sm text-text outline-none focus:border-primary transition-colors min-h-[80px]"
                                            placeholder="Course description..."
                                            value={courseFormData.description}
                                            onChange={e => setCourseFormData({ ...courseFormData, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        {editingCourse && (
                                            <button
                                                type="button"
                                                onClick={cancelEditingCourse}
                                                className="flex-1 py-4 bg-surface-hover text-text font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-border transition-colors border border-border"
                                            >
                                                Cancel Edit
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={actionLoading}
                                            className="flex-1 py-4 bg-primary text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                        >
                                            {actionLoading ? <Loader2 className="animate-spin" size={16} /> : (editingCourse ? 'Update Course' : '+ Add Course')}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Course List */}
                            <div className="lg:col-span-2 overflow-y-auto pr-2 custom-scrollbar">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">Existing Courses</h3>
                                    {selectedCourseDetails && (
                                        <button
                                            onClick={() => setSelectedCourseDetails(null)}
                                            className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
                                        >
                                            Back to List
                                        </button>
                                    )}
                                </div>

                                {courseLoading ? (
                                    <div className="flex justify-center py-10">
                                        <Loader2 className="animate-spin text-primary" size={32} />
                                    </div>
                                ) : (
                                    <div className="space-y-3 relative">
                                        <AnimatePresence mode="wait">
                                            {selectedCourseDetails ? (
                                                <motion.div
                                                    key="details"
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    className="glass-card p-6 border-primary/30 bg-primary/5 rounded-2xl"
                                                >
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <span className="text-xs font-black bg-primary text-white px-3 py-1 rounded-lg uppercase tracking-widest">
                                                                    {selectedCourseDetails.code}
                                                                </span>
                                                                <h4 className="text-xl font-black text-text uppercase tracking-tight">
                                                                    {selectedCourseDetails.name}
                                                                </h4>
                                                            </div>
                                                            <div className="flex gap-4">
                                                                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Level {selectedCourseDetails.level}</span>
                                                                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{selectedCourseDetails.creditHours} Credits</span>
                                                                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Semester {selectedCourseDetails.semester}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => startEditingCourse(selectedCourseDetails)}
                                                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-hover text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                                                            >
                                                                <Edit2 size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    handleDeleteCourse(selectedCourseDetails.id);
                                                                    setSelectedCourseDetails(null);
                                                                }}
                                                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-hover text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div>
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-text/40 mb-2 block">Instructor</label>
                                                            <p className="text-sm font-bold text-text">
                                                                {selectedCourseDetails.instructor ?
                                                                    `${selectedCourseDetails.instructor.firstName} ${selectedCourseDetails.instructor.lastName} (${selectedCourseDetails.instructor.email})` :
                                                                    "Not Assigned"}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-black uppercase tracking-widest text-text/40 mb-2 block">Description</label>
                                                            <p className="text-sm text-text-muted leading-relaxed">
                                                                {selectedCourseDetails.description || "No description provided for this course."}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="list"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className="space-y-3"
                                                >
                                                    {courses.length > 0 ? courses.map(course => (
                                                        <div
                                                            key={course.id}
                                                            className="glass-card p-4 border-border bg-background/50 flex justify-between items-center group hover:border-primary/50 transition-all cursor-pointer"
                                                            onClick={() => setSelectedCourseDetails(course)}
                                                        >
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded uppercase tracking-widest">{course.code}</span>
                                                                    <span className="text-sm font-bold text-text uppercase tracking-tight">{course.name}</span>
                                                                </div>
                                                                <div className="flex gap-4 mt-1">
                                                                    <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">{course.creditHours} Credits</span>
                                                                    <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Sem {course.semester}</span>
                                                                    <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Level {course.level}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                                                <button
                                                                    onClick={() => setSelectedCourseDetails(course)}
                                                                    className="p-2 text-text-muted hover:text-primary transition-colors"
                                                                    title="View Details"
                                                                >
                                                                    <Info size={18} />
                                                                </button>
                                                                <button
                                                                    onClick={() => startEditingCourse(course)}
                                                                    className="p-2 text-text-muted hover:text-primary transition-colors"
                                                                    title="Edit Course"
                                                                >
                                                                    <Edit2 size={18} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteCourse(course.id)}
                                                                    className="p-2 text-text-muted hover:text-red-500 transition-colors"
                                                                    title="Delete Course"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )) : (
                                                        <div className="text-center py-10 border border-dashed border-border rounded-2xl">
                                                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">No courses added yet</p>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
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
