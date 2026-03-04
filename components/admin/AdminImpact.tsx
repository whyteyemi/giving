import React, { useEffect, useState, useCallback } from 'react';
import { ImpactRecord } from '../../services/supabaseClient';
import { apiService } from '../../services/apiService';

const AdminImpact: React.FC = () => {
    const [records, setRecords] = useState<ImpactRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [newRecord, setNewRecord] = useState<Partial<ImpactRecord>>({
        type: 'image',
        title: '',
        content: '',
        media_url: '',
        category: 'general',
        is_featured: false
    });

    const fetchRecords = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiService.fetchImpact();
            setRecords(data || []);
        } catch (error: any) {
            console.error('Error fetching impact records:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    const handleFileUpload = async (file: File) => {
        try {
            setUploading(true);
            const res = await apiService.upload(file);
            return res.url;
        } catch (error: any) {
            alert('Error uploading file: ' + error.message);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleCreateRecord = async () => {
        if (!newRecord.title || !newRecord.type) {
            alert('Title and Type are required');
            return;
        }
        setActionLoading(true);
        try {
            let finalMediaUrl = newRecord.media_url;

            if (selectedFile) {
                const uploadedUrl = await handleFileUpload(selectedFile);
                if (uploadedUrl) {
                    finalMediaUrl = uploadedUrl;
                } else {
                    setActionLoading(false);
                    return;
                }
            }

            await apiService.post('add_impact', { ...newRecord, media_url: finalMediaUrl });

            await fetchRecords();
            setShowAddModal(false);
            setNewRecord({ type: 'image', title: '', content: '', media_url: '', category: 'general', is_featured: false });
            setSelectedFile(null);
        } catch (error: any) {
            alert('Error creating record: ' + error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const deleteRecord = async (id: string) => {
        if (!confirm('Are you sure you want to delete this impact record?')) return;
        try {
            // Need a delete_impact action in PHP
            await apiService.post('delete_impact', { id });
            await fetchRecords();
        } catch (error: any) {
            alert('Error deleting record: ' + error.message);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold text-primary">Impact Media & Stories</h2>
                    <p className="text-gray-500 text-sm">Upload videos, pictures, and testimonies to the Impact page.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-primary text-white font-bold px-8 py-4 rounded-2xl hover:bg-secondary transition-all shadow-lg flex items-center"
                >
                    <i className="fas fa-plus-circle mr-2 text-xl"></i>
                    ADD IMPACT CONTENT
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-12 h-12 border-4 border-gold border-t-primary rounded-full animate-spin mx-auto"></div>
                    </div>
                ) : records.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
                        <i className="fas fa-photo-video text-4xl text-gray-200 mb-4"></i>
                        <p className="text-gray-400">No impact content found. Share the mission's progress.</p>
                    </div>
                ) : (
                    records.map((record) => (
                        <div key={record.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all flex flex-col">
                            <div className="h-48 bg-gray-100 relative overflow-hidden">
                                {record.type === 'video' ? (
                                    <div className="w-full h-full flex items-center justify-center bg-primary text-white relative">
                                        {(() => {
                                            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|video\/)([^#\&\?\/]*).*/;
                                            const match = record.media_url?.match(regExp);
                                            if (match && match[2].length === 11) {
                                                return <img src={`https://img.youtube.com/vi/${match[2]}/0.jpg`} className="w-full h-full object-cover opacity-50" />;
                                            }
                                            return null;
                                        })()}
                                        <i className="fas fa-play-circle text-5xl absolute z-10"></i>
                                    </div>
                                ) : record.media_url ? (
                                    <img src={record.media_url} alt={record.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <i className="fas fa-image text-5xl"></i>
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                                        {record.type}
                                    </span>
                                    {record.is_featured && (
                                        <span className="px-3 py-1 rounded-full bg-gold text-primary text-[10px] font-black uppercase tracking-widest shadow-lg">
                                            FEATURED
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="p-8 flex-grow">
                                <p className="text-gold font-bold text-[10px] uppercase tracking-widest mb-2">
                                    {record.category}
                                </p>
                                <h3 className="text-xl font-bold text-primary mb-3">{record.title}</h3>
                                {record.content && <p className="text-gray-500 text-sm line-clamp-3 mb-6">{record.content}</p>}

                                <div className="mt-auto flex justify-end">
                                    <button
                                        onClick={() => deleteRecord(record.id)}
                                        className="w-10 h-10 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100"
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Record Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-primary/60 backdrop-blur-md flex items-center justify-center z-[150] p-4 text-left">
                    <div className="bg-white rounded-[3rem] max-w-2xl w-full p-12 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <h3 className="text-2xl font-black text-primary mb-8 uppercase tracking-widest">Add Impact Content</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Content Type</label>
                                <select
                                    className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-gold focus:bg-white outline-none transition-all font-bold text-primary"
                                    value={newRecord.type}
                                    onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value as any })}
                                >
                                    <option value="image">Image</option>
                                    <option value="video">Video Link</option>
                                    <option value="story">Testimony/Story</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Category</label>
                                <select
                                    className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-gold focus:bg-white outline-none transition-all font-bold text-primary"
                                    value={newRecord.category}
                                    onChange={(e) => setNewRecord({ ...newRecord, category: e.target.value })}
                                >
                                    <option value="general">General</option>
                                    <option value="feeding">Feeding Program</option>
                                    <option value="recovery">Addiction Recovery</option>
                                    <option value="widows">Widow Support</option>
                                    <option value="education">Educational Support</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Samuel's Recovery Journey"
                                    className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-gold focus:bg-white outline-none transition-all font-bold text-primary"
                                    value={newRecord.title}
                                    onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Media URL (Optional if uploading file)</label>
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-gold focus:bg-white outline-none transition-all font-bold text-primary"
                                    value={newRecord.media_url}
                                    onChange={(e) => {
                                        setNewRecord({ ...newRecord, media_url: e.target.value });
                                        if (e.target.value) setSelectedFile(null); // Clear file if URL provided
                                    }}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">OR Upload Local File (Documents folder, etc.)</label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept={newRecord.type === 'video' ? 'video/*' : 'image/*'}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setSelectedFile(file);
                                                setNewRecord({ ...newRecord, media_url: '' }); // Clear URL if file provided
                                            }
                                        }}
                                        className="hidden"
                                        id="impact-file-upload"
                                    />
                                    <label
                                        htmlFor="impact-file-upload"
                                        className="flex items-center justify-center w-full px-8 py-10 rounded-2xl border-2 border-dashed border-gray-200 group-hover:border-gold group-hover:bg-gray-50 transition-all cursor-pointer"
                                    >
                                        <div className="text-center">
                                            <i className={`fas ${selectedFile ? 'fa-check-circle text-green-500' : 'fa-cloud-upload-alt text-gray-300'} text-4xl mb-4 transition-colors`}></i>
                                            <p className="text-sm font-bold text-gray-500">
                                                {selectedFile ? selectedFile.name : `Choose ${newRecord.type === 'video' ? 'Video' : 'Image'} from PC`}
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Content / Testimony</label>
                                <textarea
                                    className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-gold focus:bg-white outline-none transition-all font-bold text-primary h-32"
                                    placeholder="Write the story here..."
                                    value={newRecord.content}
                                    onChange={(e) => setNewRecord({ ...newRecord, content: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center gap-3 ml-2">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={newRecord.is_featured}
                                    onChange={(e) => setNewRecord({ ...newRecord, is_featured: e.target.checked })}
                                    className="w-5 h-5 accent-gold"
                                />
                                <label htmlFor="featured" className="text-xs font-bold text-primary uppercase">Feature on Top</label>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={handleCreateRecord}
                                disabled={actionLoading || uploading}
                                className="flex-1 bg-primary text-white font-black py-6 rounded-3xl hover:bg-secondary transition-all shadow-xl disabled:opacity-50"
                            >
                                {uploading ? 'UPLOADING...' : actionLoading ? 'SAVING...' : 'PUBLISH IMPACT'}
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

export default AdminImpact;
