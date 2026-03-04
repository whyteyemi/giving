
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminPersonnel from '../components/admin/AdminPersonnel';
import AdminEvents from '../components/admin/AdminEvents';
import AdminCampaigns from '../components/admin/AdminCampaigns';
import AdminVolunteers from '../components/admin/AdminVolunteers';
import AdminDonations from '../components/admin/AdminDonations';
import AdminImpact from '../components/admin/AdminImpact';
import AdminReports from '../components/admin/AdminReports';

type AdminTab = 'personnel' | 'events' | 'campaigns' | 'volunteers' | 'donations' | 'impact' | 'reports';

const AdminDashboard: React.FC = () => {
    const { isAdmin, signOut, profile } = useAuth();
    const [activeTab, setActiveTab] = useState<AdminTab>('personnel');
    const [stats, setStats] = useState({
        total: 0,
        admins: 0,
        staff: 0,
        volunteers: 0,
        users: 0
    });

    if (!isAdmin) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-lg w-full text-center border border-gray-100">
                    <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                        <i className="fas fa-shield-alt"></i>
                    </div>
                    <h2 className="text-3xl font-bold text-primary mb-4">Sanctuary Entrance Forbidden</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        This area is reserved for mission administrators. If you believe this is an error, please contact the coordinator.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-secondary transition-all shadow-lg"
                    >
                        RETURN TO MISSION HOME
                    </button>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'personnel', label: 'Personnel', icon: 'users-cog' },
        { id: 'events', label: 'Events & Media', icon: 'calendar-star' },
        { id: 'campaigns', label: 'Help Me Drive', icon: 'heart-pulse' },
        { id: 'volunteers', label: 'Applications', icon: 'id-badge' },
        { id: 'donations', label: 'Donation List', icon: 'hand-holding-dollar' },
        { id: 'impact', label: 'Impact Media', icon: 'clapperboard' },
        { id: 'reports', label: 'Field Reports', icon: 'file-contract' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row pt-20">
            {/* Sidebar */}
            <aside className="w-full md:w-80 bg-white border-r border-gray-100 flex flex-col h-auto md:h-[calc(100vh-5rem)] sticky top-20 overflow-y-auto">
                <div className="p-8">
                    <div className="flex items-center gap-4 mb-10 p-4 bg-gray-50 rounded-3xl border border-gray-100">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                            {profile?.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-black text-primary truncate w-32">{profile?.full_name}</p>
                            <p className="text-[10px] font-bold text-gold uppercase tracking-widest">Master Admin</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as AdminTab)}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all text-sm ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
                                    : 'text-gray-400 hover:bg-gray-50 hover:text-primary'
                                    }`}
                            >
                                <i className={`fas fa-${tab.icon} w-6 text-center text-lg`}></i>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-8 border-t border-gray-50">
                    <button
                        onClick={signOut}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-400 hover:bg-red-50 transition-all text-sm"
                    >
                        <i className="fas fa-sign-out-alt w-6 text-center text-lg"></i>
                        Exit Command
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                {/* Stats Summary (Conditional visibility) */}
                {activeTab === 'personnel' && (
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
                        {[
                            { label: 'Total Souls', val: stats.total, icon: 'users', color: 'bg-blue-500' },
                            { label: 'Council', val: stats.admins, icon: 'shield-halved', color: 'bg-purple-500' },
                            { label: 'Stewards', val: stats.staff, icon: 'user-tie', color: 'bg-emerald-500' },
                            { label: 'Servants', val: stats.volunteers, icon: 'hand-holding-heart', color: 'bg-gold' },
                            { label: 'Seekers', val: stats.users, icon: 'user', color: 'bg-gray-400' },
                        ].map((s, i) => (
                            <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transform hover:-translate-y-1 transition-all">
                                <div className={`w-10 h-10 ${s.color} text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-black/5`}>
                                    <i className={`fas fa-${s.icon} text-sm`}></i>
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">{s.label}</p>
                                <p className="text-3xl font-black text-primary">{s.val}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tab Content Components */}
                {activeTab === 'personnel' && <AdminPersonnel onStatsUpdate={setStats} />}
                {activeTab === 'events' && <AdminEvents />}
                {activeTab === 'campaigns' && <AdminCampaigns />}
                {activeTab === 'volunteers' && <AdminVolunteers />}
                {activeTab === 'donations' && <AdminDonations />}
                {activeTab === 'impact' && <AdminImpact />}
                {activeTab === 'reports' && <AdminReports />}
            </main>
        </div>
    );
};

export default AdminDashboard;
