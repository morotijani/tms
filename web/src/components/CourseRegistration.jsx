import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookPlus, CheckCircle2, Loader2, Info } from 'lucide-react';

const CourseRegistration = ({ studentData, setStudentData }) => {
    const [courses, setCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/student/available-courses');
                setCourses(data);
                // Pre-select already registered courses
                if (studentData?.Enrollments) {
                    setSelectedCourses(studentData.Enrollments.map(e => e.courseId));
                }
            } catch (err) {
                console.error("Failed to fetch courses");
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [studentData]);

    const toggleCourse = (id) => {
        if (selectedCourses.includes(id)) {
            setSelectedCourses(selectedCourses.filter(c => c !== id));
        } else {
            setSelectedCourses([...selectedCourses, id]);
        }
    };

    const handleRegister = async () => {
        setSubmitting(true);
        setMessage(null);
        try {
            await axios.post('http://localhost:5000/api/student/register-courses', {
                courseIds: selectedCourses,
                academicYear: '2025/2026',
                semester: 1
            });
            setMessage({ type: 'success', text: 'Registration successful!' });
            // Refresh dashboard data
            const { data } = await axios.get('http://localhost:5000/api/student/dashboard');
            setStudentData(data);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Registration failed' });
        } finally {
            setSubmitting(false);
        }
    };

    const totalCredits = courses
        .filter(c => selectedCourses.includes(c.id))
        .reduce((sum, c) => sum + c.creditHours, 0);

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;


    return (
        <div className="animate-fade-in space-y-8">
            <div className="glass-card p-6 bg-primary/10 border-primary/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary rounded-xl text-white"><Info size={24} /></div>
                    <div>
                        <h3 className="font-bold text-lg text-text">Registration Summary</h3>
                        <p className="text-sm text-text-muted">Total Credits Selected: <span className="text-primary font-black">{totalCredits}</span> / 21 Max</p>
                    </div>
                </div>
                <button
                    onClick={handleRegister}
                    disabled={submitting || selectedCourses.length === 0}
                    className="btn btn-primary px-8 py-3 font-black uppercase tracking-widest"
                >
                    {submitting ? <Loader2 className="animate-spin" /> : 'Confirm Registration'}
                </button>
            </div>


            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-success/5 border-success/20 text-success' : 'bg-red-500/5 border-red-500/20 text-red-500'}`}>
                    <CheckCircle2 size={20} /> <span className="text-sm font-bold uppercase tracking-wide">{message.text}</span>
                </div>

            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        onClick={() => toggleCourse(course.id)}
                        className={`cursor-pointer p-6 glass-card transition-all duration-300 border-border bg-surface/30 hover:bg-surface/50 group ${selectedCourses.includes(course.id) ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'hover:border-primary/50'}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="px-2 py-1 bg-surface-hover rounded text-[10px] font-black uppercase tracking-widest text-text-muted border border-border group-hover:border-primary/20">{course.code}</div>
                            {selectedCourses.includes(course.id) && <CheckCircle2 className="text-primary" size={20} />}
                        </div>
                        <h4 className="font-bold text-lg mb-2 text-text">{course.name}</h4>
                        <p className="text-xs text-text-muted mb-4 leading-relaxed">{course.description || 'No description available for this course.'}</p>
                        <div className="flex items-center gap-4 text-sm font-medium text-text-muted">
                            <span className="flex items-center gap-1 font-black text-primary"><BookPlus size={14} /> {course.creditHours} Credits</span>
                            <span className="w-1 h-1 bg-border rounded-full"></span>
                            <span className="font-bold">Level {course.level}</span>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default CourseRegistration;
