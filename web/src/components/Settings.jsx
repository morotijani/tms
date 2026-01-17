import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import api from '../utils/api';
import { Save, Upload, Loader2, CheckCircle2, AlertCircle, Building, Mail, Phone, MapPin, Hash } from 'lucide-react';

const Settings = () => {
    const { settings, fetchSettings, updateSettingsState } = useSettings();
    const [formData, setFormData] = useState({ ...settings });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);
    const [preview, setPreview] = useState(settings.schoolLogo);

    useEffect(() => {
        setFormData({ ...settings });
        setPreview(settings.schoolLogo);
    }, [settings]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);

        setUploading(true);
        const logoData = new FormData();
        logoData.append('logo', file);

        try {
            const { data } = await api.post('/settings/logo', logoData);
            updateSettingsState({ schoolLogo: data.logoUrl });
            setMessage({ type: 'success', text: 'Logo uploaded successfully' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Logo upload failed' });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { data } = await api.post('/settings', formData);
            updateSettingsState(data.settings);
            setMessage({ type: 'success', text: 'Settings updated successfully' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update settings' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="glass-card p-8 border-primary/20 bg-primary/5 mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary rounded-xl text-white shadow-lg shadow-primary/20">
                        <Building size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-text">School Configuration</h3>
                        <p className="text-sm text-text-muted">Manage your institution's public information across the platform.</p>
                    </div>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 border transition-all ${message.type === 'success' ? 'bg-success/5 border-success/20 text-success' : 'bg-red-500/5 border-red-500/20 text-red-500'}`}>
                    {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="text-sm font-bold uppercase tracking-wide">{message.text}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Logo & Branding */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-card p-6 border-border bg-surface/50 text-center">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-6">Institution Logo</h4>
                        <div className="relative w-32 h-32 mx-auto mb-6 group">
                            <div className="w-full h-full rounded-2xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-background group-hover:border-primary/50 transition-all">
                                {preview ? (
                                    <img src={preview.startsWith('data') ? preview : `http://localhost:5000${preview}`} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <Building size={48} className="text-text-muted" />
                                )}
                            </div>
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                                <Upload size={24} className="text-white" />
                                <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
                            </label>
                            {uploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-2xl">
                                    <Loader2 className="animate-spin text-primary" size={24} />
                                </div>
                            )}
                        </div>
                        <p className="text-[10px] text-text-muted font-bold px-4">Recommended size: 512x512px. Supports PNG, JPG.</p>
                    </div>

                    <div className="glass-card p-6 border-border bg-surface/50">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 block ml-1">Short Name / Abbreviation</label>
                        <div className="flex items-center gap-3 bg-background border border-border p-3 rounded-xl focus-within:border-primary transition-colors">
                            <Hash size={18} className="text-text-muted" />
                            <input
                                name="schoolAbbreviation"
                                value={formData.schoolAbbreviation}
                                onChange={handleChange}
                                className="bg-transparent outline-none flex-1 text-sm font-bold text-text"
                                placeholder="e.g. GUMS"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: General Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card p-8 border-border bg-surface/50 space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-4">Official Information</h4>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted block ml-1">Full Institution Name</label>
                            <div className="flex items-center gap-3 bg-background border border-border p-4 rounded-xl focus-within:border-primary transition-colors">
                                <Building size={20} className="text-text-muted" />
                                <input
                                    name="schoolName"
                                    value={formData.schoolName}
                                    onChange={handleChange}
                                    className="bg-transparent outline-none flex-1 text-lg font-bold text-text"
                                    placeholder="Full name of the school"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted block ml-1">Official Email</label>
                                <div className="flex items-center gap-3 bg-background border border-border p-4 rounded-xl focus-within:border-primary transition-colors">
                                    <Mail size={18} className="text-text-muted" />
                                    <input
                                        name="schoolEmail"
                                        value={formData.schoolEmail}
                                        onChange={handleChange}
                                        className="bg-transparent outline-none flex-1 font-medium text-text"
                                        placeholder="info@school.edu"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted block ml-1">Contact Phone</label>
                                <div className="flex items-center gap-3 bg-background border border-border p-4 rounded-xl focus-within:border-primary transition-colors">
                                    <Phone size={18} className="text-text-muted" />
                                    <input
                                        name="schoolPhone"
                                        value={formData.schoolPhone}
                                        onChange={handleChange}
                                        className="bg-transparent outline-none flex-1 font-medium text-text"
                                        placeholder="+233..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted block ml-1">Physical Address</label>
                            <div className="flex items-start gap-3 bg-background border border-border p-4 rounded-xl focus-within:border-primary transition-colors">
                                <MapPin size={20} className="text-text-muted mt-1" />
                                <textarea
                                    name="schoolAddress"
                                    value={formData.schoolAddress}
                                    onChange={handleChange}
                                    rows="3"
                                    className="bg-transparent outline-none flex-1 font-medium text-text resize-none"
                                    placeholder="Official school address..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary px-10 py-4 font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-primary/20"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Settings;
