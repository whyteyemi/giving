import React, { useEffect, useState, useCallback } from 'react';
import { apiService } from '../../services/apiService';
import { VolunteerApplication } from '../../services/supabaseClient';

const AdminVolunteers: React.FC = () => {
    const [applications, setApplications] = useState<VolunteerApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'disapproved'>('all');

    const fetchApplications = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiService.fetchVolunteers();
            let filteredData = data || [];
            if (filter !== 'all') {
                filteredData = filteredData.filter((app: any) => app.status === filter);
            }
            setApplications(filteredData);
        } catch (error: any) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const updateStatus = async (id: string, status: 'approved' | 'disapproved') => {
        setActionLoading(true);
        try {
            await apiService.updateVolunteerStatus(id, status);
            await fetchApplications();
        } catch (error: any) {
            alert('Error updating application: ' + error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const deleteApplication = async (id: string) => {
        if (!confirm('Delete this record?')) return;
        try {
            await apiService.deleteVolunteer(id);
            await fetchApplications();
        } catch (error: any) {
            alert('Error deleting application: ' + error.message);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold text-primary">Volunteer Submissions</h2>
                    <p className="text-gray-500 text-sm">Review and manage mission involvement requests.</p>
                </div>
                <div className="flex bg-gray-50 p-2 rounded-2xl border border-gray-100">
                    {['all', 'pending', 'approved', 'disapproved'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-24 text-center">
                        <div className="w-12 h-12 border-4 border-gold border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400 font-medium">Loading applications...</p>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="p-24 text-center">
                        <i className="fas fa-user-clock text-4xl text-gray-200 mb-4"></i>
                        <p className="text-gray-400">No {filter !== 'all' ? filter : ''} applications found at this time.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-10 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Candidate</th>
                                    <th className="px-10 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Interest Area</th>
                                    <th className="px-10 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Submission Date</th>
                                    <th className="px-10 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-10 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Decision</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-blue-50/20 transition-colors group">
                                        <td className="px-10 py-6">
                                            <div className="text-sm font-bold text-primary">{app.full_name}</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{app.email}</div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                                                {app.interest_area || 'General Help'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-xs text-gray-500">
                                            {new Date(app.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm ${app.status === 'pending' ? 'bg-gold text-primary' :
                                                app.status === 'approved' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right space-x-2">
                                            {app.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => updateStatus(app.id, 'approved')}
                                                        disabled={actionLoading}
                                                        className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest border border-emerald-100"
                                                    >
                                                        APPROVE
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(app.id, 'disapproved')}
                                                        disabled={actionLoading}
                                                        className="px-4 py-2 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest border border-red-100"
                                                    >
                                                        REJECT
                                                    </button>
                                                </>
                                            )}
                                            {app.status !== 'pending' && (
                                                <button
                                                    onClick={() => deleteApplication(app.id)}
                                                    className="w-10 h-10 rounded-xl bg-gray-50 text-gray-300 hover:text-red-500 transition-all border border-gray-100"
                                                >
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminVolunteers;
