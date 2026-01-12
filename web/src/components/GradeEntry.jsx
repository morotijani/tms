import React, { useState } from 'react';
import axios from 'axios';
import { Save, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const GradeEntry = ({ enrollment, onUpdate }) => {
    const [ca, setCa] = useState(enrollment.caScore || '');
    const [exam, setExam] = useState(enrollment.examScore || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await axios.patch(`http://localhost:5000/api/staff/grades/${enrollment.id}`, {
                caScore: ca,
                examScore: exam
            });
            setSuccess(true);
            if (onUpdate) onUpdate();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update grades');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/30 p-4 rounded-xl border border-slate-800">
            <div className="flex-1 flex gap-4">
                <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">CA (30/40)</label>
                    <input
                        type="number"
                        max="40"
                        value={ca}
                        onChange={(e) => setCa(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none p-2 rounded text-sm text-center"
                        placeholder="0"
                    />
                </div>
                <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Exam (60/70)</label>
                    <input
                        type="number"
                        max="70"
                        value={exam}
                        onChange={(e) => setExam(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none p-2 rounded text-sm text-center"
                        placeholder="0"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-colors"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                </button>
                {success && <CheckCircle2 size={18} className="text-green-500" />}
                {error && <AlertCircle size={18} className="text-red-500" title={error} />}
            </div>
        </form>
    );
};

export default GradeEntry;
