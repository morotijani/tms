import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Loader2 } from 'lucide-react';

const AdmissionForm = ({ application, setApplication }) => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', otherNames: '', phoneNumber: '',
        gender: '', dateOfBirth: '', ghanaPostGps: '',
        firstChoiceId: '', secondChoiceId: '',
        examType: '', indexNumber: '', examYear: ''
    });
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchPrograms = async () => {
            const { data } = await axios.get('http://localhost:5000/api/admission/programs');
            setPrograms(data);
        };
        fetchPrograms();

        if (application) {
            setFormData({
                ...formData,
                ...application, // Map existing data if any
                firstChoiceId: application.firstChoiceId || '',
                secondChoiceId: application.secondChoiceId || ''
            });
        }
    }, [application]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        try {
            const { data } = await axios.post('http://localhost:5000/api/admission/apply', formData);
            setApplication(data.application);
            setSuccess(true);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save form');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card p-8 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Personal & Academic Details</h2>

            {success && (
                <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-lg mb-8">
                    Form saved successfully! You can now proceed to upload documents.
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">First Name</label>
                        <input
                            required className="input-field"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Last Name</label>
                        <input
                            required className="input-field"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Other Names</label>
                        <input
                            className="input-field"
                            value={formData.otherNames}
                            onChange={(e) => setFormData({ ...formData, otherNames: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <input
                            required className="input-field"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Gender</label>
                        <select
                            required className="input-field"
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Ghana Post GPS</label>
                        <input
                            required className="input-field"
                            placeholder="GW-1234-5678"
                            value={formData.ghanaPostGps}
                            onChange={(e) => setFormData({ ...formData, ghanaPostGps: e.target.value })}
                        />
                    </div>
                </div>

                <hr className="border-slate-800" />

                <h3 className="text-lg font-bold text-blue-500">Program Selection</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">First Choice Program</label>
                        <select
                            required className="input-field"
                            value={formData.firstChoiceId}
                            onChange={(e) => setFormData({ ...formData, firstChoiceId: e.target.value })}
                        >
                            <option value="">Select Program</option>
                            {programs.map(p => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Second Choice Program</label>
                        <select
                            required className="input-field"
                            value={formData.secondChoiceId}
                            onChange={(e) => setFormData({ ...formData, secondChoiceId: e.target.value })}
                        >
                            <option value="">Select Program</option>
                            {programs.map(p => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
                        </select>
                    </div>
                </div>

                <hr className="border-slate-800" />

                <h3 className="text-lg font-bold text-blue-500">Examination Results (WASSCE/SSCE)</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Exam Type</label>
                        <input required className="input-field" placeholder="WASSCE" value={formData.examType} onChange={(e) => setFormData({ ...formData, examType: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Index Number</label>
                        <input required className="input-field" value={formData.indexNumber} onChange={(e) => setFormData({ ...formData, indexNumber: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Year</label>
                        <input required type="number" className="input-field" value={formData.examYear} onChange={(e) => setFormData({ ...formData, examYear: e.target.value })} />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary px-12 py-3">
                    {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Application Form</>}
                </button>
            </form>
        </div>
    );
};

export default AdmissionForm;
