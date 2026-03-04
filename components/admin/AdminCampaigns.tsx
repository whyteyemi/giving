
import React, { useEffect, useState, useCallback } from 'react';
import { supabase, HelpMeCampaign } from '../../services/supabaseClient';

const AdminCampaigns: React.FC = () => {
    const [campaigns, setCampaigns] = useState<HelpMeCampaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const [newCampaign, setNewCampaign] = useState({
        title: '',
        description: '',
        target_amount: 0,
        beneficiary_name: '',
        closing_date: '',
        image_url: '',
        status: 'active' as const
    });

    const fetchCampaigns = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('help_me_campaigns')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCampaigns(data || []);
        } catch (error: any) {
            if (error.name === 'AbortError' || error.message?.includes('AbortError')) return;
            console.error('Error fetching campaigns:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    const handleCreateCampaign = async () => {
        setActionLoading(true);
        try {
            const { error } = await supabase
                .from('help_me_campaigns')
                .insert([newCampaign]);

            if (error) throw error;
            await fetchCampaigns();
            setShowAddModal(false);
            setNewCampaign({
                title: '',
                description: '',
                target_amount: 0,
                beneficiary_name: '',
                closing_date: '',
                image_url: '',
                status: 'active'
            });
        } catch (error: any) {
            alert('Error creating campaign: ' + error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const updateStatus = async (id: string, status: 'active' | 'completed' | 'closed') => {
        try {
            const { error } = await supabase
                .from('help_me_campaigns')
                .update({ status })
                .eq('id', id);
            if (error) throw error;
            await fetchCampaigns();
        } catch (error: any) {
            alert('Error updating status: ' + error.message);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold text-primary">Help Me Campaigns</h2>
                    <p className="text-gray-500 text-sm">Create specialized fundraising drives for individuals in need.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gold text-primary font-bold px-8 py-4 rounded-2xl hover:bg-yellow-400 transition-all shadow-lg flex items-center"
                >
                    <i className="fas fa-hand-holding-heart mr-2 text-xl"></i>
                    NEW HELP ME
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-12 h-12 border-4 border-gold border-t-primary rounded-full animate-spin mx-auto"></div>
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
                        <i className="fas fa-heart text-4xl text-gray-200 mb-4"></i>
                        <p className="text-gray-400">No active campaigns. Start a mission to help someone today.</p>
                    </div>
                ) : (
                    campaigns.map((campaign) => (
                        <div key={campaign.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 group flex flex-col">
                            <div className="h-40 bg-gray-100 relative">
                                {campaign.image_url ? (
                                    <img src={campaign.image_url} alt={campaign.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <i className="fas fa-hand-holding-medical text-4xl"></i>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg ${campaign.status === 'active' ? 'bg-emerald-500 text-white' :
                                        campaign.status === 'completed' ? 'bg-primary text-white' : 'bg-gray-400 text-white'
                                        }`}>
                                        {campaign.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8 flex-grow">
                                <h3 className="text-xl font-bold text-primary mb-2">{campaign.title}</h3>
                                {campaign.beneficiary_name && (
                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                                        Beneficiary: <span className="text-primary">{campaign.beneficiary_name}</span>
                                    </p>
                                )}

                                <div className="mb-6">
                                    <div className="flex justify-between text-xs font-bold mb-2">
                                        <span className="text-gray-400">Raised: ${campaign.current_amount.toLocaleString()}</span>
                                        <span className="text-primary">Target: ${campaign.target_amount.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gold transition-all duration-1000"
                                            style={{ width: `${Math.min((campaign.current_amount / campaign.target_amount) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {campaign.status === 'active' && (
                                        <button
                                            onClick={() => updateStatus(campaign.id, 'completed')}
                                            className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-secondary transition-all text-xs"
                                        >
                                            MARK COMPLETED
                                        </button>
                                    )}
                                    <button
                                        onClick={() => updateStatus(campaign.id, 'closed')}
                                        className="px-4 bg-gray-50 text-gray-400 font-bold py-3 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all text-xs"
                                    >
                                        CLOSE
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Campaign Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-primary/60 backdrop-blur-md flex items-center justify-center z-[150] p-4 text-left">
                    <div className="bg-white rounded-[3rem] max-w-2xl w-full p-12 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <h3 className="text-2xl font-black text-primary mb-8 uppercase tracking-widest">Launch Help Me Drive</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Campaign Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Surgery for Sarah"
                                    className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-gold focus:bg-white outline-none transition-all font-bold text-primary"
                                    value={newCampaign.title}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Beneficiary Name</label>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-gold focus:bg-white outline-none transition-all font-bold text-primary"
                                    value={newCampaign.beneficiary_name}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, beneficiary_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Target Amount ($)</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-gold focus:bg-white outline-none transition-all font-bold text-primary"
                                    value={newCampaign.target_amount}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, target_amount: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Closing Date (Optional)</label>
                                <input
                                    type="date"
                                    className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-gold focus:bg-white outline-none transition-all font-bold text-primary"
                                    value={newCampaign.closing_date}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, closing_date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Featured Image URL</label>
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-gold focus:bg-white outline-none transition-all font-bold text-primary"
                                    value={newCampaign.image_url}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, image_url: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Personal Story / Description</label>
                                <textarea
                                    className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-gold focus:bg-white outline-none transition-all font-bold text-primary h-32"
                                    placeholder="Share the person's situation and why we should help..."
                                    value={newCampaign.description}
                                    onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={handleCreateCampaign}
                                disabled={actionLoading}
                                className="flex-1 bg-emerald-500 text-white font-black py-6 rounded-3xl hover:bg-emerald-600 transition-all shadow-xl disabled:opacity-50"
                            >
                                {actionLoading ? 'LAUNCHING...' : 'START CAMPAIGN'}
                            </button>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 bg-gray-50 text-gray-400 font-bold py-6 rounded-3xl hover:bg-gray-100 transition-all text-center"
                            >
                                CANCEL
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCampaigns;
