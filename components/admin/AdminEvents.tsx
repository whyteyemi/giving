import React, { useEffect, useState, useCallback } from 'react';
import { apiService } from '../../services/apiService';
import { Event, EventMedia } from '../../services/supabaseClient';

const AdminEvents: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [media, setMedia] = useState<EventMedia[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        status: 'upcoming' as const,
        image_url: ''
    });

    const [newMedia, setNewMedia] = useState({
        media_url: '',
        media_type: 'image' as const,
        title: ''
    });

    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiService.fetchEvents();
            setEvents(data || []);
        } catch (error: any) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMedia = async (eventId: string) => {
        try {
            const data = await apiService.fetchEventMedia(eventId);
            setMedia(data || []);
        } catch (error: any) {
            console.error('Error fetching media:', error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

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

    const handleCreateEvent = async () => {
        setActionLoading(true);
        try {
            let finalImageUrl = newEvent.image_url;

            if (coverFile) {
                const uploadedUrl = await handleFileUpload(coverFile);
                if (uploadedUrl) {
                    finalImageUrl = uploadedUrl;
                } else {
                    setActionLoading(false);
                    return;
                }
            }

            await apiService.createEvent({ ...newEvent, image_url: finalImageUrl });
            await fetchEvents();
            setShowAddModal(false);
            setNewEvent({ title: '', description: '', date: '', location: '', status: 'upcoming', image_url: '' });
            setCoverFile(null);
        } catch (error: any) {
            alert('Error creating event: ' + error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleAddMedia = async () => {
        if (!selectedEvent) return;
        setActionLoading(true);
        try {
            let finalMediaUrl = newMedia.media_url;

            if (selectedFile) {
                const uploadedUrl = await handleFileUpload(selectedFile);
                if (uploadedUrl) {
                    finalMediaUrl = uploadedUrl;
                } else {
                    setActionLoading(false);
                    return;
                }
            }

            if (!finalMediaUrl) {
                alert('Please provide a URL or select a file.');
                setActionLoading(false);
                return;
            }

            await apiService.addEventMedia({ ...newMedia, media_url: finalMediaUrl, event_id: selectedEvent.id });
            await fetchMedia(selectedEvent.id);
            setNewMedia({ media_url: '', media_type: 'image', title: '' });
            setSelectedFile(null);
        } catch (error: any) {
            alert('Error adding media: ' + error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const deleteEvent = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event? All associated media will be lost.')) return;
        try {
            await apiService.deleteEvent(id);
            await fetchEvents();
        } catch (error: any) {
            alert('Error deleting event: ' + error.message);
        }
    };

    const deleteMedia = async (id: string) => {
        if (!confirm('Delete this media?')) return;
        try {
            await apiService.deleteEventMedia(id);
            if (selectedEvent) fetchMedia(selectedEvent.id);
        } catch (error: any) {
            alert('Error deleting media: ' + error.message);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold text-primary">Events & Media Sessions</h2>
                    <p className="text-gray-500 text-sm">Schedule upcoming programs and manage past event media.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-primary text-white font-bold px-8 py-4 rounded-2xl hover:bg-secondary transition-all shadow-lg flex items-center"
                >
                    <i className="fas fa-calendar-plus mr-2 text-xl"></i>
                    CREATE EVENT
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-12 h-12 border-4 border-gold border-t-primary rounded-full animate-spin mx-auto"></div>
                    </div>
                ) : events.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
                        <i className="fas fa-calendar-alt text-4xl text-gray-200 mb-4"></i>
                        <p className="text-gray-400">No events found. Start by creating your first mission event.</p>
                    </div>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all flex flex-col">
                            <div className="h-48 bg-gray-100 relative overflow-hidden">
                                {event.image_url ? (
                                    <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <i className="fas fa-image text-5xl"></i>
                                    </div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${event.status === 'upcoming' ? 'bg-gold text-primary' : 'bg-gray-800 text-white'
                                        }`}>
                                        {event.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8 flex-grow">
                                <p className="text-gold font-bold text-xs uppercase tracking-widest mb-2">
                                    <i className="fas fa-calendar-day mr-2"></i>
                                    {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                                <h3 className="text-xl font-bold text-primary mb-3">{event.title}</h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-6">{event.description}</p>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setSelectedEvent(event); fetchMedia(event.id); setShowMediaModal(true); }}
                                        className="flex-1 bg-gray-50 text-primary font-bold py-3 rounded-xl hover:bg-primary hover:text-white transition-all text-xs border border-gray-100"
                                    >
                                        <i className="fas fa-photo-video mr-2"></i>
                                        MEDIA SESSION
                                    </button>
                                    <button
                                        onClick={() => deleteEvent(event.id)}
                                        className="w-12 h-12 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100"
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Event Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-primary/60 backdrop-blur-md flex items-center justify-center z-[150] p-4 text-left">
                    <div className="bg-white rounded-[3rem] max-w-2xl w-full p-12 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <h3 className="text-2xl font-black text-primary mb-8 uppercase tracking-widest">Schedule New Program</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Event Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Annual Charity Walk"
                                    className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-gold focus:bg-white outline-none transition-all font-bold text-primary"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Event Date</label>
                                <input
                                    type="datetime-local"
                                    className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-gold focus:bg-white outline-none transition-all font-bold text-primary"
                                    value={newEvent.date}
                                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Location</label>
                                <input
                                    type="text"
                                    placeholder="Lagos, Nigeria"
                                    className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-gold focus:bg-white outline-none transition-all font-bold text-primary"
                                    value={newEvent.location}
                                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Description</label>
                                <textarea
                                    className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-gold focus:bg-white outline-none transition-all font-bold text-primary h-32"
                                    placeholder="Describe the mission goal..."
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Cover Image URL</label>
                                <div className="space-y-4">
                                    <input
                                        type="url"
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-gold focus:bg-white outline-none transition-all font-bold text-primary"
                                        value={newEvent.image_url}
                                        onChange={(e) => {
                                            setNewEvent({ ...newEvent, image_url: e.target.value });
                                            if (e.target.value) setCoverFile(null);
                                        }}
                                    />
                                    <div className="relative group">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">OR Upload Local Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setCoverFile(file);
                                                    setNewEvent({ ...newEvent, image_url: '' });
                                                }
                                            }}
                                            className="hidden"
                                            id="event-cover-file"
                                        />
                                        <label
                                            htmlFor="event-cover-file"
                                            className="flex flex-col items-center justify-center w-full p-6 rounded-2xl border-2 border-dashed border-gray-200 group-hover:border-gold group-hover:bg-gray-50 transition-all cursor-pointer bg-white"
                                        >
                                            <i className={`fas ${coverFile ? 'fa-check text-green-500' : 'fa-upload text-gray-300'} text-2xl mb-2`}></i>
                                            <span className="text-xs font-bold text-gray-400">
                                                {coverFile ? coverFile.name : 'Select Image from PC'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={handleCreateEvent}
                                disabled={actionLoading}
                                className="flex-1 bg-primary text-white font-black py-6 rounded-3xl hover:bg-secondary transition-all shadow-xl disabled:opacity-50"
                            >
                                {actionLoading ? 'SCHEDULING...' : 'PUBLISH EVENT'}
                            </button>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 bg-gray-50 text-gray-400 font-bold py-6 rounded-3xl hover:bg-gray-100 transition-all text-center"
                            >
                                DISCARD
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Media Session Modal */}
            {showMediaModal && selectedEvent && (
                <div className="fixed inset-0 bg-primary/80 backdrop-blur-xl flex items-center justify-center z-[150] p-4 text-left">
                    <div className="bg-white rounded-[3.5rem] max-w-4xl w-full p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[95vh]">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-3xl font-black text-primary uppercase tracking-tighter">Media Session</h3>
                                <p className="text-gold font-bold text-xs uppercase tracking-widest mt-1">{selectedEvent.title}</p>
                            </div>
                            <button onClick={() => setShowMediaModal(false)} className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Upload Form */}
                            <div className="lg:col-span-1 space-y-6">
                                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                                    <h4 className="text-primary font-bold mb-6 flex items-center">
                                        <i className="fas fa-cloud-upload-alt mr-2 text-gold"></i>
                                        Upload Media
                                    </h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Type</label>
                                            <select
                                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none text-sm font-bold text-primary"
                                                value={newMedia.media_type}
                                                onChange={(e) => setNewMedia({ ...newMedia, media_type: e.target.value as any })}
                                            >
                                                <option value="image">Picture</option>
                                                <option value="video">Video Link</option>
                                                <option value="audio">Audio Clip</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">URL / Source</label>
                                            <input
                                                type="text"
                                                placeholder="Link to file..."
                                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none text-sm font-bold text-primary"
                                                value={newMedia.media_url}
                                                onChange={(e) => {
                                                    setNewMedia({ ...newMedia, media_url: e.target.value });
                                                    if (e.target.value) setSelectedFile(null);
                                                }}
                                            />
                                        </div>
                                        <div className="relative group">
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">OR Local File</label>
                                            <input
                                                type="file"
                                                accept={newMedia.media_type === 'video' ? 'video/*' : 'image/*'}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setSelectedFile(file);
                                                        setNewMedia({ ...newMedia, media_url: '' });
                                                    }
                                                }}
                                                className="hidden"
                                                id="event-media-file"
                                            />
                                            <label
                                                htmlFor="event-media-file"
                                                className="flex flex-col items-center justify-center w-full p-4 rounded-xl border-2 border-dashed border-gray-200 group-hover:border-gold group-hover:bg-gray-50 transition-all cursor-pointer bg-white"
                                            >
                                                <i className={`fas ${selectedFile ? 'fa-check text-green-500' : 'fa-upload text-gray-300'} text-lg mb-1`}></i>
                                                <span className="text-[10px] font-bold text-gray-400 truncate w-full text-center">
                                                    {selectedFile ? selectedFile.name : 'Choose File'}
                                                </span>
                                            </label>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Caption</label>
                                            <input
                                                type="text"
                                                placeholder="Moment description..."
                                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none text-sm font-bold text-primary"
                                                value={newMedia.title}
                                                onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
                                            />
                                        </div>
                                        <button
                                            onClick={handleAddMedia}
                                            disabled={actionLoading || uploading}
                                            className="w-full bg-gold text-primary font-black py-4 rounded-2xl hover:bg-yellow-400 transition-all shadow-lg text-sm mt-4 disabled:opacity-50"
                                        >
                                            {uploading ? 'UPLOADING...' : actionLoading ? 'STORING...' : 'ADD TO HISTORY'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Media List */}
                            <div className="lg:col-span-2">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {media.length === 0 ? (
                                        <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                            <p className="text-gray-400 font-medium">No media uploaded yet.</p>
                                        </div>
                                    ) : (
                                        media.map((item) => (
                                            <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                                                {item.media_type === 'image' ? (
                                                    <img src={item.media_url} alt={item.title || ''} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-primary text-white">
                                                        <i className={`fas fa-${item.media_type === 'video' ? 'play-circle' : 'microphone'} text-3xl`}></i>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        onClick={() => deleteMedia(item.id)}
                                                        className="w-10 h-10 rounded-full bg-white text-red-500 hover:scale-110 transition-transform"
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminEvents;
