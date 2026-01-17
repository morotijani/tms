import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Save, Loader2, ChevronRight, ChevronLeft, CheckCircle, User, GraduationCap, Users, FileCheck, Plus, Trash2, Printer, ExternalLink, FileText } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';




import { motion, AnimatePresence } from 'framer-motion';

const AdmissionForm = ({ application, setApplication, readonly = false, onDocClick = null }) => {
    const { settings } = useSettings();
    const currentYear = new Date().getFullYear();

    const yearOptions = Array.from({ length: 46 }, (_, i) => currentYear - i); // Last 45 years + current

    const [step, setStep] = useState(1);
    const [showPreview, setShowPreview] = useState(readonly);
    const [errors, setErrors] = useState({});
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
            setFormData(prev => {
                let srvResults = application.results;
                if (srvResults && typeof srvResults === 'string') {
                    try { srvResults = JSON.parse(srvResults); } catch (e) { console.error("Parse error:", e); }
                }

                const hasSittings = srvResults && Array.isArray(srvResults.sittings) && srvResults.sittings.length > 0;
                const updatedResults = hasSittings ? srvResults : prev.results;

                const userData = application.User || {};

                return {
                    ...prev,
                    ...application,
                    ...userData,
                    firstChoiceId: application.firstChoiceId ? String(application.firstChoiceId) : '',
                    secondChoiceId: application.secondChoiceId ? String(application.secondChoiceId) : '',
                    thirdChoiceId: application.thirdChoiceId ? String(application.thirdChoiceId) : '',
                    results: updatedResults
                };
            });
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


    const validateStep = (currentStep) => {
        const newErrors = {};

        if (currentStep === 1) {
            if (!formData.firstName) newErrors.firstName = "First name is required";
            if (!formData.lastName) newErrors.lastName = "Last name is required";
            if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
            if (!formData.gender) newErrors.gender = "Gender is required";
            if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required";
            if (!formData.ghanaPostGps) newErrors.ghanaPostGps = "GPS Address is required";
        }

        if (currentStep === 2) {
            if (!formData.secondarySchoolName) newErrors.secondarySchoolName = "School name is required";
            if (!formData.secondarySchoolStartYear) newErrors.secondarySchoolStartYear = "Start year is required";
            if (!formData.secondarySchoolEndYear) newErrors.secondarySchoolEndYear = "End year is required";

            formData.results.sittings.forEach((sit, idx) => {
                if (!sit.year) newErrors[`sitting_${idx}_year`] = "Year required";
                if (!sit.indexNo) newErrors[`sitting_${idx}_indexNo`] = "Index No required";
                Object.keys(sit.core).forEach(sub => {
                    if (!sit.core[sub]) newErrors[`sitting_${idx}_core_${sub}`] = "Core grade required";
                });
                sit.electives.forEach((el, eIdx) => {
                    if (!el.subject) newErrors[`sitting_${idx}_elective_${eIdx}_subject`] = "Required";
                    if (!el.grade) newErrors[`sitting_${idx}_elective_${eIdx}_grade`] = "Required";
                });
            });
        }


        if (currentStep === 3) {
            if (!formData.firstChoiceId) newErrors.firstChoiceId = "Choice 1 is required";
            if (!formData.secondChoiceId) newErrors.secondChoiceId = "Choice 2 is required";
            if (!formData.thirdChoiceId) newErrors.thirdChoiceId = "Choice 3 is required";

            if (formData.firstChoiceId && formData.secondChoiceId && formData.firstChoiceId === formData.secondChoiceId) {
                newErrors.secondChoiceId = "Second choice must be different from first choice";
            }
            if (formData.thirdChoiceId && (formData.thirdChoiceId === formData.firstChoiceId || formData.thirdChoiceId === formData.secondChoiceId)) {
                newErrors.thirdChoiceId = "Third choice must be unique";
            }
        }


        if (currentStep === 4) {
            if (!formData.refereeName) newErrors.refereeName = "Referee name is required";
            if (!formData.refereeAddress) newErrors.refereeAddress = "Referee address is required";
            if (!formData.refereeContact) newErrors.refereeContact = "Referee contact is required";
            if (!formData.declarationAccepted) newErrors.declarationAccepted = "You must accept the declaration to submit";
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e, forceStatus = null) => {
        if (e) e.preventDefault();

        const status = forceStatus || (step === 4 ? 'Submitted' : 'Draft');

        // Final submission requires ALL fields across ALL steps to be valid
        if (status === 'Submitted') {
            let allValid = true;
            for (let i = 1; i <= 4; i++) {
                if (!validateStep(i)) {
                    setStep(i);
                    allValid = false;
                    setTimeout(() => {
                        const firstError = document.querySelector('.text-red-500');
                        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                    break;
                }

            }
            if (!allValid) return;

            if (!window.confirm("Are you sure you want to submit your application? No further changes can be made once submitted.")) {
                return;
            }
        }


        setLoading(true);
        setSuccess(false);
        try {
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



    const nextStep = () => {
        if (validateStep(step)) {
            setStep(prev => Math.min(prev + 1, 4));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Find the first form group with an error and scroll to it
            setTimeout(() => {
                const firstError = document.querySelector('.text-red-500');
                if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    };

    const prevStep = () => {
        setErrors({}); // Clear errors when going back
        setStep(prev => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    const steps = [
        { id: 1, label: 'Personal', icon: <User size={18} /> },
        { id: 2, label: 'Educational', icon: <GraduationCap size={18} /> },
        { id: 3, label: 'Programs', icon: <FileCheck size={18} /> },
        { id: 4, label: 'Referee', icon: <Users size={18} /> }
    ];

    if (showPreview) {
        return (
            <div className="max-w-5xl mx-auto py-10 px-4">
                {!readonly && (
                    <div className="mb-8 flex justify-between items-center print:hidden">
                        <button onClick={() => setShowPreview(false)} className="btn bg-slate-800 text-white flex items-center gap-2">
                            <ChevronLeft size={20} /> Back to Editor
                        </button>
                        <button onClick={() => window.print()} className="btn btn-primary flex items-center gap-2">
                            <Printer size={20} /> Print / Save as PDF
                        </button>
                    </div>
                )}


                <div className="bg-white text-slate-900 p-12 rounded-2xl shadow-2xl print:shadow-none print:p-0 min-h-[297mm]">
                    <div className="flex justify-between items-start border-b-4 border-slate-900 pb-8 mb-8">
                        <div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">{settings.schoolName || 'University Application'}</h1>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Academic Year {currentYear}/{currentYear + 1}</p>
                        </div>
                        <div className="text-right flex items-start gap-4">
                            {settings.schoolLogo && (
                                <div className="w-32 h-32 rounded-xl border-2 border-slate-200 flex items-center justify-center overflow-hidden p-2">
                                    <img src={`http://localhost:5000${settings.schoolLogo}`} alt="School Logo" className="w-full h-full object-contain" />
                                </div>
                            )}
                            <div className="w-32 h-32 bg-slate-100 rounded-xl border-2 border-slate-200 flex items-center justify-center overflow-hidden">

                                {application?.passportPhoto ? (
                                    <img src={application.passportPhoto.startsWith('http') ? application.passportPhoto : `http://localhost:5000${application.passportPhoto.startsWith('/') ? '' : '/'}${application.passportPhoto}`} alt="Passport" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">No Photo</span>
                                )}

                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
                        <div className="lg:col-span-2 space-y-8">

                            <section>
                                <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 mb-4 border-b border-slate-100 pb-2">Personal Details</h3>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                    <div><p className="text-[10px] font-bold text-slate-400 uppercase">Full Name</p><p className="font-bold uppercase text-sm">{formData.firstName || 'N/A'} {formData.otherNames} {formData.lastName || 'N/A'}</p></div>
                                    <div><p className="text-[10px] font-bold text-slate-400 uppercase">Email</p><p className="font-bold text-sm">{formData.email || 'N/A'}</p></div>
                                    <div><p className="text-[10px] font-bold text-slate-400 uppercase">Phone</p><p className="font-bold text-sm">{formData.phoneNumber || 'N/A'}</p></div>
                                    <div><p className="text-[10px] font-bold text-slate-400 uppercase">Gender / DOB</p><p className="font-bold text-sm">{formData.gender || 'N/A'} / {formData.dateOfBirth || 'N/A'}</p></div>
                                    <div><p className="text-[10px] font-bold text-slate-400 uppercase">Place of Birth / Religion</p><p className="font-bold text-sm uppercase">{formData.placeOfBirth || 'N/A'} / {formData.religion || 'N/A'}</p></div>
                                    <div><p className="text-[10px] font-bold text-slate-400 uppercase">Hometown / Region</p><p className="font-bold text-sm uppercase">{formData.hometown || 'N/A'} / {formData.region || 'N/A'}</p></div>
                                    <div><p className="text-[10px] font-bold text-slate-400 uppercase">District / GPS Address</p><p className="font-bold text-sm uppercase">{formData.district || 'N/A'} / {formData.ghanaPostGps || 'N/A'}</p></div>
                                    <div><p className="text-[10px] font-bold text-slate-400 uppercase">Marital Status</p><p className="font-bold text-sm uppercase">{formData.maritalStatus || 'N/A'}</p></div>
                                    <div className="col-span-1"><p className="text-[10px] font-bold text-slate-400 uppercase">Home Address</p><p className="font-bold text-sm uppercase">{formData.homeAddress || 'N/A'}</p></div>
                                    <div className="col-span-1"><p className="text-[10px] font-bold text-slate-400 uppercase">Postal Address</p><p className="font-bold text-sm uppercase">{formData.postalAddress || 'N/A'}</p></div>
                                    <div className="col-span-2"><p className="text-[10px] font-bold text-slate-400 uppercase">Languages Spoken</p><p className="font-bold text-sm uppercase">{formData.languagesSpoken || 'N/A'}</p></div>
                                </div>
                            </section>



                            <section>
                                <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 mb-4 border-b border-slate-100 pb-2">Program Choices</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-4 items-center">
                                        <span className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">1</span>
                                        <p className="font-bold uppercase text-sm">{programs.find(p => String(p.id) === String(formData.firstChoiceId))?.name || 'Not Selected'}</p>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <span className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center font-bold text-[10px]">2</span>
                                        <p className="font-bold uppercase text-sm">{programs.find(p => String(p.id) === String(formData.secondChoiceId))?.name || 'Not Selected'}</p>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <span className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center font-bold text-[10px]">3</span>
                                        <p className="font-bold uppercase text-sm">{programs.find(p => String(p.id) === String(formData.thirdChoiceId))?.name || 'Not Selected'}</p>
                                    </div>

                                </div>
                            </section>
                        </div>

                        <div className="space-y-8 border-t lg:border-t-0 lg:border-l border-slate-100 pt-8 lg:pt-0 lg:pl-8">

                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Guardian Info</h3>
                                <p className="font-bold text-sm uppercase mb-1">{formData.guardianName || 'N/A'}</p>
                                <p className="text-xs text-slate-500 mb-1">{formData.guardianOccupation || 'N/A'}</p>
                                <p className="text-xs text-slate-500 mb-4">{formData.guardianAddress || 'N/A'}</p>
                                <p className="text-xs font-mono">{formData.guardianContact || 'N/A'}</p>
                            </section>

                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Referee</h3>
                                <p className="font-bold text-sm uppercase mb-1">{formData.refereeName || 'N/A'}</p>
                                <p className="text-xs text-slate-500 mb-1">{formData.refereeAddress || 'N/A'}</p>
                                <p className="text-xs font-mono">{formData.refereeContact || 'N/A'}</p>
                            </section>
                        </div>

                    </div>

                    <section className="mb-12">
                        <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 mb-4 border-b border-slate-100 pb-2">Academic History</h3>
                        <p className="text-xs font-bold mb-4 uppercase">{formData.secondarySchoolName || 'N/A'} ({formData.secondarySchoolStartYear || 'N/A'} - {formData.secondarySchoolEndYear || 'N/A'})</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {formData.results.sittings.map((sit, idx) => (
                                <div key={idx} className="border border-slate-100 p-4 rounded-xl">
                                    <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase">Sitting {idx + 1} ({sit.year || 'N/A'})</span>
                                            <span className="text-[8px] text-slate-400 font-bold uppercase">Index No: {sit.indexNo || 'N/A'}</span>
                                        </div>
                                        <span className="text-[10px] font-black">Agg: {sit.aggregate || 'N/A'}</span>
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

                    <section className="mb-12 print:hidden">
                        <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 mb-4 border-b border-slate-100 pb-2">Documents & Attachments</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                            {[
                                { label: 'Result Slip 1', path: application?.resultSlip },
                                { label: 'Result Slip 2', path: application?.resultSlip2 },
                                { label: 'Result Slip 3', path: application?.resultSlip3 },
                                { label: 'Birth Certificate', path: application?.birthCertificate },
                                { label: 'Transcript', path: application?.transcript }
                            ].map((doc, idx) => doc.path ? (
                                <a
                                    key={idx}
                                    href={onDocClick ? '#' : (doc.path.startsWith('http') ? doc.path : `http://localhost:5000${doc.path.startsWith('/') ? '' : '/'}${doc.path}`)}
                                    onClick={(e) => {
                                        if (onDocClick) {
                                            e.preventDefault();
                                            onDocClick(doc.label, doc.path);
                                        }
                                    }}
                                    target={onDocClick ? undefined : "_blank"}
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-blue-500 transition-colors group"
                                >

                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-white flex items-center justify-center border border-slate-200 text-blue-600">
                                            <FileText size={16} />
                                        </div>
                                        <span className="text-xs font-bold uppercase text-slate-700">{doc.label}</span>
                                    </div>
                                    <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-500" />
                                </a>
                            ) : null)}
                        </div>
                    </section>


                    <footer className="mt-auto pt-12 border-t border-slate-100 text-[10px] flex flex-col md:flex-row justify-between items-center md:items-end gap-6 text-center md:text-left">
                        <div className="max-w-md">
                            <p className="font-black uppercase mb-2">Declaration</p>
                            <p className="text-slate-400 leading-relaxed italic">I hereby declare that all information provided is true to the best of my knowledge. I understand that any false declaration may lead to disqualification.</p>
                        </div>
                        <div className="md:text-right">

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
            <div className="flex justify-between items-center mb-12 relative px-2">
                <div className="absolute top-5 left-4 right-4 h-0.5 bg-border z-0"></div>
                {steps.map((s) => (
                    <div key={s.id} className="relative z-10 flex flex-col items-center gap-2 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${step >= s.id ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-surface border-border text-text-muted'}`}>
                            {step > s.id ? <CheckCircle size={20} /> : s.icon}
                        </div>
                        <span className={`text-[8px] sm:text-xs font-bold uppercase tracking-widest text-center max-w-[60px] sm:max-w-none ${step >= s.id ? 'text-primary' : 'text-text-muted hidden sm:block'}`}>{s.label}</span>
                    </div>
                ))}
            </div>



            {success && (
                <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-lg mb-8 text-center flex items-center justify-center gap-2">
                    <CheckCircle size={20} /> Form saved successfully! Your progress is secured.
                </div>
            )}

            <div className="glass-card p-4 sm:p-10 border-border bg-surface/50 overflow-hidden relative">


                <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="step1" className="space-y-8">

                                <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">Personal Details</h2>


                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                    <div className="form-group">
                                        <label className="label">First Name</label>
                                        <input name="firstName" value={formData.firstName} onChange={handleChange} className={`input-field ${errors.firstName ? 'border-red-500' : ''}`} placeholder="Kofi" rotate={0} />
                                        {errors.firstName && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.firstName}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Last Name</label>
                                        <input name="lastName" value={formData.lastName} onChange={handleChange} className={`input-field ${errors.lastName ? 'border-red-500' : ''}`} placeholder="Mensah" rotate={0} />
                                        {errors.lastName && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.lastName}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Other Names</label>
                                        <input name="otherNames" value={formData.otherNames} onChange={handleChange} className="input-field" placeholder="Kwame" rotate={0} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

                                    <div className="form-group">
                                        <label className="label">Date of Birth</label>
                                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={`input-field ${errors.dateOfBirth ? 'border-red-500' : ''}`} rotate={0} />
                                        {errors.dateOfBirth && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.dateOfBirth}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Gender</label>
                                        <select name="gender" value={formData.gender} onChange={handleChange} className={`input-field ${errors.gender ? 'border-red-500' : ''}`}>
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                        {errors.gender && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.gender}</p>}
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

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">

                                    <div className="form-group">
                                        <label className="label">Permanent Home Address</label>
                                        <input name="homeAddress" value={formData.homeAddress} onChange={handleChange} className="input-field" placeholder="House No. 123, Street Name" />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Permanent Postal Address</label>
                                        <input name="postalAddress" value={formData.postalAddress} onChange={handleChange} className="input-field" placeholder="P.O. Box 789, Accra" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border">



                                    <div className="form-group">
                                        <label className="label">Languages Spoken</label>
                                        <input name="languagesSpoken" value={formData.languagesSpoken} onChange={handleChange} className="input-field" placeholder="English, Twi, Ga" />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Ghana Post GPS</label>
                                        <input name="ghanaPostGps" value={formData.ghanaPostGps} onChange={handleChange} className={`input-field ${errors.ghanaPostGps ? 'border-red-500' : ''}`} placeholder="GA-123-4567" rotate={0} />
                                        {errors.ghanaPostGps && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.ghanaPostGps}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Phone Number</label>
                                        <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={`input-field ${errors.phoneNumber ? 'border-red-500' : ''}`} placeholder="024 123 4567" rotate={0} />
                                        {errors.phoneNumber && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.phoneNumber}</p>}
                                    </div>
                                </div>


                                <h3 className="text-xl font-bold pt-6 text-primary">Parent or Guardian Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

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
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="step2" className="space-y-8">

                                <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">Educational Background</h2>
                                <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center shrink-0">
                                        <GraduationCap size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold">Provide Your Academic History</p>
                                        <p className="text-xs text-text-muted">Enter details of your secondary education and examination results.</p>
                                    </div>
                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <div className="form-group">
                                        <label className="label">Secondary School Attended</label>
                                        <input name="secondarySchoolName" value={formData.secondarySchoolName} onChange={handleChange} className={`input-field ${errors.secondarySchoolName ? 'border-red-500' : ''}`} placeholder="Prempeh College" rotate={0} />
                                        {errors.secondarySchoolName && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.secondarySchoolName}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label className="label">School Address</label>
                                        <input name="secondarySchoolAddress" value={formData.secondarySchoolAddress} onChange={handleChange} className="input-field" rotate={0} />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">From (Year)</label>
                                        <select name="secondarySchoolStartYear" value={formData.secondarySchoolStartYear} onChange={handleChange} className={`input-field ${errors.secondarySchoolStartYear ? 'border-red-500' : ''}`}>
                                            <option value="">Select Year</option>
                                            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                        {errors.secondarySchoolStartYear && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.secondarySchoolStartYear}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label className="label">To (Year)</label>
                                        <select name="secondarySchoolEndYear" value={formData.secondarySchoolEndYear} onChange={handleChange} className={`input-field ${errors.secondarySchoolEndYear ? 'border-red-500' : ''}`}>
                                            <option value="">Select Year</option>
                                            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                        {errors.secondarySchoolEndYear && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.secondarySchoolEndYear}</p>}
                                    </div>

                                </div>


                                <div className="flex justify-between items-center pt-6 mb-4">
                                    <h3 className="text-xl font-bold text-primary">WASSCE / SSCE Results</h3>
                                    {formData.results.sittings.length < 3 && (
                                        <button type="button" onClick={addSitting} className="btn bg-primary/10 text-primary text-xs py-2 px-4 rounded-xl flex items-center gap-2 font-bold hover:bg-primary hover:text-white transition-all">
                                            <Plus size={16} /> Add Sitting
                                        </button>
                                    )}
                                </div>


                                {formData.results.sittings.map((sit, sIdx) => (
                                    <div key={sIdx} className="p-6 bg-surface/50 rounded-2xl border border-border space-y-6 relative group">

                                        {formData.results.sittings.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSitting(sIdx)}
                                                className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                        <div className="flex justify-between items-center border-b border-border pb-3">


                                            <span className="text-sm font-black text-slate-500 uppercase tracking-tighter">Sitting {sIdx + 1}</span>
                                            <div className="flex gap-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-slate-500">Year:</span>
                                                    <div className="flex flex-col">
                                                        <select value={sit.year} onChange={(e) => handleResultChange(sIdx, 'year', e.target.value)} className={`w-24 bg-slate-900 border-b ${errors[`sitting_${sIdx}_year`] ? 'border-red-500' : 'border-slate-700'} text-xs focus:border-blue-500 outline-none p-1`}>
                                                            <option value="">Year</option>
                                                            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                                                        </select>
                                                        {errors[`sitting_${sIdx}_year`] && <span className="text-red-500 text-[8px] font-bold uppercase">{errors[`sitting_${sIdx}_year`]}</span>}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-slate-500">Index No:</span>
                                                    <div className="flex flex-col">
                                                        <input value={sit.indexNo} onChange={(e) => handleResultChange(sIdx, 'indexNo', e.target.value)} className={`w-24 bg-transparent border-b ${errors[`sitting_${sIdx}_indexNo`] ? 'border-red-500' : 'border-slate-700'} text-xs focus:border-blue-500 outline-none`} />
                                                        {errors[`sitting_${sIdx}_indexNo`] && <span className="text-red-500 text-[8px] font-bold uppercase">{errors[`sitting_${sIdx}_indexNo`]}</span>}
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="grid lg:grid-cols-2 gap-8">
                                            {/* Core Subjects */}
                                            <div className="space-y-3">
                                                <p className="text-xs font-bold text-blue-400 uppercase">Core Subjects</p>
                                                {Object.keys(sit.core).map((sub) => (
                                                    <div key={sub} className="flex items-center justify-between gap-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm text-slate-300">{sub}</span>
                                                            {errors[`sitting_${sIdx}_core_${sub}`] && <span className="text-red-500 text-[8px] font-bold uppercase">{errors[`sitting_${sIdx}_core_${sub}`]}</span>}
                                                        </div>
                                                        <select value={sit.core[sub]} onChange={(e) => handleResultChange(sIdx, sub, e.target.value, 'core')} className={`bg-slate-900 border ${errors[`sitting_${sIdx}_core_${sub}`] ? 'border-red-500' : 'border-slate-800'} rounded px-2 py-1 text-xs`}>
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
                                                    <div key={eIdx} className="space-y-1">
                                                        <div className="flex gap-2">
                                                            <input value={el.subject} onChange={(e) => handleResultChange(sIdx, 'subject', e.target.value, 'electives', eIdx)} placeholder="Subject" className={`flex-1 bg-slate-900 border ${errors[`sitting_${sIdx}_elective_${eIdx}_subject`] ? 'border-red-500' : 'border-slate-800'} rounded px-2 py-1 text-xs`} />
                                                            <select value={el.grade} onChange={(e) => handleResultChange(sIdx, 'grade', e.target.value, 'electives', eIdx)} className={`bg-slate-900 border ${errors[`sitting_${sIdx}_elective_${eIdx}_grade`] ? 'border-red-500' : 'border-slate-800'} rounded px-2 py-1 text-xs`}>
                                                                <option value="">Grade</option>
                                                                {['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'].map(g => <option key={g} value={g}>{g}</option>)}
                                                            </select>
                                                        </div>
                                                        {(errors[`sitting_${sIdx}_elective_${eIdx}_subject`] || errors[`sitting_${sIdx}_elective_${eIdx}_grade`]) && (
                                                            <span className="text-red-500 text-[8px] font-bold uppercase block text-right">Required</span>
                                                        )}
                                                    </div>
                                                ))}

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="step3" className="space-y-8">

                                <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">Program Selection</h2>
                                <p className="text-text-muted">Please select three programs in order of preference.</p>


                                <div className="space-y-6">
                                    <div className="form-group pb-4 border-b border-border/50">
                                        <label className="label text-primary uppercase tracking-widest text-[10px]">First Choice</label>

                                        <select name="firstChoiceId" value={formData.firstChoiceId} onChange={handleChange} className={`input-field text-lg font-bold ${errors.firstChoiceId ? 'border-red-500' : ''}`}>
                                            <option value="">Select Primary Program</option>
                                            {programs.map(p => <option key={p.id} value={p.id}>{p.name} ({p.level})</option>)}
                                        </select>
                                        {errors.firstChoiceId && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.firstChoiceId}</p>}
                                    </div>
                                    <div className="form-group pb-4 border-b border-border/50">

                                        <label className="label uppercase tracking-widest text-[10px]">Second Choice</label>
                                        <select name="secondChoiceId" value={formData.secondChoiceId} onChange={handleChange} className={`input-field text-lg ${errors.secondChoiceId ? 'border-red-500' : ''}`}>
                                            <option value="">Select Secondary Program</option>
                                            {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                        {errors.secondChoiceId && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.secondChoiceId}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label className="label uppercase tracking-widest text-[10px]">Third Choice</label>
                                        <select name="thirdChoiceId" value={formData.thirdChoiceId} onChange={handleChange} className={`input-field text-lg ${errors.thirdChoiceId ? 'border-red-500' : ''}`}>
                                            <option value="">Select Third Option</option>
                                            {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                        {errors.thirdChoiceId && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.thirdChoiceId}</p>}
                                    </div>
                                </div>
                            </motion.div>
                        )}


                        {step === 4 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="step4" className="space-y-8">

                                <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">Referee & Declaration</h2>


                                <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl text-sm italic text-text-muted">
                                    NB: Referee must be a Doctor, Senior Police / Army Officer, Head of Institution, or Reverend Minister / Clergy.
                                </div>


                                <div className="grid md:grid-cols-1 gap-6">
                                    <div className="form-group">
                                        <label className="label">Referee Full Name</label>
                                        <input name="refereeName" value={formData.refereeName} onChange={handleChange} className={`input-field ${errors.refereeName ? 'border-red-500' : ''}`} rotate={0} />
                                        {errors.refereeName && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.refereeName}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Referee Address</label>
                                        <input name="refereeAddress" value={formData.refereeAddress} onChange={handleChange} className={`input-field ${errors.refereeAddress ? 'border-red-500' : ''}`} rotate={0} />
                                        {errors.refereeAddress && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.refereeAddress}</p>}
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Referee Contact Number</label>
                                        <input name="refereeContact" value={formData.refereeContact} onChange={handleChange} className={`input-field ${errors.refereeContact ? 'border-red-500' : ''}`} rotate={0} />
                                        {errors.refereeContact && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.refereeContact}</p>}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-border">
                                    <h3 className="text-lg font-bold mb-4 uppercase tracking-tighter">Declaration</h3>
                                    <label className="flex items-start gap-4 cursor-pointer group">
                                        <div className="pt-1">
                                            <input type="checkbox" checked={formData.declarationAccepted} onChange={(e) => setFormData({ ...formData, declarationAccepted: e.target.checked })} className="w-5 h-5 rounded border-border bg-surface text-primary focus:ring-primary" />
                                        </div>
                                        <p className="text-sm text-text-muted group-hover:text-text transition-colors">
                                            I hereby declare that the information given above is true and accurate to the best of my knowledge. I understand that any false information provided may lead to my disqualification or dismissal if already admitted.
                                        </p>
                                    </label>
                                    {errors.declarationAccepted && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{errors.declarationAccepted}</p>}
                                </div>


                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    {!readonly && (
                        <div className="flex justify-between items-center mt-12 pt-8 border-t border-border">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={step === 1 || loading}
                                className={`btn flex items-center gap-2 ${step === 1 ? 'opacity-0 pointer-events-none' : 'bg-surface hover:bg-surface-hover text-text border border-border'}`}
                            >
                                <ChevronLeft size={20} /> Previous
                            </button>

                            <div className="flex gap-4">
                                <button type="button" onClick={(e) => handleSubmit(e, 'Draft')} disabled={loading} className="btn bg-surface hover:bg-primary/10 text-primary border border-primary/20 flex items-center gap-2">
                                    {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Progress</>}
                                </button>

                                <button type="button" onClick={() => setShowPreview(true)} className="btn bg-surface hover:bg-surface-hover text-text border border-border px-4 flex items-center gap-2">
                                    <FileCheck size={18} /> Preview
                                </button>


                                {step < 4 ? (
                                    <button type="button" onClick={nextStep} className="btn btn-primary px-8 flex items-center gap-2 shadow-xl shadow-primary/20">
                                        Next Step <ChevronRight size={20} />
                                    </button>
                                ) : (
                                    <button type="button" onClick={(e) => handleSubmit(e, 'Submitted')} disabled={loading} className="btn btn-primary px-10 flex items-center gap-2 bg-green-600 hover:bg-green-500 border-green-600 shadow-xl shadow-green-500/20">
                                        {loading ? <Loader2 className="animate-spin" /> : <>Final Submission <CheckCircle size={20} /></>}
                                    </button>
                                )}
                            </div>
                        </div>

                    )}

                </form>
            </div>

            <p className="text-center text-slate-500 text-xs mt-8">
                © {currentYear} {settings.schoolName || 'Ghana University Management System'}. Secure Digital Application Portal.
            </p>

        </div>
    );
};

export default AdmissionForm;
