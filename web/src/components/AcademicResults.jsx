import React from 'react';
import { Award, TrendingUp, BarChart3, Download } from 'lucide-react';

const AcademicResults = () => {
    // Mock data for results (Phase 2)
    const results = [
        { code: 'CS101', name: 'Introduction to Computing', grade: 'A', point: 4.0 },
        { code: 'MATH101', name: 'Applied Mathematics', grade: 'B+', point: 3.5 },
        { code: 'ENG101', name: 'Communication Skills', grade: 'A', point: 4.0 },
        { code: 'ECON101', name: 'Principles of Economics', grade: 'B', point: 3.0 },
    ];

    const currentGPA = 3.63;

    return (
        <div className="animate-fade-in space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 bg-gradient-to-br from-success/20 to-success/10 border-success/30 shadow-lg shadow-success/5">
                    <div className="flex justify-between items-start mb-4">
                        <Award className="text-success" size={24} />
                        <span className="text-[10px] font-black px-3 py-1 bg-success/10 text-success rounded-full border border-success/20 tracking-widest uppercase">Excellent</span>
                    </div>
                    <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-1">Current CGPA</p>
                    <h3 className="text-4xl font-black font-heading text-text">{currentGPA.toFixed(2)}</h3>
                </div>


                <div className="glass-card p-6 border-border bg-surface/50">
                    <div className="flex justify-between items-start mb-4">
                        <TrendingUp className="text-primary" size={24} />
                        <span className="text-[10px] font-black px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20 tracking-widest uppercase">Verified</span>
                    </div>
                    <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-1">Credits Earned</p>
                    <h3 className="text-4xl font-black font-heading text-text">42</h3>
                </div>


                <div className="glass-card p-6 border-border bg-surface/50">
                    <div className="flex justify-between items-start mb-4">
                        <BarChart3 className="text-purple-500" size={24} />
                    </div>
                    <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-1">Academic Level</p>
                    <h3 className="text-4xl font-black font-heading text-text">200</h3>
                </div>

            </div>

            <div className="glass-card p-8 border-border bg-surface/50 shadow-none">
                <div className="flex justify-between items-center mb-8">
                    <h4 className="font-bold text-xl text-text uppercase tracking-tight">Semester Results (2025/2026 Sem 1)</h4>
                    <button className="btn btn-primary text-xs px-6 py-3 font-bold uppercase tracking-widest"><Download size={14} /> Download Transcript</button>
                </div>


                <div className="space-y-4">
                    {results.map((res, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-background/50 rounded-2xl border border-border hover:border-primary/30 transition-all group">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-surface flex items-center justify-center rounded-2xl text-[10px] font-black tracking-tighter text-primary border border-border group-hover:border-primary/20">{res.code}</div>
                                <div>
                                    <p className="font-bold text-text">{res.name}</p>
                                    <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">Credits: 3 | Grade Point: {res.point.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary font-black text-xl border border-primary/20 shadow-lg shadow-primary/5">
                                    {res.grade}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default AcademicResults;
