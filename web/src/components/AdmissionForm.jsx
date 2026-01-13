import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Save, Loader2, ChevronRight, ChevronLeft, CheckCircle, User, GraduationCap, Users, FileCheck } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

const AdmissionForm = ({ application, setApplication }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Personal Details
        firstName: '', lastName: '', otherNames: '', phoneNumber: '',
        gender: '', dateOfBirth: '', placeOfBirth: '', religion: '',
        hometown: '', district: '', region: '', maritalStatus: 'Single',
        languagesSpoken: '', ghanaPostGps: '',
        homeAddress: '', postalAddress: '',
        guardianName: '', guardianAddress: '', guardianOccupation: '', guardianContact: '',


        // Step 2: Educational Background
        secondarySchoolName: '', secondarySchoolAddress: '',
        secondarySchoolStartYear: '', secondarySchoolEndYear: '',
        results: {
            sittings: [
                { year: '', indexNo: '', aggregate: '', core: { English: '', Maths: '', Science: '' }, electives: [{ subject: '', grade: '' }, { subject: '', grade: '' }, { subject: '', grade: '' }] },
                { year: '', indexNo: '', aggregate: '', core: { English: '', Maths: '', Science: '' }, electives: [{ subject: '', grade: '' }, { subject: '', grade: '' }, { subject: '', grade: '' }] },
                { year: '', indexNo: '', aggregate: '', core: { English: '', Maths: '', Science: '' }, electives: [{ subject: '', grade: '' }, { subject: '', grade: '' }, { subject: '', grade: '' }] }
            ]
        },

        // Step 3: Program Selection
        firstChoiceId: '', secondChoiceId: '', thirdChoiceId: '',

        // Step 4: Referee & Declaration
        refereeName: '', refereeAddress: '', refereeContact: '',
        declarationAccepted: false
    });

    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const { data } = await api.get('/admission/programs');
                setPrograms(data);
            } catch (err) {
                console.error("Error fetching programs:", err);
            }
        };
        fetchPrograms();


        if (application) {
            // Merge application data and nested user data
            setFormData(prev => ({
                ...prev,
                ...application,
                ...(application.User || {}),
                firstChoiceId: application.firstChoiceId || '',
                secondChoiceId: application.secondChoiceId || '',
                thirdChoiceId: application.thirdChoiceId || '',
                results: application.results || prev.results
            }));
        }
    }, [application]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleResultChange = (sittingIndex, field, value, subField = null, electiveIndex = null) => {
        const newSittings = [...formData.results.sittings];
        if (subField === 'core') {
            newSittings[sittingIndex].core[field] = value;
        } else if (subField === 'electives') {
            newSittings[sittingIndex].electives[electiveIndex][field] = value;
        } else {
            newSittings[sittingIndex][field] = value;
        }
        setFormData(prev => ({ ...prev, results: { sittings: newSittings } }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setSuccess(false);
        try {
            const { data } = await api.post('/admission/apply', formData);
            setApplication(data.application);
            setSuccess(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save form');
        } finally {
            setLoading(false);
        }
    };


    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const steps = [
        { id: 1, label: 'Personal', icon: <User size={18} /> },
        { id: 2, label: 'Educational', icon: <GraduationCap size={18} /> },
        { id: 3, label: 'Programs', icon: <FileCheck size={18} /> },
        { id: 4, label: 'Referee', icon: <Users size={18} /> }
    ];

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 animate-fade-in">
            {/* Stepper Header */}
            <div className="flex justify-between items-center mb-12 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>
                {steps.map((s) => (
                    <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${step >= s.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                            {step > s.id ? <CheckCircle size={20} /> : s.icon}
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${step >= s.id ? 'text-blue-500' : 'text-slate-500'}`}>{s.label}</span>
                    </div>
                ))}
            </div>

            {success && (
                <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-lg mb-8 text-center flex items-center justify-center gap-2">
                    <CheckCircle size={20} /> Form saved successfully! Your progress is secured.
                </div>
            )}

            <div className="glass-card p-10 border-slate-800 bg-slate-900/40">
                <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="step1" className="space-y-8">
                                <h2 className="text-2xl font-bold border-l-4 border-blue-600 pl-4">Personal Details</h2>

                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="form-group">
                                        <label className="label">First Name</label>
                                        <input required name="firstName" value={formData.firstName} onChange={handleChange} className="input-field" placeholder="Kofi" />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Last Name</label>
                                        <input required name="lastName" value={formData.lastName} onChange={handleChange} className="input-field" placeholder="Mensah" />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Other Names</label>
                                        <input name="otherNames" value={formData.otherNames} onChange={handleChange} className="input-field" placeholder="Kwame" />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-4 gap-6">
                                    <div className="form-group">
                                        <label className="label">Date of Birth</label>
                                        <input required type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="input-field" />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Gender</label>
                                        <select required name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Marital Status</label>
                                        <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="input-field">
                                            <option value="Single">Single</option>
                                            <option value="Married">Married</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Religion</label>
                                        <input name="religion" value={formData.religion} onChange={handleChange} className="input-field" placeholder="Christianity" />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="form-group">
                                        <label className="label">Place of Birth</label>
                                        <input name="placeOfBirth" value={formData.placeOfBirth} onChange={handleChange} className="input-field" placeholder="Accra" />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Hometown</label>
                                        <input name="hometown" value={formData.hometown} onChange={handleChange} className="input-field" placeholder="Kumasi" />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">District</label>
                                        <input name="district" value={formData.district} onChange={handleChange} className="input-field" placeholder="KMA" />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Region</label>
                                        <input name="region" value={formData.region} onChange={handleChange} className="input-field" placeholder="Greater Accra" />
                                    </div>

                                </div>

                                <div className="grid md:grid-cols-2 gap-6 pt-4">
                                    <div className="form-group">
                                        <label className="label">Permanent Home Address</label>
                                        <input name="homeAddress" value={formData.homeAddress} onChange={handleChange} className="input-field" placeholder="House No. 123, Street Name" />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Permanent Postal Address</label>
                                        <input name="postalAddress" value={formData.postalAddress} onChange={handleChange} className="input-field" placeholder="P.O. Box 789, Accra" />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">

                                    <div className="form-group">
                                        <label className="label">Languages Spoken</label>
                                        <input name="languagesSpoken" value={formData.languagesSpoken} onChange={handleChange} className="input-field" placeholder="English, Twi, Ga" />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Ghana Post GPS</label>
                                        <input required name="ghanaPostGps" value={formData.ghanaPostGps} onChange={handleChange} className="input-field" placeholder="GA-123-4567" />
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold pt-6 text-blue-500">Parent or Guardian Information</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="form-group">
                                        <label className="label">Full Name</label>
                                        <input name="guardianName" value={formData.guardianName} onChange={handleChange} className="input-field" />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Contact Number</label>
                                        <input name="guardianContact" value={formData.guardianContact} onChange={handleChange} className="input-field" />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Occupation</label>
                                        <input name="guardianOccupation" value={formData.guardianOccupation} onChange={handleChange} className="input-field" />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Permanent Address</label>
                                        <input name="guardianAddress" value={formData.guardianAddress} onChange={handleChange} className="input-field" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="step2" className="space-y-8">
                                <h2 className="text-2xl font-bold border-l-4 border-blue-600 pl-4">Educational Background</h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="form-group">
                                        <label className="label">Secondary School Attended</label>
                                        <input name="secondarySchoolName" value={formData.secondarySchoolName} onChange={handleChange} className="input-field" placeholder="Prempeh College" />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">School Address</label>
                                        <input name="secondarySchoolAddress" value={formData.secondarySchoolAddress} onChange={handleChange} className="input-field" />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">From (Year)</label>
                                        <input type="number" name="secondarySchoolStartYear" value={formData.secondarySchoolStartYear} onChange={handleChange} className="input-field" />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">To (Year)</label>
                                        <input type="number" name="secondarySchoolEndYear" value={formData.secondarySchoolEndYear} onChange={handleChange} className="input-field" />
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold pt-6 text-blue-500">WASSCE / SSCE Results</h3>
                                {formData.results.sittings.map((sit, sIdx) => (
                                    <div key={sIdx} className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-6">
                                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                                            <span className="text-sm font-black text-slate-500 uppercase tracking-tighter">Sitting {sIdx + 1}</span>
                                            <div className="flex gap-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-slate-500">Year:</span>
                                                    <input type="number" value={sit.year} onChange={(e) => handleResultChange(sIdx, 'year', e.target.value)} className="w-16 bg-transparent border-b border-slate-700 text-xs focus:border-blue-500 outline-none" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-slate-500">Index No:</span>
                                                    <input value={sit.indexNo} onChange={(e) => handleResultChange(sIdx, 'indexNo', e.target.value)} className="w-24 bg-transparent border-b border-slate-700 text-xs focus:border-blue-500 outline-none" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid lg:grid-cols-2 gap-8">
                                            {/* Core Subjects */}
                                            <div className="space-y-3">
                                                <p className="text-xs font-bold text-blue-400 uppercase">Core Subjects</p>
                                                {Object.keys(sit.core).map((sub) => (
                                                    <div key={sub} className="flex items-center justify-between gap-4">
                                                        <span className="text-sm text-slate-300">{sub}</span>
                                                        <select value={sit.core[sub]} onChange={(e) => handleResultChange(sIdx, sub, e.target.value, 'core')} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs">
                                                            <option value="">Grade</option>
                                                            {['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'].map(g => <option key={g} value={g}>{g}</option>)}
                                                        </select>
                                                    </div>
                                                ))}
                                            </div>
                                            {/* Elective Subjects */}
                                            <div className="space-y-3">
                                                <p className="text-xs font-bold text-blue-400 uppercase">Elective Subjects</p>
                                                {sit.electives.map((el, eIdx) => (
                                                    <div key={eIdx} className="flex gap-2">
                                                        <input value={el.subject} onChange={(e) => handleResultChange(sIdx, 'subject', e.target.value, 'electives', eIdx)} placeholder="Subject" className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs" />
                                                        <select value={el.grade} onChange={(e) => handleResultChange(sIdx, 'grade', e.target.value, 'electives', eIdx)} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs">
                                                            <option value="">Grade</option>
                                                            {['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'].map(g => <option key={g} value={g}>{g}</option>)}
                                                        </select>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="step3" className="space-y-8">
                                <h2 className="text-2xl font-bold border-l-4 border-blue-600 pl-4">Program Selection</h2>
                                <p className="text-slate-400">Please select three programs in order of preference.</p>

                                <div className="space-y-6">
                                    <div className="form-group pb-4 border-b border-slate-800/50">
                                        <label className="label text-blue-500 uppercase tracking-widest text-[10px]">First Choice</label>
                                        <select required name="firstChoiceId" value={formData.firstChoiceId} onChange={handleChange} className="input-field text-lg font-bold">
                                            <option value="">Select Primary Program</option>
                                            {programs.map(p => <option key={p.id} value={p.id}>{p.name} ({p.level})</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group pb-4 border-b border-slate-800/50">
                                        <label className="label uppercase tracking-widest text-[10px]">Second Choice</label>
                                        <select required name="secondChoiceId" value={formData.secondChoiceId} onChange={handleChange} className="input-field text-lg">
                                            <option value="">Select Secondary Program</option>
                                            {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="label uppercase tracking-widest text-[10px]">Third Choice</label>
                                        <select required name="thirdChoiceId" value={formData.thirdChoiceId} onChange={handleChange} className="input-field text-lg">
                                            <option value="">Select Third Option</option>
                                            {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="step4" className="space-y-8">
                                <h2 className="text-2xl font-bold border-l-4 border-blue-600 pl-4">Referee & Declaration</h2>

                                <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-xl text-sm italic text-slate-400">
                                    NB: Referee must be a Doctor, Senior Police / Army Officer, Head of Institution, or Reverend Minister / Clergy.
                                </div>

                                <div className="grid md:grid-cols-1 gap-6">
                                    <div className="form-group">
                                        <label className="label">Referee Full Name</label>
                                        <input required name="refereeName" value={formData.refereeName} onChange={handleChange} className="input-field" />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Referee Address</label>
                                        <input required name="refereeAddress" value={formData.refereeAddress} onChange={handleChange} className="input-field" />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Referee Contact</label>
                                        <input required name="refereeContact" value={formData.refereeContact} onChange={handleChange} className="input-field" />
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-800">
                                    <h3 className="text-lg font-bold mb-4 uppercase tracking-tighter">Declaration</h3>
                                    <label className="flex items-start gap-4 cursor-pointer group">
                                        <div className="pt-1">
                                            <input required type="checkbox" checked={formData.declarationAccepted} onChange={(e) => setFormData({ ...formData, declarationAccepted: e.target.checked })} className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500" />
                                        </div>
                                        <p className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
                                            I hereby declare that the information given above is true and accurate to the best of my knowledge. I understand that any false information provided may lead to my disqualification or dismissal if already admitted.
                                        </p>
                                    </label>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-800">
                        <button type="button" onClick={prevStep} disabled={step === 1 || loading} className={`btn flex items-center gap-2 ${step === 1 ? 'opacity-0' : 'bg-slate-800 hover:bg-slate-700'}`}>
                            <ChevronLeft size={20} /> Previous
                        </button>

                        <div className="flex gap-4">
                            <button type="submit" disabled={loading} className="btn bg-slate-800 hover:bg-green-600/20 text-green-500 border border-green-500/20 flex items-center gap-2">
                                {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Progress</>}
                            </button>

                            {step < 4 ? (
                                <button type="button" onClick={nextStep} className="btn btn-primary px-8 flex items-center gap-2 shadow-xl shadow-blue-500/20">
                                    Next Step <ChevronRight size={20} />
                                </button>
                            ) : (
                                <button type="submit" disabled={loading || !formData.declarationAccepted} className="btn btn-primary px-10 flex items-center gap-2 bg-green-600 hover:bg-green-500 border-green-600 shadow-xl shadow-green-500/20">
                                    {loading ? <Loader2 className="animate-spin" /> : <>Final Submission <CheckCircle size={20} /></>}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            <p className="text-center text-slate-500 text-xs mt-8">
                © 2026 Ghana University Management System. Secure Digital Application Portal.
            </p>
        </div>
    );
};

export default AdmissionForm;
