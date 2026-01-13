import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Save, Loader2, ChevronRight, ChevronLeft, CheckCircle, User, GraduationCap, Users, FileCheck, Plus, Trash2, Printer } from 'lucide-react';


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
                results: (application.results && application.results.sittings && application.results.sittings.length > 0) ? application.results : prev.results
            }));
        }


    }, [application]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleResultChange = (sittingIndex, field, value, subField = null, electiveIndex = null) => {
        const newResults = JSON.parse(JSON.stringify(formData.results));
        const sitting = newResults.sittings[sittingIndex];

        if (subField === 'core') {
            sitting.core[field] = value;
        } else if (subField === 'electives') {
            sitting.electives[electiveIndex][field] = value;
        } else {
            sitting[field] = value;
        }
        setFormData(prev => ({ ...prev, results: newResults }));
    };

    const addSitting = () => {
        if (formData.results.sittings.length < 3) {
            const newSitting = { year: '', indexNo: '', aggregate: '', core: { English: '', Maths: '', Science: '' }, electives: [{ subject: '', grade: '' }, { subject: '', grade: '' }, { subject: '', grade: '' }] };
            setFormData(prev => ({
                ...prev,
                results: {
                    ...prev.results,
                    sittings: [...prev.results.sittings, newSitting]
                }
            }));
        }
    };

    const removeSitting = (index) => {
        if (formData.results.sittings.length > 1) {
            setFormData(prev => ({
                ...prev,
                results: {
                    ...prev.results,
                    sittings: prev.results.sittings.filter((_, i) => i !== index)
                }
            }));
        }
    };


    const handleSubmit = async (e, forceStatus = null) => {
        if (e) e.preventDefault();
        setLoading(true);
        setSuccess(false);
        try {
            const status = forceStatus || (step === 4 ? 'Submitted' : 'Draft');
            const { data } = await api.post('/admission/apply', { ...formData, status });
            setApplication(data.application);
            setSuccess(true);

            if (status === 'Submitted') {
                setShowPreview(true);
            }

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

    const [showPreview, setShowPreview] = useState(false);

    if (showPreview) {
        return (
            <div className="max-w-5xl mx-auto py-10 px-4">
                <div className="flex justify-between items-center mb-8 no-print">
                    <button onClick={() => setShowPreview(false)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors uppercase text-xs font-bold">
                        <ChevronLeft size={16} /> Back to Edit
                    </button>
                    <button onClick={() => window.print()} className="btn btn-primary flex items-center gap-2">
                        <Printer size={18} /> Print / Save as PDF
                    </button>
                </div>

                <div className="bg-white text-slate-900 p-12 rounded-2xl shadow-2xl print:shadow-none print:p-0 min-h-[297mm]">
                    <div className="flex justify-between items-start border-b-4 border-slate-900 pb-8 mb-8">
                        <div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">University Application</h1>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Academic Year 2025/2026</p>
                        </div>
                        <div className="text-right">
                            <div className="w-32 h-32 bg-slate-100 rounded-xl border-2 border-slate-200 flex items-center justify-center overflow-hidden">
                                {application?.passportPhoto ? (
                                    <img src={`http://localhost:5000${application.passportPhoto}`} alt="Passport" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-[10px] text-slate-400 font-bold">Passport Photo</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-12 mb-12">
                        <div className="col-span-2 space-y-8">
                            <section>
                                <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 mb-4 border-b border-slate-100 pb-2">Personal Details</h3>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                    <div><p className="text-[10px] font-bold text-slate-400 uppercase">Full Name</p><p className="font-bold uppercase text-sm">{formData.firstName} {formData.otherNames} {formData.lastName}</p></div>
                                    <div><p className="text-[10px] font-bold text-slate-400 uppercase">Email</p><p className="font-bold text-sm">{formData.email}</p></div>
                                    <div><p className="text-[10px] font-bold text-slate-400 uppercase">Phone</p><p className="font-bold text-sm">{formData.phoneNumber}</p></div>
                                    <div><p className="text-[10px] font-bold text-slate-400 uppercase">Gender / DOB</p><p className="font-bold text-sm">{formData.gender} / {formData.dateOfBirth}</p></div>
                                    <div className="col-span-2"><p className="text-[10px] font-bold text-slate-400 uppercase">Address</p><p className="font-bold text-sm">{formData.homeAddress}</p></div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 mb-4 border-b border-slate-100 pb-2">Program Choices</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-4 items-center">
                                        <span className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">1</span>
                                        <p className="font-bold uppercase text-sm">{programs.find(p => p.id === formData.firstChoiceId)?.name || 'Not Selected'}</p>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <span className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center font-bold text-[10px]">2</span>
                                        <p className="font-bold uppercase text-sm">{programs.find(p => p.id === formData.secondChoiceId)?.name || 'Not Selected'}</p>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <span className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center font-bold text-[10px]">3</span>
                                        <p className="font-bold uppercase text-sm">{programs.find(p => p.id === formData.thirdChoiceId)?.name || 'Not Selected'}</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="space-y-8 border-l border-slate-100 pl-8">
                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Guardian Info</h3>
                                <p className="font-bold text-sm uppercase mb-1">{formData.guardianName}</p>
                                <p className="text-xs text-slate-500 mb-4">{formData.guardianOccupation}</p>
                                <p className="text-xs font-mono">{formData.guardianContact}</p>
                            </section>
                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Referee</h3>
                                <p className="font-bold text-sm uppercase mb-1">{formData.refereeName}</p>
                                <p className="text-xs text-slate-500">{formData.refereeContact}</p>
                            </section>
                        </div>
                    </div>

                    <section className="mb-12">
                        <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 mb-4 border-b border-slate-100 pb-2">Academic History</h3>
                        <p className="text-xs font-bold mb-4 uppercase">{formData.secondarySchoolName} ({formData.secondarySchoolStartYear} - {formData.secondarySchoolEndYear})</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {formData.results.sittings.map((sit, idx) => (
                                <div key={idx} className="border border-slate-100 p-4 rounded-xl">
                                    <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                                        <span className="text-[10px] font-black uppercase">Sitting {idx + 1}</span>
                                        <span className="text-[10px] font-black">{sit.year}</span>
                                    </div>
                                    <div className="space-y-1">
                                        {Object.entries(sit.core).map(([subj, grade]) => (
                                            <div key={subj} className="flex justify-between text-[10px] uppercase font-bold">
                                                <span className="text-slate-400">{subj}</span>
                                                <span className="text-blue-600">{grade || '-'}</span>
                                            </div>
                                        ))}
                                        {sit.electives.map((el, eIdx) => (
                                            <div key={eIdx} className="flex justify-between text-[10px] uppercase font-bold">
                                                <span className="text-slate-400">{el.subject || 'Elective'}</span>
                                                <span className="text-indigo-600">{el.grade || '-'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <footer className="mt-auto pt-12 border-t border-slate-100 text-[10px] flex justify-between items-end">
                        <div className="max-w-md">
                            <p className="font-black uppercase mb-2">Declaration</p>
                            <p className="text-slate-400 leading-relaxed italic">I hereby declare that all information provided is true to the best of my knowledge. I understand that any false declaration may lead to disqualification.</p>
                        </div>
                        <div className="text-right">
                            <div className="w-48 border-b border-slate-900 mb-2"></div>
                            <p className="font-black uppercase italic">Applicant Signature</p>
                        </div>
                    </footer>
                </div>
            </div>
        );
    }


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

                                <div className="flex justify-between items-center pt-6 mb-4">
                                    <h3 className="text-xl font-bold text-blue-500">WASSCE / SSCE Results</h3>
                                    {formData.results.sittings.length < 3 && (
                                        <button type="button" onClick={addSitting} className="btn bg-blue-600/10 text-blue-500 text-xs py-2 px-4 rounded-xl flex items-center gap-2 font-bold hover:bg-blue-600 hover:text-white transition-all">
                                            <Plus size={16} /> Add Sitting
                                        </button>
                                    )}
                                </div>

                                {formData.results.sittings.map((sit, sIdx) => (
                                    <div key={sIdx} className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-6 relative group">
                                        {formData.results.sittings.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSitting(sIdx)}
                                                className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
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
                            <button type="button" onClick={(e) => handleSubmit(e, 'Draft')} disabled={loading} className="btn bg-slate-800 hover:bg-green-600/20 text-green-500 border border-green-500/20 flex items-center gap-2">
                                {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Progress</>}
                            </button>

                            <button type="button" onClick={() => setShowPreview(true)} className="btn bg-slate-800 hover:bg-slate-700 text-white px-4 flex items-center gap-2">
                                <FileCheck size={18} /> Preview
                            </button>


                            {step < 4 ? (
                                <button type="button" onClick={nextStep} className="btn btn-primary px-8 flex items-center gap-2 shadow-xl shadow-blue-500/20">
                                    Next Step <ChevronRight size={20} />
                                </button>
                            ) : (
                                <button type="button" onClick={(e) => handleSubmit(e, 'Submitted')} disabled={loading || !formData.declarationAccepted} className="btn btn-primary px-10 flex items-center gap-2 bg-green-600 hover:bg-green-500 border-green-600 shadow-xl shadow-green-500/20">
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
