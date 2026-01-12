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
                <div className="glass-card p-6 bg-gradient-to-br from-green-600/10 to-emerald-600/10">
                    <div className="flex justify-between items-start mb-4">
                        <Award className="text-green-500" size={24} />
                        <span className="text-[10px] font-bold px-2 py-1 bg-green-500/10 text-green-500 rounded-full">EXCELLENT</span>
                    </div>
                    <p className="text-slate-400 text-xs font-medium mb-1">Current CGPA</p>
                    <h3 className="text-4xl font-bold font-heading">{currentGPA.toFixed(2)}</h3>
                </div>

                <div className="glass-card p-6">
                    <div className="flex justify-between items-start mb-4">
                        <TrendingUp className="text-blue-500" size={24} />
                    </div>
                    <p className="text-slate-400 text-xs font-medium mb-1">Credits Earned</p>
                    <h3 className="text-4xl font-bold font-heading">42</h3>
                </div>

                <div className="glass-card p-6">
                    <div className="flex justify-between items-start mb-4">
                        <BarChart3 className="text-indigo-500" size={24} />
                    </div>
                    <p className="text-slate-400 text-xs font-medium mb-1">Academic Level</p>
                    <h3 className="text-4xl font-bold font-heading">200</h3>
                </div>
            </div>

            <div className="glass-card p-8">
                <div className="flex justify-between items-center mb-8">
                    <h4 className="font-bold text-xl">Semester Results (2025/2026 Sem 1)</h4>
                    <button className="btn bg-slate-800 hover:bg-slate-700 text-xs px-4 py-2"><Download size={14} /> Download Transcript</button>
                </div>

                <div className="space-y-4">
                    {results.map((res, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-slate-800 flex items-center justify-center rounded-2xl text-sm font-bold font-heading text-blue-500">{res.code}</div>
                                <div>
                                    <p className="font-bold text-slate-200">{res.name}</p>
                                    <p className="text-xs text-slate-500">Credits: 3 | Grade Point: {res.point.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-600/10 text-blue-500 font-bold text-xl">
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
