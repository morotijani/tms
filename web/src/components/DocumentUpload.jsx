import React, { useState } from 'react';
import api from '../utils/api';
import { Upload, File, CheckCircle, Loader2, Eye, X, Image as ImageIcon, AlertCircle } from 'lucide-react';




const DocumentUpload = ({ application, setApplication }) => {
    const [files, setFiles] = useState({
        resultSlip: null,
        resultSlip2: null,
        resultSlip3: null,
        birthCertificate: null,
        transcript: null,
        passportPhoto: null
    });
    const [previews, setPreviews] = useState({});

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(null);
    const [errors, setErrors] = useState({});


    let results = application?.results;
    if (typeof results === 'string') {
        try { results = JSON.parse(results); } catch (e) { results = { sittings: [] }; }
    }
    const sittingCount = results?.sittings?.length || 1;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Restriction for Passport Photo
        if (e.target.name === 'passportPhoto' && !file.type.startsWith('image/')) {
            setErrors(prev => ({ ...prev, passportPhoto: 'Passport photo must be an image (JPG, PNG, etc.)' }));
            return;
        }

        setFiles(prev => ({ ...prev, [e.target.name]: file }));

        if (file.type.startsWith('image/') || file.type === 'application/pdf') {
            setPreviews(prev => ({ ...prev, [e.target.name]: URL.createObjectURL(file) }));
        } else {
            setPreviews(prev => ({ ...prev, [e.target.name]: 'file' }));
        }
    };




    const handleUpload = async (e) => {
        e.preventDefault();

        const newErrors = {};
        const requiredFields = [
            { name: 'resultSlip', label: 'Result Slip 1', current: application?.resultSlip },
            ...(sittingCount >= 2 ? [{ name: 'resultSlip2', label: 'Result Slip 2', current: application?.resultSlip2 }] : []),
            ...(sittingCount >= 3 ? [{ name: 'resultSlip3', label: 'Result Slip 3', current: application?.resultSlip3 }] : []),
            { name: 'birthCertificate', label: 'Birth Certificate', current: application?.birthCertificate },
            { name: 'passportPhoto', label: 'Passport Photo', current: application?.passportPhoto }
        ];


        requiredFields.forEach(field => {
            if (!files[field.name] && !field.current) {
                newErrors[field.name] = `${field.label} is required`;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});



        setLoading(true);
        setSuccess(false);

        const formData = new FormData();
        Object.keys(files).forEach(key => {
            if (files[key]) formData.append(key, files[key]);
        });



        try {
            const { data } = await api.post('/admission/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setApplication(data.application);
            setSuccess(true);
        } catch (err) {

            alert(err.response?.data?.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card p-8 animate-fade-in max-w-3xl border-border bg-surface/50">
            <h2 className="text-2xl font-bold mb-6">Document Upload</h2>
            <p className="text-text-muted mb-8">Please upload clear scans of your academic and personal documents. Supported formats: PDF, JPG, PNG (Max 5MB each).</p>


            {success && (
                <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-lg mb-8 flex items-center gap-2">
                    <CheckCircle size={20} /> Documents uploaded successfully!
                </div>
            )}

            {Object.keys(errors).length > 0 && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-8 flex items-center gap-2 animate-shake">
                    <AlertCircle size={20} /> Please provide all required documents marked with an asterisk (*).
                </div>
            )}


            {!application?.results?.sittings && (
                <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-4 rounded-lg mb-8 text-sm">
                    <strong>Note:</strong> Please save your progress in the Admission Form first to ensure the correct number of result slips are required.
                </div>
            )}


            <form onSubmit={handleUpload} className="space-y-6">
                {[
                    { label: 'Result Slip - Sitting 1', name: 'resultSlip', current: application?.resultSlip, required: true },
                    ...(sittingCount >= 2 ? [{ label: 'Result Slip - Sitting 2', name: 'resultSlip2', current: application?.resultSlip2, required: true }] : []),
                    ...(sittingCount >= 3 ? [{ label: 'Result Slip - Sitting 3', name: 'resultSlip3', current: application?.resultSlip3, required: true }] : []),
                    { label: 'Birth Certificate', name: 'birthCertificate', current: application?.birthCertificate, required: true },
                    { label: 'Academic Transcript (Optional)', name: 'transcript', current: application?.transcript, required: false },
                    { label: 'Passport Size Picture', name: 'passportPhoto', current: application?.passportPhoto, required: true }
                ].map((field, idx) => (


                    <div key={idx} className="p-4 bg-surface/80 border border-border rounded-2xl space-y-4">

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-surface flex items-center justify-center rounded-xl border border-border">
                                    {files[field.name]?.type.startsWith('image/') ? <ImageIcon className="text-primary" size={18} /> : <File className="text-text-muted" size={18} />}
                                </div>

                                <div>
                                    <p className="text-sm font-bold">{field.label} {field.required && <span className="text-red-500">*</span>}</p>
                                    {field.current && <p className="text-[10px] text-green-500 font-bold uppercase tracking-tighter">Already Uploaded ✓</p>}
                                    {errors[field.name] && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{errors[field.name]}</p>}
                                </div>

                            </div>
                            <div className="flex items-center gap-2">
                                {files[field.name] && (
                                    <button
                                        type="button"
                                        onClick={() => setShowPreviewModal(field.name)}
                                        className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center hover:bg-surface-hover transition-colors"

                                    >
                                        <Eye size={16} />
                                    </button>
                                )}
                                <input
                                    type="file"
                                    name={field.name}
                                    id={field.name}
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept={field.name === 'passportPhoto' ? ".jpg,.jpeg,.png" : ".pdf,.jpg,.jpeg,.png"}
                                    required={field.required && !field.current}
                                />

                                <label htmlFor={field.name} className="btn bg-primary/10 text-primary hover:bg-primary hover:text-white text-[10px] py-2 px-4 rounded-lg font-bold transition-all cursor-pointer">
                                    {files[field.name] ? 'Change File' : 'Select File'}
                                </label>

                            </div>
                        </div>

                        {files[field.name] && (
                            <div className="flex items-center gap-3 p-2 bg-background/50 rounded-lg border border-border/50">
                                <div className="text-[10px] font-mono text-text-muted truncate flex-1">{files[field.name].name}</div>
                                <button type="button" onClick={() => {
                                    setFiles({ ...files, [field.name]: null });
                                    setPreviews({ ...previews, [field.name]: null });
                                }} className="text-red-500 hover:text-red-400">
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                    </div>
                ))}

                {showPreviewModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm animate-fade-in">
                        <div className="relative bg-surface border border-border rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col pt-12 shadow-2xl">
                            <button onClick={() => setShowPreviewModal(null)} className="absolute top-4 right-4 w-10 h-10 bg-background/50 rounded-full flex items-center justify-center hover:bg-background transition-colors">
                                <X size={20} />
                            </button>
                            <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-background/20">

                                {files[showPreviewModal]?.type.startsWith('image/') ? (
                                    <img src={previews[showPreviewModal]} alt="Preview" className="max-w-full h-auto rounded-lg shadow-2xl" />
                                ) : (
                                    <div className="w-full h-full min-h-[500px] flex flex-col">
                                        <iframe
                                            src={previews[showPreviewModal]}
                                            className="w-full h-full flex-1 rounded-lg border-none"
                                            title="PDF Preview"
                                        />
                                        <div className="mt-4 text-center space-y-2">
                                            <File size={32} className="mx-auto text-blue-500" />
                                            <p className="font-bold text-sm">PDF Document Loaded</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-surface text-center border-t border-border">
                                <p className="text-xs font-bold text-text-muted">{files[showPreviewModal]?.name}</p>
                            </div>

                        </div>
                    </div>
                )}


                <button type="submit" disabled={loading} className="btn btn-primary w-full py-4 mt-4">
                    {loading ? <Loader2 className="animate-spin" /> : <><Upload size={20} /> Upload All Documents</>}
                </button>
            </form>
        </div>
    );
};

export default DocumentUpload;
