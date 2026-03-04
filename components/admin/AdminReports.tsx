
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';

interface FieldReport {
    id: string;
    title: string;
    summary: string;
    full_report: string;
    beneficiaries: number;
    location: string;
    category: string;
    status: 'draft' | 'internal' | 'released';
    created_at: string;
}

const AdminReports: React.FC = () => {
    const [reports, setReports] = useState<FieldReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<FieldReport | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<FieldReport>>({
        title: '',
        summary: '',
        full_report: '',
        beneficiaries: 0,
        location: '',
        category: '',
        status: 'draft'
    });

    const loadReports = async () => {
        setLoading(true);
        try {
            const data = await apiService.fetchFieldReports();
            setReports(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, []);

    const totalBeneficiaries = reports.reduce((sum, r) => sum + (Number(r.beneficiaries) || 0), 0);

    const handleView = (report: FieldReport) => {
        setSelectedReport(report);
        setIsViewModalOpen(true);
    };

    const handleEdit = (report: FieldReport) => {
        setSelectedReport(report);
        setFormData(report);
        setIsEditModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedReport(null);
        setFormData({
            title: '',
            summary: '',
            full_report: '',
            beneficiaries: 0,
            location: '',
            category: '',
            status: 'draft'
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) return;

        try {
            await apiService.deleteFieldReport(id);
            await loadReports();
        } catch (error) {
            alert('Failed to delete report');
            console.error(error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (selectedReport) {
                await apiService.updateFieldReport(formData);
            } else {
                await apiService.createFieldReport(formData);
            }
            setIsEditModalOpen(false);
            await loadReports();
        } catch (error) {
            alert('Failed to save report');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownload = (report: FieldReport) => {
        setSelectedReport(report);
        setTimeout(() => {
            window.print();
        }, 100);
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            released: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            internal: 'bg-blue-100 text-blue-700 border-blue-200',
            draft: 'bg-amber-100 text-amber-700 border-amber-200'
        };
        const style = styles[status as keyof typeof styles] || styles.draft;
        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${style}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-md">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Reports Generated</p>
                        <h3 className="text-4xl font-black text-primary">{reports.length}</h3>
                    </div>
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center text-2xl">
                        <i className="fas fa-file-invoice"></i>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-md">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Impacted Beneficiaries</p>
                        <h3 className="text-4xl font-black text-emerald-500">{totalBeneficiaries.toLocaleString()}</h3>
                    </div>
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center text-2xl">
                        <i className="fas fa-users-rays"></i>
                    </div>
                </div>
            </div>

            {/* Reports Table */}
            <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-2xl font-bold text-primary">Strategic Operational Data</h2>
                    <button
                        onClick={handleAddNew}
                        className="bg-primary text-white font-bold px-8 py-3 rounded-2xl hover:bg-secondary transition-all shadow-lg flex items-center group"
                    >
                        <i className="fas fa-plus mr-3 group-hover:rotate-90 transition-transform"></i>
                        GENERATE NEW REPORT
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-10 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Report Title</th>
                                <th className="px-10 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Beneficiaries</th>
                                <th className="px-10 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-10 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Created</th>
                                <th className="px-10 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center">
                                        <div className="w-10 h-10 border-4 border-gold border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-gray-400">Loading data...</p>
                                    </td>
                                </tr>
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center text-gray-400 font-medium">
                                        <i className="fas fa-folder-open text-4xl mb-4 block opacity-20"></i>
                                        No reports found. Start by generating your first field report.
                                    </td>
                                </tr>
                            ) : (
                                reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-10 py-6">
                                            <div className="text-sm font-bold text-primary group-hover:text-gold transition-colors">{report.title}</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{report.location}</div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="text-sm font-black text-gray-700">{report.beneficiaries}</div>
                                            <div className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">{report.category}</div>
                                        </td>
                                        <td className="px-10 py-6">
                                            {getStatusBadge(report.status)}
                                        </td>
                                        <td className="px-10 py-6 text-xs text-gray-500 font-medium">
                                            {new Date(report.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-10 py-6 text-right space-x-2">
                                            <button
                                                onClick={() => handleView(report)}
                                                className="p-2.5 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-100 transition-all active:scale-95"
                                                title="View Details"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            <button
                                                onClick={() => handleEdit(report)}
                                                className="p-2.5 bg-amber-50 text-amber-500 rounded-xl hover:bg-amber-100 transition-all active:scale-95"
                                                title="Edit Report"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDownload(report)}
                                                className="p-2.5 bg-emerald-50 text-emerald-500 rounded-xl hover:bg-emerald-100 transition-all active:scale-95"
                                                title="Generate PDF"
                                            >
                                                <i className="fas fa-download"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(report.id)}
                                                className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all active:scale-95"
                                                title="Delete Record"
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Modal */}
            {isViewModalOpen && selectedReport && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-primary uppercase tracking-tighter">{selectedReport.title}</h3>
                                <p className="text-xs font-bold text-gold uppercase tracking-widest">{selectedReport.category} | {selectedReport.location}</p>
                            </div>
                            <button onClick={() => setIsViewModalOpen(false)} className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Beneficiaries</p>
                                    <p className="text-2xl font-black text-blue-700">{selectedReport.beneficiaries}</p>
                                </div>
                                <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Current Status</p>
                                    <p className="text-2xl font-black text-emerald-700 uppercase leading-none mt-1">{selectedReport.status}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Executive Summary</h4>
                                <p className="text-gray-600 leading-relaxed text-lg">{selectedReport.summary}</p>
                            </div>

                            <div className="pt-8 border-t border-gray-50">
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Comprehensive Field Data</h4>
                                <div className="prose prose-sm text-gray-500 max-w-none whitespace-pre-wrap">
                                    {selectedReport.full_report}
                                </div>
                            </div>
                        </div>
                        <div className="p-8 border-t border-gray-50 bg-gray-50/50 flex justify-end gap-4">
                            <button
                                onClick={() => { setIsViewModalOpen(false); handleDownload(selectedReport); }}
                                className="bg-primary text-white font-black px-10 py-4 rounded-2xl hover:bg-secondary transition-all shadow-xl flex items-center"
                            >
                                <i className="fas fa-download mr-2"></i> DOWNLOAD PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit/Create Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-primary uppercase tracking-tighter">
                                    {selectedReport ? 'Refine Field Report' : 'Draft New Operational Report'}
                                </h3>
                                <p className="text-xs font-bold text-gold uppercase tracking-widest">
                                    Strategic Mission Documentation
                                </p>
                            </div>
                            <button onClick={() => setIsEditModalOpen(false)} className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-10 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Report Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold text-primary"
                                        placeholder="e.g. Q1 Widows Support - Lagos"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Location/Region</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold text-primary"
                                        placeholder="e.g. Ikorodu, Lagos"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold text-primary"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Widow Support">Widow Support</option>
                                        <option value="Feeding Program">Feeding Program</option>
                                        <option value="Education">Education</option>
                                        <option value="Addiction Recovery">Addiction Recovery</option>
                                        <option value="General Mission">General Mission</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold text-primary"
                                    >
                                        <option value="draft">Draft (Internal Only)</option>
                                        <option value="internal">Internal (Shared Team)</option>
                                        <option value="released">Released (Public Summaries)</option>
                                    </select>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Impact Analytics (Beneficiary Count)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.beneficiaries}
                                        onChange={(e) => setFormData({ ...formData, beneficiaries: parseInt(e.target.value) })}
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold text-primary"
                                        placeholder="Number of souls reached"
                                    />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Executive Summary</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={formData.summary}
                                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-gray-600"
                                        placeholder="A brief overview of the mission impact..."
                                    />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Comprehensive Field Report</label>
                                    <textarea
                                        required
                                        rows={8}
                                        value={formData.full_report}
                                        onChange={(e) => setFormData({ ...formData, full_report: e.target.value })}
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-gray-600 whitespace-pre-wrap"
                                        placeholder="Detailed operational data, highlights, and milestones..."
                                    />
                                </div>
                            </div>
                        </form>
                        <div className="p-8 border-t border-gray-50 bg-gray-50/50 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-8 py-4 rounded-2xl font-bold text-gray-400 hover:text-gray-600 transition-all"
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-primary text-white font-black px-12 py-4 rounded-2xl hover:bg-secondary transition-all shadow-xl flex items-center disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div> SAVING...</>
                                ) : (
                                    <><i className="fas fa-save mr-2"></i> {selectedReport ? 'UPDATE REPORT' : 'RELEASE REPORT'}</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Print Layout (Hidden on Screen) */}
            <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-16 font-serif">
                {selectedReport && (
                    <>
                        <div className="flex justify-between items-start mb-16 border-b-4 border-primary pb-10">
                            <div>
                                <h1 className="text-5xl font-black text-primary uppercase mb-2 tracking-tighter">Official Field Report</h1>
                                <p className="text-xl font-bold text-gray-500">Giving Without Limit - Strategy & Operations</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-gray-400 uppercase mb-1">Status: {selectedReport.status?.toUpperCase()}</p>
                                <p className="text-lg font-bold text-primary">Generated: {new Date().toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="mb-10 py-6 border-y border-gray-100">
                            <h2 className="text-3xl font-black text-primary uppercase mb-4">{selectedReport.title}</h2>
                            <p className="text-lg text-gray-600 mb-2">Location: {selectedReport.location}</p>
                            <p className="text-lg text-gray-600">Beneficiaries: {selectedReport.beneficiaries?.toLocaleString()}</p>
                            <p className="text-lg text-gray-600">Category: {selectedReport.category}</p>
                        </div>
                        <div className="space-y-10">
                            <section>
                                <h3 className="text-xl font-black text-primary uppercase border-b border-gray-200 pb-2 mb-4">Summary</h3>
                                <p className="text-lg text-gray-700 leading-relaxed">{selectedReport.summary}</p>
                            </section>
                            <section>
                                <h3 className="text-xl font-black text-primary uppercase border-b border-gray-200 pb-2 mb-4">Full Details</h3>
                                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {selectedReport.full_report}
                                </div>
                            </section>
                        </div>
                        <div className="mt-20 pt-10 border-t border-gray-100 text-center opacity-30">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Giving Without Limit NGO - End of Document</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminReports;
