import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Profile, supabase } from '../services/supabaseClient';

const UserProfile: React.FC = () => {
    const { user, profile, updateProfile, loading: authLoading } = useAuth();
    const [formData, setFormData] = useState<Partial<Profile>>({});
    const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name,
                location: profile.location || '',
                phone: profile.phone || '',
                bio: profile.bio || '',
                position: profile.position || '',
                department: profile.department || ''
            });
        } else if (user) {
            // Fallback if profile is missing but user exists
            setFormData({
                full_name: user.user_metadata?.full_name || '',
            });
        }
    }, [profile, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Handle Password Update if provided
        if (passwordData.newPassword) {
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                setMessage({ type: 'error', text: 'Passwords do not match' });
                setLoading(false);
                return;
            }
            if (passwordData.newPassword.length < 6) {
                setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
                setLoading(false);
                return;
            }
            const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword });
            if (error) {
                setMessage({ type: 'error', text: 'Failed to update password: ' + error.message });
                setLoading(false);
                return;
            }
        }

        const { error } = await updateProfile(formData);

        if (error) {
            setMessage({ type: 'error', text: 'Failed to update profile' });
        } else {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
            setPasswordData({ newPassword: '', confirmPassword: '' });
        }
        setLoading(false);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
                <p>Please log in to view your profile.</p>
            </div>
        );
    }

    // Use profile data or fallback to user data
    const displayRole = profile?.role || 'user';
    const displayName = profile?.full_name || user.user_metadata?.full_name || user.email;

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
                    <div className="h-32 bg-gradient-to-r from-primary to-secondary relative">
                        {isEditing && (
                            <button className="absolute bottom-2 right-2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-lg text-sm backdrop-blur-sm transition-colors">
                                <i className="fas fa-camera mr-2"></i> Change Cover
                            </button>
                        )}
                    </div>
                    <div className="px-8 pb-8">
                        <div className="relative flex items-end -mt-12 mb-6">
                            <div className="relative">
                                <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                                    <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-gray-500 overflow-hidden">
                                        {profile?.avatar_url ? (
                                            <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            displayName?.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                </div>
                                {isEditing && (
                                    <button className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-lg hover:bg-secondary transition-colors" title="Upload Photo">
                                        <i className="fas fa-camera text-xs"></i>
                                    </button>
                                )}
                            </div>

                            <div className="ml-6 mb-1">
                                <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide mr-3 ${displayRole === 'admin' ? 'bg-purple-100 text-purple-800' :
                                            displayRole === 'staff' ? 'bg-green-100 text-green-800' :
                                                displayRole === 'volunteer' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                        }`}>
                                        {displayRole.replace('_', ' ')}
                                    </span>
                                    <i className="fas fa-map-marker-alt mr-1"></i>
                                    {profile?.location || 'Location not set'}
                                </div>
                            </div>
                            <div className="ml-auto mb-2">
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors shadow-sm"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
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

                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
                                {/* Personal Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                value={formData.full_name || ''}
                                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                            <input
                                                type="text"
                                                value={formData.location || ''}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                                placeholder="City, Country"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={formData.phone || ''}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Position / Title</label>
                                            <input
                                                type="text"
                                                value={formData.position || ''}
                                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                            <textarea
                                                rows={4}
                                                value={formData.bio || ''}
                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                                placeholder="Tell us about yourself..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Security Settings */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Security Settings</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                        <div className="md:col-span-2">
                                            <p className="text-sm text-gray-500 mb-4">Leave these fields blank if you don't want to change your password.</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                            <input
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setMessage(null);
                                            // Reset form data
                                            if (profile) {
                                                setFormData({ ...profile });
                                            }
                                        }}
                                        className="px-6 py-2 rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 rounded-lg text-white bg-primary hover:bg-secondary transition-colors font-medium disabled:opacity-50 shadow-md"
                                    >
                                        {loading ? 'Saving Changes...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
                                <div className="md:col-span-2 space-y-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                            <i className="fas fa-user mr-2 text-primary"></i> About
                                        </h3>
                                        {profile?.bio ? (
                                            <p className="text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-xl border border-gray-100">
                                                {profile.bio}
                                            </p>
                                        ) : (
                                            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                                <p className="text-gray-500">No bio added yet.</p>
                                                <button onClick={() => setIsEditing(true)} className="text-primary text-sm font-medium mt-2 hover:underline">
                                                    Add a bio
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                            <i className="fas fa-briefcase mr-2 text-primary"></i> Professional Info
                                        </h3>
                                        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-1">Position</p>
                                                    <p className="text-gray-900 font-medium">{profile?.position || 'Not set'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-1">Department</p>
                                                    <p className="text-gray-900 font-medium">{profile?.department || 'Not set'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Contact Details</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-start">
                                                <div className="w-8 text-gray-400 mt-0.5"><i className="fas fa-envelope"></i></div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="text-xs text-gray-500">Email</p>
                                                    <p className="text-sm text-gray-900 font-medium truncate" title={user.email}>{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="w-8 text-gray-400 mt-0.5"><i className="fas fa-phone"></i></div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Phone</p>
                                                    <p className="text-sm text-gray-900 font-medium">{profile?.phone || 'Not set'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <div className="w-8 text-gray-400 mt-0.5"><i className="fas fa-map-marker-alt"></i></div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Location</p>
                                                    <p className="text-sm text-gray-900 font-medium">{profile?.location || 'Not set'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-xl p-6">
                                        <div className="flex items-center mb-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                            <p className="text-sm font-medium text-green-700">Account Status: Active</p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Member since {new Date(user.created_at || Date.now()).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
