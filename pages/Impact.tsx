import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IMPACT_STATS } from '../constants';
import { ImpactRecord, EventMedia } from '../services/supabaseClient';
import { apiService } from '../services/apiService';

const Impact: React.FC = () => {
    const [records, setRecords] = useState<ImpactRecord[]>([]);
    const [eventMedia, setEventMedia] = useState<EventMedia[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'videos' | 'pictures' | 'stories'>('all');
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const location = useLocation();
    const mediaVaultRef = useRef<HTMLElement>(null);

    // Scroll to media vault section when navigated with #media-vault hash
    useEffect(() => {
        if (location.hash === '#media-vault' && !loading && mediaVaultRef.current) {
            mediaVaultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [location.hash, loading]);

    const getYouTubeConfig = (url: string) => {
        if (!url) return null;
        // Support regular links, shortened links, embed links, and studio links
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|video\/)([^#\&\?\/]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            const videoId = match[2];
            return {
                id: videoId,
                thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                embed: `https://www.youtube.com/embed/${videoId}?autoplay=1`
            };
        }
        return null;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [impactData, mediaData] = await Promise.all([
                    apiService.fetchImpact(),
                    apiService.fetchAllEventMedia()
                ]);
                setRecords(impactData || []);
                setEventMedia(mediaData || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Combine and category data
    const safeRecords = Array.isArray(records) ? records : [];
    const safeEventMedia = Array.isArray(eventMedia) ? eventMedia : [];

    const allStories = safeRecords.filter(r => r && r.type === 'story');

    // Combine impact media and event media
    const allMedia = [
        ...safeRecords.filter(r => r && r.type !== 'story').map(r => ({ ...r, source: 'impact' })),
        ...safeEventMedia.filter(m => m).map(m => ({ ...m, source: 'event', type: (m as any).media_type }))
    ];

    const filteredContent = () => {
        let content: any[] = [];
        switch (activeTab) {
            case 'videos':
                content = allMedia.filter(m => m.type === 'video');
                break;
            case 'pictures':
                content = allMedia.filter(m => m.type === 'image');
                break;
            case 'stories':
                content = allStories;
                break;
            default:
                content = [...allMedia, ...allStories];
        }
        return content;
    };

    return (
        <div className="pt-20 bg-gray-50 min-h-screen">
            {/* Hero Header */}
            <section className="bg-primary py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-gold font-bold uppercase tracking-widest text-sm mb-4 animate-fade-in">Our Track Record</h1>
                    <h2 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter">Quantifying Transformation</h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
                        Every digit represents a life restored, a child fed, and a future secured. Explore our mission through the eyes of those on the field.
                    </p>
                </div>
            </section>

            {/* Stats Breakdown */}
            <section className="py-20 -mt-10 relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {IMPACT_STATS.map((stat, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 text-center hover:scale-105 transition-all duration-500">
                                <div className="text-gold text-2xl mb-4 opacity-50"><i className={`fas ${idx % 2 === 0 ? 'fa-chart-line' : 'fa-hand-holding-heart'}`}></i></div>
                                <div className="text-5xl font-black text-primary mb-2">
                                    {stat.value.toLocaleString()}{stat.suffix}
                                </div>
                                <div className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Central Media & Stories Vault */}
            <section id="media-vault" ref={mediaVaultRef} className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div className="text-left">
                            <h3 className="text-gold font-bold uppercase tracking-widest text-sm mb-2">The Mission Vault</h3>
                            <h4 className="text-4xl md:text-5xl font-black text-primary tracking-tighter uppercase">Media & Stories</h4>
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex bg-white p-2 rounded-[2rem] shadow-sm border border-gray-100 w-full md:w-auto overflow-x-auto whitespace-nowrap">
                            {(['all', 'videos', 'pictures', 'stories'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-8 py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-primary'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 border-4 border-gold border-t-primary rounded-full animate-spin mx-auto"></div>
                            <p className="mt-6 text-gray-400 font-bold uppercase tracking-widest text-sm">Synchronizing History...</p>
                        </div>
                    ) : filteredContent().length === 0 ? (
                        <div className="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                            <i className="fas fa-box-open text-6xl text-gray-100 mb-6"></i>
                            <p className="text-gray-400 font-bold">This section of the vault is currently empty.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredContent().map((item: any, idx) => (
                                item.type === 'story' ? (
                                    /* Story Card */
                                    <div key={`story-${item.id}-${idx}`} className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col hover:shadow-2xl transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-[3rem] -mr-4 -mt-4 group-hover:bg-gold/10 transition-colors"></div>
                                        <i className="fas fa-quote-left text-3xl text-gold mb-6 opacity-30"></i>
                                        <p className="text-gray-600 text-lg leading-relaxed mb-auto italic font-medium">"{item.content}"</p>
                                        <div className="mt-8 flex items-center gap-4 border-t border-gray-50 pt-6">
                                            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-gold/10">
                                                {(item.title || 'M')[0]}
                                            </div>
                                            <div>
                                                <div className="font-black text-primary uppercase tracking-tighter text-sm">{item.title || 'Anonymous'}</div>
                                                <div className="text-gold text-[10px] font-bold uppercase tracking-widest">{item.category || 'Mission'}</div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Media Card (Image/Video) */
                                    <div key={`media-${item.id}-${idx}`} className="group relative rounded-[3rem] overflow-hidden shadow-sm aspect-video bg-white border border-gray-100 hover:shadow-2xl transition-all duration-700">
                                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>

                                        {item.type === 'video' ? (
                                            <div
                                                className="w-full h-full relative cursor-pointer"
                                                onClick={() => {
                                                    const yt = getYouTubeConfig(item.media_url);
                                                    if (yt) setSelectedVideo(yt.embed);
                                                    else window.open(item.media_url, '_blank');
                                                }}
                                            >
                                                <div className="w-full h-full bg-primary flex items-center justify-center relative overflow-hidden">
                                                    {getYouTubeConfig(item.media_url) ? (
                                                        <img
                                                            src={getYouTubeConfig(item.media_url)?.thumbnail}
                                                            className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                                                            alt={item.title}
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c';
                                                            }}
                                                        />
                                                    ) : null}
                                                    <i className="fas fa-play-circle text-6xl text-gold/90 group-hover:scale-125 transition-transform duration-500 z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></i>
                                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.4),transparent)] z-10"></div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full relative">
                                                <img src={item.media_url || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.title || 'Media'} />
                                            </div>
                                        )}

                                        {/* Caption Overlay */}
                                        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-500 z-20">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-white font-black text-sm uppercase tracking-tight">{item.title || 'Mission Moment'}</p>
                                                    <p className="text-gold text-[10px] font-bold uppercase tracking-widest opacity-80 mt-1">
                                                        {item.source === 'event' ? 'Program Event' : item.category || 'Mission Progress'}
                                                    </p>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                                                    <i className={`fas ${item.type === 'video' ? 'fa-video' : 'fa-camera-retro'} text-xs`}></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Video Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 bg-primary/95 backdrop-blur-xl z-[200] flex items-center justify-center p-4 md:p-12 animate-fade-in">
                    <button
                        onClick={() => setSelectedVideo(null)}
                        className="absolute top-8 right-8 text-white text-3xl hover:text-gold transition-colors"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                    <div className="w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black">
                        <iframe
                            src={selectedVideo}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            {/* Sustainability Section */}
            <section className="py-24 bg-white rounded-t-[5rem] shadow-2xl">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="bg-primary p-12 md:p-20 rounded-[4rem] text-white shadow-2xl relative overflow-hidden border border-white/5">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-gold opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <h3 className="text-3xl md:text-4xl font-black mb-12 tracking-tighter uppercase italic">Integrity of Every Dollar</h3>
                        <div className="space-y-10">
                            <div>
                                <div className="flex justify-between text-[11px] mb-3 font-black uppercase tracking-widest">
                                    <span>Field Programs & Direct Aid</span>
                                    <span className="text-gold">85%</span>
                                </div>
                                <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden p-1 border border-white/5">
                                    <div className="h-full bg-gold rounded-full w-[85%] transition-all duration-1000 delay-300"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[11px] mb-3 font-black uppercase tracking-widest">
                                    <span>Community Outreach & Mentorship</span>
                                    <span className="text-gold">10%</span>
                                </div>
                                <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden p-1 border border-white/5">
                                    <div className="h-full bg-gold rounded-full w-[10%] transition-all duration-1000 delay-500"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[11px] mb-3 font-black uppercase tracking-widest">
                                    <span>Administration & Operations</span>
                                    <span className="text-gold">5%</span>
                                </div>
                                <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden p-1 border border-white/5">
                                    <div className="h-full bg-gold rounded-full w-[5%] transition-all duration-1000 delay-700"></div>
                                </div>
                            </div>
                        </div>
                        <p className="mt-16 text-gray-400 text-xs font-medium max-w-2xl mx-auto leading-relaxed italic">
                            "We maintain extremely low overhead because our passion drives us. Your contribution goes exactly where it's needed most: to the soul in need."
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Impact;
