import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Profile } from '../services/supabaseClient';
import { apiService } from '../services/apiService';

// Generic User type to replace Supabase User
interface WebUser {
    id: string;
    email: string;
    full_name?: string;
}

interface AuthContextType {
    user: WebUser | null;
    profile: Profile | null;
    session: any | null; // Keep for compatibility
    loading: boolean;
    authError: string | null;
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: any }>;
    confirmPasswordReset: (token: string, password: string) => Promise<{ error: any }>;
    updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
    refreshProfile: () => Promise<void>;
    isAdmin: boolean;
    isStaff: boolean;
    isVolunteer: boolean;
    isTeamMember: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<WebUser | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    // Initial check on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('giving_user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setProfile(userData);
            } catch (e) {
                localStorage.removeItem('giving_user');
            }
        }

        // If we have a token, refresh from API (prevents stale role/fields)
        refreshProfile().finally(() => setLoading(false));
    }, [refreshProfile]);

    const refreshProfile = useCallback(async () => {
        try {
            const token = localStorage.getItem('giving_token');
            if (!token) return;
            const res = await apiService.get('get_me');
            if (res?.user) {
                setUser(res.user);
                setProfile(res.user);
                localStorage.setItem('giving_user', JSON.stringify(res.user));
            }
        } catch (_) {
            // If token is invalid, force logout
            localStorage.removeItem('giving_token');
            localStorage.removeItem('giving_user');
            setUser(null);
            setProfile(null);
        }
    }, []);

    const isAdminFlag = profile?.role === 'admin';

    async function signUp(email: string, password: string, fullName: string) {
        try {
            await apiService.signup({ email, password, fullName });
            return { error: null };
        } catch (e: any) {
            return { error: e };
        }
    }

    async function signIn(email: string, password: string) {
        setLoading(true);
        try {
            const res = await apiService.login({ email, password });
            setUser(res.user);
            setProfile(res.user);
            localStorage.setItem('giving_user', JSON.stringify(res.user));
            if (res.token) {
                localStorage.setItem('giving_token', res.token);
            }
            setLoading(false);
            return { error: null };
        } catch (e: any) {
            setLoading(false);
            return { error: e };
        }
    }

    async function signOut() {
        setUser(null);
        setProfile(null);
        localStorage.removeItem('giving_user');
        localStorage.removeItem('giving_token');
    }

    async function resetPassword(email: string) {
        try {
            const res = await apiService.forgotPassword(email);
            if (res.debug_link) {
                console.log("DEV MODE - Password Reset Link:", res.debug_link);
            }
            return { error: null };
        } catch (e: any) {
            return { error: e };
        }
    }

    async function confirmPasswordReset(token: string, password: string) {
        try {
            await apiService.updatePassword(token, password);
            return { error: null };
        } catch (e: any) {
            return { error: e };
        }
    }

    async function updateProfile(updates: Partial<Profile>) {
        try {
            const res = await apiService.post('update_me', updates);
            if (res?.user) {
                setUser(res.user);
                setProfile(res.user);
                localStorage.setItem('giving_user', JSON.stringify(res.user));
            }
            return { error: null };
        } catch (e: any) {
            return { error: e };
        }
    }

    const value = {
        user,
        profile,
        session: user ? { user } : null,
        loading,
        authError,
        signUp,
        signIn,
        signOut,
        resetPassword,
        confirmPasswordReset,
        updateProfile,
        refreshProfile,
        isAdmin: isAdminFlag,
        isStaff: profile?.role === 'staff',
        isVolunteer: profile?.role === 'volunteer',
        isTeamMember: ['admin', 'staff', 'volunteer'].includes(profile?.role || '')
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
