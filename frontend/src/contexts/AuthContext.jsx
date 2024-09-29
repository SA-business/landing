// AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const logOut = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        setProfile(null);
    }

    // Function to parse JWT
    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    // Function to refresh user data
    const refreshUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                setProfile(null);
                setLoading(false);
                return;
            }

            // Decode JWT to get user ID and email
            const decoded = parseJwt(token);
            if (!decoded) {
                setIsAuthenticated(false);
                setUser(null);
                setProfile(null);
                setLoading(false);
                return;
            }

            setUser({ id: decoded.id, email: decoded.email });
            setIsAuthenticated(true);

            // Fetch profile data
            const response = await axios.get(`http://localhost:3000/api/profile/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setProfile(response.data);
        } catch (err) {
            console.error('Failed to refresh user:', err);
            setIsAuthenticated(false);
            setUser(null);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        refreshUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array to run once on mount

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, profile, setProfile, refreshUser, loading, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

