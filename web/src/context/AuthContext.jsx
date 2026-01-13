import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('ums_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        setUser(data);
        localStorage.setItem('ums_user', JSON.stringify(data));
        return data;
    };

    const registerApplicant = async (formData) => {
        const { data } = await api.post('/auth/register-applicant', formData);
        setUser(data);
        localStorage.setItem('ums_user', JSON.stringify(data));
        return data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ums_user');
    };


    return (
        <AuthContext.Provider value={{ user, login, registerApplicant, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
