
import React, { useEffect, useState, useCallback } from 'react';
import { supabase, Donation } from '../../services/supabaseClient';

const AdminDonations: React.FC = () => {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalRaised, setTotalRaised] = useState(0);

    const fetchDonations = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('donations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            const records = data || [];
            setDonations(records);
            setTotalRaised(records.reduce((sum, d) => sum + Number(d.amount), 0));
        } catch (error: any) {
            if (error.name === 'AbortError' || error.message?.includes('AbortError')) return;
            console.error('Error fetching donations:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDonations();
    }, [fetchDonations]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <div>
                        <h2 className="text-2xl font-bold text-primary">Financial Compassion</h2>
                        <p className="text-gray-500 text-sm">Review donation records for accountability and tax purposes.</p>
                    </div>
                    <button
                        onClick={handlePrint}
                        className="bg-gray-800 text-white font-bold px-8 py-4 rounded-2xl hover:bg-black transition-all shadow-lg flex items-center print:hidden"
                    >
                        <i className="fas fa-print mr-2 text-xl"></i>
                        PRINT RECORDS
                    </button>
                </div>
                <div className="bg-primary p-8 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gold mb-1">Total Lifetime Impact</p>
                    <h3 className="text-4xl font-black">${totalRaised.toLocaleString()}</h3>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-24 text-center">
                        <div className="w-12 h-12 border-4 border-gold border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400 font-medium">Assembling records...</p>
                    </div>
                ) : donations.length === 0 ? (
                    <div className="p-24 text-center">
                        <i className="fas fa-money-bill-wave text-4xl text-gray-100 mb-4"></i>
                        <p className="text-gray-400">No donation records found. The first seed is yet to be planted.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-10 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Donor Details</th>
                                    <th className="px-10 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gift Amount</th>
                                    <th className="px-10 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target Campaign</th>
                                    <th className="px-10 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment ID</th>
                                    <th className="px-10 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {donations.map((donation) => (
                                    <tr key={donation.id} className="hover:bg-blue-50/20 transition-colors group">
                                        <td className="px-10 py-6">
                                            <div className="text-sm font-bold text-primary">{donation.donor_name}</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{donation.email}</div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="text-lg font-black text-emerald-600">${Number(donation.amount).toLocaleString()}</div>
                                            <div className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Successful</div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="text-xs font-medium text-gray-600">
                                                {donation.campaign_id ? 'Special Help Me' : 'General Donation'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <code className="text-[10px] bg-gray-50 px-2 py-1 rounded text-gray-400 font-mono">
                                                {donation.payment_id || 'LOCAL-REF'}
                                            </code>
                                        </td>
                                        <td className="px-10 py-6 text-right text-xs text-gray-500 font-medium">
                                            {new Date(donation.created_at).toLocaleDateString()}
                                            <div className="text-[10px] text-gray-300">
                                                {new Date(donation.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Print Friendly View Helper (Hidden) */}
            <div className="hidden print:block fixed inset-0 bg-white z-[999] p-12">
                <div className="flex justify-between items-center mb-10 border-b-2 border-primary pb-8">
                    <div>
                        <h1 className="text-3xl font-black text-primary uppercase">Financial Impact Report</h1>
                        <p className="text-gray-500 font-bold">Giving Without Limit NGO</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-gray-400 uppercase">Generated On</p>
                        <p className="text-lg font-black text-primary">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="mb-12 grid grid-cols-2 gap-8">
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Total Transaction Count</p>
                        <p className="text-2xl font-black text-primary">{donations.length} Contributions</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Total Impact Amount</p>
                        <p className="text-2xl font-black text-emerald-600">${totalRaised.toLocaleString()}</p>
                    </div>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="py-4 text-[10px] font-black uppercase text-gray-400">Donor</th>
                            <th className="py-4 text-[10px] font-black uppercase text-gray-400">Email</th>
                            <th className="py-4 text-[10px] font-black uppercase text-gray-400">Amount</th>
                            <th className="py-4 text-[10px] font-black uppercase text-gray-400">Ref</th>
                            <th className="py-4 text-[10px] font-black uppercase text-gray-400">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.map(d => (
                            <tr key={d.id} className="border-b border-gray-100">
                                <td className="py-4 font-bold text-sm">{d.donor_name}</td>
                                <td className="py-4 text-xs text-gray-500">{d.email}</td>
                                <td className="py-4 font-black text-sm">${Number(d.amount).toLocaleString()}</td>
                                <td className="py-4 text-[10px] font-mono text-gray-400">{d.payment_id || 'LOCAL'}</td>
                                <td className="py-4 text-xs">{new Date(d.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-20 pt-8 border-t border-gray-100 text-center">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Official Records - End of Report</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDonations;
