import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthView: React.FC = () => {
    const { signIn, signUp, resetPassword, confirmPasswordReset } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'reset'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        const urlMode = searchParams.get('mode');
        const urlToken = searchParams.get('token');
        if (urlMode === 'reset' && urlToken) {
            setMode('reset');
            setToken(urlToken);
        }
    }, [searchParams]);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await signIn(email, password);

        if (error) {
            if (error.name === 'AbortError' || error.message?.includes('AbortError')) {
                setLoading(false);
                return;
            }
            console.error('SignIn Error:', error);
            setMessage({ type: 'error', text: error.message || 'Failed to sign in' });
        } else {
            setMessage({ type: 'success', text: 'Successfully signed in!' });
            // Redirect after a short delay
            setTimeout(() => navigate('/'), 1000);
        }

        setLoading(false);
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await signUp(email, password, fullName);

        if (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to sign up' });
        } else {
            setMessage({
                type: 'success',
                text: 'Account created! Please check your email to verify your account.'
            });
            setTimeout(() => setMode('signin'), 3000);
        }

        setLoading(false);
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await resetPassword(email);

        if (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to send reset email' });
        } else {
            setMessage({
                type: 'success',
                text: 'Password reset link generated! (Check console in dev mode)'
            });
            // We stay on the page so they can see the message
        }

        setLoading(false);
    };

    const handleConfirmReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await confirmPasswordReset(token, password);

        if (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to reset password' });
        } else {
            setMessage({
                type: 'success',
                text: 'Password reset successfully!'
            });
            setTimeout(() => {
                navigate('/auth');
                setMode('signin');
            }, 2000);
        }

        setLoading(false);
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setFullName('');
        setMessage(null);
    };

    const switchMode = (newMode: 'signin' | 'signup' | 'forgot' | 'reset') => {
        resetForm();
        setMode(newMode);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-gold px-4 py-12 pt-32">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-count">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                        <i className="fas fa-hands-helping text-white text-3xl"></i>
                    </div>
                    <h2 className="text-3xl font-bold text-primary mb-2">
                        {mode === 'signin' && 'Welcome Back'}
                        {mode === 'signup' && 'Join Our Mission'}
                        {mode === 'forgot' && 'Reset Password'}
                        {mode === 'reset' && 'Create New Password'}
                    </h2>
                    <p className="text-gray-600 text-sm">
                        {mode === 'signin' && 'Sign in to continue spreading kindness'}
                        {mode === 'signup' && 'Create an account to get started'}
                        {mode === 'forgot' && 'Enter your email to reset your password'}
                        {mode === 'reset' && 'Enter your new secure password'}
                    </p>
                </div>

                {/* Message Alert */}
                {message && (
                    <div className={`mb-6 p-4 rounded-xl ${message.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-red-50 border border-red-200 text-red-700'
                        }`}>
                        <div className="flex items-center space-x-2">
                            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                            <span className="text-sm">{message.text}</span>
                        </div>
                    </div>
                )}

                {/* Sign In Form */}
                {mode === 'signin' && (
                    <form onSubmit={handleSignIn} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary transition-colors focus:outline-none"
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => switchMode('forgot')}
                            className="text-sm text-primary hover:text-secondary transition-colors"
                        >
                            Forgot password?
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                        <p className="text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={() => switchMode('signup')}
                                className="text-primary font-semibold hover:text-secondary"
                            >
                                Sign Up
                            </button>
                        </p>
                    </form>
                )}

                {/* Sign Up Form */}
                {mode === 'signup' && (
                    <form onSubmit={handleSignUp} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary transition-colors focus:outline-none"
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                        <p className="text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => switchMode('signin')}
                                className="text-primary font-semibold hover:text-secondary"
                            >
                                Sign In
                            </button>
                        </p>
                    </form>
                )}

                {/* Forgot Password Form */}
                {mode === 'forgot' && (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="your@email.com"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                        <p className="text-center text-sm text-gray-600">
                            Remember your password?{' '}
                            <button
                                type="button"
                                onClick={() => switchMode('signin')}
                                className="text-primary font-semibold hover:text-secondary"
                            >
                                Sign In
                            </button>
                        </p>
                    </form>
                )}

                {/* Reset Password (Confirmation) Form */}
                {mode === 'reset' && (
                    <form onSubmit={handleConfirmReset} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary transition-colors focus:outline-none"
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
};

export default AuthView;
