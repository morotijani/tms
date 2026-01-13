import React, { useState } from 'react';
import api from '../utils/api';
import { Upload, File, CheckCircle, Loader2 } from 'lucide-react';


const DocumentUpload = ({ application, setApplication }) => {
    const [files, setFiles] = useState({
        resultSlip: null,
        birthCertificate: null,
        transcript: null,
        passportPhoto: null
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e) => {
        setFiles({ ...files, [e.target.name]: e.target.files[0] });
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!files.resultSlip && !files.birthCertificate && !files.transcript && !files.passportPhoto) return;


        setLoading(true);
        setSuccess(false);

        const formData = new FormData();
        if (files.resultSlip) formData.append('resultSlip', files.resultSlip);
        if (files.birthCertificate) formData.append('birthCertificate', files.birthCertificate);
        if (files.transcript) formData.append('transcript', files.transcript);
        if (files.passportPhoto) formData.append('passportPhoto', files.passportPhoto);


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
        <div className="glass-card p-8 animate-fade-in max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">Document Upload</h2>
            <p className="text-slate-400 mb-8">Please upload clear scans of your academic and personal documents. Supported formats: PDF, JPG, PNG (Max 5MB each).</p>

            {success && (
                <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-lg mb-8 flex items-center gap-2">
                    <CheckCircle size={20} /> Documents uploaded successfully!
                </div>
            )}

            <form onSubmit={handleUpload} className="space-y-6">
                {[
                    { label: 'WASSCE/SSCE Result Slip', name: 'resultSlip', current: application?.resultSlip },
                    { label: 'Birth Certificate', name: 'birthCertificate', current: application?.birthCertificate },
                    { label: 'Academic Transcript (Optional)', name: 'transcript', current: application?.transcript },
                    { label: 'Passport Size Picture', name: 'passportPhoto', current: application?.passportPhoto }
                ].map((field, idx) => (

                    <div key={idx} className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded-lg">
                                <File className="text-slate-400" size={20} />
                            </div>
                            <div>
                                <p className="font-medium">{field.label}</p>
                                {field.current && <p className="text-xs text-green-500">File already uploaded ✓</p>}
                            </div>
                        </div>
                        <input
                            type="file"
                            name={field.name}
                            id={field.name}
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <label htmlFor={field.name} className="btn bg-slate-800 hover:bg-slate-700 cursor-pointer text-sm">
                            {files[field.name] ? files[field.name].name.substring(0, 15) + '...' : 'Select File'}
                        </label>
                    </div>
                ))}

                <button type="submit" disabled={loading} className="btn btn-primary w-full py-4 mt-4">
                    {loading ? <Loader2 className="animate-spin" /> : <><Upload size={20} /> Upload All Documents</>}
                </button>
            </form>
        </div>
    );
};

export default DocumentUpload;
