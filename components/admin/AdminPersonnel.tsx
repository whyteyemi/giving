import React, { useEffect, useState, useCallback } from 'react';
import { apiService } from '../../services/apiService';
import { Profile, UserRole } from '../../services/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

interface AdminPersonnelProps {
    onStatsUpdate: (stats: any) => void;
}

const AdminPersonnel: React.FC<AdminPersonnelProps> = ({ onStatsUpdate }) => {
    const { user, refreshProfile } = useAuth();
    const [teamMembers, setTeamMembers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Profile | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    const fetchTeamMembers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiService.fetchProfiles();
            const members = data || [];
            setTeamMembers(members);

            onStatsUpdate({
                total: members.length,
                admins: members.filter(m => m.role === 'admin').length,
                staff: members.filter(m => m.role === 'staff').length,
                volunteers: members.filter(m => m.role === 'volunteer').length,
                users: members.filter(m => m.role === 'user').length
            });
        } catch (error: any) {
            console.error('AdminPersonnel: Fetch error:', error);
        } finally {
            setLoading(false);
        }
    }, [onStatsUpdate]);

    useEffect(() => {
        fetchTeamMembers();
    }, [fetchTeamMembers]);

    const updateMemberProfile = async (memberId: string, updates: Partial<Profile>) => {
        setActionLoading(true);
        try {
            await apiService.updateProfile(memberId, updates);

            if (user && memberId === user.id) {
                await refreshProfile();
            }

            await fetchTeamMembers();
            setShowEditModal(false);
            setSelectedMember(null);
            alert('Mission Identity updated successfully.');
        } catch (error: any) {
            alert('Error updating profile: ' + (error.message || 'Unknown error'));
        } finally {
            setActionLoading(false);
        }
    };

    const deleteMember = async (member: Profile) => {
        if (!confirm(`CRITICAL: Purge ${member.full_name} from mission records?`)) return;

        setActionLoading(true);
        try {
            await apiService.deleteProfile(member.id);
            await fetchTeamMembers();
            setShowViewModal(false);
            setSelectedMember(null);
            alert('Member profile purged.');
        } catch (error: any) {
            alert('Purge failed: ' + error.message);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold text-primary">Mission Personnel</h2>
                    <p className="text-gray-500 text-sm">Manage roles and permissions for all registered souls.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-gold text-primary font-bold px-6 py-3 rounded-2xl hover:bg-yellow-400 transition-all shadow-lg text-sm flex items-center"
                    >
                        <i className="fas fa-plus-circle mr-2 text-lg"></i>
                        REGISTER NEW
                    </button>
                    <button
                        onClick={fetchTeamMembers}
                        className="bg-gray-50 text-gray-500 p-4 rounded-xl hover:bg-gray-100 transition-all border border-gray-100"
                    >
                        <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
                    </button>
                </div>
            </div>

            {/* Main Table Container */}
            <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
                {loading && teamMembers.length === 0 ? (
                    <div className="p-24 text-center">
                        <div className="w-12 h-12 border-4 border-gold border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400 font-medium">Synchronizing records...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-10 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Identity</th>
                                    <th className="px-10 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact</th>
                                    <th className="px-10 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Administrative Role</th>
                                    <th className="px-10 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {teamMembers.map((member) => (
                                    <tr key={member.id} className="hover:bg-blue-50/20 transition-colors group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center">
                                                <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                                                    {member.full_name?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div className="ml-5">
                                                    <div className="text-sm font-bold text-primary">{member.full_name || 'Incognito User'}</div>
                                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{member.position || 'Community Member'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="text-sm font-medium text-gray-700">{member.email}</div>
                                            <div className="text-[10px] text-gray-400">{member.phone || 'No direct line'}</div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className={`px-4 py-1.5 inline-flex text-[9px] font-black tracking-widest uppercase rounded-full shadow-sm ${member.role === 'admin' ? 'bg-purple-600 text-white' :
                                                member.role === 'staff' ? 'bg-emerald-500 text-white' :
                                                    member.role === 'volunteer' ? 'bg-gold text-primary' :
                                                        'bg-gray-100 text-gray-600'
                                                }`}>
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right space-x-2">
                                            <button
                                                onClick={() => { setSelectedMember(member); setShowViewModal(true); }}
                                                className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:bg-primary hover:text-white transition-all shadow-sm"
                                            >
                                                <i className="fas fa-eye text-xs"></i>
                                            </button>
                                            <button
                                                onClick={() => { setSelectedMember(member); setShowEditModal(true); }}
                                                className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:bg-secondary hover:text-white transition-all shadow-sm"
                                            >
                                                <i className="fas fa-pen text-xs"></i>
                                            </button>
                                            <button
                                                onClick={() => deleteMember(member)}
                                                className="w-10 h-10 rounded-xl bg-red-50 text-red-300 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                disabled={actionLoading}
                                            >
                                                <i className="fas fa-trash-alt text-xs"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* View Modal */}
            {showViewModal && selectedMember && (
                <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-[3rem] max-w-lg w-full overflow-hidden shadow-2xl animate-fade-in border border-white/20">
                        <div className="h-32 bg-gradient-to-r from-primary via-secondary to-gold relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        </div>
                        <div className="px-10 pb-10 text-center">
                            <div className="relative -mt-16 mb-6">
                                <div className="w-36 h-36 bg-white rounded-[2.5rem] p-3 shadow-2xl mx-auto">
                                    <div className="w-full h-full bg-gradient-to-br from-primary to-secondary rounded-[2rem] flex items-center justify-center text-white text-5xl font-black">
                                        {selectedMember.full_name?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-primary mb-1">{selectedMember.full_name}</h3>
                            <p className="text-gray-500 font-bold mb-6 tracking-wide uppercase text-xs">{selectedMember.position || 'Mission Member'}</p>

                            <div className="bg-gray-50 rounded-3xl p-6 mb-8 text-left space-y-4">
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</span>
                                    <span className="text-sm font-bold text-primary">{selectedMember.email}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-200 pb-2">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</span>
                                    <span className="text-sm font-bold text-primary">{selectedMember.phone || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</span>
                                    <span className="text-sm font-bold text-primary">{selectedMember.location || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => { setShowViewModal(false); setShowEditModal(true); }}
                                    className="flex-1 bg-primary text-white font-black py-5 rounded-2xl hover:bg-secondary transition-all shadow-xl shadow-primary/20"
                                >
                                    EDIT IDENTITY
                                </button>
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="px-8 bg-gray-100 text-gray-500 font-bold py-5 rounded-2xl hover:bg-gray-200 transition-all"
                                >
                                    CLOSE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedMember && (
                <div className="fixed inset-0 bg-primary/60 backdrop-blur-md flex items-center justify-center z-[110] p-4 text-left">
                    <div className="bg-white rounded-[3rem] max-w-2xl w-full p-12 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <h3 className="text-2xl font-black text-primary mb-8 uppercase tracking-widest">Update Divine Identity</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Full Legal Name</label>
                                <input
                                    type="text"
                                    value={selectedMember.full_name || ''}
                                    onChange={(e) => setSelectedMember({ ...selectedMember, full_name: e.target.value })}
                                    className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-gold focus:bg-white focus:outline-none transition-all font-bold text-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Mission Role</label>
                                <select
                                    value={selectedMember.role}
                                    onChange={(e) => setSelectedMember({ ...selectedMember, role: e.target.value as UserRole })}
                                    className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-gold focus:bg-white focus:outline-none transition-all font-bold text-primary appearance-none"
                                >
                                    <option value="user">Regular User</option>
                                    <option value="volunteer">Volunteer</option>
                                    <option value="staff">Official Staff</option>
                                    <option value="admin">System Admin</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Current Position</label>
                                <input
                                    type="text"
                                    value={selectedMember.position || ''}
                                    onChange={(e) => setSelectedMember({ ...selectedMember, position: e.target.value })}
                                    className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-gold focus:bg-white focus:outline-none transition-all font-bold text-primary"
                                    placeholder="e.g. Field Coordinator"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => updateMemberProfile(selectedMember.id, {
                                    full_name: selectedMember.full_name,
                                    role: selectedMember.role,
                                    position: selectedMember.position
                                })}
                                disabled={actionLoading}
                                className="flex-1 bg-gold text-primary font-black py-6 rounded-3xl hover:bg-yellow-400 transition-all shadow-2xl shadow-gold/20 disabled:opacity-50"
                            >
                                {actionLoading ? 'COMMITTING...' : 'SAVE CHANGES'}
                            </button>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 bg-gray-50 text-gray-400 font-bold py-6 rounded-3xl hover:bg-gray-100 transition-all text-center"
                            >
                                CANCEL
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Registration Acknowledgment Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-primary/80 backdrop-blur-xl flex items-center justify-center z-[120] p-4 text-center">
                    <div className="bg-white rounded-[3.5rem] max-w-md w-full p-12 shadow-2xl">
                        <div className="w-20 h-20 bg-gold/10 text-gold rounded-full flex items-center justify-center text-3xl mx-auto mb-8">
                            <i className="fas fa-peace"></i>
                        </div>
                        <h4 className="text-2xl font-black text-primary mb-4 uppercase tracking-tighter">Registration Process</h4>
                        <p className="text-gray-500 text-sm leading-relaxed mb-10 font-medium">
                            New mission members must register their own soul via the <strong>Sign Up</strong> gateway.
                            Once documented, you can return here to assign their administrative rank and holy position.
                        </p>
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="w-full bg-primary text-white font-black py-5 rounded-2xl hover:bg-secondary transition-all shadow-xl shadow-primary/20"
                        >
                            ACKNOWLEDGED
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPersonnel;
